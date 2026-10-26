import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  rmSync,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { EventEmitter } from 'node:events';
import vm from 'node:vm';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { deflateSync } from 'node:zlib';
import { createCdseMiddleware } from '../../../server/custom/recent-imagery/plugin.js';
import {
  createCdseOwner,
  CDSE_URLS,
  parseProcessTar,
  processRequest,
  processPu,
  pngValidPixels,
} from '../../../server/custom/recent-imagery/cdse.js';
import {
  createBudget,
  CDSE_LIMITS,
  CDSE_PU_CALIBRATION,
  calibratedPu,
} from '../../../server/custom/recent-imagery/budget.js';
import {
  createImageryCache,
  cacheKey,
} from '../../../server/custom/recent-imagery/cache.js';
import {
  catalogQuery,
  candidatesFromCatalog,
  imageGeometry,
  imagePlan,
} from '../../../server/custom/recent-imagery/catalog.js';

const ID = 'S2A_MSIL2A_20261015T155931_N0511_R054_T18TWK_20261015T192301';
const ACQUIRED = '2026-10-15T15:59:31.024Z';
const BOX = { west: -74.3, south: 40.3, east: -74.2, north: 40.37 };
const CONFIG = {
  CDSE_CLIENT_ID: 'test-only-client',
  CDSE_CLIENT_SECRET: 'test-only-secret',
};
const FEATURE = {
  id: `${ID}.SAFE`,
  properties: { datetime: ACQUIRED, 'eo:cloud_cover': 4 },
};
const roots = [];
const temp = () => {
  const root = mkdtempSync(join(tmpdir(), 'gev-cdse-fixture-'));
  roots.push(root);
  return root;
};
test.after(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
});
function clock() {
  let time = Date.parse('2026-10-22T12:00:00Z');
  const sleeps = [];
  return {
    now: () => time,
    sleep: async (ms, signal) => {
      signal?.throwIfAborted();
      sleeps.push(ms);
      time += ms;
    },
    set: (value) => {
      time = value;
    },
    sleeps,
  };
}
function pngChunk(kind, data) {
  const bytes = Buffer.alloc(data.length + 12);
  bytes.writeUInt32BE(data.length, 0);
  bytes.write(kind, 4);
  data.copy(bytes, 8);
  let crc = 0xffffffff;
  for (const byte of bytes.subarray(4, -4)) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++)
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  bytes.writeUInt32BE((crc ^ 0xffffffff) >>> 0, bytes.length - 4);
  return bytes;
}
function png(width, height, validPixels = width * height) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let pixel = 0; pixel < validPixels; pixel++)
    raw[Math.floor(pixel / width) * (width * 4 + 1) + (pixel % width) * 4 + 4] =
      255;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}
function tar(entries) {
  const chunks = [];
  for (const [name, data] of Object.entries(entries)) {
    const value = Buffer.isBuffer(data)
      ? data
      : Buffer.from(JSON.stringify(data));
    const head = Buffer.alloc(512);
    head.write(name);
    head.write('0000600\0', 100);
    head.write(value.length.toString(8).padStart(11, '0') + '\0', 124);
    head.fill(32, 148, 156);
    head[156] = 48;
    const checksum = head.reduce((sum, byte) => sum + byte, 0);
    head.write(checksum.toString(8).padStart(6, '0') + '\0 ', 148);
    chunks.push(head, value, Buffer.alloc((512 - (value.length % 512)) % 512));
  }
  return Buffer.concat([...chunks, Buffer.alloc(1024)]);
}
function processArchive(
  request,
  { identity = ID, time = ACQUIRED, validPixels = 1 } = {},
) {
  return tar({
    'default.png': png(
      request.output.width,
      request.output.height,
      validPixels,
    ),
    'userdata.json': {
      tiles: [{ productId: identity, date: time }],
      validPixels,
    },
  });
}
function fixture({ root = temp(), responder, ...options } = {}) {
  const timer = clock();
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init, time: timer.now() });
    if (responder) {
      const response = await responder(url, init, calls);
      if (response) return response;
    }
    if (url === CDSE_URLS.token)
      return Response.json({
        access_token: 'synthetic-test-only-token',
        expires_in: 600,
      });
    if (url === CDSE_URLS.catalog)
      return Response.json({ features: [FEATURE], context: {} });
    if (url === CDSE_URLS.process)
      return new Response(processArchive(JSON.parse(init.body)), {
        headers: { 'Content-Type': 'application/x-tar' },
      });
    throw new Error('Unexpected fixture URL');
  };
  const owner = createCdseOwner({
    root,
    env: CONFIG,
    fetchImpl,
    now: timer.now,
    budgetOptions: { sleep: timer.sleep },
    random: () => 0,
    ...options,
  });
  return { owner, calls, timer, root, fetchImpl };
}
async function request(
  middleware,
  path,
  {
    method = 'GET',
    value,
    headers = {},
    remoteAddress = '::1',
    bytes,
    holdFinish = false,
  } = {},
) {
  const req = Readable.from(
    bytes
      ? [bytes]
      : value === undefined
        ? []
        : [Buffer.from(JSON.stringify(value))],
  );
  req.url = path;
  req.method = method;
  req.headers = {
    host: 'localhost:4173',
    ...(value === undefined ? {} : { 'content-type': 'application/json' }),
    ...headers,
  };
  req.socket = { remoteAddress };
  const res = new EventEmitter();
  const received = {};
  res.setHeader = (key, data) => {
    received[key.toLowerCase()] = data;
  };
  res.end = (body) => {
    received.status = res.statusCode;
    received.body = body;
    res.writableEnded = true;
    if (!holdFinish) res.emit('finish');
  };
  await middleware(req, res);
  return {
    ...received,
    response: res,
    json: received['content-type']?.includes('json')
      ? JSON.parse(received.body)
      : null,
  };
}

