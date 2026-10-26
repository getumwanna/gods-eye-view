import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import {
  readResponseBytesCapped,
  readResponseJsonCapped,
} from '../../providers/common/http.js';
import { createBudget } from './budget.js';
import { cacheKey, createImageryCache } from './cache.js';
import {
  catalogQuery,
  candidatesFromCatalog,
  imageGeometry,
  imageryError,
  productIdentity,
  validateBox,
} from './catalog.js';

export const CDSE_URLS = Object.freeze({
  token:
    'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token',
  catalog: 'https://sh.dataspace.copernicus.eu/catalog/v1/search',
  process: 'https://sh.dataspace.copernicus.eu/process/v1',
});
const DAY = 86_400_000;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++)
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function pngCrc(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes)
    value = CRC_TABLE[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

/** Validate known server-requested RGBA8 PNGs and their dataMask-derived alpha. */
export function pngValidPixels(bytes, width, height) {
  const invalid = () =>
    imageryError(
      'provenance_unverified',
      'Sentinel-2 returned a corrupt or unsupported PNG image.',
      422,
    );
  if (
    !Buffer.isBuffer(bytes) ||
    bytes.length < 45 ||
    !bytes.subarray(0, 8).equals(PNG_SIGNATURE)
  )
    throw invalid();
  let offset = 8;
  let seenHeader = false;
  let ended = false;
  const compressed = [];
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    if (length > bytes.length - offset - 12) throw invalid();
    const kind = bytes.toString('ascii', offset + 4, offset + 8);
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    if (
      bytes.readUInt32BE(offset + 8 + length) !==
      pngCrc(bytes.subarray(offset + 4, offset + 8 + length))
    )
      throw invalid();
    if (!seenHeader) {
      if (
        kind !== 'IHDR' ||
        length !== 13 ||
        data.readUInt32BE(0) !== width ||
        data.readUInt32BE(4) !== height ||
        data[8] !== 8 ||
        data[9] !== 6 ||
        data[10] !== 0 ||
        data[11] !== 0 ||
        data[12] !== 0
      )
        throw invalid();
      seenHeader = true;
    } else if (kind === 'IDAT') compressed.push(data);
    else if (kind === 'IEND') {
      if (length !== 0) throw invalid();
      ended = true;
      offset += 12;
      break;
    } else if (kind === 'IHDR' || /^[A-Z]/.test(kind)) throw invalid();
    offset += length + 12;
  }
  if (!ended || offset !== bytes.length || compressed.length === 0)
    throw invalid();
  const rowBytes = width * 4;
  const expected = (rowBytes + 1) * height;
  let raw;
  try {
    raw = inflateSync(Buffer.concat(compressed), { maxOutputLength: expected });
  } catch {
    throw invalid();
  }
  if (raw.length !== expected) throw invalid();
  let previous = Buffer.alloc(rowBytes);
  let row = Buffer.alloc(rowBytes);
  let valid = 0;
  const paeth = (a, b, c) => {
    const p = a + b - c;
    const da = Math.abs(p - a);
    const db = Math.abs(p - b);
    const dc = Math.abs(p - c);
    return da <= db && da <= dc ? a : db <= dc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const start = y * (rowBytes + 1);
    const filter = raw[start];
    if (filter > 4) throw invalid();
    for (let x = 0; x < rowBytes; x++) {
      const left = x >= 4 ? row[x - 4] : 0;
      const above = previous[x];
      const upperLeft = x >= 4 ? previous[x - 4] : 0;
      const prediction =
        filter === 0
          ? 0
          : filter === 1
            ? left
            : filter === 2
              ? above
              : filter === 3
                ? Math.floor((left + above) / 2)
                : paeth(left, above, upperLeft);
      row[x] = (raw[start + x + 1] + prediction) & 255;
      if (x % 4 === 3 && row[x] !== 0) valid++;
    }
    [row, previous] = [previous, row];
  }
  return valid;
}
export const processPu = (width, height) =>
  Math.max(0.01, (width * height) / (512 * 512));

