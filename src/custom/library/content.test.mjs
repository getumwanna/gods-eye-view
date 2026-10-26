import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGlobeLink } from '../shared/shareHandoff.js';
import { viewFromParams } from '../../view/index.js';
import { decodeLayerStateParams } from '../../data/layerState.js';
import {
  validateLibrary,
  ADMITTED_DOCUMENTS,
  isSafeLibraryUrl,
} from '../../../build/libraryValidation.js';

const root = fileURLToPath(new URL('../../../', import.meta.url));
async function fixture(t) {
  const temporary = await mkdtemp(
    path.join(os.tmpdir(), 'gev-library-content-'),
  );
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const registry = JSON.parse(
    await readFile(path.join(root, 'content/sources.json'), 'utf8'),
  );
  const manifest = JSON.parse(
    await readFile(path.join(root, 'content/library.json'), 'utf8'),
  );
  const files = new Set([
    'content/sources.json',
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
    manifest,
    saveRegistry: () =>
      writeFile(
        path.join(temporary, 'content/sources.json'),
        JSON.stringify(registry),
      ),
    saveManifest: () =>
      writeFile(
        path.join(temporary, 'content/library.json'),
        JSON.stringify(manifest),
      ),
  };
}
function rejected(result, code) {
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some((error) => error.code === code),
    JSON.stringify(result.errors),
  );
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes('TEST_SECRET_DO_NOT_ECHO'), false);
  assert.equal(serialized.includes(os.tmpdir()), false);
  assert.ok(result.errors.length <= 40);
}

test('malformed JSON, invalid definitions, absent inputs and size limits stay explicit and sanitized', async (t) => {
  const cases = [
    [
      'malformed registry',
      async (f) =>
        writeFile(
          path.join(f.root, 'content/sources.json'),
          '{"TEST_SECRET_DO_NOT_ECHO":',
        ),
      'INVALID_JSON',
    ],
    [
      'malformed schema',
      async (f) =>
        writeFile(
          path.join(f.root, 'content/library.schema.json'),
          'TEST_SECRET_DO_NOT_ECHO',
        ),
      'INVALID_JSON',
    ],
    [
      'invalid schema definition',
      async (f) =>
        writeFile(
          path.join(f.root, 'content/sources.schema.json'),
          JSON.stringify({ type: 'TEST_SECRET_DO_NOT_ECHO' }),
        ),
      'INVALID_SCHEMA',
    ],
    [
      'unknown schema keyword',
      async (f) =>
        writeFile(
          path.join(f.root, 'content/sources.schema.json'),
          JSON.stringify({ type: 'object', TEST_SECRET_DO_NOT_ECHO: true }),
        ),
      'INVALID_SCHEMA',
    ],
    [
      'missing registry',
      async (f) => rm(path.join(f.root, 'content/sources.json')),
      'FILE_UNAVAILABLE',
    ],
    [
      'missing schema',
      async (f) => rm(path.join(f.root, 'content/library.schema.json')),
      'FILE_UNAVAILABLE',
    ],
    [
      'oversized input',
      async (f) =>
        writeFile(
          path.join(f.root, 'content/library.json'),
          ' '.repeat(2 * 1024 * 1024 + 1),
        ),
      'FILE_LIMIT',
    ],
  ];
  for (const [name, mutate, code] of cases)
    await t.test(name, async (child) => {
      const f = await fixture(child);
      await mutate(f);
      rejected(
        await validateLibrary({ root: f.root, checkProjection: false }),
        code,
      );
    });
});

