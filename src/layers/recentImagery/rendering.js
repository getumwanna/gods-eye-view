/**
 * Draped-imagery renderer for the Recent Imagery layer: at most two GIBS
 * imagery layers (slot `a`, left of a swipe; slot `b`, right) on whichever
 * host the map stack offers. Against the basemap slot `a` splits left and
 * slot `b` stays empty. Every layer is removed from the collection that owns it, so a
 * host switch or a replaced image never strands one. Tile requests pass a
 * small semaphore of our own; Cesium's global request limits stay untouched.
 */
import * as Cesium from 'cesium';
import { PRODUCTS, gibsTemplate } from './model.js';

const SLOT_IDS = ['a', 'b'];
const SPLIT_ENUM = { left: 'LEFT', right: 'RIGHT', none: 'NONE' };
const NO_HOST = Object.freeze({ collection: null, kind: 'none' });

/** Render reason for a deferred or settled tile request. */
export const TILE_RENDER_REASON = 'recent-imagery-tiles';
/** Delay before the one frame that retries tiles Cesium itself deferred. */
export const TILE_RETRY_DELAY_MS = 250;

function clampAlpha(value) {
  const alpha = Number(value);
  return Number.isFinite(alpha) ? Math.max(0, Math.min(1, alpha)) : 1;
}

const boxKey = (box) =>
  [box.west, box.south, box.east, box.north].map(Number).join(',');

/**
 * Gate a provider's `requestImage` through the semaphore. Returning
 * `undefined` tells Cesium to retry on a later frame, but under
 * `requestRenderMode` there is no later frame unless something asks — and a
 * deferral must never ask for one itself: the retried tile would defer again
 * and ask again, keeping the scene rendering every frame. So a request that
 * finds our semaphore full asks for nothing (the request holding the slot
 * asks for one frame when it settles), and a request the provider itself
 * deferred goes through the one coalesced delayed retry.
 */
function admitTileRequests(provider, admission, requestRender, retry) {
  const original = provider.requestImage.bind(provider);
  provider.requestImage = (x, y, level, request) => {
    if (admission.inFlight >= admission.limit) return undefined;
    admission.inFlight += 1;
    const release = () => {
      admission.inFlight -= 1;
    };
    let promise;
    try {
      promise = original(x, y, level, request);
    } catch (error) {
      release();
      throw error;
    }
    if (!promise) {
      release();
      retry.schedule();
      return undefined;
    }
    return Promise.resolve(promise).finally(() => {
      release();
      requestRender(TILE_RENDER_REASON);
    });
  };
  return provider;
}

/**
 * Create the renderer.
 * @param {{ cesium?: object, maxTileRequests?: number, requestRender?: (reason: string) => void, setTimeoutImpl?: Function, clearTimeoutImpl?: Function }} [options]
 */
