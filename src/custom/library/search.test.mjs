import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { libraryRawImportTestAdapter } from './rawImportTestAdapter.mjs';

const root = fileURLToPath(new URL('../../../', import.meta.url));
let temp;
let application;
let catalog;
let index;
before(async () => {
  await mkdir(path.join(root, '.gev-cache'), { recursive: true });
  temp = await mkdtemp(path.join(root, '.gev-cache/library-search-'));
  const outfile = path.join(temp, 'search.mjs');
  await build({
    absWorkingDir: root,
    stdin: {
      contents: `export * from './hub/src/library/catalog.ts';
      export * from './hub/src/library/search.ts';
      export * from './hub/src/library/markdown.ts';
      export * from './hub/src/library/links.ts';
      export * from './hub/src/router.js';
      export * from './hub/src/pages/LibrarySearch.tsx';
      export * from './hub/src/components/library/SearchResults.tsx';`,
      resolveDir: root,
      loader: 'ts',
    },
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    logLevel: 'silent',
    plugins: [libraryRawImportTestAdapter({ root, readFile, realpath, path })],
    define: { 'import.meta.env.DEV': 'false', 'import.meta.hot': 'undefined' },
  });
  application = await import(pathToFileURL(outfile).href);
  const snapshot = await application.loadLibrary();
  assert.equal(snapshot.status, 'ready', JSON.stringify(snapshot.errors));
  catalog = snapshot.data;
  index = application.getLibrarySearchIndex(catalog);
});
after(async () => {
  if (temp) await rm(temp, { recursive: true, force: true });
});

function fixture(markdown, changes = {}) {
  const copy = structuredClone(catalog);
  const item = copy.manifest.items.find(
    (value) => value.kind === 'original-article',
  );
  assert.ok(item);
  Object.assign(item, {
    title: 'A controlled guide',
    tags: [],
    description: 'Reference.',
    sourceProductRefs: [],
    ...changes,
  });
  copy.manifest.items = [item];
  copy.registry.sources = [];
  copy.originalDocuments[item.contentPath] = markdown;
  return copy;
}

