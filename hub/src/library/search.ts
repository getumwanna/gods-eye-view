import MiniSearch from 'minisearch';
import { getArticleMarkdown, parseMarkdownSections } from './markdown';
import { libraryItemHref, sourceDirectoryHref } from './links';
import type { LibraryCatalog, LibraryItem } from './types';
import { boundedHubQuery } from '../router.js';

export type SearchKind = LibraryItem['kind'] | 'source-product';
export type SearchDocument = {
  id: string;
  title: string;
  heading: string;
  text: string;
  tags: string;
  kind: SearchKind;
  category: string;
  sources: string[];
  href: string;
};
export type LibrarySearchIndex = {
  documents: SearchDocument[];
  engine: MiniSearch<SearchDocument>;
};
export type SearchFilters = {
  kind?: string;
  category?: string;
  source?: string;
};
export type LibrarySearchResult = SearchDocument & {
  excerpt: string;
  score: number;
};
export const SEARCH_PAGE_SIZE = 30;
export const SEARCH_QUERY_LIMIT = 160;

// Catalog replacement after HMR gets a fresh index. No persistent queries or indexes.
const indexes = new WeakMap<LibraryCatalog, LibrarySearchIndex>();
const normalize = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('en');

export function boundedSearchQuery(value: string): string {
  return boundedHubQuery(value)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim();
}

export function librarySearchDocuments(
  catalog: LibraryCatalog,
): SearchDocument[] {
  const documents: SearchDocument[] = [];
  for (const item of catalog.manifest.items) {
    if (item.status !== 'published') continue;
    const markdown = getArticleMarkdown(item, catalog);
    if (markdown === null)
      throw new Error('Published Library content is unavailable.');
    const parsed = parseMarkdownSections(markdown);
    const sections = parsed.sections.length
      ? parsed.sections
      : [{ id: 'section-start', title: '', text: '' }];
    for (const section of sections) {
      documents.push({
        id: `${item.id}/${section.id}`,
        title: item.title,
        heading: section.title,
        text: `${item.description}\n${section.text}`,
        tags: item.tags.join(' '),
        kind: item.kind,
        category: item.category,
        sources: [
          ...new Set(item.sourceProductRefs.map((ref) => ref.split('/')[0])),
        ],
        href: libraryItemHref(item, section.id),
      });
    }
  }
  for (const source of catalog.registry.sources) {
    for (const product of source.products) {
      const reference = `${source.id}/${product.id}`;
      const guide = catalog.registry.guideGroups.find((group) =>
        group.sourceProductRefs.includes(reference),
      );
      documents.push({
        id: `source/${reference}`,
        title: `${source.name}: ${product.name}`,
        heading: 'Source product reference',
        text: `${product.description}\n${product.coverage.geography}\n${product.coverage.gaps}`,
        tags: '',
        kind: 'source-product',
        category: 'Source directory',
        sources: [source.id],
        href: sourceDirectoryHref(guide?.id || source.id),
      });
    }
  }
  return documents;
}

export function createLibrarySearchIndex(
  catalog: LibraryCatalog,
): LibrarySearchIndex {
  const documents = librarySearchDocuments(catalog);
  const engine = new MiniSearch<SearchDocument>({
    fields: ['title', 'heading', 'tags', 'text'],
    storeFields: [
      'title',
      'heading',
      'text',
      'tags',
      'kind',
      'category',
      'sources',
      'href',
    ],
    processTerm: normalize,
    searchOptions: {
      boost: { title: 5, heading: 4, tags: 3 },
      prefix: true,
      combineWith: 'AND',
    },
  });
  engine.addAll(documents);
  return { documents, engine };
}

export function getLibrarySearchIndex(
  catalog: LibraryCatalog,
): LibrarySearchIndex {
  let index = indexes.get(catalog);
  if (!index) {
    index = createLibrarySearchIndex(catalog);
    indexes.set(catalog, index);
  }
  return index;
}

function excerpt(text: string, terms: string[]): string {
  const compact = text.replace(/\s+/g, ' ').trim();
  const normalized = normalize(compact);
  const locations = terms
    .map((term) => normalized.indexOf(normalize(term)))
    .filter((n) => n >= 0);
  const start = Math.max(
    0,
    (locations.length ? Math.min(...locations) : 0) - 60,
  );
  return `${start ? '…' : ''}${compact.slice(start, start + 240)}${compact.length > start + 240 ? '…' : ''}`;
}

export function searchLibrary(
  index: LibrarySearchIndex,
  query: string,
  filters: SearchFilters = {},
  page = 0,
): {
  total: number;
  page: number;
  pageCount: number;
  results: LibrarySearchResult[];
} {
  const bounded = boundedSearchQuery(query);
  if (!bounded) return { total: 0, page: 0, pageCount: 0, results: [] };
  const matches = index.engine.search(bounded, {
    filter: (result) =>
      (!filters.kind || result.kind === filters.kind) &&
      (!filters.category || result.category === filters.category) &&
      (!filters.source || result.sources.includes(filters.source)),
  });
  matches.sort(
    (a, b) =>
      b.score - a.score || String(a.id).localeCompare(String(b.id), 'en'),
  );
  const pageCount = Math.ceil(matches.length / SEARCH_PAGE_SIZE);
  const currentPage = Number.isFinite(page)
    ? Math.max(0, Math.min(Math.floor(page), Math.max(0, pageCount - 1)))
    : 0;
  return {
    total: matches.length,
    page: currentPage,
    pageCount,
    results: matches
      .slice(
        currentPage * SEARCH_PAGE_SIZE,
        (currentPage + 1) * SEARCH_PAGE_SIZE,
      )
      .map((match) => ({
        ...(match as unknown as SearchDocument),
        score: match.score,
        excerpt: excerpt(match.text, match.queryTerms),
      })),
  };
}
