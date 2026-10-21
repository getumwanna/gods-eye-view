# Phase 2a validation

Updated October 21, 2026. **Milestone 1 validation complete.** Native gates, tracking 109/0/0, hub QA 10/10, full normal-HMR containment 21/21 and invalid-content startup 3/3 pass. All fixtures restore exactly. The buildable M1 commit and M2 work are already authorized; M2/M3 editorial stops and final Phase 2a acceptance remain. Phase 1 remains accepted. Phase 2b is deferred. No milestone 2 article or milestone 3 case is authored, published or committed.

## M1 final startup result — passed

The user-owned startup helper has completed **3/3 explicit PASS** observations: initial readiness, fresh startup with malformed Library JSON isolated to Library, and automatic restoration/recovery under normal HMR. Receipt `.gev-logs/phase2a-m1/manual-hmr-2026-10-21T15-29-48.392Z-tjdb7l/receipt.json` finished `2026-10-21T15:35:51.173Z`, scope `invalid-content-startup`, outcome passed, interrupted false, restored true, overall passed true. SHA-256: `049170c48ee97ce3c6a0ea30034b5086aae29523c31e6f9d205b23025852a632`. Its restart metadata exactly matches the agent's verified marker (request id, PID 57862 to 41062, HMR, timestamp and held-content hash). The agent did not execute this browser check.

All five current files independently byte-match the helper's saved originals. Projection/policy hashes remain unchanged; the helper exited. Snapshot and final hashes are `startup-passed.json` and `startup-final-verification.json` under `.gev-logs/phase2a-m1/user-verification-2026-10-21/`. After restoration `npm run check:library` passes the complete M1 corpus. PID 41062 remains the sole loopback 4173 standard CLI listener with normal HMR; 4174 is stopped. No additional browser rerun or historical clarification is required.

All M1 gates are now complete: dependency/install review, strict Node validation and 24 negative command cases, typecheck, 8,235 native unit/allocation passes (one platform skip), boundaries, formatting, doctor, both builds, actual production graph isolation, user QA 10/10, tracking 109/0/0, full HMR 21/21 and startup 3/3. Source facts/guide compatibility and exactly two original-upstream diffs are preserved. The buildable M1 commit may proceed, followed by already approved M2 implementation. This does not accept Phase 2a as a whole: stop before committing M2 for editorial review of all nine articles and their references, then preserve M3's separate case review and final acceptance.

## Historical startup checkpoint — server restart

The user staged startup run `.gev-logs/phase2a-m1/manual-hmr-2026-10-21T15-29-48.392Z-tjdb7l/`, request `4b989425-5878-4455-851a-7c2f8ae4de94`. Its initial readiness answer is PASS. The agent independently verified matching request/root/port, helper PID 40002 and checkout, exact held `{` bytes (SHA-256 `021fb596db81e6d02bf3d2586ee3981fe519f275c0ac9ca76bbcf2ebb4097d96`), unchanged four other files, and sole listener PID 57862 at `[::1]:4173` with the standard Vite command and checkout.

Only that verified listener was terminated. Standard `HOST=localhost PORT=4173 npm run dev -- --strictPort` with Node 24.22.0 restarted the server as **PID 41062**, sole loopback listener `[::1]:4173`. Resolved host/port/strictPort/cache match the approved configuration. Normal HMR uses Vite's enabled default: the first probe incorrectly expected a literal `true`, then was corrected against installed Vite 6.4.3's `server.hmr !== false` behavior, without changing configuration/source or turning any feature off. The native probe mismatch was not a product acceptance failure. Startup logs confirm the persistent Hong Kong/Taiwan OFF policy.

While the malformed registry remained held, five native requests returned HTTP 200: root document, hub document, globe entry, globe metadata adapter and raw Library registry module. This establishes native serving only, not rendered globe/Library behavior. Metadata-projection and policy hashes are unchanged. The live helper and held fixture were rechecked, then the matching per-run `verified-restart.json` was written atomically. The helper accepted it and now awaits user fresh-start isolation and recovery observations. No agent browser execution occurred.

Native proofs, safe resolved flags, marker and log are retained in that run directory as `restart-native-before.json`, `resolved-startup-config.json`, `restart-native-after.json`, `verified-restart.json`, `restart-verification-notes.json` and `dev-normal-startup.log`. The user must freshly load globe/Dashboard/Settings/Library, confirm the error is confined to Library, then let the helper restore the registry and confirm normal-HMR recovery. Startup is not passed until the three-observation receipt completes and all originals independently restore. Do not run content/build suites or commit while the helper deliberately owns malformed input. M1 remains uncommitted; M2 stays unstarted.

