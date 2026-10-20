import { KEY_SETUP_KEYS } from '../../keySetupCore.mjs';

const KEY_IDS = Object.freeze(
  KEY_SETUP_KEYS.filter((key) => !key.hidden).map((key) => key.id),
);
const KNOWN_IDS = new Set(KEY_IDS);
const unknownKeys = () => Object.fromEntries(KEY_IDS.map((id) => [id, null]));
const snapshot = (state, keys = unknownKeys()) =>
  Object.freeze({ state, keys: Object.freeze(keys) });

/** Retain presence only; never keep provider payloads, key values or raw errors. */
function projectPresence(payload) {
  if (!Array.isArray(payload?.keys) || payload.keys.length > 64) return null;
  const keys = unknownKeys();
  const seen = new Set();
  for (const key of payload.keys) {
    if (!KNOWN_IDS.has(key?.id)) continue;
    if (seen.has(key.id)) {
      keys[key.id] = null;
      continue;
    }
    seen.add(key.id);
    keys[key.id] = typeof key.set === 'boolean' ? key.set : null;
  }
  return keys;
}

/**
 * One custom, abortable read of GEV's existing loopback configuration endpoint.
 * This does not validate credentials or contact any provider. POWER UP owns its
 * own existing request; load() here is idempotent for this controller's lifetime.
 */
export function createKeyAccess({
  fetchImpl = (...args) => globalThis.fetch(...args),
  signal,
} = {}) {
  const controller = new AbortController();
  const listeners = new Set();
  let current = snapshot('idle');
  let pending = null;
  let disposed = false;
  const publish = (next) => {
    if (disposed) return;
    current = next;
    for (const listener of [...listeners]) {
      try {
        listener(current);
      } catch {
        /* A view cannot break status ownership. */
      }
    }
  };
  const destroy = () => {
    if (disposed) return;
    disposed = true;
    controller.abort();
    signal?.removeEventListener('abort', destroy);
    listeners.clear();
  };
  if (signal?.aborted) destroy();
  else signal?.addEventListener('abort', destroy, { once: true });

  return Object.freeze({
    getSnapshot: () => current,
    subscribe(listener) {
      if (disposed || typeof listener !== 'function') return () => {};
      listeners.add(listener);
      try {
        listener(current);
      } catch {
        /* Preserve other subscribers. */
      }
      return () => listeners.delete(listener);
    },
    load() {
      if (disposed) return Promise.resolve(current);
      if (!pending) {
        // Assign the shared promise before notifying a subscriber that may
        // synchronously call load() again or destroy this controller.
        pending = Promise.resolve().then(async () => {
          if (disposed) return current;
          publish(snapshot('loading'));
          if (disposed) return current;
          try {
            const response = await fetchImpl('/api/setup/status', {
              cache: 'no-store',
              credentials: 'same-origin',
              signal: controller.signal,
            });
            if (disposed) return current;
            if (!response.ok) {
              publish(snapshot('unavailable'));
            } else {
              const keys = projectPresence(await response.json());
              if (!controller.signal.aborted) {
                publish(
                  keys ? snapshot('ready', keys) : snapshot('unavailable'),
                );
              }
            }
          } catch {
            publish(snapshot('unavailable'));
          }
          return current;
        });
      }
      return pending;
    },
    destroy,
  });
}
