# Geospatial Intelligence Hub customization ledger

## Provenance

- Request: Geospatial Intelligence Hub, v2, October 19, 2026.
- Authorized scope: Phase 1 is accepted. The user approved Phase 2a with preimplementation rehearsal/adoption/post-pin gates, then approved isolated rehearsal execution with the frozen incoming target and six-file manual repair allowlist. This rehearsal worktree has merged `064d51f7` and completed non-browser checks; user-run QA at localhost:4174 and report/adoption review remain pending. Shipping HEAD/pin are unchanged. Phase 2a implementation, dependency installation, and Phase 2b planning have not started. The user requested a future measured comparison of server-side Library error diagnostics versus lazy hub Ajv before selecting a validation-role amendment.
- Upstream: https://github.com/bilawalsidhu/gods-eye-view
- User-owned fork: https://github.com/getumwanna/gods-eye-view
- Verified upstream pin: `de2138e84c1778fd98a48b7c9fd0b9788c318946`.
- Upstream commit subject: `Merge pull request #1233 from yaka0007/fix/tarktee-datex-catalog-hardening`.
- Manifest version at this pin: `0.2.1`. The commit, rather than a floating release name, is the baseline authority.
- Local checkout: `/Users/getumwanna/Documents/GEV`.
- Historical Phase 0 milestone branch: `hub/phase-0-audit`.
- Current Phase 1 branch: `codex/phase-1-foundation`.
- `origin`: `https://github.com/getumwanna/gods-eye-view.git`.
- `upstream`: `https://github.com/bilawalsidhu/gods-eye-view.git`.
- Initial checkout was shallow with blob filtering. Fetch additional history explicitly when an update/review requires it.
- GitHub API confirmed `fork: true` and parent `bilawalsidhu/gods-eye-view`; a fetch confirmed that the pinned commit is present in `origin/main`.

## Upstream files touched

Milestone 1 implementation is present. Exactly these six files from the pinned upstream repository are edited:

| Upstream file | Approved responsibility |
| --- | --- |
| `package.json` | Add pinned hub runtime/dev dependencies and hub validation commands; preserve existing stack versions. |
| `package-lock.json` | Lock approved additions; existing locked package versions remain unchanged. |
| `vite.config.js` | Wrap standalone configuration for the sibling hub entry while preserving security/provider setup. |
| `src/main.js` | Add the custom bootstrap hook without migrating the globe framework. |
| `style.css` | Import shared tokens and scoped custom-globe styles; isolate hub Tailwind/reset CSS. |
| `src/tooling/viteBuild.test.mjs` | Verify hub inputs and preserved standalone/panel configuration invariants. |

The concrete milestone 1 patch shown to the user is `docs/custom/PHASE-1-M1-UPSTREAM.patch`. Source pin remains `de2138e84c1778fd98a48b7c9fd0b9788c318946`. No additional upstream path is authorized. Validation is in `docs/custom/PHASE-1-VALIDATION.md`.

## Added files

| File | Reason |
| --- | --- |
| `CUSTOMIZATION.md` | Pin, fork/remotes, and upstream edit ledger |
| `docs/custom/PHASE-0-AUDIT.md` | Baseline, layer inventory, requirement gap table, conflicts, and recommended sequencing |
| `STATUS.md` | Verified state, outstanding verification, dependencies, and phase gates |
| `AGENTS.md` | Architecture, commands, evidence rules, and authorization boundaries |
| `docs/custom/PHASE-1-PLAN.md` | Exact proposed upstream/new-file scope, visual component shortlist, implementation and verification gates |
| `docs/custom/PHASE-1-COMPONENT-REVIEW.md` | B license/dependency gate, A fallback details, and independently computed Refreshed contrast evidence |

## Phase 1 source and validation records

Official shadcn/ui source is pinned at `ba1503c64472b82256d9de95e2e62c5901a38e8b`; its MIT notice must accompany copied code. Radix primitive imports are adapted to the four needed packages instead of the full `radix-ui` umbrella. `docs/custom/PHASE-1-COMPONENT-REVIEW.md` records the selection and dependency evidence. `docs/custom/PHASE-1-VALIDATION.md` records milestone checks; ignored logs remain under `.gev-logs/phase1-2026-10-20/`. Component attribution is recorded in `design/COMPONENTS.md`.

## Local installation artifacts

