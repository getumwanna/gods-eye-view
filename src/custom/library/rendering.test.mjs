import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdir,
  mkdtemp,
  rm,
  readFile,
  realpath,
  writeFile,
  unlink,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { createServer } from 'vite';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { renderToStaticMarkup } from 'react-dom/server';
import { libraryRawImportTestAdapter } from './rawImportTestAdapter.mjs';
import {
  customLibraryHmrContent,
  PUBLIC_LIBRARY_INPUTS,
} from '../../../build/customHub.js';

const root = fileURLToPath(new URL('../../../', import.meta.url));
let temp;
let application;
let catalog;
const previousFetch = globalThis.fetch;

const expectedHmrInputs = [
  'content/sources.json',
  'content/library.json',
  'content/sources.schema.json',
  'content/library.schema.json',
  'content/knowledge/project-background.md',
  'content/knowledge/first-five-minutes.md',
  'content/knowledge/understanding-data-labels.md',
  'content/knowledge/layers-and-coverage.md',
  'content/knowledge/keys-and-costs.md',
  'content/knowledge/gis-geoint-fundamentals.md',
  'content/knowledge/development-and-updates.md',
  'content/knowledge/gods-eye-view-blew-up-then-astra-summary.md',
  'content/knowledge/i-open-sourced-gods-eye-view-summary.md',
  'content/cases/nepal-flood.md',
  'content/cases/hurricane-tracking.md',
  'content/cases/launch-reconstruction.md',
  'content/cases/aircraft-incidents.md',
  'content/cases/satellite-imagery-change.md',
  'content/cases/ai-reconstruction-demonstrations.md',
  'README.md',
  'docs/CURRENT-STATE.md',
  'DATA_SOURCES.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'TESTING.md',
  'THIRD_PARTY_NOTICES.md',
];

const hmrArticle = 'content/knowledge/first-five-minutes.md';
const hmrSchema = 'content/library.schema.json';
const hmrDocument = 'README.md';
const hmrOriginal = (file) =>
  file.endsWith('.json') ? '{"version":1}' : `# ${file}\nOriginal body\n`;
const hmrChanged = (file) =>
  file.endsWith('.json') ? '{"version":2}' : `# ${file}\nChanged body\n`;

