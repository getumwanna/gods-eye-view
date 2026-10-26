import test from 'node:test';
import assert from 'node:assert/strict';
import { createRecentImagerySource } from './source.js';

test('imagery source routes catalog, thumbnails and tiles through supplied adapters', async () => {
  const controller = new AbortController();
  const query = {
    box: { west: 0, east: 1, south: 0, north: 1 },
    signal: controller.signal,
  };
  const candidate = { product: 'S30', day: '2026-10-01' };
  const calls = [];
  const fetchImpl = async (...args) => {
    calls.push(args);
    return new Response('image');
  };
  const source = createRecentImagerySource({
    fetchImpl,
    search: async (request) => {
      assert.equal(request.fetchImpl, fetchImpl);
      assert.equal(request.signal, controller.signal);
      assert.equal(request.box, query.box);
      return [candidate];
    },
    thumbnailUrl: ({ product, day, width }) =>
      `https://imagery.example/${product}/${day}/${width}`,
    tileTemplate: (product, day) =>
      `https://tiles.example/${product}/${day}/{z}/{x}/{y}`,
    credit: 'Example imagery',
  });
  assert.deepEqual(await source.searchHls(query), [candidate]);
  assert.equal(
    await (
      await source.getThumbnail(candidate, query.box, {
        signal: controller.signal,
      })
    ).text(),
    'image',
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'https://imagery.example/S30/2026-10-01/256');
  assert.equal(calls[0][1].signal, controller.signal);
  assert.equal(
    source.getTileTemplate(candidate.product, candidate.day),
    'https://tiles.example/S30/2026-10-01/{z}/{x}/{y}',
  );
  assert.equal(source.credit, 'Example imagery');
});

test('cancelled thumbnail acquisition does not return stale responses or retry', async () => {
  const controller = new AbortController();
  let calls = 0;
  const source = createRecentImagerySource({
    thumbnailUrl: () => 'https://imagery.example/thumbnail',
    fetchImpl: async () => {
      calls++;
      controller.abort();
      return new Response('image');
    },
  });
  await assert.rejects(
    source.getThumbnail({}, {}, { signal: controller.signal }),
    { name: 'AbortError' },
  );
  await assert.rejects(
    source.getThumbnail({}, {}, { signal: controller.signal }),
    { name: 'AbortError' },
  );
  assert.equal(calls, 1);
});

test('application S2 thumbnail adapter cancels hidden work and keeps NASA probe policy separate', async () => {
  const { createApplicationImageryThumbnails } =
    await import('../../app/layers/recentImagery.js');
  const nasaCalls = [],
    requests = [],
    revoked = [];
  const nasa = {
    get: () => ({ status: 'unknown' }),
    request: (...args) => nasaCalls.push(args),
    requestOrdered: (...args) => nasaCalls.push(args),
    subscribe: () => () => {},
    clear() {},
    destroy() {},
  };
  let previewLeases = 0;
  const source = {
    reserveWorkingBytes(bytes) {
      assert.equal(bytes, 128 * 128 * 16);
      previewLeases++;
      return {
        release() {
          previewLeases--;
        },
      };
    },
    getThumbnail(candidate, box, { signal, size }) {
      return new Promise((resolve) =>
        requests.push({ candidate, box, signal, size, resolve }),
      );
    },
  };
  const loader = createApplicationImageryThumbnails(source, {
    nasa,
    createObjectUrl: () => 'blob:visible',
    revokeObjectUrl: (url) => revoked.push(url),
  });
  const a = { key: 'exact-a', product: 'S2' },
    b = { key: 'exact-b', product: 'S2' };
  const box = { west: 0, south: 0, east: 1, north: 1 };
  loader.setVisibleCandidates([a]);
  loader.request(a, box);
  loader.request(b, box);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(requests.length, 1);
  assert.equal(requests[0].size, 128);
  loader.setVisibleCandidates([b]);
  assert.equal(requests[0].signal.aborted, true);
  requests[0].resolve(
    new Response('old', { headers: { 'Data-Present': 'true' } }),
  );
  loader.request(b, box);
  await new Promise((resolve) => setTimeout(resolve, 0));
  requests[1].resolve(
    new Response('visible', {
      headers: {
        'Data-Present': 'true',
        'Acquisition-Time': '2026-10-01T00:00:00Z',
      },
    }),
  );
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(loader.get(b.key).objectUrl, 'blob:visible');
  assert.equal(loader.get(a.key).status, 'unknown');
  loader.request({ key: 'nasa', product: 'S30' }, box, 3);
  assert.equal(nasaCalls.length, 1);
  loader.destroy();
  assert.deepEqual(revoked, ['blob:visible']);
  assert.equal(previewLeases, 0);
});

