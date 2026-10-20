/** Self-contained so Puppeteer can serialize this exact tested predicate. */
export function hubIsReady() {
  return document.querySelector('main #main-content h1')?.textContent === 'Dashboard'
    && Boolean(document.querySelector('nav[aria-label="Main navigation"]') && document.querySelector('#globe-share-link'));
}

/** Controls mount before restoration finishes; the cover must release clicks. */
export function globeControlsUncovered() {
  const cover = document.getElementById('loading-screen');
  return Boolean(document.querySelector('.gih-globe-tools') && cover?.classList.contains('hidden')
    && getComputedStyle(cover).pointerEvents === 'none');
}

/** Cesium's anchor may be zero-size while its positioned credit content paints. */
export function creditsAreVisible() {
  const root = document.getElementById('cesium-credits');
  const visible = node => {
    if (!node) return false;
    const rect = node.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0 || rect.right <= 0 || rect.bottom <= 0
      || rect.left >= document.documentElement.clientWidth || rect.top >= document.documentElement.clientHeight) return false;
    for (let current = node; current; current = current.parentElement) {
      const style = getComputedStyle(current);
      if (style.display === 'none' || ['hidden', 'collapse'].includes(style.visibility)
        || (style.opacity !== '' && Number(style.opacity) === 0)) return false;
    }
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return Boolean(hit && (node.closest('a') || node).contains(hit));
  };
  const inlineCredits = [...(root?.querySelector('.cesium-credit-textContainer')?.children || [])]
    .filter(node => node.textContent.trim() || node.querySelector('img'));
  return visible(root?.querySelector('.cesium-credit-logoContainer img'))
    && visible(root?.querySelector('.cesium-credit-expand-link')) && inlineCredits.every(visible);
}

/** Classify failed local responses without retaining URLs or response content. */
export function classifyQaResponse({ url, origin, status, statusText, resourceType }) {
  if (!Number.isInteger(status) || status < 400 || status > 599) return null;
  let parsed;
  try { parsed = new URL(url); } catch { return null; }
  if (parsed.origin !== origin || parsed.pathname.startsWith('/api/') || parsed.pathname === '/mcp') return null;
  if (['/node_modules/.vite/', '/node_modules/.vite-custom-hub/'].some(prefix => parsed.pathname.startsWith(prefix))) {
    return { kind: 'optimized-dependency', status, outdated: status === 504 && statusText === 'Outdated Optimize Dep' };
  }
  if (resourceType === 'document') return { kind: 'document', status };
  if (resourceType === 'script' || resourceType === 'stylesheet') return { kind: 'module-or-style', status };
  return null;
}

/** Fixed codes only: never copy arbitrary browser errors into receipts. */
export function qaFailureCode(error, resources) {
  if (resources.outdatedOptimizedDependencies > 0) return 'outdated-optimized-dependency';
  if (resources.failedOptimizedDependencies > 0) return 'optimized-dependency-http-error';
  if (resources.failedLocalModules > 0) return 'local-module-http-error';
  if (resources.failedLocalDocuments > 0) return 'local-document-http-error';
  if (/ERR_CONNECTION_REFUSED|ERR_NAME_NOT_RESOLVED|ERR_ADDRESS_UNREACHABLE/.test(error?.message || '')) return 'server-unreachable';
  if (error?.name === 'TimeoutError') return 'readiness-timeout';
  if (error?.name === 'AssertionError') return 'assertion-failure';
  return 'browser-check-failure';
}

export function scriptErrorResult(hubReady, count) {
  return hubReady ? { passed: count === 0 } : { passed: false, blockedBy: 'hub-startup' };
}
