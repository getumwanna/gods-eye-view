import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { createApplication } from '../../app/application.js';
import { applyDocumentTranslations, setLocale } from '../../i18n/index.js';
import { installHubGlobeCustomization } from './bootstrap.js';
import { branding } from '../shared/branding.js';

const sceneChrome = readFileSync(new URL('../../ui/templates/scene-chrome.html', import.meta.url), 'utf8');
const loading = readFileSync(new URL('../../ui/templates/hud-loading.html', import.meta.url), 'utf8');
const settings = readFileSync(new URL('../../ui/templates/provider-settings.html', import.meta.url), 'utf8');
const turn = () => new Promise((resolve) => setTimeout(resolve, 0));

function fixture(url = 'http://localhost:4173/') {
  const dom = new JSDOM(`<html><head><title>Original</title><link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png"><link rel="icon" type="image/svg+xml" href="/logo.svg"></head><body>${sceneChrome}${loading}${settings}<div id="test-credit">Provider credit unchanged</div><p id="test-disclaimer">Not for operational use</p></body></html>`, { url });
  const old = Object.fromEntries(['document', 'window', 'localStorage', 'fetch', 'GEV_EMBED_INLINE'].map((key) => [key, globalThis[key]]));
  Object.assign(globalThis, { document: dom.window.document, window: dom.window, localStorage: dom.window.localStorage });
  let rows = [{ id: 'local-firms', name: 'FIRMS Active Fires', enabled: false, stats: {} }];
  const activity = new Set();
  const dataManager = {
    getAll: () => rows,
    subscribeActivity(callback) { activity.add(callback); return () => activity.delete(callback); },
    setEnabled: () => assert.fail('Custom code cannot enable layers'),
    refreshLayerStats: () => assert.fail('Custom code cannot refresh layers'),
  };
  return {
    dom, dataManager, activity,
    setRows(next) { rows = next; for (const fn of activity) fn({ type: 'status' }); },
    close() { Object.assign(globalThis, old); dom.window.close(); },
  };
}