test('all seven document admissions and their exact heading bytes are mandatory', async (t) => {
  const cases = [
    [
      'unreviewed document',
      async (f) => {
        f.manifest.upstreamDocuments[0].path = 'TEST_SECRET_DO_NOT_ECHO.md';
        await f.saveManifest();
      },
      'ADMISSION_MISMATCH',
    ],
    [
      'removed admission',
      async (f) => {
        f.manifest.upstreamDocuments.pop();
        await f.saveManifest();
      },
      'ADMISSION_MISMATCH',
    ],
    [
      'changed admitted hash',
      async (f) => {
        f.manifest.upstreamDocuments[0].sha256 = 'a'.repeat(64);
        await f.saveManifest();
      },
      'ADMISSION_MISMATCH',
    ],
    [
      'changed selected heading',
      async (f) => {
        f.manifest.upstreamDocuments[0].sections[0].startHeading =
          '## TEST_SECRET_DO_NOT_ECHO';
        await f.saveManifest();
      },
      'ADMISSION_MISMATCH',
    ],
    [
      'removed selected section',
      async (f) => {
        f.manifest.upstreamDocuments[0].sections.pop();
        await f.saveManifest();
      },
      'ADMISSION_MISMATCH',
    ],
    [
      'missing local document',
      async (f) => rm(path.join(f.root, 'README.md')),
      'FILE_UNAVAILABLE',
    ],
    [
      'changed local document',
      async (f) =>
        writeFile(
          path.join(f.root, 'README.md'),
          '## TEST_SECRET_DO_NOT_ECHO\n',
        ),
      'HASH_MISMATCH',
    ],
  ];
  for (const [name, mutate, code] of cases)
    await t.test(name, async (child) => {
      const f = await fixture(child);
      await mutate(f);
      rejected(
        await validateLibrary({ root: f.root, checkProjection: false }),
        code,
      );
    });
});

test('local evidence rejects traversal, absolute paths and symbolic links including in-repository links', async (t) => {
  const cases = [
    [
      'traversal',
      async (f) => {
        f.registry.sources[0].products[0].evidence[0].path =
          '../TEST_SECRET_DO_NOT_ECHO';
        await f.saveRegistry();
      },
      'SCHEMA_MISMATCH',
    ],
    [
      'absolute path',
      async (f) => {
        f.registry.sources[0].products[0].evidence[0].path =
          '/tmp/TEST_SECRET_DO_NOT_ECHO';
        await f.saveRegistry();
      },
      'SCHEMA_MISMATCH',
    ],
    [
      'encoded traversal',
      async (f) => {
        f.registry.sources[0].products[0].evidence[0].path =
          'src/%2e%2e/TEST_SECRET_DO_NOT_ECHO';
        await f.saveRegistry();
      },
      'SCHEMA_MISMATCH',
    ],
    [
      'symlink document',
      async (f) => {
        const original = await readFile(path.join(f.root, 'README.md'));
        await writeFile(path.join(f.root, 'README-copy.md'), original);
        await rm(path.join(f.root, 'README.md'));
        await symlink('README-copy.md', path.join(f.root, 'README.md'));
      },
      'SYMLINK_REJECTED',
    ],
    [
      'symlink JSON directory',
      async (f) => {
        await mkdir(path.join(f.root, 'other-content'));
        await copyFile(
          path.join(f.root, 'content/sources.json'),
          path.join(f.root, 'other-content/sources.json'),
        );
        await rm(path.join(f.root, 'content'), { recursive: true });
        await symlink('other-content', path.join(f.root, 'content'));
      },
      'SYMLINK_REJECTED',
    ],
  ];
  for (const [name, mutate, code] of cases)
    await t.test(name, async (child) => {
      const f = await fixture(child);
      await mutate(f);
      rejected(
        await validateLibrary({ root: f.root, checkProjection: false }),
        code,
      );
    });
});

test('failed edits never replace the last validated globe metadata; restoring input recovers', async (t) => {
  const f = await fixture(t);
  const first = await validateLibrary({ root: f.root, writeProjection: true });
  assert.equal(first.ok, true, JSON.stringify(first.errors));
  const generated = path.join(
    f.root,
    'src/custom/shared/sourceRegistry.generated.js',
  );
  const stable = await readFile(generated, 'utf8');
  const inputPath = path.join(f.root, 'content/sources.json');
  const original = await readFile(inputPath, 'utf8');
  await writeFile(inputPath, '{"TEST_SECRET_DO_NOT_ECHO":');
  rejected(
    await validateLibrary({ root: f.root, writeProjection: true }),
    'INVALID_JSON',
  );
  assert.equal(await readFile(generated, 'utf8'), stable);
  await rm(inputPath);
  rejected(
    await validateLibrary({ root: f.root, writeProjection: true }),
    'FILE_UNAVAILABLE',
  );
  assert.equal(await readFile(generated, 'utf8'), stable);
  await writeFile(inputPath, original);
  assert.equal((await validateLibrary({ root: f.root })).ok, true);
});

