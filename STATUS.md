# Geospatial Intelligence Hub status

Updated October 20, 2026, America/New_York. **Rehearsal startup recovery:** initial user `qa:hub` failed 0/9 on outdated optimized dependencies; tracking timed out before assertions. Cache-isolation repair `f5bda47c` passes 8,169 tests (one Windows skip), both builds, typecheck/boundaries/formatting/doctor and 54 HTTP asset checks. Port 4174 restarted with finalized dedicated cache; fresh user results pending. Shipping HEAD/pin and port 4173 are unchanged. Adoption and Phase 2a implementation remain gated; Phase 2b planning deferred.

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
- Earlier, the user conditionally selected B (Arun Dass); the public component-license review could not establish permission, so B/A adoption was held. This historical hold is superseded by the explicit official shadcn/ui choice; neither 21st component was adopted.
- Completed the [component review and token contrast calculations](docs/custom/PHASE-1-COMPONENT-REVIEW.md). B has no explicit component grant in available public evidence; A is also license-unclear. Neither was adopted.
- Corrected the planned Refreshed tokens to teal `#2DD4BF` dark / `#0F766E` light; kept accent `#38BDF8`. Calculated text contrast is 9.49–10.32:1 on proposed dark surfaces and 5.23–5.47:1 on proposed light surfaces. This is a specification calculation, not a rendered UI test.
- The user subsequently approved official MIT shadcn/ui and explicitly waived all missing Phase 0 baseline checks. Milestone 1 now changes only the six approved upstream files, adds the isolated hub foundation, and passes the checks recorded in [Phase 1 validation](docs/custom/PHASE-1-VALIDATION.md). Existing locked package versions remain unchanged; approved hub dependencies were added.

## Phase 0 acceptance

| Criterion | State | Evidence / remaining work |
| --- | --- | --- |
| App runs unmodified at localhost:4173 in keyless mode; doctor passes | Verified with stated limits | Doctor passes; loopback listener/HTTP verified; user reports rendered globe. Individual layer loading remains unverified and was explicitly waived as a Phase 0 baseline requirement |
| Existing suite result recorded | Recorded; browser coverage incomplete | Unit/allocation suite and build pass; missing Phase 0 browser gates were explicitly waived, not passed |
| Pin recorded; fork has upstream remote | Verified | `CUSTOMIZATION.md`, fork API identity, local remotes and fetched commit |
| Keyless layer loading vs key requirements recorded | Source inventory complete; missing runtime baseline waived | Complete source/key inventory supplied; individual live layer outcomes not observed; user explicitly waived the missing Phase 0 baseline |
| Gap table delivered and approved | Approved by user | Explicit audit approval recorded in the next user message after the Phase 0 checkpoint |

## Verification state and current work

1. **Historical Phase 0 baselines — explicitly waived, not passed:** browser/tracking checks, individual live-layer outcomes, GPU/FPS measurements, and all other missing Phase 0 baseline checks remain unverified. The earlier user answer “I don't have it” was followed by an explicit waiver. Historical unit/build/doctor receipts remain unchanged.
2. **Component choice — resolved:** official MIT shadcn/ui Radix sidebar approved; B/A public-license findings remain historical. No 21st component was adopted.
3. **Milestone 1 — implemented and checked:** six upstream path diffs shown to the user in `docs/custom/PHASE-1-M1-UPSTREAM.patch`. Config tests: 8 passed; foundation tests: 3 passed; contrast calculation test: 1 passed; typecheck, package/import boundaries, doctor, root build, and panel build passed. See the validation record for exact receipts and limits.
4. **Phase 1 acceptance — accepted:** the user reports **9/9 `qa:hub` checks passed** and explicitly approved acceptance. Matching receipt: `.gev-logs/qa-custom-hub-2026-10-20T16-48-33-898Z.json`, timestamp `2026-10-20T16:48:33.899Z`, overall `passed: true`. Dependency review and browser acceptance conditions are resolved. All five earlier failures and corrections remain in `docs/custom/PHASE-1-VALIDATION.md`; the agent did not execute the CLI browser harness.
5. **Phase gates:** Isolated rehearsal execution/repairs are approved. Initial user browser/tracking results failed at startup and are preserved in the report. Recovery non-browser checks pass; await fresh user runs at localhost:4174, report review, and a separate adoption decision. Only afterward reverify the Phase 2a plan against the decided pin and present any file/dependency-role changes before milestone 1. Milestones 2/3 still stop for user editorial review before committing. Phase 2b planning waits until 2a ships and is accepted.

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

