# Phase 2a validation

Updated October21,2026. **M2 article approval retained; repairs are in progress, with the HMR plugin amendment awaiting approval.** Search QA state isolation and retained-callback fixes are implemented inside existing approved custom files. A review-only HMR prototype passes28native lifecycle checks but is not installed in shipping; it requires adding only `src/tooling/viteBuild.test.mjs` to the original-upstream allowlist (inventory63→64). Current user instruction authorizes repairs within the existing allowlist, preserves all article approval/receipts, and holds M2commit/M3until verification passes. No amendment is inferred. Earlier checkpoints below are historical.

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

## M2 Knowledge Center and local search — editorial review stop

The working tree contains nine original articles, seven published upstream-documentation items and all 25 unchanged admitted sections at pin `064d51f7be2675f1c69e16068e9c49d1a60144d1`. Article bodies total 32,365 bytes. Cases have not been authored. The seven upstream records change only their explicit publication flags; their admission paths, revision, lines, section identities, full-file hashes, section hashes and existing notices remain frozen. Published upstream items preserve the complete MIT copyright/permission notice and label selected upstream text separately from original authorship. Unknown upstream publication dates remain null.

The shared Markdown parser supplies the renderer, contents navigation and search with the same heading IDs, including nested list/blockquote headings and repeated titles. Raw HTML, executable links and remote media do not become rendered elements or indexed content. Links resolve to reviewed local articles or pinned HTTPS references. Source-product search links retain canonical group guides and direct provider records when no group exists. No external article body, query telemetry, persistent index, new provider, credential handling, recorder or Phase 2b behavior was added.

Two discovered contract mismatches were corrected within approved files: unknown publication dates were already allowed by the schema and are now accepted honestly by Node; authored route slugs are explicitly bounded to 64 characters in schema/Node to match the existing router. Generic IDs retain their separate 80-character bound. Knowledge route slugs are unique across original, external-summary and upstream kinds. Unicode query clipping cannot leave a split surrogate or throw during URL construction.

### Native verification

| Gate | Result | Retained evidence |
| --- | --- | --- |
| Full Node 24 unit/allocation suite | 8,265 passes, zero failures, one platform skip | `.gev-logs/phase2a-m2/reinstalled-native/unit-allocation.log` |
| Terrain-cache preservation | Original/restored SHA-256 both `2c68ba361b8ccedc9fbdf57969573297ffbc7e2667ffa5ecb773da7516a2f1ab`; no test output cache created | `reinstalled-native/terrain-cache-preservation.json` in that directory |
| Hub typecheck, adopted formatting, boundaries, doctor | All exit 0 | `reinstalled-native/{typecheck,format,boundaries,doctor}.log` |
| Provider policy | Six offline checks pass; both camera packs remain off | `reinstalled-native/policy.log` |
| Strict Library validation | 149 products, 16 published items, seven documents/25 sections; projection current | `reinstalled-native/library.log` |
| Both unmodified production commands | Both complete with exit 0 after unchanged-lock dependency recovery | `build-reinstalled.log`, `build-panel-reinstalled.log` |
| Actual production module graph | No Ajv/schema compiler anywhere; no Library corpus, Markdown or MiniSearch in initial hub/globe graphs | `bundle-review.json` |
| Isolated manual-helper safety | Seven fixture scenarios pass: success, explicit failure, interrupt while missing, typo re-prompt, foreign-edit preservation, closed-input restoration, foreign-symlink preservation | `helper-fixture-tests-v2.json`; no shipping/browser/server activity |

No dependency or lockfile changed after M1. M2 edits no original-upstream file. All application paths stay inside the approved 63-path inventory. The agent did not run any CLI browser harness.

### Dependency environment recovery — preserved and verified

The initial production commands completed compilation in 5.92/4.09 seconds but then spent about ten minutes progressing through Cesium’s filesystem asset-copy cleanup. Native sampling showed a worker waiting in `pread`, with no JavaScript CPU or network activity in the sampled root build. The installed Maki asset directory contained 117 canonical files plus 117 unexpected ` 3.png` copies. Sample duplicates matched canonical bytes and read quickly; the exact OS/FileProvider cause is not established. This was not a product/HMR assertion failure.

