# Geospatial Intelligence Hub customization ledger

## Provenance

- Request: Geospatial Intelligence Hub, v2, October 19, 2026.
- Authorized scope: Phase 1 accepted; upstream integration and post-pin review complete. User approves the 63-path generated projection and dev-only lazy Ajv role plus pin facts/admissions/case/article requirements. Phase 2a implementation milestone 1 onward is approved only after normal-HMR tracking passes on 4173; diagnose any failure first. Two-file upstream allowlist and editorial gates remain; Phase 2b deferred. No keys configured.
- Upstream: https://github.com/bilawalsidhu/gods-eye-view
- User-owned fork: https://github.com/getumwanna/gods-eye-view
- Verified upstream pin: `064d51f7be2675f1c69e16068e9c49d1a60144d1` (approved shipping integration; original Phase 0 pin retained in historical checkpoints).
- Upstream commit subject: `Merge pull request #1237 from 419vive/feat/taiwan-freeway-cctv-pack`.
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

### Passing rehearsal reruns and conditional adoption — integration not executed

The user reports `qa:hub` 9/9 and synthetic `test:track --offline-imagery` 109 passed / 0 failed / 0 skipped at localhost:4174. The hub result matches the assertion-only receipt timestamp `2026-10-20T18:43:33.488Z`; tracking is user-reported without a local receipt. `docs/custom/UPSTREAM-SYNC-REHEARSAL.md` records both while preserving earlier failures. Adoption is approved with Hong Kong/Taiwan kept off until separate terms/activation approval, Ontario's keyless loss accepted without configuring a key, and all cache/format/annotation/diagnostic repairs retained.

This documentation checkpoint adds `docs/custom/UPSTREAM-INTEGRATION-PLAN.md` and updates `SETUP.md`, the rehearsal report, Phase 2a plan, `AGENTS.md`, `STATUS.md`, and this ledger. It proposes a separate integration worktree and shipping fast-forward to the frozen upstream target with custom policy/repairs; execution still awaits approval. The proposed persistent policy/check uses only project-owned files and the actual catalog with mocked acquisition, including startup/restart and hostile-switch cases; no policy code has been created. `SETUP.md` adds ten ordered provider-key entries, with current official terms/cost/restriction references, public-token/server-secret distinctions, Ontario/hidden-Google POWER UP limitations, and budget-alert versus hard-limit distinctions. No account/key was created, requested, configured, read, or handled.

Shipping remains at `7595ca34884e4f6a8159077b3d44a84e38ce0950`, pin `de2138e84c1778fd98a48b7c9fd0b9788c318946`; servers and logs remain intact. After approved integration is verified, stop the rehearsal listener and retain ignored evidence, then produce Phase 2a reverification including both Ajv options with measured bundle cost. No Phase 2a implementation or dependency/file-role amendment is introduced here.


### Approved shipping integration candidate — verification pending

The integration worktree `/Users/getumwanna/.codex/worktrees/upstream-integration/GEV` (`codex/upstream-integration`) starts at reviewed rehearsal checkpoint `1a4261a2dc42698bbfa6be3dba63d853185e30b2`, preserving the frozen upstream target `064d51f7be2675f1c69e16068e9c49d1a60144d1` and all accepted rehearsal repairs. Shipping fast-forward is pending at this candidate checkpoint.

Exact new files: `build/customProviderPolicy.js`, `scripts/check-custom-provider-policy.mjs`, `src/custom/server/providerPolicy.test.mjs`. Existing project-owned edit: `build/customHub.js`, plus `SETUP.md`, `AGENTS.md`, this ledger, `STATUS.md`, `docs/custom/UPSTREAM-SYNC-REHEARSAL.md`, and `docs/custom/PHASE-2A-PLAN.md`. No additional original-upstream path, dependency, or top-level Vite plugin changed. Both reviewed upstream contract files are hashed, not edited. Policy forces only HK/Taiwan off, including hostile shell/dotenv values across root launches; future contract drift blocks startup for review.

Candidate evidence: `npm ci` passed; provider CLI six scenarios passed; six policy unit tests passed; combined configuration/QA-harness/policy group 21 passed, zero failed/skipped. Logs: `.gev-logs/shipping-integration.ZEjuM7/`. All acquisition in these checks was mocked, with zero HK/Taiwan requests/rows and one Austin control row per scenario. Full checks in the actual shipping checkout and user browser/manual checks remain pending. The two requested key-guide notes are included; no key was requested or configured.


