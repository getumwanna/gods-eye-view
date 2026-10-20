# Phase 1 file-level plan — foundation

Prepared October 19, 2026, America/New_York. **Planning only. Not authorization to implement, install dependencies, or retrieve component code.**

Baseline: upstream `de2138e84c1778fd98a48b7c9fd0b9788c318946`, documentation checkpoint `b5c24009fdb6feb7f82937e0b38710481c75eaa9`, local branch `hub/phase-0-audit`. Current upstream Vite lock is `6.4.3`; no runtime or dependency files were changed to prepare this plan.

## 1. Accepted decisions and remaining gate

The user reviewed and approved the Phase 0 audit and made these decisions:

| Topic | Accepted direction |
| --- | --- |
| Browser credentials | Provider-designated public client tokens, including Mapillary, and ephemeral AI session credentials are allowed. Persistent secrets stay server-side; provider restrictions remain required |
| Data labels | Per-value Live / Refreshed / Simulated / Estimated / Static, independently of feed health |
| Provider acquisition | One acquisition owner per source with passive read-only summaries; **design in the Phase 2 plan** |
| Satellites | Distinguish current globe-loaded count from cached-catalog count |
| Bookmarks | Aircraft, military aircraft, satellite follow links; vessels use view-only bookmarks |
| Hosting | Unselected until Phase 4; keep localhost-only |
| Use and terms | Local personal use only. Verify terms before new sources, recording, or hosting; verify selected component/dependency licenses before adoption |

The user will run `npm run test:track` and manual layer/FPS checks and paste results into `STATUS.md`, using `nvm use 24.22.0` or another supported runtime first. Those results are pending. The message's bracketed `[Or: FPS baseline waived.]` is not recorded as a waiver. This plan does not perform browser tests or replace missing evidence with estimates.

Before implementation: receive the user's visual shell selection and explicit Phase 1 implementation approval, and review the pending baseline results or an explicit waiver. **Choosing a visual option alone does not start implementation.**

## 2. Phase 1 outcome and boundaries

One local origin, `http://localhost:4173`, will serve the intact globe at `/` and a sibling hub at `/hub/`. The hub will have working navigation for Globe, Dashboard, Library, and Settings. Dashboard/Library bodies will state that their data/content arrives in Phase 2; they will contain no demo metrics, fake feed health, or pretend articles. Settings will expose the initial dark/light theme and current branding, with later workspace features clearly identified as future work.

Phase 1 delivers branding/shared tokens, selected and restyled shell components, hub-to-globe share handoff, a back-to-hub control, and an additive globe feed/status area with linked key guidance. It does not implement provider summaries, a new acquisition service, source-directory ingestion, Library search/articles/cases, home region, saved collections, imports/exports, a global command palette, a recorder, new data feeds, AI integration, hosting, or packaging.

The source-detail links needed by key badges will land on a small explanatory route inside the Library shell. That route identifies the provider and links to existing setup documentation/POWER UP. It explicitly says the full source record/directory is a Phase 2 feature; it is not a partial second database of licenses/prices/coverage.

## 3. Exact expected upstream edit allowlist: six files

“Upstream” here means a file present in the pinned original repository. These are proposed edits, not edits already made. **No other upstream file is expected to change.** If implementation shows that this list must grow, present the concrete amendment for approval before changing an additional upstream file.