Only the verified build processes and shipping listener were stopped. Both initial build attempts exited 143 and remain **interrupted, not passed** in `build.log` / `build-panel.log`. The entire original dependency directory was renamed, without deletion, to `.gev-cache/phase2a-m2-dependency-recovery-wq4m8Z/node_modules.original`. A fresh `npm ci` exited0, preserves identical package.json/package-lock.json SHA-256 values, and all 375 installed lock records match version and integrity. Fresh Maki assets contain117canonical files and zero suffix copies. No package version, application file, provider, credential or original-upstream file was repaired. Evidence: `.gev-logs/phase2a-m2/dependency-recovery.json` and `npm-ci-recovery.log`.

After reinstall, the two **unmodified** build commands exit0 (compilation5.17/4.62seconds), followed by the complete unit/allocation suite8265/0 with one platform skip and all other native gates. The terrain-cache original/restored hashes match again; no test cache was produced. Post-reinstall logs are under `reinstalled-native/`; both initial and final evidence are retained. Production module bytes/graph remain identical to the earlier measurement. The old74.06ms native index sample is retained as `before-reinstall-corpus-search-measurements.json`; the current88.38ms sample includes ordinary runtime variation and is still not a browser latency measurement.

Standard root dev was restarted with `--strictPort --force`: the extra flag only rebuilds Vite’s optimizer after installation; HMR remains normal, with no override/overlay suppression. The verified listener is PID83193 at `[::1]:4173`. Both Hong Kong/Taiwan policy gates remain OFF. The rehearsal listener4174 remains stopped and its artifacts are untouched.

### Corpus and bundle measurements

Production graph measurements use the same root transforms and strict validation with `write:false`, omitting only Cesium’s redundant filesystem asset-copy hook in the ignored measurement script. This is a measurement, not either acceptance build; both unmodified npm build commands still must exit successfully. Full data: `.gev-logs/phase2a-m2/corpus-search-measurements.json`.

| Measurement | Raw | Gzip | Brotli |
| --- | ---: | ---: | ---: |
| Initial hub JS delta from M1 | +2,393 B | +759 B | +563 B |
| Initial globe JS delta from M1 | 0 B | 0 B | 0 B |
| Knowledge Center additional static JS | 44,559 B | 9,912 B | 8,606 B |
| Article route additional static JS | 216,326 B | 62,358 B | 53,839 B |
| Search route additional static JS | 181,089 B | 50,828 B | 44,215 B |

Route costs exclude already-loaded initial hub chunks, include each route’s static dependencies, and overlap each other; do not add them together. Lazy raw corpus chunks are separate. Selected rendered/indexed article Markdown totals 121,646 bytes; the seven admitted upstream raw files total 772,637 bytes. External originals are not part of this corpus. The index covers 221 sections/source products. Its optional serialized size is 364,762 B raw / 83,045 B gzip / 66,151 B Brotli, for comparison only: no serialized index is shipped or persisted.

Native Node 24.22.0 macOS arm64 measurements: first index build 88.38 ms, subsequent median 50.16 ms (15 runs), 270 query samples with p95 0.45 ms and maximum 1.45 ms. These are synchronous first-use work and native timing, not browser/mobile latency, network readiness, heap usage or globe FPS. Browser first-use responsiveness must still be observed before further corpus growth. No browser performance pass is inferred.

### Articles requiring user editorial review before commit