async function consumedImage(owner, input, options) {
  const response = await owner.image(input, options);
  response.release();
  return response;
}

test('no configuration/status never creates storage, starts OAuth, or fabricates zero usage', async () => {
  const root = join(temp(), 'not-created');
  let calls = 0;
  const middleware = createCdseMiddleware({
    root,
    env: {},
    fetchImpl: async () => {
      calls++;
      throw new Error('Forbidden network');
    },
  });
  const status = await request(middleware, '/usage');
  assert.equal(status.status, 200);
  assert.equal(status.json.configured, false);
  assert.equal(status.json.requests, null);
  const result = await request(middleware, '/catalog', {
    method: 'POST',
    value: { box: BOX },
  });
  assert.equal(result.status, 503);
  assert.equal(result.json.code, 'missing_configuration');
  assert.equal(calls, 0);
  assert.equal(existsSync(root), false);
});

test('CDSE uses the documented deployment endpoints and Catalog GeoJSON negotiation', async () => {
  // Independent contract: the fake must not accept an incorrect URL merely
  // because production and the fake both import CDSE_URLS.
  assert.deepEqual(CDSE_URLS, {
    token:
      'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token',
    catalog: 'https://sh.dataspace.copernicus.eu/catalog/v1/search',
    process: 'https://sh.dataspace.copernicus.eu/process/v1',
  });
  const seen = [];
  const f = fixture({
    responder: async (url, init) => {
      seen.push(url);
      if (url === 'https://sh.dataspace.copernicus.eu/catalog/v1/search') {
        assert.equal(init.headers.Accept, 'application/geo+json');
        assert.equal(init.headers['Content-Type'], 'application/json');
      }
      if (url === 'https://sh.dataspace.copernicus.eu/process/v1')
        assert.equal(init.headers.Accept, 'application/x-tar');
    },
  });
  const catalog = await f.owner.catalog({ box: BOX });
  await consumedImage(f.owner, {
    box: BOX,
    candidateId: catalog.candidates[0].id,
  });
  assert.deepEqual(seen, [
    CDSE_URLS.token,
    CDSE_URLS.catalog,
    CDSE_URLS.process,
  ]);
});

test('Catalog HTTP errors expose only a fixed stage and numeric status, retain usage, and are not cached', async () => {
  const f = fixture({
    responder: async (url) =>
      url === CDSE_URLS.catalog
        ? new Response(
            `untrusted provider payload ${CONFIG.CDSE_CLIENT_SECRET}`,
            {
              status: 404,
            },
          )
        : null,
  });
  const middleware = createCdseMiddleware({ owner: f.owner, env: CONFIG });
  const result = await request(middleware, '/catalog', {
    method: 'POST',
    value: { box: BOX },
  });
  assert.equal(result.status, 503);
  assert.equal(result.json.code, 'provider_unavailable');
  assert.equal(result.json.providerStage, 'catalog');
  assert.equal(result.json.providerStatus, 404);
  assert.doesNotMatch(
    result.body,
    /untrusted provider payload|test-only-secret/,
  );
  assert.equal(f.owner.usage().requests, 1);
  assert.equal(f.owner.usage().pu, 0.0125);
  assert.equal(f.owner.usage().cache.entries, 0);
});

test('Process HTTP errors retain the Catalog result and report a safe process diagnostic', async () => {
  const f = fixture({
    responder: async (url) =>
      url === CDSE_URLS.process
        ? new Response('private body', { status: 502 })
        : null,
  });
  const catalog = await f.owner.catalog({ box: BOX });
  await assert.rejects(
    f.owner.image({ box: BOX, candidateId: catalog.candidates[0].id }),
    (error) =>
      error.code === 'provider_unavailable' &&
      error.providerStage === 'process' &&
      error.providerStatus === 502 &&
      !error.message.includes('private body'),
  );
  assert.equal(f.owner.usage().requests, 2);
});

test('warm coalesced handles retain one charged PNG until every response reader releases it', async () => {
  const f = fixture();
  const catalog = await f.owner.catalog({ box: BOX });
  const input = { candidateId: catalog.candidates[0].id, box: BOX };
  await consumedImage(f.owner, input);
  const before = f.owner.usage();
  const [a, b] = await Promise.all([
    f.owner.image(input),
    f.owner.image(input),
  ]);
  assert.equal(
    a.bytes,
    b.bytes,
    'Coalesced warm readers share one physical buffer',
  );
  assert.equal(a.metadata.cache, 'hit');
  const charged = f.owner.usage().workingMemory.admittedBytes;
  assert.ok(charged > 0);
  a.release();
  assert.equal(f.owner.usage().workingMemory.admittedBytes, charged);
  a.release();
  assert.equal(f.owner.usage().workingMemory.admittedBytes, charged);
  b.release();
  assert.equal(f.owner.usage().workingMemory.admittedBytes, 0);
  assert.equal(f.owner.usage().requests, before.requests);
  assert.equal(f.owner.usage().pu, before.pu);
});

