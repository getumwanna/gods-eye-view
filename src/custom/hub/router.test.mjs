import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, readFile, realpath } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { libraryRawImportTestAdapter } from '../library/rawImportTestAdapter.mjs';
import { parseHubRoute, routeTitle } from '../../../hub/src/router.js';
import { cn } from '../../../hub/src/lib/utils.ts';
import { JSDOM } from 'jsdom';
import { runInNewContext } from 'node:vm';
import { hubIsReady } from '../../../scripts/qa-custom-hub-diagnostics.mjs';

test('local class helper composes conditional inputs and lets later utilities override conflicts', async () => {
  assert.equal(
    cn(
      'p-2',
      ['px-4', false],
      { hidden: false, 'font-semibold': true },
      null,
      undefined,
      'px-6',
    ),
    'p-2 font-semibold px-6',
  );
  assert.equal(
    cn('hover:bg-red-500', 'hover:bg-blue-500', 'bg-red-500', 'dark:bg-black'),
    'hover:bg-blue-500 bg-red-500 dark:bg-black',
  );
  assert.equal(
    cn(
      'group-data-[collapsible=icon]:w-8',
      'group-data-[collapsible=icon]:w-10',
    ),
    'group-data-[collapsible=icon]:w-10',
  );
});

test('hub routes accept only fixed pages and bounded source identifiers', async () => {
  assert.deepEqual(parseHubRoute(''), { page: 'dashboard', sourceId: null });
  for (const page of ['dashboard', 'library', 'settings']) {
    assert.equal(parseHubRoute(`#/${page}`).page, page);
  }
  assert.deepEqual(parseHubRoute('#/library/sources'), {
    page: 'data-sources',
    sourceId: null,
  });
  assert.deepEqual(parseHubRoute('#/library/sources/aisstream'), {
    page: 'source',
    sourceId: 'aisstream',
  });
  for (const hash of [
    'https://elsewhere.example',
    '#/library/sources/../settings',
    '#/library/sources/%2F',
    '#/settings/extra',
    '#/globe',
    '#/library/sources/' + 'a'.repeat(65),
  ]) {
    assert.equal(parseHubRoute(hash).page, 'not-found', hash);
  }
  assert.equal(routeTitle({ page: 'source' }), 'Source setup');
});

let App;
let temp;
const previousWindow = globalThis.window;
const previousFetch = globalThis.fetch;

before(async () => {
  const root = fileURLToPath(new URL('../../../', import.meta.url));
  await mkdir(path.join(root, '.gev-cache'), { recursive: true });
  temp = await mkdtemp(path.join(root, '.gev-cache/hub-ssr-'));
  const outfile = path.join(temp, 'app.mjs');
  await build({
    absWorkingDir: root,
    stdin: {
      contents:
        "export { App } from './hub/src/App.tsx'; export { loadLibrary } from './hub/src/library/catalog.ts';",
      resolveDir: root,
      loader: 'ts',
    },
    define: { 'import.meta.env.DEV': 'false', 'import.meta.hot': 'undefined' },
    plugins: [libraryRawImportTestAdapter({ root, readFile, realpath, path })],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    jsx: 'automatic',
    logLevel: 'silent',
  });
  const bundle = await import(pathToFileURL(outfile).href);
  App = bundle.App;
  globalThis.fetch = () => {
    throw new Error('Hub rendering must not acquire provider data');
  };
  assert.equal((await bundle.loadLibrary()).status, 'ready');
});

after(async () => {
  if (previousWindow === undefined) delete globalThis.window;
  else globalThis.window = previousWindow;
  globalThis.fetch = previousFetch;
  if (temp) await rm(temp, { recursive: true, force: true });
});

async function render(hash) {
  globalThis.window = { location: { hash } };
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    let html = '';
    output.on('data', (chunk) => {
      html += chunk.toString();
    });
    output.on('end', () => resolve(html));
    output.on('error', reject);
    const stream = renderToPipeableStream(React.createElement(App), {
      onAllReady() {
        stream.pipe(output);
      },
      onError: reject,
    });
  });
}

test('browser QA readiness matches the real rendered hub without requiring main-content to be a main element', async () => {
  for (const [hash, expected] of [
    ['#/dashboard', true],
    ['#/library', false],
    ['#/settings', false],
  ]) {
    const dom = new JSDOM(await render(hash));
    try {
      const document = dom.window.document;
      assert.equal(
        document.querySelector('main#main-content h1'),
        null,
        'the old predicate could never match the real shell',
      );
      const browserPredicate = runInNewContext(`(${hubIsReady.toString()})`, {
        document,
      });
      assert.equal(browserPredicate(), expected, hash);
      if (expected) {
        for (const selector of [
          '#globe-share-link',
          'nav[aria-label="Main navigation"]',
          '#main-content h1',
        ]) {
          const element = document.querySelector(selector);
          const placeholder = document.createTextNode('');
          element.replaceWith(placeholder);
          assert.equal(
            browserPredicate(),
            false,
            `readiness requires ${selector}`,
          );
          placeholder.replaceWith(element);
        }
      }
    } finally {
      dom.window.close();
    }
  }
  const blank = new JSDOM('<div id="root"></div>');
  try {
    assert.equal(
      runInNewContext(`(${hubIsReady.toString()})`, {
        document: blank.window.document,
      })(),
      false,
    );
  } finally {
    blank.window.close();
  }
});

