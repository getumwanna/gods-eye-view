import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateLibrary,
  ADMITTED_DOCUMENTS,
  createMetadataProjection,
  serializeMetadataProjection,
} from '../../../build/libraryValidation.js';
import { REGISTERED_LAYER_IDS } from '../../data/layerState.js';
import { KEY_SETUP_KEYS } from '../../keySetupCore.mjs';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const sourcesPath = 'content/sources.json';
const projectionPath = 'src/custom/shared/sourceRegistry.generated.js';
async function fixture(t) {
  const temporary = await mkdtemp(
    path.join(os.tmpdir(), 'gev-library-registry-'),
  );
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const registry = JSON.parse(
    await readFile(path.join(root, sourcesPath), 'utf8'),
  );
  const manifest = JSON.parse(
    await readFile(path.join(root, 'content/library.json'), 'utf8'),
  );
  const files = new Set([
    sourcesPath,
    'content/sources.schema.json',
    'content/library.json',
    'content/library.schema.json',
    ...ADMITTED_DOCUMENTS.map((doc) => doc.path),
    ...manifest.items.map((item) => item.contentPath).filter(Boolean),
    ...registry.sources.flatMap((source) =>
      source.products.flatMap((product) =>
        product.evidence.map((evidence) => evidence.path),
      ),
    ),
  ]);
  for (const file of files) {
    await mkdir(path.dirname(path.join(temporary, file)), { recursive: true });
    await copyFile(path.join(root, file), path.join(temporary, file));
  }
  await mkdir(path.join(temporary, 'src/custom/shared'), { recursive: true });
  return {
    root: temporary,
    registry,
    save: () =>
      writeFile(path.join(temporary, sourcesPath), JSON.stringify(registry)),
  };
}
function assertSafeFailure(result, code) {
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some((error) => error.code === code),
    JSON.stringify(result.errors),
  );
  assert.equal('registry' in result, false);
  assert.equal(
    JSON.stringify(result).includes('TEST_SECRET_DO_NOT_ECHO'),
    false,
  );
  for (const error of result.errors) {
    assert.deepEqual(Object.keys(error).sort(), ['code', 'fileId', 'message']);
    assert.equal(path.isAbsolute(error.fileId), false);
  }
}

test('authoritative registry covers existing layer/setup/guide identities without acquisition', async (t) => {
  const f = await fixture(t);
  const fetchBefore = globalThis.fetch;
  let acquisitions = 0;
  globalThis.fetch = async () => {
    acquisitions++;
    throw new Error('No network is permitted in Library validation');
  };
  t.after(() => {
    globalThis.fetch = fetchBefore;
  });
  const result = await validateLibrary({
    root: f.root,
    checkProjection: false,
  });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(acquisitions, 0);
  assert.deepEqual(
    result.projection.layers.map((layer) => layer.id).sort(),
    [...REGISTERED_LAYER_IDS, 'local-adsb'].sort(),
  );
  assert.equal(result.stats.guides, 38);
  assert.equal(result.stats.layers, 32);
  assert.equal(result.stats.sections, 25);
  assert.equal(result.stats.documents, 7);
  assert.deepEqual(
    result.registry.capabilities
      .filter((capability) => capability.setupKeyId !== null)
      .map((capability) => capability.setupKeyId)
      .sort(),
    KEY_SETUP_KEYS.map((key) => key.id).sort(),
  );
  assert.ok(
    result.projection.layers
      .find((layer) => layer.id === 'traffic')
      .valueKinds.every((value) => value.kind === 'Simulated'),
  );
  assert.ok(
    result.projection.layers
      .find((layer) => layer.id === 'satellites')
      .valueKinds.every((value) => value.kind === 'Estimated'),
  );
});

test('generated projection is deterministic and checks reject stale/missing output without rewriting', async (t) => {
  const f = await fixture(t);
  assertSafeFailure(
    await validateLibrary({ root: f.root }),
    'STALE_PROJECTION',
  );
  const written = await validateLibrary({
    root: f.root,
    writeProjection: true,
  });
  assert.equal(written.ok, true, JSON.stringify(written.errors));
  const outputPath = path.join(f.root, projectionPath);
  const first = await readFile(outputPath, 'utf8');
  assert.equal(
    first,
    serializeMetadataProjection(
      createMetadataProjection(
        written.registry,
        written.projection.inputDigest,
      ),
    ),
  );
  assert.equal((await validateLibrary({ root: f.root })).ok, true);
  await validateLibrary({ root: f.root, writeProjection: true });
  assert.equal(await readFile(outputPath, 'utf8'), first);
  f.registry.guideGroups[0].explanation += ' Reviewed documentation change.';
  await f.save();
  assertSafeFailure(
    await validateLibrary({ root: f.root }),
    'STALE_PROJECTION',
  );
  assert.equal(await readFile(outputPath, 'utf8'), first);
});

