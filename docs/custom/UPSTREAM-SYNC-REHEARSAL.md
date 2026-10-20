# Frozen upstream-sync rehearsal report

October 20, 2026. **Approved shipping integration verified:** hub 9/9 matched to its receipt, manual Street Level smoke passed, and final tracking 109/0/0 by direct user report. Earlier88-pass interrupted shipping run remains preserved. Rehearsal 4174 was verified and stopped; its worktree/logs are retained. Phase 2a post-pin/Ajv review is delivered in `PHASE-2A-REVERIFICATION.md`; no implementation started.

## Inputs, result, and isolation

| Item | Recorded value |
| --- | --- |
| Shipping branch / clean starting HEAD | `codex/phase-1-foundation` / `7595ca34884e4f6a8159077b3d44a84e38ce0950` |
| Initial / adopted shipping upstream pin | Initial `de2138e84c1778fd98a48b7c9fd0b9788c318946`; adopted `064d51f7be2675f1c69e16068e9c49d1a60144d1` through the approved fast-forward; shipping user verification pending |
| Approved/fetched upstream target | `064d51f7be2675f1c69e16068e9c49d1a60144d1` |
| Isolated branch / worktree | `codex/upstream-sync-rehearsal` / `/Users/getumwanna/.codex/worktrees/upstream-sync-rehearsal/GEV` |
| Initial tested code / merge checkpoint | `4477dd2154b216a2daf73cc696febb48b0e2f313` |
| Incoming diff, pin to target | 151 files; 7,379 insertions, 16,802 deletions |
| Conflicts | None; all six Phase 1 integrations survived the merge |
| Startup cache recovery checkpoint | `f5bda47c749267f2698856f0605a0550eaf165c0` |
| QA diagnostics follow-up checkpoint | `a697eeaac39c8eb8d18c9583e08e8f48ad32579c` |
| Runtime | Node `24.22.0`, npm `11.19.1` |
| Local evidence directory | `.gev-logs/upstream-sync-064d51f7.qhpQdW/` (ignored; no credentials recorded) |

**Commit-count correction:** the earlier “72 pending commits” figure was not reproduced after fetching the approved target. Git verifies **1,662 newly reachable commits, including 626 merge commits, across six first-parent steps**. The old pin is an ancestor of the exact approved target. The target and 151-file inventory did not change. Reproduce with `git rev-list --count <pin>..<target>`, adding `--first-parent` or `--merges` for the respective counts; `git merge-base <pin> <target>` returns the old pin. `incoming-paths.txt` records the full path inventory; it is reproducible with `git diff --name-status <pin> <target>`.

The shipping checkout remains clean at its starting HEAD; its existing `[::1]:4173` listener was not replaced. The rehearsal serves only `[::1]:4174`. Adoption would require a separate shipping integration/pin update decision; the rehearsal merge is not adoption.

## Every manual repair and documentation update

Incoming upstream files are imported changes, not manual repairs. Among the six Phase 1 upstream customization paths, upstream changed only `package.json`, removing the obsolete `qa:panel-resize` command; it remains removed. Dependencies, lockfile, root wrapper, bootstrap integration, stylesheet ordering, and standalone/panel separation were preserved. No functional compatibility repair was needed at the initial merge. The subsequent startup repair below changes only the project-owned hub build wrapper and related regression/annotation coverage.

The mandatory formatting check initially failed on ten existing customization files. Each repair was independently verified as exactly the installed Prettier output using the repository's resolved configuration. The complete repair list, including startup follow-up, is:

| Path | Relation to six-file manual allowlist | Repair |
| --- | --- | --- |
| `src/tooling/viteBuild.test.mjs` | Inside allowlist | Formatting plus regression for dev-cache separation, build-cache preservation, and generated JSX runtime pre-bundling |
| `src/custom/globe/bootstrap.js` | Outside; existing project-owned file | Formatting only |
| `src/custom/globe/branding.js` | Outside; existing project-owned file | Formatting only |
| `src/custom/globe/feedStrip.js` | Outside; existing project-owned file | Formatting; relocate existing English-text opt-out annotation to the formatted assignment RHS, preserving its scope |
| `src/custom/globe/keyBadges.js` | Outside; existing project-owned file | Formatting; relocate existing English-text opt-out annotation to the formatted assignment RHS, preserving its scope |
| `src/custom/shared/branding.js` | Outside; existing project-owned file | Formatting only |
| `src/custom/shared/keyAccess.js` | Outside; existing project-owned file | Formatting only |
| `src/custom/shared/layerMetadata.js` | Outside; existing project-owned file | Formatting only; no source facts changed |
| `src/custom/shared/shareHandoff.js` | Outside; existing project-owned file | Formatting only |
| `src/custom/shared/theme.js` | Outside; existing project-owned file | Formatting only |
| `build/customHub.js` | Outside; existing project-owned file | Carry forward isolated root dev optimizer cache, explicit build cache and both JSX-runtime pre-bundles; integration additionally applies the reviewed Hong Kong/Taiwan-off policy before the standalone factory and reasserts it in the hub wrapper |
| `scripts/qa-custom-hub-diagnostics.mjs` | Outside; existing project-owned file | Recognize both the default and dedicated optimizer cache paths; preserve redacted failure categories |
| `src/custom/hub/qaHarness.test.mjs` | Outside; existing project-owned file | Regression for dedicated-cache outdated-dependency classification and URL redaction |

