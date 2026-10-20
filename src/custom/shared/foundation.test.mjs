import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { validateBranding } from './branding.js';
import { applyTheme, setTheme, subscribeTheme } from './theme.js';
import { createGlobeUrl, validateGlobeLink } from './shareHandoff.js';

test('branding rejects external logos and unsafe accent values', () => {
  const result = validateBranding({ name: '  My hub  ', shortName: '', logo: 'https://elsewhere/mark.svg', accent: 'red;display:none' });
  assert.equal(result.name, 'My hub');
  assert.equal(result.logo, '/custom/brand.svg');
  assert.equal(result.accent, '#38BDF8');
});

test('theme persists, applies to both surfaces, and cleans up subscriptions', () => {
  const dom = new JSDOM('<html></html>', { url: 'http://localhost:4173' });
  const old = { document: globalThis.document, window: globalThis.window, localStorage: globalThis.localStorage };
  Object.assign(globalThis, { document: dom.window.document, window: dom.window, localStorage: dom.window.localStorage });
  try {
    let calls = 0;
    const dispose = subscribeTheme(() => calls++);
    setTheme('light');
    assert.equal(dom.window.localStorage.getItem('gih.theme.v1'), 'light');
    assert.equal(dom.window.document.documentElement.dataset.gihTheme, 'light');
    assert.equal(dom.window.document.documentElement.classList.contains('dark'), false);
    assert.equal(calls, 1);
    dispose();
    setTheme('dark');
    assert.equal(calls, 1);
    const other = new JSDOM('<html></html>');
    assert.equal(applyTheme(other.window.document), 'dark');
    assert.equal(other.window.document.documentElement.classList.contains('dark'), true);
    other.window.close();
  } finally { Object.assign(globalThis, old); dom.window.close(); }
});

test('handoff preserves full v2 state and rejects external, secret, or invalid camera links', () => {
  const origin = 'http://localhost:4173';
  const full = `${origin}/#v=2&lat=12.3&lon=-45&alt=800&style=flir&panel=events&scf=37`;
  assert.equal(validateGlobeLink(full, { origin }), full);
  assert.match(createGlobeUrl({ camera: { lat: 2, lon: 3 } }, { origin }), /#v=2&lat=2.0000&lon=3.0000/);
  for (const link of ['https://example.com/', '/hub/', '/#v=2&lat=Infinity&lon=1&alt=2', '/#v=2&lat=1&lon=2&alt=3&api_key=x', '/?token=x', '/#v=2&lat=1&lat=2&lon=3&alt=4']) {
    assert.throws(() => validateGlobeLink(link, { origin }));
  }
});
