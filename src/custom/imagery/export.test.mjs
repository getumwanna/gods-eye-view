import test from 'node:test';
import assert from 'node:assert/strict';
import {
  copernicusAttribution,
  createCreditedImageryExport,
  releaseCreditedImageryExport,
  imageryExportWorkingBytes,
} from './export.js';
import {
  createFreeRecentImagerySource,
  IMAGERY_MEMORY_LIMIT,
} from './source.js';

function fixture({
  width = 1000,
  height = 800,
  day = '2026-10-13',
  parts,
} = {}) {
  const calls = [],
    closed = [];
  let retained = 0,
    released = 0;
  let workingBytes = 0;
  const snapshot = {
    width,
    height,
    blob: new Blob(['synthetic-raster-fixture'], { type: 'image/png' }),
    metadata: {
      product: 'S2',
      source: 'cdse',
      day,
      contributors: [{ acquisitionTime: `${day}T12:00:00Z` }],
    },
    ...(parts ? { parts } : {}),
    reserveWorkingBytes(bytes) {
      workingBytes += bytes;
      let released = false;
      return {
        release() {
          if (!released) {
            released = true;
            workingBytes -= bytes;
          }
        },
      };
    },
    retain() {
      retained++;
      return {
        ...this,
        release() {
          released++;
        },
      };
    },
  };
  const canvasFactory = (w, h) => {
    calls.push(['canvas', w, h]);
    return {
      getContext: () => ({
        drawImage: (...args) => calls.push(['drawImage', ...args]),
        fillRect: (...args) => calls.push(['fillRect', ...args]),
        fillText: (...args) => calls.push(['fillText', ...args]),
      }),
      convertToBlob: async () =>
        new Blob(['synthetic-credited-png'], { type: 'image/png' }),
    };
  };
  const decodeImage = async () => ({
    width,
    height,
    close: () => closed.push(true),
  });
  return {
    snapshot,
    canvasFactory,
    decodeImage,
    calls,
    closed,
    refs: () => [retained, released],
    working: () => workingBytes,
  };
}

test('native snapshot export uses already-loaded bytes, adds visible source/year/date credits, and releases its own hold', async () => {
  const f = fixture();
  const blob = await createCreditedImageryExport(f);
  assert.equal(blob.type, 'image/png');
  assert.deepEqual(f.calls[0], ['canvas', 1000, 872]);
  const draw = f.calls.find(([name]) => name === 'drawImage');
  assert.equal(draw.length, 4, 'drawImage has no resizing arguments');
  const credits = f.calls
    .filter(([name]) => name === 'fillText')
    .map((call) => call[1])
    .join('\n');
  assert.match(credits, /Contains modified Copernicus Sentinel data 2026/);
  assert.match(credits, /2026-10-13T12:00:00Z/);
  assert.match(credits, /Copernicus Data Space Ecosystem \/ Sentinel Hub/);
  assert.deepEqual(f.refs(), [1, 1]);
  assert.equal(f.closed.length, 1);
  assert.equal(
    f.working(),
    imageryExportWorkingBytes(f.snapshot),
    'output Blob keeps its reserved budget until download URL is revoked',
  );
  releaseCreditedImageryExport(blob);
  releaseCreditedImageryExport(blob);
  assert.equal(f.working(), 0);
});

test('A and B export credits are independent, including capture years; small image credits remain readable', async () => {
  const a = fixture({ width: 30, height: 20, day: '2025-12-31' });
  const b = fixture({ width: 30, height: 20, day: '2026-01-01' });
  const blobA = await createCreditedImageryExport(a);
  const blobB = await createCreditedImageryExport(b);
  assert.deepEqual(a.calls[0], ['canvas', 768, 92]);
  assert.match(a.calls.filter(([name]) => name === 'fillText')[0][1], /2025$/);
  assert.match(b.calls.filter(([name]) => name === 'fillText')[0][1], /2026$/);
  assert.deepEqual(a.refs(), [1, 1]);
  assert.deepEqual(b.refs(), [1, 1]);
  releaseCreditedImageryExport(blobA);
  releaseCreditedImageryExport(blobB);
});

test('all exact contributor years are retained; unknown year and reduced preview cannot export', async () => {
  assert.match(
    copernicusAttribution({
      contributors: [
        { acquisitionTime: '2025-12-31T23:00:00Z' },
        { acquisitionTime: '2026-01-01T01:00:00Z' },
      ],
    })[0],
    /2025, 2026$/,
  );
  assert.throws(() => copernicusAttribution({}), /capture year/);
  const f = fixture();
  f.snapshot.metadata.preview = true;
  await assert.rejects(
    createCreditedImageryExport(f),
    /verified Sentinel-2 snapshot/,
  );
  assert.deepEqual(f.refs(), [1, 1]);
});

test('mismatched raster dimensions fail with resources released, preserving native-resolution assertions', async () => {
  const f = fixture();
  await assert.rejects(
    createCreditedImageryExport({
      ...f,
      decodeImage: async () => ({
        width: 128,
        height: 128,
        close: () => f.closed.push(true),
      }),
    }),
    /dimensions/,
  );
  assert.deepEqual(f.refs(), [1, 1]);
  assert.equal(f.closed.length, 1);
  assert.equal(f.working(), 0);
});

