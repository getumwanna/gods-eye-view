import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { CdpMouse, CdpKeyboard } from 'puppeteer';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { replaceQaInput } from '../../../scripts/qa-custom-hub-input.mjs';
import { validateGlobeLink } from '../shared/shareHandoff.js';
import { globeControlsUncovered, creditsAreVisible, classifyQaResponse, qaFailureCode, scriptErrorResult } from '../../../scripts/qa-custom-hub-diagnostics.mjs';
import { startApplicationChrome } from '../../app/startupChrome.js';

test('credit visibility checks rendered content when its anchor has no box', () => {
  const dom = new JSDOM('<div id="cesium-credits"><span class="cesium-credit-logoContainer"><img></span><a class="cesium-credit-expand-link">Data attribution</a></div>');
  const document = dom.window.document;
  const root = document.getElementById('cesium-credits');
  const logo = root.querySelector('img');
  const attribution = root.querySelector('a');
  Object.defineProperties(document.documentElement, { clientWidth: { value: 1440 }, clientHeight: { value: 960 } });
  const rect = { left: 36, top: 900, right: 174, bottom: 928, width: 138, height: 28 };
  logo.getBoundingClientRect = () => rect;
  attribution.getBoundingClientRect = () => ({ ...rect, left: 190, right: 290, width: 100 });
  document.elementFromPoint = x => x < 180 ? logo : attribution;
  const visible = runInNewContext(`(${creditsAreVisible.toString()})`, { document, getComputedStyle: dom.window.getComputedStyle.bind(dom.window) });
  try {
    assert.equal(root.getBoundingClientRect().width, 0);
    assert.equal(visible(), true);
    root.style.display = 'none';
    assert.equal(visible(), false, 'hidden ancestry hides the credits');
    root.style.display = '';
    logo.style.visibility = 'hidden';
    assert.equal(visible(), false, 'the logo must remain visible');
    logo.style.visibility = '';
    attribution.style.opacity = '0';
    assert.equal(visible(), false, 'the attribution control must remain visible');
    attribution.style.opacity = '';
    document.elementFromPoint = () => document.body;
    assert.equal(visible(), false, 'an overlay must not cover the credit content');
    document.elementFromPoint = x => x < 180 ? logo : attribution;
    attribution.getBoundingClientRect = () => ({ ...rect, left: 1500, right: 1638 });
    assert.equal(visible(), false, 'offscreen attribution is not visible');
  } finally { dom.window.close(); }
});

