import React from 'react';
import { ArrowLeft, ArrowUpRight, KeyRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { LibraryNavigation } from '../components/library/LibraryNavigation';
import {
  ReferenceLink,
  SourceRecord,
} from '../components/library/SourceRecord';
import { LibraryData } from './Library';
import { getSourceGuide } from '../../../src/custom/shared/layerMetadata.js';

export function SourceGuide({ id }: { id: string }) {
  const legacyGuide = getSourceGuide(id);
  return (
    <>
      <a href="#/library" className="gih-back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Library
      </a>
      <div className="gih-page-heading">
        <p className="gih-eyebrow">SOURCE REFERENCE</p>
        <h1>{legacyGuide?.name || 'Source reference'}</h1>
        <p>
          Documentation and existing setup controls, with no provider or
          credential checks.
        </p>
      </div>
      <LibraryNavigation active="sources" />
      <LibraryData>
        {(catalog) => {
          const guide = catalog.registry.guideGroups.find(
            (group) => group.id === id,
          );
          const provider = catalog.registry.sources.find(
            (source) => source.id === id,
          );
          if (!guide && !provider)
            return (
              <section className="gih-card">
                <h2>Source guide unavailable</h2>
                <p>
                  This source identifier does not have a record in the reviewed
                  registry.
                </p>
                <Button asChild variant="outline">
                  <a href="#/library/sources">
                    <ArrowLeft aria-hidden="true" />
                    Browse Data Sources
                  </a>
                </Button>
              </section>
            );
          const products = catalog.registry.sources.flatMap((source) =>
            source.products
              .filter((product) =>
                guide
                  ? guide.sourceProductRefs.includes(
                      `${source.id}/${product.id}`,
                    )
                  : source.id === provider?.id,
              )
              .map((product) => ({ source, product })),
          );
          return (
            <>
              {guide && (
                <section className="gih-card gih-readable">
                  <div className="gih-section-label">
                    <KeyRound size={18} aria-hidden="true" />
                    <span>SETUP GUIDANCE · STATIC REFERENCE</span>
                  </div>
                  <h2>Before you enable this provider</h2>
                  <p>{guide.explanation}</p>
                  <div className="gih-button-row">
                    {guide.setupUrl === '/?setup=1' && (
                      <Button asChild>
                        <a href="/?setup=1">
                          Open POWER UP <ArrowUpRight aria-hidden="true" />
                        </a>
                      </Button>
                    )}
                    <ReferenceLink href={guide.docsHref}>
                      Provider documentation
                    </ReferenceLink>
                  </div>
                  <p className="gih-note">
                    POWER UP opens the existing local Provider Settings dialog.
                    Choose the matching provider there; this link does not focus
                    or configure it automatically. No keys are stored by this
                    page.
                  </p>
                </section>
              )}
              <p className="gih-operational-note">
                Static reference information. Documentation reviewed{' '}
                {catalog.registry.reviewedDate}; feed health is{' '}
                <strong>Not checked in Library.</strong> A review date is not a
                live observation timestamp.
              </p>
              <div className="gih-source-record-list">
                {products.map(({ source, product }) => (
                  <SourceRecord
                    key={`${source.id}/${product.id}`}
                    source={source}
                    product={product}
                    bindings={catalog.registry.bindings}
                  />
                ))}
              </div>
            </>
          );
        }}
      </LibraryData>
    </>
  );
}