`format-repairs.json` records before/after hashes for the initial ten formatting-only edits. The two annotation relocations and wrapper repair are subsequent follow-up, not part of that initial formatter-equivalence claim. No other original-upstream manual file was edited. The rehearsal also updated this report, `AGENTS.md`, `CUSTOMIZATION.md`, `STATUS.md`, and `docs/custom/PHASE-2A-PLAN.md` for execution/result status, repair provenance, and adoption gates. Later integration edits are listed separately below; documentation changes are not application repairs.

## Layer, source, provider-terms, and setup changes

This is a source audit of the frozen repository, supported by local fixtures where covered by the suite. It is **not live provider verification**. Current external terms pages were not reviewed. No new source, account, key, paid service, or recording right was activated.

| Layer / provider | Before → frozen target; adoption consequence | Frozen-target evidence |
| --- | --- | --- |
| CCTV / Ontario 511 | Previously documented keyless catalog → server-side `ONTARIO_511_API_KEY` required. Ontario highway cameras are skipped without it, reducing keyless coverage. Setup now documents developer registration/key approval, 10 requests/minute, intended-use and third-party disclosure review under the Developer's Access Agreement. Ontario open license remains; distributor “as is” disclaimer is added. Geographic extent and frame host are unchanged. | `server/providers/cctv/sources.js:557–584`; `.env.example:210`; `DATA_SOURCES.md:159`; `src/data/dataCredits.js:243` |
| CCTV / Hong Kong | New keyless Transport Department XML catalog and pinned snapshot host, covering Hong Kong Island, Kowloon, and New Territories. Default cap 1,100; configurable 8–1,200. Upstream's approximately 1,013 cameras is a documented count, not our observation. New DATA.GOV.HK/Transport Department attribution terms and enabled/cap/catalog-URL controls. **Default-on upstream; disabled in rehearsal.** | `server/providers/cctv/catalog.js:111–115`; `server/providers/cctv/constants.js:314–344`; `server/providers/cctv/sources.js:2013–2230`; `.env.example:231–233`; `DATA_SOURCES.md:66,173`; `src/data/dataCredits.js:301–306` |
| CCTV / Taiwan | New keyless Freeway Bureau MOTC 2.0 XML table and four pinned official camera hosts; national freeway coverage. Published MJPEG paths are mapped to same-camera JPEG still paths that are not themselves listed in the source table. Default cap 600; configurable 1–2,000. Documented off-island catalog reachability limitation; hourly failure retries and last-good catalog up to 24 hours. New Taiwan Open Government Data License 1.0 attribution and setup controls. **Default-on upstream; disabled in rehearsal.** | `server/providers/cctv/catalog.js:163–167`; `server/providers/cctv/taiwan.js:11–33,139–148,205–208,226–303`; `.env.example:253–255`; `DATA_SOURCES.md:116`; `src/data/dataCredits.js:262–269` |
| Street Level / Mapillary | Same source and public client-token requirement. Above-60-km overview coverage is removed; coverage proxy now serves z11–14 tiles. Generic nearest-image Graph lookup is removed; sequence selection remains. Sequence fields omit computed altitude. Disk coverage cache → memory-only, 24 hours, at most 120 tiles, at most 4 MiB per cached tile. Existing ignored disk files are neither read nor deleted. HTTPS pinned-host/redirect refusal is now documented. CC BY-SA/API terms are unchanged in the repository. | `src/layers/streetLevel/tileMath.js:146–152`; `src/layers/streetLevel/providers/mapillary/policy.js:11,73–74`; `src/layers/streetLevel/providers/mapillary/source.js:111–125`; `server/providers/mapillary/tiles.js:5–29,79–115,182–208`; `DATA_SOURCES.md:23`; `SECURITY.md:32` |
| Street Level / Panoramax | Same keyless federated sources and per-picture licenses. Above-60-km density overview is removed; line budget is split evenly across tiles instead of pooling unused sparse-tile budget. Physical source coverage is unchanged; visible overview coverage narrows. Explicit global credit added. | `src/layers/streetLevel/providers/panoramax/policy.js:33–54`; `DATA_SOURCES.md:26`; `src/data/dataCredits.js:343–344` |
| Street Level / KartaView and Google | Source, keys, licenses, billing restrictions, and geographic availability unchanged; explicit global credits added. Google remains default-off and limited to the Google photoreal map stack. Shared FOLLOW/cast modes and portable-panel behavior are removed; fullscreen EXPAND replaces the earlier expansion behavior. These are UI/rendering changes, not new sources. | `src/layers/streetLevel/providers/google/index.js:65–69`; `src/layers/streetLevel/providers/kartaview/policy.js:38–50`; `README.md:427–430`; `src/data/dataCredits.js:335–340` |
| Satellites / CelesTrak | Same source, key requirements, and catalog scope. Cached TLE stale provenance now reaches core/dense records and `getStats()` instead of hardcoded `stale: false`. Health-label behavior changes; this is not a new live feed. | `src/layers/satellites/controls.js:548–559`; satellite catalog/ingestion/state/lifecycle diffs |
| Flights and Local ADS-B / adsbdb route metadata | Sources, keys, and aircraft coverage unchanged. Plausibility now rejects positions beyond the origin–destination segment with 200 km tolerance, so wrong-leg route labels may disappear. This changes metadata admission, not aircraft coverage. | `src/data/routePlausible.js:79–107`; `src/layers/flights/tracking.js:872`; `src/layers/localAdsb/index.js:282` |