- **Phase 2a — approved with conditions; implementation not started:** await rehearsal user-run results and report/adoption review, then reverify layer IDs, key IDs, coverage/source facts, admitted doc sections, exact files, and dependencies. Compare server-side dev validation sending only errors to Library against lazy hub Ajv with measured bundle cost; no role amendment selected yet. Invalid content must fail checks/both production builds while only Library shows errors in dev. Milestone 2/3 article/case review precedes commits.
- **Phase 2b — plan later, after 2a ships and is accepted:** acquisition ownership, passive read-only summaries, browser-direct adapters, upcoming-launch query, and dashboard. The upstream-sync rehearsal has moved ahead of Phase 2a; execution and adoption remain separate approvals.
- **Phase 3:** home region; named saved views/presets/entity links; self-contained workspace import/export including scenes/custom datasets and excluding secrets; persistence around the existing GeoJSON/KML/KMZ/GPX importer; global palette; AI setup content. Recorder/history and Ask Library are optional, separately reviewed work.
- **Phase 4:** desktop/mobile testing; measured performance comparison; complete dependency/data/media/security audit; choose hosting topology and document deployment. Desktop packaging remains optional.
- `branding.json`, `design/COMPONENTS.md`, shared token files, hub code, `content/`, `custom-data/`, `SETUP.md`, and deployment guides are future deliverables, not files claimed complete in Phase 0.

## Required external configuration

Keyless foundation needs no provider account. Photoreal 3D requires restricted Cesium ion or Google credentials; AISStream vessels and FIRMS detections require their keys; optional TomTom supplies observed flow; Mapillary requires its public client token; optional OpenSky OAuth/LL2 tokens affect allowances. AI requires an authorized provider key or the upstream experimental OAuth path. No credentials, paid services, license agreements, or metered calls were configured for this audit.

See the audit for provider-specific caveats, including noncommercial Nepal/cable datasets, opt-in camera agreements, proprietary demonstration-only content, and unavailable historical data.

## Isolated upstream-sync rehearsal checkpoint

Rehearsal code checkpoint: `4477dd2154b216a2daf73cc696febb48b0e2f313`. Server working directory: `/Users/getumwanna/.codex/worktrees/upstream-sync-rehearsal/GEV`. User commands are in the report. `npm ci`, doctor, typecheck, package/import boundaries, full allocation-gated suite (8,168 passed, one Windows skip), final formatting (1,449 files), post-format config/globe checks (20 passed), and both builds pass. Nine project-owned formatting repairs and the allowlisted config-test formatting repair are individually listed in the report, alongside all planning-document updates. New Hong Kong/Taiwan camera packs and all live CCTV pack acquisition are disabled on this bounded rehearsal server. No new credentials/provider activation or Phase 2a content/dependencies.

### Rehearsal user failure and startup recovery

See `docs/custom/UPSTREAM-SYNC-REHEARSAL.md` for the failed assertion-only receipt (`2026-10-20T18:28:37.125Z`, origin 4174), tracking startup timeout, cache-collision evidence, every follow-up repair, and retained intermediate localization-check failure. Recovery changes the existing custom wrapper plus the allowlisted config test, and relocates existing opt-out comments in two existing custom files. All checks completed before pre-bundling/restarting port 4174; user browser reruns are still required. No harness assertions were weakened, no new source/key enabled, and no Phase 2a dependency or feature introduced.

QA diagnostic follow-up `a697eeaa` recognizes the dedicated cache path and passes six focused offline regression checks. This harness-only change follows the full suite/build results; it starts no browser or Vite fixture server. Both custom paths are listed in the rehearsal report. Fresh user runs remain pending.
