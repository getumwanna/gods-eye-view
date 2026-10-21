import React from 'react';

export function LibraryNavigation({
  active,
}: {
  active: 'overview' | 'sources' | 'knowledge' | 'cases' | 'search';
}) {
  return (
    <nav className="gih-library-navigation" aria-label="Library navigation">
      <a
        href="#/library"
        aria-current={active === 'overview' ? 'page' : undefined}
      >
        Overview
      </a>
      <a
        href="#/library/sources"
        aria-current={active === 'sources' ? 'page' : undefined}
      >
        Data Sources
      </a>
    </nav>
  );
}
