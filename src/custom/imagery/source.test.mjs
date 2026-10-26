import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createFreeRecentImagerySource,
  IMAGERY_MEMORY_LIMIT,
  sentinelFallbackNotice,
} from './source.js';

const box = Object.freeze({
  west: -74.2,
  south: 40.2,
  east: -74.1,
  north: 40.3,
});
const candidate = (id = 'fixture-a', width = 100, height = 80) => ({
  id,
  key: id,
  product: 'S2',
  source: 'cdse',
  day: '2026-10-13',
  acquisitionTime: '2026-10-13T15:00:00Z',
  contributors: [
    {
      id: `scene-${id}`,
      acquisitionTime: '2026-10-13T15:00:00Z',
      cloudPercent: null,
    },
  ],
  imagePlan: { width, height, mode: 'single', columns: 1, rows: 1 },
});
function imageResponse(item, overrides = {}) {
  const metadata = {
    source: 'cdse',
    product: 'S2',
    day: item.day,
    acquisitionTime: item.acquisitionTime,
    contributors: item.contributors,
    nativeResolutionM: 10,
    box,
    width: item.imagePlan.width,
    height: item.imagePlan.height,
    preview: false,
    ...overrides,
  };
  // Small, synthetic PNG-shaped bytes: these tests exercise transport, not raster decoding.
  return new Response(
    new Blob(['synthetic-test-image'], { type: 'image/png' }),
    {
      headers: {
        'Content-Type': 'image/png',
        'X-GEV-Imagery': JSON.stringify(metadata),
      },
    },
  );
}
function fixture(fetchImpl, options = {}) {
  const revoked = [],
    urls = [];
  const source = createFreeRecentImagerySource({
    fetchImpl,
    createObjectUrl: () => {
      const url = `blob:fixture-${urls.length}`;
      urls.push(url);
      return url;
    },
    revokeObjectUrl: (url) => revoked.push(url),
    ...options,
  });
  return { source, revoked, urls };
}

function passiveClock() {
  let time = 0,
    sequence = 0;
  const timers = new Map();
  const flush = () => new Promise((resolve) => setImmediate(resolve));
  return {
    now: () => time,
    setTimeoutImpl(callback, ms) {
      const id = ++sequence;
      timers.set(id, { callback, at: time + ms });
      return id;
    },
    clearTimeoutImpl(id) {
      timers.delete(id);
    },
    count: () => timers.size,
    async advance(ms) {
      time += ms;
      for (;;) {
        const due = [...timers.entries()]
          .filter(([, timer]) => timer.at <= time)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        timers.delete(due[0]);
        due[1].callback();
        await flush();
      }
      await flush();
    },
    flush,
  };
}

test('passive usage checks start once on S2 enable, preserve unknown, and never poll idle or NASA work', async () => {
  const clock = passiveClock(),
    calls = [];
  const { source } = fixture(
    async (url, options) => {
      calls.push([url, options.method]);
      assert.equal(url, '/api/recent-imagery/cdse/usage');
      return Response.json({
        requests: null,
        pu: null,
        status: 'setup_required',
      });
    },
    { ...clock, nasaSource: { getThumbnail: async () => 'nasa-fixture' } },
  );
  assert.equal(calls.length, 0);
  source.resumeUsage();
  source.resumeUsage();
  await clock.flush();
  assert.deepEqual(calls, [['/api/recent-imagery/cdse/usage', 'GET']]);
  assert.equal(source.getState().usage.requests, null);
  assert.equal(source.getState().usage.pu, null);
  assert.equal(clock.count(), 0);
  await source.getThumbnail({ product: 'S30' }, box);
  await clock.advance(60_000);
  assert.equal(calls.length, 1);
  source.pauseUsage();
  source.destroy();
});