export function processRequest(candidate, geometry) {
  const identity = candidate.contributors[0].id;
  const from = new Date(
    Date.parse(candidate.acquisitionTime) - 1000,
  ).toISOString();
  const to = new Date(
    Date.parse(candidate.acquisitionTime) + 1000,
  ).toISOString();
  // The script is server-owned. Clients can never submit evalscripts or remote paths.
  const evalscript = `//VERSION=3
function setup(){return {input:["B04","B03","B02","dataMask"],mosaicking:"TILE",output:{id:"default",bands:4,sampleType:"AUTO"}};}
function preProcessScenes(collections){collections.scenes.tiles=collections.scenes.tiles.filter(function(t){return String(t.sentinel2ProductId||t.productId||"").replace(/\\.SAFE$/,"")===${JSON.stringify(identity)};});return collections;}
function evaluatePixel(samples){if(!samples.length||!samples[0].dataMask)return [0,0,0,0];return [2.5*samples[0].B04,2.5*samples[0].B03,2.5*samples[0].B02,samples[0].dataMask];}
function updateOutputMetadata(scenes,inputMetadata,outputMetadata){outputMetadata.userData={tiles:scenes.tiles.map(function(t){return {productId:t.sentinel2ProductId||t.productId,date:t.date};})};}`;
  const { box, width, height } = geometry;
  return {
    input: {
      bounds: {
        bbox: [box.west, box.south, box.east, box.north],
        properties: { crs: 'http://www.opengis.net/def/crs/EPSG/0/4326' },
      },
      data: [
        {
          type: 'sentinel-2-l2a',
          dataFilter: {
            timeRange: { from, to },
            mosaickingOrder: 'mostRecent',
          },
          processing: { upsampling: 'NEAREST', downsampling: 'NEAREST' },
        },
      ],
    },
    output: {
      width,
      height,
      responses: [
        { identifier: 'default', format: { type: 'image/png' } },
        { identifier: 'userdata', format: { type: 'application/json' } },
      ],
    },
    evalscript,
  };
}

