import React, { useEffect, useState } from 'react';
import { HubShell } from './components/HubShell';
import { Dashboard } from './pages/Dashboard';
import { Library } from './pages/Library';
import { Settings } from './pages/Settings';
import { SourceGuide } from './pages/SourceGuide';
import { parseHubRoute, routeTitle } from './router.js';
import { branding } from '../../src/custom/shared/branding.js';

export function App() {
  const [route, setRoute] = useState(() => parseHubRoute(window.location.hash));
  useEffect(() => {
    const handle = () => setRoute(parseHubRoute(window.location.hash));
    window.addEventListener('hashchange', handle);
    return () => window.removeEventListener('hashchange', handle);
  }, []);
  useEffect(() => {
    document.title = `${routeTitle(route)} · ${branding.shortName}`;
    document.getElementById('main-content')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [route]);
  let content;
  if (route.page === 'dashboard') content = <Dashboard />;
  else if (route.page === 'library') content = <Library />;
  else if (route.page === 'settings') content = <Settings />;
  else if (route.page === 'source' && route.sourceId) content = <SourceGuide id={route.sourceId} />;
  else content = <div className="gih-page-heading"><p className="gih-eyebrow">LOCAL WORKSPACE</p><h1>Page not found</h1><p>The requested hub page is unavailable. <a href="#/dashboard">Return to Dashboard</a>.</p></div>;
  return <HubShell page={route.page} title={routeTitle(route)}>{content}</HubShell>;
}