test('dashboard renders accessible navigation and an honest share handoff without provider acquisition', async () => {
  const html = await render('#/dashboard');
  assert.match(html, /<h1>Dashboard<\/h1>/);
  assert.match(html, /aria-label="Main navigation"/);
  assert.match(html, /aria-label="Toggle navigation"/);
  assert.match(html, /aria-label="Toggle color theme"/);
  assert.match(html, /aria-current="page"[^>]*>.*?Dashboard/s);
  assert.match(html, /Globe share link/);
  assert.match(html, /Open shared view/);
  assert.match(html, /No dashboard feeds are polled by this page/);
  assert.match(html, /Not for operational use/);
  assert.doesNotMatch(html, /\$[0-9]|New account|Sign in|99\.9%/);
});

test('library and settings distinguish working controls from future features', async () => {
  const library = await render('#/library');
  assert.match(library, /<h1>Library<\/h1>/);
  assert.match(library, /Data Sources/);
  assert.match(library, /Not yet available/);
  assert.match(library, /\/hub\/#\/library\/sources\//);
  const settings = await render('#/settings');
  assert.match(settings, /<h1>Settings<\/h1>/);
  assert.match(settings, /aria-label="Color theme"/);
  assert.match(settings, /aria-pressed="true"/);
  assert.match(settings, /Dark theme/);
  assert.match(settings, /Light theme/);
  assert.match(settings, /Home region.*not yet available/s);
});

test('source routes and unknown routes render safe explicit empty states', async () => {
  const source = await render('#/library/sources/aisstream');
  assert.match(source, /Open POWER UP/);
  assert.match(source, /href="\/\?setup=1"/);
  assert.match(source, /AISStream/);
  assert.match(source, /Not checked in Library/);
  assert.match(source, /does not focus or configure it automatically/);
  assert.match(
    await render('#/library/sources/no-such-provider'),
    /Source guide unavailable/,
  );
  assert.match(await render('#/bad-route'), /<h1>Page not found<\/h1>/);
});

test('knowledge and search routes bound query values and accept only their own explicit fields', () => {
  assert.deepEqual(parseHubRoute('#/library/knowledge'), {
    page: 'knowledge',
    sourceId: null,
  });
  assert.deepEqual(
    parseHubRoute(
      '#/library/knowledge/project-background?section=section-purpose',
    ),
    {
      page: 'knowledge-article',
      sourceId: null,
      slug: 'project-background',
      section: 'section-purpose',
    },
  );
  assert.deepEqual(parseHubRoute('#/library/search?q=weather+coverage'), {
    page: 'library-search',
    sourceId: null,
    query: 'weather coverage',
  });
  assert.equal(
    parseHubRoute(`#/library/search?q=${'a'.repeat(200)}`).query.length,
    160,
  );
  for (const hash of [
    '#/library/knowledge/../settings',
    '#/library/knowledge/project-background?url=https://example.org',
    '#/library/knowledge/project-background?section=javascript:alert(1)',
    '#/library/knowledge/project-background?section=section-one&section=section-two',
    '#/library/search?q=one&q=two',
    '#/library/search?token=secret',
    '#/library/search?q=%00bad',
    '#/library/search?q=%E0%A4%A',
    '#/settings?q=bad',
  ])
    assert.equal(parseHubRoute(hash).page, 'not-found', hash);
});

test('knowledge pages and local search stay under the existing four-item shell', async () => {
  const knowledge = await render('#/library/knowledge');
  assert.match(knowledge, /<h1>Knowledge Center<\/h1>/);
  const knowledgeDom = new JSDOM(knowledge);
  try {
    assert.match(
      knowledgeDom.window.document.body.textContent,
      /16 published articles/,
    );
  } finally {
    knowledgeDom.window.close();
  }
  assert.match(knowledge, /aria-label="Library navigation"/);
  assert.match(knowledge, /aria-current="page"[^>]*>.*?Library/s);
  const search = await render('#/library/search?q=coverage');
  assert.match(search, /Library search/);
  assert.doesNotMatch(search, /<iframe/);
  assert.match(search, /Library search/);
});
