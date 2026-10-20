# Geospatial Intelligence Hub status

Updated October 20, 2026, America/New_York. **Phase 1 implementation is conditionally approved, but held before milestone 1: B's license is unclear and baseline results are unavailable. Phase 2 is not approved.**

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
- User approved the audit and explicitly resolved the seven design/scope questions below. Approval is not a new test result or an implementation authorization.
- User selected B (Arun Dass), conditional on its license/dependencies; directed a report on A if B is unclear/restrictive/heavy; approved Phase 1 with the exact six-file upstream allowlist, four ordered milestones, upstream diff checkpoint after milestone 1, and final acceptance stop.
- Completed the [component review and token contrast calculations](docs/custom/PHASE-1-COMPONENT-REVIEW.md). B has no explicit component grant in available public evidence; A is also license-unclear. Neither was adopted.
- Corrected the planned Refreshed tokens to teal `#2DD4BF` dark / `#0F766E` light; kept accent `#38BDF8`. Calculated text contrast is 9.49–10.32:1 on proposed dark surfaces and 5.23–5.47:1 on proposed light surfaces. This is a specification calculation, not a rendered UI test.
- No upstream files, dependencies, provider configuration, or product assets changed. Six documentation files now comprise project records; raw logs and preview captures remain ignored locally.

## Phase 0 acceptance

| Criterion | State | Evidence / remaining work |
| --- | --- | --- |
| App runs unmodified at localhost:4173 in keyless mode; doctor passes | Verified with stated limits | Doctor passes; loopback listener/HTTP verified; user reports rendered globe. Individual layer loading remains unverified |
| Existing suite result recorded | Recorded; browser coverage incomplete | Unit/allocation suite and build pass; browser tracking and other browser gates not run |
| Pin recorded; fork has upstream remote | Verified | `CUSTOMIZATION.md`, fork API identity, local remotes and fetched commit |
| Keyless layer loading vs key requirements recorded | Partial | Complete source/key inventory supplied; individual live layer outcomes not observed |
| Gap table delivered and approved | Approved by user | Explicit audit approval recorded in the next user message after the Phase 0 checkpoint |

## Verification still open

1. **Tracking/browser checks — unavailable:** STATUS contained no new baseline results; when asked, the user answered “I don't have it.” `npm run test:track` remains unverified. The earlier automatic localhost denial remains recorded; no workaround or new browser result is claimed.
2. **Individual layer check — unavailable:** no per-layer outcomes were supplied. Source availability is not proof of current loading. Preserve unknown/failure states rather than zeros.
3. **FPS baseline — unavailable, not waived:** the implementation-approval message still included bracketed alternatives rather than a clear waiver, and the user has no results. No explicit waiver or new measurement is recorded.
4. **Component license gate — held:** B's public license/source fields are empty; no explicit grant was located. A's fallback details were reviewed and are also license-unclear. Both declare only `lucide-react` beyond the planned React/Tailwind foundation; dependency weight alone does not resolve the missing permission.
5. **Milestones:** milestone 1 has not started; therefore there are no upstream implementation diffs to show. Preserve conditional approval, resolve the active gates, then work milestones 1–4 in order and stop for Phase 1 acceptance.

## User decisions accepted with the Phase 0 audit

| Question | Accepted decision | Applies to |
| --- | --- | --- |
| Browser credential exceptions | Provider-designated public client tokens, including Mapillary, and ephemeral AI session credentials are allowed; persistent secrets stay server-side | All phases; no credentials enabled by this decision |
| Mixed data labels | Per-value observation kinds, feed health separately | Phase 1 onward |
| Shared caches / no extra polling | One acquisition owner per source, passive read-only summaries; design in the Phase 2 plan | Phase 2, no provider redesign in Phase 1 |
| Satellites loaded | Separate globe-loaded and cached-catalog counts | Phase 2 |
| Bookmarked entity limits | Track aircraft/military/satellite only; vessel bookmarks are view-only | Phase 3 |
| Hosting | Unselected until Phase 4 | No deployment or wider bind authorized |
| Terms / use scope | Local personal use only; verify terms before any new source, recorder, or hosting | All phases; component/dependency licenses also checked before adoption |

## Future work (not implemented)

- **Phase 1:** approved six-file scope in the plan; B selected conditionally, currently stopped by missing license evidence and baseline. Sibling hub, shared tokens, handoff and feed/key presentation are unimplemented. No component was adopted, installed, or retrieved through a quota-based 21st action.
- **Phase 2:** canonical `content/sources.json`; searchable Knowledge Center/Data Sources/Case Studies; shared-cache dashboard with region filters, source/freshness/coverage, and honest unavailable states. Add upcoming-launch query; current upstream query is past-only.
- **Phase 3:** home region; named saved views/presets/entity links; self-contained workspace import/export including scenes/custom datasets and excluding secrets; persistence around the existing GeoJSON/KML/KMZ/GPX importer; global palette; AI setup content. Recorder/history and Ask Library are optional, separately reviewed work.
- **Phase 4:** desktop/mobile testing; measured performance comparison; complete dependency/data/media/security audit; choose hosting topology and document deployment. Desktop packaging remains optional.
- `branding.json`, `design/COMPONENTS.md`, shared token files, hub code, `content/`, `custom-data/`, `SETUP.md`, and deployment guides are future deliverables, not files claimed complete in Phase 0.

## Required external configuration

Keyless foundation needs no provider account. Photoreal 3D requires restricted Cesium ion or Google credentials; AISStream vessels and FIRMS detections require their keys; optional TomTom supplies observed flow; Mapillary requires its public client token; optional OpenSky OAuth/LL2 tokens affect allowances. AI requires an authorized provider key or the upstream experimental OAuth path. No credentials, paid services, license agreements, or metered calls were configured for this audit.

See the audit for provider-specific caveats, including noncommercial Nepal/cable datasets, opt-in camera agreements, proprietary demonstration-only content, and unavailable historical data.