### Shipping integration installed — user verification pending

Shipping `codex/phase-1-foundation` fast-forwarded cleanly from `7595ca34884e4f6a8159077b3d44a84e38ce0950` to code checkpoint `fd136b60ce9421bd8636692232766a5f7d2226e3`; target `064d51f7be2675f1c69e16068e9c49d1a60144d1` is an ancestor. The integration worktree and rehearsal worktree remain intact. The approved execution plan is preserved as the approval artifact; this newer checkpoint supersedes its pre-approval status wording. No extra source repair or dependency was needed.

Actual shipping checks under Node 24.22.0/npm 11.19.1: `npm ci` (zero vulnerabilities), six-scenario policy CLI, doctor before/after builds, hub typecheck, allocation-gated unit suite **8,176 passed / 0 failed / 1 platform skip**, import/package boundaries, formatting (1,449 scoped source files), and root/panel builds all passed. Explicit Prettier checks also passed for the four integration code files. Existing large-chunk build warnings remain. Logs: `/Users/getumwanna/Documents/GEV/.gev-logs/shipping-integration-2026-10-20/`; candidate logs remain in the integration worktree.

After all checks, dependencies were pre-bundled and shipping restarted through the root config, without temporary HK/Taiwan shell overrides or Keychain loading. Credential presence inspection found zero configured environment/dotenv providers; no values were logged. Listener PID 56935 is `[::1]:4173`; startup acknowledges both camera packs OFF and verified contracts. Two HTTP-only passes returned 200 for 74 document/module/optimized-asset requests with stable finalized dedicated optimizer metadata (23 dependencies/10 chunks). These are not rendered-browser passes. User shipping hub/tracking/Street Level results are pending; 4174 PID 55130 stays up until those resolve. Phase 2a reverification/Ajv comparison follows verification and precedes milestone 1; no Library implementation or dependency change occurred.


### Shipping user receipt and operational tracking recovery

The fresh shipping hub result is9/9 with matching `2026-10-20T19:28:09.203Z` receipt; user reports all Street Level smoke checks passed. Attached tracking output has88 successful assertions then a destroyed execution context at harness 3231; its completion summary is missing. The report preserves this incomplete result separately from the rehearsal 109/0/0. The preserved shipping dev log records source reloads while sampled file hashes/mtimes remain unchanged; external metadata trigger remains unconfirmed.

Only runtime launch behavior changed: root Vite `createServer({server:{host:'localhost',port:4173,strictPort:true,hmr:false}})` suppresses reloads for the bounded tracking rerun. Provider/security configuration, persistent camera policy, dedicated optimizer cache, source files and harness assertions are unchanged; no plugin, dependency or key configured. New shipping PID 65423 is loopback-only and 74 HTTP-only checks pass with stable metadata. Rehearsal 4174 remains running. Documentation checkpoint edits are confined to this ledger, `AGENTS.md`, `STATUS.md`, `docs/custom/UPSTREAM-SYNC-REHEARSAL.md`, and `docs/custom/PHASE-2A-PLAN.md`, all project-owned approved integration records. Logs/attachment remain ignored under `.gev-logs/shipping-integration-2026-10-20/`. No new original-upstream repair or Phase 2a implementation occurred. Post-pin/Ajv review still waits for completed shipping tracking.

### Verified integration and post-pin review — documentation only

The final shipping tracking 109/0/0 is recorded as a direct user report (no fabricated transcript). Hub9/9 matches the shipping receipt and manual smoke is user-reported passed. Only verified rehearsal listener PID 55130 on 4174 was stopped; 94 logs / 59,428,182 bytes and its worktree remain, with a SHA-256 retention inventory. Shipping 4173 continues its bounded HMR-off launch until authoring resumes.

