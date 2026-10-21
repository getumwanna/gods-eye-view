import React, { useMemo, useState } from 'react';
import { LibraryNavigation } from '../components/library/LibraryNavigation';
import { SourceRecord } from '../components/library/SourceRecord';
import { LibraryData } from './Library';
import type { LibraryCatalog } from '../library/types';

export function SourceDirectory({ catalog }: { catalog: LibraryCatalog }) {
  const [filter, setFilter] = useState('');
  const [access, setAccess] = useState('all');
  const [page, setPage] = useState(0);
  const products = useMemo(
    () =>
      catalog.registry.sources.flatMap((source) =>
        source.products.map((product) => ({ source, product })),
      ),
    [catalog],
  );
  const filtered = products.filter(
    ({ source, product }) =>
      (access === 'all' || product.access.tier === access) &&
      `${source.name} ${product.name} ${product.description} ${product.coverage.geography}`
        .toLocaleLowerCase()
        .includes(filter.trim().toLocaleLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(currentPage * 12, (currentPage + 1) * 12);
  return (
    <>
      <section className="gih-card gih-source-directory-intro">
        <p>
          <strong>Static reference information.</strong> These records describe
          reviewed documentation at upstream pin{' '}
          {catalog.registry.upstreamRevision.slice(0, 8)}. They do not test
          providers, credentials or feed health. Documentation reviewed{' '}
          {catalog.registry.reviewedDate}.
        </p>
        <p>
          Observation kind is shown separately for each associated layer value.
          Publisher cadence, application refresh and cache TTL describe
          different operations.
        </p>
      </section>
      <div className="gih-directory-filters">
        <div>
          <label htmlFor="source-filter">Filter source references</label>
          <input
            id="source-filter"
            type="search"
            maxLength={160}
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
              setPage(0);
            }}
            placeholder="Provider, product or coverage"
          />
        </div>
        <div>
          <label htmlFor="source-access">Access requirement</label>
          <select
            id="source-access"
            value={access}
            onChange={(event) => {
              setAccess(event.target.value);
              setPage(0);
            }}
          >
            <option value="all">All access requirements</option>
            {[...new Set(products.map(({ product }) => product.access.tier))]
              .sort()
              .map((tier) => (
                <option value={tier} key={tier}>
                  {tier.replaceAll('-', ' ')}
                </option>
              ))}
          </select>
        </div>
      </div>
      <p className="gih-directory-count" role="status">
        {filtered.length} of {products.length} source products
      </p>
      {filtered.length ? (
        <div className="gih-source-record-list">
          {visible.map(({ source, product }) => (
            <SourceRecord
              key={`${source.id}/${product.id}`}
              source={source}
              product={product}
              bindings={catalog.registry.bindings}
            />
          ))}
        </div>
      ) : (
        <section className="gih-card">
          <h2>No matching sources</h2>
          <p>Try a different provider name or clear the access filter.</p>
        </section>
      )}
      {pageCount > 1 && (
        <nav
          className="gih-directory-pagination"
          aria-label="Source directory pages"
        >
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            type="button"
            disabled={currentPage + 1 === pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </>
  );
}

export function DataSources() {
  return (
    <>
      <div className="gih-page-heading">
        <p className="gih-eyebrow">TRACE THE SOURCE</p>
        <h1>Data Sources</h1>
        <p>
          Coverage, access, evidence and attribution for the products behind
          GEV's layers.
        </p>
      </div>
      <LibraryNavigation active="sources" />
      <LibraryData>
        {(catalog) => <SourceDirectory catalog={catalog} />}
      </LibraryData>
    </>
  );
}
