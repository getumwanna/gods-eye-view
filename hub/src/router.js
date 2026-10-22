const pages = new Set(['dashboard', 'library', 'settings']);
const idPattern = /^[a-z0-9][a-z0-9-]{0,63}$/;
const sectionPattern = /^section-[a-z0-9][a-z0-9-]{0,119}$/;
const unavailable = () => ({ page: 'not-found', sourceId: null });

/** Keep the 160 UTF-16-unit URL bound without splitting a Unicode character. */
export function boundedHubQuery(value = '') {
  const clipped = String(value)
    .slice(0, 160)
    .replace(/[\uD800-\uDBFF]$/, '');
  // URLSearchParams normalizes any lone surrogate in pasted input to safe text.
  return new URLSearchParams({ q: clipped }).get('q') || '';
}

/** Resolve only bounded local hash routes and an explicit query-field allowlist. */
export function parseHubRoute(hash = '') {
  const raw = String(hash).replace(/^#/, '');
  if (!raw || raw === '/') return { page: 'dashboard', sourceId: null };
  if (raw.length > 2400 || /[\\\u0000-\u001f#]/.test(raw)) return unavailable();
  const queryAt = raw.indexOf('?');
  const pathname = queryAt < 0 ? raw : raw.slice(0, queryAt);
  const queryString = queryAt < 0 ? '' : raw.slice(queryAt + 1);
  try {
    decodeURIComponent(queryString.replace(/\+/g, ' '));
  } catch {
    return unavailable();
  }
  const query = new URLSearchParams(queryString);
  if ([...query.keys()].some((key) => query.getAll(key).length !== 1))
    return unavailable();
  const parts = pathname.split('/');
  if (parts[0] !== '' || !pages.has(parts[1])) return unavailable();
  if (parts.length === 2 && !queryString)
    return { page: parts[1], sourceId: null };
  if (parts[1] !== 'library') return unavailable();
  if (parts.length === 3 && parts[2] === 'sources' && !queryString)
    return { page: 'data-sources', sourceId: null };
  if (parts.length === 3 && parts[2] === 'knowledge' && !queryString)
    return { page: 'knowledge', sourceId: null };
  if (parts.length === 3 && parts[2] === 'cases' && !queryString)
    return { page: 'case-studies', sourceId: null };
  if (
    parts.length === 3 &&
    parts[2] === 'search' &&
    [...query.keys()].every((key) => key === 'q')
  ) {
    const value = query.get('q') || '';
    if (/[\u0000-\u001f\u007f]/.test(value)) return unavailable();
    return {
      page: 'library-search',
      sourceId: null,
      query: boundedHubQuery(value),
    };
  }
  if (
    parts.length === 4 &&
    parts[2] === 'sources' &&
    idPattern.test(parts[3]) &&
    !queryString
  )
    return { page: 'source', sourceId: parts[3] };
  if (
    parts.length === 4 &&
    (parts[2] === 'knowledge' || parts[2] === 'cases') &&
    idPattern.test(parts[3]) &&
    [...query.keys()].every((key) => key === 'section')
  ) {
    const section = query.get('section');
    if (section !== null && !sectionPattern.test(section)) return unavailable();
    return {
      page: parts[2] === 'cases' ? 'case-study' : 'knowledge-article',
      sourceId: null,
      slug: parts[3],
      section,
    };
  }
  return unavailable();
}

export function routeTitle(route) {
  return (
    {
      dashboard: 'Dashboard',
      library: 'Library',
      settings: 'Settings',
      source: 'Source setup',
      'data-sources': 'Data Sources',
      knowledge: 'Knowledge Center',
      'knowledge-article': 'Knowledge article',
      'case-studies': 'Case studies',
      'case-study': 'Case study',
      'library-search': 'Library search',
      'not-found': 'Page not found',
    }[route.page] || 'Page not found'
  );
}
