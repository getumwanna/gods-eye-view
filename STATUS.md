# Geospatial Intelligence Hub status

Updated October 19, 2026, America/New_York. This is a Phase 0 checkpoint, **awaiting gap-analysis review**. Phase 1 has not started.

## Completed and verified

- User approved the Phase 0 file-level plan.
- Created and verified the [user-owned fork](https://github.com/getumwanna/gods-eye-view), with parent `bilawalsidhu/gods-eye-view`.
- Pinned upstream commit `de2138e84c1778fd98a48b7c9fd0b9788c318946`; local branch `hub/phase-0-audit`; configured `origin` and `upstream` and confirmed the pin exists in fork `main`.
- Installed Node `24.22.0`, satisfying the package engine range; used npm `11.19.1` and `npm ci`.
- `npm run doctor`: exit 0, ready, all optional credentials reported unconfigured.
- `GEV_REQUIRE_ALLOCATION_GATE=1 npm test`: exit 0; **8,223 passed, 1 skipped, 0 failed**, including both allocation groups. Skip: native Windows DACL hardening on macOS.
- `npm run build`: exit 0; 868 modules, reported build time 4.02 s. Large-chunk warning recorded, not changed.
- Unmodified development server started using `HOST=localhost PORT=4173 npm run dev -- --strictPort`; listener verified at `[::1]:4173`; HTTP HEAD returned 200 with security headers.
- User confirmed that the globe renders at `http://localhost:4173/`. This is user-verified visual evidence, not an automated screenshot or per-layer feed test.
- Delivered the [Phase 0 gap analysis](docs/custom/PHASE-0-AUDIT.md), source/key/coverage inventory, conflicts, and proposed phase sequencing.
- No upstream files or provider configuration changed. Only four approved documentation files were added; raw installation/test/build/server logs remain ignored locally.

## Phase 0 acceptance

| Criterion | State | Evidence / remaining work |
| --- | --- | --- |
| App runs unmodified at localhost:4173 in keyless mode; doctor passes | Verified with stated limits | Doctor passes; loopback listener/HTTP verified; user reports rendered globe. Individual layer loading remains unverified |
| Existing suite result recorded | Recorded; browser coverage incomplete | Unit/allocation suite and build pass; browser tracking and other browser gates not run |
| Pin recorded; fork has upstream remote | Verified | `CUSTOMIZATION.md`, fork API identity, local remotes and fetched commit |
| Keyless layer loading vs key requirements recorded | Partial | Complete source/key inventory supplied; individual live layer outcomes not observed |
| Gap table delivered and approved | Delivered; approval pending | User must review the audit; approval of the earlier plan was not approval of this result |

## Verification still open

1. **Automated browser access:** automatic approval rejected localhost inspection. No alternate browser/CDP/harness workaround was used. `npm run test:track`, visual UI checks, share restoration, and keyless AI-control behavior have no runtime result from this audit.
2. **Individual feed loading:** credentials/cadences/coverage in the inventory are source evidence, not observations that every keyless provider currently responds or every layer renders. Record actual results when permitted browser verification is available; do not fill unknowns with zeros or success claims.
3. **Rendering performance baseline:** no measured cold navigation, GPU renderer, foreground FPS, viewport, or repeatable layer populations. Upstream's historical performance page is not this machine's baseline. Capture before implementation or explicitly waive the Phase 0 comparison baseline.
4. **Gap approval:** review the complete matrix, conflict recommendations, and priorities. No implementation is authorized yet.

## Decisions needed before dependent implementation

| Question | Recommended resolution | Needed by |
| --- | --- | --- |
| Browser credential exceptions | Permit provider-designated public client tokens such as Mapillary and ephemeral AI session credentials, while keeping persistent secrets server-side; retain restrictions | Before any affected keyed integration |
| Mixed data labels | Assign labels per value: e.g. Simulated cars and Live traffic flow; Estimated camera pose and dated/live frames | Phase 1 metadata design |
| Shared caches / no extra polling | One acquisition owner per source; passive cache snapshots/subscriptions; add bounded server adapters for browser-direct feeds | Phase 2 dashboard plan |
| Satellites loaded | Distinguish current globe-session loaded count from cached-catalog count; do not equate them | Phase 2 widget design |
| Bookmarked entity limits | Keep existing aircraft/military/satellite follow types; vessel bookmarks require a separately scoped codec extension or view-only alternative | Phase 3 |
| Hosting | Leave unselected; authenticated proxies are not automatically compatible with existing local request gates | Phase 4 |
| Public/noncommercial/retention terms | Verify each feed, bundled dataset, visual asset, and recording right with its provider; keyless alone is not sufficient | Before new sources, recorder admission, or hosting |

## Future work (not implemented)

- **Phase 1:** approved file-level plan first; sibling hub entry/navigation; branding and shared theme tokens; visual 21st.dev shortlist and component-license ledger; full-share handoff/back link; active-feed strip and linked key guidance. No component code has been retrieved.
- **Phase 2:** canonical `content/sources.json`; searchable Knowledge Center/Data Sources/Case Studies; shared-cache dashboard with region filters, source/freshness/coverage, and honest unavailable states. Add upcoming-launch query; current upstream query is past-only.
- **Phase 3:** home region; named saved views/presets/entity links; self-contained workspace import/export including scenes/custom datasets and excluding secrets; persistence around the existing GeoJSON/KML/KMZ/GPX importer; global palette; AI setup content. Recorder/history and Ask Library are optional, separately reviewed work.
- **Phase 4:** desktop/mobile testing; measured performance comparison; complete dependency/data/media/security audit; choose hosting topology and document deployment. Desktop packaging remains optional.
- `branding.json`, `design/COMPONENTS.md`, shared token files, hub code, `content/`, `custom-data/`, `SETUP.md`, and deployment guides are future deliverables, not files claimed complete in Phase 0.

## Required external configuration

Keyless foundation needs no provider account. Photoreal 3D requires restricted Cesium ion or Google credentials; AISStream vessels and FIRMS detections require their keys; optional TomTom supplies observed flow; Mapillary requires its public client token; optional OpenSky OAuth/LL2 tokens affect allowances. AI requires an authorized provider key or the upstream experimental OAuth path. No credentials, paid services, license agreements, or metered calls were configured for this audit.

See the audit for provider-specific caveats, including noncommercial Nepal/cable datasets, opt-in camera agreements, proprietary demonstration-only content, and unavailable historical data.