test('one shared passive timer reports true owner Queued/Retrying while acquisition waits and stops at zero pending', async () => {
  const clock = passiveClock(),
    calls = [];
  let finishCatalog;
  let status = 'ready';
  const { source } = fixture(async (url, options) => {
    calls.push([url, options.method]);
    if (url.endsWith('/usage'))
      return Response.json({ requests: 3, pu: 5.5, status });
    assert.ok(url.endsWith('/catalog'));
    return new Promise((resolve) => {
      finishCatalog = () =>
        resolve(
          Response.json({
            candidates: [],
            usage: { requests: 4, pu: 5.51, status: 'ready' },
          }),
        );
    });
  }, clock);
  source.resumeUsage();
  await clock.flush();
  const pending = source.searchS2(box);
  assert.equal(clock.count(), 1);
  assert.equal(source.getState().acquiring, 1);
  status = 'queued';
  await clock.advance(1000);
  assert.equal(source.getState().usage.status, 'queued');
  assert.equal(clock.count(), 1);
  status = 'retrying';
  await clock.advance(1000);
  assert.equal(source.getState().usage.status, 'retrying');
  finishCatalog();
  await pending;
  await clock.flush();
  assert.equal(source.getState().acquiring, 0);
  assert.equal(source.getState().usage.status, 'ready');
  assert.equal(clock.count(), 0);
  const count = calls.length;
  await clock.advance(60_000);
  assert.equal(calls.length, count);
  assert.equal(calls.filter(([url]) => url.endsWith('/catalog')).length, 1);
  assert.ok(
    calls
      .filter(([url]) => url.endsWith('/usage'))
      .every(([, method]) => method === 'GET'),
  );
  source.destroy();
});

test('passive reads coalesce and disable/destroy cancel only status polling, without acquiring anything', async () => {
  const clock = passiveClock(),
    calls = [],
    statusSignals = [];
  let finishUsage;
  const { source } = fixture((url, options) => {
    calls.push(url);
    assert.ok(url.endsWith('/usage'));
    statusSignals.push(options.signal);
    return new Promise((resolve, reject) => {
      finishUsage = () =>
        resolve(Response.json({ requests: null, pu: null, status: 'ready' }));
      options.signal.addEventListener(
        'abort',
        () => reject(options.signal.reason),
        { once: true },
      );
    });
  }, clock);
  source.resumeUsage();
  const one = source.getUsage(),
    two = source.getUsage();
  assert.equal(calls.length, 1);
  finishUsage();
  await one;
  await two;
  await clock.flush();
  source.pauseUsage();
  source.resumeUsage();
  await clock.flush();
  assert.equal(calls.length, 2);
  source.pauseUsage();
  assert.equal(statusSignals[1].aborted, true);
  await clock.flush();
  source.resumeUsage();
  await clock.flush();
  assert.equal(calls.length, 3);
  source.destroy();
  assert.equal(statusSignals[2].aborted, true);
  await clock.flush();
  await clock.advance(60_000);
  assert.equal(calls.length, 3);
  assert.equal(clock.count(), 0);
});

test('usage read timestamp describes only successful passive local reads, never provider sensing or acquisition metadata', async () => {
  const clock = passiveClock();
  let failRead = false;
  const { source } = fixture(async (url) => {
    if (url.endsWith('/usage'))
      return failRead
        ? new Response('', { status: 503 })
        : Response.json({ requests: null, pu: null, status: 'setup_required' });
    return Response.json({
      candidates: [],
      usage: {
        requests: 1,
        pu: 0.01,
        status: 'ready',
        fetchedAt: '2026-10-13T12:00:00Z',
      },
    });
  }, clock);
  assert.equal(source.getState().usageReadAt, null);
  await source.getUsage();
  assert.equal(source.getState().usageReadAt, '1970-01-01T00:00:00.000Z');
  assert.equal(source.getState().usage.requests, null);
  await clock.advance(2000);
  await source.searchS2(box);
  assert.equal(source.getState().usageReadAt, '1970-01-01T00:00:00.000Z');
  await source.getUsage();
  assert.equal(source.getState().usageReadAt, '1970-01-01T00:00:02.000Z');
  await clock.advance(1000);
  failRead = true;
  await assert.rejects(source.getUsage(), { code: 'usage_unavailable' });
  assert.equal(source.getState().usageReadAt, '1970-01-01T00:00:02.000Z');
  assert.equal(source.getState().usage.pu, null);
  source.destroy();
});

