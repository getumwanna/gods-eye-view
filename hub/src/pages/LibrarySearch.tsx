import React, { useEffect, useMemo, useState } from 'react';
import { LibraryNavigation } from '../components/library/LibraryNavigation';
import {
  SearchResults,
  SEARCH_KIND_LABELS,
} from '../components/library/SearchResults';
import { LibraryData } from './Library';
import { librarySearchHref } from '../library/links';
import {
  boundedSearchQuery,
  getLibrarySearchIndex,
  searchLibrary,
  SEARCH_QUERY_LIMIT,
} from '../library/search';
import type { LibraryCatalog } from '../library/types';

export function LibrarySearchContent({
  catalog,
  query,
}: {
  catalog: LibraryCatalog;
  query: string;
}) {
  const [input, setInput] = useState(query);
  const [kind, setKind] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [page, setPage] = useState(0);
  useEffect(() => {
    setInput(query);
    setPage(0);
  }, [query]);
  const index = useMemo(() => getLibrarySearchIndex(catalog), [catalog]);
  const found = useMemo(
    () => searchLibrary(index, query, { kind, category, source }, page),
    [index, query, kind, category, source, page],
  );
  const categories = [
    ...new Set(index.documents.map((document) => document.category)),
  ].sort();
  const kinds = [
    ...new Set(index.documents.map((document) => document.kind)),
  ].sort();
  return (
    <>
      <form
        className="library-search-form"
        onSubmit={(event) => {
          event.preventDefault();
          window.location.hash = librarySearchHref(boundedSearchQuery(input));
          setPage(0);
        }}
      >
        <label htmlFor="library-query">Search Library</label>
        <div className="gih-inline-actions">
          <input
            id="library-query"
            type="search"
            maxLength={SEARCH_QUERY_LIMIT}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </div>
      </form>
      <div className="library-search-filters">
        <div>
          <label htmlFor="search-kind">Content type</label>
          <select
            id="search-kind"
            value={kind}
            onChange={(event) => {
              setKind(event.target.value);
              setPage(0);
            }}
          >
            <option value="">All content types</option>
            {kinds.map((value) => (
              <option key={value} value={value}>
                {SEARCH_KIND_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="search-category">Category</label>
          <select
            id="search-category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(0);
            }}
          >
            <option value="">All categories</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="search-source">Source</label>
          <select
            id="search-source"
            value={source}
            onChange={(event) => {
              setSource(event.target.value);
              setPage(0);
            }}
          >
            <option value="">All sources</option>
            {catalog.registry.sources.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {!boundedSearchQuery(query) ? (
        <section className="gih-card">
          <h2>Search the local Library</h2>
          <p>
            Enter words from a guide, admitted upstream section or source
            description.
          </p>
        </section>
      ) : (
        <>
          <p role="status">
            {found.total} matching sections or source products for “
            {boundedSearchQuery(query)}”.
          </p>
          {found.results.length ? (
            <SearchResults results={found.results} />
          ) : (
            <section className="gih-card">
              <h2>No matching content</h2>
              <p>Try fewer words or clear the filters.</p>
            </section>
          )}
          {found.pageCount > 1 && (
            <nav
              className="gih-directory-pagination"
              aria-label="Search result pages"
            >
              <button
                type="button"
                disabled={found.page === 0}
                onClick={() => setPage(found.page - 1)}
              >
                Previous
              </button>
              <span>
                Page {found.page + 1} of {found.pageCount}
              </span>
              <button
                type="button"
                disabled={found.page + 1 === found.pageCount}
                onClick={() => setPage(found.page + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
      <p className="library-search-meta">
        Search runs in memory over published local reference content. Queries
        appear in this page’s URL; there is no query history or provider search
        request.
      </p>
    </>
  );
}

export function LibrarySearch({ query }: { query: string }) {
  return (
    <>
      <div className="gih-page-heading">
        <p className="gih-eyebrow">FIND A REFERENCE</p>
        <h1>Library Search</h1>
        <p>
          Search original guides, admitted upstream documentation and source
          descriptions.
        </p>
      </div>
      <LibraryNavigation active="search" />
      <LibraryData>
        {(catalog) => <LibrarySearchContent catalog={catalog} query={query} />}
      </LibraryData>
    </>
  );
}
