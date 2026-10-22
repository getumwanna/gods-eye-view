# Geospatial Intelligence Hub agent instructions

## Scope and authorization

**Phase 1 is accepted.** The user ran `npm run qa:hub`, reported all 9 checks passing, and explicitly approved acceptance. The matching receipt at `2026-10-20T16:48:33.899Z` has nine true assertions and overall `passed: true`; see `docs/custom/PHASE-1-VALIDATION.md`. The `cn` dependency review is resolved, all four milestones are complete, and earlier failed receipts remain historical evidence. The agent did not execute the CLI browser harness. Missing historical Phase 0 baselines remain explicitly waived, not passed. Official MIT shadcn/ui supersedes the 21st.dev choice.

The user approved the Phase 2a reverification amendments: generated projection (63 paths), Ajv option(b) as devDependency/DEV-only lazy Library validation with Node-authoritative checks and both builds, and frozen-pin facts/doc admissions with hashes/case/article requirements. Two original-upstream files remain allowed. The normal-HMR prerequisite now passed: the latest user attachment matches the retained 109/0/0 result and the completed server log has no reload. Phase 2a implementation from milestone 1 onward is explicitly authorized; do not ask for that approval again. Preserve milestone 2/3 pre-commit editorial stops and final phase acceptance. If Library HMR containment acceptance fails, stop/report rather than weakening it. Phase 2b remains deferred; 4174 stays stopped with logs/worktree retained.

The accepted Phase 1 six-file upstream allowlist was `package.json`, `package-lock.json`, `vite.config.js`, `src/main.js`, `style.css`, and `src/tooling/viteBuild.test.mjs`; its milestone 1 diff is recorded in `docs/custom/PHASE-1-M1-UPSTREAM.patch`. Phase 2a permits only the two original-upstream package files. Rehearsal execution has a separately approved import/repair scope in `docs/custom/UPSTREAM-SYNC-PLAN.md`; incoming upstream changes are distinct from manual customization repairs. No additional original-upstream manual repair is authorized without an amendment.

At each session start read `CUSTOMIZATION.md`, `STATUS.md`, `docs/custom/PHASE-0-AUDIT.md`, `docs/custom/PHASE-1-PLAN.md`, and `docs/custom/PHASE-1-VALIDATION.md`; inspect HEAD, branch, status, and diff. Read the relevant upstream runtime/security/source/testing documents. Before a new phase, present a short file-level plan and wait for explicit approval. The earlier B/A license hold is historical and was resolved by choosing official shadcn; neither 21st component was adopted.

Phase 2a content validation must fail `check:library` and both production builds, but must never stop the development server or the globe. In dev, invalid content produces an accessible error state inside Library routes only. Avoid configuration-time content validation and direct editable-content imports into the globe graph. The generated projection and Ajv option(b) are now approved. The measured option(a)/(b) comparison is retained in `docs/custom/PHASE-2A-REVERIFICATION.md`; use DEV-only lazy browser validation and Node-authoritative checks/builds, without an additional dev plugin or original-upstream file. At the end of milestones 2 and 3, run the checks, list every new article/case page with references, and stop for user editorial review **before committing**. The user will compare both Spatial Intelligence summaries with their originals.

## Architecture

- Existing globe: vanilla JavaScript, CesiumJS, Vite, standalone entry at `/`.
- Root `vite.config.js` delegates to `server/standalone/vite.config.js`; provider middleware is under `server/providers/`.
- Future hub: sibling React/TypeScript entry, proposed `/hub/`, using Tailwind, shadcn/ui, and the official MIT shadcn/ui Radix sidebar. It must share the existing local server and provider acquisition/cache ownership.
- Use GEV's validated share URLs for cross-shell navigation. Preserve full v2 state for saved presets; the portable view API models a narrower subset.
- New content belongs under `content/`; proposed shared design tokens under `design/`; custom glue under `src/custom/` or a narrow hub directory. These folders are future work, not Phase 0 deliverables.
- Do not migrate or iframe the globe. Keep hub dependencies and Tailwind resets out of the globe graph.
- Prefer the current focused source/layer owners. Compatibility files under `src/data/` are not always the implementation owner.
- Update `CUSTOMIZATION.md` for every upstream file edited. Commit small, reviewable milestones with a clear scope.

## Commands

Use Node `>=24.14.0 <25` or `>=26 <27`. Phase 0 used Node `24.22.0` and npm `11.19.1`.

