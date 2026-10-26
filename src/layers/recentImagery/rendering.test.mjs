import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TILE_RENDER_REASON,
  TILE_RETRY_DELAY_MS,
  createRecentImageryRenderer,
} from './rendering.js';
import { BOX, manualTimers } from './testDoubles.mjs';

/** A provider whose tile requests stay pending until the test settles them. */
class UrlTemplateImageryProvider {
  constructor(options) {
    this.options = options;
    this.calls = [];
    this.pending = [];
  }
  requestImage(x, y, level) {
    this.calls.push([x, y, level]);
    return new Promise((resolve) => this.pending.push(resolve));
  }
}

function fakeCesium(requestImage) {
  class Provider extends UrlTemplateImageryProvider {}
  if (requestImage) Provider.prototype.requestImage = requestImage;
  return {
    UrlTemplateImageryProvider: Provider,
    WebMercatorTilingScheme: class {},
    Rectangle: {
      fromDegrees: (west, south, east, north) => ({ west, south, east, north }),
    },
    SplitDirection: { LEFT: -1, NONE: 0, RIGHT: 1 },
  };
}

function fakeCollection() {
  const layers = [];
  return {
    layers,
    addImageryProvider(provider) {
      const layer = { provider, alpha: 1, splitDirection: 0 };
      layers.push(layer);
      return layer;
    },
    remove(layer, destroy) {
      layers.splice(layers.indexOf(layer), 1);
      layer.destroyed = destroy;
    },
  };
}

const S30 = { key: 'S30:2026-09-18', product: 'S30', day: '2026-09-18' };
const L30 = { key: 'L30:2026-09-16', product: 'L30', day: '2026-09-16' };
const VIIRS = { key: 'VIIRS:2026-09-20', product: 'VIIRS', day: '2026-09-20' };

function fixture({ requestImage, maxTileRequests, ...options } = {}) {
  const renders = [];
  const timers = manualTimers();
  const renderer = createRecentImageryRenderer({
    ...options,
    cesium: fakeCesium(requestImage),
    maxTileRequests,
    requestRender: (reason) => renders.push(reason),
    setTimeoutImpl: timers.setTimeoutImpl,
    clearTimeoutImpl: timers.clearTimeoutImpl,
  });
  const globe = fakeCollection();
  renderer.rebind({ collection: globe, kind: 'globe' });
  const tileFrames = () =>
    renders.filter((reason) => reason === TILE_RENDER_REASON).length;
  return { renderer, globe, renders, timers, tileFrames };
}

test('a slot drapes one GIBS provider bounded to the box; the same day only restyles it', () => {
  const { renderer, globe, renders } = fixture();
  assert.equal(renderer.showSlot('a', S30, BOX, { alpha: 0.8 }), true);
  const [layer] = globe.layers;
  assert.match(
    layer.provider.options.url,
    /^https:\/\/gibs-\{s\}\.earthdata\.nasa\.gov\/.*HLS_S30.*\/2026-09-18\/GoogleMapsCompatible_Level12\/\{z\}\/\{y\}\/\{x\}\.png$/,
  );
  assert.deepEqual(layer.provider.options.subdomains, ['a', 'b', 'c']);
  assert.equal(layer.provider.options.credit, 'NASA GIBS');
  assert.deepEqual(layer.provider.options.rectangle, BOX);
  assert.equal(layer.alpha, 0.8);
  assert.deepEqual(renders, ['recent-imagery-show']);
  assert.deepEqual(renderer.getOwned().a, {
    key: 'S30:2026-09-18',
    kind: 'globe',
    alpha: 0.8,
    split: 'none',
  });
  renderer.showSlot('a', S30, BOX, { alpha: 0.5, splitDirection: 'left' });
  assert.deepEqual(globe.layers, [layer], 'the layer is reused');
  assert.equal(layer.splitDirection, -1);
  // A different day replaces the layer in its own collection.
  renderer.showSlot('a', L30, BOX);
  assert.equal(layer.destroyed, true);
  assert.equal(globe.layers.length, 1);
  // VIIRS is a level-9 JPEG overview with no alpha channel.
  renderer.showSlot('b', VIIRS, BOX, { splitDirection: 'right' });
  assert.equal(globe.layers[1].provider.options.maximumLevel, 9);
  assert.equal(globe.layers[1].provider.options.hasAlphaChannel, false);
  assert.equal(globe.layers[1].splitDirection, 1);
  renderer.setAlpha('b', 7);
  assert.equal(globe.layers[1].alpha, 1, 'alpha clamps to 0–1');
});

