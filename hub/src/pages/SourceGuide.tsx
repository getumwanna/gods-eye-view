import React from 'react';
import { ArrowLeft, ArrowUpRight, KeyRound } from 'lucide-react';
import { getSourceGuide } from '../../../src/custom/shared/layerMetadata.js';
import { Button } from '../components/ui/button';

export function SourceGuide({ id }: { id: string }) {
  const guide = getSourceGuide(id);
  if (!guide) return <><div className="gih-page-heading"><p className="gih-eyebrow">PROVIDER SETUP</p><h1>Source guide unavailable</h1><p>This provider does not have a setup guide in the current foundation.</p></div><Button asChild variant="outline"><a href="#/library"><ArrowLeft aria-hidden="true" />Return to Library</a></Button></>;
  return <>
    <a href="#/library" className="gih-back-link"><ArrowLeft size={16} aria-hidden="true" />Library</a>
    <div className="gih-page-heading"><p className="gih-eyebrow">PROVIDER SETUP</p><h1>{guide.name}</h1><p>Connect an existing provider using GEV's local setup.</p></div>
    <section className="gih-card gih-readable"><div className="gih-section-label"><KeyRound size={18} aria-hidden="true" /><span>SETUP GUIDANCE</span></div><h2>Before you enable this provider</h2><p>{guide.explanation}</p><div className="gih-button-row">{guide.setupUrl && <Button asChild><a href={guide.setupUrl}>Open POWER UP <ArrowUpRight aria-hidden="true" /></a></Button>}<Button asChild variant="outline"><a href={guide.docsHref} target="_blank" rel="noreferrer">Provider documentation <ArrowUpRight aria-hidden="true" /></a></Button></div><p className="gih-note">POWER UP opens the existing local Provider Settings dialog. Choose the matching provider there; this link does not focus or configure it automatically.</p></section>
    <p className="gih-operational-note">This is a setup guide, not a complete source record. Verified coverage, attribution, terms, cost notes and current health will be presented in the Phase 2 Data Sources directory. No keys are stored by this page.</p>
  </>;
}