```sh
nvm use 24.22.0
npm ci
npm run doctor
HOST=localhost PORT=4173 npm run dev -- --strictPort
GEV_REQUIRE_ALLOCATION_GATE=1 npm test
npm run build
```

The allocation gates are calibrated to Node 24. With a dev server and permitted browser automation, the contributor baseline also includes `npm run test:track`; its data is synthetic test fixtures, not live observations. Follow the specific harness header for options. Run relevant feature gates for eventual globe changes and run doctor again. Do not add redundant tests for documentation-only work.

Do not use `scripts/dev-fresh.sh` for a deliberately keyless check: the macOS launcher can load Keychain credentials. Explicitly verify key configuration and listener state before describing a run as keyless/local-only.

## Data and security rules

- No fabricated live data or unavailable-as-zero widgets. Test fixtures must stay clearly test-only.
- Every future displayed value needs Live, Refreshed, Simulated, Estimated, or Static, plus coverage, source, timestamp, and separate health/freshness state. Mixed layers need per-value labels.
- A source-present feature is not proof of a working live feed. Separate source audit, automated fixtures, actual live observations, user reports, and missing verification.
- Persistent secret keys stay server-side and outside logs, URLs, version control, and exports. The user expressly allows provider-designated public client tokens, including Mapillary, and ephemeral AI session credentials in the browser, with appropriate restrictions. This decision does not itself authorize configuring credentials or making paid calls.
- The user accepted per-value observation kinds with separate feed health; one acquisition owner per source and passive summaries to be designed in Phase 2; separate globe-loaded/cached satellite counts; aircraft/military/satellite tracked bookmarks and vessel view-only bookmarks; unselected hosting until Phase 4; local personal use only, with terms verification before new sources, recording, or hosting.
- Bind localhost only. Do not weaken Host/origin/forwarding-header gates, expose the server, or deploy without separate approval and the Phase 4 audit.
- Preserve all map/provider credits and the operational-use disclaimer. Code's MIT license does not license every dataset/media asset. Check each source and recorder retention right separately.
- No named-person search, face recognition, plate recognition, or individual tracking. ALPR means mapped locations/tags only.
- AI is optional. Do not make paid model/provider calls, retrieve quota-consuming 21st.dev code, or enable credentials without the applicable user authorization.
- Prefer Node for any future recorder; do not rewrite GEV in Rust. Rust tools/services are isolated optional later work.

## Known verification boundary

During Phase 0, automatic browser approval rejected access to `http://localhost:4173/`. Do not work around that denial using another browser, raw CDP, browser-driving shell scripts, or indirect page execution. The user separately confirmed the globe renders. On October 20 the original in-app browser path permitted Phase 1 inspection. CUA checks of the hub/globe, themes, handoff, setup and narrow layout passed; see the validation record. This does not retrospectively pass the waived Phase 0 baseline. Do not bypass any new denial with another driver.

The user subsequently waived all missing Phase 0 baseline checks, including automated browser/tracking gates, individual live-layer outcomes, and GPU/FPS measurements. This resolves the preimplementation gate; it does not turn those checks into passes or waive the new Phase 1 validation criteria. Preserve the historical audit and report future tool denials honestly.

All four Phase 1 milestones and final checks are recorded in `docs/custom/PHASE-1-VALIDATION.md`. `STATUS.md` is the current work list. Accent remains `#38BDF8`; Refreshed is `#2DD4BF` dark / `#0F766E` light. Token contrast and both rendered colors were verified. The user-run CLI browser harness now passes 9/9 and Phase 1 is accepted. The agent has not executed that harness; the passing receipt and all five earlier failed receipts remain recorded. Phase 2a is conditionally approved. Rehearsal user reruns pass and adoption is approved with conditions; the integration execution is approved and shipping is installed at upstream pin `064d51f7be2675f1c69e16068e9c49d1a60144d1`; await the user shipping checks before stopping 4174 and performing reverification. Phase 2a reverification/Ajv comparison follows verified shipping integration, before milestone 1. Phase 2b stays deferred until 2a ships and is accepted.


## Historical checkpoint: Shipping integration checkpoint