## Current checkpoint — full HMR containment passed

The user reports **21/21 passed**, matched to `.gev-logs/phase2a-m1/manual-hmr-2026-10-21T15-17-16.201Z-2LWL9Y/receipt.json`, finished `2026-10-21T15:20:01.608Z`. Scope is full-sequence, all ten selected cases have explicit PASS for isolation and recovery, plus initial readiness; planned/completed assertions are 21, outcome passed, interrupted false, restored true, overall passed true. Receipt SHA-256: `bb792c99a9d50f3bdb0e2367045625eb0f7d0e61e39909b84ac8a4d7a156492a`. It used the tested version 2 helper (`4703a5f6fb303d6be477b5a2524e981be896a38c4fc65a4a78ee0173bff4d440`).

All five current files independently byte-match this run's saved originals. Snapshot and verification hashes are `full-containment-passed.json` and `full-containment-verification.json` under `.gev-logs/phase2a-m1/user-verification-2026-10-21/`. The agent did not execute this browser test. Existing QA/tracking/native receipts remain valid; no product source changed during these checks.

### Remaining gate: invalid-content fresh startup

Use the ignored helper's startup mode, separate from the completed no-reload sequence:

```sh
cd /Users/getumwanna/Documents/GEV
node .gev-logs/phase2a-m1/manual-hmr-check.mjs --startup
```

With the globe and Library open, answer the initial readiness prompt. The helper then writes the deliberate single-byte malformed registry and pauses in `awaiting-restart`, printing its receipt path. Leave that terminal open and tell the agent **“ready for startup check”** with that path. Ctrl-C cancels and restores. The helper itself never starts/stops a server or controls a browser.

Before restarting, the agent must verify the matching request ID, live helper, held `{` bytes, root checkout, sole localhost:4173 listener and its command/cwd; abort if the fixture was already restored or any identity disagrees. Stop only that verified listener and restart standard `HOST=localhost PORT=4173 npm run dev -- --strictPort` on supported Node, with normal HMR and unchanged provider/security/cache settings. Do not use dev-fresh/Keychain loading, HMR-off or overlay disabling. Verify the new loopback listener differs from the previous PID and malformed bytes remain in place. Native HTTP/startup checks may be recorded as native checks only, not rendered evidence.

Recheck that the helper is still waiting and the malformed bytes remain after restart; if the user cancelled, keep normal serving available but record an interrupted startup check. Only after successful native verification, atomically write `verified-restart.json` into that exact run directory. It must match the request's id/root/4173/invalid-file SHA-256, declare `normalHMR:true`, give distinct positive previous/new PIDs and an ISO `checkedAt`. The helper waits for this marker, validates it, then asks the user to freshly load globe/Dashboard/Settings/Library and confirm the error is confined to Library with no global overlay, unhandled error or server exit. The intentional restart is explicitly outside the no-reload HMR criteria. On PASS, the helper restores the registry and asks for automatic Library recovery under the new normal-HMR server.

This is a three-observation startup receipt with scope `invalid-content-startup` and restart metadata. FAIL restores/stops; cancellation is interruption, not failure. A completed startup pass plus exact restoration resolves the last M1 gate, after which the already approved buildable M1 commit and M2 work can proceed with the existing editorial stops. No new implementation approval is needed. M1 remains uncommitted until this startup evidence arrives; Phase 2b remains deferred.

Version 3 of the ignored helper adds only this explicit startup coordination mode. The tested version 2 source, its full 21/21 receipt and all older evidence are retained; the completed sequence need not be repeated for this helper-only change. Startup helper control flow passes **12/12 isolated Node 24.22.0 tests**, including the eight prior regressions plus matching/mismatched startup markers and SIGINT/EOF during the wait. All fixture files restore exactly. Report: `.gev-logs/phase2a-m1/helper-tests/isolated-run-pBTDLc/results.json`; tested version 3 helper SHA-256: `6089668fe13895d3311a33f3c49788292a3dd1306871d2415f97f336d91627a4`. These are control-flow tests with a stubbed Node validator and fake marker in a throwaway root, not rendered startup evidence.

## Historical checkpoint — schema-field repeat passed