test('chunked export composes exact edge pixels in top/north row order without scale arguments', async () => {
  const parts = [
    { column: 0, row: 0, width: 512, height: 512 },
    { column: 1, row: 0, width: 88, height: 512 },
    { column: 0, row: 1, width: 512, height: 38 },
    { column: 1, row: 1, width: 88, height: 38 },
  ].map((part) => ({
    ...part,
    blob: new Blob([JSON.stringify(part)], { type: 'image/png' }),
  }));
  const f = fixture({ width: 600, height: 550, parts });
  const blob = await createCreditedImageryExport({
    ...f,
    decodeImage: async (blob) => JSON.parse(await blob.text()),
  });
  const draws = f.calls.filter(([name]) => name === 'drawImage');
  assert.equal(draws.length, 4);
  assert.ok(draws.every((draw) => draw.length === 4));
  assert.deepEqual(
    draws.map((draw) => draw.slice(2)),
    [
      [0, 0],
      [512, 0],
      [0, 512],
      [512, 512],
    ],
  );
  releaseCreditedImageryExport(blob);
});

test('heavy export work is serialized with one bounded pending job', async () => {
  const a = fixture(),
    b = fixture(),
    c = fixture();
  let finishDecode;
  const first = createCreditedImageryExport({
    ...a,
    decodeImage: () =>
      new Promise((resolve) => {
        finishDecode = () => resolve({ width: 1000, height: 800 });
      }),
  });
  await new Promise((resolve) => setImmediate(resolve));
  const second = createCreditedImageryExport(b);
  await assert.rejects(createCreditedImageryExport(c), /already queued/);
  assert.equal(
    b.calls.length,
    0,
    'queued export has not allocated another canvas',
  );
  finishDecode();
  releaseCreditedImageryExport(await first);
  releaseCreditedImageryExport(await second);
  assert.deepEqual(a.refs(), [1, 1]);
  assert.deepEqual(b.refs(), [1, 1]);
  assert.deepEqual(c.refs(), [0, 0]);
});

test('near-cap AB export refuses untracked allocation; releasing one image admits full native export and holds its PNG lease', async () => {
  const box = { west: 0, south: 0, east: 0.18, north: 0.18 };
  const candidate = (id) => ({
    id,
    key: id,
    product: 'S2',
    source: 'cdse',
    day: '2026-10-13',
    acquisitionTime: '2026-10-13T12:00:00Z',
    contributors: [{ id, acquisitionTime: '2026-10-13T12:00:00Z' }],
    imagePlan: {
      width: 2048,
      height: 2048,
      mode: 'single',
      columns: 1,
      rows: 1,
    },
  });
  let providerCalls = 0;
  const source = createFreeRecentImagerySource({
    fetchImpl: async (_url, options) => {
      providerCalls++;
      const { candidateId } = JSON.parse(options.body);
      const item = candidate(candidateId);
      return new Response(
        new Blob(['synthetic-test-raster'], { type: 'image/png' }),
        {
          headers: {
            'Content-Type': 'image/png',
            'X-GEV-Imagery': JSON.stringify({
              product: 'S2',
              source: 'cdse',
              day: item.day,
              acquisitionTime: item.acquisitionTime,
              contributors: item.contributors,
              nativeResolutionM: 10,
              box,
              width: 2048,
              height: 2048,
            }),
          },
        },
      );
    },
    createObjectUrl: () => 'blob:synthetic-heavy-fixture',
    revokeObjectUrl() {},
  });
  const a = await source.getImage(candidate('a'), box);
  const b = await source.getImage(candidate('b'), box);
  assert.equal(source.getState().memory.reservedBytes, IMAGERY_MEMORY_LIMIT);
  const f = fixture({ width: 2048, height: 2048 });
  await assert.rejects(createCreditedImageryExport({ ...f, snapshot: a }), {
    code: 'memory_limit',
  });
  assert.equal(
    f.calls.length,
    0,
    'refusal happens before canvas/decode allocation',
  );
  assert.equal(source.getState().memory.reservedBytes, IMAGERY_MEMORY_LIMIT);
  assert.equal(
    source.getState().status,
    'ready',
    'an export refusal does not label loaded S2 unavailable',
  );
  b.release();
  const blob = await createCreditedImageryExport({ ...f, snapshot: a });
  const expected = 2048 * 2048 * 16 + imageryExportWorkingBytes(a);
  assert.equal(source.getState().memory.reservedBytes, expected);
  assert.ok(expected <= IMAGERY_MEMORY_LIMIT);
  assert.deepEqual(f.calls[0], ['canvas', 2048, 2120]);
  assert.equal(
    f.calls.find(([name]) => name === 'drawImage').length,
    4,
    'native pixels are not resized to fit admission',
  );
  assert.equal(providerCalls, 2, 'export added no Process request');
  releaseCreditedImageryExport(blob);
  releaseCreditedImageryExport(blob);
  assert.equal(source.getState().memory.reservedBytes, 2048 * 2048 * 16);
  a.release();
  source.destroy();
  assert.equal(source.getState().memory.reservedBytes, 0);
});

test('cancelling a queued export releases its handle without allocating or letting the next job overlap', async () => {
  const a = fixture(),
    b = fixture(),
    c = fixture();
  let finishFirst;
  const first = createCreditedImageryExport({
    ...a,
    decodeImage: () =>
      new Promise((resolve) => {
        finishFirst = () => resolve({ width: 1000, height: 800 });
      }),
  });
  await new Promise((resolve) => setImmediate(resolve));
  const abort = new AbortController();
  const second = createCreditedImageryExport({ ...b, signal: abort.signal });
  abort.abort();
  await assert.rejects(second, { name: 'AbortError' });
  assert.deepEqual(b.refs(), [1, 1]);
  assert.equal(b.working(), 0);
  assert.equal(b.calls.length, 0);
  const third = createCreditedImageryExport(c);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(
    c.calls.length,
    0,
    'cancelled queue link still waits for preceding active job',
  );
  finishFirst();
  releaseCreditedImageryExport(await first);
  releaseCreditedImageryExport(await third);
  assert.equal(a.working(), 0);
  assert.equal(c.working(), 0);
});