Approved fast-forward installed code `fd136b60ce9421bd8636692232766a5f7d2226e3` in shipping with upstream pin `064d51f7be2675f1c69e16068e9c49d1a60144d1`. Shipping non-browser gates pass (8,176 unit/allocation passes, zero failures, one platform skip; policy, doctor, typecheck, boundaries, formatting, both builds). Root shipping runs at localhost:4173 with persistent HK/Taiwan-off policy and dedicated optimizer cache. User-run hub/tracking/Street Level checks are pending. Keep rehearsal 4174 and all logs until those resolve; then stop only its verified listener and perform the Phase 2a post-pin/Ajv review before milestone 1. No extra implementation approval is implied.


## Historical checkpoint: Pending shipping tracking rerun

Shipping hub QA 9/9 matches its latest receipt; the user explicitly reports all Street Level manual checks passed. Tracking is incomplete after 88 passes and a destroyed execution context; do not mark it passed. Root 4173 temporarily runs through Vite `createServer` with `server.hmr:false` to suppress observed dev reloads, preserving all policy/security/provider settings and harness assertions. No source repair was made. Keep 4174/logs until a complete user-run tracking summary is received; only then stop its verified listener and produce the Phase 2a post-pin/Ajv review before milestone 1. Normal HMR should resume with active implementation, not during this bounded verification run. Phase 2b stays deferred.

## Historical checkpoint: Current post-pin review stop

Shipping verification is complete. User reported tracking 109/0/0 after the HMR-off rerun; hub 9/9 is receipt-backed and manual smoke is user-reported passed. Rehearsal 4174 PID 55130 was verified and stopped; preserve its worktree, 94 logs and retention manifest. Shipping 4173 remains up. Earlier pending/rerun paragraphs are historical checkpoints, not current blockers.

Read `docs/custom/PHASE-2A-REVERIFICATION.md` before any Phase 2a implementation. Its preferred proposal keeps Ajv a devDependency, lazy-loaded only in development Library and removed from production output; it is not yet selected by the user. The additional generated-projection path also awaits approval (62→63 implementation paths; only two original-upstream files). Do not implement option(a)'s dev plugin without its explicit extra-original-file amendment. Restore normal HMR for authoring/error-recovery tests; HMR-off tracking cannot prove Library isolation. Keep milestone 2/3 pre-commit editorial stops, strict check/build failures and Library-only dev errors. No implementation authorized by this review checkpoint.

## Historical checkpoint: Current normal-HMR prerequisite and conditional implementation approval

This user decision supersedes earlier pending-amendment approval paragraphs. The projection/Ajv/fact/admission amendments in `docs/custom/PHASE-2A-REVERIFICATION.md` are approved. The current blocker is a fresh complete `test:track` pass on 4173 with normal HMR; the earlier HMR-off 109/0/0 does not satisfy it. Standard root `npm run dev -- --strictPort` is being restored without source or harness changes. Preserve failed-run evidence and diagnose if normal mode fails; do not start Phase 2a meanwhile.

Once normal tracking passes, begin milestone 1 under the already granted conditional authorization and 63-path inventory. Do not treat this as approval of a third upstream file, new provider, recorder, Phase 2b or hosting. Library-only development errors, strict Node check/build failures, production DEV-only Ajv removal and explicit HMR containment remain required. Stop/report if containment fails, preserving requirements and all editorial gates.


Normal HMR is now restored on 4173 through standard root CLI (PID 78207, resolved `server.hmr:true`). The pending prerequisite is only the complete user-run normal-mode tracking result. Server/configuration logs are under `.gev-logs/normal-hmr-2026-10-20.3KpYkt/`; 4174 remains stopped. No product/harness/dependency files changed. Await result, diagnose failure, or begin already-authorized milestone 1 after pass.


## Current Phase 2a milestone 1 browser verification stop

Normal-HMR tracking 109/0/0 is recorded in `docs/custom/PHASE-2A-VALIDATION.md`; its attachment and matching tee log are retained. M1 registry/directory/validation implementation is uncommitted, with 8,235 native unit/allocation passes, zero failures, one platform skip, plus 24 negative command gates. Only the original package files changed upstream; exact patches are under `.gev-logs/phase2a-m1/`. Server 4173 is restored to standard CLI normal HMR (verified PID 57862 at this checkpoint); 4174 stays stopped. Verify listener identity again before any later stop.

The current in-app browser observation was explicitly denied by its URL protocol gate. Do not retry via another tab, URL variant, browser, raw CDP or shell browser driver. Agent has not executed CLI QA, tracking or the manual helper. The user can run the expanded `qa:hub` (10 assertions) and the non-browser manual edit/restore helper at `.gev-logs/phase2a-m1/manual-hmr-check.mjs`; exact procedure/pending gates are in the validation record. Keep M1 uncommitted and do not start M2 until normal-HMR containment is actually verified. On a failed containment acceptance, restore the inputs and stop/report without weakening the requirement. Preserve M2/M3 editorial stops before committing.