The user reports **3/3 passed** for the strict-input single-checkpoint run. This matches `.gev-logs/phase2a-m1/manual-hmr-2026-10-21T14-40-39.581Z-6zbGnY/receipt.json`, finished `2026-10-21T15:11:18.113Z`: initial readiness, version=2 Library-only error isolation, and automatic HMR recovery are all explicit PASS answers. Scope is `single-checkpoint`, selected case `schema-field-violation`, planned/completed assertions three, outcome passed, interrupted false, restored true and overall passed true. Receipt SHA-256: `b5c94d91599f6b469a34c0ed8cddb6bd0359798986599c34648f52adc259f383`; helper hash matches the tested version 2.

All five files independently byte-match this run's saved originals. Both older receipts are unchanged. Snapshot/hash evidence is retained as `schema-field-repeat-passed.json` and `schema-field-repeat-verification.json` under `.gev-logs/phase2a-m1/user-verification-2026-10-21/`. The earlier unknown response no longer blocks this checkpoint; it remains historical inconclusive evidence, not a confirmed defect or pass. The agent did not execute this browser check.

**Remaining before M1 commit:** the complete normal-HMR sequence (21 observations covering all ten cases) and invalid-content fresh-start verification. The existing default helper, without `--case`, runs that complete sequence:

```sh
cd /Users/getumwanna/Documents/GEV
node .gev-logs/phase2a-m1/manual-hmr-check.mjs
```

Keep the globe and `/hub/#/library/sources` open. Observe each prompt, wait for HMR, and use explicit PASS/FAIL. Any FAIL restores inputs and stops; describe the observed symptom. Do not restart the server during this full HMR sequence. Coordinate a separate invalid-content startup check afterward so an intentional restart is not mixed into the no-reload criterion. The existing 10/10 QA and 109/0/0 tracking passes do not need repeating for this documentation/helper-only checkpoint. M1 remains uncommitted and M2 unstarted; Phase 2b is deferred.

## Historical procedure — authorized single-checkpoint repeat

The user replied **“I don’t recall that run; repeat the checkpoint.”** This resolves the historical clarification request as unknown and explicitly authorizes a fresh repeat; it does not waive any criterion or establish a product failure/pass. The preserved old receipt remains unchanged and annotated as inconclusive in `user-authorized-checkpoint-repeat.json`. Do not keep asking the user to reconstruct that run.

All five restored originals still hash-match the saved backups. `npm run check:library` passes with the complete M1 corpus. Standard root CLI listener 57862 remains unchanged on localhost:4173 with normal HMR; 4174 stays stopped. No startup restart or product repair was performed.

The ignored user-run helper has a version 2. Its original source is retained under `helper-tests/` with its SHA-256 in the filename. It accepts only normalized PASS or FAIL and re-prompts on every other response without recording an assertion; records the explicit permitted answer, helper hash and selected scope; and distinguishes interrupted runs from failed checks. Raw invalid input is neither logged nor saved. Fixture restoration and exact criteria are unchanged.

With the globe and `http://localhost:4173/hub/#/library/sources` open, run:

```sh
cd /Users/getumwanna/Documents/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0
node .gev-logs/phase2a-m1/manual-hmr-check.mjs --case=schema-field-violation
```

There are three observations: initial readiness; version=2 produces an accessible error confined to Library while Dashboard/Settings/globe remain usable with no reload/overlay/unhandled error/server exit; exact restoration recovers Library through normal HMR without a manual refresh. A single-case 3/3 result covers only this checkpoint. The complete 21-observation sequence and invalid-content startup still require verification before M1 can be committed. If FAIL is entered, the helper restores inputs and stops; report the symptom and retain the receipt. Browser inspection remains user-run under the existing policy boundary.

Isolated helper-only Node checks pass **8/8** under Node 24.22.0. The report is `.gev-logs/phase2a-m1/helper-tests/isolated-run-wqVqcy/results.json`; tested helper SHA-256 is `4703a5f6fb303d6be477b5a2524e981be896a38c4fc65a4a78ee0173bff4d440`. Cases cover single/full scope, blank/typo re-prompting, explicit FAIL, SIGINT, SIGTERM, EOF and invalid selectors; all five fixture files restore exactly. These checks use a throwaway root and stubbed Node validator, never live content or a browser; they do not validate product HMR or rendered browser behavior. No agent browser execution or live-content mutation is substituted for the user's observations.

## Latest user verification — unresolved manual response