test('slow warm HTTP responses hold memory through end until finish/close and queue another near-cap buffer', async () => {
  const f = fixture();
  const firstBox = {
    west: 0,
    south: 0,
    east: 20_470 / 111_700,
    north: 20_470 / 111_700,
  };
  const secondBox = { ...firstBox, west: 0.1, east: 0.1 + firstBox.east };
  const first = await f.owner.catalog({ box: firstBox });
  const second = await f.owner.catalog({ box: secondBox });
  const inputA = { candidateId: first.candidates[0].id, box: firstBox };
  const inputB = { candidateId: second.candidates[0].id, box: secondBox };
  await consumedImage(f.owner, inputA);
  await consumedImage(f.owner, inputB);
  const before = f.owner.usage();
  const middleware = createCdseMiddleware({
    root: f.root,
    owner: f.owner,
    env: CONFIG,
  });
  const a = await request(middleware, '/image', {
    method: 'POST',
    value: inputA,
    holdFinish: true,
  });
  assert.equal(a.status, 200);
  assert.equal(a.response.writableEnded, true);
  assert.ok(f.owner.usage().workingMemory.admittedBytes > 64 * 1024 ** 2);
  let delivered = false;
  const pending = request(middleware, '/image', {
    method: 'POST',
    value: inputB,
    holdFinish: true,
  }).then((value) => {
    delivered = true;
    return value;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(delivered, false);
  assert.equal(f.owner.usage().workingMemory.queued, 1);
  assert.ok(f.owner.usage().workingMemory.admittedBytes <= 128 * 1024 ** 2);
  a.response.emit('finish');
  const b = await pending;
  assert.equal(b.status, 200);
  assert.ok(f.owner.usage().workingMemory.admittedBytes > 0);
  b.response.emit('close');
  assert.equal(f.owner.usage().workingMemory.admittedBytes, 0);
  assert.equal(f.owner.usage().requests, before.requests);
  assert.equal(f.owner.usage().pu, before.pu);
  assert.equal(f.owner.usage().oauthCalls, before.oauthCalls);
});

test('cancelling while an OS ledger lock is held cannot reserve or dispatch after the lock opens', async () => {
  const root = temp();
  let entered;
  const waiting = new Promise((resolve) => {
    entered = resolve;
  });
  let resume;
  const blocked = new Promise((resolve) => {
    resume = resolve;
  });
  const budget = createBudget({
    root,
    sleep: async () => {
      entered();
      await blocked;
    },
  });
  writeFileSync(join(root, 'usage.lock'), String(process.pid));
  const controller = new AbortController();
  let dispatches = 0;
  const queued = budget.run(2, async () => dispatches++, {
    signal: controller.signal,
  });
  await waiting;
  controller.abort();
  fs.unlinkSync(join(root, 'usage.lock'));
  resume();
  await assert.rejects(queued, (error) => error.name === 'AbortError');
  assert.equal(dispatches, 0);
  assert.equal(budget.summary().requests, 0);
  assert.equal(budget.summary().pu, 0);
  assert.equal(existsSync(join(root, 'usage.lock')), false);
});

test('loopback, exact Origin, forwarding, Fetch-Site, methods and bounded JSON gates run before owner', async () => {
  const root = join(temp(), 'absent');
  const middleware = createCdseMiddleware({ root, env: {} });
  for (const options of [
    { remoteAddress: '192.0.2.1' },
    { headers: { host: 'example.com' } },
    { headers: { origin: 'https://evil.example' } },
    { headers: { origin: 'null' } },
    { headers: { 'x-forwarded-for': '127.0.0.1' } },
    { headers: { 'sec-fetch-site': 'cross-site' } },
  ])
    assert.equal((await request(middleware, '/usage', options)).status, 403);
  assert.equal((await request(middleware, '/catalog')).status, 405);
  assert.equal(
    (await request(middleware, '/usage?token=not-a-real-token')).status,
    404,
  );
  assert.equal(
    (
      await request(middleware, '/catalog', {
        method: 'POST',
        bytes: Buffer.from('{'),
        headers: { 'content-type': 'application/json' },
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await request(middleware, '/catalog', {
        method: 'POST',
        bytes: Buffer.alloc(8193),
        headers: { 'content-type': 'application/json' },
      })
    ).status,
    413,
  );
  assert.equal(
    (
      await request(middleware, '/catalog', {
        method: 'POST',
        value: {},
        headers: { 'content-type': 'text/plain' },
      })
    ).status,
    415,
  );
  assert.equal(existsSync(root), false);
});

test('catalog accepts only immutable bounded boxes and the last 30 UTC days', () => {
  const now = Date.parse('2026-10-22T01:00:00Z');
  assert.equal(catalogQuery({ box: BOX }, now).startDay, '2026-09-23');
  for (const value of [
    { box: BOX, url: 'https://evil.example' },
    { box: { ...BOX, west: 170, east: -170 } },
    { box: { ...BOX, north: 85 } },
    { box: BOX, startDay: '2026-09-01' },
    { box: BOX, endDay: '2026-10-23' },
    { box: BOX, maxCloud: -1 },
  ])
    assert.throws(() => catalogQuery(value, now));
});

test('scene identities remain separate on one day; unknown cloud is not zero and filtered explicitly', () => {
  const query = catalogQuery({ box: BOX }, Date.parse('2026-10-22'));
  const second = {
    id: ID.replace('S2A', 'S2B'),
    properties: { datetime: ACQUIRED },
  };
  const candidates = candidatesFromCatalog(
    { features: [FEATURE, second, FEATURE] },
    query,
  );
  assert.equal(candidates.length, 2);
  assert.notEqual(candidates[0].key, candidates[1].key);
  assert.equal(
    candidates.find((item) => item.contributors[0].id.startsWith('S2B'))
      .cloudPercent,
    null,
  );
  assert.equal(
    candidatesFromCatalog(
      { features: [FEATURE, second] },
      { ...query, maxCloud: 3 },
    ).length,
    0,
  );
  assert.equal(
    candidatesFromCatalog(
      { features: [FEATURE, second] },
      { ...query, maxCloud: 5 },
    ).length,
    1,
  );
});

test('native geometry uses bounded single images, 128px previews, and clipped north-first 512px chunks', () => {
  const single = imagePlan(BOX);
  assert.equal(single.mode, 'single');
  assert.ok(single.width > 800);
  assert.ok(single.height > 700);
  const heavy = {
    west: 0,
    south: 0,
    east: 20_400 / 111_700,
    north: 20_400 / 111_700,
  };
  assert.deepEqual(imagePlan(heavy), {
    width: 2040,
    height: 2040,
    mode: 'single',
    columns: 1,
    rows: 1,
  });
  assert.equal(processPu(2040, 2040), 15.875244140625);
  const large = { ...heavy, east: 24_999 / 111_700 };
  const plan = imagePlan(large);
  assert.equal(plan.mode, 'chunks');
  const last = imageGeometry(large, {
    part: { column: plan.columns - 1, row: plan.rows - 1 },
  });
  assert.equal(last.width, plan.width % 512);
  assert.equal(last.box.east, large.east);
  assert.equal(last.box.south, large.south);
  assert.ok(last.width <= 512);
  assert.equal(
    Math.max(
      imageGeometry(large, { preview: true }).width,
      imageGeometry(large, { preview: true }).height,
    ),
    128,
  );
  assert.throws(() => imageGeometry(large));
  assert.throws(() => imageGeometry(BOX, { part: { column: 0, row: 0 } }));
});

test('server-owned evalscript selects the catalog product, not a different scene or a day mosaic', () => {
  const candidate = candidatesFromCatalog(
    { features: [FEATURE] },
    catalogQuery({ box: BOX }, Date.parse('2026-10-22')),
  )[0];
  const body = processRequest(candidate, imageGeometry(BOX));
  const context = {};
  vm.createContext(context);
  vm.runInContext(body.evalscript, context);
  const input = {
    scenes: {
      tiles: [
        { sentinel2ProductId: `${ID}.SAFE` },
        { sentinel2ProductId: ID.replace('S2A', 'S2B'), productId: ID },
      ],
    },
  };
  assert.equal(context.preProcessScenes(input).scenes.tiles.length, 1);
  const metadata = {};
  context.updateOutputMetadata(input.scenes, {}, metadata);
  assert.equal(metadata.userData.tiles[0].productId, `${ID}.SAFE`);
  assert.equal(
    body.input.bounds.properties.crs,
    'http://www.opengis.net/def/crs/EPSG/0/4326',
  );
  assert.deepEqual(
    body.output.responses.map((response) => response.identifier),
    ['default', 'userdata'],
  );
});

test('cold catalog/image coalesce, warm repeats/export reuse consume no provider calls, restart preserves usage', async () => {
  const f = fixture();
  const [a, b] = await Promise.all([
    f.owner.catalog({ box: BOX }),
    f.owner.catalog({ box: BOX }),
  ]);
  assert.equal(a.candidates.length, 1);
  assert.deepEqual(a.candidates, b.candidates);
  assert.equal(
    f.calls.filter((call) => call.url === CDSE_URLS.token).length,
    1,
  );
  assert.equal(
    f.calls.filter((call) => call.url === CDSE_URLS.catalog).length,
    1,
  );
  const input = { candidateId: a.candidates[0].id, box: BOX };
  const [first, duplicate] = await Promise.all([
    f.owner.image(input),
    f.owner.image(input),
  ]);
  assert.deepEqual(first.bytes, duplicate.bytes);
  assert.equal(first.metadata.contributors[0].id, ID);
  assert.match(first.metadata.credit, /2026/);
  first.release();
  duplicate.release();
  assert.equal((await consumedImage(f.owner, input)).metadata.cache, 'hit');
  assert.equal(f.owner.usage().requests, 2);
  assert.equal(f.owner.usage().oauthCalls, 1);
  const before = readFileSync(join(f.root, 'usage.json'));
  const beforePu = f.owner.usage().pu;
  const next = fixture({ root: f.root });
  assert.equal((await consumedImage(next.owner, input)).metadata.cache, 'hit');
  assert.equal(next.calls.length, 0);
  assert.equal(next.owner.usage().requests, 2);
  assert.equal(next.owner.usage().pu, beforePu);
  assert.deepEqual(readFileSync(join(f.root, 'usage.json')), before);
});

test('image cannot change the catalog box or submit arbitrary fetch/render parameters', async () => {
  const f = fixture();
  const result = await f.owner.catalog({ box: BOX });
  for (const input of [
    {
      candidateId: result.candidates[0].id,
      box: { ...BOX, east: BOX.east + 0.01 },
    },
    {
      candidateId: result.candidates[0].id,
      box: BOX,
      url: 'https://evil.example',
    },
  ])
    await assert.rejects(f.owner.image(input), (error) => error.status === 400);
  assert.equal(
    f.calls.filter((call) => call.url === CDSE_URLS.process).length,
    0,
  );
});

test('returned identity, sensing time, dimensions, tar paths and coverage fail closed before cache admission', () => {
  const candidate = candidatesFromCatalog(
    { features: [FEATURE] },
    catalogQuery({ box: BOX }, Date.parse('2026-10-22')),
  )[0];
  const geometry = imageGeometry(BOX);
  const body = processRequest(candidate, geometry);
  assert.equal(
    parseProcessTar(processArchive(body), candidate, geometry).sensingTime,
    ACQUIRED,
  );
  for (const archive of [
    processArchive(body, { identity: ID.replace('S2A', 'S2B') }),
    processArchive(body, { time: '2026-10-16T15:59:31Z' }),
    processArchive(body, { validPixels: 0 }),
    processArchive({ output: { width: 1, height: 1 } }),
    tar({ '../default.png': png(1, 1), 'userdata.json': {} }),
  ])
    assert.throws(
      () => parseProcessTar(archive, candidate, geometry),
      (error) => ['provenance_unverified', 'no_coverage'].includes(error.code),
    );
});

test('bounded PNG validation rejects transparent coverage, bad CRC, unsupported format and inflate expansion', () => {
  assert.equal(pngValidPixels(png(2, 2, 0), 2, 2), 0);
  assert.equal(pngValidPixels(png(2, 2, 1), 2, 2), 1);
  const corrupted = png(2, 2, 1);
  corrupted[corrupted.length - 5] ^= 1;
  assert.throws(
    () => pngValidPixels(corrupted, 2, 2),
    (error) => error.code === 'provenance_unverified',
  );
  const header = Buffer.alloc(13);
  header.writeUInt32BE(1, 0);
  header.writeUInt32BE(1, 4);
  header[8] = 8;
  header[9] = 6;
  const make = (ihdr, raw) =>
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      pngChunk('IHDR', ihdr),
      pngChunk('IDAT', deflateSync(raw)),
      pngChunk('IEND', Buffer.alloc(0)),
    ]);
  assert.throws(
    () => pngValidPixels(make(header, Buffer.alloc(1024 * 1024)), 1, 1),
    (error) => error.code === 'provenance_unverified',
  );
  const unsupported = Buffer.from(header);
  unsupported[9] = 2;
  assert.throws(() => pngValidPixels(make(unsupported, Buffer.alloc(5)), 1, 1));
  for (let filter = 0; filter <= 4; filter++)
    assert.equal(
      pngValidPixels(make(header, Buffer.from([filter, 0, 0, 0, 255])), 1, 1),
      1,
    );
  const candidate = candidatesFromCatalog(
    { features: [FEATURE] },
    catalogQuery({ box: BOX }, Date.parse('2026-10-22')),
  )[0];
  const geometry = imageGeometry(BOX);
  const archive = tar({
    'default.png': png(geometry.width, geometry.height, 0),
    'userdata.json': {
      tiles: [{ productId: ID, date: ACQUIRED }],
      validPixels: 1,
    },
  });
  assert.throws(
    () => parseProcessTar(archive, candidate, geometry),
    (error) => error.code === 'no_coverage',
  );
});

test('provider 429 uses documented milliseconds, bounded backoff, and separately reserves every attempt', async () => {
  let catalogCalls = 0;
  const f = fixture({
    responder: async (url) =>
      url === CDSE_URLS.catalog && catalogCalls++ === 0
        ? new Response('', { status: 429, headers: { 'retry-after': '3398' } })
        : null,
  });
  await f.owner.catalog({ box: BOX });
  assert.ok(f.timer.sleeps.includes(3398));
  assert.equal(f.owner.usage().requests, 2);
  assert.equal(f.owner.usage().pu, 0.025);
  assert.equal(f.owner.usage().retrying, 0);
});

test('provider quota errors never become cached no-coverage and never retry forever', async () => {
  const f = fixture({
    responder: async (url) =>
      url === CDSE_URLS.catalog
        ? new Response('', {
            status: 429,
            headers: { 'retry-after': '300000' },
          })
        : null,
  });
  await assert.rejects(
    f.owner.catalog({ box: BOX }),
    (error) => error.code === 'provider_quota',
  );
  assert.equal(f.owner.usage().requests, 1);
  assert.equal(f.owner.usage().cache.entries, 0);
});

test('uncertain transport consumption survives restart and errors do not echo provider/credential values', async () => {
  const f = fixture({
    responder: async (url) => {
      if (url === CDSE_URLS.catalog) throw new Error(CONFIG.CDSE_CLIENT_SECRET);
    },
  });
  await assert.rejects(
    f.owner.catalog({ box: BOX }),
    (error) =>
      !error.message.includes(CONFIG.CDSE_CLIENT_SECRET) &&
      error.code === 'provider_unavailable',
  );
  assert.equal(fixture({ root: f.root }).owner.usage().requests, 1);
});

test('monthly ceiling fails before dispatch; period rollover retains the prior monthly aggregate', async () => {
  const root = temp();
  const timer = clock();
  const budget = createBudget({
    root,
    now: timer.now,
    sleep: timer.sleep,
    limits: { ...CDSE_LIMITS, requests: 1 },
  });
  let sent = 0;
  await budget.run(2, async () => sent++);
  await assert.rejects(
    budget.run(2, async () => sent++),
    (error) => error.code === 'monthly_ceiling',
  );
  assert.equal(sent, 1);
  timer.set(Date.parse('2026-11-01T00:00:01Z'));
  await budget.run(3, async () => sent++);
  const saved = JSON.parse(readFileSync(join(root, 'usage.json'), 'utf8'));
  assert.equal(saved.month, '2026-11');
  assert.equal(saved.requests, 1);
  assert.equal(saved.pu, 3.75);
  assert.equal(saved.history[0].requests, 1);
  assert.equal(saved.history[0].pu, 2.5);
  assert.equal(saved.history[0].puCalibrationFactor, 1.25);
});

test('PU calibration applies before monthly admission and preserves the approved ceilings', async () => {
  assert.equal(CDSE_PU_CALIBRATION, 1.25);
  assert.equal(CDSE_LIMITS.requests, 8000);
  assert.equal(CDSE_LIMITS.pu, 8000);
  assert.equal(CDSE_LIMITS.requestsPerMinute, 120);
  assert.equal(CDSE_LIMITS.puPerMinute, 120);
  const timer = clock();
  const budget = createBudget({
    root: temp(),
    now: timer.now,
    sleep: timer.sleep,
    limits: { ...CDSE_LIMITS, pu: 2.4 },
  });
  // The raw 2 PU fits; its 2.5 PU reservation must be rejected before dispatch.
  await assert.rejects(
    budget.run(2, () => assert.fail('Must not dispatch')),
    (error) => error.code === 'monthly_ceiling',
  );
  assert.equal(budget.summary().pu, 0);
  assert.equal(budget.summary().requests, 0);
  assert.equal(budget.summary().puCalibrationFactor, 1.25);
  assert.equal(budget.summary().puCalibrationApplied, true);
});

test('rolling minute admission and dispatch pacing use calibrated PU', async () => {
  const timer = clock();
  const budget = createBudget({
    root: temp(),
    now: timer.now,
    sleep: timer.sleep,
    limits: { ...CDSE_LIMITS, puPerMinute: 3 },
  });
  const dispatches = [];
  await budget.run(2, () => dispatches.push(timer.now()));
  await budget.run(0.2, () => dispatches.push(timer.now()));
  await budget.run(0.8, () => dispatches.push(timer.now()));
  // The second request fits but must be paced by the first 2.5 PU charge.
  // Raw 2 + 0.2 + 0.8 would fit; calibrated 2.5 + 0.25 + 1 does not.
  assert.equal(dispatches[1] - dispatches[0], 50_000);
  assert.equal(dispatches[2] - dispatches[0], 60_000);
  assert.ok(timer.sleeps.includes(50_000), '2.5 PU sets the initial pacing');
  assert.equal(budget.summary().pu, 3.75);
});

function legacyLedger(timer, overrides = {}) {
  return {
    version: 1,
    month: '2026-10',
    requests: 80,
    pu: 60,
    oauthCalls: 2,
    nextDispatch: timer.now() + 1000,
    pauseUntil: timer.now() + 500,
    events: [{ at: timer.now(), pu: 2 }],
    history: [{ month: '2026-09', requests: 10, pu: 12, oauthCalls: 1 }],
    ...overrides,
  };
}

test('legacy calibration is locked and idempotent; passive reads and restarts never rewrite or reset usage', async () => {
  const root = temp();
  const timer = clock();
  const path = join(root, 'usage.json');
  const original = legacyLedger(timer);
  writeFileSync(path, JSON.stringify(original));
  const bytes = readFileSync(path);
  const options = { root, now: timer.now, sleep: timer.sleep };
  const first = createBudget(options);
  const second = createBudget(options);
  assert.equal(first.summary().pu, 75);
  assert.equal(first.summary().puCalibrationApplied, false);
  assert.deepEqual(readFileSync(path), bytes);
  await Promise.all([first.calibrate(), second.calibrate()]);
  const saved = JSON.parse(readFileSync(path, 'utf8'));
  assert.equal(saved.version, 2);
  assert.equal(saved.puCalibrationFactor, 1.25);
  assert.equal(saved.pu, 75);
  assert.equal(saved.requests, 80);
  assert.equal(saved.oauthCalls, 2);
  assert.equal(saved.month, original.month);
  assert.equal(saved.pauseUntil, original.pauseUntil);
  assert.deepEqual(saved.history, original.history);
  assert.deepEqual(saved.events, [{ at: timer.now(), pu: 2.5 }]);
  assert.equal(saved.nextDispatch, timer.now() + 1250);
  const migrated = readFileSync(path);
  const restarted = createBudget(options);
  assert.equal(restarted.summary().pu, 75);
  assert.equal(restarted.summary().puCalibrationApplied, true);
  await restarted.calibrate();
  assert.deepEqual(readFileSync(path), migrated);
});

test('first acquisition migrates legacy reservations before adding its own calibrated cost', async () => {
  const root = temp();
  const timer = clock();
  writeFileSync(join(root, 'usage.json'), JSON.stringify(legacyLedger(timer)));
  const budget = createBudget({ root, now: timer.now, sleep: timer.sleep });
  await budget.run(2, () => {});
  assert.equal(budget.summary().pu, 77.5);
  assert.equal(budget.summary().requests, 81);
  assert.equal(budget.summary().oauthCalls, 2);
});

test('unknown ledger calibration cannot reset usage or silently reduce the safety factor', async () => {
  const root = temp();
  const timer = clock();
  const path = join(root, 'usage.json');
  const original = JSON.stringify({
    ...legacyLedger(timer),
    version: 2,
    puCalibrationFactor: 1,
  });
  writeFileSync(path, original);
  const budget = createBudget({ root, now: timer.now, sleep: timer.sleep });
  await assert.rejects(
    budget.calibrate(),
    (error) => error.code === 'ledger_unavailable',
  );
  await assert.rejects(
    budget.run(1, () => assert.fail('Must not dispatch')),
    (error) => error.code === 'ledger_unavailable',
  );
  assert.equal(readFileSync(path, 'utf8'), original);
});

test('passive middleware projects legacy calibration without owner creation, provider calls or storage writes', async () => {
  const root = temp();
  const timer = clock();
  const path = join(root, 'usage.json');
  writeFileSync(path, JSON.stringify(legacyLedger(timer)));
  const original = readFileSync(path);
  const middleware = createCdseMiddleware({
    root,
    env: CONFIG,
    fetchImpl: () => assert.fail('Status must not acquire'),
  });
  const status = await request(middleware, '/usage');
  assert.equal(status.json.pu, 75);
  assert.equal(status.json.puCalibrationFactor, 1.25);
  assert.equal(status.json.puCalibrationApplied, false);
  assert.equal(status.json.requests, 80);
  assert.equal(existsSync(join(root, 'owner.lock')), false);
  assert.deepEqual(readFileSync(path), original);
  await createBudget({ root, now: timer.now, sleep: timer.sleep }).calibrate();
  const saved = readFileSync(path);
  const migratedStatus = await request(middleware, '/usage');
  assert.equal(migratedStatus.json.pu, 75);
  assert.equal(migratedStatus.json.puCalibrationApplied, true);
  assert.deepEqual(readFileSync(path), saved);
});

test('provider spending headers top up only above the calibrated reservation; missing headers stay unknown', async () => {
  for (const [spent, expected] of [
    [null, 0.0125],
    ['', 0.0125],
    ['invalid', 0.0125],
    ['0', 0.0125],
    ['0.01', 0.0125],
    ['0.0125', 0.0125],
    ['0.02', 0.02],
  ]) {
    const f = fixture({
      responder: async (url) =>
        url === CDSE_URLS.catalog
          ? Response.json(
              { features: [FEATURE], context: {} },
              {
                headers:
                  spent === null ? {} : { 'x-processingunits-spent': spent },
              },
            )
          : null,
    });
    await f.owner.catalog({ box: BOX });
    assert.equal(f.owner.usage().pu, expected, `Header: ${spent}`);
    assert.equal(f.owner.usage().requests, 1);
  }
});

test('shared ledger owners serialize reservations and corrupted ledger fails closed without resetting', async () => {
  const root = temp();
  const timer = clock();
  const a = createBudget({ root, now: timer.now, sleep: timer.sleep });
  const b = createBudget({ root, now: timer.now, sleep: timer.sleep });
  await Promise.all([a.run(1, async () => {}), b.run(1, async () => {})]);
  assert.equal(a.summary().requests, 2);
  writeFileSync(join(root, 'usage.json'), '{');
  const broken = createBudget({ root, now: timer.now, sleep: timer.sleep });
  await assert.rejects(
    broken.run(1, async () => assert.fail()),
    (error) => error.code === 'ledger_unavailable',
  );
  assert.equal(readFileSync(join(root, 'usage.json'), 'utf8'), '{');
});

test('request/PU pacing is smooth and cancellation removes waiting work without a reservation', async () => {
  const timer = clock();
  const root = temp();
  const budget = createBudget({ root, now: timer.now, sleep: timer.sleep });
  const dispatches = [];
  await budget.run(16, async () => dispatches.push(timer.now()));
  await budget.run(1, async () => dispatches.push(timer.now()));
  assert.ok(dispatches[1] - dispatches[0] >= 8000);
  let release;
  const held = new Promise((resolve) => {
    release = resolve;
  });
  const queuedBudget = createBudget({
    root: temp(),
    limits: { ...CDSE_LIMITS, concurrent: 1 },
  });
  const first = queuedBudget.run(1, () => held);
  await new Promise((resolve) => setTimeout(resolve, 10));
  const controller = new AbortController();
  const pending = queuedBudget.run(
    1,
    async () => assert.fail('Cancelled job dispatched'),
    { signal: controller.signal },
  );
  controller.abort();
  await assert.rejects(pending);
  release();
  await first;
  assert.equal(queuedBudget.summary().requests, 1);
  assert.equal(queuedBudget.summary().queued, 0);
});

test('cache includes metadata/temporary bytes, expires, evicts LRU, and restores indexed data after restart', () => {
  const root = temp();
  const timer = clock();
  const limits = { bytes: 900, lowWater: 700, entries: 3, ttl: 1000 };
  const cache = createImageryCache({ root, now: timer.now, limits });
  const keys = ['a', 'b', 'c'].map(cacheKey);
  assert.equal(cache.put(keys[0], Buffer.alloc(100), { name: 'a' }), true);
  timer.set(timer.now() + 1);
  assert.equal(cache.put(keys[1], Buffer.alloc(100), { name: 'b' }), true);
  timer.set(timer.now() + 1);
  cache.get(keys[0]);
  timer.set(timer.now() + 1);
  cache.put(keys[2], Buffer.alloc(300), { name: 'c' });
  assert.equal(cache.get(keys[1]), null);
  assert.ok(cache.get(keys[0]));
  const measured = readdirSync(root).reduce(
    (sum, name) => sum + statSync(join(root, name)).size,
    0,
  );
  assert.equal(cache.summary().bytes, measured);
  assert.ok(measured <= limits.bytes);
  writeFileSync(join(root, 'abandoned.tmp'), Buffer.alloc(100));
  const restored = createImageryCache({ root, now: timer.now, limits });
  assert.equal(existsSync(join(root, 'abandoned.tmp')), false);
  assert.ok(restored.get(keys[0]));
  timer.set(timer.now() + 1001);
  assert.equal(restored.get(keys[0]), null);
  assert.equal(restored.summary().entries, 0);
});

test('near-cap heavy session measurement exposes PU rather than request limit; warm repeat adds neither', async () => {
  const box = {
    west: 0,
    south: 0,
    east: 20_400 / 111_700,
    north: 20_400 / 111_700,
  };
  const f = fixture();
  const result = await f.owner.catalog({ box });
  const id = result.candidates[0].id;
  await consumedImage(f.owner, { candidateId: id, box, preview: true });
  await consumedImage(f.owner, { candidateId: id, box });
  const cold = f.owner.usage();
  const requests = cold.requests;
  const pu = cold.pu;
  await consumedImage(f.owner, { candidateId: id, box });
  const warm = f.owner.usage();
  assert.equal(requests, 3);
  assert.ok(pu > 15.9);
  assert.equal(warm.requests, requests);
  assert.equal(warm.pu, pu);
  assert.ok(Math.floor(8000 / pu) < Math.floor(8000 / requests));
});

test('cache cleanup failures keep every retained orphan/temp byte counted and refuse further writes', () => {
  const root = temp();
  writeFileSync(join(root, 'unremovable.tmp'), Buffer.alloc(1000));
  const original = fs.unlinkSync;
  fs.unlinkSync = (path) => {
    if (String(path).startsWith(root))
      throw Object.assign(new Error('fixture-only cleanup failure'), {
        code: 'EACCES',
      });
    return original(path);
  };
  syncBuiltinESMExports();
  try {
    const cache = createImageryCache({
      root,
      limits: { bytes: 900, lowWater: 700, entries: 20_000, ttl: 1000 },
    });
    assert.equal(cache.summary().bytes, 1000);
    assert.equal(
      cache.put(cacheKey('must-not-fit'), Buffer.alloc(1), {}),
      false,
    );
    assert.equal(cache.summary().bytes, 1000);
    assert.equal(readdirSync(root).length, 1);
  } finally {
    fs.unlinkSync = original;
    syncBuiltinESMExports();
  }
});

test('failed LRU unlinks never release physical capacity for another admission', () => {
  const root = temp();
  const cache = createImageryCache({
    root,
    limits: { bytes: 900, lowWater: 600, entries: 20_000, ttl: 1000 },
  });
  const first = cacheKey('first');
  assert.equal(cache.put(first, Buffer.alloc(400), {}), true);
  const before = cache.summary().bytes;
  const original = fs.unlinkSync;
  fs.unlinkSync = (path) => {
    if (String(path).startsWith(root))
      throw Object.assign(new Error('fixture-only unlink failure'), {
        code: 'EACCES',
      });
    return original(path);
  };
  syncBuiltinESMExports();
  try {
    assert.equal(cache.put(cacheKey('second'), Buffer.alloc(400), {}), false);
    assert.equal(cache.summary().bytes, before);
    const physical = readdirSync(root).reduce(
      (sum, name) => sum + statSync(join(root, name)).size,
      0,
    );
    assert.equal(physical, before);
    assert.ok(physical <= 900);
  } finally {
    fs.unlinkSync = original;
    syncBuiltinESMExports();
  }
});

test('cached catalogs rehydrate candidate admission after candidate LRU eviction without another request', async () => {
  const f = fixture({
    cacheOptions: {
      limits: {
        bytes: 1600,
        lowWater: 1200,
        entries: 20_000,
        ttl: 14 * 86_400_000,
      },
    },
  });
  const first = await f.owner.catalog({ box: BOX });
  const again = await f.owner.catalog({ box: BOX });
  assert.equal(again.cache, 'hit');
  const image = await f.owner.image({
    candidateId: first.candidates[0].id,
    box: BOX,
  });
  assert.equal(image.metadata.nativeResolutionM, 10);
  image.release();
  assert.equal(
    f.calls.filter((call) => call.url === CDSE_URLS.catalog).length,
    1,
  );
});

test('session fixtures measure two/three dates, heavy near-cap PU, clipped chunks, visible previews and zero-call warm repeat', async (t) => {
  const features = [15, 16, 17].map((day) => ({
    id: FEATURE.id.replaceAll('20261015', `202610${day}`),
    properties: {
      datetime: `2026-10-${day}T15:59:31.024Z`,
      'eo:cloud_cover': day,
    },
  }));
  const scenarios = [
    {
      name: 'typical-two-dates',
      box: { west: 0, south: 0, east: 10_000 / 111_700, north: 8000 / 111_700 },
      dates: 2,
    },
    {
      name: 'typical-three-dates',
      box: { west: 0, south: 0, east: 10_000 / 111_700, north: 8000 / 111_700 },
      dates: 3,
    },
    {
      name: 'heavy-2040-two-dates',
      box: {
        west: 0,
        south: 0,
        east: 20_400 / 111_700,
        north: 20_400 / 111_700,
      },
      dates: 2,
    },
    {
      name: 'heavy-2040-three-dates',
      box: {
        west: 0,
        south: 0,
        east: 20_400 / 111_700,
        north: 20_400 / 111_700,
      },
      dates: 3,
    },
    {
      name: 'oversized-clipped-chunks',
      box: { west: 0, south: 0, east: 25_000 / 111_700, north: 8000 / 111_700 },
      dates: 2,
    },
  ];
  for (const scenario of scenarios) {
    const f = fixture({
      responder: async (url, init) => {
        if (url === CDSE_URLS.catalog)
          return Response.json({ features, context: {} });
        if (url !== CDSE_URLS.process) return null;
        const body = JSON.parse(init.body);
        const selected = features.find((feature) =>
          body.evalscript.includes(feature.id.replace(/\.SAFE$/, '')),
        );
        assert.ok(
          selected,
          'Every request retains the selected exact acquisition',
        );
        return new Response(
          processArchive(body, {
            identity: selected.id,
            time: selected.properties.datetime,
          }),
        );
      },
    });
    const catalog = await f.owner.catalog({ box: scenario.box });
    // Exactly the three declared visible cards, without hidden-card acquisition.
    for (const candidate of catalog.candidates)
      await consumedImage(f.owner, {
        candidateId: candidate.id,
        box: scenario.box,
        preview: true,
      });
    const selected = catalog.candidates.slice(0, scenario.dates);
    const loads = [];
    for (const candidate of selected) {
      const plan = candidate.imagePlan;
      for (let row = 0; row < plan.rows; row++)
        for (let column = 0; column < plan.columns; column++) {
          const input = {
            candidateId: candidate.id,
            box: scenario.box,
            ...(plan.mode === 'chunks' ? { part: { column, row } } : {}),
          };
          await consumedImage(f.owner, input);
          loads.push(input);
        }
    }
    const cold = f.owner.usage();
    const rawPu = f.calls.reduce((sum, call) => {
      if (call.url === CDSE_URLS.catalog) return sum + 0.01;
      if (call.url !== CDSE_URLS.process) return sum;
      const { width, height } = JSON.parse(call.init.body).output;
      return sum + Math.max(0.01, (width * height) / (512 * 512));
    }, 0);
    assert.ok(Math.abs(cold.pu - calibratedPu(rawPu)) < 1e-9);
    for (const input of loads) await consumedImage(f.owner, input);
    const warm = f.owner.usage();
    assert.equal(warm.requests, cold.requests);
    assert.equal(warm.pu, cold.pu);
    t.diagnostic(
      JSON.stringify({
        scenario: scenario.name,
        fixtureOnly: true,
        box: scenario.box,
        imagePlan: selected[0].imagePlan,
        uniqueDates: scenario.dates,
        visibleThumbnails: 3,
        requests: cold.requests,
        reservedPu: cold.pu,
        oauthCalls: cold.oauthCalls,
        warmAdditionalRequests: warm.requests - cold.requests,
        warmAdditionalPu: warm.pu - cold.pu,
        modeledSessions: Math.floor(
          Math.min(8000 / cold.requests, 8000 / cold.pu),
        ),
      }),
    );
    assert.equal(cold.requests, 1 + 3 + loads.length);
  }
});