| Upstream file | Exact planned responsibility | Preservation requirement |
| --- | --- | --- |
| `package.json` | Add hub-only React/React DOM, TypeScript/types, Tailwind and approved UI dependencies; add `typecheck:hub` and a bounded custom-hub browser-check command | Preserve existing scripts, package exports, engine range and upstream dependency versions; no general upgrade |
| `package-lock.json` | Lock those approved additions and necessary dependency resolution | Review diff for unrelated upgrades; keep the upstream Vite/Cesium stack at its current versions |
| `vite.config.js` | Wrap the existing standalone config using new `build/customHub.js`; add `/hub/index.html` as a second HTML build input and append the hub Tailwind integration | Preserve every named provider re-export, all original plugin objects in the same order, localhost/Host checks, CSP/headers and same server/provider instances |
| `src/main.js` | Import and call the additive custom bootstrap after `createStandaloneApplication()` and before `application.start()` | Preserve existing startup/error path and exported application; do not move globe into React |
| `style.css` | Add final imports for shared tokens and scoped custom globe CSS | Do not import Tailwind, shadcn resets or hub layout CSS into the globe stylesheet |
| `src/tooling/viteBuild.test.mjs` | Extend config regression coverage for two root HTML entries and the appended hub plugin, while testing the unchanged standalone plugin subsequence and single-entry panel configuration | Retain the existing Host/CSP/provider-order/named-export assertions. Do not skip plugins in test mode or merely remove failing assertions |

Why the root wrapper matters: `scripts/build-panel.mjs:24-29` imports `server/standalone/vite.config.js` directly; `build/panel.js:27-30` requires a single input with `inlineDynamicImports`. Changing shared `build/vite.js` to multiple inputs could break that MCP panel. The root wrapper keeps panel composition single-entry.

The existing config test imports the **root** config (`src/tooling/viteBuild.test.mjs:5`) and asserts fixed plugin indexes (`:90-113`). Appending Tailwind therefore needs an explicit, meaningful test update; it cannot be concealed while claiming a five-file change.

No changes are planned to `build/vite.js`, `server/standalone/vite.config.js`, provider routes/caches/key storage, `src/app/`, `src/data/lifecycle.js`, layer implementations, `src/ui/layerPanel.js`, upstream HTML templates, Director/share codecs, or upstream security/terms documents.

## 4. Planned new files

This is the concrete new-file budget. The selected 21st.dev shell will be adapted into the fixed `sidebar.tsx` owner rather than bringing its demo application, data, accounts or page routes into GEV. If its dependency/license review requires a different new-file set, document that adjustment before adoption; the six-file upstream allowlist remains fixed.

