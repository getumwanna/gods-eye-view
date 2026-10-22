import React, { useEffect, useRef } from 'react';
import { KnowledgeArticleView } from './KnowledgeArticle';
import { LibraryData } from './Library';

function UnavailableCaseStudy({
  slug,
  section,
}: {
  slug: string;
  section: string | null;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [slug, section]);
  return (
    <>
      <div className="gih-page-heading" role="alert">
        <h1 id="case-study-unavailable-title" tabIndex={-1} ref={heading}>
          Case study unavailable
        </h1>
        <p>This case study has not been published in the reviewed Library.</p>
      </div>
      <a href="#/library/cases" className="gih-back-link">
        Return to case studies
      </a>
    </>
  );
}

export function CaseStudy({
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
          (candidate) =>
            candidate.slug === slug &&
            candidate.kind === 'case-study' &&
            candidate.status === 'published',
        );
        return item ? (
          <KnowledgeArticleView
            item={item}
            catalog={catalog}
            section={section}
          />
        ) : (
          <UnavailableCaseStudy slug={slug} section={section} />
        );
      }}
    </LibraryData>
  );
}
