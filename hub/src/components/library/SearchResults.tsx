import React from 'react';
import type { LibrarySearchResult } from '../../library/search';

export const SEARCH_KIND_LABELS: Record<string, string> = {
  'original-article': 'Original guide',
  'external-summary': 'Original article summary',
  'upstream-documentation': 'Upstream documentation',
  'case-study': 'Case study',
  'source-product': 'Source product',
};

export function SearchResults({ results }: { results: LibrarySearchResult[] }) {
  return (
    <ol className="library-search-results">
      {results.map((result) => (
        <li key={result.id} className="gih-card library-search-result">
          <p className="library-search-meta">
            {SEARCH_KIND_LABELS[result.kind]} · {result.category} · Static
            reference information
          </p>
          <h2>
            <a href={result.href}>{result.title}</a>
          </h2>
          {result.heading && (
            <p>
              <strong>{result.heading}</strong>
            </p>
          )}
          <p>{result.excerpt}</p>
          {result.kind === 'source-product' && (
            <p>
              Opens its source guide. Feed health is not checked in Library.
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
