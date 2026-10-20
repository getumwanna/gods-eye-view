import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const scriptPath = fileURLToPath(import.meta.url);
const SWITCHES = ['CCTV_HK_ENABLED', 'CCTV_TAIWAN_ENABLED'];

export const PROVIDER_POLICY_SCENARIOS = Object.freeze([
  { name: 'unset', inherited: undefined, dotenv: false },
  { name: 'explicit-zero', inherited: '0', dotenv: false },
  { name: 'inherited-one', inherited: '1', dotenv: false },
  { name: 'dotenv-one', inherited: undefined, dotenv: true },
  { name: 'inherited-and-dotenv-one', inherited: '1', dotenv: true },
  { name: 'dotenv-one-after-restart', inherited: undefined, dotenv: true },
]);

/** Verify the real wrapper enforces policy before invoking the provider factory. */
export async function checkProviderPolicyWiring(root = projectRoot) {
  const [wrapper, hub] = await Promise.all([
    readFile(path.join(root, 'vite.config.js'), 'utf8'),
    readFile(path.join(root, 'build/customHub.js'), 'utf8'),
  ]);
  assert.match(
    wrapper,
    /import\s+\{\s*withHubConfig\s*\}\s+from\s+['"]\.\/build\/customHub\.js['"]/,
  );
  assert.match(
    wrapper,
    /export\s+default\s+\(env\)\s*=>\s*withHubConfig\(standaloneConfig\(env\)\)/,
  );
  assert.match(
    hub,
    /import\s+\{\s*applyCustomProviderPolicy\s*\}\s+from\s+['"]\.\/customProviderPolicy\.js['"]/,
  );
  const policyCall = hub.indexOf('applyCustomProviderPolicy();');
  const factory = hub.indexOf('export function withHubConfig(');
  assert.ok(
    policyCall >= 0 && policyCall < factory,
    'policy must run during module evaluation, before the standalone factory',
  );
  assert.match(
    hub.slice(factory),
    /applyCustomProviderPolicy\(\);/,
    'hub config must reassert the reviewed policy',
  );
  return true;
}

/** Run independent offline process checks; no checkout dotenv or live camera is read. */
export async function runProviderPolicyChecks() {
  await checkProviderPolicyWiring();
  const fixtureRoot = await mkdtemp(
    path.join(os.tmpdir(), 'gev-provider-policy-'),
  );
  const results = [];
  try {
    for (const scenario of PROVIDER_POLICY_SCENARIOS) {
      const fixture = path.join(fixtureRoot, scenario.name);
      await mkdir(fixture);
      await writeFile(path.join(fixture, 'sources.json'), '[]\n');
      if (scenario.dotenv) {
        for (const name of [
          '.env',
          '.env.local',
          '.env.development',
          '.env.development.local',
        ]) {
          await writeFile(
            path.join(fixture, name),
            'CCTV_HK_ENABLED=1\nCCTV_TAIWAN_ENABLED=1\n',
          );
        }
      }
      // Deliberately do not inherit provider keys, source overrides, or dotenv paths.
      const environment = { PATH: path.dirname(process.execPath) };
      if (scenario.inherited !== undefined) {
        for (const name of SWITCHES) environment[name] = scenario.inherited;
      }
      const child = spawnSync(
        process.execPath,
        [scriptPath, '--offline-scenario', scenario.name, fixture],
        {
          cwd: fixture,
          env: environment,
          encoding: 'utf8',
          timeout: 30_000,
          maxBuffer: 64 * 1024,
        },
      );
      assert.equal(
        child.error,
        undefined,
        `scenario ${scenario.name} could not complete`,
      );
      assert.equal(
        child.status,
        0,
        `scenario ${scenario.name} failed: ${child.stderr.trim()}`,
      );
      const result = JSON.parse(child.stdout.trim());
      assert.equal(result.passed, true);
      assert.equal(result.scenario, scenario.name);
      results.push(result);
    }
    return results;
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
}

async function runOfflineScenario(name, fixture) {
  const scenario = PROVIDER_POLICY_SCENARIOS.find(
    (candidate) => candidate.name === name,
  );
  assert.ok(scenario, 'unknown policy scenario');
  const { loadEnv } = await import('vite');
  if (scenario.dotenv) {
    const loaded = loadEnv('development', fixture, '');
    for (const key of SWITCHES)
      assert.equal(
        loaded[key],
        '1',
        'temporary hostile dotenv fixture must be active',
      );
    for (const [key, value] of Object.entries(loaded)) {
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }

  const requested = [];
  // All upstream HTTP is intercepted before importing or constructing a provider.
  globalThis.fetch = async (input) => {
    const href = String(input instanceof Request ? input.url : input);
    requested.push(href);
    if (href.includes('data.austintexas.gov')) {
      return Response.json({
        meta: {
          view: {
            columns: [
              'camera_id',
              'camera_status',
              'latitude',
              'longitude',
              'camera_name',
            ].map((fieldName) => ({ fieldName })),
          },
        },
        data: [
          [
            '990001',
            'TURNED_ON',
            '30.2672',
            '-97.7431',
            'Synthetic policy positive control',
          ],
        ],
      });
    }
    if (href.includes('Traffic_Camera_Locations_En.xml')) {
      return new Response(
        '<image-list><image><key>BC101F</key><description>Synthetic policy negative control</description><latitude>22.508</latitude><longitude>114.078</longitude><url>https://tdcctv.data.one.gov.hk/BC101F.JPG</url></image></image-list>',
        { headers: { 'content-type': 'application/xml' } },
      );
    }
    if (href.includes('freeway.gov.tw')) {
      return new Response(
        '<CCTVList><CCTVs><CCTV><CCTVID>CCTV-N1-S-0.000-M</CCTVID><VideoStreamURL>https://cctvn.freeway.gov.tw/abs2mjpg/bmjpg?camera=10000</VideoStreamURL><PositionLon>121.735695</PositionLon><PositionLat>25.1229931</PositionLat><RoadName>Synthetic policy negative control</RoadName></CCTV></CCTVs></CCTVList>',
        { headers: { 'content-type': 'application/xml' } },
      );
    }
    return Response.json([]);
  };
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};

  // Import the actual shipping entry, but never invoke its factory: that factory
  // reads this checkout's real dotenv files. Its exact reviewed contract is hashed.
  await import(pathToFileURL(path.join(projectRoot, 'vite.config.js')).href);
  for (const key of SWITCHES)
    assert.equal(
      process.env[key],
      '0',
      'root module must enforce policy before its config factory',
    );
  // Exercise Vite's real dotenv precedence against temporary files only, using
  // the same undefined-only merge as the reviewed standalone factory.
  const loadedAfterPolicy = loadEnv('development', fixture, '');
  for (const [key, value] of Object.entries(loadedAfterPolicy)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
  for (const key of SWITCHES)
    assert.equal(
      process.env[key],
      '0',
      'dotenv reload must not enable a restricted pack',
    );

  const catalogSource = await readFile(
    path.join(projectRoot, 'server/providers/cctv/catalog.js'),
    'utf8',
  );
  for (const [, key] of catalogSource.matchAll(
    /['"](CCTV_[A-Z0-9_]+_ENABLED)['"]/g,
  )) {
    if (!SWITCHES.includes(key)) process.env[key] = '0';
  }
  process.env.CCTV_SOURCES_FILE = path.join(fixture, 'sources.json');
  process.env.CCTV_PREFER_AUSTIN = '1';
  process.env.CCTV_FORCE_AUSTIN = '1';
  const { createCctvCatalog } = await import(
    pathToFileURL(path.join(projectRoot, 'server/providers/cctv/catalog.js'))
      .href
  );
  const sources = await createCctvCatalog({ sourceRoot: fixture })();
  const hkRequests = requested.filter((href) =>
    /\.gov\.hk(?:\/|$)/.test(href),
  ).length;
  const taiwanRequests = requested.filter((href) =>
    href.includes('freeway.gov.tw'),
  ).length;
  const hkRows = sources.filter(
    (source) => source.cityId === 'hk' || source.id.startsWith('hk-'),
  ).length;
  const taiwanRows = sources.filter(
    (source) =>
      source.cityId === 'taiwan' || source.id.startsWith('tw-freeway-'),
  ).length;
  const austinRows = sources.filter(
    (source) =>
      source.id === '990001' &&
      source.cityId === 'austin' &&
      source.pack === 'austin',
  ).length;
  assert.equal(
    hkRequests,
    0,
    'Hong Kong catalog must receive zero HTTP requests',
  );
  assert.equal(
    taiwanRequests,
    0,
    'Taiwan catalog must receive zero HTTP requests',
  );
  assert.equal(hkRows, 0, 'Hong Kong catalog must serve zero rows');
  assert.equal(taiwanRows, 0, 'Taiwan catalog must serve zero rows');
  assert.equal(
    austinRows,
    1,
    'Austin positive control proves the catalog actually acquired and served fixture data',
  );
  process.stdout.write(
    `${JSON.stringify({ scenario: name, passed: true, pid: process.pid, hkRequests, taiwanRequests, hkRows, taiwanRows, austinRows })}\n`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    if (process.argv[2] === '--offline-scenario') {
      await runOfflineScenario(process.argv[3], process.argv[4]);
    } else {
      const results = await runProviderPolicyChecks();
      for (const result of results)
        console.log(
          `[PASS] ${result.scenario}: Hong Kong/Taiwan requests=0 rows=0; Austin fixture served`,
        );
      console.log(
        `Provider policy: ${results.length}/${results.length} offline process checks passed; no live cameras or credential files accessed.`,
      );
    }
  } catch (error) {
    console.error(`[FAIL] Provider policy: ${error.message}`);
    process.exitCode = 1;
  }
}