test('Library URL policy allows reviewed HTTPS/local guide links and rejects active or credential links', () => {
  for (const url of [
    'https://example.org/docs#coverage',
    '/?setup=1',
    '/hub/#/library/sources/cctv',
  ])
    assert.equal(isSafeLibraryUrl(url, { allowLocal: true }), true, url);
  for (const url of [
    'javascript:alert(1)',
    'data:text/html,hello',
    '//example.org/path',
    'https://u:p@example.org/',
    'https://example.org/?token=secret',
    'https://example.org/?access_token=secret',
    'https://example.org/?api_key=secret',
    '/etc/passwd',
    '/../secret',
    'https://example.org/\nscript',
  ])
    assert.equal(isSafeLibraryUrl(url, { allowLocal: true }), false, url);
});

test('manifest items require existing original files, exact hashes and resolved source/doc references', async (t) => {
  async function addOriginal(f) {
    const text =
      '# Test-only original fixture\n\nThis bounded fixture is never application content.\n';
    const contentPath = 'content/knowledge/project-background.md';
    f.manifest.items = f.manifest.items.filter(
      (item) => item.contentPath !== contentPath,
    );
    await mkdir(path.join(f.root, 'content/knowledge'), { recursive: true });
    await writeFile(path.join(f.root, contentPath), text);
    const item = {
      id: 'test-only-original',
      slug: 'test-only-original',
      kind: 'original-article',
      category: 'Test fixture',
      title: 'Test-only original',
      tags: ['test-only'],
      description: 'A test fixture, never displayed by the application.',
      author: 'Test fixture',
      publishedDate: '2026-10-20',
      reviewedDate: '2026-10-20',
      contentPath,
      upstreamDocumentId: null,
      sectionIds: [],
      upstreamRevision: null,
      inputSha256: createHash('sha256').update(text).digest('hex'),
      references: [
        {
          title: 'Pinned local source',
          url: f.manifest.upstreamDocuments[0].sourceUrl,
          reviewedDate: '2026-10-20',
        },
      ],
      sourceProductRefs: [
        `${f.registry.sources[0].id}/${f.registry.sources[0].products[0].id}`,
      ],
      licenseNotice: 'Original test-fixture text.',
      adaptationNotice: 'No external article body is copied.',
      status: 'published',
      caseDetails: null,
    };
    f.manifest.items.push(item);
    await f.saveManifest();
    return item;
  }
  await t.test(
    'complete local item passes with zero acquisition',
    async (child) => {
      const f = await fixture(child);
      await addOriginal(f);
      const result = await validateLibrary({
        root: f.root,
        checkProjection: false,
      });
      assert.equal(result.ok, true, JSON.stringify(result.errors));
      assert.equal(result.stats.items, f.manifest.items.length);
    },
  );
  const cases = [
    [
      'missing original file',
      async (f, item) => rm(path.join(f.root, item.contentPath)),
      'FILE_UNAVAILABLE',
    ],
    [
      'changed original hash',
      async (f, item) => {
        item.inputSha256 = 'a'.repeat(64);
      },
      'CONTENT_MISMATCH',
    ],
    [
      'unreviewed content path',
      async (f, item) => {
        item.contentPath = 'content/knowledge/unreviewed-file.md';
      },
      'UNSAFE_PATH',
    ],
    [
      'dangling product',
      async (f, item) => {
        item.sourceProductRefs = ['unknown/product'];
      },
      'UNKNOWN_REFERENCE',
    ],
    [
      'inconsistent original provenance',
      async (f, item) => {
        item.upstreamDocumentId = f.manifest.upstreamDocuments[0].id;
      },
      'CONTENT_MISMATCH',
    ],
    [
      'unreviewed external summary source',
      async (f, item) => {
        item.kind = 'external-summary';
      },
      'CONTENT_MISMATCH',
    ],
    [
      'unsafe citation',
      async (f, item) => {
        item.references[0].url =
          'https://example.org/?secret=TEST_SECRET_DO_NOT_ECHO';
      },
      'UNSAFE_URL',
    ],
  ];
  for (const [name, mutate, code] of cases)
    await t.test(name, async (child) => {
      const f = await fixture(child);
      const item = await addOriginal(f);
      await mutate(f, item);
      await f.saveManifest();
      rejected(
        await validateLibrary({ root: f.root, checkProjection: false }),
        code,
      );
    });
});