test('registry rejects dangling/duplicate identities, unknown layers and setup mismatches', async (t) => {
  const cases = [
    [
      'dangling product',
      (f) => {
        f.registry.bindings[0].sourceProductRefs = ['missing/product'];
      },
      'UNKNOWN_REFERENCE',
    ],
    [
      'duplicate source',
      (f) => {
        f.registry.sources.push({
          ...f.registry.sources[0],
          name: 'Duplicate source identity',
        });
      },
      'DUPLICATE_ID',
    ],
    [
      'duplicate value',
      (f) => {
        f.registry.bindings.push({
          ...f.registry.bindings[0],
          label: 'Duplicate value identity',
        });
      },
      'DUPLICATE_ID',
    ],
    [
      'missing layer',
      (f) => {
        f.registry.bindings = f.registry.bindings.filter(
          (binding) => binding.layerId !== 'flights',
        );
      },
      'IDENTITY_MISMATCH',
    ],
    [
      'unknown layer',
      (f) => {
        f.registry.bindings[0].layerId = 'unreviewed-layer';
      },
      'UNKNOWN_REFERENCE',
    ],
    [
      'setup environment drift',
      (f) => {
        f.registry.capabilities[0].environmentNames = ['UNREVIEWED_KEY'];
      },
      'IDENTITY_MISMATCH',
    ],
    [
      'guide alias collision',
      (f) => {
        f.registry.guideGroups[1].id = f.registry.guideGroups[0].id;
      },
      'DUPLICATE_ID',
    ],
    [
      'conditional Ontario credential cannot become a whole-layer requirement',
      (f) => {
        f.registry.bindings.find(
          (binding) => binding.layerId === 'cctv',
        ).requiredKeyId = 'google-maps';
      },
      'IDENTITY_MISMATCH',
    ],
    [
      'hidden setup identity remains hidden',
      (f) => {
        f.registry.capabilities.find(
          (capability) => capability.setupKeyId === 'google-maps-server',
        ).visibility = 'visible';
      },
      'IDENTITY_MISMATCH',
    ],
    [
      'unknown observation kind',
      (f) => {
        f.registry.bindings[0].kind = 'Almost-live';
      },
      'SCHEMA_MISMATCH',
    ],
  ];
  for (const [name, mutate, code] of cases)
    await t.test(name, async (child) => {
      const f = await fixture(child);
      mutate(f);
      await f.save();
      assertSafeFailure(
        await validateLibrary({ root: f.root, checkProjection: false }),
        code,
      );
    });
});

test('authored credentials/runtime state and unsafe URLs fail with normalized errors', async (t) => {
  const cases = [
    [
      'credential field',
      (f) => {
        f.registry.apiKey = 'TEST_SECRET_DO_NOT_ECHO';
      },
      'SCHEMA_MISMATCH',
    ],
    [
      'runtime health',
      (f) => {
        f.registry.sources[0].products[0].health = 'healthy';
      },
      'SCHEMA_MISMATCH',
    ],
    [
      'credential query',
      (f) => {
        f.registry.sources[0].homepage =
          'https://example.com/?api_key=TEST_SECRET_DO_NOT_ECHO';
      },
      'UNSAFE_URL',
    ],
    [
      'URL credentials',
      (f) => {
        f.registry.sources[0].homepage =
          'https://TEST_SECRET_DO_NOT_ECHO:password@example.com/';
      },
      'UNSAFE_URL',
    ],
    [
      'executable URL',
      (f) => {
        f.registry.sources[0].homepage = 'javascript:TEST_SECRET_DO_NOT_ECHO';
      },
      'SCHEMA_MISMATCH',
    ],
    [
      'pin drift',
      (f) => {
        f.registry.upstreamRevision = 'a'.repeat(40);
      },
      'PIN_MISMATCH',
    ],
    [
      'missing evidence heading',
      (f) => {
        f.registry.sources[0].products[0].evidence[0].section =
          'TEST_SECRET_DO_NOT_ECHO';
      },
      'EVIDENCE_MISMATCH',
    ],
  ];
  for (const [name, mutate, code] of cases)
    await t.test(name, async (child) => {
      const f = await fixture(child);
      mutate(f);
      await f.save();
      assertSafeFailure(
        await validateLibrary({ root: f.root, checkProjection: false }),
        code,
      );
    });
});