No layer registration or layer key-ID registry changes were found. Ontario's new key is an environment-only, conditional camera-pack credential; it must not be misrepresented as a layer-wide `requiresKeyId`. Exactly two new default-on camera packs were found. Existing NYC, Lithuania, and Florida opt-ins are unchanged. Packs share the 4,000-camera cap, so an old displayed count is not a future coverage guarantee.

**Adoption must preserve `CCTV_HK_ENABLED=0 CCTV_TAIWAN_ENABLED=0` until current primary terms and configuration are reviewed and activation is separately authorized.** Approving a code pin does not itself configure Ontario credentials or approve the two new sources. The stricter rehearsal flags below also disable acquisition from existing live camera packs; that restriction is a test configuration, not a proposed permanent loss of existing CCTV functionality.

## Initial validation and server checkpoint

The worktree has no Vite dotenv files or inherited configured provider credentials in the inspected set, including Ontario/TfL/Gemini/legacy OpenSky extras. `inspectSetup({includeKeychain:false, authoritativeEnvironment:true})` reports no configured credentials. Ordinary doctor passed; its metadata-only Keychain availability checks are not proof that a running server has keys. Direct Vite launch does not load Keychain values.

Server launch: `HOST=localhost PORT=4174 CCTV_HK_ENABLED=0 CCTV_TAIWAN_ENABLED=0 CCTV_PREFER_AUSTIN=0 CCTV_FORCE_AUSTIN=0 npm run dev -- --strictPort` under Node 24.22.0. No local camera file/env pack was supplied; `CCTV_PREFER_AUSTIN=0 CCTV_FORCE_AUSTIN=0` prevents live camera-pack acquisition. Listener PID at readiness was `57723`; both `/` and `/hub/` returned HTTP 200. This is HTTP readiness, not a rendered-browser pass.

| Check | Result / local evidence |
| --- | --- |
| `npm ci` | Pass; zero reported vulnerabilities. Existing npm allowScripts warnings for esbuild, fsevents, and Puppeteer recorded; no allowScripts policy change. `npm-ci.log` |
| `npm run doctor` | Pass; `doctor.log`; separate `server-context.json` verifies actual keyless context |
| `npm run typecheck:hub` | Pass; `typecheck.log` |
| `GEV_REQUIRE_ALLOCATION_GATE=1 npm test` | Pass: 8,168 passed, one native Windows DACL test skipped on macOS, zero failures. Includes one focus and 14 overlay allocation cases. Ran before formatting-only repairs. `unit.log` |
| Package boundaries / import directions | Pass: `node scripts/check-package-boundaries.mjs` and `node scripts/check-import-directions.mjs`; 1,017 modules / 79 portable entries reported by import check. `boundaries.log`, `imports.log` |
| `npm run format:check` | Initial ten-file failure repaired; final pass across 1,449 source files. `format.log`, `format-final.log`, `format-repairs.json` |
| Post-format config/custom globe tests | Pass: 20/20 using `node --test src/tooling/viteBuild.test.mjs src/custom/globe/*.test.mjs`. `post-format.log` |
| `npm run build` | Pass after repairs; 2,898 modules, 3.87 s reported. Existing large-chunk warning remains. `build.log` |
| `npm run build:panel` | Pass after repairs; 871 modules, 3.49 s reported. `panel.log` |
| `git diff --check` | Pass |
| Initial user-run `qa:hub` at 4174 | **Failed: 0/9**, all blocked by hub startup / outdated optimized dependencies. Receipt `qa-custom-hub-2026-10-20T18-28-37-124Z.json`; rerun passed below |
| Initial user-run `test:track` at 4174 | **Failed at startup**: 60-second wait for app globals at `scripts/track-regression.mjs:482`; no tracking assertions ran. User-pasted output; rerun passed below |
| Changed Street Level browser fixture gate | Not run: strict fixture gate requires a dummy Mapillary token in the bundle; the rehearsal stays keyless. Unit fixtures passed. Removed `qa:panel-resize` is not a gate to restore or run. |
| Live provider outcomes / GPU-FPS / manual changed-panel views | Not observed. Historical Phase 0 waiver is not a new pass or rehearsal waiver. |

