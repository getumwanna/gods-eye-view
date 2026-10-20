/** Self-contained so Puppeteer can serialize this exact tested predicate. */
export function hubIsReady() {
  return document.querySelector('main #main-content h1')?.textContent === 'Dashboard'
    && Boolean(document.querySelector('nav[aria-label="Main navigation"]') && document.querySelector('#globe-share-link'));
}

/** Classify failed local responses without retaining URLs or response content. */
export function classifyQaResponse({ url, origin, status, statusText, resourceType }) {
  if (!Number.isInteger(status) || status < 400 || status > 599) return null;
  let parsed;
  try { parsed = new URL(url); } catch { return null; }
  if (parsed.origin !== origin || parsed.pathname.startsWith('/api/') || parsed.pathname === '/mcp') return null;
  if (parsed.pathname.startsWith('/node_modules/.vite/')) {
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
