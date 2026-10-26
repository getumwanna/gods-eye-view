/** Browser transport for the single local CDSE acquisition owner. NASA stays injected. */
export const IMAGERY_MEMORY_LIMIT = 128 * 1024 * 1024;
const API = '/api/recent-imagery/cdse';
const EDGES = ['west', 'south', 'east', 'north'];
const abortError = () =>
  new DOMException('Imagery request cancelled', 'AbortError');
const boxKey = (box) => EDGES.map((edge) => Number(box?.[edge])).join(',');

function failure(message, code = 'provider_unavailable') {
  return Object.assign(new Error(message), { code });
}

function copyBox(box) {
  const out = Object.fromEntries(
    EDGES.map((edge) => [edge, Number(box?.[edge])]),
  );
  if (
    !EDGES.every((edge) => Number.isFinite(out[edge])) ||
    out.west < -180 ||
    out.east > 180 ||
    out.south < -85 ||
    out.north > 85 ||
    out.west >= out.east ||
    out.south >= out.north
  )
    throw failure('Unsupported imagery bounds', 'invalid_bounds');
  return out;
}

function waitFor(promise, signal) {
  if (!signal) return promise;
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason || abortError());
    signal.addEventListener('abort', abort, { once: true });
    promise
      .then(resolve, reject)
      .finally(() => signal.removeEventListener('abort', abort));
  });
}

async function boundedPng(response, maxBytes, signal) {
  if (
    response.headers.get('Content-Type')?.split(';')[0] !== 'image/png' ||
    Number(response.headers.get('Content-Length')) > maxBytes
  ) {
    await response.body?.cancel?.();
    throw failure(
      'Invalid or oversized Sentinel-2 PNG',
      'provenance_unverified',
    );
  }
  const reader = response.body?.getReader?.();
  if (!reader)
    throw failure('Sentinel-2 PNG body is unavailable', 'provider_unavailable');
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      signal?.throwIfAborted();
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes)
        throw failure(
          'Sentinel-2 PNG exceeds the response limit',
          'provenance_unverified',
        );
      chunks.push(value);
    }
    signal?.throwIfAborted();
    return new Blob(chunks, { type: 'image/png' });
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }
}

/** Safe, visible reason; never echo server bodies or credential-shaped strings. */
export function sentinelFallbackReason(error) {
  const reasons = {
    missing_configuration: 'CDSE credentials are not configured locally',
    authentication_failed:
      'CDSE authentication was rejected; check the local OAuth client',
    monthly_ceiling: 'the local monthly safety ceiling was reached',
    provider_quota: 'the provider free-tier quota was reached',
    no_coverage: 'no Sentinel-2 coverage is available for this box',
    provenance_unverified:
      'the provider could not verify the selected acquisition',
    memory_limit: 'the imagery exceeds the local memory budget',
    invalid_bounds: 'the selected bounds are unsupported',
    provider_unavailable: 'the provider is unavailable',
  };
  const stage = {
    oauth: 'authentication',
    catalog: 'catalog',
    process: 'image processing',
  };
  if (
    error?.code === 'provider_unavailable' &&
    Object.hasOwn(stage, error.providerStage)
  ) {
    const label = `CDSE ${stage[error.providerStage]}`;
    return Number.isInteger(error.providerStatus) &&
      error.providerStatus >= 100 &&
      error.providerStatus <= 599
      ? `${label} returned HTTP ${error.providerStatus}`
      : `${label} request did not complete`;
  }
  return reasons[error?.code] || reasons.provider_unavailable;
}

export function sentinelFallbackNotice(error, { hlsLoaded = false } = {}) {
  const reason = sentinelFallbackReason(error);
  return hlsLoaded
    ? `Sentinel-2 unavailable: showing HLS 30 m, ${reason}`
    : `Sentinel-2 unavailable: ${reason}. HLS 30 m has not loaded.`;
}

/**
 * Full-resolution handles are shared across IMAGE/A/B/exports. Acquisition is
 * never tied to camera motion. Release each handle when a slot/export finishes.
 */