Node `24.22.0` was installed in the user's existing nvm installation; commands for this project used its explicit `bin` directory. No tracked runtime configuration was changed. `npm ci` installed the locked dependencies. Development/build/test artifacts remain ignored under `node_modules/`, `dist/`, and `.gev-logs/`.

Local evidence logs: `.gev-logs/phase0-2026-10-19/`. These are machine-local receipts, not committed project content. The durable baseline summary is in the audit. No `.env` was created and no provider credentials were configured.

Visual catalog captures for the Phase 1 shortlist are local review evidence in ignored `qa-artifacts/phase-1-shortlist/`, not adopted application assets or component code. Canonical source links are in the plan. A public catalog response automatically included embedded source; it was not used or copied into component files. No registry/API retrieval, install command, or quota-consuming component tool was used.

## Future customization rules

1. Phase 0 audit and Phase 1 implementation approval are recorded. The user explicitly waived missing Phase 0 baselines and selected official MIT shadcn/ui. Keep waivers distinct from passes; neither 21st candidate is adopted. All four approved milestones are complete and Phase 1 is accepted; stop before Phase 2 implementation.
2. Prefer new hub/custom modules over upstream edits. Record each eventual upstream edit here with its purpose and owning phase.
3. Preserve the standalone vanilla/Cesium globe. Add a separate React hub entry on the same local server; retain share links as the handoff contract.
4. Preserve upstream Host/origin checks, localhost binding, attribution, responsible-use restrictions, and provider request budgets.
5. Use the pinned source as acceptance evidence. Upstream updates require a separate reviewed rebase/update and new baseline; do not silently advance this pin.
6. Never commit credentials, raw logs, caches, generated builds, provider payloads, or unlicensed media.

See [the Phase 0 audit](docs/custom/PHASE-0-AUDIT.md) and [current status](STATUS.md).

### Phase 1 milestone 2

Implemented only new hub components/pages/router, official shadcn companions and MIT notice, the component provenance ledger, shared layer/source-guide metadata, and four router/render tests. Existing upstream paths remain the same six. Dashboard and Library explain Phase 2 availability; there are no fabricated feed metrics.

### Phase 1 milestone 3

New custom globe modules bind branding/theme before gaze initialization, install a back link and owned passive disclosures at application ready, read existing DataManager activity, and project one abortable same-origin setup-status read into presence/unknown only. No provider polling, cache owner, source implementation or credential form changed. Lifecycle tests cover destroy/failed/embedded cleanup. Scoped CSS positions desktop disclosures away from native rails and bounds narrow overlays; explicit dismissal preserves keyboard access.

### Phase 1 milestone 4

Added the user-run `scripts/qa-custom-hub.mjs` and `qa:hub` command, five full-state handoff regressions, and `SETUP.md`. The custom CSS imports precede the final Cyber stylesheet to retain upstream cascade policy. English-only custom chrome labels use the upstream explicit i18n opt-out convention; state strings are computed separately from DOM text assignment so the Material Symbols scanner does not mistake them for glyphs. Light globe title/dock text has readable backing/colors; the narrow title backing fits its logo and the left panel stack starts below the owned control row.

Only the six approved existing-upstream paths changed. Existing locked package versions remain unchanged. Phase 1 is ready for acceptance; no Phase 2 service, source manifest, acquisition/cache redesign, recorder, hosting or deployment was started.

### Phase 1 acceptance review — class helper correction

The user requested review/removal of `cn@0.5.0`. Its inclusion followed the pinned official shadcn helper, but no package-specific API is needed. `package.json` and `package-lock.json` now remove `cn`, promote the existing `clsx@2.1.1` to an exact direct dependency, and add exact `tailwind-merge@3.7.0`. Both are MIT. No unrelated locked package version changed or disappeared.

Custom edits: local helper in `hub/src/lib/utils.ts`, one meaningful regression in `src/custom/hub/router.test.mjs`, component provenance/review, this ledger, `STATUS.md`, and `PHASE-1-VALIDATION.md`. `npm ci`, hub typecheck, allocation-gated tests (8,261 passes, one platform skip), both builds, boundaries, and doctor passed. The existing six-file upstream intersection is unchanged. The user's `qa:hub` output is still required for Phase 1 acceptance.

### Phase 2a planning checkpoint — no implementation

At the user's request, `docs/custom/PHASE-2A-PLAN.md` separates the descriptive Library work from future 2b acquisition/dashboard work. It proposes exactly two original-upstream package-file edits for maintained Markdown/search/schema libraries, with all feature implementation in project-owned files. No Phase 2 dependency was installed and no content registry, article, case, source, endpoint, or dashboard implementation was created. `AGENTS.md` and `STATUS.md` now preserve the pending Phase 1 QA condition and the planning-only boundary.