Added planning document `docs/custom/PHASE-2A-REVERIFICATION.md`; updated only `docs/custom/PHASE-2A-PLAN.md`, `docs/custom/UPSTREAM-SYNC-REHEARSAL.md`, `AGENTS.md`, `STATUS.md`, and this ledger. The review identifies exact identities/source facts, 25 bounded doc admissions with hashes, nine article/six case editorial requirements and two pending amendments. Recommended dev-only lazy Ajv 8.20.0 stays a devDependency and measured production tree-shakes to zero Ajv bytes; together with the proposed generated projection it preserves the two-file upstream allowlist and yields 63 planned implementation paths. Server-side option(a) would need its own additional plugin/test-file amendment. None is implemented here.

Only isolated ignored Ajv measurement fixtures were installed (scripts disabled, own manifest/lock/cache); project package.json/package-lock.json/node_modules were unchanged. Root source/doc hashes and all 25 range hashes were rechecked; no redundant native suites were added or rerun. No source/provider/acquisition/content/hosting/recording implementation or key handling occurred. Review evidence is under `.gev-logs/post-pin-review/`; actual browser/HMR/corpus performance for future Library remains unverified and is an implementation gate.

### Normal-HMR restoration and conditional Phase 2a authorization

User approved all three reverification decisions, with a new hard prerequisite: restore normal HMR and pass `test:track` on 4173 before milestone 1. The 88-pass interrupted run remains classified as a probable development reload interruption, not a demonstrated tracking product/assertion failure; exact source-event writer and browser navigation timing are unknown. HMR-off was an operational workaround, not a code repair. Its reported 109/0/0 is retained without claiming normal-mode reliability.

Only the verified temporary HMR-off shipping listener was stopped. Restart uses standard root `HOST=localhost PORT=4173 npm run dev -- --strictPort`, preserving provider policy, security, dedicated cache and current product code. New evidence: `.gev-logs/normal-hmr-2026-10-20.3KpYkt/`; all prior logs and the stopped 4174 worktree remain. No product, harness, dependency, content or schema file changed for restoration. Documentation updates are confined to existing AGENTS/STATUS/ledger/Phase 2a plan/reverification/rehearsal records. After normal tracking passes, milestone 1 onward is authorized, with milestone 2/3 pre-commit editorial stops. On HMR containment failure, stop/report rather than weakening the gate.


Normal-mode restoration verified: standard root CLI PID 78207 on loopback 4173, resolved HMR true, provider policy unchanged, 76 HTTP-only 200 checks with stable metadata, 4174 closed. Evidence lives in `.gev-logs/normal-hmr-2026-10-20.3KpYkt/`. No source/harness/dependency/content change. The normal-mode user tracking prerequisite remains pending; documentation-only verification does not activate milestone 1.


### Phase 2a milestone 1 — implementation, browser verification pending

The user supplied the complete normal-HMR tracking transcript: 109 passed, zero failed/skipped, matching retained tee log and with no reload in the completed server run. This activated the already explicit M1-onward authorization. The 63-path inventory and exactly two original-upstream package files govern this work; no M2/M3 editorial approval is inferred.

Original-upstream edits: `package.json` adds the six reviewed exact dependencies (Ajv dev-only), `check:library` and preflight validation for both builds; `package-lock.json` records that graph with all existing locked versions preserved. No other original-upstream file is modified. Exact separate patches are `.gev-logs/phase2a-m1/package.json.patch` and `package-lock.json.patch`. License/script/audit/bundle review is `docs/custom/PHASE-2A-DEPENDENCIES.md`, including the newly reported pre-existing Vite Windows/WSL editor advisories; no unrelated stack upgrade is performed.

Project-owned changes implement strict Node schemas/references/hash/filesystem validation, canonical sources/products/value bindings, deterministic validated metadata projection and passive globe adapter, lazy Library directory and compatible 38 source guides. DEV-only lazy Ajv and raw imports use a self-accepting Library catalog; root build integration is a build-only Rollup hook plus the existing optimizer inclusion, with no additional top-level Vite plugin or upstream gate edit. The approved test adapter is pure, receiving Node filesystem helpers from exempt test callers. No editable content/compiler/hub dependency enters the globe graph. M1 has no articles/cases.

Native gates pass: clean install, check, typecheck, 8,235 unit/allocation passes/zero failures/one platform skip, boundaries, doctor, formatting and both builds. Twenty-four invalid-input command checks fail before either builder. The first native attempt's adapter formatting failures were repaired; a separate upstream terrain test read a pre-existing runtime cache point, so its original cache was preserved, isolated during the successful rerun, then restored byte-for-byte. No upstream test or assertion was weakened. Exact receipts/logs are retained under `.gev-logs/phase2a-m1/`.

