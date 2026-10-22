import React, { useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { branding } from '../../../src/custom/shared/branding.js';
import { ArticleRenderer } from '../components/library/ArticleRenderer';
import { LibraryNavigation } from '../components/library/LibraryNavigation';
import { ReferenceLink } from '../components/library/SourceRecord';
import { getArticleMarkdown, parseMarkdownSections } from '../library/markdown';
import { caseGlobeHref, libraryItemHref } from '../library/links';
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
  const isCase = item.kind === 'case-study';
  const directoryHref = isCase ? '#/library/cases' : '#/library/knowledge';
  const directoryTitle = isCase ? 'Case studies' : 'Knowledge Center';
  const titleId = isCase ? 'case-study-title' : 'knowledge-article-title';
  const globeHref = caseGlobeHref(item);
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
        : document.getElementById(titleId);
    destination?.focus({ preventScroll: true });
    if (destination && section && sectionExists)
      destination.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [item.id, item.title, section, sectionExists, catalog, titleId]);
  return (
    <>
      <a href={directoryHref} className="gih-back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        {directoryTitle}
      </a>
      <header className="gih-page-heading">
        <p className="gih-eyebrow">
          {articleKindLabel(item.kind)} · STATIC REFERENCE
        </p>
        <h1 id={titleId} tabIndex={-1}>
          {item.title}
        </h1>
        <p>{item.description}</p>
        <p className="gih-article-byline">
          {item.author} · Reviewed {item.reviewedDate}
          {item.publishedDate && <> · Published {item.publishedDate}</>}
        </p>
      </header>
      <LibraryNavigation active={isCase ? 'cases' : 'knowledge'} />
      {isCase && item.caseDetails && (
        <section
          className="gih-card gih-case-context"
          aria-labelledby="case-context-heading"
        >
          <h2 id="case-context-heading">Local capability and limits</h2>
          <p className="gih-eyebrow">
            {
              {
                interactive: 'Interactive',
                partial: 'Partial',
                'demonstration-only': 'Demonstration only',
                'view-only': 'View only',
              }[item.caseDetails.interactivity]
            }
            {' · STATIC REFERENCE'}
          </p>
          <ul>
            {item.caseDetails.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
          {item.caseDetails.restoredScope && (
            <p>
              <strong>Restored by the globe link:</strong>{' '}
              {item.caseDetails.restoredScope}
            </p>
          )}
          {globeHref ? (
            <a href={globeHref} className="gih-directory-link">
              Open globe view
            </a>
          ) : item.caseDetails.globeUrl &&
            item.caseDetails.interactivity !== 'demonstration-only' ? (
            <p role="alert">
              This case's globe link could not be validated. Continue with the
              reviewed reference below.
            </p>
          ) : (
            <p className="gih-note">
              This reference has no local globe handoff. Its sources do not
              establish that the demonstrated workflow is available here.
            </p>
          )}
        </section>
      )}
      {!sectionExists && (
        <p className="gih-library-section-warning" role="alert">
          The linked section is unavailable in this reviewed{' '}
          {isCase ? 'case study' : 'article'}. The{' '}
          {isCase ? 'case study' : 'article'} is shown from its beginning.
        </p>
      )}
      <div className="gih-article-layout">
        <aside className="gih-article-aside">
          <nav aria-label={isCase ? 'Case study contents' : 'Article contents'}>
            <h2>On this page</h2>
            <a href={libraryItemHref(item, 'section-start')}>
              {isCase ? 'Case beginning' : 'Article beginning'}
            </a>
            <ol>
              {parsed.headings.map((heading) => (
                <li
                  key={heading.id}
                  className={`gih-toc-depth-${Math.min(heading.depth, 4)}`}
                >
                  <a
                    href={libraryItemHref(item, heading.id)}
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
