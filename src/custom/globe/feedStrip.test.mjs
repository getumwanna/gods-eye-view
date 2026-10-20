import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { LAYER_STATE_REGISTRY } from '../../data/layerState.js';
import { DATA_KINDS, getLayerMetadata, getSourceGuide } from '../shared/layerMetadata.js';
import { presentLayer, mountFeedStrip } from './feedStrip.js';
import { getKeyGuidanceModels, mountKeyBadges } from './keyBadges.js';

const NOW = 1_780_000_000_000;
const turn = () => new Promise((resolve) => setTimeout(resolve, 0));

function managerFixture(initialRows) {
  let rows = initialRows;
  const listeners = new Set();
  return {
    getAll: () => rows,
    subscribeActivity: (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    setEnabled: () => assert.fail('Custom presentation cannot enable a layer'),
    refreshLayerStats: () => assert.fail('Custom presentation cannot initiate refresh'),
    emit: (change = { type: 'status' }) => { for (const listener of [...listeners]) listener(change); },
    setRows: (next) => { rows = next; },
    listenerCount: () => listeners.size,
  };
}

test('all catalog values have known kinds and source references without implying live media', () => {
  const ids = [...LAYER_STATE_REGISTRY.map((layer) => layer.id), 'local-adsb'];
  assert.equal(ids.length, 32);
  for (const id of ids) {
    const metadata = getLayerMetadata(id);
    assert.ok(metadata, id);
    assert.ok(metadata.valueKinds.every((value) => DATA_KINDS.includes(value.kind)), id);
    assert.ok(metadata.sources.every((source) => getSourceGuide(source)), id);
  }
  assert.deepEqual(presentLayer({ id: 'traffic', enabled: true, stats: { mode: 'live', error: 'budget reached' } }).kinds.map((v) => v.kind), ['Simulated']);
  assert.deepEqual(presentLayer({ id: 'cctv', enabled: true, stats: {} }).kinds.map((v) => v.kind), ['Estimated']);
  assert.deepEqual(presentLayer({ id: 'radio', enabled: true, stats: {} }).kinds.map((v) => v.kind), ['Static']);
  assert.deepEqual(presentLayer({ id: 'unknown-layer' }).kinds, []);
});

test('health preserves explicit nonfallback GNSS, partial AIS, and unavailable manager errors', () => {
  const row = { id: 'gnss-integrity', enabled: true, source: 'adsb.lol', stats: { fallback: false } };
  assert.equal(presentLayer(row).health, 'nominal');
  assert.equal(presentLayer({ ...row, stats: {} }).health, 'fallback');
  assert.equal(presentLayer({ id: 'ais-live-vessels', enabled: true, stats: { partial: true } }).stateLabel, 'PARTIAL');
  assert.equal(presentLayer({ id: 'flights', enabled: true, stats: { managerRefreshError: new Error('down') } }).health, 'unavailable');
  assert.equal(presentLayer({ id: 'flights', enabled: false, stats: { stale: true } }).health, 'off');
});

test('pending and uncertain layers remain visible without treating settled OFF as active', () => {
  const enabling = presentLayer({ id: 'flights', enabled: false, lifecycleState: 'enabling', stats: { loading: true } });
  assert.equal(enabling.active, true);
  assert.equal(enabling.stateLabel, 'ENABLING · LOADING');
  const uncertain = presentLayer({ id: 'flights', enabled: false, lifecycleUncertain: true, stats: { stale: true } });
  assert.equal(uncertain.active, true);
  assert.equal(uncertain.stateLabel, 'UNCERTAIN · STALE');
  assert.equal(presentLayer({ id: 'flights', enabled: false }).active, false);
});

test('receipt and observation timestamps remain distinct and structured coverage is not stringified', () => {
  const row = presentLayer({ id: 'air-quality', enabled: true, stats: {
    lastUpdate: NOW - 60_000, observedAt: NOW - 3_600_000,
    coverage: { kind: 'subject', radiusM: 20_000 }, coverageLabel: 'WITHIN 20 KM',
  } }, { now: NOW });
  assert.equal(row.updateLabel, 'Last updated 1m ago');
  assert.equal(row.observation, NOW - 3_600_000);
  assert.equal(row.coverage, 'WITHIN 20 KM');
  const weather = presentLayer({ id: 'weather-radar', enabled: true, stats: { observedAt: '2026-10-20T10:00:00Z' } });
  assert.match(weather.observationLabel, /^Observed\/captured 2026-10-20T10:00:00/);
  const advisory = presentLayer({ id: 'weather-cyclones', enabled: true, stats: { advisoryAt: '2026-10-20T09:00:00Z' } });
  assert.match(advisory.observationLabel, /^Advisory issued/);
  for (const stamp of [undefined, null, 0, NaN, Infinity, 'not-a-time']) {
    const missing = presentLayer({ id: 'flights', enabled: true, stats: { lastUpdate: stamp, observedAt: stamp, coverage: {} } });
    assert.equal(missing.updateLabel, 'Update time unavailable');
    assert.equal(missing.observationLabel, null);
    assert.equal(missing.coverage, 'Coverage not reported here');
    assert.equal('count' in missing, false);
  }
});

test('passive mounted strip reflects updates, preserves PARTIAL and removes all activity ownership', () => {
  const dom = new JSDOM('<main></main>');
  const container = dom.window.document.querySelector('main');
  const manager = managerFixture([{ id: 'ais-live-vessels', name: '<img onerror=bad>', enabled: true, stats: { partial: true, count: 981, lastUpdate: null } }]);
  const stop = mountFeedStrip({ documentRef: dom.window.document, dataManager: manager, container });
  try {
    assert.match(container.textContent, /PARTIAL/);
    assert.doesNotMatch(container.textContent, /981/);
    assert.equal(container.querySelector('img'), null, 'layer text is never HTML');
    assert.match(container.textContent, /Update time unavailable/);
    manager.setRows([{ id: 'flights', enabled: true, stats: { stale: true, lastUpdate: Date.now() - 120_000 } }]);
    manager.emit();
    assert.match(container.textContent, /STALE/);
    assert.equal(container.querySelector('[data-layer-id="ais-live-vessels"]'), null);
    assert.equal(manager.listenerCount(), 1);
    manager.emit({ type: 'destroy-all' });
    assert.equal(manager.listenerCount(), 0);
    assert.equal(container.children.length, 0);
    manager.emit();
    assert.equal(container.children.length, 0);
  } finally { stop(); dom.window.close(); }
});

test('required-key models distinguish missing, unknown, rejected and optional provider modes', () => {
  const rows = [
    { id: 'ais-live-vessels', name: 'Vessels', enabled: false, stats: {} },
    { id: 'local-firms', name: 'Fires', enabled: false, requiresKeyId: 'firms', stats: {} },
    { id: 'flights', enabled: true, requiresKeyId: 'opensky', stats: {} },
    { id: 'traffic', enabled: true, requiresKeyId: 'tomtom', stats: { mode: 'sim' } },
    { id: 'street-level', enabled: true, requiresKeyId: null, stats: { keyRequired: false } },
  ];
  const missing = getKeyGuidanceModels(rows, { state: 'ready', keys: { aisstream: false, firms: false, opensky: false, tomtom: false } });
  assert.deepEqual(missing.map((row) => [row.layerId, row.state]), [['ais-live-vessels', 'missing'], ['local-firms', 'missing']]);
  assert.ok(getKeyGuidanceModels(rows, { state: 'unavailable', keys: { firms: false } }).every((row) => row.state === 'unknown'));
  assert.deepEqual(getKeyGuidanceModels(rows, { state: 'ready', keys: { aisstream: true, firms: true } }), []);
  const street = { id: 'street-level', enabled: true, requiresKeyId: 'mapillary', stats: { keyRequired: true } };
  const [rejected] = getKeyGuidanceModels([street], { state: 'ready', keys: { mapillary: true } });
  assert.equal(rejected.state, 'attention');
  assert.match(rejected.alternatives, /available provider alternatives/);
  assert.equal(rejected.sources[0].href, '/hub/#/library/sources/mapillary');
});

test('setup area waits for real POWER UP readiness, activates existing control and disconnects', async () => {
  const dom = new JSDOM('<main></main><button id="key-setup-chip"></button><aside id="key-setup"><div data-key-setup-rows></div></aside>');
  const documentRef = dom.window.document;
  let clicks = 0;
  documentRef.getElementById('key-setup-chip').addEventListener('click', () => clicks++);
  const manager = managerFixture([{ id: 'local-firms', name: 'Fires', enabled: false, stats: {} }]);
  const keyListeners = new Set();
  const presence = { state: 'ready', keys: { firms: false } };
  const keyAccess = { getSnapshot: () => presence, subscribe(fn) { keyListeners.add(fn); fn(presence); return () => keyListeners.delete(fn); } };
  const container = documentRef.querySelector('main');
  const stop = mountKeyBadges({ documentRef, dataManager: manager, keyAccess, container });
  try {
    assert.equal(container.querySelector('.gih-power-button').disabled, true);
    const row = documentRef.createElement('section');
    row.dataset.keyId = 'firms';
    documentRef.querySelector('[data-key-setup-rows]').append(row);
    await turn();
    const button = container.querySelector('.gih-power-button');
    assert.equal(button.disabled, false);
    assert.equal(container.querySelector('summary').textContent, 'Setup · Needs key', 'missing-key guidance remains visible while collapsed');
    const link = container.querySelector('a');
    link.focus();
    manager.emit();
    assert.equal(documentRef.activeElement, link, 'status refresh preserves focused setup links');
    button.click();
    assert.equal(clicks, 1);
    assert.equal(container.querySelector('a').getAttribute('href'), '/hub/#/library/sources/firms');
    stop();
    assert.equal(keyListeners.size, 0);
    assert.equal(manager.listenerCount(), 0);
    button.click();
    assert.equal(clicks, 1, 'detached controls no longer activate settings');
  } finally { stop(); dom.window.close(); }
});

test('unavailable setup surface keeps unknown distinct from missing and disables POWER UP', () => {
  const dom = new JSDOM('<main></main>');
  const manager = managerFixture([{ id: 'ais-live-vessels', name: 'Vessels', enabled: false, stats: {} }]);
  const presence = { state: 'unavailable', keys: { aisstream: null } };
  const keyAccess = { getSnapshot: () => presence, subscribe(fn) { fn(presence); return () => {}; } };
  const container = dom.window.document.querySelector('main');
  const stop = mountKeyBadges({ documentRef: dom.window.document, dataManager: manager, keyAccess, container });
  try {
    assert.match(container.textContent, /Unknown/);
    assert.doesNotMatch(container.textContent, /Needs key/);
    assert.match(container.textContent, /POWER UP is unavailable/);
    assert.equal(container.querySelector('.gih-power-button').disabled, true);
  } finally { stop(); dom.window.close(); }
});
