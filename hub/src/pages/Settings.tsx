import React, { useEffect, useState } from 'react';
import { Check, Moon, Sun } from 'lucide-react';
import { branding } from '../../../src/custom/shared/branding.js';
import { getTheme, setTheme, subscribeTheme } from '../../../src/custom/shared/theme.js';
import { Button } from '../components/ui/button';

export function Settings() {
  const [theme, updateTheme] = useState(getTheme);
  useEffect(() => subscribeTheme(updateTheme), []);
  return <>
    <div className="gih-page-heading"><p className="gih-eyebrow">MAKE THIS SPACE YOURS</p><h1>Settings</h1><p>Appearance is shared with the globe. Workspace tools will arrive in a later phase.</p></div>
    <section className="gih-card gih-readable"><h2>Appearance</h2><p>Choose a theme for the hub and globe panels. Globe sensor styles keep their existing behavior.</p><div role="group" aria-label="Color theme" className="gih-theme-options">{(['dark', 'light'] as const).map(value => <Button key={value} variant={theme === value ? 'default' : 'outline'} aria-pressed={theme === value} onClick={() => setTheme(value)}>{value === 'dark' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}{value === 'dark' ? 'Dark theme' : 'Light theme'}{theme === value && <Check aria-hidden="true" />}</Button>)}</div></section>
    <section className="gih-card gih-readable"><h2>Branding</h2><dl className="gih-definition-list"><div><dt>Workspace</dt><dd>{branding.name}</dd></div><div><dt>Short name</dt><dd>{branding.shortName}</dd></div><div><dt>Accent</dt><dd><span className="gih-accent-swatch" aria-hidden="true" />{branding.accent}</dd></div></dl><p className="gih-note">Branding is configured locally in branding.json. No account or cloud profile is used.</p></section>
    <section className="gih-card gih-readable"><p className="gih-section-label">PHASE 3</p><h2>Personal workspace</h2><p>Home region, named saved views, layer presets, view-only vessel bookmarks and workspace import/export are not yet available. Existing globe share links, Director scenes and session-local file imports remain in the globe.</p><span className="gih-phase-badge">Planned · workspace collections not created</span></section>
  </>;
}
