import { boundedHubQuery } from '../router.js';

const idPattern = /^[a-z0-9][a-z0-9-]{0,63}$/;
const upstreamRevision = '064d51f7be2675f1c69e16068e9c49d1a60144d1';
const upstreamRoot = `https://github.com/bilawalsidhu/gods-eye-view/blob/${upstreamRevision}/`;

export function isLibraryId(value: unknown): value is string {
  return typeof value === 'string' && idPattern.test(value);
}

/** Return an explicit HTTP(S) URL only. Userinfo, executable schemes and relative URLs are rejected. */
export function safeExternalUrl(value: unknown): string | null {
  if (
    typeof value !== 'string' ||
    value.length > 2048 ||
    /[\u0000-\u0020\\]/.test(value)
  )
    return null;
  try {
    const url = new URL(value);
    const credentialField = [...url.searchParams.keys()].some((key) =>
      /(?:^|[_-])(?:key|token|secret|password|authorization|credential)(?:$|[_-])/i.test(
        key,
      ),
    );
    return url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      url.hostname &&
      !credentialField
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function safeRepositoryPath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= 200 &&
    !value.startsWith('/') &&
    !/[\\\u0000-\u0020?#%]/.test(value) &&
    value
      .split('/')
      .every((part) => part !== '' && part !== '.' && part !== '..') &&
    /^[a-zA-Z0-9._/-]+$/.test(value)
  );
}

export function pinnedRepositoryUrl(path: string): string | null {
  return safeRepositoryPath(path) ? `${upstreamRoot}${path}` : null;
}
export function sourceDirectoryHref(id?: string) {
  return id && isLibraryId(id)
    ? `#/library/sources/${id}`
    : '#/library/sources';
}
export function safeLibraryHref(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (
    /^#\/library(?:\/(?:sources|knowledge|cases)(?:\/[a-z0-9][a-z0-9-]{0,63})?)?$/.test(
      value,
    )
  )
    return value;
  if (
    /^#\/library\/knowledge\/[a-z0-9][a-z0-9-]{0,63}\?section=section-[a-z0-9][a-z0-9-]{0,119}$/.test(
      value,
    )
  )
    return value;
  if (/^#[a-z0-9][a-z0-9-]{0,119}$/.test(value)) return value;
  return safeExternalUrl(value);
}

export function knowledgeHref(slug?: string, section?: string | null): string {
  if (!slug || !isLibraryId(slug)) return '#/library/knowledge';
  const base = `#/library/knowledge/${slug}`;
  return section && /^section-[a-z0-9][a-z0-9-]{0,119}$/.test(section)
    ? `${base}?section=${encodeURIComponent(section)}`
    : base;
}
export function librarySearchHref(query = '') {
  const bounded = boundedHubQuery(query);
  return `#/library/search${bounded ? `?q=${encodeURIComponent(bounded)}` : ''}`;
}

/** Turn an upstream relative link into a bounded repository path, never a local file request. */
export function resolveRepositoryReference(
  href: string,
  basePath: string,
): { path: string; fragment: string | null } | null {
  if (
    !href ||
    href.length > 2048 ||
    /[\\\u0000-\u0020%?]/.test(href) ||
    href.startsWith('/') ||
    /^[a-z][a-z0-9+.-]*:/i.test(href)
  )
    return null;
  const [relative, fragment, extra] = href.split('#');
  if (extra !== undefined || !relative || !safeRepositoryPath(basePath))
    return null;
  const path = basePath.split('/').slice(0, -1);
  for (const part of relative.split('/')) {
    if (part === '.') continue;
    if (part === '..') {
      if (!path.length) return null;
      path.pop();
    } else if (!part) return null;
    else path.push(part);
  }
  const resolved = path.join('/');
  if (
    !safeRepositoryPath(resolved) ||
    (fragment !== undefined && !/^[a-zA-Z0-9_.-]{1,200}$/.test(fragment))
  )
    return null;
  return { path: resolved, fragment: fragment || null };
}