| New file | Purpose |
| --- | --- |
| `branding.json` | User-editable name, short name, local logo path, accent; no credentials |
| `public/custom/brand.svg` | Original, simple local brand mark; no copied demo/provider asset |
| `design/tokens.css` | Single namespaced color/type/spacing/radius/motion/data-kind token source, dark and light |
| `design/COMPONENTS.md` | Selected component URL, author, verified license, dependency versions, attribution and changes; no API keys/install URLs containing keys |
| `build/customHub.js` | Additive root-only multi-page/Tailwind config wrapper |
| `hub/index.html` | Sibling document, root mount, external module entry and viewport metadata |
| `hub/tsconfig.json` | Hub-only TypeScript and JSX/typecheck configuration |
| `hub/components.json` | Local shadcn aliases/style configuration for the hub only |
| `hub/src/main.tsx` | React mount plus shared branding/theme initialization |
| `hub/src/App.tsx` | Hash routes under `/hub/`; no extra server routing |
| `hub/src/components/HubShell.tsx` | Globe/Dashboard/Library/Settings navigation, header, accessible collapse behavior |
| `hub/src/components/ui/sidebar.tsx` | The single selected 21st.dev shell/navigation adaptation |
| `hub/src/components/ui/button.tsx` | Minimal reviewed shadcn button primitive |
| `hub/src/lib/utils.ts` | Hub-only class composition helper |
| `hub/src/pages/Dashboard.tsx` | Honest Phase 2 empty state and globe handoff; no live summaries yet |
| `hub/src/pages/Library.tsx` | Honest Phase 2 Library empty state and source-guide navigation |
| `hub/src/pages/SourceGuide.tsx` | Minimal provider/setup explanation keyed by stable source ID; no pretend complete directory |
| `hub/src/pages/Settings.tsx` | Initial shared theme control, read-only branding summary and clear later-feature states |
| `hub/src/styles.css` | Hub Tailwind utilities and scoped base rules; shared-token mapping |
| `src/custom/shared/branding.js` | Validate/read bundled public branding config; text/local-image handling |
| `src/custom/shared/theme.js` | Shared versioned browser preference for dark/light; no provider state |
| `src/custom/shared/layerMetadata.js` | Stable layer/provider references and per-value data kinds; no duplicate full source manifest |
| `src/custom/shared/shareHandoff.js` | Safe same-origin globe URL generation/validation; preserve complete existing v2 hashes |
| `src/custom/shared/keyAccess.js` | Abortable read of existing safe key-presence metadata; retain booleans/unknown only |
| `src/custom/globe/bootstrap.js` | Early brand/theme setup; ready-time custom mounting and teardown ownership |
| `src/custom/globe/branding.js` | Narrow DOM binding for document/title/loading logo and back-to-hub control |
| `src/custom/globe/feedStrip.js` | Passive active-layer presentation with separate data kinds, health, source/coverage and honest timestamp wording |
| `src/custom/globe/keyBadges.js` | Own “needs setup” area linked to source guide and existing POWER UP |
| `src/custom/globe/globe.css` | Scoped token aliases, custom strip/key controls and responsive placement |
| `src/custom/shared/branding.test.mjs` | Invalid config/color/path handling and safe text/default behavior |
| `src/custom/shared/shareHandoff.test.mjs` | Complete v2 state retention, invalid/external destinations, supported target modes |
| `src/custom/shared/keyAccess.test.mjs` | Presence/unknown projection, one request, aborts/failures, no credential values retained |
| `src/custom/globe/feedStrip.test.mjs` | Mixed kinds, partial/stale/fallback states, missing timestamps, no fabricated counts/provider fetches |
| `src/custom/globe/bootstrap.test.mjs` | Early branding/gaze ordering, embedded-mode skip, lifecycle cleanup during pending work |
| `scripts/qa-custom-hub.mjs` | Focused browser handoff/navigation/status/keyboard regression, run only with permitted browser access or by the user |
| `docs/custom/PHASE-1-VALIDATION.md` | Actual command/UI evidence after implementation; no prefilled passes |
| `SETUP.md` | Implemented Phase 1 install/run/branding/theme/update/check instructions and remaining limitations |

Existing project-owned documentation to update during implementation: `AGENTS.md`, `CUSTOMIZATION.md`, `STATUS.md`, and this plan's implementation/validation references. The Phase 0 audit remains a historical snapshot; decisions and new results belong in current status.

No listed product/config/test file is created by this planning turn. This turn creates only this plan and updates the three project-owned records above. Preview screenshots stay in ignored QA evidence.

## 5. Implementation design to approve

### Server, build, and stylesheet isolation

- Keep `/` as the existing globe. Use `/hub/#/dashboard`, `/hub/#/library`, `/hub/#/settings`, and `/hub/#/library/sources/<id>` for the sibling app. Hash routing avoids new provider/server fallback routes.
- Reuse the standalone config once at the root. The wrapper adds HTML inputs and appends the official Tailwind Vite integration after the untouched upstream plugin sequence. The direct standalone/panel build does not consume this wrapper.
- Use Vite's existing TSX transform with explicit React imports; do not add React Fast Refresh's inline preamble or weaken the current script CSP. Standard module updates/full reload are adequate initially.
- Tailwind processing and class scanning target the hub. Omit Preflight and include only the needed theme/utilities layers plus scoped hub base rules. No Tailwind import occurs in `style.css`, `src/main.js`'s globe graph, or the MCP panel graph. Validate built CSS, not just source import intent.
- Shared tokens use a dedicated namespace. The custom globe adapter maps them to upstream variables only on a custom-marked standalone document; merely importing the token declarations must not overwrite every consumer's CSS variables.
- Read-only registry metadata observed for planning: React/React DOM `19.3.1`, Tailwind Vite plugin `4.3.3`; that plugin declares Vite 6 compatibility. Lock compatible reviewed versions after approval/selection; do not upgrade upstream Vite `6.4.3` or Cesium to install the hub.

