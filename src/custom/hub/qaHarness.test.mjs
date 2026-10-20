import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { CdpMouse, CdpKeyboard } from 'puppeteer';
import { replaceQaInput } from '../../../scripts/qa-custom-hub-input.mjs';
import { validateGlobeLink } from '../shared/shareHandoff.js';
import { classifyQaResponse, qaFailureCode, scriptErrorResult } from '../../../scripts/qa-custom-hub-diagnostics.mjs';

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