User commands, in the isolated worktree:

```sh
cd /Users/getumwanna/.codex/worktrees/upstream-sync-rehearsal/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0
QA_BASE_URL=http://localhost:4174 npm run qa:hub
npm run test:track -- --url http://localhost:4174 --offline-imagery
```

The initial failures and subsequent passing user reruns are both recorded in this report. No agent-driven browser rerun was performed. `--offline-imagery` replaces known Esri/OSM tile images only; other metadata/terrain resources may still use the network. No agent-driven browser harness or indirect browser execution was used.

## Startup failure, diagnosis, and bounded recovery

The user supplied both failures from localhost:4174. The hub assertion-only receipt is timestamped `2026-10-20T18:28:37.125Z`, origin `http://localhost:4174`: document HTTP 200, three failed optimized-dependency requests, all three classified `504 Outdated Optimize Dep`, no other failed local document/module category, and zero page errors/setup reads/blocked acquisitions. All nine product checks were blocked; zero page errors is not successful startup. The receipt intentionally does not retain module URLs/hashes, so it does not identify the three exact dependencies.

Tracking timed out waiting for `window.__godsEyeView.viewer` and `.dataManager` before synthetic assertions. Zero served fixture tiles does not establish an imagery defect. A common module-startup cause is plausible, but the tracking output alone does not prove the same cause.

The live server's default `.vite` cache had only `deps_temp_052887cf` and no finalized `deps/_metadata.json`. The server log also records late discovery of `react/jsx-dev-runtime`. Root had started the server before running the full unit suite. Several suite fixtures create Vite servers rooted at this checkout with `configFile:false` and no separate cache: `src/tooling/allowedHosts.test.mjs:109`, `src/tools/localRoute.test.mjs:243`, and `src/data/trafficTiming.test.mjs:160`. Installed Vite removes a cached dependency directory when its config hash changes (`loadCachedDepOptimizationMetadata`, installed Vite chunk `dep-Dm0c1Wj2.js:14790–14840`). Test fixtures and the running server therefore shared a destructive cache boundary. The recorded timing supports this as the high-confidence trigger, not a browser-observed causal trace. Production builds already had their own `.vite-build` cache.

Stopped only the verified rehearsal Vite PID `57723`; shipping PID `6863` / port 4173 remained running. Preserved the incomplete generated cache in `.gev-logs/upstream-sync-startup-recovery/vite-cache-before`. The existing project-owned wrapper now defaults to `node_modules/.vite-custom-hub` while honoring an explicit upstream `cacheDir`, including production `.vite-build`. Existing optimizer options/includes are preserved, with generated `react/jsx-runtime` and `react/jsx-dev-runtime` added up front. No provider/security/plugin-order change, package/lock change, QA-assertion relaxation, automatic browser retry, or original-upstream tracking-script edit was made.

The focused config regression failed before the repair and passed after it. A full rerun then found an existing localization opt-out problem introduced by the initial formatting: the scanner associates an assignment with its first RHS line, so comments before wrapped assignments no longer covered four English strings. Moved the existing annotations in `feedStrip.js` and `keyBadges.js` next to those RHS expressions. UI text and its intentionally English policy are unchanged; the scanner and translation catalogs were not altered. The intermediate failed suite log is retained, not replaced by the later result.

Recovery evidence is under `.gev-logs/upstream-sync-startup-recovery/`. Finish the full suite and builds before pre-bundling and restarting the rehearsal; user browser reruns were still required at that checkpoint and have since passed as recorded below. Recovery results follow; HTTP checks do not establish rendered application readiness.