test('visible-thumbnail working leases share native-image admission and release idempotently on their caller lifecycle', async () => {
  const item = candidate();
  let calls = 0;
  const { source } = fixture(
    async () => {
      calls++;
      return imageResponse(item);
    },
    { memoryLimit: 512 * 1024 },
  );
  const image = await source.getImage(item, box);
  const nativeBytes = item.imagePlan.width * item.imagePlan.height * 16;
  const thumbnail = source.reserveWorkingBytes(256 * 1024);
  assert.equal(
    source.getState().memory.reservedBytes,
    nativeBytes + 256 * 1024,
  );
  assert.throws(() => source.reserveWorkingBytes(256 * 1024), {
    code: 'memory_limit',
  });
  assert.equal(source.getState().status, 'ready');
  assert.equal(calls, 1, 'working admission never acquires a source');
  thumbnail.release();
  thumbnail.release();
  assert.equal(source.getState().memory.reservedBytes, nativeBytes);
  image.release();
  source.destroy();
  assert.equal(source.getState().memory.reservedBytes, 0);
  assert.throws(() => source.reserveWorkingBytes(1), /closed/);
});

test('NASA transport is delegated unchanged; S2 thumbnails are reduced and never acquire full images', async () => {
  const calls = [],
    nasaCalls = [];
  const nasaSource = {
    searchHls: () => 'nasa-catalog',
    getTileTemplate: () => 'nasa-template',
    getThumbnail: (...args) => {
      nasaCalls.push(args);
      return 'nasa-thumbnail';
    },
  };
  const item = candidate();
  const { source } = fixture(
    async (url, options) => {
      calls.push([url, JSON.parse(options.body)]);
      return imageResponse(item, { preview: true, width: 128, height: 103 });
    },
    { nasaSource },
  );
  assert.equal(source.searchHls, nasaSource.searchHls);
  assert.equal(source.getTileTemplate, nasaSource.getTileTemplate);
  assert.equal(
    await source.getThumbnail({ product: 'L30' }, box, { size: 256 }),
    'nasa-thumbnail',
  );
  assert.equal(nasaCalls.length, 1);
  const response = await source.getThumbnail(item, box, { size: 2048 });
  assert.equal(response.headers.get('Data-Present'), 'true');
  assert.equal(response.headers.get('Acquisition-Time'), item.acquisitionTime);
  assert.deepEqual(calls[0][1], { candidateId: item.id, box, preview: true });
  assert.equal(source.getState().memory.reservedBytes, 0);
  source.destroy();
});

test('catalog cloud filtering keeps unknown distinct and passive usage does not acquire imagery', async () => {
  const calls = [];
  const { source } = fixture(async (url, options) => {
    calls.push([url, options]);
    return Response.json(
      url.endsWith('/usage')
        ? { requests: 4, pu: 3 }
        : { candidates: [candidate()], usage: { requests: 1, pu: 0.01 } },
    );
  });
  const result = await source.searchS2({ box, maxCloud: 0 });
  assert.equal(result.candidates[0].contributors[0].cloudPercent, null);
  assert.equal(JSON.parse(calls[0][1].body).maxCloud, 0);
  assert.deepEqual(await source.getUsage(), { requests: 4, pu: 3 });
  assert.equal(calls[1][0], '/api/recent-imagery/cdse/usage');
  assert.equal(calls[1][1].method, 'GET');
  assert.equal(calls[1][1].body, undefined);
  source.destroy();
});

