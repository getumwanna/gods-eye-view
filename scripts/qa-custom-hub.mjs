#!/usr/bin/env node
/**
 * User-run hub/Library browser regression; never a feed/performance baseline.
 *
 * Start the existing server, then run:
 *   npm run qa:hub
 *   QA_BASE_URL=http://127.0.0.1:4173 QA_HEADFUL=1 npm run qa:hub
 * Restart the existing server after npm ci or dependency changes.
 *
 * Requires installed Puppeteer/Chrome. Uses a fresh isolated browser context.
 * Does not start a server, configure keys, open key forms or enable layers.
 * Blocks provider/API acquisition except read-only /api/setup/status and public
 * OSM basemap tiles. The synthetic fixture is URL state only, never live data.
 * Writes assertion-only evidence under ignored .gev-logs/. No screenshots,
 * raw page text, console messages, request URLs or credential status are saved.
 * Run only when browser automation is authorized; this is not a workaround for
 * a denied browser action. The coding agent did not execute this harness.
 */
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { chromeExecutablePath } from './qa-chrome.mjs';
import { branding } from '../src/custom/shared/branding.js';
import { validateGlobeLink } from '../src/custom/shared/shareHandoff.js';
import { viewFromParams } from '../src/view/index.js';
import { decodeLayerStateParams } from '../src/data/layerState.js';
import { replaceQaInput } from './qa-custom-hub-input.mjs';
import {
  hubIsReady,
  globeControlsUncovered,
  creditsAreVisible,
  classifyQaResponse,
  qaFailureCode,
  scriptErrorResult,
} from './qa-custom-hub-diagnostics.mjs';

const argument = process.argv.find((value) => value.startsWith('--base-url='));
const supplied =
  argument?.slice('--base-url='.length) ||
  process.env.QA_BASE_URL ||
  'http://localhost:4173';
let base;
try {
  base = new URL(supplied);
} catch {
  throw new Error('qa:hub requires a valid plain loopback origin.');
}
const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);
if (
  !loopback.has(base.hostname) ||
  !['http:', 'https:'].includes(base.protocol) ||
  base.username ||
  base.password ||
  base.search ||
  base.hash ||
  !['', '/'].includes(base.pathname)
) {
  throw new Error(
    'qa:hub requires a plain HTTP(S) loopback origin without credentials, query or hash.',
  );
}
const origin = base.origin;
const root = fileURLToPath(new URL('../', import.meta.url));
const libraryManifest = JSON.parse(
  await readFile(path.join(root, 'content/library.json'), 'utf8'),
);
const caseItems = libraryManifest.items.filter(
  (item) => item.kind === 'case-study',
);
const publishedCases = caseItems.filter((item) => item.status === 'published');
const unavailableCaseSlugs = [
  ...caseItems
    .filter((item) => item.status === 'draft')
    .map((item) => item.slug),
  'unpublished-case-fixture',
];
const timeout = 90_000;
const assertions = [];
const requests = { blockedAcquisition: 0, setupReads: 0 };
const resources = {
  failedLocalDocuments: 0,
  failedLocalModules: 0,
  failedOptimizedDependencies: 0,
  outdatedOptimizedDependencies: 0,
};
const hubStartup = {
  ready: false,
  documentStatus: null,
  checkpoint: 'browser-setup',
  failureCode: null,
};
let browser;
let context;
let page;
let failed = false;
let pageErrors = 0;
let checkpoint = null;
let globeReady = false;
const fixture = new URL('/', origin);
fixture.hash = new URLSearchParams({
  v: '2',
  lat: '30.25',
  lon: '-97.75',
  alt: '800000',
  heading: '33',
  pitch: '-70',
  roll: '0',
  style: 'crt',
  map: 'osm',
  l: '',
  lo: '0.r.google-0',
  ui: 'd.c.0_c.c.1_c.p.0_l.c.1',
  sp: 'p.250_d.20_i.15',
  hud: 'operator',
  hv: '1',
  dm: 'OFF',
  sc: '0',
  scf: '37',
  cr: '0',
}).toString();

