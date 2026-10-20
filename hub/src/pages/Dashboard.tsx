import React, { useState } from 'react';
import { ArrowUpRight, Globe2, Layers3, Link2 } from 'lucide-react';
import { createGlobeUrl, validateGlobeLink } from '../../../src/custom/shared/shareHandoff.js';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function Dashboard() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  function openSharedView(event: React.FormEvent) {
    event.preventDefault();
    try {
      const url = validateGlobeLink(input.trim());
      setError('');
      window.location.assign(url);
    } catch {
      setError('Enter a valid share link from this local globe. External links and links containing credentials are not accepted.');
    }
  }
  return <>
    <div className="gih-page-heading"><p className="gih-eyebrow">YOUR GEOSPATIAL WORKSPACE</p><h1>Dashboard</h1><p>The globe is ready to explore. Your information dashboard comes next.</p></div>
    <section className="gih-hero" aria-labelledby="explore-heading">
      <div className="gih-hero-icon"><Globe2 size={32} aria-hidden="true" /></div>
      <div><p className="gih-eyebrow">EXISTING GEV GLOBE</p><h2 id="explore-heading">A world of context, one view at a time.</h2><p>Explore the existing globe, select layers and follow reported aircraft or satellites. Provider coverage and optional key requirements still apply.</p><Button asChild><a href={createGlobeUrl()}>Explore globe <ArrowUpRight aria-hidden="true" /></a></Button></div>
    </section>
    <div className="gih-two-column">
      <section className="gih-card" aria-labelledby="summary-heading"><div className="gih-section-label"><Layers3 size={18} aria-hidden="true" /><span>COMING IN PHASE 2</span></div><h2 id="summary-heading">Feed summaries</h2><p>Regional summaries, feed health and source timestamps will appear here after shared acquisition and cache ownership are in place.</p><p className="gih-note">No dashboard feeds are polled by this page.</p></section>
      <section className="gih-card" aria-labelledby="share-heading"><div className="gih-section-label"><Link2 size={18} aria-hidden="true" /><span>GLOBE HANDOFF</span></div><h2 id="share-heading">Open a shared view</h2><p>Paste a share link copied from this local globe. The full supported view state stays in the link.</p><form onSubmit={openSharedView} className="gih-share-form"><label htmlFor="globe-share-link">Globe share link</label><Input id="globe-share-link" type="text" value={input} onChange={event => { setInput(event.target.value); setError(''); }} placeholder="http://localhost:4173/#v=2&…" autoComplete="off" spellCheck={false} aria-invalid={Boolean(error)} aria-describedby={error ? 'share-error' : undefined} /><Button type="submit" variant="outline">Open shared view <ArrowUpRight aria-hidden="true" /></Button>{error && <p id="share-error" role="alert" className="gih-error">{error}</p>}</form></section>
    </div>
    <p className="gih-operational-note">Use this workspace for exploration and learning. Data may be delayed, modeled or wrong; never use it for navigation, emergency response or other safety-critical decisions.</p>
  </>;
}
