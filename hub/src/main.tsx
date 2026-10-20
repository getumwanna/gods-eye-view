import React from 'react';
import { createRoot } from 'react-dom/client';
import { applyTheme } from '../../src/custom/shared/theme.js';
import { branding } from '../../src/custom/shared/branding.js';
import { App } from './App';
import './styles.css';

applyTheme();
document.documentElement.style.setProperty('--gih-accent', branding.accent);
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
