# Geospatial Intelligence Hub status

Updated October 26, 2026, America/New_York.

**Publication authorized:** the user requests committing and pushing the current
project changes to the fork's `main`, including the in-progress I1 implementation
and conservative PU calibration. This supersedes the prior commit hold while
leaving I1's unresolved visual checks and explicit acceptance pending. Keep
editor settings in a separate commit and duplicate backups local; logs, caches,
exports, builds and credentials remain excluded. No additional runtime repair,
provider call or server restart is part of this publication. Other Phase 2b
stays deferred; the tested runtime and upstream pin remain unchanged.

**Current accounting checkpoint:** the user's CDSE export confirms 10,000
requests / 10,000 PU monthly, resetting November 1 (86/108 at its cutoff).
October 23 matches 80 requests after removing October 22's failed 1/0.01
reservation from the saved 81-request month total. Dashboard 97 PU versus local
81.9513 is an 18.3629% excess; provider headers were not retained, so exact cause
is unresolved. The authorized **1.25 PU safety calibration** now protects
monthly/minute admission and pacing; local ceilings remain 8,000/8,000.
An idempotent locked migration preserves all 98 current requests, 7 OAuth
attempts and cached files, raising conservative PU from 115.7956 to 144.7445.
There is no matching local receipt for the export cutoff; local counters also
retain failed/unknown reservations. Of the 12-request month difference, one is
the known October 22 failure and 11 remain unclassified. No counts were reset,
and no provider request or credential/token read/log occurred. Monthly capacity is
**683 / 133 / 228** typical/heavy/oversized, or **676 / 133 / 210** with one
scroll. Node 24 validation: **8,388 pass / 0 fail / 1 skip**, 50 focused checks,
all nine checks and both builds; terrain restored byte-for-byte. Evidence:
`.gev-logs/phase2b-i1/quota-reconciliation-zqgSfz/REPORT.md`.
**4173 is paused** to prevent enabled tabs acquiring during HMR/restart; 4174
remains stopped. The earlier PID/usage/capacity checkpoint below is historical.
Dashboard quota/reset confirmation is complete; visual issues, final visual
sign-off and explicit I1 acceptance remain pending. No staging/commit; other
Phase 2b, scope, dependencies, historical logs and unrelated files stay preserved.

**Phase 2a is accepted. Phase 2b – I1 implementation is now explicitly approved
and in progress; all other Phase 2b work remains deferred.** I1 uses free CDSE
General-user access only. No card, paid trial/provider, account creation by the
agent, credential handling in chat, new dependency, recorder or hosting is approved.

Branch: `codex/phase-2b-i1-free-imagery`, from accepted closeout `a1fcf806`.
The approved 50-path inventory covers native 10 m S2 alongside HLS, bounded shared quota/cache
ownership, cloud metadata, explicit HLS fallback, camera-only fit/restore, loaded
source-resolution HUD and credited A/B exports. NAIP and Earth Search stay deferred.

The new directory inventory is150 products and39 guides. The user approved the
three-test47→50 amendment; only the reviewed exact-count changes are applied.
All assertions stay strict; the23-path upstream allowance is unchanged. Full
Node 24 gated validation passes **8,377 / 0 failed / 1 Windows-only skip**,
including both allocation groups; terrain restoration and formatting pass.
Evidence: `.gev-logs/phase2b-i1/approved-count-amendment-i5p_9ii3/`.

Current evidence and remaining gates: `docs/custom/FREE-IMAGERY-VALIDATION.md`.
The user lifted the browser-denial rule; agent browser automation on local 4173
is authorized going forward. The bounded I1 run used **62 requests / 80.6086
reserved PU**, below its whole-run 300/300 cap. Report: `.gev-logs/phase2b-i1/agent-live-cucuukcq/REPORT.md`.

Data, native grids, dated/attributed exports, HUD, camera controls, zero-usage
loaded controls/exports, mixed-source coarse fit/metadata, filtering, sampled
visible thumbnails, keyboard focus and overflow checks pass. All three warm
repeats add zero requests/PU. Cold three-date usage is typical 8/9.3664, heavy
7/47.8232, oversized 35/22.9783; including one measured scroll gives theoretical
monthly capacities 800 /166 /210 under both local 8000 ceilings.

**Visual failure remains:** automated globe pixels are blank on both rendering
backends. Narrow screenshots also contain a voice-selector/Details overlap.
Cause is unresolved; no product fix was attempted. Native metadata and valid
exported PNGs do not close that visual gate. Dashboard confirmation and final
user visual sign-off/explicit acceptance remain pending. Original inconclusive
harness attempts and corrected confirmations are retained with their provenance.