test('coalesced image/AB/export handles reuse bytes without a second Process request', async () => {
  let calls = 0;
  const item = candidate();
  const { source, revoked } = fixture(async () => {
    calls++;
    return imageResponse(item);
  });
  const [a, b] = await Promise.all([
    source.getImage(item, box),
    source.getImage(item, box),
  ]);
  assert.equal(calls, 1);
  assert.equal(a.blob, b.blob);
  assert.equal(a.url, b.url);
  const exportHandle = a.retain();
  a.release();
  b.release();
  assert.equal(revoked.length, 0);
  source.destroy();
  assert.equal(revoked.length, 0, 'export keeps loaded bytes alive');
  exportHandle.release();
  exportHandle.release();
  assert.equal(revoked.length, 1);
  assert.equal(source.getState().memory.reservedBytes, 0);
});

test('two cap-sized dates fit the declared budget; a third is refused until an inactive image can evict', async () => {
  const { source, revoked } = fixture(async (_url, options) =>
    imageResponse(candidate(JSON.parse(options.body).candidateId, 2048, 2048)),
  );
  const a = await source.getImage(candidate('a', 2048, 2048), box);
  const b = await source.getImage(candidate('b', 2048, 2048), box);
  assert.equal(source.getState().memory.reservedBytes, IMAGERY_MEMORY_LIMIT);
  await assert.rejects(source.getImage(candidate('c', 2048, 2048), box), {
    code: 'memory_limit',
  });
  a.release();
  const c = await source.getImage(candidate('c', 2048, 2048), box);
  assert.equal(revoked.length, 1);
  b.release();
  c.release();
  source.destroy();
});

test('cancelling one coalesced consumer does not cancel the other; obsolete sole work aborts', async () => {
  let finish, providerSignal;
  const item = candidate();
  const { source } = fixture((_url, options) => {
    providerSignal = options.signal;
    return new Promise((resolve) => {
      finish = () => resolve(imageResponse(item));
    });
  });
  const abort = new AbortController();
  const one = source.getImage(item, box, { signal: abort.signal });
  const two = source.getImage(item, box);
  abort.abort();
  await assert.rejects(one, { name: 'AbortError' });
  assert.equal(providerSignal.aborted, false);
  finish();
  const retained = await two;
  retained.release();
  source.destroy();

  const second = fixture(
    (_url, options) =>
      new Promise((_resolve, reject) =>
        options.signal.addEventListener(
          'abort',
          () => reject(options.signal.reason),
          { once: true },
        ),
      ),
  );
  const last = new AbortController();
  const pending = second.source.getImage(item, box, { signal: last.signal });
  last.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(second.source.getState().memory.reservedBytes, 0);
  second.source.destroy();
});

test('wrong source, dimensions, preview pixels or changed bounds are never admitted as native imagery', async () => {
  for (const overrides of [
    { product: 'L30' },
    { width: 99 },
    { preview: true },
    { box: { ...box, east: box.east + 0.01 } },
    { contributors: [] },
  ]) {
    const item = candidate();
    const { source, urls } = fixture(async () =>
      imageResponse(item, overrides),
    );
    await assert.rejects(source.getImage(item, box), {
      code: 'provenance_unverified',
    });
    assert.equal(urls.length, 0);
    assert.equal(source.getState().memory.reservedBytes, 0);
    source.destroy();
  }
});

test('fallback reports a safe specific reason and never claims HLS loaded before it did', async () => {
  const { source } = fixture(async () =>
    Response.json(
      { code: 'missing_configuration', error: 'secret=never-display-this' },
      { status: 503 },
    ),
  );
  await assert.rejects(source.searchS2(box), { code: 'missing_configuration' });
  assert.equal(
    source.getState().error.reason,
    'CDSE credentials are not configured locally',
  );
  assert.match(
    sentinelFallbackNotice({ code: 'provider_quota' }),
    /HLS 30 m has not loaded/,
  );
  assert.match(
    sentinelFallbackNotice({ code: 'monthly_ceiling' }, { hlsLoaded: true }),
    /^Sentinel-2 unavailable: showing HLS 30 m, the local monthly safety ceiling/,
  );
  assert.doesNotMatch(
    sentinelFallbackNotice({ code: 'unknown', message: 'secret=bad' }),
    /secret/,
  );
  source.destroy();
});

