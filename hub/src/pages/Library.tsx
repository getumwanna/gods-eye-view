import React, { useEffect, useSyncExternalStore } from 'react';
import {
  ArrowRight,
  BookOpen,
  Database,
  FileText,
  KeyRound,
  Search,
} from 'lucide-react';
import {
  getSourceGuides,
  sourceGuideHref,
} from '../../../src/custom/shared/layerMetadata.js';
import {
  getLibrarySnapshot,
  loadLibrary,
  refreshLibrary,
  subscribeLibrary,
} from '../library/catalog';
import type { LibraryCatalog } from '../library/types';
import { LibraryNavigation } from '../components/library/LibraryNavigation';

export function LibraryData({
  children,
}: {
  children: (catalog: LibraryCatalog) => React.ReactNode;
}) {
  const snapshot = useSyncExternalStore(
    subscribeLibrary,
    getLibrarySnapshot,
    getLibrarySnapshot,
  );
  useEffect(() => {
    void loadLibrary();
  }, [snapshot.revision]);
  if (snapshot.status === 'error')
    return (
      <section
        className="gih-card gih-library-error"
        role="alert"
        aria-labelledby="library-error-heading"
      >
        <h2 id="library-error-heading">Library content needs attention</h2>
        <p>
          The Library cannot show the current content. The globe and other
          workspace pages remain available.
        </p>
        <ul>
          {snapshot.errors.map((error, i) => (
            <li key={`${error.file}-${error.code}-${i}`}>
              <strong>{error.file}</strong>: {error.message}
            </li>
          ))}
        </ul>
        <button className="gih-retry" type="button" onClick={refreshLibrary}>
          Retry Library
        </button>
      </section>
    );
  if (snapshot.status !== 'ready' || !snapshot.data)
    return (
      <p className="gih-library-loading" role="status">
        Loading Library reference information…
      </p>
    );
  return <>{children(snapshot.data)}</>;
}

export function Library() {
  return (
    <>
      <div className="gih-page-heading">
        <p className="gih-eyebrow">UNDERSTAND YOUR TOOLS</p>
        <h1>Library</h1>
        <p>
          Source references, guides and evidence-backed case studies for your
          local workspace.
        </p>
      </div>
      <LibraryNavigation active="overview" />
      <LibraryData>
        {(catalog) => (
          <>
            <section className="gih-card gih-library-directory">
              <div className="gih-section-label">
                <Database size={18} aria-hidden="true" />
                <span>REFERENCE INFORMATION</span>
              </div>
              <h2>Data Sources</h2>
              <p>
                Explore {catalog.registry.sources.length} source providers,
                their coverage, access requirements, attribution and
                documentation. Observation kind belongs to each associated
                value; feed health is not checked in Library.
              </p>
              <a href="#/library/sources" className="gih-directory-link">
                Browse Data Sources <ArrowRight size={16} aria-hidden="true" />
              </a>
            </section>
            <div className="gih-two-column">
              <section className="gih-card">
                <div className="gih-section-label">
                  <BookOpen size={18} aria-hidden="true" />
                  <span>REFERENCE ARTICLES</span>
                </div>
                <h2>Knowledge Center</h2>
                <p>
                  Read original guides and source-linked summaries alongside
                  selected reviewed sections of upstream documentation.
                  Provenance, review dates and limitations stay with each
                  article.
                </p>
                <a href="#/library/knowledge" className="gih-directory-link">
                  Open Knowledge Center{' '}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </section>
              <section className="gih-card">
                <div className="gih-section-label">
                  <FileText size={18} aria-hidden="true" />
                  <span>WORKFLOW REFERENCES</span>
                </div>
                <h2>Case studies</h2>
                <p>
                  Original case pages distinguish current local capabilities,
                  geographic views and external demonstrations, with explicit
                  limits and sources.
                </p>
                <a href="#/library/cases" className="gih-directory-link">
                  Browse case studies{' '}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </section>
            </div>
            <section className="gih-card gih-source-section">
              <div className="gih-section-label">
                <Search size={18} aria-hidden="true" />
                <span>LOCAL LIBRARY SEARCH</span>
              </div>
              <h2>Find a reference</h2>
              <p>
                Search the published local Library and source descriptions.
                Queries stay in this workspace; no provider or external search
                service is contacted.
              </p>
              <a href="#/library/search" className="gih-directory-link">
                Search Library <ArrowRight size={16} aria-hidden="true" />
              </a>
            </section>
            <section
              className="gih-card gih-source-section"
              aria-labelledby="setup-guides-heading"
            >
              <div className="gih-section-label">
                <KeyRound size={18} aria-hidden="true" />
                <span>EXISTING SETUP</span>
              </div>
              <h2 id="setup-guides-heading">Provider setup guides</h2>
              <p>
                These guides use the existing POWER UP controls. Browsing a
                guide does not read, configure or test a credential.
              </p>
              <div className="gih-guide-list">
                {getSourceGuides().map((guide) => (
                  <a
                    key={guide.id}
                    href={sourceGuideHref(guide.id) || '#/library'}
                    className="gih-guide-link"
                  >
                    <span>{guide.name}</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          </>
        )}
      </LibraryData>
    </>
  );
}
