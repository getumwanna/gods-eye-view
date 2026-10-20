const STORAGE_KEY = 'gih.theme.v1';
const listeners = new Set();
let fallback = 'dark';

/** Read a shared local preference without assuming storage is available. */
export function getTheme() {
  try {
    const saved = globalThis.localStorage?.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : fallback;
  } catch { return fallback; }
}

/** Apply theme tokens to this document; sensor/map modes are not modified. */
export function applyTheme(documentRef = globalThis.document) {
  const theme = getTheme();
  if (documentRef?.documentElement) {
    documentRef.documentElement.dataset.gihTheme = theme;
    documentRef.documentElement.classList.toggle('dark', theme === 'dark');
    documentRef.documentElement.style.colorScheme = theme;
  }
  return theme;
}

/** Persist only the UI theme, never provider configuration. */
export function setTheme(value) {
  if (value !== 'dark' && value !== 'light') throw new TypeError('Unknown theme');
  fallback = value;
  try { globalThis.localStorage?.setItem(STORAGE_KEY, value); } catch { /* session fallback */ }
  applyTheme();
  for (const listener of listeners) listener(value);
}

/** Observe local changes and cross-tab preference changes; caller owns cleanup. */
export function subscribeTheme(listener) {
  listeners.add(listener);
  const onStorage = (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    applyTheme();
    listener(getTheme());
  };
  globalThis.window?.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    globalThis.window?.removeEventListener('storage', onStorage);
  };
}