test('oversized native grids use exact clipped 512-pixel north/top chunks without extending selected bounds', async () => {
  const item = candidate('chunk-grid', 600, 550);
  item.imagePlan = {
    width: 600,
    height: 550,
    mode: 'chunks',
    columns: 2,
    rows: 2,
  };
  const requests = [];
  const { source } = fixture(async (_url, options) => {
    const request = JSON.parse(options.body);
    requests.push(request);
    const { column, row } = request.part;
    const width = Math.min(512, 600 - column * 512);
    const height = Math.min(512, 550 - row * 512);
    const partBox = {
      west: box.west + ((box.east - box.west) * column * 512) / 600,
      east: box.west + ((box.east - box.west) * (column * 512 + width)) / 600,
      north: box.north - ((box.north - box.south) * row * 512) / 550,
      south: box.north - ((box.north - box.south) * (row * 512 + height)) / 550,
    };
    return imageResponse(item, { width, height, box: partBox });
  });
  const image = await source.getImage(item, box);
  assert.equal(requests.length, 4);
  assert.deepEqual(
    requests.map((request) => request.part),
    [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
      { column: 0, row: 1 },
      { column: 1, row: 1 },
    ],
  );
  assert.ok(
    requests.every(
      (request) => JSON.stringify(request.box) === JSON.stringify(box),
    ),
  );
  assert.deepEqual(
    image.parts.map((part) => [part.width, part.height]),
    [
      [512, 512],
      [88, 512],
      [512, 38],
      [88, 38],
    ],
  );
  assert.deepEqual(image.metadata.box, box);
  assert.equal(image.width, 600);
  assert.equal(image.height, 550);
  image.release();
  source.destroy();
});

test('declared or streamed oversized PNG is rejected before allocating an unbounded blob', async () => {
  const item = candidate();
  const response = imageResponse(item);
  response.headers.set('Content-Length', '1000000000');
  const { source, urls } = fixture(async () => response);
  await assert.rejects(source.getImage(item, box), {
    code: 'provenance_unverified',
  });
  assert.equal(urls.length, 0);
  assert.equal(source.getState().memory.reservedBytes, 0);
  source.destroy();
});

test('safe CDSE HTTP diagnostics reach the fallback without echoing provider bodies', async () => {
  const { source } = fixture(async () =>
    Response.json(
      {
        code: 'provider_unavailable',
        providerStage: 'catalog',
        providerStatus: 404,
        error: 'secret=never-display-this',
        reason: 'secret=never-display-this',
      },
      { status: 503 },
    ),
  );
  await assert.rejects(source.searchS2(box), (error) => {
    assert.match(
      sentinelFallbackNotice(error),
      /CDSE catalog returned HTTP 404/,
    );
    assert.doesNotMatch(sentinelFallbackNotice(error), /secret|showing HLS/);
    return true;
  });
  assert.equal(
    source.getState().error.reason,
    'CDSE catalog returned HTTP 404',
  );
  assert.match(
    sentinelFallbackNotice({ code: 'authentication_failed' }),
    /CDSE authentication/,
  );
  for (const detail of [
    {
      code: 'provider_unavailable',
      providerStage: 'secret=bad',
      providerStatus: 404,
    },
    {
      code: 'provider_unavailable',
      providerStage: 'catalog',
      providerStatus: 'secret=bad',
    },
    {
      code: 'provider_unavailable',
      providerStage: 'catalog',
      providerStatus: 999,
    },
  ])
    assert.doesNotMatch(sentinelFallbackNotice(detail), /secret|999/);
  source.destroy();
});
