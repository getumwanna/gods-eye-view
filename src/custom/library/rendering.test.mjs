import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { libraryRawImportTestAdapter } from './rawImportTestAdapter.mjs';

const root = fileURLToPath(new URL('../../../', import.meta.url));
let temp;
let application;
let catalog;
const previousFetch = globalThis.fetch;
before(async () => {
  await mkdir(path.join(root, '.gev-cache'), { recursive: true });
  temp = await mkdtemp(path.join(root, '.gev-cache/library-rendering-'));
  const outfile = path.join(temp, 'library.mjs');
  await build({
    absWorkingDir: root,
    stdin: {
      contents: `export * from './hub/src/library/catalog.ts'; export * from './hub/src/library/links.ts'; export * from './hub/src/library/upstreamDocuments.ts'; export * from './hub/src/pages/Library.tsx'; export * from './hub/src/pages/SourceGuide.tsx'; export * from './hub/src/pages/DataSources.tsx'; export * from './hub/src/components/library/SourceRecord.tsx';`,
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

test('real admitted corpus validates inside the caught lazy Library loader without network acquisition', () => {
  assert.equal(catalog.registry.sources.length > 0, true);
  assert.equal(
    new Set(catalog.registry.bindings.map((binding) => binding.layerId)).size,
    32,
  );
  assert.equal(catalog.registry.guideGroups.length, 38);
  assert.equal(catalog.manifest.upstreamDocuments.length, 7);
  assert.equal(catalog.manifest.items.length, 0);
  assert.deepEqual(application.validateBrowserRegistry(catalog.registry), []);
  assert.deepEqual(
    application.validateBrowserManifest(catalog.manifest, catalog.registry, []),
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