export function createFreeRecentImagerySource({
  nasaSource = {},
  fetchImpl = (...args) => globalThis.fetch(...args),
  createObjectUrl = (blob) => URL.createObjectURL(blob),
  revokeObjectUrl = (url) => URL.revokeObjectURL(url),
  memoryLimit = IMAGERY_MEMORY_LIMIT,
  setTimeoutImpl = (callback, ms) => globalThis.setTimeout(callback, ms),
  clearTimeoutImpl = (timer) => globalThis.clearTimeout(timer),
  now = Date.now,
  usagePollMs = 1000,
} = {}) {
  const entries = new Map();
  const listeners = new Set();
  let destroyed = false;
  let reservedBytes = 0;
  let sequence = 0;
  let state = {
    status: 'idle',
    usage: null,
    usageReadAt: null,
    usageError: null,
    error: null,
    pending: 0,
    acquiring: 0,
  };
  let usageEnabled = false;
  let usageTimer = null;
  let usageAbort = null;
  let usagePromise = null;
  let usageRead = null;
  let usageRefreshWanted = false;
  let lastUsageAt = -Infinity;
  const pollInterval = Math.max(1000, Number(usagePollMs) || 1000);
  const emit = (patch) => {
    state = { ...state, ...patch };
    for (const listener of listeners) listener({ ...state });
  };
  const assertAlive = () => {
    if (destroyed)
      throw failure('Imagery source is closed', 'provider_unavailable');
  };
  function cancelUsagePoll() {
    if (usageTimer !== null) clearTimeoutImpl(usageTimer);
    usageTimer = null;
    usageAbort?.abort();
    usageRead?.controller.abort();
  }
  async function readUsage(signal) {
    assertAlive();
    signal?.throwIfAborted();
    if (usageRead) return waitFor(usageRead.promise, signal);
    const read = { controller: new AbortController() };
    const boundedSignal = AbortSignal.any([
      read.controller.signal,
      ...(signal ? [signal] : []),
      AbortSignal.timeout(5000),
    ]);
    read.promise = (async () => {
      const response = await fetchImpl(`${API}/usage`, {
        method: 'GET',
        credentials: 'same-origin',
        signal: boundedSignal,
      });
      if (!response.ok) {
        await response.body?.cancel?.();
        throw failure(
          'Local imagery usage cannot be read',
          'usage_unavailable',
        );
      }
      const result = await response.json();
      boundedSignal.throwIfAborted();
      const usage = result.usage || result;
      if (!usage || typeof usage !== 'object' || Array.isArray(usage))
        throw failure(
          'Local imagery usage response is invalid',
          'usage_unavailable',
        );
      emit({
        usage,
        usageReadAt: new Date(now()).toISOString(),
        usageError: null,
      });
      return usage;
    })().finally(() => {
      if (usageRead === read) usageRead = null;
    });
    usageRead = read;
    return read.promise;
  }
  function scheduleUsagePoll({ immediate = false } = {}) {
    if (!usageEnabled || destroyed || usageTimer !== null || usagePromise)
      return;
    if (!immediate && !state.acquiring) return;
    const delay = immediate
      ? 0
      : Math.max(0, pollInterval - (now() - lastUsageAt));
    const poll = () => {
      usageTimer = null;
      if (!usageEnabled || destroyed || (!immediate && !state.acquiring))
        return;
      const abort = new AbortController();
      usageAbort = abort;
      usageRefreshWanted = false;
      lastUsageAt = now();
      usagePromise = readUsage(abort.signal)
        .catch((error) => {
          if (!abort.signal.aborted && !destroyed)
            emit({
              usageError:
                'Local usage is unavailable; provider acquisition does not start from status checks.',
            });
        })
        .finally(() => {
          if (usageAbort === abort) usageAbort = null;
          usagePromise = null;
          scheduleUsagePoll({ immediate: usageRefreshWanted });
        });
    };
    if (immediate) poll();
    else usageTimer = setTimeoutImpl(poll, delay);
  }
  function beginAcquisition() {
    emit({ acquiring: state.acquiring + 1 });
    scheduleUsagePoll();
    let complete = false;
    return () => {
      if (complete) return;
      complete = true;
      emit({ acquiring: Math.max(0, state.acquiring - 1) });
      if (!state.acquiring) cancelUsagePoll();
    };
  }
  async function request(path, { body, signal } = {}) {
    assertAlive();
    signal?.throwIfAborted();
    const finish = beginAcquisition();
    try {
      const response = await fetchImpl(`${API}/${path}`, {
        method: body ? 'POST' : 'GET',
        credentials: 'same-origin',
        ...(body
          ? {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            }
          : {}),
        signal,
      });
      signal?.throwIfAborted();
      if (!response.ok) {
        let detail;
        try {
          detail = await response.json();
        } catch {
          /* bounded safe fallback */
        }
        const error = failure('Sentinel-2 acquisition failed', detail?.code);
        if (['oauth', 'catalog', 'process'].includes(detail?.providerStage))
          error.providerStage = detail.providerStage;
        if (
          Number.isInteger(detail?.providerStatus) &&
          detail.providerStatus >= 100 &&
          detail.providerStatus <= 599
        )
          error.providerStatus = detail.providerStatus;
        if (detail?.usage) emit({ usage: detail.usage });
        emit({
          status: 'unavailable',
          error: { code: error.code, reason: sentinelFallbackReason(error) },
        });
        throw error;
      }
      return response;
    } finally {
      finish();
    }
  }
  function evict(entry) {
    if (entry.refs || entry.waiters.size) return false;
    entry.controller.abort();
    for (const part of entry.parts || []) revokeObjectUrl(part.url);
    entries.delete(entry.key);
    reservedBytes -= entry.bytes;
    return true;
  }
  function reserve(bytes, { reportUnavailable = true } = {}) {
    for (const entry of [...entries.values()].sort((a, b) => a.used - b.used)) {
      if (reservedBytes + bytes <= memoryLimit) break;
      evict(entry);
    }
    if (bytes > memoryLimit || reservedBytes + bytes > memoryLimit) {
      if (reportUnavailable)
        emit({
          status: 'unavailable',
          error: {
            code: 'memory_limit',
            reason: sentinelFallbackReason({ code: 'memory_limit' }),
          },
        });
      throw failure(
        'Imagery exceeds the local memory budget; release an image first',
        'memory_limit',
      );
    }
    reservedBytes += bytes;
  }
  function reserveWorkingBytes(bytes) {
    assertAlive();
    if (!Number.isSafeInteger(bytes) || bytes <= 0)
      throw failure(
        'Imagery cannot reserve its local working budget',
        'memory_limit',
      );
    reserve(bytes, { reportUnavailable: false });
    let complete = false;
    return {
      release() {
        if (complete) return;
        complete = true;
        reservedBytes -= bytes;
      },
    };
  }
  function handle(entry) {
    entry.refs++;
    entry.used = ++sequence;
    let released = false;
    return {
      ...(entry.parts.length === 1 ? entry.parts[0] : { parts: entry.parts }),
      width: entry.width,
      height: entry.height,
      metadata: entry.metadata,
      retain() {
        if (released || destroyed) throw failure('Imagery handle was released');
        return handle(entry);
      },
      reserveWorkingBytes(bytes) {
        if (released)
          throw failure(
            'Imagery export cannot reserve its local working budget',
            'memory_limit',
          );
        return reserveWorkingBytes(bytes);
      },
      release() {
        if (released) return;
        released = true;
        entry.refs--;
        if (destroyed) evict(entry);
      },
    };
  }
  async function load(entry, candidate, box) {
    const plan = candidate.imagePlan;
    const columns = plan.mode === 'chunks' ? plan.columns : 1;
    const rows = plan.mode === 'chunks' ? plan.rows : 1;
    try {
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const response = await request('image', {
            body: {
              candidateId: candidate.id,
              box,
              ...(plan.mode === 'chunks' ? { part: { column, row } } : {}),
            },
            signal: entry.controller.signal,
          });
          let metadata;
          try {
            metadata = JSON.parse(response.headers.get('X-GEV-Imagery'));
          } catch {
            /* reject below */
          }
          const width = Number(metadata?.width),
            height = Number(metadata?.height);
          if (
            metadata?.source !== 'cdse' ||
            metadata?.product !== 'S2' ||
            metadata?.preview ||
            metadata?.nativeResolutionM !== 10 ||
            !Number.isInteger(width) ||
            !Number.isInteger(height) ||
            width < 1 ||
            height < 1 ||
            width > 2048 ||
            height > 2048 ||
            !Array.isArray(metadata?.contributors) ||
            !metadata.contributors.length ||
            metadata.day !== candidate.day
          )
            throw failure(
              'Unverified Sentinel-2 image metadata',
              'provenance_unverified',
            );
          const contributorKey = (items) =>
            items
              .map((item) => `${item.id}:${item.acquisitionTime}`)
              .sort()
              .join('|');
          if (
            (candidate.acquisitionTime &&
              metadata.acquisitionTime !== candidate.acquisitionTime) ||
            (candidate.contributors?.length &&
              contributorKey(metadata.contributors) !==
                contributorKey(candidate.contributors))
          )
            throw failure(
              'Image acquisition differs from the selected scene',
              'provenance_unverified',
            );
          const bounds = copyBox(metadata.box);
          if (
            bounds.west < box.west ||
            bounds.east > box.east ||
            bounds.south < box.south ||
            bounds.north > box.north
          ) {
            throw failure(
              'Image bounds differ from the selected box',
              'provenance_unverified',
            );
          }
          if (
            plan.mode !== 'chunks' &&
            (boxKey(bounds) !== boxKey(box) ||
              width !== plan.width ||
              height !== plan.height)
          ) {
            throw failure(
              'Image dimensions differ from the fixed request',
              'provenance_unverified',
            );
          }
          if (plan.mode === 'chunks') {
            const expectedWidth = Math.min(512, plan.width - column * 512);
            const expectedHeight = Math.min(512, plan.height - row * 512);
            const spanLon = box.east - box.west,
              spanLat = box.north - box.south;
            const expected = {
              west: box.west + (spanLon * column * 512) / plan.width,
              east:
                box.west +
                (spanLon * (column * 512 + expectedWidth)) / plan.width,
              north: box.north - (spanLat * row * 512) / plan.height,
              south:
                box.north -
                (spanLat * (row * 512 + expectedHeight)) / plan.height,
            };
            if (
              width !== expectedWidth ||
              height !== expectedHeight ||
              !EDGES.every(
                (edge) => Math.abs(bounds[edge] - expected[edge]) < 1e-9,
              )
            ) {
              throw failure(
                'Image chunk does not match the fixed selected grid',
                'provenance_unverified',
              );
            }
          }
          const blob = await boundedPng(
            response,
            width * height * 4 + 65536,
            entry.controller.signal,
          );
          entry.controller.signal.throwIfAborted();
          if (
            blob.type !== 'image/png' ||
            blob.size > width * height * 4 + 65536
          ) {
            throw failure(
              'Invalid or oversized Sentinel-2 PNG',
              'provenance_unverified',
            );
          }
          const url = createObjectUrl(blob);
          entry.parts.push({
            blob,
            url,
            width,
            height,
            bounds,
            column,
            row,
            metadata,
          });
          if (metadata.usage) emit({ usage: metadata.usage });
        }
      }
      entry.metadata = {
        ...entry.parts[0].metadata,
        box: { ...box },
        bounds: { ...box },
        candidate: structuredClone(candidate),
        width: plan.width,
        height: plan.height,
      };
      emit({ status: 'ready', error: null });
      return entry;
    } catch (error) {
      for (const part of entry.parts) revokeObjectUrl(part.url);
      entry.parts = [];
      if (entries.get(entry.key) === entry) {
        entries.delete(entry.key);
        reservedBytes -= entry.bytes;
      }
      if (error.name !== 'AbortError')
        emit({
          status: 'unavailable',
          error: { code: error.code, reason: sentinelFallbackReason(error) },
        });
      throw error;
    }
  }
  return {
    ...nasaSource,
    reserveWorkingBytes,
    async searchS2(query, options = {}) {
      const input = query?.box ? query : { box: query, ...options };
      const { box, signal, maxCloud, startDay, endDay } = input;
      const response = await request('catalog', {
        body: {
          box: copyBox(box),
          ...(maxCloud === undefined ? {} : { maxCloud }),
          ...(startDay ? { startDay } : {}),
          ...(endDay ? { endDay } : {}),
        },
        signal,
      });
      const result = await response.json();
      signal?.throwIfAborted();
      emit({
        usage: result.usage || state.usage,
        error: null,
        status: 'ready',
      });
      return result;
    },
    async getThumbnail(candidate, box, { signal, ...options } = {}) {
      if (candidate.product !== 'S2' || candidate.source !== 'cdse')
        return nasaSource.getThumbnail(candidate, box, { signal, ...options });
      const response = await request('image', {
        body: { candidateId: candidate.id, box: copyBox(box), preview: true },
        signal,
      });
      const metadata = JSON.parse(
        response.headers.get('X-GEV-Imagery') || '{}',
      );
      if (!metadata.preview || metadata.width > 128 || metadata.height > 128)
        throw failure('Invalid reduced preview', 'provenance_unverified');
      if (metadata.usage) emit({ usage: metadata.usage });
      const headers = new Headers(response.headers);
      headers.set('Data-Present', 'true');
      if (metadata.acquisitionTime)
        headers.set('Acquisition-Time', metadata.acquisitionTime);
      return new Response(response.body, { status: response.status, headers });
    },
    async getImage(candidate, inputBox, { signal } = {}) {
      assertAlive();
      signal?.throwIfAborted();
      const box = copyBox(inputBox),
        plan = candidate?.imagePlan;
      if (
        candidate?.product !== 'S2' ||
        candidate?.source !== 'cdse' ||
        !candidate.id ||
        !Number.isInteger(plan?.width) ||
        !Number.isInteger(plan?.height) ||
        plan.width < 1 ||
        plan.height < 1 ||
        !['single', 'chunks'].includes(plan.mode) ||
        (plan.mode === 'single' && (plan.width > 2048 || plan.height > 2048)) ||
        (plan.mode === 'chunks' &&
          (!Number.isInteger(plan.columns) ||
            !Number.isInteger(plan.rows) ||
            plan.columns !== Math.ceil(plan.width / 512) ||
            plan.rows !== Math.ceil(plan.height / 512)))
      )
        throw failure(
          'Invalid fixed Sentinel-2 image descriptor',
          'provenance_unverified',
        );
      const key = `${candidate.id}:${boxKey(box)}:${plan.width}x${plan.height}:${plan.mode}`;
      let entry = entries.get(key);
      if (!entry) {
        // Four RGBA allocations conservatively cover decode, GPU, transient and encoded bytes.
        const bytes = plan.width * plan.height * 16;
        reserve(bytes);
        entry = {
          key,
          bytes,
          width: plan.width,
          height: plan.height,
          refs: 0,
          used: ++sequence,
          waiters: new Set(),
          parts: [],
          controller: new AbortController(),
        };
        entries.set(key, entry);
        entry.promise = load(entry, candidate, box);
      }
      const waiter = {};
      entry.waiters.add(waiter);
      emit({ status: 'loading', pending: state.pending + 1 });
      try {
        await waitFor(entry.promise, signal);
        signal?.throwIfAborted();
        assertAlive();
        return handle(entry);
      } finally {
        entry.waiters.delete(waiter);
        emit({ pending: Math.max(0, state.pending - 1) });
        if (!entry.waiters.size && !entry.refs && !entry.metadata)
          entry.controller.abort();
      }
    },
    getUsage: ({ signal } = {}) => readUsage(signal),
    resumeUsage() {
      if (destroyed || usageEnabled) return;
      usageEnabled = true;
      usageRefreshWanted = true;
      scheduleUsagePoll({ immediate: true });
    },
    pauseUsage() {
      usageEnabled = false;
      usageRefreshWanted = false;
      cancelUsagePoll();
    },
    getState: () => ({
      ...state,
      memory: { reservedBytes, limitBytes: memoryLimit },
    }),
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy() {
      destroyed = true;
      usageEnabled = false;
      usageRefreshWanted = false;
      cancelUsagePoll();
      for (const entry of [...entries.values()]) {
        entry.controller.abort();
        if (!entry.refs) {
          entry.waiters.clear();
          evict(entry);
        }
      }
      listeners.clear();
    },
  };
}