/** Parse the two permitted regular tar members without extracting anything to disk. */
export function parseProcessTar(input, candidate, geometry) {
  const bytes = Buffer.isBuffer(input)
    ? input
    : Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  const members = new Map();
  let offset = 0;
  let count = 0;
  while (offset + 512 <= bytes.length) {
    const header = bytes.subarray(offset, offset + 512);
    if (header.every((value) => value === 0)) break;
    if (++count > 4)
      throw imageryError(
        'provenance_unverified',
        'Sentinel-2 returned an unexpected image archive.',
        422,
      );
    const name = header.subarray(0, 100).toString('utf8').replace(/\0.*$/, '');
    const prefix = header
      .subarray(345, 500)
      .toString('utf8')
      .replace(/\0.*$/, '');
    const kind = header[156];
    const sizeText = header
      .subarray(124, 136)
      .toString('ascii')
      .replace(/\0.*$/, '')
      .trim();
    const size = /^[0-7]+$/.test(sizeText) ? parseInt(sizeText, 8) : NaN;
    const checksum = parseInt(
      header.subarray(148, 156).toString('ascii').replace(/\0.*$/, '').trim(),
      8,
    );
    let actualChecksum = 0;
    for (let i = 0; i < 512; i++)
      actualChecksum += i >= 148 && i < 156 ? 32 : header[i];
    if (
      !['default.png', 'userdata.json'].includes(name) ||
      prefix ||
      ![0, 48].includes(kind) ||
      !Number.isSafeInteger(size) ||
      size < 0 ||
      size > 24 * 1024 ** 2 ||
      offset + 512 + size > bytes.length ||
      checksum !== actualChecksum ||
      members.has(name)
    )
      throw imageryError(
        'provenance_unverified',
        'Sentinel-2 image/provenance archive could not be verified.',
        422,
      );
    members.set(name, bytes.subarray(offset + 512, offset + 512 + size));
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  const image = members.get('default.png');
  let metadata;
  try {
    const raw = members.get('userdata.json');
    if (!raw || raw.length > 32_768) throw new Error('metadata');
    metadata = JSON.parse(raw.toString('utf8'));
  } catch {
    throw imageryError(
      'provenance_unverified',
      'Sentinel-2 did not return bounded acquisition metadata.',
      422,
    );
  }
  if (
    !image ||
    image.length < 33 ||
    !image.subarray(0, 8).equals(PNG_SIGNATURE) ||
    image.toString('ascii', 12, 16) !== 'IHDR' ||
    image.readUInt32BE(16) !== geometry.width ||
    image.readUInt32BE(20) !== geometry.height
  )
    throw imageryError(
      'provenance_unverified',
      'Sentinel-2 image dimensions do not match the selected 10 m grid.',
      422,
    );
  const tiles = metadata.tiles;
  if (
    !Array.isArray(tiles) ||
    tiles.length !== 1 ||
    productIdentity(tiles[0].productId) !== candidate.contributors[0].id ||
    !Number.isFinite(Date.parse(tiles[0].date)) ||
    Math.abs(
      Date.parse(tiles[0].date) - Date.parse(candidate.acquisitionTime),
    ) >= 1000
  )
    throw imageryError(
      'provenance_unverified',
      'Sentinel-2 rendered acquisition does not match the selected catalog scene.',
      422,
    );
  const alphaPixels = pngValidPixels(image, geometry.width, geometry.height);
  if (!alphaPixels)
    throw imageryError(
      'no_coverage',
      'The selected Sentinel-2 image is entirely no-data in this box.',
      422,
    );
  return {
    bytes: image,
    sensingTime: new Date(tiles[0].date).toISOString(),
    validPixelCount: alphaPixels,
  };
}

/** One local owner: token memory, coalescing, persistent budget and bounded cache. */
export function createCdseOwner({
  root,
  env = process.env,
  fetchImpl = fetch,
  now = Date.now,
  budgetOptions = {},
  cacheOptions = {},
  random = Math.random,
} = {}) {
  const budget = createBudget({ root, now, ...budgetOptions });
  const cache = createImageryCache({
    root: join(root, 'data'),
    now,
    ...cacheOptions,
  });
  const inflight = new Map();
  const knownCandidates = new Map();
  let admittedMemory = 0;
  let memoryQueue = 0;
  const memoryWaiters = new Set();
  async function reserveImageMemory(bytes, signal) {
    if (bytes > 128 * 1024 ** 2)
      throw imageryError(
        'memory_budget',
        'This Sentinel-2 image exceeds the local working-memory budget.',
        400,
      );
    if (memoryQueue >= 128)
      throw imageryError(
        'queue_full',
        'Sentinel-2 memory queue is full. Wait for current work.',
      );
    memoryQueue++;
    let waiting = true;
    try {
      while (admittedMemory + bytes > 128 * 1024 ** 2) {
        signal?.throwIfAborted();
        await new Promise((resolve, reject) => {
          const ready = () => {
            signal?.removeEventListener('abort', cancel);
            memoryWaiters.delete(ready);
            resolve();
          };
          const cancel = () => {
            memoryWaiters.delete(ready);
            reject(signal.reason);
          };
          memoryWaiters.add(ready);
          signal?.addEventListener('abort', cancel, { once: true });
          if (signal?.aborted) cancel();
        });
      }
      signal?.throwIfAborted();
      memoryQueue--;
      waiting = false;
      admittedMemory += bytes;
      let released = false;
      return {
        release() {
          if (released) return;
          released = true;
          admittedMemory -= bytes;
          for (const notify of [...memoryWaiters]) notify();
        },
      };
    } finally {
      if (waiting) memoryQueue--;
    }
  }
  let token = null;
  let tokenPromise = null;
  let lastTokenFailureAt = -Infinity;
  const configured = () =>
    Boolean(env.CDSE_CLIENT_ID?.trim() && env.CDSE_CLIENT_SECRET?.trim());
  const usage = () => ({
    ...budget.summary(),
    configured: configured(),
    cache: cache.summary(),
    workingMemory: {
      admittedBytes: admittedMemory,
      byteLimit: 128 * 1024 ** 2,
      queued: memoryQueue,
    },
  });
  function requireConfiguration() {
    if (!configured())
      throw imageryError(
        'missing_configuration',
        'Create a free CDSE account and OAuth client, then set CDSE_CLIENT_ID and CDSE_CLIENT_SECRET locally.',
      );
  }
  async function send(url, options, cap, json = false) {
    const signal = AbortSignal.any([
      ...(options.signal ? [options.signal] : []),
      AbortSignal.timeout(30_000),
    ]);
    let response;
    try {
      response = await fetchImpl(url, {
        ...options,
        signal,
        redirect: 'error',
      });
    } catch (error) {
      if (options.signal?.aborted) throw error;
      throw Object.assign(
        imageryError(
          'provider_unavailable',
          'Sentinel-2 provider request did not complete. Its reserved usage is retained.',
        ),
        {
          providerStage:
            url === CDSE_URLS.token
              ? 'oauth'
              : url === CDSE_URLS.catalog
                ? 'catalog'
                : 'process',
        },
      );
    }
    const body = response.ok
      ? await (json
          ? readResponseJsonCapped(response, cap, signal)
          : readResponseBytesCapped(response, cap, signal))
      : null;
    if (!response.ok) {
      try {
        await response.body?.cancel();
      } catch {
        /* Do not inspect/log provider error payloads. */
      }
    }
    return { response, body };
  }
  async function accessToken() {
    requireConfiguration();
    if (token && token.expiresAt > now() + 60_000) return token.value;
    if (tokenPromise) return tokenPromise;
    if (now() - lastTokenFailureAt < 30_000)
      throw imageryError(
        'authentication_failed',
        'CDSE authentication is paused briefly after a failed token request. Check local OAuth configuration.',
      );
    tokenPromise = (async () => {
      try {
        await budget.oauth();
        const { response, body } = await send(
          CDSE_URLS.token,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'client_credentials',
              client_id: env.CDSE_CLIENT_ID.trim(),
              client_secret: env.CDSE_CLIENT_SECRET.trim(),
            }),
          },
          32_768,
          true,
        );
        if (
          !response.ok ||
          typeof body?.access_token !== 'string' ||
          body.access_token.length > 16_384 ||
          !Number.isFinite(body.expires_in) ||
          body.expires_in < 1
        )
          throw imageryError(
            'authentication_failed',
            'CDSE rejected the local OAuth client. Check its configuration.',
          );
        token = {
          value: body.access_token,
          expiresAt: now() + Math.min(body.expires_in, 3600) * 1000,
        };
        return token.value;
      } catch (error) {
        lastTokenFailureAt = now();
        throw error;
      } finally {
        tokenPromise = null;
      }
    })();
    return tokenPromise;
  }
  async function providerRequest(
    url,
    body,
    pu,
    { signal, json = false, cap = 24 * 1024 ** 2 } = {},
  ) {
    requireConfiguration();
    for (let attempt = 0; attempt < 4; attempt++) {
      signal?.throwIfAborted();
      const access = await accessToken();
      const result = await budget.run(
        pu,
        () =>
          send(
            url,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${access}`,
                'Content-Type': 'application/json',
                Accept: json ? 'application/geo+json' : 'application/x-tar',
              },
              body: JSON.stringify(body),
              signal,
            },
            cap,
            json,
          ),
        { signal },
      );
      const { response } = result;
      const spent = response.headers.get('x-processingunits-spent');
      const actual = spent?.trim() ? Number(spent) : null;
      await budget.reconcile(pu, actual);
      if (response.ok) return result.body;
      if (response.status === 401 || response.status === 403) {
        token = null;
        throw imageryError(
          'authentication_failed',
          'CDSE authentication was rejected. Check the local OAuth client.',
        );
      }
      if (response.status === 429) {
        const retry = Number(response.headers.get('retry-after'));
        // CDSE documents milliseconds, unlike the common HTTP seconds convention.
        if (attempt === 3 || (Number.isFinite(retry) && retry > 120_000))
          throw imageryError(
            'provider_quota',
            'CDSE quota or rate limit remains unavailable. Check the account usage dashboard.',
            429,
          );
        const delay = Math.min(
          120_000,
          Math.max(Number.isFinite(retry) ? retry : 0, 1000 * 2 ** attempt) +
            Math.floor(random() * 250),
        );
        budget.setRetrying(1);
        try {
          await budget.pause(delay);
          await budget.sleep(delay, signal);
        } finally {
          budget.setRetrying(-1);
        }
        continue;
      }
      throw Object.assign(
        imageryError(
          'provider_unavailable',
          'Sentinel-2 provider is unavailable. Try HLS or retry later.',
        ),
        {
          providerStage: url === CDSE_URLS.catalog ? 'catalog' : 'process',
          providerStatus: response.status,
        },
      );
    }
    throw imageryError(
      'provider_unavailable',
      'Sentinel-2 provider is unavailable.',
    );
  }
  async function coalesce(key, work, signal, { leased = false } = {}) {
    signal?.throwIfAborted();
    let entry = inflight.get(key);
    if (!entry) {
      if (inflight.size >= 128)
        throw imageryError(
          'queue_full',
          'The shared Sentinel-2 acquisition queue is full. Wait for current work.',
        );
      const controller = new AbortController();
      entry = {
        controller,
        users: 0,
        settled: false,
        leased,
        baseReleased: false,
      };
      entry.promise = Promise.resolve()
        .then(() => work(controller.signal))
        .then((value) => {
          entry.value = value;
          if (!entry.users && entry.leased && !entry.baseReleased) {
            entry.baseReleased = true;
            value.release();
          }
          return value;
        })
        .finally(() => {
          entry.settled = true;
          if (inflight.get(key) === entry) inflight.delete(key);
        });
      inflight.set(key, entry);
    }
    entry.users++;
    return new Promise((resolve, reject) => {
      let done = false;
      const finish = (callback, value, successful = false) => {
        if (done) return;
        const delivered = successful && entry.leased ? value.retain() : value;
        done = true;
        signal?.removeEventListener('abort', cancel);
        entry.users--;
        if (!entry.users && !entry.settled) entry.controller.abort();
        if (
          !entry.users &&
          entry.settled &&
          entry.leased &&
          entry.value &&
          !entry.baseReleased
        ) {
          entry.baseReleased = true;
          entry.value.release();
        }
        callback(delivered);
      };
      const cancel = () =>
        finish(
          reject,
          signal.reason ??
            imageryError('cancelled', 'Imagery request cancelled.', 499),
        );
      signal?.addEventListener('abort', cancel, { once: true });
      entry.promise.then(
        (value) => finish(resolve, value, true),
        (error) => finish(reject, error),
      );
      if (signal?.aborted) cancel();
    });
  }
  async function catalog(input, { signal } = {}) {
    requireConfiguration();
    const query = catalogQuery(input, now());
    const key = cacheKey(['catalog-v1', query]);
    const hit = cache.get(key);
    if (hit) {
      const result = JSON.parse(hit.bytes.toString('utf8'));
      rememberCandidates(result.candidates, query.box);
      return { ...result, usage: usage(), cache: 'hit' };
    }
    return coalesce(
      key,
      async (sharedSignal) => {
        const candidates = new Map();
        let next;
        let truncated = false;
        for (let page = 0; page < 3; page++) {
          const body = {
            collections: ['sentinel-2-l2a'],
            bbox: [
              query.box.west,
              query.box.south,
              query.box.east,
              query.box.north,
            ],
            datetime: `${query.startDay}T00:00:00Z/${query.endDay}T23:59:59.999Z`,
            limit: 100,
            ...(next === undefined ? {} : { next }),
          };
          const payload = await providerRequest(CDSE_URLS.catalog, body, 0.01, {
            signal: sharedSignal,
            json: true,
            cap: 2 * 1024 ** 2,
          });
          for (const candidate of candidatesFromCatalog(payload, query))
            candidates.set(candidate.id, candidate);
          next = payload.context?.next;
          if (next === undefined || next === null) break;
          if (
            (!Number.isSafeInteger(next) &&
              !(
                typeof next === 'string' && /^[A-Za-z0-9_-]{1,256}$/.test(next)
              )) ||
            page === 2
          ) {
            truncated = true;
            break;
          }
        }
        const result = {
          candidates: [...candidates.values()].sort((a, b) =>
            b.acquisitionTime.localeCompare(a.acquisitionTime),
          ),
          acquiredAt: new Date(now()).toISOString(),
          truncated,
        };
        rememberCandidates(result.candidates, query.box);
        for (const candidate of result.candidates)
          cache.put(
            cacheKey(['candidate-v1', candidate.id, query.box]),
            Buffer.from(JSON.stringify({ candidate, box: query.box })),
            {},
            14 * DAY,
          );
        cache.put(
          key,
          Buffer.from(JSON.stringify(result)),
          {},
          result.candidates.length ? 15 * 60_000 : 5 * 60_000,
        );
        return { ...result, usage: usage(), cache: 'miss' };
      },
      signal,
    );
  }
  function rememberCandidates(candidates, box) {
    for (const candidate of candidates) {
      const key = cacheKey(['candidate-v1', candidate.id, box]);
      knownCandidates.delete(key);
      knownCandidates.set(key, { candidate, box, expiresAt: now() + 14 * DAY });
    }
    while (knownCandidates.size > 1000)
      knownCandidates.delete(knownCandidates.keys().next().value);
  }
  async function image(input, { signal } = {}) {
    requireConfiguration();
    if (
      !input ||
      Object.keys(input).some(
        (key) => !['candidateId', 'box', 'preview', 'part'].includes(key),
      ) ||
      typeof input.candidateId !== 'string' ||
      !/^S2:\d{4}-\d{2}-\d{2}:[a-f0-9]{64}$/.test(input.candidateId) ||
      (input.preview !== undefined && typeof input.preview !== 'boolean')
    )
      throw imageryError(
        'invalid_request',
        'Request an exact Sentinel-2 candidate and immutable box.',
        400,
      );
    const box = validateBox(input.box);
    const candidateKey = cacheKey(['candidate-v1', input.candidateId, box]);
    const known = knownCandidates.get(candidateKey);
    const stored =
      known && known.expiresAt > now() ? known : cache.get(candidateKey);
    if (!stored) {
      if (
        [...knownCandidates.values()].some(
          (entry) => entry.candidate.id === input.candidateId,
        )
      )
        throw imageryError(
          'box_changed',
          'The image box must match the selected catalog search exactly.',
          400,
        );
      throw imageryError(
        'candidate_expired',
        'The selected Sentinel-2 catalog scene expired. Search the same box again.',
        422,
      );
    }
    const { candidate, box: catalogBox } = stored.bytes
      ? JSON.parse(stored.bytes.toString('utf8'))
      : stored;
    if (JSON.stringify(box) !== JSON.stringify(catalogBox))
      throw imageryError(
        'box_changed',
        'The image box must match the selected catalog search exactly.',
        400,
      );
    const geometry = imageGeometry(box, input);
    const key = cacheKey(['image-v1-rgb-2.5-nearest', candidate.id, geometry]);
    return coalesce(
      key,
      async (sharedSignal) => {
        const request = processRequest(candidate, geometry);
        // Account the streaming chunks plus their contiguous bounded response and
        // archive overhead; PNG/cache parsing shares buffers rather than copying.
        const cap = geometry.width * geometry.height * 4 + 128 * 1024;
        const decodeBytes =
          (geometry.width * 4 + 1) * geometry.height + geometry.width * 8;
        const lease = await reserveImageMemory(
          cap * 3 + decodeBytes,
          sharedSignal,
        );
        const shared = (bytes, metadata) => {
          let references = 1;
          const release = () => {
            if (references > 0 && --references === 0) lease.release();
          };
          return {
            bytes,
            metadata,
            release,
            retain() {
              if (!references)
                throw imageryError(
                  'memory_budget',
                  'Sentinel-2 response memory was already released.',
                );
              references++;
              let active = true;
              return {
                bytes,
                metadata,
                release() {
                  if (!active) return;
                  active = false;
                  release();
                },
              };
            },
          };
        };
        try {
          sharedSignal.throwIfAborted();
          // Warm disk reads use the same admission/coalescing path as cold
          // acquisition. The lease survives until every HTTP reader finishes.
          const hit = cache.get(key);
          if (hit)
            return shared(hit.bytes, {
              ...hit.metadata,
              usage: usage(),
              cache: 'hit',
            });
          const response = await providerRequest(
            CDSE_URLS.process,
            request,
            processPu(geometry.width, geometry.height),
            { signal: sharedSignal, cap },
          );
          const result = parseProcessTar(response, candidate, geometry);
          const metadata = {
            source: 'cdse',
            product: 'S2',
            day: candidate.day,
            acquisitionTime: candidate.acquisitionTime,
            sensingTime: result.sensingTime,
            validPixelCount: result.validPixelCount,
            contributors: candidate.contributors,
            nativeResolutionM: 10,
            box: geometry.box,
            width: geometry.width,
            height: geometry.height,
            preview: geometry.preview,
            credit: candidate.credit,
            acquiredAt: new Date(now()).toISOString(),
          };
          cache.put(key, result.bytes, metadata);
          return shared(result.bytes, {
            ...metadata,
            usage: usage(),
            cache: 'miss',
          });
        } catch (error) {
          lease.release();
          throw error;
        }
      },
      signal,
      { leased: true },
    );
  }
  return { usage, catalog, image };
}