test('mounted globe controls are not actionable until real startup restoration releases its cover', async (t) => {
  const styles = readFileSync(new URL('../../ui/styles/controls.css', import.meta.url), 'utf8');
  const coverCss = styles.match(/#loading-screen \{[\s\S]*?\}/)[0] + styles.match(/#loading-screen\.hidden \{[\s\S]*?\}/)[0];
  const dom = new JSDOM(`<style>${coverCss}</style><nav class="gih-globe-tools"></nav><div id="loading-screen"></div>`);
  const document = dom.window.document;
  const ready = runInNewContext(`(${globeControlsUncovered.toString()})`, {
    document, getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
  });
  let finishRestore;
  const initialRestorePromise = new Promise(resolve => { finishRestore = resolve; });
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const stop = startApplicationChrome({
    loadingScreen: document.getElementById('loading-screen'),
    styleManager: { initialRestorePromise }, dataManager: {}, signal: new AbortController().signal,
    initializeWelcome: () => null, initializeSettings: () => null,
  });
  try {
    assert.ok(document.querySelector('.gih-globe-tools'), 'the previous mount-only wait already passes');
    assert.equal(ready(), false);
    t.mock.timers.tick(1000);
    await new Promise(setImmediate);
    assert.equal(ready(), false, 'minimum delay alone does not finish restoration');
    finishRestore();
    await new Promise(setImmediate);
    assert.equal(ready(), true);
    assert.equal(dom.window.getComputedStyle(document.getElementById('loading-screen')).pointerEvents, 'none');
  } finally {
    await stop();
    t.mock.timers.reset();
    dom.window.close();
  }
});

test('the dedicated hub optimizer keeps redacted outdated-dependency diagnostics', () => {
  const failure = classifyQaResponse({
    url: 'http://localhost:4174/node_modules/.vite-custom-hub/deps/react_jsx-dev-runtime.js?v=TEST_ONLY',
    origin: 'http://localhost:4174',
    status: 504,
    statusText: 'Outdated Optimize Dep',
    resourceType: 'script',
  });
  assert.deepEqual(failure, { kind: 'optimized-dependency', status: 504, outdated: true });
  assert.equal(JSON.stringify(failure).includes('TEST_ONLY'), false);
});

test('a failed Vite dependency is diagnosed without copying its URL or response text', () => {
  const response = { url: 'http://localhost:4173/node_modules/.vite/deps/tailwind-merge.js?v=TEST_ONLY', origin: 'http://localhost:4173', status: 504, statusText: 'Outdated Optimize Dep', resourceType: 'script' };
  const failure = classifyQaResponse(response);
  assert.deepEqual(failure, { kind: 'optimized-dependency', status: 504, outdated: true });
  assert.equal(qaFailureCode(new Error('TEST_ONLY_DO_NOT_COPY'), { outdatedOptimizedDependencies: 1 }), 'outdated-optimized-dependency');
  assert.equal(JSON.stringify(failure).includes('TEST_ONLY'), false);
  for (const url of ['http://localhost:4173/api/setup/status', 'http://localhost:4173/mcp', 'https://provider.example/module.js']) {
    assert.equal(classifyQaResponse({ ...response, url }), null);
  }
  assert.equal(classifyQaResponse({ ...response, status: 200 }), null);
});

test('zero browser exceptions cannot pass when the hub never rendered', () => {
  assert.deepEqual(scriptErrorResult(false, 0), { passed: false, blockedBy: 'hub-startup' });
  assert.deepEqual(scriptErrorResult(true, 0), { passed: true });
  assert.deepEqual(scriptErrorResult(true, 1), { passed: false });
});

test('positive handoff replaces retained input using the installed Puppeteer click semantics', async () => {
  const origin = 'http://localhost:4173';
  const rejected = `${origin}/?api_key=TEST_ONLY_NOT_A_KEY`;
  const fixture = `${origin}/#v=2&lat=30.25&lon=-97.75&alt=800000&l=&map=osm&style=crt`;
  const input = { value: rejected };
  let selected = false;
  const pressedCounts = [];
  // No browser or protocol connection: exercise the installed input class with
  // an in-memory transport, rather than teaching a stub what our options mean.
  const transport = { async send(method, payload) {
    if (method === 'Input.dispatchMouseEvent' && payload.type === 'mousePressed') {
      pressedCounts.push(payload.clickCount);
      selected = payload.clickCount === 3;
    }
  } };
  const mouse = new CdpMouse(transport, new CdpKeyboard(transport));
  const page = {
    async click(selector, options) {
      assert.equal(selector, '#globe-share-link');
      await mouse.click(10, 10, options);
    },
    keyboard: {
      async press(key) {
        assert.equal(key, 'Backspace');
        if (selected) input.value = '';
        else input.value = input.value.slice(0, -1);
        selected = false;
      },
    },
    async type(selector, value) {
      assert.equal(selector, '#globe-share-link');
      input.value += value;
    },
    async $eval(selector, evaluate, value) {
      assert.equal(selector, '#globe-share-link');
      // Puppeteer serializes this callback; caller closures are unavailable.
      return runInNewContext(`(${evaluate.toString()})`)(input, value);
    },
  };

  // A hash-route visit can retain the controlled field; typing alone appends.
  await page.type('#globe-share-link', fixture);
  assert.throws(() => validateGlobeLink(input.value, { origin }));
  input.value = rejected;
  assert.equal(await replaceQaInput(page, '#globe-share-link', fixture), true);
  assert.deepEqual(pressedCounts, [1, 2, 3]);
  assert.equal(validateGlobeLink(input.value, { origin }), fixture);
});