// These are native Vite module-graph fixtures. They never listen on a port,
// evaluate page JavaScript, or edit the application's live content. Capturing
// the fixture's output records every payload, including default full reloads.
async function libraryHmrFixture({ missing = [], loaded = true } = {}) {
  const fixtureRoot = await mkdtemp(path.join(temp, 'native-hmr-'));
  await mkdir(path.join(fixtureRoot, 'hub/src/library'), { recursive: true });
  await mkdir(path.join(fixtureRoot, 'content/knowledge'), { recursive: true });
  for (const file of [hmrArticle, hmrSchema, hmrDocument]) {
    if (!missing.includes(file)) {
      await writeFile(path.join(fixtureRoot, file), hmrOriginal(file));
    }
  }
  await writeFile(
    path.join(fixtureRoot, 'hub/src/library/catalog.ts'),
    `import { docs } from './upstreamDocuments';
export const corpus = import.meta.glob(
  ['/content/knowledge/first-five-minutes.md', '/content/library.schema.json'],
  { query: '?raw', import: 'default' },
);
export { docs };
if (import.meta.hot) import.meta.hot.accept();
`,
  );
  await writeFile(
    path.join(fixtureRoot, 'hub/src/library/upstreamDocuments.ts'),
    `export const docs = import.meta.glob(['/README.md'], {
  query: '?raw', import: 'default',
});
`,
  );
  await writeFile(
    path.join(fixtureRoot, 'unrelated.js'),
    'export const n = 1;\n',
  );
  await writeFile(path.join(fixtureRoot, 'unrelated.md'), '# Unadmitted\n');

  const plugin = customLibraryHmrContent(fixtureRoot);
  const originalHandler = plugin.hotUpdate.handler;
  let onClientUpdate;
  plugin.hotUpdate.handler = async function (context) {
    try {
      return await originalHandler.call(this, context);
    } finally {
      if (this.environment.name === 'client') onClientUpdate?.();
    }
  };
  const server = await createServer({
    configFile: false,
    root: fixtureRoot,
    cacheDir: path.join(fixtureRoot, '.cache'),
    logLevel: 'silent',
    plugins: [plugin],
    server: { middlewareMode: true, watch: { ignored: ['**/*'] } },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  const messages = [];
  server.environments.client.hot.send = (payload) => {
    messages.push(structuredClone(payload));
  };

  const transformCatalog = async () => {
    const code = (await server.transformRequest('/hub/src/library/catalog.ts'))
      .code;
    const upstream = (
      await server.transformRequest('/hub/src/library/upstreamDocuments.ts')
    ).code;
    const owner = server.environments.client.moduleGraph.getModuleById(
      path.join(fixtureRoot, 'hub/src/library/upstreamDocuments.ts'),
    );
    if (owner?.lastHMRTimestamp > 0) {
      assert.ok(
        code.includes(
          `/hub/src/library/upstreamDocuments.ts?t=${owner.lastHMRTimestamp}`,
        ),
        'catalog imports the current upstream-document module generation',
      );
    }
    return { code, upstream };
  };
  const loadRaw = async (file) =>
    (await server.transformRequest(`/${file}?raw`)).code;
  const event = async (type, file) => {
    messages.length = 0;
    let timeout;
    const observed = new Promise((resolve, reject) => {
      timeout = setTimeout(
        () => reject(new Error(`Vite did not process ${type}: ${file}`)),
        2000,
      );
      onClientUpdate = resolve;
    });
    server.watcher.emit(type, path.join(fixtureRoot, file));
    try {
      await observed;
      // The post hook is awaited before Vite propagates and sends its result.
      // Drain that continuation before examining every emitted payload.
      await new Promise((resolve) => setImmediate(resolve));
      await new Promise((resolve) => setTimeout(resolve, 30));
      return structuredClone(messages);
    } finally {
      clearTimeout(timeout);
      onClientUpdate = undefined;
    }
  };

  try {
    assert.equal(server.httpServer, null, 'middleware fixture has no listener');
    if (loaded) {
      await transformCatalog();
      for (const file of [hmrArticle, hmrSchema, hmrDocument]) {
        if (!missing.includes(file)) await loadRaw(file);
      }
    }
    return { fixtureRoot, server, transformCatalog, loadRaw, event };
  } catch (error) {
    await server.close();
    throw error;
  }
}

function assertLibraryOnlyHmr(messages, label) {
  assert.equal(
    messages.some((message) => ['full-reload', 'error'].includes(message.type)),
    false,
    `${label}: no global reload or Vite error`,
  );
  const updates = messages
    .filter((message) => message.type === 'update')
    .flatMap((message) => message.updates);
  assert.ok(updates.length > 0, `${label}: sends an HMR update`);
  assert.ok(
    updates.every(
      (update) =>
        update.path === '/hub/src/library/catalog.ts' &&
        update.acceptedPath === update.path,
    ),
    `${label}: only the self-accepting Library catalog receives updates`,
  );
}
before(async () => {
  await mkdir(path.join(root, '.gev-cache'), { recursive: true });
  temp = await mkdtemp(path.join(root, '.gev-cache/library-rendering-'));
  const outfile = path.join(temp, 'library.mjs');
  await build({
    absWorkingDir: root,
    stdin: {
      contents: `export * from './hub/src/library/catalog.ts'; export * from './hub/src/library/links.ts'; export * from './hub/src/library/upstreamDocuments.ts'; export * from './hub/src/pages/Library.tsx'; export * from './hub/src/pages/SourceGuide.tsx'; export * from './hub/src/pages/DataSources.tsx'; export * from './hub/src/components/library/SourceRecord.tsx'; export * from './hub/src/library/markdown.ts'; export * from './hub/src/components/library/ArticleRenderer.tsx'; export * from './hub/src/pages/KnowledgeCenter.tsx'; export * from './hub/src/pages/KnowledgeArticle.tsx';`,
      resolveDir: root,
      loader: 'ts',
    },
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    jsx: 'automatic',
    logLevel: 'silent',
    define: { 'import.meta.env.DEV': 'true', 'import.meta.hot': 'undefined' },
    plugins: [libraryRawImportTestAdapter({ root, readFile, realpath, path })],
  });
  application = await import(pathToFileURL(outfile).href);
  globalThis.fetch = () => {
    throw new Error('Library must not acquire provider data');
  };
  const snapshot = await application.loadLibrary();
  assert.equal(snapshot.status, 'ready', JSON.stringify(snapshot.errors));
  catalog = snapshot.data;
});
after(async () => {
  globalThis.fetch = previousFetch;
  if (temp) await rm(temp, { recursive: true, force: true });
});

const render = (component, props) =>
  renderToStaticMarkup(React.createElement(component, props));

test('retained Library consumers use the current raw modules after unmounted HMR and recover through old Retry callbacks', async () => {
  const fixtureKey = '__gevLibraryHmrLifecycleTest';
  const previousHotFixture = globalThis[fixtureKey];
  let generation = 0;
  let previousHot = null;
  let hotData = {};
  let notifications = 0;
  let unsubscribe = null;
  const relativePath = (file) =>
    path.relative(root, file).split(path.sep).join('/');
  async function replaceGeneration({ replacement = {}, missing = [] } = {}) {
    const omitted = new Set(missing);
    const outfile = path.join(temp, `lifecycle-${generation++}.mjs`);
    await build({
      absWorkingDir: root,
      entryPoints: ['hub/src/library/catalog.ts'],
      outfile,
      bundle: true,
      platform: 'node',
      format: 'esm',
      packages: 'external',
      logLevel: 'silent',
      define: {
        'import.meta.env.DEV': 'true',
        'import.meta.hot': `globalThis.${fixtureKey}`,
      },
      plugins: [
        libraryRawImportTestAdapter({
          root,
          path,
          readFile: async (file, ...options) =>
            replacement[relativePath(file)] ?? readFile(file, ...options),
          realpath: async (file) => {
            if (omitted.has(relativePath(file)))
              throw Object.assign(new Error('Isolated missing input'), {
                code: 'ENOENT',
              });
            return realpath(file);
          },
        }),
      ],
    });
    previousHot?.onDispose(hotData);
    const hot = {
      data: hotData,
      onDispose: null,
      onAccept: null,
      dispose(callback) {
        this.onDispose = callback;
      },
      accept(callback) {
        this.onAccept = callback;
      },
    };
    globalThis[fixtureKey] = hot;
    const updated = await import(pathToFileURL(outfile).href);
    previousHot?.onAccept(updated);
    previousHot = hot;
    return updated;
  }
  try {
    const original = await replaceGeneration();
    const retainedLoad = original.loadLibrary;
    const retainedRetry = original.refreshLibrary;
    unsubscribe = original.subscribeLibrary(() => notifications++);
    assert.equal((await retainedLoad()).status, 'ready');
    assert.ok(notifications > 0);
    unsubscribe();
    unsubscribe = null;
    for (const scenario of [
      {
        name: 'malformed registry',
        replacement: { 'content/sources.json': '{' },
        code: 'content-load',
      },
      {
        name: 'missing original Markdown',
        missing: ['content/knowledge/first-five-minutes.md'],
        code: 'content-reference',
      },
      {
        name: 'missing schema',
        missing: ['content/library.schema.json'],
        code: 'missing-schema',
      },
      {
        name: 'missing admitted upstream document',
        missing: ['README.md'],
        code: 'missing-document',
      },
    ]) {
      const before = notifications;
      const updated = await replaceGeneration(scenario);
      assert.equal(original.getLibrarySnapshot().status, 'idle', scenario.name);
      assert.equal(
        notifications,
        before,
        'unmounted HMR does not notify consumers',
      );
      const revisited = await retainedLoad();
      assert.equal(revisited.status, 'error', scenario.name);
      assert.ok(
        revisited.errors.some((error) => error.code === scenario.code),
        `${scenario.name}: ${JSON.stringify(revisited.errors)}`,
      );
      assert.equal(updated.getLibrarySnapshot(), revisited);
      unsubscribe = original.subscribeLibrary(() => notifications++);
      retainedRetry();
      assert.equal(
        original.getLibrarySnapshot().status,
        'loading',
        scenario.name,
      );
      const retried = await retainedLoad();
      assert.equal(retried.status, 'error', scenario.name);
      assert.ok(retried.errors.some((error) => error.code === scenario.code));
      unsubscribe();
      unsubscribe = null;
      await replaceGeneration();
      assert.equal(original.getLibrarySnapshot().status, 'idle', scenario.name);
      const restored = await retainedLoad();
      assert.equal(restored.status, 'ready', scenario.name);
      assert.equal(
        restored.data.originalDocuments[
          'content/knowledge/first-five-minutes.md'
        ],
        catalog.originalDocuments['content/knowledge/first-five-minutes.md'],
      );
    }
  } finally {
    unsubscribe?.();
    if (previousHotFixture === undefined) delete globalThis[fixtureKey];
    else globalThis[fixtureKey] = previousHotFixture;
  }
});

test('real admitted corpus validates inside the caught lazy Library loader without network acquisition', () => {
  assert.equal(catalog.registry.sources.length > 0, true);
  assert.equal(
    new Set(catalog.registry.bindings.map((binding) => binding.layerId)).size,
    32,
  );
  assert.equal(catalog.registry.guideGroups.length, 38);
  assert.equal(catalog.manifest.upstreamDocuments.length, 7);
  assert.equal(catalog.manifest.items.length, 16);
  assert.equal(
    catalog.manifest.items.filter(
      (item) => item.kind === 'upstream-documentation',
    ).length,
    7,
  );
  assert.equal(
    catalog.manifest.items.filter((item) => item.kind === 'external-summary')
      .length,
    2,
  );
  assert.deepEqual(application.validateBrowserRegistry(catalog.registry), []);
  assert.deepEqual(
    application.validateBrowserManifest(
      catalog.manifest,
      catalog.registry,
      Object.keys(catalog.originalDocuments),
    ),
    [],
  );
});

test('directory renders static evidence, bounded pages and separate observation kinds without claiming checked health', () => {
  const html = render(application.SourceDirectory, { catalog });
  assert.match(html, /Static reference information/);
  assert.match(html, /Not checked in Library/);
  assert.match(html, /Documentation reviewed 2026-10-20/);
  assert.match(html, /aria-label="Source directory pages"/);
  assert.match(html, /Filter source references/);
  assert.equal(
    (html.match(/class="gih-card gih-source-record"/g) || []).length,
    12,
  );
  assert.doesNotMatch(
    html,
    /javascript:|<iframe|<script|data-live-count|keyPresent/,
  );
});

test('all 38 legacy source routes retain existing setup behavior and canonical product references', () => {
  for (const guide of catalog.registry.guideGroups) {
    const html = render(application.SourceGuide, { id: guide.id });
    assert.match(html, /Static reference information/);
    assert.match(html, /Not checked in Library/);
    assert.match(html, /does not focus or configure it automatically/);
    if (guide.setupUrl) assert.match(html, /href="\/\?setup=1"/);
    else assert.doesNotMatch(html, />Open POWER UP/);
  }
  const cameras = render(application.SourceGuide, { id: 'cctv' });
  assert.match(cameras, /Ontario/);
  assert.match(cameras, /key required/);
  assert.match(cameras, /disabled by policy/);
  assert.match(
    render(application.SourceGuide, { id: 'no-such-provider' }),
    /Source guide unavailable/,
  );
});

test('safe links and registry diagnostics reject unsafe values without reflecting them', () => {
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,bad',
    '//elsewhere.test',
    'https://a:b@example.test',
    'https://example.test/?token=secret',
    '../README.md',
  ])
    assert.equal(application.safeExternalUrl(value), null, value);
  for (const value of [
    '../README.md',
    '/README.md',
    'docs/%2e%2e/secret',
    'docs/../secret',
    'docs\\secret',
  ])
    assert.equal(application.safeRepositoryPath(value), false, value);
  const invalid = structuredClone(catalog.registry);
  invalid.sources[0].products[0].access.requiredCapabilityRefs.push(
    'sentinel-sensitive-dangling-id',
  );
  const errors = application.validateBrowserRegistry(invalid);
  assert.equal(
    errors.some((error) => error.code === 'capability-reference'),
    true,
  );
  assert.doesNotMatch(JSON.stringify(errors), /sentinel-sensitive/);
});