## Historical checkpoint: unresolved manual-response stop

The latest user hub QA is receipt-backed 10/10 (`2026-10-21T03:01:12.716Z`). The latest manual retry was interrupted after initial readiness (one PASS, zero failed assertions), finished restored, and all five originals were independently hash-verified on October 21. An earlier completed manual receipt (`manual-hmr-2026-10-21T02-54-39.936Z/receipt.json`) explicitly records `schema field violation: isolated error` false and original inputs restored. This triggers the stop/report gate; do not overlook it because the retry is incomplete or hub QA passes. The helper treats every non-PASS answer as false, so ask whether this was an observed failure or unintended terminal input before attributing a product cause. No code fix, commit or weakened assertion is authorized by this checkpoint.

Startup restart was not performed. PID 57862 was verified as the root standard Vite CLI and left running. The user stopped the helper, and all five files now match its saved originals byte-for-byte. No helper remains running. Do not restart the listener or resume gate work until the earlier failed answer is clarified. Retain snapshots/checkpoint under `.gev-logs/phase2a-m1/user-verification-2026-10-21/`; validation record has exact hashes/evidence. M1 remains uncommitted; M2/M3 and Phase 2b remain unstarted/deferred.


Parser clarification: the older false assertion is an unresolved non-PASS response, not proof of a literal FAIL or observed product defect. `confirm()` accepts only normalized PASS and records all other resolved answers as false without saving the entered answer. The latest full transcript describes the separate interrupted run only. Previous assistant wording calling the older response an explicit FAIL was too strong. Preserve all evidence and keep M1 uncommitted; clarify whether the older case was observed failure, unintended input or not recalled. No browser retry, helper repair, restart or product change occurred at this clarification checkpoint.


## Historical procedure: authorized checkpoint repeat

The user explicitly replied “I don’t recall that run; repeat the checkpoint.” Preserve the older schema-field false receipt as inconclusive, with no known raw answer or observed symptom; do not treat it as either a product defect or pass, and do not ask the same historical question again. All five originals remain restored and hash-verified. The current content check passes.

Repeat only the unchanged schema-field error-isolation/recovery checkpoint using the user-run ignored helper: `node .gev-logs/phase2a-m1/manual-hmr-check.mjs --case=schema-field-violation`. Its version 2 now re-prompts until normalized PASS or FAIL, records only those explicit answers, distinguishes interruption, includes helper hash and single/full scope, and restores its fixtures. Old helper and receipts are retained. The agent may test this helper only in isolated Node fixtures, never run it against live content or drive a browser to bypass denial. A single-case 3/3 pass covers only readiness, that error-isolation step and its HMR recovery; the full sequence and invalid-content startup remain pending. Literal FAIL restores/stops under the existing requirement.

No product code repair, commit, acceptance weakening or server restart is included. Keep M1 uncommitted until all gates pass; continue under existing implementation approval afterward, preserving M2/M3 pre-commit editorial stops. Phase 2b stays deferred.


## Historical checkpoint: remaining M1 verification gates

The user's strict-input schema-field repeat passes 3/3, matched to `.gev-logs/phase2a-m1/manual-hmr-2026-10-21T14-40-39.581Z-6zbGnY/receipt.json` (SHA-256 `b5c94d91599f6b469a34c0ed8cddb6bd0359798986599c34648f52adc259f383`). All five files independently match saved originals; older receipts remain unchanged/inconclusive or interrupted as recorded. The old unknown response is resolved for workflow purposes by user-authorized repeat; do not ask the historical question or request that single checkpoint again on its own.

Remaining gates are the default helper's full 21-observation normal-HMR sequence and separate invalid-content fresh-start verification. Both remain user-observed because browser policy denial persists. Keep M1 uncommitted and M2 unstarted until they pass; literal FAIL restores/stops under unchanged requirements. Do not restart the server during the no-reload HMR sequence; coordinate startup verification afterward. Root 4173 remains standard normal-HMR CLI PID 57862 at this checkpoint; 4174 stays stopped with all rehearsal artifacts retained. No code repair or restart was made for the 3/3 receipt recording. Existing implementation authorization and M2/M3 pre-commit editorial stops still apply.


