import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import {
  applyCustomProviderPolicy,
  checkProviderPolicyContracts,
  FROZEN_PROVIDER_POLICY,
  REVIEWED_PROVIDER_CONTRACTS,
} from '../../../build/customProviderPolicy.js';
import {
  checkProviderPolicyWiring,
  PROVIDER_POLICY_SCENARIOS,
  runProviderPolicyChecks,
} from '../../../scripts/check-custom-provider-policy.mjs';

const projectRoot = fileURLToPath(new URL('../../../', import.meta.url));

async function contractFixture(t) {
  const fixture = await mkdtemp(
    path.join(os.tmpdir(), 'gev-provider-contract-'),
  );
  t.after(() => rm(fixture, { recursive: true, force: true }));
  for (const contract of REVIEWED_PROVIDER_CONTRACTS) {
    const destination = path.join(fixture, contract.path);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(
      destination,
      await readFile(path.join(projectRoot, contract.path)),
    );
  }
  return fixture;
}

test('the reviewed upstream provider and dotenv contracts still match', () => {
  assert.equal(checkProviderPolicyContracts(), true);
  assert.equal(REVIEWED_PROVIDER_CONTRACTS.length, 2);
  assert.deepEqual(
    REVIEWED_PROVIDER_CONTRACTS.map((contract) => contract.path).sort(),
    ['server/providers/cctv/catalog.js', 'server/standalone/vite.config.js'],
  );
});

test('policy overrides inherited enabling flags without touching unrelated configuration', () => {
  const environment = {
    CCTV_HK_ENABLED: '1',
    CCTV_TAIWAN_ENABLED: '1',
    UNRELATED_FIXTURE: 'preserve',
  };
  const policy = applyCustomProviderPolicy({ environment, announce: false });
  assert.deepEqual(policy, { CCTV_HK_ENABLED: '0', CCTV_TAIWAN_ENABLED: '0' });
  assert.deepEqual(environment, { ...policy, UNRELATED_FIXTURE: 'preserve' });
  assert.equal(Object.isFrozen(FROZEN_PROVIDER_POLICY), true);
});

test('each upstream contract drift fails closed before any policy mutation', async (t) => {
  for (const contract of REVIEWED_PROVIDER_CONTRACTS) {
    const fixture = await contractFixture(t);
    const destination = path.join(fixture, contract.path);
    await writeFile(
      destination,
      `${await readFile(destination, 'utf8')}\n// synthetic upstream drift\n`,
    );
    const environment = { CCTV_HK_ENABLED: '1', CCTV_TAIWAN_ENABLED: '1' };
    assert.throws(
      () =>
        applyCustomProviderPolicy({
          projectRoot: fixture,
          environment,
          announce: false,
        }),
      {
        code: 'CUSTOM_PROVIDER_POLICY_CONTRACT_CHANGED',
      },
    );
    assert.deepEqual(environment, {
      CCTV_HK_ENABLED: '1',
      CCTV_TAIWAN_ENABLED: '1',
    });
  }
});

test('missing upstream contract also fails closed', async (t) => {
  const fixture = await contractFixture(t);
  await rm(path.join(fixture, REVIEWED_PROVIDER_CONTRACTS[0].path));
  assert.throws(() => checkProviderPolicyContracts(fixture), {
    code: 'CUSTOM_PROVIDER_POLICY_CONTRACT_CHANGED',
  });
});

test('root wrapper applies policy before the reviewed standalone provider factory', async () => {
  assert.equal(await checkProviderPolicyWiring(), true);
});

test('fresh processes keep both packs off across inherited flags, hostile dotenv, and restart', async () => {
  const results = await runProviderPolicyChecks();
  assert.equal(results.length, PROVIDER_POLICY_SCENARIOS.length);
  assert.equal(
    new Set(results.map((result) => result.pid)).size,
    results.length,
  );
  for (const result of results) {
    assert.notEqual(result.pid, process.pid);
    assert.equal(result.hkRequests, 0);
    assert.equal(result.taiwanRequests, 0);
    assert.equal(result.hkRows, 0);
    assert.equal(result.taiwanRows, 0);
    assert.equal(result.austinRows, 1);
  }
});
