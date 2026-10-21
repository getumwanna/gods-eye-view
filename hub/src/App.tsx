import React, {
  Component,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { HubShell } from './components/HubShell';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { parseHubRoute, routeTitle } from './router.js';
import { branding } from '../../src/custom/shared/branding.js';

type LibraryPageKind =
  | 'overview'
  | 'sources'
  | 'source'
  | 'knowledge'
  | 'knowledge-article'
  | 'search';
type LibraryEntryProps = {
  id: string;
  slug: string;
  query: string;
  section: string | null;
};
async function loadLibraryPage(
  kind: LibraryPageKind,
): Promise<{ default: React.ComponentType<LibraryEntryProps> }> {
  if (kind === 'sources')
    return { default: (await import('./pages/DataSources')).DataSources };
  if (kind === 'source')
    return { default: (await import('./pages/SourceGuide')).SourceGuide };
  if (kind === 'knowledge')
    return {
      default: (await import('./pages/KnowledgeCenter')).KnowledgeCenter,
    };
  if (kind === 'knowledge-article')
    return {
      default: (await import('./pages/KnowledgeArticle')).KnowledgeArticle,
    };
  if (kind === 'search')
    return { default: (await import('./pages/LibrarySearch')).LibrarySearch };
  return { default: (await import('./pages/Library')).Library };
}

class LibraryErrorBoundary extends Component<
  { children: React.ReactNode; onRetry: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <section className="gih-card gih-library-error" role="alert">
          <h1>Library unavailable</h1>
          <p>
            The current Library content could not be displayed. The globe and
            other workspace pages remain available.
          </p>
          <div className="gih-button-row">
            <button
              type="button"
              className="gih-retry"
              onClick={this.props.onRetry}
            >
              Retry Library
            </button>
            <a href="#/dashboard">Return to Dashboard</a>
          </div>
        </section>
      );
    return this.props.children;
  }
}

function LibraryRoute({
  title,
  kind,
  sourceId = '',
  slug = '',
  query = '',
  section = null,
}: {
  title: string;
  kind: LibraryPageKind;
  sourceId?: string;
  slug?: string;
  query?: string;
  section?: string | null;
}) {
  const [attempt, setAttempt] = useState(0);
  // A new lazy identity lets Retry reattempt a failed chunk, rather than reuse React.lazy's rejected promise.
  const Entry = useMemo(
    () => lazy(() => loadLibraryPage(kind)),
    [kind, attempt],
  );
  return (
    <LibraryErrorBoundary
      key={attempt}
      onRetry={() => setAttempt((value) => value + 1)}
    >
      <Suspense
        fallback={
          <div className="gih-page-heading">
            <h1>{title}</h1>
            <p role="status">Loading Library reference information…</p>
          </div>
        }
      >
        <Entry id={sourceId} slug={slug} query={query} section={section} />
      </Suspense>
    </LibraryErrorBoundary>
  );
}

export function App() {
  const [route, setRoute] = useState(() => parseHubRoute(window.location.hash));
  useEffect(() => {
    const handle = () => setRoute(parseHubRoute(window.location.hash));
    window.addEventListener('hashchange', handle);
    return () => window.removeEventListener('hashchange', handle);
  }, []);
  useEffect(() => {
    document.title = `${routeTitle(route)} · ${branding.shortName}`;
    if (route.page === 'knowledge-article' && route.section) return;
    document.getElementById('main-content')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [route]);
  let content;
  if (route.page === 'dashboard') content = <Dashboard />;
  else if (route.page === 'library')
    content = <LibraryRoute title="Library" kind="overview" key="library" />;
  else if (route.page === 'data-sources')
    content = (
      <LibraryRoute title="Data Sources" kind="sources" key="data-sources" />
    );
  else if (route.page === 'knowledge')
    content = (
      <LibraryRoute title="Knowledge Center" kind="knowledge" key="knowledge" />
    );
  else if (route.page === 'knowledge-article' && route.slug)
    content = (
      <LibraryRoute
        title="Knowledge article"
        kind="knowledge-article"
        slug={route.slug}
        section={route.section}
        key={`knowledge-${route.slug}`}
      />
    );
  else if (route.page === 'library-search')
    content = (
      <LibraryRoute
        title="Library search"
        kind="search"
        query={route.query}
        key="library-search"
      />
    );
  else if (route.page === 'settings') content = <Settings />;
  else if (route.page === 'source' && route.sourceId)
    content = (
      <LibraryRoute
        title="Source setup"
        kind="source"
        sourceId={route.sourceId}
        key={`source-${route.sourceId}`}
      />
    );
  else
    content = (
      <div className="gih-page-heading">
        <p className="gih-eyebrow">LOCAL WORKSPACE</p>
        <h1>Page not found</h1>
        <p>
          The requested hub page is unavailable.{' '}
          <a href="#/dashboard">Return to Dashboard</a>.
        </p>
      </div>
    );
  return (
    <HubShell page={route.page} title={routeTitle(route)}>
      {content}
    </HubShell>
  );
}