test('rapid replacement never owns more than two layers', () => {
  const { renderer, globe } = fixture();
  const days = [S30, L30, VIIRS];
  for (let i = 0; i < 10; i += 1) {
    renderer.showSlot('a', days[i % 3], BOX);
    renderer.showSlot('b', days[(i + 1) % 3], BOX);
    if (i % 4 === 0) renderer.hideSlot('a');
    assert.ok(globe.layers.length <= 2 && renderer.ownedCount() <= 2);
  }
  renderer.hideSlot('a');
  renderer.hideSlot('b');
  assert.equal(globe.layers.length, 0);
});

test('rebind rebuilds the owned layers on the new host and leaves the old one empty', () => {
  const { renderer, globe } = fixture();
  renderer.showSlot('a', S30, BOX, { alpha: 0.6, splitDirection: 'left' });
  renderer.showSlot('b', L30, BOX, { splitDirection: 'right' });
  const tileset = fakeCollection();
  renderer.rebind({ collection: tileset, kind: 'tileset' });
  assert.equal(globe.layers.length, 0);
  assert.deepEqual(
    tileset.layers.map((layer) => [layer.alpha, layer.splitDirection]),
    [
      [0.6, -1],
      [1, 1],
    ],
  );
  assert.equal(renderer.getOwned().a.kind, 'tileset');
  renderer.rebind({ collection: null, kind: 'none' });
  assert.equal(tileset.layers.length, 0);
  assert.equal(renderer.showSlot('a', S30, BOX), false);
  renderer.rebind({ collection: globe, kind: 'globe' });
  renderer.showSlot('a', S30, BOX);
  renderer.destroy();
  assert.equal(globe.layers.length, 0);
  assert.equal(renderer.showSlot('a', S30, BOX), false, 'destroyed');
});

test('above the tile limit a request defers silently; its settlement asks for exactly one frame', async () => {
  const { renderer, globe, timers, tileFrames } = fixture({
    maxTileRequests: 1,
  });
  renderer.showSlot('a', S30, BOX);
  const { provider } = globe.layers[0];
  const first = provider.requestImage(0, 0, 1);
  assert.ok(first instanceof Promise);
  for (let i = 1; i <= 120; i += 1)
    assert.equal(provider.requestImage(i, 0, 1), undefined);
  assert.equal(provider.calls.length, 1, 'deferred requests never go out');
  assert.equal(tileFrames(), 0, 'a deferral asks for no frame');
  assert.equal(timers.armed(), 0);
  provider.pending[0]('tile');
  await first;
  assert.equal(tileFrames(), 1, 'the settlement asks for the retry frame');
  assert.ok(provider.requestImage(200, 0, 1) instanceof Promise);
});

test('upstream deferrals from both slots share one delayed retry frame; destroy disarms it', () => {
  let throwNext = false;
  const { renderer, globe, timers, tileFrames } = fixture({
    maxTileRequests: 1,
    requestImage() {
      if (throwNext) throw new Error('boom');
      return undefined;
    },
  });
  renderer.showSlot('a', S30, BOX);
  renderer.showSlot('b', L30, BOX);
  for (const { provider } of globe.layers)
    for (let i = 0; i < 40; i += 1)
      assert.equal(provider.requestImage(i, 0, 0), undefined);
  // Every deferral released its slot (the limit is one), and none asked
  // for a frame of its own: one timer holds the single retry.
  assert.equal(tileFrames(), 0);
  assert.equal(timers.armed(), 1);
  assert.equal([...timers.pending.values()][0].ms, TILE_RETRY_DELAY_MS);
  timers.flush();
  assert.equal(tileFrames(), 1);
  // A throwing provider releases its slot too.
  throwNext = true;
  assert.throws(() => globe.layers[0].provider.requestImage(0, 0, 0), /boom/);
  throwNext = false;
  globe.layers[0].provider.requestImage(0, 0, 0);
  assert.equal(timers.armed(), 1, 'the next deferral arms a fresh timer');
  renderer.destroy();
  assert.equal(timers.armed(), 0, 'destroy disarms the retry');
  assert.equal(tileFrames(), 1);
});