No product source or dependency changed; native 8381/0/1 and both builds remain
recorded at the frozen endpoint-repair revision. Automated browsers are closed;
normal-HMR 4173 PID 39317 is retained, 4174 stopped. No credentials/tokens were
read/logged, no explicit cache/ledger clear, no staging or commit. Preserve all
six duplicates and unrelated editor/index changes. The browser authorization is
persistent; any product repair needs approval. Other Phase 2b stays deferred.
Earlier entries below remain historical.

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
5. **Phase gates:** Rehearsal reruns pass and adoption is approved with the camera-policy/Ontario/repair conditions. The shipping integration execution plan is approved; execute its separate-worktree, policy, fast-forward, and shipping verification gates. After integration verification on 4173, stop 4174 while retaining logs, then produce Phase 2a reverification/Ajv comparison and resolve amendments before milestone 1. Milestones 2/3 retain pre-commit user editorial review. Phase 2b waits until 2a ships and is accepted.

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

- **Phase 2a — reviewed with conditions; implementation not started:** shipping verification and 4174 shutdown/log retention are complete. The user approved the reverification amendments. Await the required normal-HMR tracking result; after it passes, milestone 1 onward is authorized with existing gates. Diagnose any normal-mode failure before implementation. Keep invalid content Library-local in dev and strict in checks/both builds; milestone 2/3 article/case review precedes commits.
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

### User rerun receipt, conditional adoption, and integration plan

User `qa:hub` 9/9 matches receipt `.gev-logs/qa-custom-hub-2026-10-20T18-43-33-487Z.json`, origin `http://localhost:4174`, timestamp `2026-10-20T18:43:33.488Z`. Tracking 109 passed / 0 failed / 0 skipped is user-reported; no local tracking receipt was found. The report retains initial failures and all repair evidence. The proposed persistent policy forces only Hong Kong/Taiwan off through the project-owned root wrapper, proves it offline with the real catalog loader, and fails startup on reviewed-contract drift; implementation is not started. `SETUP.md` documents this proposed policy, Ontario's missing POWER UP field, and ten provider-key entries in the requested order with official references. No key requested/configured/handled. Integration plan ready for approval; no additional verification tests needed for this documentation-only checkpoint.


### Approved shipping integration candidate

The user approved the integration plan as written. Three new project-owned policy/check/test files and the existing custom hub wrapper enforce HK/Taiwan off before provider setup, with reviewed upstream hashes failing closed on contract drift. Six fresh-process offline scenarios pass, including hostile shell/dotenv flags and restarts; both packs issue zero requests and return zero rows, with an Austin positive control. Six policy tests and the combined 21-test focused configuration group pass. No dependency, original-upstream repair, real credential-file read, or live camera request was introduced. The candidate also adds the requested Cesium tracking-imagery and anonymous OpenSky/recording-terms notes to `SETUP.md`. Full shipping gates and user checks are pending.

### Shipping restarted; awaiting user checks

The approved separate-worktree integration was fast-forwarded into shipping at `fd136b60ce9421bd8636692232766a5f7d2226e3` and adopted upstream pin `064d51f7be2675f1c69e16068e9c49d1a60144d1`. Actual shipping `npm ci`, six-scenario camera-policy check, doctor, hub typecheck, allocation-gated suite (8,176 passed / zero failed / one platform skip), import/package boundaries, formatting, root and panel builds all pass. Logs: `.gev-logs/shipping-integration-2026-10-20/`. Root startup confirms HK/Taiwan OFF; 4173 listens only on `[::1]`. Final optimizer metadata is stable across 74 HTTP-only checks; browser/manual results remain pending. Rehearsal listener/logs remain intact. The newer checkpoint supersedes candidate-pending statements above and the approval plan's original status. Exact user commands/manual steps are in the rehearsal report's shipping checkpoint.

### Shipping user results — tracking rerun required

User attachment preserved at `.gev-logs/shipping-integration-2026-10-20/user-shipping-checks-2026-10-20.txt` (SHA-256 `a6581dc58e57aa1c6703de622c0502600ec66972a9d3b954b1a2d7f92cebc090`). Hub 9/9 matches receipt `.gev-logs/qa-custom-hub-2026-10-20T19-28-09-202Z.json` (timestamp `2026-10-20T19:28:09.203Z`, origin 4173, nine assertions true, overall passed). User separately confirms all Street Level manual smoke checks passed. Tracking has 88 passing assertions, no assertion failures/skips, then `Execution context was destroyed` at harness 3231; it is incomplete, not a passing tracking result.