test('real published corpus and all canonical source products are searchable without acquisition', () => {
  assert.equal(
    catalog.manifest.items.filter((item) => item.status === 'published').length,
    16,
  );
  assert.equal(
    index.documents.filter((document) => document.kind === 'source-product')
      .length,
    149,
  );
  const oldFetch = globalThis.fetch;
  try {
    globalThis.fetch = () => {
      throw new Error('Search must not acquire data.');
    };
    const found = application.searchLibrary(index, 'Ontario');
    assert.ok(found.total > 0);
    assert.ok(
      found.results.some(
        (result) =>
          result.kind === 'source-product' && /Ontario/.test(result.title),
      ),
    );
    assert.ok(application.searchLibrary(index, 'OpenSky').total > 0);
    assert.ok(
      application
        .searchLibrary(index, 'Astra')
        .results.some((result) => result.kind === 'external-summary'),
    );
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test('each article result points to the exact stable heading IDs used by the renderer', () => {
  for (const item of catalog.manifest.items) {
    if (item.status !== 'published') continue;
    const parsed = application.parseMarkdownSections(
      application.getArticleMarkdown(item, catalog),
    );
    const valid = new Set([
      'section-start',
      ...parsed.headings.map((heading) => heading.id),
    ]);
    const documents = index.documents.filter((document) =>
      document.id.startsWith(`${item.id}/`),
    );
    assert.ok(documents.length > 0, item.id);
    for (const document of documents) {
      const url = new URL(document.href.slice(1), 'https://local.invalid');
      assert.equal(url.pathname, `/library/knowledge/${item.slug}`);
      assert.ok(valid.has(url.searchParams.get('section')), document.href);
    }
  }
});

test('ungrouped source products open their own provider record and nested heading results match rendering', () => {
  for (const source of catalog.registry.sources) {
    for (const product of source.products) {
      const reference = `${source.id}/${product.id}`;
      if (
        catalog.registry.guideGroups.some((guide) =>
          guide.sourceProductRefs.includes(reference),
        )
      )
        continue;
      assert.equal(
        index.documents.find(
          (document) => document.id === `source/${reference}`,
        ).href,
        `#/library/sources/${source.id}`,
      );
    }
  }
  const nested = fixture(
    '> ## Repeated\n>\n> Quote tokenquote.\n\n- ### Repeated\n\n  List tokenlist.\n\n## Repeated\n\nRoot tokenroot.',
  );
  const local = application.createLibrarySearchIndex(nested);
  assert.match(
    application.searchLibrary(local, 'tokenroot').results[0].href,
    /section=section-repeated-3$/,
  );
  assert.match(
    application.searchLibrary(local, 'tokenquote').results[0].href,
    /section=section-repeated$/,
  );
  assert.match(
    application.searchLibrary(local, 'tokenlist').results[0].href,
    /section=section-repeated-2$/,
  );
});

test('shared extraction excludes unadmitted upstream sections, drafts, raw HTML and images', () => {
  const copy = fixture(
    '## Visible\nSearchable prose.\n\n<script>\nsecretmarker\n</script>\n\n![mediamarker](https://example.test/remote.png)',
  );
  const item = copy.manifest.items[0];
  copy.manifest.items.push({
    ...item,
    id: 'draft-only',
    slug: 'draft-only',
    status: 'draft',
    title: 'draftmarker',
  });
  const local = application.createLibrarySearchIndex(copy);
  assert.ok(application.searchLibrary(local, 'Searchable').total > 0);
  for (const query of ['secretmarker', 'mediamarker', 'draftmarker'])
    assert.equal(application.searchLibrary(local, query).total, 0);
  const admitted = catalog.manifest.upstreamDocuments.find(
    (document) => document.path === 'README.md',
  );
  const modified = structuredClone(catalog);
  modified.upstreamDocuments[admitted.path] +=
    '\n## Unadmitted section\nunadmittedmarker\n';
  assert.equal(
    application.searchLibrary(
      application.createLibrarySearchIndex(modified),
      'unadmittedmarker',
    ).total,
    0,
  );
});

test('title, heading and tag weighting beat body-only matches with deterministic prefix ranking', () => {
  const copy = fixture('## Ordinary\nquartz.\n\n## quartz\nOther prose.', {
    title: 'One guide',
  });
  const item = copy.manifest.items[0];
  copy.manifest.items.push({
    ...item,
    id: 'title-match',
    slug: 'title-match',
    title: 'quartz',
    contentPath: 'content/knowledge/test-title.md',
  });
  copy.originalDocuments['content/knowledge/test-title.md'] =
    '## Ordinary\nOther prose.';
  const local = application.createLibrarySearchIndex(copy);
  const exact = application.searchLibrary(local, 'quartz').results;
  assert.equal(exact[0].title, 'quartz');
  assert.ok(
    exact.findIndex((result) => result.heading === 'quartz') <
      exact.findIndex(
        (result) =>
          result.title === 'One guide' && result.heading === 'Ordinary',
      ),
  );
  assert.deepEqual(
    application
      .searchLibrary(local, 'quart')
      .results.map((result) => result.id),
    application
      .searchLibrary(local, 'quart')
      .results.map((result) => result.id),
  );
  const tagged = fixture('## Ordinary\nBody.', { tags: ['obsidian'] });
  assert.ok(
    application.searchLibrary(
      application.createLibrarySearchIndex(tagged),
      'obsidi',
    ).total > 0,
  );
});

test('type, category and source filters match real corpus metadata together', () => {
  const match = index.documents.find(
    (document) =>
      document.kind === 'source-product' && /Ontario/.test(document.title),
  );
  const filters = {
    kind: match.kind,
    category: match.category,
    source: match.sources[0],
  };
  const found = application.searchLibrary(index, 'Ontario', filters);
  assert.ok(found.total > 0);
  assert.ok(
    found.results.every(
      (result) =>
        result.kind === filters.kind &&
        result.category === filters.category &&
        result.sources.includes(filters.source),
    ),
  );
  assert.equal(
    application.searchLibrary(index, 'Ontario', {
      source: 'nonexistent-source',
    }).total,
    0,
  );
});

test('mounted search keeps filters across query changes and clearing source filters restores article results', async () => {
  const dom = new JSDOM('<div id="search-root"></div>', {
    url: 'http://localhost:4173/hub/#/library/search?q=Ontario',
  });
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalAct = globalThis.IS_REACT_ACT_ENVIRONMENT;
  let client;
  try {
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    client = createRoot(dom.window.document.getElementById('search-root'));
    const renderQuery = async (query) => {
      await act(async () =>
        client.render(
          React.createElement(application.LibrarySearchContent, {
            catalog,
            query,
          }),
        ),
      );
    };
    const select = async (id, value) => {
      const control = dom.window.document.getElementById(id);
      assert.ok(control, id);
      await act(async () => {
        control.value = value;
        control.dispatchEvent(
          new dom.window.Event('change', { bubbles: true }),
        );
      });
      assert.equal(control.value, value);
    };
    const filters = () =>
      ['search-kind', 'search-category', 'search-source'].map(
        (id) => dom.window.document.getElementById(id).value,
      );
    const results = () =>
      dom.window.document.querySelector('.library-search-results');
    await renderQuery('Ontario');
    await select('search-kind', 'source-product');
    await select('search-category', 'Source directory');
    await select('search-source', 'cctv');
    assert.match(results().textContent, /Ontario/);
    await renderQuery('no-matching-library-fixture');
    assert.equal(results(), null);
    assert.deepEqual(filters(), ['source-product', 'Source directory', 'cctv']);
    assert.match(dom.window.document.body.textContent, /No matching content/);
    await renderQuery('Street Level');
    await select('search-kind', 'original-article');
    assert.deepEqual(filters(), [
      'original-article',
      'Source directory',
      'cctv',
    ]);
    assert.equal(results(), null);
    await select('search-category', '');
    await select('search-source', '');
    assert.deepEqual(filters(), ['original-article', '', '']);
    const links = [...results().querySelectorAll('a')];
    assert.ok(links.length > 0);
    for (const link of links)
      assert.match(
        link.getAttribute('href'),
        /^#\/library\/knowledge\/[a-z0-9-]+\?section=section-[a-z0-9-]+$/,
      );
    assert.equal(
      dom.window.location.href,
      'http://localhost:4173/hub/#/library/search?q=Ontario',
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

test('empty, Unicode, punctuation and overlong queries remain bounded and inert', () => {
  const local = application.createLibrarySearchIndex(
    fixture('## Café 東京\nRésumé coverage.'),
  );
  assert.ok(application.searchLibrary(local, 'cafe').total > 0);
  assert.ok(application.searchLibrary(local, '東京').total > 0);
  for (const query of ['', '   ', '\u0000', '!!!'])
    assert.equal(application.searchLibrary(local, query).total, 0);
  assert.ok(application.boundedSearchQuery('x'.repeat(10000)).length <= 160);
  assert.doesNotThrow(() =>
    application.searchLibrary(local, 'x'.repeat(10000)),
  );
  assert.doesNotThrow(() =>
    application.searchLibrary(local, '<script>alert(1)</script>'),
  );
  for (const query of [
    'a' + '😀'.repeat(80),
    '\ud800bad\udfff',
    '😀'.repeat(100),
  ]) {
    const href = application.librarySearchHref(query);
    const route = application.parseHubRoute(href);
    assert.equal(route.page, 'library-search');
    assert.ok(route.query.length <= 160);
    assert.doesNotThrow(() => encodeURIComponent(route.query));
    assert.doesNotThrow(() => application.librarySearchHref(route.query));
    assert.doesNotThrow(() => application.searchLibrary(local, route.query));
  }
});

test('results are capped at 30 per page and index replacement cannot return stale content', () => {
  const original = fixture(
    Array.from(
      { length: 75 },
      (_, index) => `## Repeated ${index}\nneedle body.`,
    ).join('\n\n'),
  );
  const first = application.getLibrarySearchIndex(original);
  assert.equal(application.getLibrarySearchIndex(original), first);
  const page1 = application.searchLibrary(first, 'needle');
  const page2 = application.searchLibrary(first, 'needle', {}, 1);
  assert.equal(page1.results.length, 30);
  assert.equal(page2.results.length, 30);
  assert.equal(
    page1.results.some((one) => page2.results.some((two) => one.id === two.id)),
    false,
  );
  assert.equal(
    application.searchLibrary(first, 'needle', {}, 999).results.length,
    15,
  );
  const replacement = fixture('## Fresh\nreplacementmarker');
  const next = application.getLibrarySearchIndex(replacement);
  assert.notEqual(next, first);
  assert.equal(application.searchLibrary(next, 'needle').total, 0);
  assert.equal(application.searchLibrary(next, 'replacementmarker').total, 1);
});

test('search UI uses native text escaping and safe internal links; no query storage or external media', () => {
  const html = renderToStaticMarkup(
    React.createElement(application.LibrarySearchContent, {
      catalog,
      query: 'Ontario',
    }),
  );
  assert.match(html, /Content type/);
  assert.match(html, /All categories/);
  assert.match(html, /All sources/);
  assert.match(html, /matching sections or source products/);
  assert.doesNotMatch(html, /<script|<img|<iframe|dangerouslySetInnerHTML/);
  const malicious = renderToStaticMarkup(
    React.createElement(application.SearchResults, {
      results: [
        {
          id: 'test',
          title: '<script>alert(1)</script>',
          heading: '<img src=x>',
          excerpt: '<svg onload=x>',
          kind: 'original-article',
          category: 'Test',
          href: '#/library/knowledge/project-background',
        },
      ],
    }),
  );
  assert.match(malicious, /&lt;script&gt;/);
  assert.doesNotMatch(malicious, /<script|<img|<svg/);
});