| New article | Content | Primary references |
| --- | --- | --- |
| [Project background](../../content/knowledge/project-background.md) | Original guide | [pinned README](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/README.md#-why-this-exists); [data-source documentation](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md); [MIT license](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/LICENSE); [third-party notices](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/THIRD_PARTY_NOTICES.md); [responsible-use guidance](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/SECURITY.md#responsible-use) |
| [Your first five minutes](../../content/knowledge/first-five-minutes.md) | Original guide | [setup instructions](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/CONTRIBUTING.md#getting-set-up); [Cesium content requirements](https://cesium.com/learn/ion/content-usage-and-attribution-guide/); [pinned data-source inventory](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md); [KartaView policy](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/streetLevel/providers/kartaview/policy.js); [Panoramax policy](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/streetLevel/providers/panoramax/policy.js); [Street Level guide](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/README.md#-street-level) |
| [Understanding data labels](../../content/knowledge/understanding-data-labels.md) | Original guide | [upstream source inventory](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md); [Recent Imagery description](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/docs/CURRENT-STATE.md#recent-imagery-september-2026) |
| [Layers and coverage](../../content/knowledge/layers-and-coverage.md) | Original guide | [pinned source inventory](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md); [camera catalog owner](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/server/providers/cctv/catalog.js); [Street Level documentation](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/README.md#-street-level); [Canadian AQHI explanation](https://www.canada.ca/en/environment-climate-change/services/air-quality-health-index.html); [GNSS implementation](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/gnss/index.js) |
| [Keys, costs and intended use](../../content/knowledge/keys-and-costs.md) | Original guide | [upstream security guide](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/SECURITY.md#how-secrets-are-handled); [Google Maps security guidance](https://developers.google.com/maps/api-security-best-practices); [Cesium token controls](https://cesium.com/learn/ion/cesium-ion-access-tokens/); [Cesium content conditions](https://cesium.com/learn/ion/content-usage-and-attribution-guide/); [OpenSky's current terms](https://opensky-network.org/about/terms-of-use); [upstream local-server threat model](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/SECURITY.md#network-exposure--the-operator-threat-model) |
| [GIS and GEOINT fundamentals](../../content/knowledge/gis-geoint-fundamentals.md) | Original guide | [source inventory](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md); [reviewed Recent Imagery description](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/docs/CURRENT-STATE.md#recent-imagery-september-2026); [responsible-use expectations](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/SECURITY.md#responsible-use) |
| [Development and upstream updates](../../content/knowledge/development-and-updates.md) | Original guide | [upstream contribution guide](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/CONTRIBUTING.md); [upstream testing guide](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/TESTING.md) |
| [September update: GEV, WorldFX and Astra](../../content/knowledge/gods-eye-view-blew-up-then-astra-summary.md) | Original external-article summary | [God’s Eye View Blew Up. Astra Showed Up.](https://www.spatialintelligence.ai/p/gods-eye-view-blew-up-then-astra); [event provenance](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/public/events/bhote-koshi-2026/README.md); [source and coverage documentation](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md) |
| [The open-source release announcement](../../content/knowledge/i-open-sourced-gods-eye-view-summary.md) | Original external-article summary | [I Open Sourced God’s Eye View](https://www.spatialintelligence.ai/p/i-open-sourced-gods-eye-view); [README](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/README.md); [source documentation](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md); [security guidance](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/SECURITY.md) |

The two external-summary rows require comparison with their original Spatial Intelligence articles. Both primary pages were read; summaries use original prose (105 and 108 source-derived words respectively), link author/title/date provenance and distinguish historical author reports from capabilities at the current pin. No copied external body, transcript, screenshot or media is stored. September’s current primary heading is **“God’s Eye View Blew Up. Astra Showed Up.”**; the earlier plan included “Then.” The slug/source URL is unchanged; this is a recorded title correction, not a change to the approved admission. Full article metadata and hashes are retained in `.gev-logs/phase2a-m2/editorial-corpus.json`.

### User-run rendered checks pending

Normal HMR is restored through the standard root CLI at localhost:4173 (verified PID 83193); 4174 remains stopped. Server log: `.gev-logs/phase2a-m2/dev-normal-hmr-reinstalled.log`. No HMR-off or overlay suppression was used. The browser-policy denial remains respected; native serving/SSR/unit evidence does not establish rendered acceptance.

From `/Users/getumwanna/Documents/GEV`, use Node 24.22.0 and run:

```sh
QA_BASE_URL=http://localhost:4173 npm run qa:hub
node .gev-logs/phase2a-m2/manual-article-hmr-check.mjs
```

QA now has 12 assertions: the previous ten plus article provenance/section focus and local search filters/results/anchors. It does not start a server or acquire feeds. The manual helper has five explicit observations for changed-hash and missing published Markdown, Library-only errors and automatic restoration/recovery. It backs up and restores the article, never drives the browser/server, re-prompts typos and preserves unexpected concurrent edits. Keep the globe and the first-five-minutes article open. Check unchanged globe view/controls, usable Dashboard/Settings, no automatic document reload, Vite overlay, unhandled error or server exit, then HMR-only recovery. Any actual containment failure means stop/report; do not weaken the requirement. The helper’s isolated fixture tests do not pass these browser observations.

Also observe the new article/search pages in both themes, at narrow width and with keyboard navigation: readable tables/TOC, empty results, filter labels, section focus and responsive first-use search. Record limitations honestly. No redundant tracking rerun is requested for this Library-only milestone; the existing normal-mode tracking prerequisite is already passed.

**Stop here before staging/committing M2.** Resolve user editorial review and pending verification before the milestone commit. Do not author M3 case pages in this stop.

## M2 user editorial approval and verification contradiction — October 21

The user explicitly approved all nine original articles, including both Spatial Intelligence summaries, and reports all manual UI checks passed. All nine current article bytes and manifest records match the reviewed editorial corpus. The first-five-minutes original/current bytes match SHA-256 `eb1c03f7c28427bca4b3ff6737e081ddaafad66e177431e99f1d3d896003bc45`; no active manual helper remains. Article approval is complete and must be preserved.

The user reports QA12/12, then confirms the posted run is the latest. The actual latest retained receipt `.gev-logs/qa-custom-hub-2026-10-21T16-33-03-652Z.json` contains **11true assertions out of12 and overall passed:false**, with Library search failing at `hub-route-heading` / `browser-check-failure`. Its SHA-256 is `66c0ef2b2c358a7495d526a2caae24624c621a1134b369b1360b6cca4d74316e`. No later retained12/12 receipt exists. No startup/dependency HTTP failures or unhandled browser exceptions are recorded. Native search/router tests still pass17/17; this does not pass the browser gate. A source-level hypothesis is carried-over search filters during same-document hash navigation; exact failing browser substep is not yet established. Do not relabel the failed receipt or weaken assertions.

The supplied manual receipt `.gev-logs/phase2a-m2/manual-article-hmr-2026-10-21T16-33-03.697Z-K77nH4/receipt.json` records **5/5 explicitPASS**, outcome passed and restored true; SHA-256 `920207d46d6a302450f496ba8a8d0977b53597e1c89399923237d1cb0a8a7881`. Helper hash matches current code and restoration is independently verified. Preserve that user-observation receipt unchanged.

**Native containment contradiction:** the shipping server log emits `(client) page reload content/knowledge/first-five-minutes.md` at **12:34:32,12:34:37 and12:34:38 EDT**, all within the manual receipt interval12:33:03.698–12:34:50.397. Installed Vite6.4.3 source `node_modules/vite/dist/node/chunks/dep-Dm0c1Wj2.js:39509–39518` logs this only in the needFullReload branch, immediately before `hot.send({type:full-reload,triggeredBy:...})` without an HTML path restriction. The WS implementation broadcasts this payload to open clients; `node_modules/vite/dist/client/client.mjs:974–987` schedules a full page reload on receipt. This establishes server-issued global reload commands, inconsistent with the required Library-only/no-automatic-reload contract. It does **not** establish that a particular browser received/reloaded or that the globe view reset; no browser navigation was observed by the agent.

Evidence snapshot and hashes: `.gev-logs/phase2a-m2/acceptance-review-2026-10-21/{review.json,qa.json,hmr.json,server.log}`. Snapshotted server-log SHA-256 is `d0b3b681cbb187ff63080168bc17b96f2536aca2c9f8535809aeac05009566e1`. Independent read-only verification agrees. The agent did not run any browser harness, alter any article, restart the server, change a HMR/overlay setting or implement a repair during this audit.

**Required stop:** AGENTS.md says “If Library HMR containment acceptance fails, stop/report rather than weakening it.” Therefore the requested M2 commit and M3 implementation are held. No staging/commit occurs. The already authorized nine-article editorial approval is retained; repair/verification must address authored-Markdown unlink/add HMR behavior and the failing search check under existing source/plugin constraints. A need for any extra original-upstream file/plugin must be reported as an amendment, not silently adopted. Read-only M3 facts research created no case/application files.

## M2 repair checkpoint and requested HMR amendment — October21

The user authorizes fixing search QA and article HMR without weakening checks, while retaining all nine article approvals and every receipt. M2commit and M3 remain held. No article, manifest, schema, dependency or original-upstream file changed during these repairs. All9current article hashes and metadata match the approved editorial corpus.

### Repairs within the existing allowlist

- `scripts/qa-custom-hub.mjs`: hash-only navigation retains React category/source filters. The failing test changed kind to original-article while Source directory/cctv remained selected. It now verifies retained filters, resets only the controls needed by the article-search scenario, waits for the intended query/results and labels each substep. Every original assertion remains; further filter-state assertions were added.
- `src/custom/library/search.test.mjs`: real-corpus React/JSDOM regression reproduces the retained-filter failure and proves clearing the two filters restores valid section links. No browser or live page executes.
- `hub/src/library/catalog.ts`: retained imports now call stable proxies into the current HMR generation’s loader and refresh callbacks. This fixes stale module-map/schema closures after a visited Library is unmounted during content edits.
- `src/custom/library/rendering.test.mjs`: isolated nine-generation HMR lifecycle test reproduces the prior stale-ready behavior, then verifies malformed registry and missing/restored authored Markdown, schemas and admitted upstream docs through retained load/Retry callbacks.

Native rendering/search/router checks pass **29/29**, hub typecheck passes, harness unit checks pass and strict Library validation passes. Logs live under `.gev-logs/phase2a-m2/repair-analysis-2026-10-21/`. No browser harness ran; these do not pass the still-required rendered gates. Shipping retains its original HMR transport until the amendment is decided.

### Root cause and no-weaken alternatives

Vite6.4.3 raw loading creates both a raw-module node and an added base-file watch node. Deleting an admitted file removes importer edges, leaving a dead end. Import-glob combines those old nodes with the catalog owner; any dead end requests global full reload despite catalog self-acceptance. Isolated native Vite module graphs reproduce this without Tailwind or browser execution. Eager raw and URL variants retain reload failures; key-only globs/static fetch miss ordinary-edit HMR; literal imports fail missing-file transformation. Polling or intercepting global reloads would change the approved contract. Evidence: `hmr-native-structural-probes.json` in that directory.

### Exact amendment proposed, not adopted

| Path | Status | Purpose |
| --- | --- | --- |
| `src/tooling/viteBuild.test.mjs` | **One additional original-upstream file; approval required** | Recognize exactly one honestly named `custom-library-hmr-content` serve-only/post-ordered plugin after the Tailwind suffix; retain upstream plugin prefix and all existing security/config checks, adding explicit plugin checks |
| `build/customHub.js` | Already approved custom file | Host that narrow DEV HMR hook for the exact26admitted public content/schema/upstream paths. Invalidate raw/base nodes and both glob owners, then return the stable loaded catalog boundary (or no consumer update if Library has never loaded). No content parsing, server validation or endpoint |
| `hub/src/library/catalog.ts` | Already approved; proxy repair done | Current-generation loader/refresh callbacks for retained consumers; schema/Node validation roles unchanged |
| `src/custom/library/rendering.test.mjs` | Already approved | Native actual-plugin CRUD/missing-startup/positive-control regressions and retained-callback coverage |
| Existing QA/search tests and status/ledger/validation docs | Already approved | Preserve checks and record exact evidence and user-run gates |

The original-upstream allowlist would become `package.json`, `package-lock.json`, `src/tooling/viteBuild.test.mjs`, with inventory **63→64**. The package files need no new edits. No original runtime/provider/config/scene file, new dependency, raw-media copy, server-sideAjv, additional endpoint or global overlay/HMR suppression is proposed. Option(b) remains DEV-only browser Ajv plus authoritative Node validation/build preflights.

Reviewable code: `.gev-logs/phase2a-m2/repair-analysis-2026-10-21/PROPOSED-HMR-AMENDMENT.patch` (syntax and `git apply --check` pass; **not applied**). The prototype and review notes are beside it. Its **28/28 native checks** cover ordinary edits, repeated delete/restore for articles/schemas/upstream docs, missing-file startup, timestamped upstream reloads, fresh restored bytes, unloaded Library and positive controls proving unrelated entries/unadmitted Markdown still reload normally. Independent review agrees. These are isolated server-module-graph/message tests, not browser navigation/globe/error-state evidence. No shipping plugin, upstream test edit or server restart has occurred.

After amendment approval, adopt the hook and strengthen the existing upstream/custom tests, run relevant native gates and both builds, restart only the verified4173listener normally to discard pre-fix orphan module nodes, and provide fresh user commands for12-check QA and5-observation article HMR. Independently check the resulting server log for no global reload commands during the manual receipt interval; the prior5PASSreceipt remains unchanged. Keep M2commit/M3helduntil those gates pass. If approval is declined, keep the current source/plugin boundary and report the HMR limitation; do not disguise a plugin as Tailwind or weaken no-reload checks.

Allowed-repair final native checks:29/29rendering/search/router tests,6/6harness units, typecheck, adopted formatting, boundaries, strict Library validation and both full production build commands pass. Historical QA/HMR receipt hashes are independently rechecked unchanged. The proposed HMR plugin and original-upstream test remain unapplied while the amendment question is pending. Search-only rerun is `QA_BASE_URL=http://localhost:4173 npm run qa:hub` from the root with Node24.22.0. Full article-HMR rerun waits for the actual transport repair and clean normal-server restart.

## Approved HMR amendment applied; repair verification pending — October 21

The user explicitly replied “Approve this amendment,” authorizing only `src/tooling/viteBuild.test.mjs` as the third Phase 2a original-upstream file (63→64 paths). The reviewed patch is applied to that test and existing project-owned `build/customHub.js`. The test preserves the exact standalone plugin prefix/security checks and strictly admits one named serve-only post HMR hook after the Tailwind plugins. The hook has the exact 26 public input paths; it refreshes raw/watch variants and loaded glob owners, returning the self-accepting catalog boundary or no update for unloaded Library. Other files/environments keep ordinary Vite behavior. No content parse/validation endpoint, overlay suppression, global reload interception, polling, or dependency change is introduced.

The prior 11/12 QA receipt, 5/5 user observation receipt, and contradictory server-issued reload evidence are retained unchanged. All nine articles and both Spatial Intelligence summaries retain their editorial approval. Search QA filter reset/current-generation catalog repairs remain within existing custom paths. The verified root 4173 PID 83193 was stopped for cache-preserving native verification; 4174 stays stopped. Fresh native checks, both builds, normal-HMR restart, and user-run search/article HMR checks follow. Do not mark M2 accepted, stage/commit it, or begin M3 on this amendment alone.

## M2 approved repairs verified natively; user reruns pending — October 21

Applied the approved 64-path amendment. The only original-upstream change since M1 is `src/tooling/viteBuild.test.mjs`; the index is empty and HEAD remains M1 `e19e0f22148a71dd8c798b0396b7a8ac143e6334`. No M2 commit or M3 implementation occurred. Package files/dependencies, the approved nine article records/bodies, content manifest, admitted upstream-document set, earlier receipts, and rehearsal logs are preserved.

The search harness explicitly verifies retained filters and clears category/source filters before the original-article scenario, retaining all twelve top-level checks and strengthening result assertions. A real-corpus React regression reproduces stale-filter zero results and recovery. The catalog dispatches retained load/Retry exports to the current HMR generation, with a multi-generation mounted/unmounted/schema/content regression.

The actual shipping `custom-library-hmr-content` hook is exercised through installed Vite transforms, graph invalidation, import-glob updates, and emitted HMR payloads in isolated middleware-mode native fixtures. Nine new hook tests cover repeated article/schema/upstream edit/delete/restore cycles, missing-at-startup recovery, unloaded Library, all 26 admissions, non-client/unadmitted fallthrough, and unrelated-file full-reload positive controls. These tests use no bound listener/browser or shipping content edits. Independent review found no blocking issue and confirmed the positive controls detect real Vite reloads. This is native structural evidence, not rendered browser acceptance.

Fresh Node 24.22.0 results:

- Rendering/search/router: **38 passed, 0 failed**; config/provider-policy/harness unit checks: **21 passed, 0 failed**.
- Required full unit/allocation gate: **8,276 passed, 0 failed, 1 platform skip** (8,277 tests). Terrain cache restored byte-for-byte, SHA-256 `2c68ba361b8ccedc9fbdf57969573297ffbc7e2667ffa5ecb773da7516a2f1ab`.
- Typecheck, strict `check:library`, import/package boundaries, adopted formatting, doctor, and diff whitespace checks: passed.
- Both unmodified acceptance builds: exit 0; website 5.23 s, panel 3.84 s. The separate measurement-only graph omits only redundant Cesium asset copying; it does not substitute for either build.
- Production graph: no Ajv/schema compiler in any output chunk; no editable Library corpus/Markdown/search dependencies in the initial hub/globe graph. Initial globe raw/gzip/Brotli bytes are unchanged from M1. Initial hub delta from M1 is +2,393 raw / +758 gzip / +480 Brotli bytes.

Evidence: `.gev-logs/phase2a-m2/approved-hmr-repair-owhjwkt9/`, including native logs, `unit-summary.json`, `terrain-cache-preservation.json`, `bundle-review.json`, `preservation-scope.json`, `upstream-test.diff`, and listener/config records. The 38-test log is `.gev-logs/phase2a-m2/repair-analysis-2026-10-21/actual-hmr-rendering-search-router.log`. All previous failed/inconclusive receipts remain unchanged. The initial configuration verifier expected literal `server.hmr:true`; Vite 6 represents its enabled default as unspecified and checks `!== false`. The corrected verifier checks installed-source semantics; no configuration or product change was made for that probe. Its note is retained in `hmr-config-probe-note.json`.

Shipping restarted through standard root CLI, normal HMR enabled, PID **21447**, cwd `/Users/getumwanna/Documents/GEV`, loopback `[::1]:4173`, dedicated `node_modules/.vite-custom-hub` optimizer cache. Root and `/hub/` HTTP HEAD return 200; this is serving evidence only. New server log: `.gev-logs/phase2a-m2/approved-hmr-repair-owhjwkt9/dev-normal-hmr.log`. Rehearsal 4174 remains stopped; logs/worktree/dependency backup remain retained.

**User verification required before M2 commit/M3:** freshly load the globe and first-five-minutes article once after this restart. Run the commands below; do not refresh during the HMR helper. Require 12/12 QA and 5/5 article HMR, byte-identical restoration, Library-only accessible errors, automatic recovery, and no automatic document reload, Vite overlay, unhandled browser error, or unusable globe/Dashboard/Settings. Inspect the new server log against the receipt window as an additional no-global-reload check. Any containment failure stops and is reported; the checks are unchanged. Existing article editorial approval and manual UI report remain recorded; no reapproval of unchanged prose is requested.

```sh
cd /Users/getumwanna/Documents/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0
QA_BASE_URL=http://localhost:4173 npm run qa:hub
node .gev-logs/phase2a-m2/manual-article-hmr-check.mjs
```

The agent did not execute either browser harness or the live manual helper. M2 is uncommitted, M3 held, and Phase 2b deferred.

## M2 final verification passed and editorial approval retained — October 21

Fresh user-owned QA receipt `.gev-logs/qa-custom-hub-2026-10-21T17-11-15-946Z.json` has **12/12 true assertions**, overall passed, zero browser errors, and no failed/outdated local modules or optimized dependencies. SHA-256: `b35aa56dad6964ab672e52a81005625619c24aa02f5977a75940f843da80ffd4`.

The user reported **5/5 article HMR observations, outcome passed, restored byte-for-byte**, matching `.gev-logs/phase2a-m2/manual-article-hmr-2026-10-21T17-11-15.989Z-sDhwbs/receipt.json`. SHA-256: `4159974b631dd9ecf69667fd15ba92cc63d3f18ce1f50b1812509506c44780e9`. The receipt window is **2026-10-21T17:11:15.989Z–2026-10-21T17:13:29.513Z**; current article, saved original and helper hashes match. Shipping server log shows only catalog/styles HMR updates within that window, with no global page reload, full-reload, errors, overlays or restart messages. Its retained snapshot SHA-256 is `55038b5cceee5608ab6322bc6469b9ea3d2e6d06f06815e6e3cdaefa996896dd`. Independent read-only review confirms these facts. PID21447 is normal root Vite on loopback4173; 4174 remains stopped.

Acceptance snapshot: `.gev-logs/phase2a-m2/accepted-jgr5fok2/` (unchanged receipt copies, server log and verification/hash manifest). All prior failures and contradictory receipts remain retained as historical evidence. All nine unchanged articles, including both Spatial Intelligence summaries, retain the user's explicit editorial approval. The earlier search/HMR hold is resolved by these fresh checks plus the preceding native/build/graph gates. **M2 is ready for its already-authorized milestone commit. M3 may then proceed under the approved plan, retaining its separate pre-commit case editorial stop. Phase 2a final acceptance and Phase 2b remain deferred.** No browser harness or live helper was agent-executed.

Workspace preservation: two untracked duplicates (`build/customHub 2.js` and `src/tooling/viteBuild.test 2.mjs`) were discovered during this verification. They differ from the approved files; origin is unproven. Their hashes/sizes are recorded in the snapshot. They are preserved unchanged and excluded from staging and the implementation allowlist; they are not customization repairs.