A short isolated upstream-sync rehearsal is proposed after 2a ships and before 2b planning. Read-only upstream research does not change the current pin. No rehearsal branch, merge/rebase, or update adoption was performed. Phase 2b receives no implementation plan at this checkpoint.

### Phase 1 user QA receipt and bounded harness correction

The user supplied a 7/9 `qa:hub` result. It is preserved as failed in `PHASE-1-VALIDATION.md`, with the matching local assertion-only receipt timestamp. The positive share test could append its fixture to the rejected input retained by same-document dashboard navigation; the following globe check then lacks its prerequisite. Only custom QA files change: `scripts/qa-custom-hub.mjs`, new `scripts/qa-custom-hub-input.mjs`, and new `src/custom/hub/qaHarness.test.mjs`. Clear/replace/exact-value checking fixes test isolation, static checkpoint labels improve diagnostics, and blocked downstream checks remain failures. Syntax checks and 11 focused offline regressions pass; no browser rerun or product pass is claimed.

This checkpoint also updates `AGENTS.md`, `STATUS.md`, and the validation record. No original-upstream path, product behavior, dependency, provider, or Phase 2 plan/implementation changed. Acceptance awaits the user's fresh QA result.

### Phase 1 second user QA receipt — startup recovery

The user's second receipt reports 1/9. Confirmed a stale Vite optimized dependency returning HTTP 504 “Outdated Optimize Dep” after the dependency correction; HTML success did not mean the hub executed. Restarted only the verified localhost GEV dev process, without deleting caches or changing credentials/bind policy. All 36 hub modules now return 200; the permitted in-app path confirms Dashboard rendering and the existing synthetic all-off globe handoff, branding/disclosure/visible credits. This is not a user harness pass.

Custom QA edits: `scripts/qa-custom-hub.mjs`, new `scripts/qa-custom-hub-diagnostics.mjs`, and `src/custom/hub/qaHarness.test.mjs`. Readiness is now a prerequisite; failed local assets produce fixed diagnostic categories/counts, and zero exceptions cannot pass for an unrendered hub. Documentation updates: `SETUP.md`, `AGENTS.md`, `STATUS.md`, this ledger, and `PHASE-1-VALIDATION.md`. Syntax checks and 13 focused offline checks pass. No original-upstream file, dependency, provider acquisition, or Phase 2 implementation changed. Both failed user runs remain recorded; acceptance awaits a fresh passing user QA result.

### Phase 1 third user QA receipt — readiness selector correction

The third user run reports 0/9, blocked by the new readiness gate. Confirmed an agent-introduced mismatch: `main#main-content h1` cannot match the real `<main><div id="main-content">…` shell. Only custom QA files change: the main harness uses an exported predicate from `scripts/qa-custom-hub-diagnostics.mjs`; `src/custom/hub/router.test.mjs` tests that exact serialized predicate against real App markup with existing JSDOM and missing-control negative cases. Live permitted in-app DOM verification returns true for the correction and zero matches for the obsolete selector. Syntax checks and 14 focused offline checks pass.

Updated this ledger, `AGENTS.md`, `STATUS.md`, and `PHASE-1-VALIDATION.md`. No original-upstream file, product behavior, dependency, server setting, acquisition rule, or Phase 2 work changed. All failed user receipts remain preserved; acceptance awaits a fresh passing user-run gate.

### Phase 1 fourth user QA receipt — installed input API correction

The latest user result is 6/9 with hub startup and the first five UI checks passing. Confirmed the installed Puppeteer mouse API uses `count`, while the helper's `clickCount` produced one click. Changed only that option to `{ count: 3 }`, retained exact-value/security/full-URL assertions, and added accurate negative-share checkpoints. Replaced the test stub's assumed click semantics with actual installed Puppeteer mouse handling and an in-memory transport. The strengthened test fails before the fix and the 14-test focused group passes after it; syntax checks pass. No browser/remote-debugging connection was opened by that test.

Code edits are confined to `scripts/qa-custom-hub-input.mjs`, `scripts/qa-custom-hub.mjs`, and `src/custom/hub/qaHarness.test.mjs`. Updated this ledger, `AGENTS.md`, `STATUS.md`, and `PHASE-1-VALIDATION.md`. No original-upstream file, product behavior, dependency, provider configuration, or Phase 2 work changed. All user failures remain preserved; acceptance awaits a fresh passing receipt.

