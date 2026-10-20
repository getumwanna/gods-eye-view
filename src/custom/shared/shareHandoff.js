import { createView, viewUrl } from '../../view/index.js';

const currentOrigin = () =>
  globalThis.location?.origin || 'http://localhost:4173';
const sensitive = /token|secret|password|credential|api.?key|authorization/i;

/** Use the upstream portable view codec for newly composed camera links. */
export function createGlobeUrl(view, { origin = currentOrigin() } = {}) {
  const base = new URL('/', origin).href;
  return view ? viewUrl(base, createView(view)) : base;
}

/** Keep a saved full v2 hash intact; never reduce it to the portable subset. */
export function validateGlobeLink(input, { origin = currentOrigin() } = {}) {
  if (typeof input !== 'string' || input.length > 20000)
    throw new TypeError('Invalid globe link');
  const url = new URL(input, origin);
  if (
    url.origin !== new URL(origin).origin ||
    !/^https?:$/.test(url.protocol) ||
    url.username ||
    url.password ||
    !['/', '/index.html'].includes(url.pathname)
  ) {
    throw new TypeError('Use a globe link from this local workspace');
  }
  for (const [key, value] of url.searchParams) {
    if (key !== 'lang' || !/^[a-z]{2}(?:-[A-Za-z]{2,4})?$/.test(value)) {
      throw new TypeError('Unsupported globe query');
    }
  }
  if (!url.hash) return url.href;
  const params = new URLSearchParams(url.hash.slice(1));
  if (params.get('v') !== '2')
    throw new TypeError('Use a version 2 globe link');
  for (const key of params.keys()) {
    if (sensitive.test(key) || params.getAll(key).length !== 1)
      throw new TypeError('Unsafe globe state');
  }
  for (const [key, min, max] of [
    ['lat', -90, 90],
    ['lon', -180, 180],
    ['alt', 0, 1e9],
  ]) {
    const raw = params.get(key);
    const value = raw?.trim() ? Number(raw) : NaN;
    if (!Number.isFinite(value) || value < min || value > max)
      throw new TypeError(`Invalid ${key}`);
  }
  return url.href;
}