test('published upstream documentation keeps an unknown original publication date honest', async (t) => {
  const f = await fixture(t);
  const upstream = f.manifest.items.find(
    (item) => item.kind === 'upstream-documentation',
  );
  assert.ok(
    upstream,
    'real milestone corpus includes admitted upstream documentation',
  );
  assert.equal(upstream.status, 'published');
  assert.equal(upstream.publishedDate, null);
  const valid = await validateLibrary({ root: f.root, checkProjection: false });
  assert.equal(valid.ok, true, JSON.stringify(valid.errors));
  upstream.publishedDate = '2026-99-99';
  await f.saveManifest();
  rejected(
    await validateLibrary({ root: f.root, checkProjection: false }),
    'CONTENT_MISMATCH',
  );
});

test('manifest publication metadata is required and route slugs are unique across knowledge kinds', async (t) => {
  for (const field of [
    'tags',
    'author',
    'upstreamDocumentId',
    'upstreamRevision',
    'references',
    'licenseNotice',
  ])
    await t.test(`missing ${field}`, async (child) => {
      const f = await fixture(child);
      delete f.manifest.items[0][field];
      await f.saveManifest();
      rejected(
        await validateLibrary({ root: f.root, checkProjection: false }),
        'SCHEMA_MISMATCH',
      );
    });
  await t.test(
    'original and upstream items cannot share a knowledge route',
    async (child) => {
      const f = await fixture(child);
      const original = f.manifest.items.find(
        (item) => item.kind === 'original-article',
      );
      const upstream = f.manifest.items.find(
        (item) => item.kind === 'upstream-documentation',
      );
      upstream.slug = original.slug;
      await f.saveManifest();
      rejected(
        await validateLibrary({ root: f.root, checkProjection: false }),
        'DUPLICATE_ID',
      );
    },
  );
});

test('published article slugs match the existing 64-character route limit', async (t) => {
  const schema = JSON.parse(
    await readFile(path.join(root, 'content/library.schema.json'), 'utf8'),
  );
  assert.equal(
    schema.definitions.id.maxLength,
    80,
    'non-route stable identifiers retain their approved generic bound',
  );
  assert.equal(
    schema.definitions.item.properties.slug.$ref,
    '#/definitions/routeSlug',
  );
  assert.equal(schema.definitions.routeSlug.maxLength, 64);
  await t.test('64-character published slug passes', async (child) => {
    const f = await fixture(child);
    f.manifest.items[0].slug = 'a'.repeat(64);
    await f.saveManifest();
    const result = await validateLibrary({
      root: f.root,
      checkProjection: false,
    });
    assert.equal(result.ok, true, JSON.stringify(result.errors));
  });
  for (const length of [65, 80])
    await t.test(
      `${length}-character published slug fails schema`,
      async (child) => {
        const f = await fixture(child);
        f.manifest.items[0].slug = 'a'.repeat(length);
        await f.saveManifest();
        rejected(
          await validateLibrary({ root: f.root, checkProjection: false }),
          'SCHEMA_MISMATCH',
        );
      },
    );
  await t.test(
    'Node enforces the route limit even if an editable schema is widened',
    async (child) => {
      const f = await fixture(child);
      f.manifest.items[0].slug = 'a'.repeat(65);
      await f.saveManifest();
      const editable = JSON.parse(
        await readFile(
          path.join(f.root, 'content/library.schema.json'),
          'utf8',
        ),
      );
      editable.definitions.routeSlug.maxLength = 80;
      await writeFile(
        path.join(f.root, 'content/library.schema.json'),
        JSON.stringify(editable),
      );
      rejected(
        await validateLibrary({ root: f.root, checkProjection: false }),
        'DUPLICATE_ID',
      );
    },
  );
});