## Historical procedure: final M1 startup gate

Full normal-HMR containment now passes 21/21, matched to `.gev-logs/phase2a-m1/manual-hmr-2026-10-21T15-17-16.201Z-2LWL9Y/receipt.json` (SHA-256 `bb792c99a9d50f3bdb0e2367045625eb0f7d0e61e39909b84ac8a4d7a156492a`), with all ten cases explicit PASS, exact five-file restoration and no interruption. QA 10/10 and tracking 109/0/0 stay recorded. Do not ask to repeat the completed full sequence or historical clarification.

Only invalid-content fresh startup remains before the M1 commit. The user runs ignored `manual-hmr-check.mjs --startup`: initial readiness PASS, then malformed registry is held while the helper waits for a verified-restart marker. The user sends ready plus the printed receipt path. Before stopping only the correct 4173 listener, verify the matching request, live helper, held malformed bytes, listener command/working directory and loopback binding. Restart standard root CLI with normal HMR, preserving security/provider policy/cache; no dev-fresh or HMR/overlay disable. Recheck the helper and held fixture after restart and before writing any marker. If the user cancelled, keep normal serving available but record interrupted verification.

After native verification of a distinct new listener while malformed bytes remain, atomically write that run's `verified-restart.json`: matching request id/root/port/source hash, distinct previous/new PIDs, `normalHMR:true` and `checkedAt`. The helper then collects user fresh-start isolation and restoration-recovery observations. It never drives a browser or restarts the server itself. Exact marker contract is in `PHASE-2A-VALIDATION.md`. No restart or marker has occurred at this preparation checkpoint. Helper v3 passes 12/12 isolated control-flow tests (report `helper-tests/isolated-run-pBTDLc/results.json`); those do not prove rendered startup behavior.

Keep M1 uncommitted and M2 unstarted until startup passes and originals restore; then proceed under existing authorization with M2/M3 pre-commit editorial stops. Actual FAIL restores/stops under unchanged criteria. Browser policy denial persists, so no alternate tab/driver/CLI browser workaround. Port 4174 stays stopped and all rehearsal artifacts remain retained.


## Historical checkpoint: startup observations pending

User startup run is `.gev-logs/phase2a-m1/manual-hmr-2026-10-21T15-29-48.392Z-tjdb7l/`. Correct helper PID 40002/request nonce `4b989425-5878-4455-851a-7c2f8ae4de94` and held `{` were verified. Only root Vite listener 57862 was stopped; standard normal-HMR CLI is now PID 41062 on `[::1]:4173` (Node 24.22.0), with unchanged policy/projection/cache and five native HTTP 200 checks. The matching verified-restart marker was atomically written after live-helper/fixture rechecks. The first config probe's literal-true assumption was corrected against installed Vite's default-enabled semantics without a configuration change.

The helper accepted the marker and awaits user fresh-page isolation and restoration-recovery answers. Native serving is not rendered startup proof. Do not restart again or run validation/build suites while the helper owns intentional malformed JSON. Do not concurrently restore from another owner; helper restores after PASS/FAIL/cancel. Await the user's final startup receipt, verify its three explicit PASS answers/restart metadata and all five originals before completing/committing M1. If user reports FAIL, stop/report under unchanged criteria. Browser denial persists; no alternate driver. M2 has not started; Phase 2b remains deferred; 4174 and rehearsal retention remain unchanged.


## Current M1 validation complete; M2 authorized

The user-owned startup receipt completed 3/3 explicit PASS at `2026-10-21T15:35:51.173Z` (`manual-hmr-2026-10-21T15-29-48.392Z-tjdb7l/receipt.json`, SHA-256 `049170c48ee97ce3c6a0ea30034b5086aae29523c31e6f9d205b23025852a632`). Restart metadata matches the verified marker; all five originals independently restore exactly; helper exited; projection and policy hashes stay unchanged. Current content check passes. Full HMR 21/21, QA 10/10, tracking 109/0/0 and all recorded native/build gates pass. PID 41062 remains standard normal-HMR loopback 4173; 4174 stays stopped. Do not repeat the completed gates or ask for implementation approval again.

Commit the buildable M1 milestone after exact two-upstream-file diff review, then proceed with approved M2. Stop before committing M2 and list all nine original articles with references, specifically both Spatial Intelligence summaries for comparison against originals. M3 retains its separate pre-commit case editorial review. Final Phase 2a acceptance is still required; Phase 2b stays deferred. Browser denial persists; user-owned receipts are not agent browser executions.

