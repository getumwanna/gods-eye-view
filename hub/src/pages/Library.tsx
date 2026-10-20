import React from 'react';
import { ArrowRight, BookOpen, FileText, KeyRound } from 'lucide-react';
import { getSourceGuides, sourceGuideHref } from '../../../src/custom/shared/layerMetadata.js';

export function Library() {
  return <>
    <div className="gih-page-heading"><p className="gih-eyebrow">UNDERSTAND YOUR TOOLS</p><h1>Library</h1><p>A place for guides, source explanations and evidence-backed case studies.</p></div>
    <div className="gih-two-column">
      <section className="gih-card"><div className="gih-section-label"><BookOpen size={18} aria-hidden="true" /><span>PHASE 2</span></div><h2>Knowledge Center</h2><p>Searchable GEV documentation, practical walkthroughs and original GIS/GEOINT guides are planned for the next phase.</p><span className="gih-phase-badge">Not yet available</span></section>
      <section className="gih-card"><div className="gih-section-label"><FileText size={18} aria-hidden="true" /><span>PHASE 2</span></div><h2>Case studies</h2><p>Case studies will identify their sources and clearly distinguish working globe experiences from demonstrations of separate technology.</p><span className="gih-phase-badge">Not yet available</span></section>
    </div>
    <section className="gih-card gih-source-section" aria-labelledby="setup-guides-heading"><div className="gih-section-label"><KeyRound size={18} aria-hidden="true" /><span>AVAILABLE NOW</span></div><h2 id="setup-guides-heading">Provider setup guides</h2><p>These short guides connect optional providers to existing setup controls. The complete Data Sources directory, including verified coverage, terms and update intervals, is a Phase 2 deliverable.</p><div className="gih-guide-list">{getSourceGuides().map(guide => <a key={guide.id} href={sourceGuideHref(guide.id) || '#/library'} className="gih-guide-link"><span>{guide.name}</span><ArrowRight size={16} aria-hidden="true" /></a>)}</div></section>
  </>;
}
