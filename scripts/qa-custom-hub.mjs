#!/usr/bin/env node
/**
 * User-run Phase 1 browser regression; never a feed/performance baseline.
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
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { chromeExecutablePath } from './qa-chrome.mjs';
import { branding } from '../src/custom/shared/branding.js';
import { replaceQaInput } from './qa-custom-hub-input.mjs';
import { hubIsReady, globeControlsUncovered, creditsAreVisible, classifyQaResponse, qaFailureCode, scriptErrorResult } from './qa-custom-hub-diagnostics.mjs';

const argument = process.argv.find(value => value.startsWith('--base-url='));
const supplied = argument?.slice('--base-url='.length) || process.env.QA_BASE_URL || 'http://localhost:4173';
let base;
try { base = new URL(supplied); }
catch { throw new Error('qa:hub requires a valid plain loopback origin.'); }
const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);
if (!loopback.has(base.hostname) || !['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash || !['', '/'].includes(base.pathname)) {
  throw new Error('qa:hub requires a plain HTTP(S) loopback origin without credentials, query or hash.');
}
const origin = base.origin;
const root = fileURLToPath(new URL('../', import.meta.url));
const timeout = 90_000;
const assertions = [];
const requests = { blockedAcquisition: 0, setupReads: 0 };
const resources = { failedLocalDocuments: 0, failedLocalModules: 0, failedOptimizedDependencies: 0, outdatedOptimizedDependencies: 0 };
const hubStartup = { ready: false, documentStatus: null, checkpoint: 'browser-setup', failureCode: null };
let browser;
let context;
let page;
let failed = false;
let pageErrors = 0;
let checkpoint = null;
let globeReady = false;
const fixture = new URL('/', origin);
fixture.hash = new URLSearchParams({
  v: '2', lat: '30.25', lon: '-97.75', alt: '800000', heading: '33', pitch: '-70', roll: '0',
  style: 'crt', map: 'osm', l: '', lo: '0.r.google-0',
  ui: 'd.c.0_c.c.1_c.p.0_l.c.1', sp: 'p.250_d.20_i.15',
  hud: 'operator', hv: '1', dm: 'OFF', sc: '0', scf: '37', cr: '0',
}).toString();

function record(name, passed, detail = {}) {
  assertions.push({ name, passed: Boolean(passed), ...detail });
  const details = [detail.blockedBy && `blocked by ${detail.blockedBy}`, detail.checkpoint && `checkpoint: ${detail.checkpoint}`, detail.failureCode && `reason: ${detail.failureCode}`].filter(Boolean);
  const suffix = details.length ? ` (${details.join('; ')})` : '';
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}${suffix}`);
  if (!passed) failed = true;
}

async function check(name, operation) {
  if (!hubStartup.ready) {
    record(name, false, { blockedBy: 'hub-startup', checkpoint: hubStartup.checkpoint, failureCode: hubStartup.failureCode });
    return;
  }
  checkpoint = null;
  try { await operation(); record(name, true); }
  catch (error) { record(name, false, { ...(checkpoint ? { checkpoint } : {}), failureCode: qaFailureCode(error, resources) }); }
}

async function route(hash, heading) {
  checkpoint = 'hub-route-document';
  await page.goto(`${origin}/hub/${hash}`, { waitUntil: 'domcontentloaded', timeout });
  checkpoint = 'hub-route-heading';
  await page.waitForFunction(expected => document.querySelector('h1')?.textContent === expected, { timeout: 15_000 }, heading);
}

async function clickText(selector, text) {
  const found = await page.evaluate((query, label) => {
    const node = [...document.querySelectorAll(query)].find(item => item.textContent?.trim() === label);
    if (!node) return false;
    node.click();
    return true;
  }, selector, text);
  assert.equal(found, true);
}

try {
  const executablePath = chromeExecutablePath();
  browser = await puppeteer.launch({
    headless: process.env.QA_HEADFUL !== '1',
    ...(executablePath ? { executablePath } : {}),
    args: process.platform === 'darwin' ? ['--use-angle=metal', '--enable-gpu'] : ['--use-gl=angle', '--use-angle=swiftshader'],
  });
  context = await browser.createBrowserContext();
  page = await context.newPage();
  page.setDefaultTimeout(15_000);
  await page.setViewport({ width: 1440, height: 960 });
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = new URL(request.url());
    const local = url.origin === origin;
    const setup = local && url.pathname === '/api/setup/status' && request.method() === 'GET';
    const localAsset = local && ['GET', 'HEAD'].includes(request.method()) && !url.pathname.startsWith('/api/') && url.pathname !== '/mcp';
    const publicOsmTile = url.protocol === 'https:' && /^(?:[abc]\.)?tile\.openstreetmap\.org$/.test(url.hostname) && request.method() === 'GET';
    if (setup) requests.setupReads += 1;
    if (setup || localAsset || publicOsmTile || ['data:', 'blob:'].includes(url.protocol)) void request.continue().catch(() => {});
    else { requests.blockedAcquisition += 1; void request.abort('blockedbyclient').catch(() => {}); }
  });
  page.on('pageerror', () => { pageErrors += 1; });
  page.on('dialog', dialog => { void dialog.dismiss(); });
  page.on('response', response => {
    const failure = classifyQaResponse({ url: response.url(), origin, status: response.status(), statusText: response.statusText(), resourceType: response.request().resourceType() });
    if (failure?.kind === 'document') resources.failedLocalDocuments += 1;
    if (failure?.kind === 'module-or-style') resources.failedLocalModules += 1;
    if (failure?.kind === 'optimized-dependency') resources.failedOptimizedDependencies += 1;
    if (failure?.outdated) resources.outdatedOptimizedDependencies += 1;
  });

  // Fail once at startup, then mark dependent checks blocked instead of waiting
  // through every route on a blank page. No-error counts require a rendered app.
  try {
    checkpoint = 'hub-document';
    const response = await page.goto(`${origin}/hub/#/dashboard`, { waitUntil: 'domcontentloaded', timeout });
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
    assert.equal(await page.$eval('nav[aria-label="Main navigation"]', nav => nav.querySelectorAll('a').length), 4);
    assert.equal(await page.$eval('main', main => main.textContent.includes('No dashboard feeds are polled by this page.')), true);
    await route('#/library', 'Library');
    assert.equal(await page.$eval('main', main => main.textContent.includes('Not yet available')), true);
    await route('#/settings', 'Settings');
    assert.equal(await page.$eval('main', main => main.textContent.includes('workspace collections not created')), true);
    await route('#/missing-route', 'Page not found');
  });

  await check('source guide links to existing setup without configuring keys', async () => {
    await page.goto(`${origin}/hub/#/library/sources/aisstream`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('a[href="/?setup=1"]');
    assert.equal(await page.$eval('main', main => main.textContent.includes('does not focus or configure it automatically')), true);
    assert.equal(await page.$('input[data-env-var]'), null);
  });

  await check('dark/light preference persists across hub navigation and reload', async () => {
    await route('#/settings', 'Settings');
    await clickText('button', 'Light theme');
    await page.waitForFunction(() => document.documentElement.dataset.gihTheme === 'light');
    await page.click('a[href="#/library"]');
    await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'Library');
    assert.equal(await page.$eval('html', html => html.dataset.gihTheme), 'light');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.gihTheme === 'light');
    await page.click('button[aria-label="Toggle color theme"]');
    await page.waitForFunction(() => document.documentElement.dataset.gihTheme === 'dark');
  });

  await check('desktop sidebar collapse and route focus', async () => {
    await route('#/dashboard', 'Dashboard');
    await page.click('button[aria-label="Toggle navigation"]');
    await page.waitForSelector('[data-slot="sidebar"][data-state="collapsed"]');
    await page.click('button[aria-label="Toggle navigation"]');
    await page.waitForSelector('[data-slot="sidebar"][data-state="expanded"]');
    await page.click('a[href="#/settings"]');
    await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'Settings' && document.activeElement?.id === 'main-content');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.tagName === 'BUTTON'), true);
  });

  await check('mobile navigation Escape restores trigger focus without horizontal overflow', async () => {
    await page.setViewport({ width: 390, height: 844 });
    await route('#/dashboard', 'Dashboard');
    await page.waitForFunction(() => !document.querySelector('[data-slot="sidebar"][data-state]'));
    await page.click('button[aria-label="Toggle navigation"]');
    await page.waitForSelector('[role="dialog"]', { visible: true });
    await page.keyboard.press('Escape');
    await page.waitForSelector('[role="dialog"]', { hidden: true });
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Toggle navigation');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
    await page.setViewport({ width: 1440, height: 960 });
  });

  await check('share form rejects external destinations and credential-shaped query fields', async () => {
    await route('#/dashboard', 'Dashboard');
    for (const rejected of ['https://example.invalid/#v=2&lat=0&lon=0&alt=100', `${origin}/?api_key=TEST_ONLY_NOT_A_KEY`]) {
      checkpoint = 'replace-rejected-share-input';
      assert.equal(await replaceQaInput(page, '#globe-share-link', rejected), true);
      checkpoint = 'reject-share-destination';
      await clickText('button', 'Open shared view');
      await page.waitForSelector('#share-error[role="alert"]');
      assert.equal(new URL(page.url()).pathname, '/hub/');
    }
  });

  await check('complete synthetic v2 URL reaches the globe intact with every layer disabled', async () => {
    await route('#/dashboard', 'Dashboard');
    checkpoint = 'replace-share-input';
    assert.equal(await replaceQaInput(page, '#globe-share-link', fixture.href), true);
    checkpoint = 'navigate-to-globe';
    let navigationHandler;
    const navigated = new Promise(resolve => {
      navigationHandler = frame => { if (frame === page.mainFrame()) { page.off('framenavigated', navigationHandler); resolve(frame.url()); } };
      page.on('framenavigated', navigationHandler);
    });
    let received;
    try {
      await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout }), clickText('button', 'Open shared view')]);
      received = new URL(await navigated);
    } finally {
      page.off('framenavigated', navigationHandler);
    }
    checkpoint = 'preserve-full-v2-url';
    assert.equal(received.origin, origin);
    assert.equal(received.pathname, '/');
    assert.equal(received.hash, fixture.hash);
    checkpoint = 'globe-ready';
    await page.waitForFunction(() => window.__godsEyeView?.dataManager && document.querySelector('.gih-globe-tools'), { timeout });
    checkpoint = 'globe-loading-cover';
    await page.waitForFunction(globeControlsUncovered, { timeout });
    globeReady = true;
    checkpoint = 'all-layers-disabled';
    assert.equal(await page.evaluate(() => window.__godsEyeView.dataManager.getAll().every(row => !row.enabled)), true);
  });

  if (!globeReady) {
    record('globe branding, passive status disclosure, setup guidance and credits survive', false, { blockedBy: hubStartup.ready ? 'globe-readiness' : 'hub-startup' });
  } else {
    await check('globe branding, passive status disclosure, setup guidance and credits survive', async () => {
      checkpoint = 'globe-branding';
      await page.waitForSelector('.gih-globe-tools');
      assert.equal(await page.$eval('#title-bar h1', node => node.textContent.trim()), branding.name);
      assert.equal(await page.$eval('#title-bar .brand-logo img', node => new URL(node.src).pathname), branding.logo);
      assert.equal(await page.$('#title-bar [data-logo-gaze]'), null);
      assert.ok(await page.$('a[aria-label="Back to Geospatial Intelligence Hub"]'));
      checkpoint = 'passive-status-disclosure';
      if (!await page.$eval('.gih-feed-strip', node => node.open)) await page.click('.gih-feed-strip > summary');
      await page.waitForSelector('.gih-feed-strip[open]');
      assert.equal(await page.$eval('.gih-feed-strip', node => node.textContent.includes('No active layers')), true);
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
      await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'Dashboard');
    });
  }

  const errorsResult = scriptErrorResult(hubStartup.ready, pageErrors);
  record('no unhandled browser JavaScript errors during bounded UI checks', errorsResult.passed, errorsResult.blockedBy ? { blockedBy: errorsResult.blockedBy } : {});
} catch (error) {
  record('browser harness setup or execution completed', false, { failureCode: qaFailureCode(error, resources) });
} finally {
  await context?.close().catch(() => {});
  await browser?.close().catch(() => {});
  const directory = path.join(root, '.gev-logs');
  await mkdir(directory, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const evidence = { timestamp: new Date().toISOString(), origin, kind: 'Phase 1 UI regression; acquisition restricted; not a live-feed or FPS baseline', fixture: 'Synthetic URL state only; all layers disabled; no synthetic observation payloads', assertions, requests, resources, hubStartup, pageErrorCount: pageErrors, passed: !failed };
  await writeFile(path.join(directory, `qa-custom-hub-${stamp}.json`), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Phase 1 UI checks: ${assertions.filter(item => item.passed).length}/${assertions.length} passed. Assertion-only receipt saved under .gev-logs/.`);
  if (failed) process.exitCode = 1;
}