## Current M2 editorial stop — October 21

M1 is committed as `e19e0f22148a71dd8c798b0396b7a8ac143e6334`; its startup receipt passed3/3 and all earlier M1 gates/restoration are complete. M2 working-tree implementation contains nine original articles, seven upstream-documentation publications and local search; no M3 cases exist. Full unit/allocation suite passes8265/0 with one platform skip; native typecheck/format/boundaries/doctor/policy/library checks pass. Both unmodified production builds now exit0 after preserving the old dependency installation and running npm ci with identical manifest/lock. Full native checks pass again; initial copy-delayed attempts exited143 and remain recorded as interrupted. User-run12-check QA, five article-HMR observations and theme/narrow/keyboard/search-responsiveness checks remain pending. Normal root server is PID83193 on localhost:4173;4174staysstopped. Stop before staging/committing M2 for the required user editorial review of all nine articles, explicitly both Spatial summaries. Exact paths/references/evidence are in `docs/custom/PHASE-2A-VALIDATION.md`. The agent has not run any browser harness. Keep all failure/receipt evidence; any observed containment failure means stop/report.

## Current M2 verification stop after editorial approval — October21

User approves all nine M2 articles, including both Spatial summaries, and reports manual UI passed. Do not ask to reapprove unchanged articles. User requests M2commit then M3, but actual latest QAreceipt16:33:03.652Z is11/12/overallfalse; user confirms postedlatest. HMRreceipt16:33:03.697Z is5/5/restored, but serverlog12:34:32/37/38EDT broadcasts full-reload duringitswindow. InstalledVitecode confirms these are globalreloadcommands; actualbrowsernavigation remainsunobserved. Explicit containment stop/report applies: noM2commit/staging orM3implementation; do notweakenHMR/no-overlay/no-reloadrequirements. Allnativegatespassandall9article/restorationhashesmatch. Full evidence in docs/custom/PHASE-2A-VALIDATION.md and .gev-logs/phase2a-m2/acceptance-review-2026-10-21/. No repair performed duringthisaudit. Root4173 PID83193 normalHMR;4174stopped. Phase2bdeferred.

## Current M2 repair authorization and amendment hold — October21

User authorizes fixing search QA and article HMR within the existing allowlist without weakening checks; retain all9article approvals/allreceipts and holdM2commit/M3untilverification. Search harness/filter regression and catalog retained-callback repair are implemented in already approved custom paths;29native checks pass. NativeViteprobes confirm raw/base orphan nodes cause globalreload, and browser-only alternatives fail fullCRUD. Reviewed namedDEVHMRprototype passes28checks but is not installed. It requires one additional original-upstream file `src/tooling/viteBuild.test.mjs` to recognize/strictlytest the legitimate plugin (63→64); no approval inferred. Proposed patch/notes are under .gev-logs/phase2a-m2/repair-analysis-2026-10-21/. Keep shipping build/customHub.js and upstream test unchanged pending amendment reply. No newdeps/endpoints/servervalidation/overlay suppression/plugin-name disguise. Existing normalHMR83193remainsup;4174stopped. Browser/user checks remain pending and priorcontradictory receipts remain historical.

## Approved M2 HMR amendment — October 21

The user's explicit “Approve this amendment” permits adding only `src/tooling/viteBuild.test.mjs` to the Phase 2a original-upstream allowlist, increasing the implementation inventory from 63 to 64 paths. Current original-upstream allowance: `package.json`, `package-lock.json`, and `src/tooling/viteBuild.test.mjs`. This supersedes the earlier amendment-hold/two-file wording for this narrowly approved repair. The named development-only hook lives in already approved `build/customHub.js`; it does not authorize another upstream file, validation endpoint, dependency, provider, or changed content admission. Keep Ajv option (b), exact 26 public input paths, normal HMR, Library-only errors, strict Node/build validation, all receipts, and article approval. M2 commit and M3 remain held until the new search/HMR verification passes. The agent must not execute browser harnesses or bypass the existing browser denial.

## Current M2 repaired verification stop — October 21