| Recovery check | Result / evidence in recovery log directory |
| --- | --- |
| Cache/JSX regression | Fails before repair; passes after. Existing config/globe group: 21/21 passed. `regression-before.log`, `regression-after.log` |
| Localization annotation check | Passed after annotation relocation. Intermediate full-suite failure remains in `unit.log`; focused result in `i18n.log` |
| Full allocation-gated suite | **8,169 passed, one native Windows DACL skip, zero failures**, before the diagnostic-only follow-up. `unit-final.log` |
| Typecheck / package and import boundaries | Passed. `typecheck.log`, `boundaries.log` |
| Formatting / doctor | Passed; 1,449 source files checked. `format-final.log`, `doctor.log` |
| Root / panel production builds | Passed; 4.08 s / 3.58 s reported. Existing chunk-size warnings remain. `build.log`, `panel.log` |
| Explicit pre-bundle | Passed with installed Vite optimizer after all tests/builds completed; finalized metadata has 23 optimized entries including both JSX runtimes. `prebundle.log`, dedicated cache `_metadata.json` |
| Fresh server context | No configured inherited provider variables, dotenv files, or setup credentials. `server-context.json` |
| Rehearsal restart | PID `55130`, `[::1]:4174`, same keyless/provider-disable launch flags; shipping PID `6863` / `[::1]:4173` unchanged. `server.log` |
| HTTP asset verification | **54/54 HTTP 200**: root/hub documents, both source entry modules, and all 23 optimized entry URLs, each checked twice. Finalized cache metadata unchanged across both passes. No app JavaScript or browser execution. `http-assets.json` |
| QA diagnostic-only follow-up | New cache path was initially classified as a generic module failure. Extended only the explicit optimizer-path classification; new regression fails before and all six focused offline checks pass afterward. No browser or Vite fixture server launched. `diagnostics-before.log`, `diagnostics-after.log`; final formatting also passes (`format-diagnostics.log`) |
| Fresh user `qa:hub` at 4174 | **Passed 9/9**, user-reported and matched to receipt `.gev-logs/qa-custom-hub-2026-10-20T18-43-33-487Z.json`, timestamp `2026-10-20T18:43:33.488Z`, origin `http://localhost:4174`. Overall pass, hub ready/HTTP 200, zero local/module/optimizer failures and page errors; eight blocked acquisitions, two setup reads. |
| Fresh user `test:track --offline-imagery` at 4174 | **Passed: 109 / failed: 0 / skipped: 0**, explicitly reported by the user. No independent tracking receipt was found under `.gev-logs`; this is user-supplied evidence, not an agent rerun. Synthetic fixtures; offline imagery replaces known tile images only, not every network resource. |

The diagnostic follow-up affects only the user-run QA harness, not the served application or its optimizer configuration. It does not relax a pass condition or add retries. The rehearsal server remains running until approved shipping integration is verified. No test fixture server or production build was run after the restart. Dedicated cache separation also prevents the inspected default-cache fixtures from deleting this server's optimized assets. If the worktree is later archived, preserve ignored receipts/logs separately before removal.

## Approved integration candidate — shipping verification pending

The integration execution plan is approved. The separate integration worktree carries the rehearsal repairs and adds exactly these project-owned policy repairs outside the six-file original-upstream manual allowlist:

| Path | Integration repair |
| --- | --- |
| `build/customProviderPolicy.js` | New tracked policy forces both camera-pack switches to `0`, acknowledges that state without secrets, and checks the reviewed catalog/dotenv-loading contracts before startup |
| `scripts/check-custom-provider-policy.mjs` | New offline actual-catalog proof with clean child environments, hostile inherited/dotenv enabling flags, independent restarts, mocked HTTP, and an Austin fixture positive control |
| `src/custom/server/providerPolicy.test.mjs` | New focused regressions cover forced flags, unrelated-configuration preservation, contract drift/missing-file failure, wrapper ordering, and the six offline process scenarios |
| `build/customHub.js` | Existing project-owned wrapper applies policy during module evaluation before the upstream standalone factory, then reasserts it; retains the accepted dev-cache isolation repair |

The offline policy command passed **6/6 process scenarios**. Focused policy unit tests passed **6/6**, with zero failures. These are mocked/catalog-policy results, not live camera observations or shipping/browser verification. No additional original-upstream manual repair, dependency, credential, or provider activation was introduced.

Integration also updates the approved project-owned documentation: `SETUP.md`, `AGENTS.md`, `CUSTOMIZATION.md`, `STATUS.md`, this report, and `docs/custom/PHASE-2A-PLAN.md`. They record the implemented policy, Ontario's accepted key-required coverage loss with no key configured, the provider-guide notes, repair provenance, and remaining gates. Earlier rehearsal receipts and failure history remain intact.