The original in-app observation path now denied access under its URL protocol policy. No alternate browser/driver or CLI harness was used. M1 remains uncommitted pending actual user-run hub/HMR containment verification; the helper only performs reversible fixed file edits and records user observations, never drives a browser. A failed containment acceptance must stop/report. Standard localhost 4173 normal HMR is restored; 4174 stays stopped and all rehearsal logs remain. See `PHASE-2A-VALIDATION.md`.

### User M1 verification — recorded containment failure stop

The user's new hub QA passes 10/10 and matches the `2026-10-21T03:01:12.716Z` receipt, with no page/resource/optimizer errors. During read-only verification before the requested malformed-content startup restart, an earlier completed manual receipt was found with an explicit false assertion at `schema field violation: isolated error`. It had five earlier successful assertions and restored its originals. The latest retry has only initial readiness passed and is currently paused at malformed JSON; its unfinished overall false is not itself an assertion failure. Both results are recorded separately with hashes in `PHASE-2A-VALIDATION.md` and retained snapshots under `.gev-logs/phase2a-m1/user-verification-2026-10-21/`.

The required stop/report rule was applied before restarting. Verified 4173 PID 57862 remains unchanged; the user was asked to Ctrl-C the helper to restore the active fixture and describe the earlier failed observation. The helper maps any non-PASS answer to false, so no product cause is inferred from the receipt alone. No product/harness/dependency repair, commit, acceptance weakening or browser retry occurred. Only current-state/evidence documentation changed; M1 remains uncommitted and M2 has not started. 4174 and rehearsal retention remain unchanged.


### Manual helper restoration verified — October 21, 2026

The user stopped the latest manual helper. Its finished receipt has one readiness PASS, zero false assertions, `restored:true`, and overall `passed:false` because the full sequence was interrupted. Independent SHA-256 checks confirm both manifests, both schemas and `SECURITY.md` match the saved originals exactly; the helper is no longer running. The finished receipt and five-file hash report are retained under `.gev-logs/phase2a-m1/user-verification-2026-10-21/`. This is not a second containment failure or a completed containment pass. The earlier explicit schema-field negative answer remains unexplained; the stop/report gate and uncommitted M1 remain. No listener restart, product repair, browser action, native test rerun or acceptance weakening occurred in this documentation checkpoint.


### Manual-response classification corrected — October 21

Read-only inspection confirms the helper saves true only for normalized PASS and maps every other resolved response to false, without retaining raw input. The older schema-field false therefore proves the acceptance step did not pass, but does not prove literal FAIL input or a product defect. Earlier assistant wording overstated that evidence. The user's full transcript describes only the later initial-PASS/Ctrl-C run. This documentation correction preserves both original receipts and the unresolved gate; no product/helper/criterion or server state changed. The parser classification/hash report is retained with the other M1 verification evidence.


### User-authorized checkpoint repeat — October 21

The user does not recall the older run and explicitly authorized repeating the schema-field checkpoint. Its original receipt remains unchanged; a separate annotation records the disposition as inconclusive, without claiming a product defect or pass. The restored files still match their backups and the Node content check passes. No historical clarification is still required.

Only the ignored manual helper and project-owned status/evidence documentation change at this step. The helper gains an exact existing-case selector, strict re-prompting PASS/FAIL input, selected-scope/helper-hash evidence, explicit interrupted/failed outcomes and robust restoration. Its prior source/receipts are retained. Isolated fixture tests exercise helper control flow; the agent does not execute live mutations or browser checks. One-case 3/3 cannot complete the full containment/startup gate. Actual FAIL still restores/stops. No product repair, original-upstream change, server restart, commit or acceptance weakening occurs.


The strict-input helper passes 8/8 isolated Node 24.22.0 control-flow checks: one/full selection, invalid-input re-prompting, explicit FAIL stop, SIGINT/SIGTERM/EOF restoration and unknown-selector rejection. Every fixture file restores exactly. Report: `.gev-logs/phase2a-m1/helper-tests/isolated-run-wqVqcy/results.json`; tested helper hash `4703a5f6fb303d6be477b5a2524e981be896a38c4fc65a4a78ee0173bff4d440`. These are helper tests only; the user-rendered schema-field repeat is pending.