The approved 64-path amendment and repairs are installed. Native gates pass (8,276 full unit/allocation passes, zero failures, one platform skip; 38 rendering/search/router and 21 config/policy/harness passes; typecheck/format/boundaries/doctor/Library and both builds pass). Production graph excludes the DEV compiler; globe initial bytes are unchanged. Shipping normal-HMR server is PID21447 at loopback4173, root cwd, standard CLI without HMR override. Vite6's unspecified HMR setting means enabled; dedicated optimizer cache remains. 4174 remains stopped with all logs/worktree retained. Preserve all article approvals and receipts. M2 has not been staged/committed; HEAD remains M1. Await user-run fresh QA12/12 and articleHMR5/5, restoration and strict no-reload/no-overlay/error containment, with new server-log corroboration, before commit/M3. Any containment failure stops/reports. Exact commands/evidence are in the validation record. No browser harness/helper was agent-executed.

## M2 fresh gates resolved — October 21

New user-owned QA receipt17:11:15.946Z passes12/12; new user-reported article HMR receipt17:11:15.989Z-sDhwbs passes5/5 with exact restoration. The normal4173 server log corroborates only HMR updates throughout its window, no global reload/error/restart. Both hashes and snapshots are retained in the M2 acceptance directory and validation record. All nine articles/both Spatial summaries retain editorial approval. This resolves the prior commit/M3 hold: commit M2 under existing user authorization, then proceed with approved M3, preserving its pre-commit editorial stop. Native/build/graph checks already passed. Do not stage the two unrelated untracked duplicate files; preserve them unchanged. Phase2b/final2a acceptance remain deferred.

## Current M3 pre-commit gate — October 21

M2 committed as 6bc45033982de7b9a31c7b49f7b5ff2038ad8d9e after resolved QA12/12 and HMR5/5 gates. M3 is authorized and underway only in approved paths. Keep all six case constraints, no new source/media/codec/dependency, exact supported CTA scope and static-reference provenance. Imagery must remain draft until user-observed current-window A/B coverage supports a concrete example; an async text-only request is pending. Run checks then stop before staging/committing M3, listing every case with references, limitations and CTA scope for user editorial review. All unchanged M2 article approvals and all receipts remain retained. Final2a acceptance and2b are still deferred; 4174 remains stopped. Preserve/exclude both unrelated untracked duplicates.

## Current M3 coverage, rendered and editorial stop — October 21

M2 is committed as 6bc45033982de7b9a31c7b49f7b5ff2038ad8d9e. M3 has sixcasefiles but only fivepublished; satellite-imagery-change remains draftuntil user-observed current-windowA/Bcoverage supports an example. The asyncobservationrequest remains pending. M3nativepasses8,298/0/1, focused107/107, QA-unit6/6, typecheck/format/strictLibrary/boundaries/doctor/bothbuilds/graph. Initialnativeunavailable-focusfailure was fixed withslug+sectioneffect andstrongreuse regression; allfailedlogs retained. Normalroot4173PID58187;4174stopped. Do notstage/commitM3. Await imagerycompletion, userQA14checks, caseHMR5observations withrestoration/no-reloadlogcorroboration, manualthemes/narrow/keyboard/threeCTA scopes, and explicitall-sixcaseeditorialreview. Everycase/reference/actionscope is listed in thevalidationrecord. RetainM2articleapproval/allreceipts. No newupstreamedit/dependency/provider/media/codec; preserve/excludetwountrackedduplicates. Final2aacceptance/2b remain separate.

## Current all-six-case review stop — October 21

The imagery coverage input is now satisfied by user-reported successful A/B rendering plus supplied screenshots: Oct13S30/Oct12L30,30m, URL-suppliedNJbox. Imagerycase is published in the uncommitted working tree with explicit user-observed provenance, mixedsensor/cloud/resolution/HUD/currentwindow limits and no groundchangeclaim. Allsixcasesnowpublished; fourvalidglobeCTAs. NewimageryCTA restorescamera+Esri+layer+box+A/Bmodeonly,nodates/images. Freshaffected107tests/6QA-unit/strictLibrary/typecheck/bothbuilds/graph pass; priorfull8298/0/1 sourcebaseline is retained, notclaimednewcontentfullrun. M2HEADunchanged6bc45033; noM3stage/commit. AwaitfreshuserQA14,caseHMR5+restore/noreloadlog,manualthemes/narrow/keyboard/fourCTAs andexplicitall-sixcaseeditorialapproval. Priorpendingimageryparagraphs arehistorical/superseded. No additionalupstreamrepair; HUD0.27mexistingcameraformula limitation documentedonly. No browser/providerAPI/livehelperexecutedbyagent. Final2aacceptance/2b remain deferred;4174stopped/preservelogsandduplicates.