### Phase 1 fifth user QA receipt — controls uncovered and credit content

The user reports 8/9, with only setup guidance timing out. Confirmed via the permitted in-app path that mounted controls were still under the real full-screen loading cover; initial open status text allowed passive checks to pass while clicks were intercepted. The custom harness now waits for cover release and confirms status closes before Setup. Live verification of the remaining credit condition also exposed a false parent-box assumption: Cesium's absolutely positioned child can paint credits from a zero-size outer anchor. The harness now checks actual logo/attribution/inline content visibility and hit reachability. No product timing, CSS, credits, or provider behavior changed.

Code changes are confined to `scripts/qa-custom-hub.mjs`, `scripts/qa-custom-hub-diagnostics.mjs`, and `src/custom/hub/qaHarness.test.mjs`; project records are updated. Actual startup/CSS and credit-geometry regressions join the focused group: 16 pass, syntax checks pass. Exact predicates plus status close, setup open/guide, visible credits, and back navigation pass in the permitted browser. CLI acceptance still awaits the user's passing receipt; all five failed results remain preserved. No original-upstream path, dependency, credential, or Phase 2 implementation changed.

### Phase 1 accepted — final user-run QA receipt

On October 20, 2026, the user reported all nine `qa:hub` checks passing and explicitly requested Phase 1 acceptance. The matching assertion-only receipt is `.gev-logs/qa-custom-hub-2026-10-20T16-48-33-898Z.json`, timestamp `2026-10-20T16:48:33.899Z`; all nine assertions and overall `passed` are true. `PHASE-1-VALIDATION.md` records the result and scope. The dependency review and browser acceptance conditions are resolved. Historical failed receipts and waived Phase 0 gaps remain preserved.

This documentation checkpoint updates the validation record, `STATUS.md`, `AGENTS.md`, this ledger, and the stale Phase 1 prerequisite in `PHASE-2A-PLAN.md`. No application code, dependency, original-upstream file, or runtime configuration changes. Phase 2a remains planning only; no implementation, content/dependency installation, Phase 2b planning, or upstream-sync rehearsal execution is authorized. No new tests or browser runs are needed for this documentation-only acceptance record.

### Phase 2a conditional approval and upstream-sync sequencing

The user approved the two-file Phase 2a original-upstream allowlist and six-package proposal, with exact versions pending milestone 1 review. This supersedes the earlier planning-only status and the proposal to rehearse upstream sync after 2a. The rehearsal must now precede 2a implementation, because upstream changes affect source/key/coverage facts and admitted documentation.

This documentation checkpoint adds `docs/custom/UPSTREAM-SYNC-PLAN.md` and updates `docs/custom/PHASE-2A-PLAN.md`, `AGENTS.md`, `STATUS.md`, and this ledger. The execution plan freezes a candidate target, isolates incoming upstream changes and bounded manual repairs, and requires a report/adoption stop before any shipping pin change. No branch/worktree, fetch, merge, dependency installation, or implementation was performed; target verification used read-only remote inspection.

The Phase 2a plan now requires strict `check:library`/production failures and Library-only development errors, with no dev-server/globe interruption. Two technical amendments are explicitly reserved for post-pin review before milestone 1: a validated generated metadata projection path and moving Ajv from development-only to lazy Library-only runtime use. The approved 62-path implementation inventory is not silently expanded. Milestones 2 and 3 stop for a list of new articles/case pages and user editorial review before committing; both Spatial Intelligence summaries must be compared with their originals by the user. Phase 2b remains deferred until 2a ships and is accepted.

### Approved isolated upstream-sync rehearsal — adoption pending

On October 20 the user approved `docs/custom/UPSTREAM-SYNC-PLAN.md` as written, including incoming frozen upstream files and the six-file manual repair allowlist. Created and attached the managed worktree `/Users/getumwanna/.codex/worktrees/upstream-sync-rehearsal/GEV`, branch `codex/upstream-sync-rehearsal`, from shipping `7595ca34884e4f6a8159077b3d44a84e38ce0950`; fetched/merged exactly `064d51f7be2675f1c69e16068e9c49d1a60144d1`. No conflicts. Isolated merge checkpoint `4477dd2154b216a2daf73cc696febb48b0e2f313`; authoritative pin above remains unchanged. Incoming inventory is 151 paths. The earlier 72-commit comparison count was incorrect: Git reports 1,662 newly reachable commits, 626 merge commits, and six first-parent steps; the old pin is an ancestor.

