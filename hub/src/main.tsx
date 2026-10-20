import React from 'react';
import { createRoot } from 'react-dom/client';
import { applyTheme } from '../../src/custom/shared/theme.js';
import './styles.css';

applyTheme();
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main className="gih-foundation">
      <p className="gih-eyebrow">GEV Hub · Foundation</p>
      <h1>Geospatial Intelligence Hub</h1>
      <p>The navigation shell is being prepared. The existing globe is available.</p>
      <a href="/">Open globe</a>
    </main>
  </React.StrictMode>,
);