The server recorded source-triggered reloads near the failing evaluation; sampled source hashes match HEAD and mtimes are unchanged, but metadata-change timestamps match reload times. A development reload is the leading interruption hypothesis; the external metadata trigger is unconfirmed. The unchanged root server was restarted via Vite `createServer` with `server.hmr:false` for the bounded rerun, preserving providers, security, camera policy, cache, and every harness assertion. New `[::1]:4173` PID 65423; 4174 PID 55130 is retained. Startup guards pass; 74 HTTP-only checks return 200 with stable metadata. No source/dependency repair or new key configuration. Rerun only `npm run test:track -- --url http://localhost:4173 --offline-imagery`; retain its complete summary. After it passes, stop only verified 4174, retain logs, and produce the post-pin/Ajv review before milestone 1.

### Verified shipping closeout and Phase 2a review delivered

The user explicitly reports the shipping tracking rerun109passed/0failed/0skipped. This is a user-reported result, not a new local transcript or agent execution; preserve the earlier 88-pass interrupted run separately. Together with matched hub 9/9 and the user's all-pass manual smoke, the approved integration verification is complete.

Verified rehearsal listener PID 55130 was stopped on 4174 at 2026-10-20T19:41:08Z (15:41 EDT). Its worktree remains; 94 `.gev-logs` files / 59,428,182 bytes are retained with SHA-256 inventory `.gev-logs/post-pin-review/rehearsal-log-retention.json`. Shipping 4173 PID 65423 remains in temporary HMR-off mode; restore normal HMR for future Library recovery gates when implementation is authorized.

Post-pin report: `docs/custom/PHASE-2A-REVERIFICATION.md`. It rechecks 32 layer IDs, 11 safe setup IDs, 38 legacy guides, source/coverage changes, seven exact upstream docs / 25 selected slices / 441 lines with independently verified hashes, article provenance and six case limits. Proposed dev-only lazy Ajv keeps the two-file upstream allowlist; proposed generated projection raises62 to 63 implementation paths. Option(a) needs a separate third-upstream-file amendment. No content files, projected metadata, product code or project dependency changes were made. Isolated Ajv fixtures/measurements are ignored evidence, not implementation. No native test/build rerun was needed for this documentation-only closeout.

### Approved Phase 2a amendments; normal-HMR prerequisite

The user approved the generated projection `src/custom/shared/sourceRegistry.generated.js` (63implementation paths), Ajv option(b) as a devDependency loaded lazily only in development Library, authoritative Node validation for `check:library` and both production builds, and the frozen-pin facts/admissions/hashes/case/article requirements. Exactly two original-upstream files remain allowed. If Library HMR containment tests fail during implementation, stop and report; never weaken the requirement.

The user added a prerequisite: restore normal HMR and obtain a complete passing `test:track` result on 4173 before milestone 1. Once it passes, implementation is approved from milestone 1 onward without asking for the same approval again; retain milestone 2/3 editorial stops before commits and final Phase 2a acceptance. Until then no product/content/dependency implementation starts.

Earlier failure classification: probable dev-server reload interruption, not an established product or harness assertion defect. The interrupted run had 88 successful assertions, no assertion failures, and no final summary; `page.evaluate` lost context at harness 3231 without an intended navigation there. The preserved server log contains 15 source reload messages, including three at 15:33:10 whose ctimes match while content mtimes/hashes remain unchanged. The external metadata writer and precise browser navigation were not captured, so causal attribution is not conclusive. HMR-off was a temporary operational workaround, not a root-cause fix. The prior109/0/0 remains valid only for that reported HMR-off run.

Restoration uses the standard approved command `HOST=localhost PORT=4173 npm run dev -- --strictPort`, with no HMR override, extra plugin or source/harness change. All existing logs remain; new server/config/HTTP evidence and the user's rerun log are retained under `.gev-logs/normal-hmr-2026-10-20.3KpYkt/`. If the normal run fails, preserve stdout/server log/timestamps and source stat/diff evidence and diagnose before any Phase 2a work.

### Normal-HMR server ready; tracking prerequisite pending

Restored the standard root CLI on `[::1]:4173`, PID 78207, with resolved `server.hmr:true` and no HMR override. HK/Taiwan policy guards pass; 4174 remains stopped. Configuration/startup evidence: `.gev-logs/normal-hmr-2026-10-20.3KpYkt/{resolved-config.json,startup-check.json,server.log}`. Two HTTP-only passes verify 76 document/module/optimizer requests (all 200) with unchanged finalized metadata. This is not a browser/tracking result. Working tree has only documentation updates; no product/harness/dependency/content change. Wait for the user's complete normal-HMR tracking result before activating the approved Phase 2a implementation.
