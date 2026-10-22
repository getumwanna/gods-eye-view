import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LibraryNavigation } from '../components/library/LibraryNavigation';
import { caseHref } from '../library/links';
import { LibraryData } from './Library';
import type { LibraryCatalog, LibraryItem } from '../library/types';

export function caseInteractivityLabel(
  value: NonNullable<LibraryItem['caseDetails']>['interactivity'],
) {
  return {
    interactive: 'Interactive',
    partial: 'Partial',
    'demonstration-only': 'Demonstration only',
    'view-only': 'View only',
  }[value];
}

export function CaseDirectory({ catalog }: { catalog: LibraryCatalog }) {
  const [category, setCategory] = useState('all');
  const items = catalog.manifest.items.filter(
    (item) => item.status === 'published' && item.kind === 'case-study',
  );
  const visible = items.filter(
    (item) => category === 'all' || item.category === category,
  );
  return (
    <>
      <div className="gih-directory-filters">
        <div>
          <label htmlFor="case-category">Category</label>
          <select
            id="case-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {[...new Set(items.map((item) => item.category))]
              .sort()
              .map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
        </div>
      </div>
      <p className="gih-directory-count" role="status">
        {visible.length} published{' '}
        {visible.length === 1 ? 'case study' : 'case studies'}
      </p>
      {visible.length ? (
        <div className="gih-knowledge-grid">
          {visible.map((item) => (
            <article
              key={item.id}
              className="gih-card gih-knowledge-card gih-case-card"
            >
              <p className="gih-eyebrow">
                {item.caseDetails &&
                  caseInteractivityLabel(item.caseDetails.interactivity)}
                {' · STATIC REFERENCE'}
              </p>
              <h2>
                <a href={caseHref(item.slug)}>{item.title}</a>
              </h2>
              <p>{item.description}</p>
              <p className="gih-note">
                Reviewed {item.reviewedDate} · {item.author}
              </p>
              <a className="gih-directory-link" href={caseHref(item.slug)}>
                Read case study <ArrowRight size={16} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      ) : (
        <section className="gih-card">
          <h2>No published case studies in this category</h2>
          <p>Choose another category to continue.</p>
        </section>
      )}
    </>
  );
}

export function CaseStudies() {
  return (
    <>
      <div className="gih-page-heading">
        <p className="gih-eyebrow">WORKFLOWS WITH LIMITS</p>
        <h1>Case studies</h1>
        <p>
          Original case references distinguish the local capabilities available
          at the reviewed pin from partial workflows and external
          demonstrations. Coverage and limits stay visible; these pages are not
          current feed observations.
        </p>
      </div>
      <LibraryNavigation active="cases" />
      <LibraryData>
        {(catalog) => <CaseDirectory catalog={catalog} />}
      </LibraryData>
    </>
  );
}
