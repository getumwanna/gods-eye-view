import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LibraryNavigation } from '../components/library/LibraryNavigation';
import { knowledgeHref } from '../library/links';
import { LibraryData } from './Library';
import type { LibraryCatalog, LibraryItem } from '../library/types';

export function articleKindLabel(kind: LibraryItem['kind']) {
  return {
    'original-article': 'Original guide',
    'external-summary': 'Original external-article summary',
    'upstream-documentation': 'Selected upstream documentation',
    'case-study': 'Case study',
  }[kind];
}
export function KnowledgeDirectory({ catalog }: { catalog: LibraryCatalog }) {
  const [category, setCategory] = useState('all');
  const items = catalog.manifest.items.filter(
    (item) => item.status === 'published' && item.kind !== 'case-study',
  );
  const visible = items.filter(
    (item) => category === 'all' || item.category === category,
  );
  return (
    <>
      <div className="gih-directory-filters">
        <div>
          <label htmlFor="knowledge-category">Category</label>
          <select
            id="knowledge-category"
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
        {visible.length === 1 ? 'article' : 'articles'}
      </p>
      {visible.length ? (
        <div className="gih-knowledge-grid">
          {visible.map((item) => (
            <article key={item.id} className="gih-card gih-knowledge-card">
              <p className="gih-eyebrow">{articleKindLabel(item.kind)}</p>
              <h2>
                <a href={knowledgeHref(item.slug)}>{item.title}</a>
              </h2>
              <p>{item.description}</p>
              <p className="gih-note">
                Reviewed {item.reviewedDate} · {item.author}
              </p>
              <a className="gih-directory-link" href={knowledgeHref(item.slug)}>
                Read article <ArrowRight size={16} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      ) : (
        <section className="gih-card">
          <h2>No published articles in this category</h2>
          <p>Choose another category to continue.</p>
        </section>
      )}
    </>
  );
}
export function KnowledgeCenter() {
  return (
    <>
      <div className="gih-page-heading">
        <p className="gih-eyebrow">READ WITH CONTEXT</p>
        <h1>Knowledge Center</h1>
        <p>
          Original guides, source-linked summaries and explicitly admitted
          sections of upstream documentation. These are reference articles, not
          current feed observations.
        </p>
      </div>
      <LibraryNavigation active="knowledge" />
      <LibraryData>
        {(catalog) => <KnowledgeDirectory catalog={catalog} />}
      </LibraryData>
    </>
  );
}