User shipping checks on localhost:4173 are still pending: `qa:hub`, synthetic `test:track --offline-imagery`, and the Street Level manual smoke check. Street Level fixture QA remains unrun under the no-new-key posture; real imagery-dependent steps must be recorded as blocked if no eligible imagery is available. The historical Phase 0 waiver does not pass these checks.

## Adoption decision and next review

The user approved adoption with these conditions:

1. Hong Kong and Taiwan camera packs remain disabled in shipping until separate terms review and explicit activation approval. The approved integration candidate implements the tracked project-owned startup policy and offline actual-catalog proof described in `UPSTREAM-INTEGRATION-PLAN.md` and `SETUP.md`. It forcibly overrides inherited or dotenv enabling flags; future changes to the reviewed upstream contracts fail closed pending review. No original-upstream policy edit was made.
2. Ontario 511's keyless coverage loss is accepted. Setup guidance now marks Ontario key-required; the key remains unconfigured. This pin has no Ontario POWER UP field, which is disclosed rather than directing a key into another provider's field.
3. Carry the dev-cache isolation, diagnostic follow-up, formatting, and annotation repairs into shipping.

**Integration execution is approved and the isolated candidate is ready.** Candidate worktree: `/Users/getumwanna/.codex/worktrees/upstream-integration/GEV`, branch `codex/upstream-integration`, new pin `064d51f7be2675f1c69e16068e9c49d1a60144d1`. Shipping fast-forward and its 4173 verification are pending at this candidate checkpoint; no shipping/browser pass is claimed. After the clean-state/ancestry gate, use the approved fast-forward method, rerun the integration plan's shipping gates, and obtain the user-run browser checks. Stop only the verified 4174 listener after shipping verification completes; preserve the rehearsal worktree and ignored logs/receipts.

The passing reruns establish the bounded hub and synthetic tracking results above. They do not establish live provider coverage, dataset rights, or GPU/FPS performance. The source/terms implications and verification gaps earlier in this report remain visible; the adoption decision accepts the stated Ontario loss and keeps the two new sources disabled.

After approved integration is verified, produce `docs/custom/PHASE-2A-REVERIFICATION.md` against shipping's new pin `064d51f7be2675f1c69e16068e9c49d1a60144d1`: exact layer IDs, key IDs and product-specific credentials, source/coverage claims, admitted doc files/sections and hashes, article/case facts, dependencies, and exact file paths. Present changes before milestone 1 and obtain amendment approvals. The two-file Phase 2a upstream allowlist and milestone 2/3 pre-commit editorial stops remain in force; Phase 2b planning stays deferred until 2a ships and is accepted.

The pending Ajv review compares **(a)** server-side dev validation returning only normalized Library errors against **(b)** lazy hub Ajv and schemas. After candidate-version/license review, measure raw/gzip/Brotli Library chunk costs and initial hub/globe graph impact; compare HMR/recovery, missing/stale inputs, offline behavior, dependency category, server lifecycle, and plugin/allowlist constraints. Isolated measurement fixtures must not become production Library implementation or silently alter dependencies/file approvals. Neither approach is selected yet.

## Shipping integration checkpoint — user verification pending

The approved fast-forward installed code `fd136b60ce9421bd8636692232766a5f7d2226e3` on shipping `codex/phase-1-foundation` from clean HEAD `7595ca34884e4f6a8159077b3d44a84e38ce0950`; adopted upstream target `064d51f7be2675f1c69e16068e9c49d1a60144d1` is an ancestor. The approved plan is retained unchanged as the approval artifact; this checkpoint supersedes its original pre-approval wording. No repair beyond the approved integration file list and no extra original-upstream edit or dependency was required.

Shipping Node 24.22.0/npm 11.19.1 evidence: `npm ci` passed (zero vulnerabilities); provider-policy CLI 6/6 independent offline scenarios; doctor before/after builds; hub typecheck; allocation-gated suite **8,176 passed / 0 failed / 1 platform skip**; import/package boundaries; formatting (1,449 scoped source files); root and panel builds all passed. The integration candidate's four code files also pass explicit Prettier checks. Existing large-chunk warnings remain. Actual shipping logs are retained at `/Users/getumwanna/Documents/GEV/.gev-logs/shipping-integration-2026-10-20/`; candidate and rehearsal logs stay in their worktrees.