The user reports **10/10 hub/Library QA passes**. This matches `.gev-logs/qa-custom-hub-2026-10-21T03-01-12-715Z.json`, timestamp `2026-10-21T03:01:12.716Z`, SHA-256 `856bb6722271a88682daeaa7e10d7c25ce90d7b58001eb9628a5cce0d3cc442d`: all ten assertions and overall `passed` are true, HTTP 200, no page/resource/optimizer errors. Eight blocked acquisition requests and two read-only setup reads are expected harness counters, not observations of working feeds. The agent did not run this browser harness.

The latest manual run (`manual-hmr-2026-10-21T03-01-12.815Z`) was interrupted at the first malformed-JSON case. It finished at `2026-10-21T14:20:45.358Z` with `restored:true`, one initial Library/globe PASS and zero failed assertions. Overall `passed:false` means the complete sequence was not finished, not a second failed containment case. The user reports restoration; independent SHA-256 comparison confirms all five files (both manifests, both schemas and `SECURITY.md`) match this run's saved originals byte-for-byte. The helper is no longer running. Finished-receipt SHA-256: `96d0ebb8809dab4973bcf13873979491bbc11367656064b1a89247ab7ddcd700`.

However, the earlier completed receipt `.gev-logs/phase2a-m1/manual-hmr-2026-10-21T02-54-39.936Z/receipt.json` records **`schema field violation: isolated error` = false**, after five successful assertions (initial readiness and malformed-JSON/invalid-schema-definition error and recovery). That run finished at `02:57:19.275Z` with originals restored and overall `passed:false`. Its SHA-256 is `5e732dc0a47e33bbd07a230874d6bcae168f1b03dfeef894f0ec6e26de9fb8a4`. The checkpoint did not pass and remains unresolved. The helper accepts only trimmed, case-insensitive `PASS`; a literal `FAIL`, blank response, typo or pasted text all produce the same false field. No raw response is retained. Earlier assistant wording that called this an explicit FAIL or a confirmed containment defect was too strong. The receipt cannot identify the entered answer or any product symptom. Preserve it, keep the acceptance gate closed, and establish whether the user recalls an observed failure, unintended input or an unknown result before further gate work.

The requested startup restart was **not performed** after discovering the earlier failure. Verified listener PID 57862 remains the standard root Vite CLI in `/Users/getumwanna/Documents/GEV`; HMR and security/provider settings are unchanged. The helper has now restored its fixture and stopped; no concurrent restoration was performed. Restoration resolves the unsafe working-copy state, but the earlier negative answer remains unexplained. Ask what the user observed at that earlier checkpoint, or whether its answer was unintended, before further gate work. No source repair or acceptance requirement was changed.

Immutable receipt snapshots, the checkpoint record, the finished `manual-restored-receipt.json` and five-file `restoration-verification.json` are retained under `.gev-logs/phase2a-m1/user-verification-2026-10-21/`. The older pending QA instructions below are historical workflow; the remaining blockers are the recorded containment failure and invalid-content startup verification. M1 remains uncommitted; no M2 work starts.

## Normal-HMR prerequisite resolved

The user attachment `/Users/getumwanna/.codex/attachments/239d8f75-1cc1-488d-9204-13364d265bde/Pasted text.txt` reports **109 passed, zero failed, zero skipped** for `test:track --offline-imagery` against 4173 in normal HMR mode. It matches the retained tee log `test-track.cp46s0`. The completed server run has no reload entry. This activates the user's existing authorization for milestone 1 onward; no duplicate implementation approval is required.

Evidence: `.gev-logs/normal-hmr-2026-10-20.3KpYkt/user-normal-hmr-result.txt` and `normal-hmr-result.json`. Attachment SHA-256: `7156d63039ee549346ca0ffde1843adc4514798aa8c4c8262ad6b51535fd5c7e`. The earlier 88-pass/context-destruction run remains an incomplete, separate result; neither this pass nor the earlier HMR-off pass establishes its exact event-level cause. The agent did not execute either browser harness.

## Milestone 1 implementation and scope