export function createRecentImageryRenderer({
  cesium = Cesium,
  tileTemplate = gibsTemplate,
  credit = 'NASA GIBS',
  imageSource = null,
  maxTileRequests = 6,
  requestRender = () => {},
  setTimeoutImpl = (fn, ms) => globalThis.setTimeout(fn, ms),
  clearTimeoutImpl = (id) => globalThis.clearTimeout(id),
} = {}) {
  let host = NO_HOST;
  let destroyed = false;
  const admission = { limit: maxTileRequests, inFlight: 0 };
  const owned = { a: null, b: null };
  const pending = { a: null, b: null };
  const listeners = new Set();
  const decodeQueue = [];
  let activeDecodes = 0;
  function pumpDecodes() {
    while (activeDecodes < 2 && decodeQueue.length) {
      const job = decodeQueue.shift();
      if (destroyed || owned[job.slotId] !== job.record) {
        job.resolve(undefined);
        continue;
      }
      activeDecodes++;
      Promise.resolve()
        .then(job.request)
        .then(job.resolve, job.reject)
        .finally(() => {
          activeDecodes--;
          pumpDecodes();
        });
    }
  }
  function scheduleDecode(slotId, record, request) {
    return new Promise((resolve, reject) => {
      decodeQueue.push({ slotId, record, request, resolve, reject });
      pumpDecodes();
    });
  }

  let retryTimer = null;
  const retry = {
    schedule() {
      if (retryTimer !== null) return;
      retryTimer = setTimeoutImpl(() => {
        retryTimer = null;
        if (!destroyed) requestRender(TILE_RENDER_REASON);
      }, TILE_RETRY_DELAY_MS);
    },
    cancel() {
      if (retryTimer !== null) clearTimeoutImpl(retryTimer);
      retryTimer = null;
    },
  };
  const emit = (event) => {
    for (const fn of listeners) fn(event);
  };
  const rectangle = (box) =>
    cesium.Rectangle.fromDegrees(box.west, box.south, box.east, box.north);
  function createProvider(candidate, box) {
    const spec = PRODUCTS[candidate.product];
    const provider = new cesium.UrlTemplateImageryProvider({
      url: tileTemplate(candidate.product, candidate.day),
      subdomains: ['a', 'b', 'c'],
      minimumLevel: 0,
      maximumLevel: spec.maxLevel,
      tilingScheme: new cesium.WebMercatorTilingScheme(),
      rectangle: rectangle(box),
      credit,
      hasAlphaChannel: spec.format === 'png',
    });
    return admitTileRequests(provider, admission, requestRender, retry);
  }
  function detach(record) {
    for (const layer of record.layers || [record.layer]) {
      try {
        record.collection.remove(layer, true);
      } catch {
        /* host already gone */
      }
    }
  }
  function removeOwned(slotId, { cancel = true } = {}) {
    if (cancel) {
      pending[slotId]?.abort.abort();
      pending[slotId] = null;
    }
    const record = owned[slotId];
    if (!record) return false;
    owned[slotId] = null;
    detach(record);
    record.snapshot?.release?.();
    return true;
  }
  function applyLook(record) {
    for (const layer of record.layers || [record.layer]) {
      layer.alpha = record.alpha;
      layer.splitDirection =
        cesium.SplitDirection?.[SPLIT_ENUM[record.split] || 'NONE'] ?? 0;
    }
  }
  function mount(slotId, input) {
    const record = {
      ...input,
      layers: [],
      collection: host.collection,
      loaded: false,
      decoded: new Set(),
      failed: false,
    };
    const { candidate, box, snapshot } = record;
    const parts = snapshot ? snapshot.parts || [snapshot] : [null];
    const observed = (provider, index) => {
      if (typeof provider.requestImage !== 'function') return provider;
      const request = provider.requestImage.bind(provider);
      const success = (image) => {
        if (image && owned[slotId] === record && !record.failed && !destroyed) {
          record.decoded.add(index);
          if (!record.loaded && record.decoded.size === parts.length) {
            record.loaded = true;
            emit({ type: 'loaded', slotId, candidate });
          }
        }
        return image;
      };
      const failure = (error) => {
        if (
          candidate.product === 'S2' &&
          owned[slotId] === record &&
          !record.failed &&
          !destroyed
        ) {
          record.failed = true;
          removeOwned(slotId);
          emit({ type: 'error', slotId, candidate, error, stage: 'decode' });
        }
        throw error;
      };
      let singleRequest = null;
      provider.requestImage = (...args) => {
        if (candidate.product === 'S2') {
          if (!singleRequest)
            singleRequest = scheduleDecode(slotId, record, () =>
              request(...args),
            ).then(success, failure);
          return singleRequest;
        }
        let result;
        try {
          result = request(...args);
        } catch (error) {
          return failure(error);
        }
        if (result === undefined) return undefined;
        const observedResult = result?.then
          ? Promise.resolve(result).then(success, failure)
          : success(result);
        return observedResult;
      };
      return provider;
    };
    try {
      for (const [index, part] of parts.entries()) {
        const provider = snapshot
          ? new cesium.SingleTileImageryProvider({
              url: part.url,
              tileWidth: part.width,
              tileHeight: part.height,
              rectangle: rectangle(part.bounds || part.metadata?.box || box),
              credit:
                snapshot.metadata?.credit ||
                snapshot.metadata?.attribution ||
                `Contains modified Copernicus Sentinel data ${candidate.day.slice(0, 4)} · Sentinel Hub/CDSE`,
            })
          : createProvider(candidate, box);
        record.layers.push(
          host.collection.addImageryProvider(observed(provider, index)),
        );
      }
    } catch (error) {
      detach(record);
      throw error;
    }
    record.layer = record.layers[0];
    owned[slotId] = record;
    applyLook(record);
    if (snapshot) {
      // Prime local PNGs independently of Cesium's culling. Otherwise an
      // offscreen assignment could wait forever for the fit that reveals it.
      const lease = snapshot.retain?.();
      const decodes = record.layers.map((layer) => {
        const provider = layer.imageryProvider || layer.provider;
        return provider.requestImage(0, 0, 0);
      });
      Promise.allSettled(decodes).finally(() => lease?.release?.());
    }
  }
  return {
    showSlot(
      slotId,
      candidate,
      box,
      { alpha = 1, splitDirection = 'none' } = {},
    ) {
      if (destroyed || !SLOT_IDS.includes(slotId) || !candidate?.key || !box)
        return false;
      if (!host.collection) {
        removeOwned(slotId);
        return false;
      }
      const current = owned[slotId];
      const look = { alpha: clampAlpha(alpha), split: splitDirection };
      if (
        current &&
        current.collection === host.collection &&
        current.candidate.key === candidate.key &&
        boxKey(current.box) === boxKey(box)
      ) {
        if (current.alpha !== look.alpha || current.split !== look.split) {
          Object.assign(current, look);
          applyLook(current);
          requestRender('recent-imagery-look');
        }
        return true;
      }
      const task = pending[slotId];
      if (
        task &&
        task.candidate.key === candidate.key &&
        boxKey(task.box) === boxKey(box)
      ) {
        Object.assign(task.look, look);
        return true;
      }
      removeOwned(slotId);
      if (candidate.product !== 'S2') {
        mount(slotId, { candidate, box: { ...box }, ...look });
        requestRender('recent-imagery-show');
        return true;
      }
      const abort = new AbortController();
      const load = { candidate, box: { ...box }, look, abort };
      pending[slotId] = load;
      Promise.resolve()
        .then(() => {
          if (!imageSource?.getImage)
            throw new Error('Sentinel-2 setup unavailable');
          return imageSource.getImage(candidate, load.box, {
            signal: abort.signal,
          });
        })
        .then((snapshot) => {
          if (
            destroyed ||
            abort.signal.aborted ||
            pending[slotId] !== load ||
            !host.collection
          ) {
            if (pending[slotId] === load) pending[slotId] = null;
            snapshot?.release?.();
            return;
          }
          pending[slotId] = null;
          try {
            mount(slotId, { candidate, box: load.box, snapshot, ...load.look });
          } catch (error) {
            snapshot?.release?.();
            throw error;
          }
          requestRender('recent-imagery-show');
          emit({ type: 'pending', slotId, candidate });
        })
        .catch((error) => {
          if (
            abort.signal.aborted ||
            destroyed ||
            (pending[slotId] && pending[slotId] !== load)
          )
            return;
          pending[slotId] = null;
          emit({ type: 'error', slotId, candidate, error });
        });
      return true;
    },
    hideSlot(slotId) {
      const waiting = Boolean(pending[slotId]);
      if (removeOwned(slotId) || waiting) requestRender('recent-imagery-hide');
    },
    setAlpha(slotId, alpha) {
      if (pending[slotId]) pending[slotId].look.alpha = clampAlpha(alpha);
      const record = owned[slotId];
      const next = clampAlpha(alpha);
      if (!record || record.alpha === next) return;
      record.alpha = next;
      applyLook(record);
      requestRender('recent-imagery-alpha');
    },
    rebind(nextHost) {
      host = nextHost || NO_HOST;
      let changed = false;
      if (!host.collection)
        for (const id of SLOT_IDS) {
          pending[id]?.abort.abort();
          pending[id] = null;
        }
      for (const slotId of SLOT_IDS) {
        const record = owned[slotId];
        if (!record || record.collection === host.collection) continue;
        owned[slotId] = null;
        detach(record);
        changed = true;
        if (host.collection && !destroyed) {
          try {
            mount(slotId, record);
          } catch (error) {
            record.snapshot?.release?.();
            queueMicrotask(() =>
              emit({
                type: 'error',
                slotId,
                candidate: record.candidate,
                error,
              }),
            );
          }
        } else record.snapshot?.release?.();
      }
      if (changed) requestRender('recent-imagery-rebind');
    },
    getOwned() {
      const out = {};
      for (const slotId of SLOT_IDS) {
        const record = owned[slotId];
        out[slotId] = record
          ? {
              key: record.candidate.key,
              kind: host.kind,
              alpha: record.alpha,
              split: record.split,
            }
          : null;
      }
      return out;
    },
    getDisplayState() {
      return Object.fromEntries(
        SLOT_IDS.map((slotId) => {
          const record = owned[slotId];
          const task = pending[slotId];
          return [
            slotId,
            record
              ? {
                  candidate: record.candidate,
                  box: record.box,
                  loaded: record.loaded,
                  nativeResolutionM:
                    PRODUCTS[record.candidate.product]?.resolutionM,
                  metadata: record.snapshot?.metadata,
                }
              : task
                ? { candidate: task.candidate, box: task.box, loaded: false }
                : null,
          ];
        }),
      );
    },
    getSnapshot(slotId) {
      return owned[slotId]?.loaded
        ? owned[slotId].snapshot?.retain?.() || null
        : null;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    ownedCount() {
      return SLOT_IDS.filter((slotId) => owned[slotId]).length;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      retry.cancel();
      for (const slotId of SLOT_IDS) removeOwned(slotId);
      listeners.clear();
      pumpDecodes();
      host = NO_HOST;
    },
  };
}