All fixture servers/builds completed before forced dependency pre-bundling and root server restart. Shipping listener PID 56935 is `[::1]:4173`; startup acknowledges Hong Kong OFF, Taiwan OFF, and reviewed contracts verified without temporary switch overrides. Credential presence check found zero configured environment/dotenv providers and no dotenv files; no Keychain launcher or credential values were used. Two HTTP-only passes verified 74 document/module/optimizer requests (all 200), with stable finalized `.vite-custom-hub` metadata (23 dependencies, 10 chunks). These do not establish rendered browser readiness, live-feed coverage, or FPS. An initial diagnostic probe percent-encoded an `@` in one optimizer filename and received 404; using Vite's actual unchanged URL passed, with no source repair.

User shipping checks are pending. Run from the actual shipping checkout:

```sh
cd /Users/getumwanna/Documents/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0
QA_BASE_URL=http://localhost:4173 npm run qa:hub
npm run test:track -- --url http://localhost:4173 --offline-imagery
open 'http://localhost:4173/'
```

For the Street Level manual smoke:

1. On default Esri, enable **STREET LEVEL** and expand its panel. With Mapillary unconfigured, expect **KEY REQUIRED** with token guidance. Google Street View is absent on Esri.
2. Try existing keyless **KARTAVIEW** coverage below about 6 km, or **PANORAMAX** below 60 km in France/Belgium. Open an available coverage line/photo; report missing coverage or a provider error as blocked rather than passed.
3. Verify provider caption/license and globe credits. **EXPAND → SHRINK** returns to the same panel/photo. **EXPAND → Escape** exits expansion while keeping the photo/panel open. **×** closes the viewer.
4. At a narrow phone-like window width, verify reachable controls/credits and no horizontal page overflow. Do not configure a new key for these checks.

The existing rehearsal PID 55130 on `[::1]:4174` remains running until shipping user checks resolve. Then stop only its verified listener, keep all rehearsal logs/worktree, and produce the post-pin Phase 2a reverification and measured Ajv (a)/(b) comparison before milestone 1. No Phase 2a implementation, Ajv design selection, or Phase 2b work is included in this checkpoint.

## Shipping user results and bounded tracking rerun

The supplied output is retained unchanged at `/Users/getumwanna/Documents/GEV/.gev-logs/shipping-integration-2026-10-20/user-shipping-checks-2026-10-20.txt`; SHA-256 `a6581dc58e57aa1c6703de622c0502600ec66972a9d3b954b1a2d7f92cebc090`.

- **Hub: passed 9/9**, matched to `.gev-logs/qa-custom-hub-2026-10-20T19-28-09-202Z.json`, timestamp `2026-10-20T19:28:09.203Z`, origin `http://localhost:4173`. All nine assertions and overall `passed` are true. Readiness HTTP 200, four resource-failure counters zero, pageErrorCount 0; acquisition blocked 8/setupReads 2. These are bounded UI checks, not live-source coverage.
- **Street Level: user-reported all manual smoke checks passed**, supplied in the subsequent direct reply. No independent agent browser observation is claimed.
- **Tracking: incomplete.** 88 individual PASS assertions, zero assertion FAIL/SKIP lines, 18 bundled tile images served, then `Execution context was destroyed, most likely because of a navigation` at `scripts/track-regression.mjs:3231:26`, starting the unseeded ground-floor corridor evaluation. The normal final `RESULT:` summary is absent. Do not report this shipping run as109/0/0 or as a completed pass; earlier rehearsal 109/0/0 remains separate evidence.

The harness's `evalPage` uses raw `page.evaluate`; its last intended navigation is much earlier at line774. Preserved `server-before-tracking-rerun.log` contains 14 source page-reload messages, including three at 15:33:10 for `src/custom/globe/feedStrip.js`, `src/data/dataCredits.js`, and `src/ui/panelChrome.js`. Those files still match HEAD and retain 15:18:24 mtimes; their metadata-change timestamps correspond to the reloads. An unexpected Vite reload is the leading explanation for the destroyed context. The external cause of the metadata events is not established; no tracking assertion or application-data regression is established by the fatal error either.

The only operational repair is a **temporary root development server with HMR disabled**, using the installed Vite API. Vite's installed implementation suppresses source HMR handling and outbound reload/update payloads with `server.hmr:false`. No upstream/custom source, dependency, harness assertion, security gate, or provider policy was changed for this rerun; no new plugin was added. The source watcher itself remains configured normally. No production-preview substitution was used, because the harness uses development module seams. The separate optimized-radio warning in the original server log is associated with the earlier percent-encoded diagnostic URL; the unchanged actual optimized URL was verified200 and is not evidence for the navigation failure.

The operational launch uses the existing root configuration from the shipping directory (the live launch also asserts resolved root/cache/host/port and both policy switches):

