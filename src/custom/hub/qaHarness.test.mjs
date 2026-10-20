import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { replaceQaInput } from '../../../scripts/qa-custom-hub-input.mjs';
import { validateGlobeLink } from '../shared/shareHandoff.js';

test('positive handoff replaces the rejected input retained by same-document navigation', async () => {
  const origin = 'http://localhost:4173';
  const rejected = `${origin}/?api_key=TEST_ONLY_NOT_A_KEY`;
  const fixture = `${origin}/#v=2&lat=30.25&lon=-97.75&alt=800000&l=&map=osm&style=crt`;
  const input = { value: rejected };
  let selected = false;
  const page = {
    async click(selector, options) {
      assert.equal(selector, '#globe-share-link');
      selected = options.clickCount === 3;
    },
    keyboard: {
      async press(key) {
        assert.equal(key, 'Backspace');
        if (selected) input.value = '';
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
  assert.equal(validateGlobeLink(input.value, { origin }), fixture);
});
