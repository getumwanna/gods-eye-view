const pages = new Set(['dashboard', 'library', 'settings']);

/** Resolve only this hub's local hash routes; never turn input into a URL. */
export function parseHubRoute(hash = '') {
  const raw = String(hash).replace(/^#/, '');
  if (!raw || raw === '/') return { page: 'dashboard', sourceId: null };
  const parts = raw.split('/');
  if (parts[0] !== '' || !pages.has(parts[1])) return { page: 'not-found', sourceId: null };
  if (parts.length === 2) return { page: parts[1], sourceId: null };
  if (parts.length === 4 && parts[1] === 'library' && parts[2] === 'sources' && /^[a-z0-9][a-z0-9-]{0,63}$/.test(parts[3])) {
    return { page: 'source', sourceId: parts[3] };
  }
  return { page: 'not-found', sourceId: null };
}

export function routeTitle(route) {
  return ({ dashboard: 'Dashboard', library: 'Library', settings: 'Settings', source: 'Source setup', 'not-found': 'Page not found' })[route.page] || 'Page not found';
}