test('against the basemap slot a splits left with no second layer, and leaving the swipe only restyles it', () => {
  const { renderer, globe, renders } = fixture();
  renderer.showSlot('a', S30, BOX, { splitDirection: 'left' });
  renderer.hideSlot('b');
  assert.equal(globe.layers.length, 1, 'the basemap is the right side');
  assert.equal(globe.layers[0].splitDirection, -1);
  assert.equal(renderer.getOwned().b, null);
  const [layer] = globe.layers;
  renderer.showSlot('a', S30, BOX, { splitDirection: 'none' });
  assert.deepEqual(globe.layers, [layer], 'no rebuild for a new look');
  assert.equal(layer.splitDirection, 0);
  assert.deepEqual(renders, ['recent-imagery-show', 'recent-imagery-look']);
});

test('replacement imagery uses source-owned tile URLs and credit and tears down normally', () => {
  const { renderer, globe } = fixture({
    tileTemplate: (product, day) =>
      `https://tiles.example/${product}/${day}/{z}/{x}/{y}`,
    credit: 'Example imagery',
  });
  assert.equal(renderer.showSlot('a', S30, BOX), true);
  const layer = globe.layers[0];
  assert.equal(
    layer.provider.options.url,
    'https://tiles.example/S30/2026-09-18/{z}/{x}/{y}',
  );
  assert.equal(layer.provider.options.credit, 'Example imagery');
  renderer.destroy();
  assert.equal(globe.layers.length, 0);
  assert.equal(layer.destroyed, true);
});

test('S2 keeps exact per-slot identity/credits and releases stale asynchronous images', async () => {
  const calls = [],
    releases = [],
    events = [];
  const cesium = {
    ...fakeCesium(),
    SingleTileImageryProvider: class {
      constructor(options) {
        this.options = options;
      }
      requestImage() {
        return new Promise((resolve) => {
          this.finish = resolve;
        });
      }
    },
  };
  const renderer = createRecentImageryRenderer({
    cesium,
    imageSource: {
      getImage(candidate, box, { signal }) {
        return new Promise((resolve, reject) =>
          calls.push({ candidate, box, signal, resolve, reject }),
        );
      },
    },
  });
  const globe = fakeCollection();
  renderer.rebind({ collection: globe, kind: 'globe' });
  renderer.subscribe((event) => events.push(event));
  const a = {
    key: `S2:2026-10-01:${'a'.repeat(64)}`,
    product: 'S2',
    day: '2026-10-01',
  };
  const b = {
    key: `S2:2026-09-30:${'b'.repeat(64)}`,
    product: 'S2',
    day: '2026-09-30',
  };
  const snapshot = (id) => ({
    url: `blob:${id}`,
    width: 1000,
    height: 800,
    metadata: {
      box: BOX,
      credit: `Contains modified Copernicus Sentinel data 2026 · ${id}`,
    },
    release: () => releases.push(id),
  });
  renderer.showSlot('a', a, BOX);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(renderer.getDisplayState().a.loaded, false);
  renderer.showSlot('a', b, BOX);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(calls[0].signal.aborted, true);
  calls[0].resolve(snapshot('obsolete'));
  calls[1].resolve(snapshot('current'));
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.deepEqual(releases, ['obsolete']);
  assert.equal(renderer.getOwned().a.key, b.key);
  assert.equal(globe.layers.length, 1);
  assert.equal(globe.layers[0].provider.options.tileWidth, 1000);
  assert.match(globe.layers[0].provider.options.credit, /2026 · current/);
  assert.equal(
    renderer.getDisplayState().a.loaded,
    false,
    'metadata alone is not decoded imagery',
  );
  const decoded = globe.layers[0].provider.requestImage();
  globe.layers[0].provider.finish({ decoded: true });
  await decoded;
  assert.equal(renderer.getDisplayState().a.loaded, true);
  assert.equal(events.filter((event) => event.type === 'loaded').length, 1);
  const next = fakeCollection();
  renderer.rebind({ collection: next, kind: 'globe' });
  assert.equal(globe.layers.length, 0);
  assert.equal(next.layers.length, 1);
  assert.deepEqual(
    releases,
    ['obsolete'],
    'host rebind retains the native snapshot',
  );
  renderer.destroy();
  assert.deepEqual(releases, ['obsolete', 'current']);
});

