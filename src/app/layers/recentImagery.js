import { createImageryViewportController } from '../../custom/imagery/viewport.js';
import { createRecentImageryLayer } from '../../layers/recentImagery/index.js';
import { createRecentImageryRenderer } from '../../layers/recentImagery/rendering.js';
import { createThumbnailLoader } from '../../layers/recentImagery/thumbnails.js';
import { governorRequestRender } from '../../renderGovernor.js';

/** Construct imagery presentation over one explicitly supplied acquisition source. */
export function createApplicationRecentImagery({ source }) {
  return createRecentImageryLayer({
    catalog: {
      searchHls: (...args) => source.searchHls(...args),
      ...(source.searchS2
        ? { searchS2: (...args) => source.searchS2(...args) }
        : {}),
    },
    usageSource: source,
    viewportFactory: createImageryViewportController,
    renderer: createRecentImageryRenderer({
      requestRender: governorRequestRender,
      imageSource: source,
      tileTemplate: (...args) => source.getTileTemplate(...args),
      credit: source.credit || source.label || 'Imagery',
    }),
    thumbnails: createApplicationImageryThumbnails(source),
  });
}

/** Keep NASA's probe/prefetch behavior; S2 thumbnails are visible-only and cancellable. */
export function createApplicationImageryThumbnails(
  source,
  {
    nasa = createThumbnailLoader({
      requestThumbnail: (...args) => source.getThumbnail(...args),
    }),
    createObjectUrl = (blob) => URL.createObjectURL(blob),
    revokeObjectUrl = (url) => URL.revokeObjectURL(url),
  } = {},
) {
  const entries = new Map(),
    listeners = new Set();
  let visible = new Set(),
    active = 0,
    destroyed = false;
  const queue = [];
  const notify = (key) => {
    for (const fn of listeners) fn(key);
  };
  const off = nasa.subscribe(notify);
  function remove(key, changed = false) {
    const entry = entries.get(key);
    if (!entry) return;
    entry.controller?.abort();
    if (entry.objectUrl) revokeObjectUrl(entry.objectUrl);
    entries.delete(key);
    if (changed) notify(key);
    if (!entry.loading) {
      entry.lease?.release();
      entry.lease = null;
    }
  }
  function pump() {
    while (!destroyed && active < 2 && queue.length) {
      const entry = queue.shift();
      if (entries.get(entry.key) !== entry || !visible.has(entry.key)) continue;
      try {
        if (!source.reserveWorkingBytes)
          throw new Error('Sentinel-2 preview memory guard unavailable');
        entry.lease = source.reserveWorkingBytes(128 * 128 * 16);
      } catch {
        entry.status = 'error';
        notify(entry.key);
        continue;
      }
      const controller = new AbortController();
      entry.controller = controller;
      entry.loading = true;
      active++;
      Promise.resolve()
        .then(() =>
          source.getThumbnail(entry.candidate, entry.box, {
            size: 128,
            signal: controller.signal,
          }),
        )
        .then(async (response) => {
          if (!response.ok) throw new Error('Sentinel-2 preview unavailable');
          const present = response.headers.get('Data-Present');
          if (present !== 'true' && present !== 'false')
            throw new Error('Preview coverage is unverified');
          const blob = present === 'true' ? await response.blob() : null;
          if (
            controller.signal.aborted ||
            entries.get(entry.key) !== entry ||
            destroyed
          )
            return;
          entry.status = present === 'true' ? 'present' : 'empty';
          entry.objectUrl = blob ? createObjectUrl(blob) : null;
          entry.acquisitionTime = response.headers.get('Acquisition-Time');
        })
        .catch(() => {
          if (!controller.signal.aborted && entries.get(entry.key) === entry)
            entry.status = 'error';
        })
        .finally(() => {
          active--;
          entry.loading = false;
          if (
            !entry.objectUrl ||
            controller.signal.aborted ||
            entries.get(entry.key) !== entry ||
            destroyed
          ) {
            entry.lease?.release();
            entry.lease = null;
          }
          if (
            !controller.signal.aborted &&
            entries.get(entry.key) === entry &&
            !destroyed
          )
            notify(entry.key);
          pump();
        });
    }
  }
  return {
    setVisibleCandidates(candidates) {
      visible = new Set(
        candidates
          .filter((candidate) => candidate.product === 'S2')
          .map((candidate) => candidate.key),
      );
      for (const key of entries.keys())
        if (!visible.has(key)) remove(key, true);
    },
    request(candidate, box, priority) {
      if (candidate.product !== 'S2')
        return nasa.request(candidate, box, priority);
      if (
        destroyed ||
        !visible.has(candidate.key) ||
        entries.has(candidate.key)
      )
        return;
      const entry = {
        key: candidate.key,
        candidate,
        box: { ...box },
        status: 'unknown',
        objectUrl: null,
        loading: false,
      };
      entries.set(entry.key, entry);
      queue.push(entry);
      pump();
    },
    requestOrdered: (...args) => nasa.requestOrdered(...args),
    get(key) {
      return entries.get(key) || nasa.get(key);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    clear() {
      visible.clear();
      for (const key of entries.keys()) remove(key);
      queue.length = 0;
      nasa.clear();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      this.clear();
      off();
      nasa.destroy();
      listeners.clear();
    },
  };
}