test('actual catalog shape flows through client/layer/renderer: offscreen restoration, explicit decode fit, and decode failure', async () => {
  const { candidatesFromCatalog, catalogQuery } =
    await import('../../../server/custom/recent-imagery/catalog.js');
  const { createFreeRecentImagerySource } =
    await import('../../custom/imagery/source.js');
  const { createRecentImageryLayer } = await import('./index.js');
  const { createRecentImageryRenderer } = await import('./rendering.js');
  const { fakeThumbnails, settle } = await import('./testDoubles.mjs');
  const box = { west: -74.2, south: 40.2, east: -74.19, north: 40.21 };
  const query = catalogQuery({ box }, Date.parse('2026-10-22T12:00:00Z'));
  const candidates = candidatesFromCatalog(
    {
      features: [
        {
          id: 'S2A_MSIL2A_20261013T150000_N0511_R001_T18TWK_20261013T170000',
          properties: { datetime: '2026-10-13T15:00:00Z', 'eo:cloud_cover': 0 },
        },
      ],
    },
    query,
  );
  assert.equal(candidates.length, 1);
  const candidate = candidates[0];
  assert.match(candidate.key, /^S2:2026-10-13:[a-f0-9]{64}$/);
  assert.equal(Object.hasOwn(candidate, 'availability'), false);
  assert.equal(Object.hasOwn(candidate, 'cloud'), false);
  const calls = [],
    decodes = [],
    layers = [],
    fits = [];
  const source = createFreeRecentImagerySource({
    nasaSource: {
      searchHls: async () => ({ candidates: [] }),
      getTileTemplate: () => 'NASA-not-used',
    },
    createObjectUrl: () => 'blob:synthetic-native',
    revokeObjectUrl() {},
    fetchImpl: async (url, options) => {
      const body = options?.body ? JSON.parse(options.body) : null;
      calls.push({ url, body });
      if (url.endsWith('/usage'))
        return Response.json({ requests: null, pu: null });
      if (url.endsWith('/catalog'))
        return Response.json({ candidates, usage: { requests: 1, pu: 0.01 } });
      assert.equal(
        body.preview,
        undefined,
        'offscreen/restored assignments do not acquire previews',
      );
      const metadata = {
        source: 'cdse',
        product: 'S2',
        day: candidate.day,
        acquisitionTime: candidate.acquisitionTime,
        contributors: candidate.contributors,
        nativeResolutionM: 10,
        box,
        width: candidate.imagePlan.width,
        height: candidate.imagePlan.height,
        credit: candidate.credit,
        preview: false,
      };
      return new Response(
        new Blob(['synthetic PNG transport fixture'], { type: 'image/png' }),
        {
          headers: {
            'Content-Type': 'image/png',
            'X-GEV-Imagery': JSON.stringify(metadata),
          },
        },
      );
    },
  });
  const renderer = createRecentImageryRenderer({
    imageSource: source,
    cesium: {
      Rectangle: {
        fromDegrees: (west, south, east, north) => ({
          west,
          south,
          east,
          north,
        }),
      },
      SplitDirection: { NONE: 0 },
      SingleTileImageryProvider: class {
        constructor(options) {
          this.options = options;
        }
        requestImage() {
          return new Promise((resolve, reject) =>
            decodes.push({ resolve, reject }),
          );
        }
      },
    },
  });
  const collection = {
    addImageryProvider(provider) {
      const image = { provider };
      layers.push(image);
      return image;
    },
    remove(image) {
      const index = layers.indexOf(image);
      if (index >= 0) layers.splice(index, 1);
    },
  };
  const layer = createRecentImageryLayer({
    catalog: source,
    renderer,
    thumbnails: fakeThumbnails(),
    usageSource: source,
    host: () => ({ collection, kind: 'globe' }),
    viewportFactory: () => ({
      fit(images) {
        fits.push(images);
        return true;
      },
      canRestore: () => Boolean(fits.length),
    }),
  });
  layer.init({});
  layer.setSources({ s2: true });
  layer.enable();
  layer.setBox(box);
  for (let i = 0; i < 3; i++) await settle();
  assert.deepEqual(layer.getSnapshot().candidates[0].cloud, { min: 0, max: 0 });
  layer.setParams({ a: candidate.key, s2: true });
  for (let i = 0; i < 3; i++) await settle();
  assert.equal(layers.length, 1);
  assert.equal(layer.getImageryHudState().slots.a.loaded, false);
  assert.equal(fits.length, 0);
  const restoredDecode = layers[0].provider.requestImage();
  decodes[0].resolve({ decoded: true });
  await restoredDecode;
  assert.equal(layer.getImageryHudState().slots.a.nativeResolutionM, 10);
  assert.equal(
    fits.length,
    0,
    'passive restored assignments never auto-fit after decode',
  );
  layer.setAssignment('a', null);
  layer.setAssignment('a', candidate.key);
  for (let i = 0; i < 3; i++) await settle();
  assert.equal(fits.length, 0);
  const explicitDecode = layers[0].provider.requestImage();
  decodes[1].resolve({ decoded: true });
  await explicitDecode;
  assert.equal(fits.length, 1);
  assert.equal(fits[0][0].nativeResolutionM, 10);
  assert.deepEqual(layer.getSnapshot().box, box);
  assert.equal(
    calls.filter((call) => call.url.endsWith('/image')).length,
    1,
    'warm native handle reuse makes no additional Process call',
  );
  layer.setAssignment('a', null);
  layer.setAssignment('a', candidate.key);
  for (let i = 0; i < 3; i++) await settle();
  const invalidDecode = layers[0].provider.requestImage();
  decodes[2].reject(new Error('invalid PNG fixture'));
  await assert.rejects(invalidDecode, /invalid PNG/);
  assert.equal(layer.getImageryHudState(), null);
  assert.match(layer.getSnapshot().fallbackNotice, /HLS 30 m is not loaded/);
  assert.equal(fits.length, 1);
  layer.destroy();
  source.destroy();
});