### Schema-field repeat passed — October 21

The user returned a 3/3 PASS for the version 2 single-checkpoint helper: readiness, Library-only version=2 error isolation and automatic HMR recovery. It matches the `2026-10-21T14-40-39.581Z-6zbGnY` receipt (SHA-256 `b5c94d91599f6b469a34c0ed8cddb6bd0359798986599c34648f52adc259f383`). All five files independently match saved originals. Both older receipts are preserved; the earlier unknown answer stays inconclusive and needs no further historical reconstruction. This is a single-case result, not full containment/startup acceptance.

Only status/evidence documentation and ignored snapshots are updated here. The agent did not execute a browser harness, change product/helper code, restart a listener or rerun unrelated native suites. M1 remains uncommitted pending the complete 21-observation HMR sequence and separate invalid-content startup check. Full helper instructions and hashes are in the validation record; M2 has not started and Phase 2b remains deferred.


### Full HMR containment passed; final startup gate prepared — October 21

User full-sequence result matches 21/21 explicit PASS assertions across all ten cases plus readiness; receipt `2026-10-21T15-17-16.201Z-2LWL9Y` SHA-256 `bb792c99a9d50f3bdb0e2367045625eb0f7d0e61e39909b84ac8a4d7a156492a`. All five current files independently match saved originals. The agent did not execute browser checks; snapshots/hashes are retained with M1 evidence. Older receipts and tested helper v2 stay unchanged.

Only ignored helper coordination and project-owned documentation change here: helper v3 adds startup mode with deliberate malformed JSON, a per-run restart request and marker wait, then separate user fresh-start/restoration observations. The helper never controls browser or server. Agent restart is already authorized but must verify listener/checkout/heldfixture first; no restart or marker is issued in this preparation step. Completed no-reload HMR evidence is kept separate from the upcoming intentional startup. No product code, dependency, original-upstream file, provider/security setting, key or acceptance criterion changed. M1 remains uncommitted until the last startup gate passes; M2 has not started and Phase 2b stays deferred.


The startup coordination helper passes 12/12 isolated Node control-flow tests with all fixture bytes restored; report `.gev-logs/phase2a-m1/helper-tests/isolated-run-pBTDLc/results.json`. Tested helper SHA-256: `6089668fe13895d3311a33f3c49788292a3dd1306871d2415f97f336d91627a4`. Tests use fake per-run markers and a stubbed validator, with no live content, browser, provider, port or server operations. User-rendered startup verification remains pending.


### Invalid-content startup restart performed — October 21

The user staged the dedicated startup run `2026-10-21T15-29-48.392Z-tjdb7l`. Agent and independent read-only checks verified its request, helper/checkouts, held single-byte malformed registry and sole loopback listener. Only PID 57862 was stopped; standard root CLI restarted as PID 41062 on `[::1]:4173`, Node 24.22.0, normal HMR and existing dedicated cache/security/provider policy. Both camera packs remain OFF. Projection/policy hashes are unchanged; five static native HTTP requests returned 200 while malformed content stayed held. These are native checks, not rendered passes.

The first native config probe expected literal HMR true; the installed Vite default is undefined/enabled (`server.hmr !== false`). Correcting that verification assumption required no product/configuration repair or weakened HMR requirement. Native proofs/logs and the atomically written matching restart marker are retained in the run directory. The helper has accepted the marker and awaits user fresh-start and recovery observations. No agent browser, key handling, original-upstream edit, product change or commit occurred. M1 remains uncommitted until startup and exact restoration pass; M2 has not started and Phase 2b remains deferred.


### M1 startup passed and validation complete — October 21

The user-owned startup helper finished all three explicit PASS observations at `2026-10-21T15:35:51.173Z`; receipt SHA-256 `049170c48ee97ce3c6a0ea30034b5086aae29523c31e6f9d205b23025852a632`. Restart metadata matches native proofs; all five originals independently restore exactly, helper exited, and projection/policy hashes are unchanged. The restored corpus passes `check:library`. This completes the last M1 gate alongside full HMR 21/21, QA 10/10, tracking 109/0/0 and the recorded native/build/graph checks. No agent browser execution is claimed.