test('only reviewed upstream sections are selected and a missing selected heading is a data error', async () => {
  const doc = catalog.manifest.upstreamDocuments.find(
    (document) => document.path === 'README.md',
  );
  const selected = application.selectAdmittedSections(
    doc,
    catalog.upstreamDocuments[doc.path],
  );
  assert.match(selected, /Why This Exists/);
  assert.doesNotMatch(selected, /!\[.*?\]\(|<img|screenshots\//i);
  assert.equal(
    application.selectAdmittedSections(doc, 'Missing the reviewed headings'),
    null,
  );
  const errors = await application.validateAdmittedDocuments(
    [doc],
    { [doc.path]: 'Missing the reviewed headings' },
    true,
  );
  assert.equal(
    errors.some((error) => error.code === 'missing-section'),
    true,
  );
  assert.equal(
    application.validateFrozenAdmissions(
      catalog.manifest.upstreamDocuments.slice(1),
    )[0].code,
    'frozen-admission',
  );
  const widened = structuredClone(catalog.manifest.upstreamDocuments);
  widened[0].sections[0].sha256 = '0'.repeat(64);
  assert.equal(
    application.validateFrozenAdmissions(widened)[0].code,
    'frozen-admission',
  );
});

test('shared Markdown parser produces stable duplicate and Unicode heading IDs without HTML/media index text', () => {
  const markdown =
    '# Déjà vu\n\nVisible **prose**.\n\n## Déjà vu\n\n<script>sentinel-html</script>\n\n![sentinel-image](https://example.org/image.jpg)\n\n### 東京\n\nA [safe label](https://example.org).\n';
  const parsed = application.parseMarkdownSections(markdown);
  assert.deepEqual(
    parsed.headings.map((heading) => heading.id),
    ['section-deja-vu', 'section-deja-vu-2', 'section-heading'],
  );
  assert.match(parsed.text, /Visible prose/);
  assert.match(parsed.text, /東京/);
  assert.doesNotMatch(parsed.text, /sentinel-html|sentinel-image|image.jpg/);
  const item = catalog.manifest.items.find(
    (item) => item.kind === 'original-article',
  );
  const html = render(application.ArticleRenderer, { item, catalog, markdown });
  for (const heading of parsed.headings)
    assert.match(html, new RegExp(`id="${heading.id}"`));
});

test('article renderer keeps code inert and removes executable links, HTML and remote media', () => {
  const item = catalog.manifest.items.find(
    (item) => item.kind === 'original-article',
  );
  const markdown =
    '# Safe heading\n\n<script>sentinel-executable-html</script>\n\n<iframe src="https://example.org/embed"></iframe>\n\n![Photo](https://example.org/photo.jpg)\n\n[Execute](javascript:alert(1)) [Media](https://example.org/photo.png) [Provider](https://example.org/docs)\n\n```js\n<script>inert-code</script>\n```\n\n| Meaning | Value |\n| --- | --- |\n| Reference | Static |\n';
  const html = render(application.ArticleRenderer, { item, catalog, markdown });
  assert.doesNotMatch(
    html,
    /<script|<iframe|<img|javascript:|sentinel-executable-html|href="https:\/\/example.org\/photo/,
  );
  assert.match(html, /&lt;script&gt;inert-code&lt;\/script&gt;/);
  assert.match(html, /href="https:\/\/example.org\/docs"/);
  assert.match(html, /rel="noreferrer noopener"/);
  assert.match(html, /role="region"/);
  assert.match(html, /<caption/);
  assert.match(html, /scope="col"/);
});

test('published articles expose provenance and original-only summaries while upstream selection excludes unadmitted content', () => {
  for (const item of catalog.manifest.items.filter(
    (item) => item.kind !== 'case-study',
  )) {
    const markdown = application.getArticleMarkdown(item, catalog);
    assert.equal(typeof markdown, 'string', item.id);
    const html = render(application.KnowledgeArticleView, { item, catalog });
    assert.match(html, /Provenance and permissions/);
    assert.match(html, /Sources and further reading/);
    assert.match(html, /aria-label="Article contents"/);
    assert.match(
      html,
      /Documentation|documentation|Original|original|Upstream|upstream/,
    );
    assert.match(html, /not for operational use/);
    for (const heading of application.parseMarkdownSections(markdown).headings)
      assert.match(
        html,
        new RegExp(`id="${heading.id}"`),
        `${item.id}: ${heading.id}`,
      );
    if (item.kind === 'upstream-documentation')
      assert.match(html, /Permission is hereby granted/);
  }
  const unpublished = { ...catalog.manifest.items[0], status: 'draft' };
  assert.equal(application.getArticleMarkdown(unpublished, catalog), null);
  const readme = catalog.manifest.items.find(
    (item) => item.upstreamDocumentId === 'readme',
  );
  const dataSources = catalog.manifest.items.find(
    (item) => item.upstreamDocumentId === 'data-sources',
  );
  assert.equal(
    application.resolveArticleHref('DATA_SOURCES.md', readme, catalog),
    application.knowledgeHref(dataSources.slug),
  );
  assert.equal(
    application.resolveArticleHref('../../../../etc/passwd', readme, catalog),
    null,
  );
  assert.equal(
    application.resolveArticleHref(
      'https://example.org/picture.svg',
      readme,
      catalog,
    ),
    null,
  );
});

test('article client focus follows the shared section ID and recovers a missing section without page navigation', async () => {
  const item = catalog.manifest.items.find(
    (item) => item.kind === 'original-article',
  );
  const section = application.parseMarkdownSections(
    application.getArticleMarkdown(item, catalog),
  ).headings[0].id;
  const dom = new JSDOM('<div id="article-root"></div>', {
    url: 'http://localhost:4173/hub/',
  });
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalAct = globalThis.IS_REACT_ACT_ENVIRONMENT;
  const scrolled = [];
  let client;
  try {
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    dom.window.HTMLElement.prototype.scrollIntoView = function (options) {
      scrolled.push({ id: this.id, behavior: options.behavior });
    };
    client = createRoot(dom.window.document.getElementById('article-root'));
    await act(async () =>
      client.render(
        React.createElement(application.KnowledgeArticleView, {
          item,
          catalog,
          section,
        }),
      ),
    );
    assert.equal(dom.window.document.activeElement.id, section);
    assert.deepEqual(scrolled, [{ id: section, behavior: 'auto' }]);
    assert.equal(dom.window.location.href, 'http://localhost:4173/hub/');
    await act(async () =>
      client.render(
        React.createElement(application.KnowledgeArticleView, {
          item,
          catalog,
          section: 'section-no-such-heading',
        }),
      ),
    );
    assert.equal(
      dom.window.document.activeElement.id,
      'knowledge-article-title',
    );
    assert.match(
      dom.window.document.querySelector('[role="alert"]').textContent,
      /linked section is unavailable/,
    );
  } finally {
    if (client) await act(async () => client.unmount());
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
    if (originalAct === undefined) delete globalThis.IS_REACT_ACT_ENVIRONMENT;
    else globalThis.IS_REACT_ACT_ENVIRONMENT = originalAct;
    dom.window.close();
  }
});

test('nested quote/list headings, root duplicates, TOC and searchable sections use the same IDs', () => {
  const markdown =
    '> ## Repeated\n>\n> Quote tokenquote.\n\n- ### Repeated\n\n  List tokenlist.\n\n## Repeated\n\nRoot tokenroot.\n';
  const parsed = application.parseMarkdownSections(markdown);
  const expected = [
    'section-repeated',
    'section-repeated-2',
    'section-repeated-3',
  ];
  assert.deepEqual(
    parsed.headings.map((heading) => heading.id),
    expected,
  );
  assert.deepEqual(
    parsed.sections.map((section) => section.id),
    expected,
  );
  assert.match(parsed.sections[0].text, /tokenquote/);
  assert.doesNotMatch(parsed.sections[0].text, /tokenlist|tokenroot/);
  assert.match(parsed.sections[1].text, /tokenlist/);
  assert.doesNotMatch(parsed.sections[1].text, /tokenquote|tokenroot/);
  assert.match(parsed.sections[2].text, /tokenroot/);
  assert.doesNotMatch(parsed.sections[2].text, /tokenquote|tokenlist/);
  for (const token of ['tokenquote', 'tokenlist', 'tokenroot'])
    assert.equal(parsed.text.match(new RegExp(token, 'g')).length, 1);
  const item = catalog.manifest.items.find(
    (item) => item.kind === 'original-article',
  );
  const fixtureCatalog = {
    ...catalog,
    originalDocuments: {
      ...catalog.originalDocuments,
      [item.contentPath]: markdown,
    },
  };
  const html = render(application.KnowledgeArticleView, {
    item,
    catalog: fixtureCatalog,
  });
  const dom = new JSDOM(html);
  try {
    assert.deepEqual(
      [
        ...dom.window.document.querySelectorAll(
          '.gih-article-body h2, .gih-article-body h3',
        ),
      ].map((element) => element.id),
      expected,
    );
    assert.deepEqual(
      [
        ...dom.window.document.querySelectorAll(
          'nav[aria-label="Article contents"] ol a',
        ),
      ].map((anchor) => anchor.getAttribute('href')),
      expected.map((id) => application.knowledgeHref(item.slug, id)),
    );
  } finally {
    dom.window.close();
  }
});

test('DEV Library HMR admits exactly the reviewed public paths and preserves other handling', () => {
  assert.deepEqual(PUBLIC_LIBRARY_INPUTS, expectedHmrInputs);
  assert.equal(new Set(PUBLIC_LIBRARY_INPUTS).size, 26);
  assert.equal(Object.isFrozen(PUBLIC_LIBRARY_INPUTS), true);
  const fixtureRoot = path.join(temp, 'hmr-admissions');
  const plugin = customLibraryHmrContent(fixtureRoot);
  assert.equal(plugin.name, 'custom-library-hmr-content');
  assert.equal(plugin.apply, 'serve');
  assert.equal(plugin.hotUpdate.order, 'post');
  assert.equal(plugin.configureServer, undefined);
  assert.equal(plugin.transform, undefined);
  const handle = plugin.hotUpdate.handler;
  const noGraph = {
    get moduleGraph() {
      throw new Error('Unadmitted input must not inspect or alter the graph');
    },
  };
  for (const [name, file] of [
    ['ssr', 'README.md'],
    ['client', 'content/unadmitted.md'],
    ['client', 'content/knowledge/unreviewed.md'],
    ['client', 'README.md.private'],
    ['client', '../README.md'],
    ['client', 'hub/src/App.tsx'],
  ]) {
    assert.equal(
      handle.call(
        { environment: Object.assign(Object.create(noGraph), { name }) },
        { file: path.join(fixtureRoot, file), modules: [], timestamp: 100 },
      ),
      undefined,
      `${name}/${file}: Vite retains its normal handling`,
    );
  }
  for (const file of expectedHmrInputs) {
    const raw = { id: `${file}?raw` };
    const base = { id: file };
    const catalogOwner = { id: 'catalog', isSelfAccepting: true };
    const docsOwner = { id: 'upstreamDocuments' };
    const invalidated = [];
    const graph = {
      getModulesByFile(requested) {
        assert.equal(requested, path.join(fixtureRoot, file));
        return new Set([raw, base]);
      },
      getModuleById(requested) {
        if (
          requested === path.join(fixtureRoot, 'hub/src/library/catalog.ts')
        ) {
          return catalogOwner;
        }
        assert.equal(
          requested,
          path.join(fixtureRoot, 'hub/src/library/upstreamDocuments.ts'),
        );
        return docsOwner;
      },
      invalidateModule(module, seen, timestamp, isHmr) {
        assert.ok(seen instanceof Set);
        assert.equal(timestamp, 100);
        assert.equal(isHmr, true);
        invalidated.push(module);
      },
    };
    assert.deepEqual(
      handle.call(
        { environment: { name: 'client', moduleGraph: graph } },
        {
          file: path.join(fixtureRoot, file),
          modules: [raw],
          timestamp: 100,
        },
      ),
      [catalogOwner],
      file,
    );
    assert.deepEqual(
      new Set(invalidated),
      new Set([raw, base, docsOwner, catalogOwner]),
    );
    assert.equal(
      invalidated.length,
      4,
      `${file}: each raw/base/owner invalidates once`,
    );
  }
});

for (const [file, label] of [
  [hmrArticle, 'original article'],
  [hmrSchema, 'schema'],
  [hmrDocument, 'admitted upstream document'],
]) {
  test(`native Vite HMR contains repeated ${label} edits, deletes and restores`, async () => {
    const fixture = await libraryHmrFixture();
    try {
      for (let cycle = 0; cycle < 2; cycle++) {
        await writeFile(path.join(fixture.fixtureRoot, file), hmrChanged(file));
        assertLibraryOnlyHmr(
          await fixture.event('change', file),
          `${label} edit ${cycle + 1}`,
        );
        await fixture.transformCatalog();
        assert.ok(
          (await fixture.loadRaw(file)).includes(
            JSON.stringify(hmrChanged(file)),
          ),
          'the edited raw body is fresh',
        );

        await unlink(path.join(fixture.fixtureRoot, file));
        assertLibraryOnlyHmr(
          await fixture.event('unlink', file),
          `${label} delete ${cycle + 1}`,
        );
        const absent = await fixture.transformCatalog();
        assert.equal(
          (file === hmrDocument ? absent.upstream : absent.code).includes(
            JSON.stringify(`/${file}`),
          ),
          false,
          'the deleted body is removed from its import-glob map',
        );

        await writeFile(
          path.join(fixture.fixtureRoot, file),
          hmrOriginal(file),
        );
        assertLibraryOnlyHmr(
          await fixture.event('add', file),
          `${label} restore ${cycle + 1}`,
        );
        const restored = await fixture.transformCatalog();
        assert.ok(
          (file === hmrDocument ? restored.upstream : restored.code).includes(
            JSON.stringify(`/${file}`),
          ),
          'the restored body returns to its import-glob map',
        );
        const raw = await fixture.loadRaw(file);
        assert.ok(raw.includes(JSON.stringify(hmrOriginal(file))));
        assert.equal(raw.includes(JSON.stringify(hmrChanged(file))), false);
      }
    } finally {
      await fixture.server.close();
    }
  });

  test(`native Vite HMR recovers a ${label} missing at initial startup`, async () => {
    const fixture = await libraryHmrFixture({ missing: [file] });
    try {
      const absent = await fixture.transformCatalog();
      assert.equal(
        (file === hmrDocument ? absent.upstream : absent.code).includes(
          JSON.stringify(`/${file}`),
        ),
        false,
      );
      await writeFile(path.join(fixture.fixtureRoot, file), hmrOriginal(file));
      assertLibraryOnlyHmr(
        await fixture.event('add', file),
        `${label} first add`,
      );
      const restored = await fixture.transformCatalog();
      assert.ok(
        (file === hmrDocument ? restored.upstream : restored.code).includes(
          JSON.stringify(`/${file}`),
        ),
      );
      assert.ok(
        (await fixture.loadRaw(file)).includes(
          JSON.stringify(hmrOriginal(file)),
        ),
      );
    } finally {
      await fixture.server.close();
    }
  });
}

test('native Vite does not reload other shells when Library has never loaded', async () => {
  const fixture = await libraryHmrFixture({ loaded: false });
  try {
    assert.equal(
      fixture.server.environments.client.moduleGraph.getModuleById(
        path.join(fixture.fixtureRoot, 'hub/src/library/catalog.ts'),
      ),
      undefined,
    );
    await writeFile(
      path.join(fixture.fixtureRoot, hmrArticle),
      hmrChanged(hmrArticle),
    );
    assert.deepEqual(await fixture.event('change', hmrArticle), []);
    await unlink(path.join(fixture.fixtureRoot, hmrArticle));
    assert.deepEqual(await fixture.event('unlink', hmrArticle), []);
    await writeFile(
      path.join(fixture.fixtureRoot, hmrArticle),
      hmrOriginal(hmrArticle),
    );
    assert.deepEqual(await fixture.event('add', hmrArticle), []);
    await fixture.transformCatalog();
    assert.ok(
      (await fixture.loadRaw(hmrArticle)).includes(
        JSON.stringify(hmrOriginal(hmrArticle)),
      ),
      'a later first Library visit sees the restored current body',
    );
  } finally {
    await fixture.server.close();
  }
});

test('native Vite still broadcasts default reloads for unrelated JS and unadmitted raw files', async () => {
  const fixture = await libraryHmrFixture();
  try {
    await fixture.server.transformRequest('/unrelated.js');
    await writeFile(
      path.join(fixture.fixtureRoot, 'unrelated.js'),
      'export const n = 2;\n',
    );
    assert.ok(
      (await fixture.event('change', 'unrelated.js')).some(
        (message) => message.type === 'full-reload',
      ),
      'positive control: the fixture records normal JS reload commands',
    );
    await fixture.server.transformRequest('/unrelated.md?raw');
    await unlink(path.join(fixture.fixtureRoot, 'unrelated.md'));
    assert.ok(
      (await fixture.event('unlink', 'unrelated.md')).some(
        (message) => message.type === 'full-reload',
      ),
      'positive control: unadmitted Markdown keeps the raw-orphan reload behavior',
    );
  } finally {
    await fixture.server.close();
  }
});