test('oversized S2 chunks retain fixed clipped bounds and share one logical A/B slot', async () => {
  const cesium = {
    ...fakeCesium(),
    SingleTileImageryProvider: class {
      constructor(options) {
        this.options = options;
      }
      requestImage() {
        return Promise.resolve({ decoded: true });
      }
    },
  };
  let released = 0;
  const right = { ...BOX, west: (BOX.west + BOX.east) / 2 };
  const left = { ...BOX, east: right.west };
  const renderer = createRecentImageryRenderer({
    cesium,
    imageSource: {
      getImage: async () => ({
        parts: [
          { url: 'blob:left', width: 512, height: 512, bounds: left },
          { url: 'blob:right', width: 23, height: 512, bounds: right },
        ],
        metadata: { credit: 'Contains modified Copernicus Sentinel data 2026' },
        release: () => released++,
      }),
    },
  });
  const globe = fakeCollection();
  renderer.rebind({ collection: globe, kind: 'globe' });
  renderer.showSlot(
    'a',
    { key: 'exact-acquisition', product: 'S2', day: '2026-10-01' },
    BOX,
    { alpha: 0.4, splitDirection: 'left' },
  );
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(renderer.ownedCount(), 1);
  assert.equal(globe.layers.length, 2);
  assert.deepEqual(
    globe.layers.map((layer) => layer.provider.options.rectangle),
    [left, right],
  );
  assert.deepEqual(
    globe.layers.map((layer) => [layer.alpha, layer.splitDirection]),
    [
      [0.4, -1],
      [0.4, -1],
    ],
  );
  renderer.hideSlot('a');
  assert.equal(globe.layers.length, 0);
  assert.equal(released, 1);
  renderer.destroy();
});

test('a failed S2 PNG decode never becomes loaded and releases the native snapshot', async () => {
  let released = 0;
  const events = [];
  const cesium = {
    ...fakeCesium(),
    SingleTileImageryProvider: class {
      requestImage() {
        return new Promise((resolve, reject) => {
          this.reject = reject;
        });
      }
    },
  };
  const renderer = createRecentImageryRenderer({
    cesium,
    imageSource: {
      getImage: async () => ({
        url: 'blob:invalid',
        width: 128,
        height: 128,
        release: () => released++,
      }),
    },
  });
  const globe = fakeCollection();
  renderer.rebind({ collection: globe, kind: 'globe' });
  renderer.subscribe((event) => events.push(event));
  renderer.showSlot(
    'a',
    { key: 'decode', product: 'S2', day: '2026-10-01' },
    BOX,
  );
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(renderer.getDisplayState().a.loaded, false);
  assert.equal(renderer.getSnapshot('a'), null);
  const invalid = globe.layers[0].provider.requestImage();
  globe.layers[0].provider.reject(new Error('invalid PNG'));
  await assert.rejects(invalid, /invalid PNG/);
  assert.equal(renderer.getOwned().a, null);
  assert.equal(released, 1);
  assert.equal(events.filter((event) => event.type === 'loaded').length, 0);
  assert.equal(events.filter((event) => event.type === 'error').length, 1);
  renderer.destroy();
});