test('reviewed case classifications expose only bounded camera/layer handoffs with user-observed imagery coverage', async () => {
  const manifest = JSON.parse(
    await readFile(path.join(root, 'content/library.json'), 'utf8'),
  );
  const expected = new Map([
    ['nepal-flood', ['published', 'interactive']],
    ['hurricane-tracking', ['published', 'partial']],
    ['launch-reconstruction', ['published', 'interactive']],
    ['aircraft-incidents', ['published', 'demonstration-only']],
    ['satellite-imagery-change', ['published', 'partial']],
    ['ai-reconstruction-demonstrations', ['published', 'demonstration-only']],
  ]);
  const cases = manifest.items.filter((item) => item.kind === 'case-study');
  assert.deepEqual(
    new Set(cases.map((item) => item.slug)),
    new Set(expected.keys()),
  );
  for (const item of cases) {
    assert.deepEqual(
      [item.status, item.caseDetails.interactivity],
      expected.get(item.slug),
    );
    assert.ok(item.caseDetails.limitations.length > 0, item.id);
    assert.ok(item.references.length > 0, item.id);
    assert.match(item.adaptationNotice, /original/i);
    if (
      item.caseDetails.interactivity === 'demonstration-only' ||
      item.status === 'draft'
    ) {
      assert.equal(item.caseDetails.globeUrl, null, item.id);
      assert.equal(item.caseDetails.restoredScope, null, item.id);
      continue;
    }
    const url = new URL(validateGlobeLink(item.caseDetails.globeUrl));
    assert.equal(url.origin, 'http://localhost:4173');
    assert.equal(url.pathname, '/');
    assert.equal(url.search, '');
    const params = new URLSearchParams(url.hash.slice(1));
    const allowed = new Set([
      'v',
      'lat',
      'lon',
      'alt',
      'heading',
      'pitch',
      'roll',
      'style',
      'map',
      'l',
      'lo',
    ]);
    assert.ok(
      [...params.keys()].every((key) => allowed.has(key)),
      item.id,
    );
    assert.equal(params.get('v'), '2');
    const imagery = item.slug === 'satellite-imagery-change';
    assert.equal(
      params.get('lo'),
      imagery
        ? 'f.e.1_1.w.-7422481_1.s.4031969_1.e.-7421304_1.n.4032950_1.m.2_k.o.n'
        : 'f.e.1_k.o.n',
    );
    if (imagery) {
      assert.deepEqual(
        decodeLayerStateParams(params).options['recent-imagery'],
        {
          west: -7422481,
          south: 4031969,
          east: -7421304,
          north: 4032950,
          a: null,
          b: null,
          mode: 2,
          split: 50,
          viirs: false,
        },
      );
      assert.match(item.caseDetails.restoredScope, /manual|select/i);
    }
    const view = viewFromParams(params);
    assert.equal(view.map, 'esri-imagery');
    assert.equal(view.follow, null);
    assert.deepEqual(view.annotations, []);
    const scopes = {
      'nepal-flood': {
        camera: {
          lat: 28.21,
          lon: 85.34,
          altitude_m: 100000,
          heading_deg: 0,
          pitch_deg: -75,
        },
        layers: ['bhote-koshi-2026', 'bhote-koshi-locator'],
      },
      'hurricane-tracking': {
        camera: {
          lat: 25,
          lon: -70,
          altitude_m: 4000000,
          heading_deg: 0,
          pitch_deg: -90,
        },
        layers: ['weather-cyclones', 'weather-satellite'],
      },
      'launch-reconstruction': {
        camera: {
          lat: 28.56,
          lon: -80.58,
          altitude_m: 250000,
          heading_deg: 0,
          pitch_deg: -65,
        },
        layers: ['rocket-launches'],
      },
      'satellite-imagery-change': {
        camera: {
          lat: 40.3239,
          lon: -74.2184,
          altitude_m: 731,
          heading_deg: 342,
          pitch_deg: -86,
        },
        layers: ['recent-imagery'],
      },
    };
    assert.deepEqual(view.camera, scopes[item.slug].camera);
    assert.deepEqual(view.layers, scopes[item.slug].layers);
    assert.equal(view.style, 'normal');
    assert.match(item.caseDetails.restoredScope, /camera/i);
  }
});