Only manual original-upstream repair: formatting `src/tooling/viteBuild.test.mjs` within the approved six-file allowlist. Nine existing project-owned formatting repairs: `src/custom/globe/bootstrap.js`, `src/custom/globe/branding.js`, `src/custom/globe/feedStrip.js`, `src/custom/globe/keyBadges.js`, `src/custom/shared/branding.js`, `src/custom/shared/keyAccess.js`, `src/custom/shared/layerMetadata.js`, `src/custom/shared/shareHandoff.js`, and `src/custom/shared/theme.js`. All exactly match the repository formatter; no functional compatibility repairs. `package.json` receives only incoming removal of `qa:panel-resize`; Phase 1 dependencies and lockfile are preserved. Every repair and its reason, plus all five documentation updates (`AGENTS.md`, `STATUS.md`, this ledger, Phase 2a plan, and new rehearsal report), is recorded in `docs/custom/UPSTREAM-SYNC-REHEARSAL.md`.

The report records source/key/coverage changes, provider terms/setup changes, full validation outcomes and gaps. Non-browser checks pass. The direct localhost:4174 server has no configured credentials/dotenv; new Hong Kong/Taiwan packs and all live camera-pack acquisition are disabled by launch flags. Port 4173 and shipping checkout remain unchanged. User-run `qa:hub`/synthetic `test:track` results remain pending. Adoption requires separate review/decision; no shipping merge or pin advance is authorized. The user-requested post-pin Ajv comparison includes server-side error-only diagnostics versus hub lazy loading, measured bundle costs, isolation/HMR/lifecycle tradeoffs, and exact file/allowlist implications. No Phase 2a code/content/dependency or generated projection was introduced.

### Rehearsal user startup failure and bounded repair

The user reported `qa:hub` 0/9 blocked by `outdated-optimized-dependency` and `test:track` timing out before synthetic assertions. Receipt origin `http://localhost:4174` / timestamp `2026-10-20T18:28:37.125Z` and the pasted tracking outcome are preserved in the rehearsal report. The server cache had no finalized metadata. Several unit fixtures and the live server shared default `.vite`; the earlier suite had run after server startup. Vite config-hash invalidation and timings support cache collision as the high-confidence trigger, without claiming a browser causal trace.

Recovery code checkpoint `f5bda47c749267f2698856f0605a0550eaf165c0`: existing project-owned `build/customHub.js` isolates the root dev cache, preserves explicit production cache/optimizer settings, and predeclares both generated JSX runtimes. `src/tooling/viteBuild.test.mjs` is the sole original-upstream manual path, still within the six-file allowlist; it adds a regression that failed before the repair. Existing project-owned `src/custom/globe/feedStrip.js` and `src/custom/globe/keyBadges.js` move existing intentional-English annotations to the formatted RHS after a full rerun exposed lost scanner coverage. No UI text/translation catalog change. This is the complete additional code repair list; all initial formatting and five planning-document paths remain enumerated in the report.

Final recovery validation: 8,169 test passes, one native Windows skip, zero failures; typecheck, boundaries, formatting, doctor, root/panel builds pass. Preserved incomplete cache and failed logs; pre-bundled after checks; restarted only port 4174 with the same keyless/no-new-source flags. Two HTTP passes returned HTTP 200 for 54 document, module, and optimized-asset checks with stable finalized metadata; this is not rendered-browser verification. Fresh user browser/tracking results remain pending. Shipping checkout/pin/4173 untouched; no Phase 2a implementation or dependency changes. The report and agent/status/Phase 2a plan updates record this checkpoint without adoption approval.

Diagnostic-only follow-up `a697eeaac39c8eb8d18c9583e08e8f48ad32579c` repairs two more existing project-owned files outside the six-file upstream list: `scripts/qa-custom-hub-diagnostics.mjs` explicitly recognizes the dedicated optimizer URL path, and `src/custom/hub/qaHarness.test.mjs` checks classification/redaction there. The new case fails before repair; all six focused offline tests pass afterward, as does formatting. No browser/Vite fixture server or production build was started after the rehearsal restart. Full-suite/build results above precede this harness-only follow-up; no served app graph/config change. All 13 manual code repair paths (one allowlisted original-upstream, twelve project-owned) and five planning-document paths are enumerated in the report. Fresh browser results remain pending.