function record(name, passed, detail = {}) {
  assertions.push({ name, passed: Boolean(passed), ...detail });
  const details = [
    detail.blockedBy && `blocked by ${detail.blockedBy}`,
    detail.checkpoint && `checkpoint: ${detail.checkpoint}`,
    detail.failureCode && `reason: ${detail.failureCode}`,
  ].filter(Boolean);
  const suffix = details.length ? ` (${details.join('; ')})` : '';
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}${suffix}`);
  if (!passed) failed = true;
}

async function check(name, operation) {
  if (!hubStartup.ready) {
    record(name, false, {
      blockedBy: 'hub-startup',
      checkpoint: hubStartup.checkpoint,
      failureCode: hubStartup.failureCode,
    });
    return;
  }
  checkpoint = null;
  try {
    await operation();
    record(name, true);
  } catch (error) {
    record(name, false, {
      ...(checkpoint ? { checkpoint } : {}),
      failureCode: qaFailureCode(error, resources),
    });
  }
}

async function route(hash, heading) {
  checkpoint = 'hub-route-document';
  await page.goto(`${origin}/hub/${hash}`, {
    waitUntil: 'domcontentloaded',
    timeout,
  });
  checkpoint = 'hub-route-heading';
  await page.waitForFunction(
    (expected) => document.querySelector('h1')?.textContent === expected,
    { timeout: 15_000 },
    heading,
  );
}

async function clickText(selector, text) {
  const found = await page.evaluate(
    (query, label) => {
      const node = [...document.querySelectorAll(query)].find(
        (item) => item.textContent?.trim() === label,
      );
      if (!node) return false;
      node.click();
      return true;
    },
    selector,
    text,
  );
  assert.equal(found, true);
}

try {
  const executablePath = chromeExecutablePath();
  browser = await puppeteer.launch({
    headless: process.env.QA_HEADFUL !== '1',
    ...(executablePath ? { executablePath } : {}),
    args:
      process.platform === 'darwin'
        ? ['--use-angle=metal', '--enable-gpu']
        : ['--use-gl=angle', '--use-angle=swiftshader'],
  });
  context = await browser.createBrowserContext();
  page = await context.newPage();
  page.setDefaultTimeout(15_000);
  await page.setViewport({ width: 1440, height: 960 });
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = new URL(request.url());
    const local = url.origin === origin;
    const setup =
      local &&
      url.pathname === '/api/setup/status' &&
      request.method() === 'GET';
    const localAsset =
      local &&
      ['GET', 'HEAD'].includes(request.method()) &&
      !url.pathname.startsWith('/api/') &&
      url.pathname !== '/mcp';
    const publicOsmTile =
      url.protocol === 'https:' &&
      /^(?:[abc]\.)?tile\.openstreetmap\.org$/.test(url.hostname) &&
      request.method() === 'GET';
    if (setup) requests.setupReads += 1;
    if (
      setup ||
      localAsset ||
      publicOsmTile ||
      ['data:', 'blob:'].includes(url.protocol)
    )
      void request.continue().catch(() => {});
    else {
      requests.blockedAcquisition += 1;
      void request.abort('blockedbyclient').catch(() => {});
    }
  });
  page.on('pageerror', () => {
    pageErrors += 1;
  });
  page.on('dialog', (dialog) => {
    void dialog.dismiss();
  });
  page.on('response', (response) => {
    const failure = classifyQaResponse({
      url: response.url(),
      origin,
      status: response.status(),
      statusText: response.statusText(),
      resourceType: response.request().resourceType(),
    });
    if (failure?.kind === 'document') resources.failedLocalDocuments += 1;
    if (failure?.kind === 'module-or-style') resources.failedLocalModules += 1;
    if (failure?.kind === 'optimized-dependency')
      resources.failedOptimizedDependencies += 1;
    if (failure?.outdated) resources.outdatedOptimizedDependencies += 1;
  });

  // Fail once at startup, then mark dependent checks blocked instead of waiting
  // through every route on a blank page. No-error counts require a rendered app.
  try {
    checkpoint = 'hub-document';
    const response = await page.goto(`${origin}/hub/#/dashboard`, {
      waitUntil: 'domcontentloaded',
      timeout,
    });
    hubStartup.documentStatus = response?.status() ?? null;
    assert.ok(response && (response.ok() || response.status() === 304));
    checkpoint = 'hub-render';
    await page.waitForFunction(hubIsReady, { timeout: 30_000 });
    hubStartup.ready = true;
    hubStartup.checkpoint = 'hub-ready';
  } catch (error) {
    hubStartup.checkpoint = checkpoint;
    hubStartup.failureCode = qaFailureCode(error, resources);
  }

  await check('fixed hub routes and honest phase boundaries', async () => {
    await route('#/dashboard', 'Dashboard');
    assert.equal(
      await page.$eval(
        'nav[aria-label="Main navigation"]',
        (nav) => nav.querySelectorAll('a').length,
      ),
      4,
    );
    assert.equal(
      await page.$eval('main', (main) =>
        main.textContent.includes(
          'No dashboard feeds are polled by this page.',
        ),
      ),
      true,
    );
    await route('#/library', 'Library');
    await page.waitForSelector('.gih-library-directory');
    assert.equal(
      await page.$eval(
        'main',
        (main) =>
          main.textContent.includes('feed health is not checked in Library') &&
          Boolean(main.querySelector('a[href="#/library/cases"]')),
      ),
      true,
    );
    await route('#/settings', 'Settings');
    assert.equal(
      await page.$eval('main', (main) =>
        main.textContent.includes('workspace collections not created'),
      ),
      true,
    );
    await route('#/missing-route', 'Page not found');
  });

  await check(
    'source guide links to existing setup without configuring keys',
    async () => {
      await page.goto(`${origin}/hub/#/library/sources/aisstream`, {
        waitUntil: 'domcontentloaded',
      });
      await page.waitForSelector('a[href="/?setup=1"]');
      assert.equal(
        await page.$eval('main', (main) =>
          main.textContent.includes(
            'does not focus or configure it automatically',
          ),
        ),
        true,
      );
      assert.equal(await page.$('input[data-env-var]'), null);
    },
  );

  await check(
    'Data Sources filters canonical products and keeps reference facts separate from feed health',
    async () => {
      await route('#/library/sources', 'Data Sources');
      await page.waitForSelector('#source-filter');
      await page.waitForFunction(() =>
        document
          .querySelector('.gih-directory-count')
          ?.textContent.includes('150 of 150'),
      );
      assert.equal(
        await page.$eval('main', (main) =>
          main.textContent.includes('Static reference information.'),
        ),
        true,
      );
      await page.type('#source-filter', 'Ontario 511');
      await page.waitForFunction(() =>
        document
          .querySelector('.gih-source-record-list')
          ?.textContent.includes('Ontario 511'),
      );
      assert.equal(
        await page.$eval(
          '.gih-source-record-list',
          (list) =>
            list.textContent.includes('key required') &&
            list.textContent.includes('Not checked in Library.'),
        ),
        true,
      );
      await replaceQaInput(
        page,
        '#source-filter',
        'no-matching-provider-fixture',
      );
      await page.waitForFunction(() =>
        document
          .querySelector('main')
          ?.textContent.includes('No matching sources'),
      );
      assert.equal(await page.$('input[data-env-var]'), null);
    },
  );

  await check(
    'Knowledge Center renders published articles with provenance and keyboard section focus',
    async () => {
      await route('#/library/knowledge', 'Knowledge Center');
      checkpoint = 'knowledge-directory';
      await page.waitForFunction(
        () => document.querySelectorAll('.gih-knowledge-card').length === 16,
      );
      const articleTitle = await page.$eval(
        'a[href="#/library/knowledge/first-five-minutes"]',
        (link) => link.textContent.trim(),
      );
      await route('#/library/knowledge/first-five-minutes', articleTitle);
      checkpoint = 'article-provenance';
      await page.waitForSelector('.gih-article-provenance');
      assert.equal(
        await page.$eval(
          'main',
          (main) =>
            main.textContent.includes('Provenance and permissions') &&
            main.textContent.includes('Sources and further reading') &&
            main.textContent.includes('not for operational use'),
        ),
        true,
      );
      const section = 'section-try-street-level-within-its-coverage';
      await page.click(
        `nav[aria-label="Article contents"] a[href$="?section=${section}"]`,
      );
      checkpoint = 'article-section-focus';
      await page.waitForFunction(
        (id) => document.activeElement?.id === id,
        { timeout: 15_000 },
        section,
      );
      assert.equal(
        await page.$(
          '.gih-article-content img, .gih-article-content iframe, .gih-article-content video',
        ),
        null,
      );
    },
  );

  await check(
    'Case studies publish reviewed capabilities and only validated camera/layer handoffs',
    async () => {
      await route('#/library/cases', 'Case studies');
      checkpoint = 'case-directory';
      assert.ok(publishedCases.length > 0);
      await page.waitForFunction(
        (expected) =>
          document.querySelectorAll('.gih-case-card').length === expected,
        { timeout: 15_000 },
        publishedCases.length,
      );
      assert.equal(
        caseItems.some((item) => item.slug === 'unpublished-case-fixture'),
        false,
      );
      for (const slug of unavailableCaseSlugs) {
        assert.equal(await page.$(`a[href="#/library/cases/${slug}"]`), null);
      }
      const labels = {
        interactive: 'Interactive',
        partial: 'Partial',
        'demonstration-only': 'Demonstration only',
        'view-only': 'View only',
      };
      for (const item of publishedCases) {
        await route(`#/library/cases/${item.slug}`, item.title);
        checkpoint = `case-context-${item.slug}`;
        await page.waitForSelector(
          'section[aria-labelledby="case-context-heading"]',
        );
        const disclosure = await page.$eval(
          'section[aria-labelledby="case-context-heading"]',
          (node) => node.textContent,
        );
        assert.ok(disclosure.includes(labels[item.caseDetails.interactivity]));
        for (const limit of item.caseDetails.limitations)
          assert.ok(disclosure.includes(limit));
        assert.equal(
          await page.$(
            '.gih-article-content img, .gih-article-content iframe, .gih-article-content video',
          ),
          null,
        );
        const cta = await page.$$eval('main a', (anchors) =>
          anchors
            .filter(
              (anchor) => anchor.textContent?.trim() === 'Open globe view',
            )
            .map((anchor) => anchor.href),
        );
        if (item.caseDetails.globeUrl) {
          assert.notEqual(item.caseDetails.interactivity, 'demonstration-only');
          assert.deepEqual(cta, [
            validateGlobeLink(item.caseDetails.globeUrl, { origin }),
          ]);
          const expected = new URL(item.caseDetails.globeUrl, origin);
          const actual = new URL(cta[0]);
          assert.equal(actual.origin, origin);
          assert.equal(actual.pathname, '/');
          assert.equal(actual.search, '');
          assert.equal(actual.hash, expected.hash);
          const view = viewFromParams(
            new URLSearchParams(actual.hash.slice(1)),
          );
          assert.equal(view.map, 'esri-imagery');
          assert.equal(view.follow, null);
          assert.deepEqual(view.annotations, []);
          if (item.slug === 'satellite-imagery-change') {
            assert.deepEqual(view.camera, {
              lat: 40.3239,
              lon: -74.2184,
              altitude_m: 731,
              heading_deg: 342,
              pitch_deg: -86,
            });
            assert.deepEqual(view.layers, ['recent-imagery']);
            assert.deepEqual(
              decodeLayerStateParams(new URLSearchParams(actual.hash.slice(1)))
                .options['recent-imagery'],
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
          }
          assert.ok(disclosure.includes(item.caseDetails.restoredScope));
        } else {
          assert.deepEqual(cta, []);
        }
        const href = await page.$eval(
          'nav[aria-label="Case study contents"] ol a',
          (anchor) => anchor.getAttribute('href'),
        );
        assert.match(
          href,
          new RegExp(
            `^#/library/cases/${item.slug}\\?section=section-[a-z0-9-]+$`,
          ),
        );
        const section = new URL(href.slice(1), origin).searchParams.get(
          'section',
        );
        await page.click(
          `nav[aria-label="Case study contents"] a[href="${href}"]`,
        );
        checkpoint = `case-section-focus-${item.slug}`;
        await page.waitForFunction(
          (id) => document.activeElement?.id === id,
          { timeout: 15_000 },
          section,
        );
      }
    },
  );

  await check(
    'Case search returns published case sections and keeps drafts unavailable',
    async () => {
      const item = publishedCases.find((item) => item.slug === 'nepal-flood');
      assert.ok(item);
      await route(
        `#/library/search?q=${encodeURIComponent('Nepal')}`,
        'Library Search',
      );
      checkpoint = 'case-search-filters';
      await page.select('#search-kind', 'case-study');
      await page.select('#search-category', '');
      await page.select('#search-source', '');
      assert.deepEqual(
        await page.$$eval(
          '#search-kind, #search-category, #search-source',
          (controls) => controls.map((control) => control.value),
        ),
        ['case-study', '', ''],
      );
      checkpoint = 'case-search-results';
      await page.waitForSelector(
        `.library-search-results a[href^="#/library/cases/${item.slug}?section="]`,
      );
      const links = await page.$$eval('.library-search-results a', (anchors) =>
        anchors.map((anchor) => anchor.getAttribute('href')),
      );
      assert.ok(links.length > 0);
      assert.ok(
        links.every((href) =>
          /^#\/library\/cases\/[a-z0-9-]+\?section=section-[a-z0-9-]+$/.test(
            href,
          ),
        ),
      );
      for (const slug of unavailableCaseSlugs)
        assert.ok(links.every((href) => !href.includes(`/cases/${slug}?`)));
      const href = links.find((href) =>
        href.startsWith(`#/library/cases/${item.slug}?section=`),
      );
      await page.click(`.library-search-results a[href="${href}"]`);
      checkpoint = 'case-search-section-focus';
      const section = new URL(href.slice(1), origin).searchParams.get(
        'section',
      );
      await page.waitForFunction(
        (id) => document.activeElement?.id === id,
        { timeout: 15_000 },
        section,
      );
      for (const slug of unavailableCaseSlugs) {
        await route(
          `#/library/cases/${slug}?section=section-start`,
          'Case study unavailable',
        );
        assert.equal(
          await page.$('.gih-case-context, .gih-article-content'),
          null,
        );
        checkpoint = 'unavailable-case-section-focus';
        await page.waitForFunction(
          () => document.activeElement?.id === 'case-study-unavailable-title',
          { timeout: 15_000 },
        );
      }
    },
  );

  await check(
    'Library search filters local references and opens matching article sections',
    async () => {
      await route('#/library/search?q=Ontario', 'Library Search');
      checkpoint = 'library-search-results';
      await page.waitForSelector('.library-search-result');
      checkpoint = 'library-search-source-filters';
      await page.select('#search-kind', 'source-product');
      await page.select('#search-category', 'Source directory');
      await page.select('#search-source', 'cctv');
      checkpoint = 'library-search-source-filter-values';
      assert.deepEqual(
        await page.$$eval(
          '#search-kind, #search-category, #search-source',
          (controls) => controls.map((control) => control.value),
        ),
        ['source-product', 'Source directory', 'cctv'],
      );
      checkpoint = 'library-search-filtered-source-results';
      await page.waitForFunction(() =>
        document
          .querySelector('.library-search-results')
          ?.textContent.includes('Ontario'),
      );
      assert.equal(
        await page.$eval(
          '.library-search-results',
          (list) =>
            list.textContent.includes('Ontario') &&
            list.textContent.includes('Static reference information') &&
            list.textContent.includes('not checked in Library'),
        ),
        true,
      );
      checkpoint = 'library-search-replace-query';
      await replaceQaInput(
        page,
        '#library-query',
        'no-matching-library-fixture',
      );
      await page.click('.library-search-form button[type="submit"]');
      checkpoint = 'library-search-empty';
      await page.waitForFunction(() =>
        document
          .querySelector('main')
          ?.textContent.includes('No matching content'),
      );
      checkpoint = 'library-search-query-keeps-filters';
      assert.deepEqual(
        await page.$$eval(
          '#search-kind, #search-category, #search-source',
          (controls) => controls.map((control) => control.value),
        ),
        ['source-product', 'Source directory', 'cctv'],
      );
      await route('#/library/search?q=Street%20Level', 'Library Search');
      checkpoint = 'library-search-article-query';
      await page.waitForFunction(
        () =>
          document.querySelector('#library-query')?.value === 'Street Level',
      );
      checkpoint = 'library-search-article-filters';
      await page.waitForSelector('#search-kind');
      // Hash-only goto can preserve this mounted search component. Clear the
      // source-directory filters before checking an original article result.
      await page.select('#search-kind', 'original-article');
      await page.select('#search-category', '');
      await page.select('#search-source', '');
      checkpoint = 'library-search-article-filter-values';
      assert.deepEqual(
        await page.$$eval(
          '#search-kind, #search-category, #search-source',
          (controls) => controls.map((control) => control.value),
        ),
        ['original-article', '', ''],
      );
      checkpoint = 'library-search-article-results';
      await page.waitForSelector('.library-search-results a');
      const href = await page.$eval('.library-search-results a', (link) =>
        link.getAttribute('href'),
      );
      assert.match(
        href,
        /^#\/library\/knowledge\/[a-z0-9-]+\?section=section-[a-z0-9-]+$/,
      );
      checkpoint = 'library-search-open-article-result';
      await page.click('.library-search-results a');
      checkpoint = 'search-result-section-focus';
      const target = new URL(href.slice(1), origin).searchParams.get('section');
      await page.waitForFunction(
        (id) => document.activeElement?.id === id,
        { timeout: 15_000 },
        target,
      );
    },
  );

  await check(
    'dark/light preference persists across hub navigation and reload',
    async () => {
      await route('#/settings', 'Settings');
      await clickText('button', 'Light theme');
      await page.waitForFunction(
        () => document.documentElement.dataset.gihTheme === 'light',
      );
      await page.click('a[href="#/library"]');
      await page.waitForFunction(
        () => document.querySelector('h1')?.textContent === 'Library',
      );
      assert.equal(
        await page.$eval('html', (html) => html.dataset.gihTheme),
        'light',
      );
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForFunction(
        () => document.documentElement.dataset.gihTheme === 'light',
      );
      await page.click('button[aria-label="Toggle color theme"]');
      await page.waitForFunction(
        () => document.documentElement.dataset.gihTheme === 'dark',
      );
    },
  );

  await check('desktop sidebar collapse and route focus', async () => {
    await route('#/dashboard', 'Dashboard');
    await page.click('button[aria-label="Toggle navigation"]');
    await page.waitForSelector('[data-slot="sidebar"][data-state="collapsed"]');
    await page.click('button[aria-label="Toggle navigation"]');
    await page.waitForSelector('[data-slot="sidebar"][data-state="expanded"]');
    await page.click('a[href="#/settings"]');
    await page.waitForFunction(
      () =>
        document.querySelector('h1')?.textContent === 'Settings' &&
        document.activeElement?.id === 'main-content',
    );
    await page.keyboard.press('Tab');
    assert.equal(
      await page.evaluate(() => document.activeElement?.tagName === 'BUTTON'),
      true,
    );
  });

  await check(
    'mobile navigation Escape restores trigger focus without horizontal overflow',
    async () => {
      await page.setViewport({ width: 390, height: 844 });
      await route('#/dashboard', 'Dashboard');
      await page.waitForFunction(
        () => !document.querySelector('[data-slot="sidebar"][data-state]'),
      );
      await page.click('button[aria-label="Toggle navigation"]');
      await page.waitForSelector('[role="dialog"]', { visible: true });
      await page.keyboard.press('Escape');
      await page.waitForSelector('[role="dialog"]', { hidden: true });
      await page.waitForFunction(
        () =>
          document.activeElement?.getAttribute('aria-label') ===
          'Toggle navigation',
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        true,
      );
      await page.setViewport({ width: 1440, height: 960 });
    },
  );

  await check(
    'share form rejects external destinations and credential-shaped query fields',
    async () => {
      await route('#/dashboard', 'Dashboard');
      for (const rejected of [
        'https://example.invalid/#v=2&lat=0&lon=0&alt=100',
        `${origin}/?api_key=TEST_ONLY_NOT_A_KEY`,
      ]) {
        checkpoint = 'replace-rejected-share-input';
        assert.equal(
          await replaceQaInput(page, '#globe-share-link', rejected),
          true,
        );
        checkpoint = 'reject-share-destination';
        await clickText('button', 'Open shared view');
        await page.waitForSelector('#share-error[role="alert"]');
        assert.equal(new URL(page.url()).pathname, '/hub/');
      }
    },
  );

  await check(
    'complete synthetic v2 URL reaches the globe intact with every layer disabled',
    async () => {
      await route('#/dashboard', 'Dashboard');
      checkpoint = 'replace-share-input';
      assert.equal(
        await replaceQaInput(page, '#globe-share-link', fixture.href),
        true,
      );
      checkpoint = 'navigate-to-globe';
      let navigationHandler;
      const navigated = new Promise((resolve) => {
        navigationHandler = (frame) => {
          if (frame === page.mainFrame()) {
            page.off('framenavigated', navigationHandler);
            resolve(frame.url());
          }
        };
        page.on('framenavigated', navigationHandler);
      });
      let received;
      try {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout }),
          clickText('button', 'Open shared view'),
        ]);
        received = new URL(await navigated);
      } finally {
        page.off('framenavigated', navigationHandler);
      }
      checkpoint = 'preserve-full-v2-url';
      assert.equal(received.origin, origin);
      assert.equal(received.pathname, '/');
      assert.equal(received.hash, fixture.hash);
      checkpoint = 'globe-ready';
      await page.waitForFunction(
        () =>
          window.__godsEyeView?.dataManager &&
          document.querySelector('.gih-globe-tools'),
        { timeout },
      );
      checkpoint = 'globe-loading-cover';
      await page.waitForFunction(globeControlsUncovered, { timeout });
      globeReady = true;
      checkpoint = 'all-layers-disabled';
      assert.equal(
        await page.evaluate(() =>
          window.__godsEyeView.dataManager
            .getAll()
            .every((row) => !row.enabled),
        ),
        true,
      );
    },
  );

  if (!globeReady) {
    record(
      'globe branding, passive status disclosure, setup guidance and credits survive',
      false,
      { blockedBy: hubStartup.ready ? 'globe-readiness' : 'hub-startup' },
    );
  } else {
    await check(
      'globe branding, passive status disclosure, setup guidance and credits survive',
      async () => {
        checkpoint = 'globe-branding';
        await page.waitForSelector('.gih-globe-tools');
        assert.equal(
          await page.$eval('#title-bar h1', (node) => node.textContent.trim()),
          branding.name,
        );
        assert.equal(
          await page.$eval(
            '#title-bar .brand-logo img',
            (node) => new URL(node.src).pathname,
          ),
          branding.logo,
        );
        assert.equal(await page.$('#title-bar [data-logo-gaze]'), null);
        assert.ok(
          await page.$('a[aria-label="Back to Geospatial Intelligence Hub"]'),
        );
        checkpoint = 'passive-status-disclosure';
        if (!(await page.$eval('.gih-feed-strip', (node) => node.open)))
          await page.click('.gih-feed-strip > summary');
        await page.waitForSelector('.gih-feed-strip[open]');
        assert.equal(
          await page.$eval('.gih-feed-strip', (node) =>
            node.textContent.includes('No active layers'),
          ),
          true,
        );
        checkpoint = 'close-passive-status';
        await page.click('button[aria-label="Close active layer status"]');
        await page.waitForSelector('.gih-feed-strip:not([open])');
        checkpoint = 'setup-guidance';
        await page.click('.gih-key-badges > summary');
        await page.waitForSelector('.gih-key-badges[open]');
        assert.ok(await page.$('.gih-key-badges a[href="/hub/#/library"]'));
        checkpoint = 'visible-credits';
        await page.waitForFunction(creditsAreVisible);
        checkpoint = 'back-to-hub';
        await page.click('a[aria-label="Back to Geospatial Intelligence Hub"]');
        await page.waitForFunction(
          () => document.querySelector('h1')?.textContent === 'Dashboard',
        );
      },
    );
  }

  const errorsResult = scriptErrorResult(hubStartup.ready, pageErrors);
  record(
    'no unhandled browser JavaScript errors during bounded UI checks',
    errorsResult.passed,
    errorsResult.blockedBy ? { blockedBy: errorsResult.blockedBy } : {},
  );
} catch (error) {
  record('browser harness setup or execution completed', false, {
    failureCode: qaFailureCode(error, resources),
  });
} finally {
  await context?.close().catch(() => {});
  await browser?.close().catch(() => {});
  const directory = path.join(root, '.gev-logs');
  await mkdir(directory, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const evidence = {
    timestamp: new Date().toISOString(),
    origin,
    kind: 'Phase 1 UI regression; acquisition restricted; not a live-feed or FPS baseline',
    fixture:
      'Synthetic URL state only; all layers disabled; no synthetic observation payloads',
    assertions,
    requests,
    resources,
    hubStartup,
    pageErrorCount: pageErrors,
    passed: !failed,
  };
  await writeFile(
    path.join(directory, `qa-custom-hub-${stamp}.json`),
    `${JSON.stringify(evidence, null, 2)}\n`,
  );
  console.log(
    `Hub/Library UI checks: ${assertions.filter((item) => item.passed).length}/${assertions.length} passed. Assertion-only receipt saved under .gev-logs/.`,
  );
  if (failed) process.exitCode = 1;
}