test('case validation rejects missing bodies, unsafe URLs, invalid classifications and mismatched restored scopes', async (t) => {
  const cases = [
    [
      'missing case Markdown',
      async (f, item) => rm(path.join(f.root, item.contentPath)),
      'FILE_UNAVAILABLE',
    ],
    [
      'changed case hash',
      async (_f, item) => {
        item.inputSha256 = '0'.repeat(64);
      },
      'CONTENT_MISMATCH',
    ],
    [
      'knowledge path on a case',
      async (_f, item) => {
        item.contentPath = 'content/knowledge/first-five-minutes.md';
      },
      'CONTENT_MISMATCH',
    ],
    [
      'external globe destination',
      async (_f, item) => {
        item.caseDetails.globeUrl =
          'https://example.org/#v=2&lat=1&lon=2&alt=3';
      },
      'SCHEMA_MISMATCH',
    ],
    [
      'credential-shaped globe state',
      async (_f, item) => {
        item.caseDetails.globeUrl += '&token=TEST_SECRET_DO_NOT_ECHO';
      },
      'UNSAFE_URL',
    ],
    [
      'invalid camera coordinate',
      async (_f, item) => {
        item.caseDetails.globeUrl = '/#v=2&lat=999&lon=2&alt=3';
      },
      'UNSAFE_URL',
    ],
    [
      'invalid interactivity',
      async (_f, item) => {
        item.caseDetails.interactivity = 'live';
      },
      'SCHEMA_MISMATCH',
    ],
    [
      'missing limitations',
      async (_f, item) => {
        item.caseDetails.limitations = [];
      },
      'SCHEMA_MISMATCH',
    ],
    [
      'URL without declared scope',
      async (_f, item) => {
        item.caseDetails.restoredScope = null;
      },
      'CONTENT_MISMATCH',
    ],
    [
      'scope without a URL',
      async (_f, item) => {
        item.caseDetails.globeUrl = null;
      },
      'CONTENT_MISMATCH',
    ],
    [
      'case metadata attached to article',
      async (f, item) => {
        f.manifest.items.find(
          (value) => value.kind === 'original-article',
        ).caseDetails = structuredClone(item.caseDetails);
      },
      'CONTENT_MISMATCH',
    ],
  ];
  for (const [name, mutate, code] of cases)
    await t.test(name, async (child) => {
      const f = await fixture(child);
      const item = f.manifest.items.find(
        (value) => value.kind === 'case-study' && value.caseDetails.globeUrl,
      );
      assert.ok(item);
      await mutate(f, item);
      await f.saveManifest();
      rejected(
        await validateLibrary({ root: f.root, checkProjection: false }),
        code,
      );
    });
});

test('I1 admits only the reviewed environment-only CDSE capability and custom-plan evidence', async (t) => {
  const f = await fixture(t);
  const result = await validateLibrary({
    root: f.root,
    checkProjection: false,
  });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  const capability = result.registry.capabilities.find(
    (value) => value.id === 'cdse',
  );
  assert.equal(capability.setupKeyId, null);
  assert.equal(capability.visibility, 'environment-only');
  assert.deepEqual(capability.environmentNames, [
    'CDSE_CLIENT_ID',
    'CDSE_CLIENT_SECRET',
  ]);
  const guide = result.registry.guideGroups.find(
    (value) => value.id === 'cdse',
  );
  assert.equal(guide.setupKeyId, null);
  assert.equal(guide.setupUrl, null);
  assert.deepEqual(guide.sourceProductRefs, ['cdse/s2-l2a']);
  const product = result.registry.sources.find((value) => value.id === 'cdse')
    .products[0];
  assert.deepEqual(product.access.requiredCapabilityRefs, ['cdse']);
  assert.equal(product.evidence[0].path, 'docs/custom/FREE-IMAGERY-PLAN.md');
  assert.equal(
    product.evidence[0].revision,
    'a860327edc694fbcc313eb0791629fe88070a0b0',
  );
  assert.notEqual(
    product.evidence[0].revision,
    result.registry.upstreamRevision,
  );
  assert.equal(result.stats.products, 150);
  assert.equal(result.stats.guides, 39);
});

test('I1 cannot widen environment names, POWER UP identities or frozen upstream provenance', async (t) => {
  const cases = [
    [
      'extra environment variable',
      (f) =>
        f.registry.capabilities
          .find((value) => value.id === 'cdse')
          .environmentNames.push('CDSE_TEST_EXTRA'),
      'IDENTITY_MISMATCH',
    ],
    [
      'invented POWER UP identity',
      (f) => {
        const guide = f.registry.guideGroups.find(
          (value) => value.id === 'cdse',
        );
        guide.setupKeyId = 'cdse';
        guide.setupUrl = '/?setup=1';
      },
      'UNKNOWN_REFERENCE',
    ],
    [
      'custom facts attributed to upstream',
      (f) => {
        f.registry.sources.find(
          (value) => value.id === 'cdse',
        ).products[0].evidence[0].revision = f.registry.upstreamRevision;
      },
      'PIN_MISMATCH',
    ],
    [
      'custom-plan revision used for another path',
      (f) => {
        f.registry.sources.find(
          (value) => value.id === 'cdse',
        ).products[0].evidence[0].path = 'src/custom/shared/layerMetadata.js';
      },
      'PIN_MISMATCH',
    ],
  ];
  for (const [name, mutate, code] of cases)
    await t.test(name, async (child) => {
      const f = await fixture(child);
      mutate(f);
      await f.saveRegistry();
      rejected(
        await validateLibrary({ root: f.root, checkProjection: false }),
        code,
      );
    });
});