Official references: [Vite JSX support](https://vite.dev/guide/features.html#jsx), [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite), and [omitting Tailwind Preflight](https://tailwindcss.com/docs/preflight#disabling-preflight). These are architecture references, not commands executed to implement this plan.

### Branding and shared tokens

Proposed editable defaults: name **Geospatial Intelligence Hub**, short name **GEV Hub**, original local mark, sky-blue accent `#38BDF8`. Dark default: near-black background `#0B0F14`, panels `#121923`, restrained border `#243041`, primary text `#E5E7EB`. Use system sans-serif for UI and system monospace for timestamps/telemetry; no new font service.

| Value kind | Proposed dark text | Proposed light text | Required companion |
| --- | --- | --- | --- |
| Live | `#22C55E` | `#15803D` | Visible “Live” text |
| Refreshed | `#38BDF8` | `#0369A1` | Visible “Refreshed” text |
| Simulated | `#F59E0B` | `#92400E` | Visible “Simulated” text |
| Estimated | `#A78BFA` | `#6D28D9` | Visible “Estimated” text |
| Static | `#94A3B8` | `#475569` | Visible “Static” text |

These are proposed tokens, not a claimed contrast/accessibility pass. Check actual backgrounds, focus, typography and text contrast during implementation. Separate health words (e.g. STALE or UNAVAILABLE) remain visible even when the observation kind is Live. No UI glow/gradient/scan-line effects are added outside the globe's existing sensor styles.

Apply branding after standalone locale/translation initialization but **before** `application.start()`. Upstream scene startup initializes logo gaze (`src/app/scene.js:36`), whose asynchronous loader replaces marked logo contents (`src/logoGaze.js:61,112-146`). For the custom logo, update both title/loading wrappers and remove their gaze marker before that loader starts. Preserve the upstream gaze behavior when the default upstream logo is intentionally retained. Do not edit templates to solve this race.

### Passive feed strip and key guidance

- Mount custom UI only on the ordinary standalone globe. Skip embedded/inline MCP views using existing mode semantics; do not add hub chrome or setup requests to those views.
- Call the new bootstrap from `src/main.js`; use the existing application `subscribe/getComponents` lifecycle (`src/app/application.js:111-150`). At ready, use `components.data.dataManager`. Dispose owned DOM/listeners/observers/timers/requests when destruction starts or startup fails.
- Read `getAll()` and subscribe through `subscribeActivity()` (`src/data/lifecycle.js:2212-2231,2326-2338`). Reuse `layerFeedState()` over current stats; preserve transitional, partial, fallback, stale and unavailable states. Do not call `refreshLayerStats`, enable a layer, or fetch a feed to paint the strip. An age timer changes text only.
- Show active-layer name, per-value kinds, separate health, source, available coverage, and **Last updated** time/age. Use **Observed/captured at** only when an actual provider timestamp exists. Otherwise show “Update time unavailable” or “Coverage not reported here”; never fabricate a current date. Static datasets retain their known snapshot/capture dates.
- Omit counts in Phase 1. Existing normalization can turn absent counts into zero; real counts/metrics belong to Phase 2.
- Keep Phase 1 metadata small: stable layer/provider references, value-kind fields, and source-route references. Read runtime source/coverage fields where present. Phase 2 will enrich one `content/sources.json`; do not write a competing license/pricing/coverage manifest now.
- Render badges in the **new, owned setup area adjacent to the feed strip**. They label the affected locked layer/provider and work even if it is not active. Do not modify/redecorate every upstream sidebar row or create an observer over `LayerPanel`.
- Reuse `GET /api/setup/status` once per ordinary globe page with abort/no-store. Existing dev/loopback/security gates remain. It returns presence metadata, never values/suffixes (`server/standalone/key-setup.js:57-71,166-181,245-259`). Project immediately to recognized provider IDs and configured booleans; 403/404/network failure means **Unknown/setup unavailable**, not “missing.” Do not log/store/render the raw response or inject private environment variables.
- Configured presence proves neither credential validity nor provider health. Provider Settings being unavailable in built preview is expected; preserve the explanatory unknown/unavailable state there instead of weakening its development-only gate.
- `requiresKeyId` names a dependency; it does not prove missing configuration. Use affirmative missing-key evidence and current provider mode. Optional OpenSky OAuth/TomTom and keyless Street Level alternatives must not appear wholly locked. FIRMS/AIS required keys get explicit guidance.
- Existing POWER UP initialization is asynchronous and not awaited by application ready. Use a bounded readiness check for the real rendered setup controls; disable the custom action until ready, and abort/disconnect on teardown. Activate the existing `#key-setup-chip` action; do not add another credential form or claim provider-focus behavior that the existing API does not offer. Preserve the existing `?setup=1` re-entry.

### Share handoff

Use the existing `src/view/index.js` portable helpers for newly authored basic views. For an existing complete share URL, preserve its validated original v2 hash instead of reconstructing it through the narrower portable view model. The full snapshot includes provider switches, panels and shader options (`src/sharelink.js:544-603`); tests must cover these fields and a supported tracked target.

Phase 1 offers a plain “Open globe” action and a validated existing-share-link handoff. Source-guide links may generate a basic supported layer view. The back-to-hub control uses a fixed same-origin destination. Do not add named saved-view storage or promise instantaneous capture of private share-manager state; those are separate Phase 3 concerns. Do not include keys in links, accept arbitrary external navigation, or call private codec methods.

## 6. Visual 21st.dev shortlist — choose one shell

All three canonical catalog previews were viewed in the browser. The screenshots show **third-party catalog demo content**, including sample business figures, names and account controls; none is live GEV data or an implemented hub. Adoption removes those values/content. All options will use the same shared tokens and four project navigation items.

**Recommended: B**, for its neutral panels, restrained hierarchy and dark/light direction. Your selection remains open; no shell is adopted by this plan.

| Option | Canonical preview | Visual direction observed | Adaptation boundary |
| --- | --- | --- | --- |
| A | [Dashboard with Collapsible Sidebar — Sonu kumar](https://21st.dev/@uniquesonu/components/dashboard-with-collapsible-sidebar) | Blue-selected navigation, rounded cards, prominent card grid | Reuse collapse/navigation structure; replace palette, sample metrics, user/account/notification controls |
| B | [Dashboard Sidebar — Arun Dass](https://21st.dev/@arunjdass/components/dashboard-sidebar) | Charcoal panels, fine borders, compact hierarchy, dark/light presentation | Reduce multi-tier/workspace navigation to the four hub items; remove subscription/account affordances and demo content |
| C | [App Dashboard Layout — ShadcnStore](https://21st.dev/@shadcnstore/components/app-1) | Neutral sidebar, header, prominent four-card dashboard arrangement | Reuse shell/layout only; remove demo people/projects/metrics and account/team controls |

### A — Sonu kumar

![Option A: public catalog visual preview, sample content only](/Users/getumwanna/Documents/GEV/qa-artifacts/phase-1-shortlist/A-sonu-dashboard.png)

### B — Arun Dass — recommended

![Option B: public catalog visual preview, sample content only](/Users/getumwanna/Documents/GEV/qa-artifacts/phase-1-shortlist/B-arun-sidebar.png)

### C — ShadcnStore

![Option C: public catalog visual preview, sample content only](/Users/getumwanna/Documents/GEV/qa-artifacts/phase-1-shortlist/C-shadcnstore-layout.png)

These captures are ignored local QA evidence, not redistributed application assets. A fresh clone can use the canonical preview links; screenshots themselves are not committed. Licenses have **not yet been verified for adoption**. Visual selection is conditional on license/dependency review; do not assume a component inherits GEV's MIT license.

Retrieval boundary: no Copy/CLI/Remix/install action, registry API, API key or quota-consuming component tool was used. A public catalog response and automatically exposed page panels included embedded source; that incidental source was not used or copied into component files. No selected component implementation exists. After visual selection and explicit implementation approval, verify the selected license/dependencies, retrieve only that selected component through the authorized mechanism, and record provenance before integration. Do not fetch all three candidates.

The request's command-menu candidates are deferred to the Phase 3 global-palette plan. No menu component is needed or retrieved for this Phase 1 shell.

## 7. Small implementation milestones after approval

1. **Build and tokens:** review/lock only needed dependencies; add sibling entry and shared tokens; preserve root/panel builds and security headers. Review the exact six upstream diffs before moving on.
2. **Selected shell:** retrieve only the approved, licensed shell; add four working navigation entries, theme toggle and honest empty states; complete `design/COMPONENTS.md`.
3. **Globe hooks:** early brand/theme binding, fixed back link, passive feed strip and safe key-presence guidance; no provider polling/caches/source changes.
4. **Handoff and evidence:** full v2 preservation, user/browser verification, production and panel builds, current status/setup/ledger. Commit the working phase and stop for acceptance.

The Phase 2 plan will design acquisition ownership, passive summaries, browser-direct-source migration, completeness/coverage semantics, regional metrics and globe-loaded versus cached-catalog satellite counts. Do not start that service design or implementation in this phase.

## 8. Meaningful validation and acceptance

No runtime tests were rerun for this documentation-only planning turn. The earlier baseline remains historical evidence until the user's pending checks arrive.

After separately approved implementation:

```sh
npm run doctor
npm run typecheck:hub
node scripts/check-import-directions.mjs
node scripts/check-package-boundaries.mjs
GEV_REQUIRE_ALLOCATION_GATE=1 npm test
npm run build
npm run build:panel
npm run test:track
```

Run the new focused browser harness only with permitted access, or have the user run it. The earlier localhost browser denial must not be bypassed through another browser/CDP/driver. Proposed additional command: `npm run qa:hub`; exact harness usage belongs in its header and SETUP after implementation.

| Acceptance item | Required evidence |
| --- | --- |
| Upstream scope | Diff contains only the six allowlisted upstream files plus documented new/project-owned files; no source/provider/security drift |
| One origin / isolation | `/` and `/hub/` work in dev and built preview; no second Vite server; protected APIs/headers unchanged; hub/Tailwind code absent from globe/MCP entry graph |
| MCP preservation | Panel build remains single-entry and succeeds; no hub chrome/setup requests in embedded views |
| Branding/theme | Title/loading/logo and panels/chips use shared tokens; no gaze overwrite; dark/light survives navigation; provider credits/disclaimer remain readable |
| Selected component | User selection, verified license/provenance, token restyling and removed demo data recorded |
| Routes | Four nav items work; Dashboard/Library/advanced Settings states accurately identify future work; source/setup guide links resolve |
| Full share handoff | Supported camera/style/layer/provider/panel/shader/target state preserved; external/invalid URLs rejected; no secrets in URLs |
| Passive strip | No custom feed requests or enabling side effects; existing partial/stale/fallback states remain; no invented count/time/coverage; lifecycle cleanup verified |
| Needs-key guidance | Mandatory versus optional/multi-provider requirements distinguished; missing vs unknown separated; source guide and real POWER UP behavior checked after async readiness |
| Accessibility/layout | Keyboard/focus/collapse/links usable; labels do not depend on color; narrow viewport avoids overlap with existing globe controls; no claim of full Phase 4 device coverage |
| Regression/evidence | Doctor, typecheck, native units/allocation, boundaries, root/panel build, tracking and focused UI results recorded; pending/failing checks stay explicit |

Stop after this phase. The next plan requires its own approval; a functional shell does not authorize Phase 2.