- Registry: 48 source providers, 149 individually described products, 12 credential capabilities (11 setup identifiers plus Ontario's environment-only key), 32 layers/34 classified values and 38 compatible source guides.
- Manifest: exactly seven reviewed upstream documents/25 frozen sections and hashes, unpublished in this milestone; zero articles/cases.
- Strict Node validation is authoritative for `check:library` and both builds. Raw imports, DEV-only lazy Ajv, exact frozen-admission checks, bounded parsing and accessible errors are confined to Library. No configuration-time content validation or new top-level Vite plugin is added.
- The globe reads only the explicitly generated, validated metadata projection. Invalid input never rewrites it. Directory facts are Static reference information; per-value kinds and “Not checked in Library” feed health remain separate.
- Only `package.json` and `package-lock.json` are changed original-upstream files. No upstream test/security/provider owner is edited. Existing locked versions are preserved. See `PHASE-2A-DEPENDENCIES.md` for the exact six additions, licenses, install/audit findings and bundle roles.

Separate full upstream diffs, captured before the milestone commit:

- `.gev-logs/phase2a-m1/package.json.patch`: exact dependency additions, new `check:library`, both build preflights.
- `.gev-logs/phase2a-m1/package-lock.json.patch`: corresponding lock graph; all previously locked versions unchanged.

These patches and all implementation changes remain uncommitted pending the containment gate. They are review evidence, not a request to reapprove already authorized implementation.

## Native checks

Supported Node 24.22.0 / npm 11.19.1. Evidence lives under `.gev-logs/phase2a-m1/`.

| Gate                                    | Outcome                                                  | Evidence                                                                                    |
| --------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Clean `npm ci`                          | Passed; existing stack audit finding retained separately | `npm-ci.log`, dependency review                                                             |
| `npm run check:library`                 | Passed, complete M1 corpus/projection                    | `check-final.log`                                                                           |
| Hub typecheck                           | Passed                                                   | `typecheck.log`; final recheck recorded separately                                          |
| Allocation-gated unit suite             | **8,235 passed / 0 failed / 1 platform skip**            | `unit-allocation-final.log` (8,220 ordinary + 1 focus + 14 world-overlay allocation passes) |
| Node Library focused suites             | 54/54 passed                                             | `node-validation.log`                                                                       |
| SSR/Library compatibility and rendering | 11/11 passed                                             | `root-focused-final.log`                                                                    |
| Boundaries                              | Passed, no new exception                                 | `boundaries-final.log`                                                                      |
| Doctor                                  | Passed; no key configured                                | `doctor.log`                                                                                |
| Runtime formatting                      | Passed                                                   | `format-final.log`; final recheck recorded separately                                       |
| Root and panel production builds        | Both passed; existing large-chunk warning                | `build-final.log`, `build-panel-final.log`                                                  |
| Invalid-input command matrix            | **24/24 expected failures**, no builder invoked          | `negative-gates/receipt.json`, individual logs/fixtures                                     |

The matrix runs malformed JSON, invalid schema definition, schema-field violation, missing admitted file, missing section, rejected path, dangling reference and stale projection through each actual npm command: `check:library`, `build`, `build:panel`. All fail during validation; neither builder trap executes. Diagnostics expose no sentinel input or absolute path. Unit tests additionally cover source/setup/value identities, unknown/dangling references, mixed values, immutable compatibility models, safe URLs, realpath/symlink containment, limits, sanitized errors, original-item provenance and explicit deterministic projection generation.

The first native run failed because the custom SSR adapter did not accept Prettier's optional trailing commas. That was repaired in the custom helper. A separate unchanged upstream terrain test expected two upstream fixture calls, but the second coordinate was already in the existing runtime terrain cache. Its isolated rerun reproduced the failure. The successful full rerun temporarily isolated that one cache file and then restored its SHA-256-identical original; see `terrain-cache-isolation.json`. No upstream source/test/assertion was changed. Earlier failed logs are retained.

## Production graph and bundle evidence

`bundle-review.json` records actual Rollup chunk/module graphs and raw/gzip/Brotli sizes. Both static entry graphs exclude editable content, Library loader, Markdown, MiniSearch and Ajv. The globe has its own CSS asset; hub styles do not enter its entry graph. There are **zero Ajv compiler or schema-validator modules in production output**. The dedicated development optimizer includes Ajv before serving the app; the lazy browser import still happens only on Library use.

| M1 output                                                         | Raw bytes |      gzip |  Brotli |
| ----------------------------------------------------------------- | --------: | --------: | ------: |
| Initial hub static JS graph (includes existing shell/shared code) |   395,877 |   125,725 | 108,279 |
| Initial globe static JS graph                                     | 3,565,887 | 1,106,868 | 834,049 |
| Library code chunk                                                |    14,450 |     5,108 |   4,445 |
| Library manifest raw module                                       |    13,846 |     3,165 |   2,575 |
| Source registry raw module                                        |   453,098 |    26,272 |  18,827 |

These are code/transfer measurements, not rendered latency, FPS or live-feed evidence. The source registry is the largest Library data chunk and is loaded behind the route boundary. M2 will measure its completed article/search corpus and additional renderer/search chunks. The approved isolated Ajv comparison remains in `PHASE-2A-REVERIFICATION.md`; it is not substituted for these product measurements.

## Browser gate: pending, observation denied

The original in-app path was selected. Attempting to observe the existing shipping tab was explicitly rejected by browser security policy: its URL protocol gate did not grant authority to observe content. No alternate tab, browser, raw CDP, browser-driving shell or indirect execution was used. The agent has not executed `qa:hub`, `test:track` or the manual helper. This is **blocked verification**, not a failed product assertion and not an HMR-containment pass.

Shipping runs through standard `HOST=localhost PORT=4173 npm run dev -- --strictPort`, normal HMR enabled, loopback only (PID 57862 at this checkpoint). Its startup log is `dev-normal-hmr.log`. 4174 remains stopped; rehearsal worktree and 94 logs remain retained. No HMR-off or overlay-disable workaround is permitted.

Run from this exact directory:

```sh
cd /Users/getumwanna/Documents/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0
QA_BASE_URL=http://localhost:4173 npm run qa:hub
node .gev-logs/phase2a-m1/manual-hmr-check.mjs
```

The expanded QA retains the nine established hub/globe checks and adds Data Sources filtering, Ontario's key requirement, explicit unchecked feed health and an empty state: **10 checks total**. Provider/API acquisition remains blocked by that harness. The existing normal-mode tracking prerequisite is already passed; no redundant tracking rerun is requested here.

The manual helper never drives or reads a browser. It backs up a fixed set of public repository files, makes one controlled reversible edit at a time, waits for the user's observation, restores the exact bytes and checks recovery. It stops and restores on the first failed answer or Ctrl-C. Keep the globe and `/hub/#/library/sources` open; use browser Network/Console with preserved logs to detect automatic document navigations, global Vite overlays and unhandled errors. For every case:

1. Library displays an accessible content error; Dashboard/Settings and the globe remain usable, the globe document/view is retained, and the dev server stays up.
2. No automatic full-page reload, global overlay or unhandled JavaScript error occurs.
3. Restoring the input recovers Library through normal HMR, without a manual page refresh; the globe remains usable.

Cases cover malformed JSON, invalid schema definition, invalid schema field, missing registry, missing schema, missing admitted document, changed admission, dangling reference, unsafe path and stale projection. The helper's retained assertion-only receipt and original-file hashes live under its printed `manual-hmr-*` directory. The temporary `SECURITY.md` deletion is a validation fixture restored byte-for-byte, not an upstream repair. Report any failed checkpoint; **stop rather than weaken containment**.

Still required before the M1 commit: the above browser results and invalid-content startup confirmation. For the latter, preserve a malformed Library input, restart the standard dev command, and confirm globe/Dashboard/Settings load while Library alone shows its error; restore the input afterward. Coordinate the running listener before restarting—do not kill an unverified PID. Actual browser checks of dark/light, keyboard/mobile layout and later article/search/case routes remain milestone/final gates; native/SSR evidence is not substituted for them.

## Milestone and editorial stops

M1 cannot be committed or treated as complete until containment is verified. After it passes, show the two upstream diffs, commit the buildable registry/directory milestone and continue under existing approval. At the end of M2, run checks and list all nine original articles with primary references for review **before committing**; identify both Spatial Intelligence summaries and their original URLs. After that editorial review resolves, commit M2 and proceed to M3's six case pages with the same pre-commit review rule. Final Phase 2a acceptance remains a separate user decision. Phase 2b remains deferred.


### Transcript and parser clarification — October 21

The full transcript supplied by the user corresponds to the later `03:01:12.815Z` run: initial readiness PASS, then Ctrl-C at malformed JSON, with exact restoration. It contains no schema-field step or failed answer and does not describe the separate `02:54:39.936Z` run. The parser classification and helper hash are retained in `.gev-logs/phase2a-m1/user-verification-2026-10-21/response-classification.json`. No helper, product source, receipt or assertion was edited. No restart or new browser test was performed. Containment remains unverified; a product defect is not established by the older Boolean alone.