```sh
cd /Users/getumwanna/Documents/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0
HOST=localhost PORT=4173 node --input-type=module <<'NODE'
import { createServer } from 'vite';
const server = await createServer({
  server: { host: 'localhost', port:4173, strictPort:true, hmr:false },
});
await server.listen();
server.printUrls();
NODE
```

The server is already running: shipping PID 65423 on `[::1]:4173`; startup acknowledges HK/Taiwan OFF and reviewed contracts verified. After restart, 74 HTTP-only document/module/optimizer checks return 200 and finalized metadata stays unchanged; evidence is `http-assets-no-hmr.json`, with startup log `server-no-hmr.log`. This does not establish a rendered or completed tracking pass. No redundant source test/build rerun was performed for the operational launch/documentation-only checkpoint.

The user reruns **only tracking**, from the shipping checkout:

```sh
cd /Users/getumwanna/Documents/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0
npm run test:track -- --url http://localhost:4173 --offline-imagery
```

No repeat of already-passing hub/manual checks is required for this unchanged-source HMR-off rerun. Do not edit runtime/configuration files during the run. Keep rehearsal PID 55130 on 4174 and every prior failure/pass log until the tracking result completes. After verified shipping integration, stop only the verified 4174 listener, preserve logs, and prepare the Phase 2a reverification/Ajv (a)/(b) review before milestone 1. Return to the standard approved dev launch when active implementation resumes; HMR-off is an operational verification mode, not a checked-in product change.

## Final shipping verification, rehearsal shutdown and review handoff

The user's latest direct message reports **109 passed / 0 failed / 0 skipped** for the shipping tracking rerun. No final transcript/receipt was attached, so this is explicitly user-reported; do not replace or relabel the earlier interrupted output. Matched shipping hub 9/9 and the prior direct all-pass Street Level manual report complete the approved integration gates. Product code remains unchanged from fd136b60 on adopted pin 064d51f7.

Verified command/cwd/listener for rehearsal PID 55130 on `[::1]:4174`, then stopped only that process. Timestamp 2026-10-20T19:41:08.391625Z (15:41 EDT). Confirmed no 4174 listener; shipping PID 65423 remains on `[::1]:4173` in HMR-off verification mode. Rehearsal worktree `/Users/getumwanna/.codex/worktrees/upstream-sync-rehearsal/GEV` remains intact. Its94 log files total 59,428,182 bytes; exact relative paths, byte lengths and SHA-256 hashes are retained in `/Users/getumwanna/Documents/GEV/.gev-logs/post-pin-review/rehearsal-log-retention.json`. No logs or worktree were removed.

`PHASE-2A-REVERIFICATION.md` now contains the required frozen-pin source/key/coverage/doc-section review and measured Ajv(a)/(b) comparison, including precise 63-path recommended inventory, dependency candidates and acceptance gates. Recommended dev-only lazy Ajv has zero incremental production compiler payload, while actual isolated dev prebundle is 269,412 raw / 50,631 gzip / 42,829 Brotli bytes excluding schemas/adapter/maps. The proper server-side alternative needs an extra original tooling-test edit; it cannot silently fit the approved two-file upstream allowlist. Generated projection and Ajv-role proposals await review. No Phase 2a implementation or Phase 2b work has started; restore normal HMR before future Library isolation/recovery tests.

## Normal-HMR retest prerequisite after approved reverification

The user approved the Phase 2a report's63-path projection, dev-only lazy Ajv role and pin/doc/content facts, but now requires normal-HMR `test:track` on 4173 before milestone 1. The previously reported 109/0/0 used the temporary HMR-off root launch. It remains recorded, not silently relabeled as a normal-mode pass. Standard root CLI/HMR is being restored with no source/harness/dependency changes; 4174 stays stopped with all logs/worktree retained.

The interrupted 88-pass run is best classified as a probable Vite reload interruption: no assertion failure/final summary, context destroyed during an ordinary evaluation, preserved reload messages and matching source ctimes with unchanged content/mtimes. Precise client navigation timing and the metadata writer remain unknown. Normal HMR is the required next verification, not another HMR-off workaround. Evidence directory `.gev-logs/normal-hmr-2026-10-20.3KpYkt/` will retain server output/configuration and user rerun output. Any failure is diagnosed before Phase 2a. After a complete normal pass, implementation milestone 1 onward is approved with the existing editorial and HMR containment stop gates.

Normal HMR restoration completed: standard root CLI PID 78207 at localhost:4173, resolved HMR true, policy preserved; 4174 remains stopped. 76 HTTP-only checks pass with stable optimizer metadata. Normal-mode user tracking is still required before Phase 2a begins; evidence is `.gev-logs/normal-hmr-2026-10-20.3KpYkt/`.