M1 is ready for its authorized buildable milestone commit; original-upstream changes remain exactly package.json/package-lock.json, with all prior locked versions preserved. No further approval or repeated completed gate is needed before M2. Its nine articles require the user's editorial review before committing, with a separate M3 case review and final Phase 2a acceptance still pending. Server remains standard normal-HMR PID 41062 on localhost:4173; 4174 and all rehearsal retention stay unchanged.

## Phase 2a milestone 2 — Knowledge Center editorial preview

M1 is committed as `e19e0f22`. M2 remains unstaged and uncommitted pending required editorial/rendered verification. No original-upstream file, package version, provider acquisition owner or key configuration changes in M2. The two-file upstream allowlist and approved 63-path inventory remain unchanged.

New approved paths: nine `content/knowledge/*.md` articles; `hub/src/library/markdown.ts`, `hub/src/library/search.ts`; `hub/src/components/library/ArticleRenderer.tsx`, `SearchResults.tsx`; `hub/src/pages/KnowledgeCenter.tsx`, `KnowledgeArticle.tsx`, `LibrarySearch.tsx`; `src/custom/library/search.test.mjs`. Existing approved custom paths supply routes/shell/Library navigation/styles, manifest publication and schema validation, original-body hashes, generated projection digest, corpus/rendering/router tests, the expanded user-owned QA harness and authoring/evidence documentation. The seven upstream-document admission records retain all facts/sections/hashes/notices and change only publication flags. Unknown upstream publication dates stay null.

Shared remark parsing, safe licensed Markdown rendering, section IDs/focus/provenance and local in-memory MiniSearch remain lazy within Library. Raw HTML/media/executable links stay blocked. Query bounds, nested headings, source-guide fallback and route slug/publication contracts have regression coverage. Full article paths, primary references, measurements and pending checks are in `docs/custom/PHASE-2A-VALIDATION.md`; both Spatial summaries require user comparison before commit. Six M3 case files are untouched. Phase 2b remains deferred.

M2 environment recovery: prolonged Cesium asset-copy waits were resolved after preserving the complete installed dependency directory under `.gev-cache/phase2a-m2-dependency-recovery-wq4m8Z/node_modules.original` and reinstalling the unchanged lockfile. Fresh installed version/integrity records match all375lock entries;117suffix-copy assets disappear from the clean package. Both interrupted initial logs and successful full build/test reruns are retained. The exact filesystem cause is unproven. No application/dependency version or upstream-file repair was made. Root dev now uses normal HMR on4173 (PID83193), with optimizer-only `--force` after installation.

M2editorial approval recordedOctober21:allninearticlesincludingbothSpatialsummariesapproved;manualUIreportedpassed. Requestedcommitheldbyverificationcontradictions(latestQA11/12andserverglobalreloadcommandsinside5/5articleHMRwindow). Strictcontainmentstop/report applies; no product/harness repair orM3applicationfilescreated duringaudit. Allapprovedcontentunchanged;receipts/evidencepreservedinPHASE-2A-VALIDATION.md.

### M2 verification repairs — October21

Authorized custom-file repairs preserve approved articles and receipts: search QA now verifies/resets retained query filters without dropping assertions; current-generation catalog proxies prevent stale loader/schema callbacks after HMR. Existing search/rendering tests cover both, with29focused native passes. No extra original-upstream file was edited. A narrowDEV HMR plugin is review-only:28nativeprototype passes, unapplied patch under `.gev-logs/phase2a-m2/repair-analysis-2026-10-21/`. Adoption awaits explicit amendment adding only `src/tooling/viteBuild.test.mjs` (inventory63→64) to permit/strictlycheck its real name while retaining all prefix/security checks. Shipping plugin configuration remains unchanged. M2commit/M3held.

## M2 approved HMR containment repair — October 21

The user approved the narrow Phase 2a inventory amendment, 63→64, adding only original-upstream `src/tooling/viteBuild.test.mjs`. Its customization ledger entry: retain the exact original standalone plugin prefix and all security/config assertions; replace the Tailwind-only suffix assertion with assertions for the preceding Tailwind plugins and exactly one final `custom-library-hmr-content` plugin (`apply: serve`, post hotUpdate, function handler). No other upstream test behavior changes.