## Current M3 gates resolved; M4 authorized — October 21

The user explicitly reports QA14/14, caseHMR5/5/restored, all manual theme/narrow/
keyboard/four-CTA checks passed, and approves all six cases/references. Native
review matches the latest UTC22 02:05/02:06 receipts, exact Nepal restoration,
all six manifest hashes and only HMR updates in the matching normal-server log.
Acceptance snapshots: .gev-logs/phase2a-m3/acceptance-2026-10-21-vzi0ewdx/.

Commit M3 under the existing 28-path scope, excluding the I1 plan and both
unrelated duplicates. Then commit only docs/custom/FREE-IMAGERY-PLAN.md separately,
as explicitly requested, and proceed with the unchanged Phase2a M4 clean-install/
native/build/graph/final-diff checks. Final user-owned QA/tracking and explicit
Phase2a acceptance remain required. Preserve all historical receipts and article/
case approvals. Do not execute browser harnesses or re-run completed live helpers.
I1's approved 47-path plan (including the QA amendment and near-cap measurements)
does not authorize runtime work before Phase2a closes and the user gives the go.
Verify the current listener before any M4 stop/restart; retain 4174 stopped/logs.


## Historical M4 native checkpoint and dependency-review hold — October 21

M3 is committed dae36cf0de737116615fd9e5efc615be965cd81e after verified user
QA14/14, caseHMR5/5/restoration/no-reload evidence and explicit manual/editorial
approval. I1 plan is separate docs-only a860327edc694fbcc313eb0791629fe88070a0b0.

M4 clean installation, Library/typecheck/boundaries/format/doctor/policy, full
allocation suite8298/0/1, both production builds and actual graph review pass.
Terrain cache restored exactly; current manifest/lock/unrelated duplicates stay
unchanged. Logs: .gev-logs/phase2a-m4/native-l6z71yrc/. Normal root CLI is restored
on loopback4173 PID65378; verify identity before any later stop.4174staysstopped.

npm audit now reports advisories in unchanged lockedVite6.4.3. Concrete reviewed
6.4.5 manifest/lock candidate lives only in the ignored vite645-review directory:
475otherlockrecordsunchanged, isolatedauditclean, patchunapplied. User approval
has been requested because M4 was validation with unchanged dependencies. Do not
apply or run audit-fix without that decision.6.4.4 is unsuitable due a follow-up
regression; official references and impact limits are in the validation record.

After the intended dependency state is verified, give final user-owned QA14 and
tracking109 commands; preserve the browser-denial boundary and all prior article/
case approvals. Do not accept Phase2a before the user's explicit final acceptance.
No I1 runtime/provider/credential implementation is authorized by this checkpoint.


## Current M4 Vite repair verified; final user checks pending — October 21

The user explicitly approved the reviewed Vite 6.4.5 patch. It is applied only to
`package.json` and `package-lock.json`, preserving all other 475 lock records.
The Phase 2a original-upstream allowance remains those package files and the
specifically approved `src/tooling/viteBuild.test.mjs`. The frozen source/doc pin
remains `064d51f7be2675f1c69e16068e9c49d1a60144d1`.

Fresh clean install/audit (zero known vulnerabilities), Library/typecheck/
boundaries/format/doctor/policy, full unit/allocation suite (8,298 passed, zero
failed, one platform skip), both builds and production graph checks pass. Actual
installed-Vite native HMR fixtures pass; they do not replace rendered observations.
Terrain cache, article/case bytes, unrelated duplicates and historical receipts
are preserved. Evidence: `.gev-logs/phase2a-m4/vite645-kp6255jw/`.

Standard root CLI with normal HMR is restored on `[::1]:4173`, verified Vite PID
84521; verify identity before any later stop. Port 4174 remains stopped. Await
fresh user-owned QA 14/14, article HMR 5/5, case HMR 5/5 with exact restoration
and no automatic reload/overlay/error, and tracking 109/0/0. Corroborate helper
windows against the new server log. Existing article/case editorial and manual
approvals carry forward. Preserve browser denial; no agent harness/helper or
alternate driver. Any actual containment failure requires restoration and
stop/report without weakening checks. Final Phase 2a acceptance remains explicit
and pending. I1 and other Phase 2b runtime work require that acceptance and a
separate implementation go-ahead.