test('real application readiness mounts once; branding precedes gaze and preserves structure/notices', async () => {
  const f = fixture();
  const documentRef = f.dom.window.document;
  let requests = 0;
  let requestSignal;
  globalThis.fetch = async (url, options) => {
    requests++;
    assert.equal(url, '/api/setup/status');
    requestSignal = options.signal;
    return { ok: true, json: async () => ({ keys: [{ id: 'firms', set: false, value: 'NEVER-RENDER-THIS' }] }) };
  };
  const application = createApplication({
    createScene() {
      assert.equal(documentRef.querySelectorAll('[data-logo-gaze]').length, 0, 'brand binds before scene/gaze construction');
      return {};
    },
    createControls: () => ({}),
    createData: () => ({ dataManager: f.dataManager }),
    createTools: () => ({}),
  });
  const stop = installHubGlobeCustomization(application, { documentRef, windowRef: f.dom.window });
  try {
    assert.equal(documentRef.title, branding.name);
    assert.equal(documentRef.querySelector('#title-bar h1 .brand-logo img').getAttribute('src'), branding.logo);
    assert.equal(documentRef.querySelector('#title-bar [translate="no"]').textContent, branding.name);
    assert.equal(documentRef.querySelector('#loading-screen h2').textContent, branding.shortName);
    for (const icon of documentRef.querySelectorAll('link[rel="icon"]')) assert.equal(icon.getAttribute('href'), branding.logo);
    assert.equal(documentRef.querySelector('.gih-globe-tools'), null, 'no ready-time UI before application start');
    assert.equal(requests, 0);
    await application.start();
    await turn();
    assert.equal(requests, 1);
    assert.equal(documentRef.querySelectorAll('.gih-globe-tools').length, 1);
    assert.equal(documentRef.querySelector('.gih-globe-tools').parentNode.id, 'title-bar', 'tools follow the real title rather than overlapping its fixed position');
    assert.equal(documentRef.querySelector('.gih-back-link').getAttribute('href'), '/hub/#/dashboard');
    assert.match(documentRef.querySelector('.gih-key-badges').textContent, /Needs key/);
    assert.doesNotMatch(documentRef.body.textContent, /NEVER-RENDER-THIS/);
    const feedDetails = documentRef.querySelector('.gih-feed-strip');
    feedDetails.open = true;
    feedDetails.querySelector('.gih-popup-close').click();
    assert.equal(feedDetails.open, false);
    assert.equal(documentRef.activeElement, feedDetails.querySelector('summary'));
    feedDetails.open = true;
    documentRef.getElementById('test-credit').dispatchEvent(new f.dom.window.Event('pointerdown', { bubbles: true }));
    assert.equal(feedDetails.open, false, 'interacting with upstream controls dismisses the custom popup');
    feedDetails.open = true;
    feedDetails.querySelector('summary').focus();
    feedDetails.querySelector('summary').dispatchEvent(new f.dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    assert.equal(feedDetails.open, false);
    setLocale('es');
    applyDocumentTranslations(documentRef);
    assert.equal(documentRef.querySelector('#title-bar [translate="no"]').textContent, branding.name);
    assert.equal(documentRef.querySelector('#title-bar .subtitle').textContent, 'Local personal workspace');
    assert.equal(documentRef.querySelector('#loading-screen h2').textContent, branding.shortName);
    assert.equal(documentRef.getElementById('test-credit').textContent, 'Provider credit unchanged');
    assert.equal(documentRef.getElementById('test-disclaimer').textContent, 'Not for operational use');
    await application.start();
    assert.equal(requests, 1);
    await application.destroy();
    assert.equal(f.activity.size, 0);
    assert.equal(requestSignal.aborted, true);
    assert.equal(documentRef.querySelector('.gih-globe-tools'), null);
    assert.equal('gevHubCustomization' in documentRef.documentElement.dataset, false);
  } finally { stop(); await application.destroy(); setLocale('en'); f.close(); }
});

test('real application destruction aborts pending configuration and cannot paint a late response', async () => {
  const f = fixture();
  let resolveResponse;
  let requestSignal;
  let requests = 0;
  globalThis.fetch = (_url, options) => {
    requests++;
    requestSignal = options.signal;
    return new Promise((resolve) => { resolveResponse = resolve; });
  };
  const application = createApplication({
    createScene: () => ({}), createControls: () => ({}),
    createData: () => ({ dataManager: f.dataManager }), createTools: () => ({}),
  });
  const stop = installHubGlobeCustomization(application, { documentRef: f.dom.window.document, windowRef: f.dom.window });
  try {
    await application.start();
    await turn();
    assert.equal(requests, 1);
    await application.destroy();
    assert.equal(requestSignal.aborted, true);
    resolveResponse({ ok: true, json: async () => ({ keys: [{ id: 'firms', set: false }] }) });
    await turn();
    assert.equal(f.dom.window.document.querySelector('.gih-globe-tools'), null);
    assert.equal(f.activity.size, 0);
    assert.equal(requests, 1);
  } finally { stop(); await application.destroy(); f.close(); }
});

test('startup failure cleans early custom ownership without issuing setup or provider requests', async () => {
  const f = fixture();
  globalThis.fetch = () => assert.fail('No request before application readiness');
  const application = createApplication({
    createScene: () => { throw new Error('scene failed'); },
    createControls: () => ({}), createData: () => ({ dataManager: f.dataManager }), createTools: () => ({}),
  });
  const stop = installHubGlobeCustomization(application, { documentRef: f.dom.window.document, windowRef: f.dom.window });
  try {
    await assert.rejects(application.start(), /scene failed/);
    assert.equal('gevHubCustomization' in f.dom.window.document.documentElement.dataset, false);
    assert.equal(f.dom.window.document.querySelector('.gih-globe-tools'), null);
    assert.equal(f.activity.size, 0);
  } finally { stop(); f.close(); }
});

test('embedded, inline and panel surfaces receive no custom branding, listeners or requests', () => {
  for (const mode of ['embed', 'inline', 'panel']) {
    const f = fixture(mode === 'embed' ? 'http://localhost:4173/?embed=1' : mode === 'panel' ? 'http://localhost:4173/panel/index.html' : undefined);
    if (mode === 'inline') globalThis.GEV_EMBED_INLINE = true;
    globalThis.fetch = () => assert.fail('Embedded surface cannot request setup');
    const application = { subscribe: () => assert.fail('Embedded surface cannot subscribe') };
    try {
      const stop = installHubGlobeCustomization(application, { documentRef: f.dom.window.document, windowRef: f.dom.window });
      assert.equal(f.dom.window.document.title, 'Original');
      assert.ok(f.dom.window.document.querySelector('[data-logo-gaze]'));
      assert.equal('gevHubCustomization' in f.dom.window.document.documentElement.dataset, false);
      stop();
    } finally { f.close(); }
  }
});
