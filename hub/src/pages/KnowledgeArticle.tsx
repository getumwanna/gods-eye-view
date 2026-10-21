import React, { useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { branding } from '../../../src/custom/shared/branding.js';
import { ArticleRenderer } from '../components/library/ArticleRenderer';
import { LibraryNavigation } from '../components/library/LibraryNavigation';
import { ReferenceLink } from '../components/library/SourceRecord';
import { getArticleMarkdown, parseMarkdownSections } from '../library/markdown';
import { knowledgeHref } from '../library/links';
import { LibraryData } from './Library';
import { articleKindLabel } from './KnowledgeCenter';
import type { LibraryCatalog, LibraryItem } from '../library/types';

export function KnowledgeArticleView({
  item,
  catalog,
  section = null,
}: {
  item: LibraryItem;
  catalog: LibraryCatalog;
  section?: string | null;
}) {
  const markdown = getArticleMarkdown(item, catalog);
  const parsed = useMemo(
    () => parseMarkdownSections(markdown || ''),
    [markdown],
  );
  const sectionExists =
    !section ||
    section === 'section-start' ||
    parsed.headings.some((heading) => heading.id === section);
  useEffect(() => {
    document.title = `${item.title} · ${branding.shortName}`;
    const destination =
      section && sectionExists
        ? document.getElementById(section)
        : document.getElementById('knowledge-article-title');
    destination?.focus({ preventScroll: true });
    if (destination && section && sectionExists)
      destination.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [item.id, item.title, section, sectionExists, catalog]);
  return (
    <>
      <a href="#/library/knowledge" className="gih-back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Knowledge Center
      </a>
      <header className="gih-page-heading">
        <p className="gih-eyebrow">
          {articleKindLabel(item.kind)} · STATIC REFERENCE
        </p>
        <h1 id="knowledge-article-title" tabIndex={-1}>
          {item.title}
        </h1>
        <p>{item.description}</p>
        <p className="gih-article-byline">
          {item.author} · Reviewed {item.reviewedDate}
          {item.publishedDate && <> · Published {item.publishedDate}</>}
        </p>
      </header>
      <LibraryNavigation active="knowledge" />
      {!sectionExists && (
        <p className="gih-library-section-warning" role="alert">
          The linked section is unavailable in this reviewed article. The
          article is shown from its beginning.
        </p>
      )}
      <div className="gih-article-layout">
        <aside className="gih-article-aside">
          <nav aria-label="Article contents">
            <h2>On this page</h2>
            <a href={knowledgeHref(item.slug, 'section-start')}>
              Article beginning
            </a>
            <ol>
              {parsed.headings.map((heading) => (
                <li
                  key={heading.id}
                  className={`gih-toc-depth-${Math.min(heading.depth, 4)}`}
                >
                  <a
                    href={knowledgeHref(item.slug, heading.id)}
                    aria-current={
                      heading.id === section ? 'location' : undefined
                    }
                  >
                    {heading.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <p className="gih-note">
            Review dates describe documentation review. They do not indicate
            feed freshness.
          </p>
        </aside>
        <article className="gih-article-content">
          {markdown === null ? (
            <p role="alert">
              The published article's admitted content is unavailable.
            </p>
          ) : (
            <ArticleRenderer
              item={item}
              catalog={catalog}
              markdown={markdown}
            />
          )}
          <section
            className="gih-article-provenance"
            aria-labelledby="article-provenance-heading"
          >
            <h2 id="article-provenance-heading">Provenance and permissions</h2>
            <p>{item.adaptationNotice}</p>
            <p className="gih-license-notice">{item.licenseNotice}</p>
            {item.upstreamRevision && (
              <p>
                Upstream revision: <code>{item.upstreamRevision}</code>. Only
                the selected reviewed sections are reproduced.
              </p>
            )}
            <p>
              Data may be delayed, modeled or wrong. This workspace is for local
              personal use and is not for operational use.
            </p>
          </section>
          <section
            className="gih-article-references"
            aria-labelledby="article-references-heading"
          >
            <h2 id="article-references-heading">Sources and further reading</h2>
            <ol>
              {item.references.map((reference, i) => (
                <li key={`${reference.url}-${i}`}>
                  <ReferenceLink href={reference.url}>
                    {reference.title}
                  </ReferenceLink>
                  <span className="gih-fact-notes">
                    Reference reviewed {reference.reviewedDate}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </article>
      </div>
    </>
  );
}

export function KnowledgeArticle({
  slug,
  section = null,
}: {
  slug: string;
  section?: string | null;
}) {
  return (
    <LibraryData>
      {(catalog) => {
        const item = catalog.manifest.items.find(
          (item) =>
            item.slug === slug &&
            item.status === 'published' &&
            item.kind !== 'case-study',
        );
        return item ? (
          <KnowledgeArticleView
            item={item}
            catalog={catalog}
            section={section}
          />
        ) : (
          <>
            <div className="gih-page-heading">
              <h1>Article unavailable</h1>
              <p>
                This article has not been published in the reviewed Library.
              </p>
            </div>
            <a href="#/library/knowledge" className="gih-back-link">
              Return to Knowledge Center
            </a>
          </>
        );
      }}
    </LibraryData>
  );
}