test('S2 partial chunk mount is transactional and a missing host cancels pending assignments', async () => {
  const requests = [],
    events = [];
  let releases = 0,
    constructed = 0;
  const cesium = {
    ...fakeCesium(),
    SingleTileImageryProvider: class {
      constructor() {
        if (++constructed === 2) throw new Error('fixture mount refused');
      }
      requestImage() {
        return Promise.resolve({ decoded: true });
      }
    },
  };
  const renderer = createRecentImageryRenderer({
    cesium,
    imageSource: {
      getImage(candidate, box, { signal }) {
        return new Promise((resolve) => requests.push({ resolve, signal }));
      },
    },
  });
  const globe = fakeCollection();
  renderer.rebind({ collection: globe, kind: 'globe' });
  renderer.subscribe((event) => events.push(event));
  const candidate = { key: 'transaction', product: 'S2', day: '2026-10-01' };
  renderer.showSlot('a', candidate, BOX);
  await new Promise((resolve) => setTimeout(resolve, 0));
  requests[0].resolve({
    parts: [
      { url: 'blob:1', width: 512, height: 1 },
      { url: 'blob:2', width: 1, height: 1 },
    ],
    release: () => releases++,
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(globe.layers.length, 0);
  assert.equal(renderer.ownedCount(), 0);
  assert.equal(releases, 1);
  assert.equal(events.filter((event) => event.type === 'error').length, 1);
  renderer.showSlot('a', candidate, BOX);
  await new Promise((resolve) => setTimeout(resolve, 0));
  renderer.rebind(null);
  assert.equal(requests[1].signal.aborted, true);
  requests[1].resolve({
    url: 'blob:obsolete',
    width: 1,
    height: 1,
    release: () => releases++,
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  renderer.rebind({ collection: globe, kind: 'globe' });
  renderer.showSlot('a', candidate, BOX);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(
    requests.length,
    3,
    'a cancelled no-host generation cannot strand the slot',
  );
  renderer.destroy();
  requests[2].resolve({
    url: 'blob:late',
    width: 1,
    height: 1,
    release: () => releases++,
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(releases, 3);
  assert.equal(globe.layers.length, 0);
});

test('local S2 preflight resolves a four-chunk offscreen assignment without waiting for Cesium culling', async () => {
  const requested = [],
    calls = [];
  const cesium = {
    ...fakeCesium(),
    SingleTileImageryProvider: class {
      constructor(options) {
        this.options = options;
      }
      requestImage() {
        requested.push(this.options.url);
        return Promise.resolve({ decoded: true });
      }
    },
  };
  const renderer = createRecentImageryRenderer({
    cesium,
    imageSource: {
      getImage: async (...args) => {
        calls.push(args);
        return {
          parts: Array.from({ length: 4 }, (_, index) => ({
            url: `blob:offscreen-${index}`,
            width: index === 3 ? 23 : 512,
            height: 512,
            bounds: {
              ...BOX,
              west: BOX.west + ((BOX.east - BOX.west) * index) / 4,
              east: BOX.west + ((BOX.east - BOX.west) * (index + 1)) / 4,
            },
          })),
          release() {},
        };
      },
    },
  });
  const globe = fakeCollection();
  renderer.rebind({ collection: globe, kind: 'globe' });
  renderer.showSlot(
    'a',
    { key: 'offscreen', product: 'S2', day: '2026-10-01' },
    BOX,
  );
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.deepEqual(requested.sort(), [
    'blob:offscreen-0',
    'blob:offscreen-1',
    'blob:offscreen-2',
    'blob:offscreen-3',
  ]);
  assert.equal(renderer.getDisplayState().a.loaded, true);
  await globe.layers[0].provider.requestImage(0, 0, 0);
  assert.equal(
    requested.length,
    4,
    'the visible chunk reuses its primed decode',
  );
  assert.equal(
    calls.length,
    1,
    'local decode does not issue another Process acquisition',
  );
  renderer.destroy();
});