Project-owned `build/customHub.js` installs that honestly named DEV-only hook for the exact 26 admitted public Library inputs. It invalidates changed raw/watch modules plus the loaded upstream-documents/catalog owners and propagates only through the self-accepting catalog; unloaded Library returns no update, and unrelated/non-client events fall through. No content parsing, server-side validation, endpoint, reload interception, overlay suppression, polling, or dependency change is introduced. Existing approved custom tests cover the actual hook. Search QA explicitly resets retained category/source filters between scenarios while preserving and strengthening all assertions. Catalog exports dispatch to the current HMR generation so old consumers and Retry callbacks cannot reuse stale loaders. All approved article bytes and historical receipts remain preserved. Verification and user reruns are recorded separately; no M2 commit/M3 advancement is implied.

## M3 working-tree case pages — October 21

Approved custom paths now contain the six case Markdown bodies and manifest records, lazy CaseStudies/CaseStudy pages, kind-aware route/search/Markdown/TOC links and validated geographic handoffs. The shared article view retains provenance and adds visible case classification, limitations and exact restored scope. Unavailable case routes focus their heading for both slug and section changes. Source facts/dependencies/upstream code are unchanged; only the shared projection digest regenerates with the manifest. The five source-supported cases are published for review; imagery remains draft/unpublished pending actual A/B coverage. No incident/AI/draft globe action, new source, media, recorder, codec or extra upstream repair is added. Existing custom tests and the user-owned ignored case helper cover new behavior; browser/editorial checks remain pending, M3 uncommitted. See PHASE-2A-VALIDATION.md for the six-file/reference/scope review table and evidence.

### M3 imagery observation admitted — October 21

The last case now uses the user's successful rendered A/B observation and screenshots, with source and resolution limits rather than invented change detection. Only imageryMarkdown/itsmanifestrecord, the generateddigest and existingcustomtest/QAexpectations changed after the five-case checkpoint. Other21manifestrecords are preserved. Four geographicCTA scopes are now tested; draft behavior remains covered through explicitfixtures. No renderer/HUD/provider/upstream/dependency/codec changes were made. Screenshots remain private ignored evidence, absent fromapplicationassets. Allsixcasesawaiteditorial/renderedgates; M3uncommitted.


### Phase 2a M3 accepted; separate planning commit and M4 next

The user approves all six case pages/references and reports all manual checks
passed. Latest user-owned QA14/14 and caseHMR5/5 match retained receipts; Nepal
restores byte-for-byte, all six admitted case hashes match, and the matching
normal-HMR server log shows updates without global reload/error/restart.
Evidence: .gev-logs/phase2a-m3/acceptance-2026-10-21-vzi0ewdx/ and the M3 acceptance
section in docs/custom/PHASE-2A-VALIDATION.md. All prior receipts remain retained.

M3 is confined to 28 approved project-owned paths. No original-upstream edit or
new provider/dependency/codec/media acquisition is introduced; M2 articles remain
unchanged. The user authorizes M3 commit, then a separate docs-only I1-plan commit,
then unchanged M4 validation. The 47-path free-imagery plan remains a later
runtime milestone, contingent on Phase2a acceptance and its separate go-ahead.


### Phase 2a M4 native checkpoint; reviewed dependency proposal unapplied

M3 committed dae36cf0de737116615fd9e5efc615be965cd81e and the I1 plan is separate
a860327edc694fbcc313eb0791629fe88070a0b0. M4 clean install and all required native/
allocation/build/graph checks pass with unchanged shipping dependencies. No new
upstream edit is made in this checkpoint. Final Phase2a original-upstream
intersection stays package.json, package-lock.json and the specifically approved
src/tooling/viteBuild.test.mjs; other feature paths fit the approved inventory.

Current npm audit flags the existing Vite6.4.3 dependency. A bounded6.4.5 candidate
is prepared only in .gev-logs/phase2a-m4/native-l6z71yrc/vite645-review/ for user
review; manifest/lock/installedshippingVite remain unchanged. This is not an
upstream-pin adoption or I1 change. Preserve the existing source/doc pin, all
historical evidence, and pending final Phase2a acceptance. The validation record
contains exact receipts, security-source links, proposed diff and remaining gates.
