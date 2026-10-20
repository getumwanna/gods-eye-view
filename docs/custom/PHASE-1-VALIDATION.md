# Phase 1 validation record

Updated October 20, 2026, America/New_York. Phase 1 implementation is approved. All four milestones are implemented and checked; user acceptance remains pending a passing user-run QA rerun after the installed-Puppeteer input API correction. Phase 2a planning is authorized separately; no Phase 2 implementation is authorized.

## Authorization and historical baseline boundary

The user explicitly selected the official MIT shadcn/ui Radix sidebar instead of the 21st candidates and waived all missing Phase 0 baseline checks. Browser/tracking gates, individual live-layer outcomes, GPU/FPS measurements, and other missing Phase 0 baseline checks remain unperformed/unverified, not passed. This waiver resolves the preimplementation gate and does not waive prospective Phase 1 validation. The original Phase 0 evidence is preserved in `PHASE-0-AUDIT.md`.

## Milestone 1 — build foundation and shared tokens

The six-file upstream diff was shown to the user in [`PHASE-1-M1-UPSTREAM.patch`](PHASE-1-M1-UPSTREAM.patch). The approved upstream paths are exactly `package.json`, `package-lock.json`, `vite.config.js`, `src/main.js`, `style.css`, and `src/tooling/viteBuild.test.mjs`. Current branch: `codex/phase-1-foundation`. The globe-hook scaffold is inactive until milestone 3. Root verified that existing locked package versions are unchanged; approved hub additions are locked. No commit is claimed by this record.

Ignored local receipts: `.gev-logs/phase1-2026-10-20/`. Logs are machine-local evidence and must not be committed.

| Check | Observed result | Local receipt |
| --- | --- | --- |
| Build/config regression tests | **8 passed, 0 failed** | `m1-config.log` |
| Branding/theme/share-handoff foundation tests | **3 passed, 0 failed** | `m1-foundation.log` |
| Refreshed/accent/status-text contrast calculation test | **1 passed, 0 failed**; calculation evidence, not a rendered accessibility pass | `m1-contrast.log` |
| `npm run typecheck:hub` | Passed; TypeScript emitted no errors | `m1-types.log` |
| `npm run check:boundaries` | Passed import-direction and package-boundary checks; import graph reports 1,019 modules and 79 portable entries | `m1-boundaries.log` |
| `npm run doctor` | Passed; ready; listed optional providers unconfigured | `m1-doctor.log` |
| `npm run build` | Passed; **900 modules**, **4.62 s** reported | `m1-build.log` |
| `npm run build:panel` | Passed; **872 modules**, **4.23 s** reported | `m1-panel.log` |

Root and panel builds report the existing large-chunk warning. Build times are tool-reported durations, not cold-start or FPS measurements. Configuration tests and build success do not establish browser rendering, focus behavior, live-feed correctness, or complete phase acceptance.

## Pending milestone and phase-level checks

- Milestone 2: official sidebar provenance/notice, usable navigation, light/dark shared-token rendering, and responsive behavior.
- Milestone 3: additive globe bootstrap lifecycle, branding/token hook, back-to-hub control, honest per-value status and independent feed/key-health presentation, and share-link handoff.
- Milestone 4: current typecheck, meaningful native/custom/config tests, full upstream unit/allocation suite where required, doctor, package/import boundaries, and root/panel builds after the final changes.
- Rendered UI/accessibility checks: real backgrounds, contrast, focus, keyboard navigation, hover/selected/disabled states, desktop/mobile behavior, and clean console. Earlier computed color ratios are design evidence only.
- Browser checks, if permitted by the available approval path, must report actual outcomes. Do not work around the historical automatic localhost browser denial using another browser, raw CDP, shell browser driving, or indirect execution. If blocked, retain that result and seek an explicit phase-acceptance waiver where needed.
- Final scope review: only the six approved upstream paths plus documented new/project-owned files; no provider acquisition redesign, widened bind, exposed secrets, or Phase 2 work.

Stop at Phase 1 acceptance after every criterion is met or explicitly waived.

## Milestone 2 — official sidebar shell

- Official shadcn pin `ba1503c64472b82256d9de95e2e62c5901a38e8b`, full MIT notice in `hub/SHADCN-LICENSE.md`, adaptations and pinned source links in `design/COMPONENTS.md`. No 21st implementation adopted.
- Four router/server-render tests passed with network forbidden; hub TypeScript check and production build passed.
- Milestone 1 commit `2c33dd4b` also built successfully from a clean git archive with the installed locked dependency tree (4.54 s); an entrypoint staging race was corrected before continuing.
- The original in-app browser path now permits Phase 1 access. The hub Dashboard rendered at `/hub/` on October 20; broader interaction/layout checks follow in milestone 4. This does not retrospectively pass the waived Phase 0 baseline.

## Milestone 3 — passive globe customization

- 23 focused tests pass: four real-application lifecycle/bootstrap tests, eight feed/metadata/setup tests, and eleven key-access tests. An independent reentry test caught a duplicate setup read; assigning the pending promise before notification fixed it.
- Doctor and both boundary checks pass. All optional provider credentials remain absent. No upstream path was added to the six-file allowance.
- Original in-app browser: globe and custom title/logo/loading render; Cesium and Esri credits remain visible. Existing POWER UP opens without configuring or saving any key.
- Desktop setup disclosure initially collided with the native left rail. It now opens in the center corridor; the narrow disclosure is a bounded intentional overlay with explicit close, outside-click and focused-Escape dismissal. Retest passed at default desktop and 390 × 844 requested viewport (375 CSS content width). Native controls remain usable when it closes.
- One existing USGS earthquake layer was toggled for a Phase 1 presentation check. The passive strip showed separate ON health, Refreshed observation kind, USGS source, missing-coverage text, and acquisition age, without displaying a count. This is one current browser observation, not a complete provider/layer baseline.
- Rendered dark Refreshed computed color is `rgb(45, 212, 191)` (`#2DD4BF`), distinct from accent `#38BDF8`. Light cross-shell verification follows in milestone 4.

## Milestone 4 — final handoff and regression evidence

| Check | Final result | Evidence |
| --- | --- | --- |
| Full native unit/allocation suite, Node 24.22.0 | 8,260 passed, 1 skipped, 0 failed | `m4-unit-final.log`: 8,245 ordinary passes + one focus allocation pass + fourteen overlay allocation passes; Windows-only DACL skip on macOS |
| Hub TypeScript | Pass | `m4-types.log` |
| Import and package boundaries | Pass | `m4-boundaries.log` |
| Doctor | Pass; optional credentials absent | `m4-doctor.log` |
| Final CSS/lifecycle/contrast regression group | 38 passed, 0 failed | `m4-css-release.log` |
| Root and panel production builds | Pass (5.41 s root / 5.20 s panel); upstream large-chunk warning retained | `m4-build-release.log`, `m4-panel-release.log` |
| User-run QA harness | Authored and syntax-checked; not executed | `scripts/qa-custom-hub.mjs`; original CUA path supplied actual browser evidence below |
| Six upstream paths / locked versions | Pass | Existing-upstream intersection is exactly the approved six; no preexisting locked version changed or disappeared |

Built entry graph scan: globe reaches eight JavaScript chunks with no React runtime signature and its local stylesheets contain no Tailwind tokens; hub reaches two JavaScript chunks and contains React/Tailwind as expected (`m4-build-isolation.json`). Listener verification shows only `[::1]:4173` (`localhost`), with strict port binding.

Logs are local ignored evidence under `.gev-logs/phase1-2026-10-20/`; no provider payloads or secret values are stored in this record.

Original in-app browser checks passed: Dashboard/Library/Settings routes; known source guides; desktop collapse; shared dark/light persistence across shells; keyboard skip link; mobile sheet open/close, Escape focus return and content focus after navigation; external share rejection; exact original full v2 URL retained on handoff; globe title/loading/logo/favicon; passive layer presentation; genuine POWER UP opening without key entry/save; custom disclosure close/Escape; credits; narrow spacing and no horizontal overflow. Requested mobile viewport was 390 × 844; hub content width includes its scrollbar while the globe uses the full 390 CSS pixels. Temporary viewport overrides were reset.

Rendered Refreshed values are dark `rgb(45, 212, 191)` / light `rgb(15, 118, 110)`. Accent remains `#38BDF8`. Computed token contrast passes on both page/panel surfaces (dark 10.32/9.49; light 5.23/5.47). The light title uses readable text on a white backing, and dock labels use shared text tokens. A narrow backing initially obscured top controls; limiting it to the logo and reserving the left rail below the control row corrected the collision. Final narrow boxes: custom title/control row ends at 77.47 px; native data panel starts at 92 px.

The first full suite found three integration failures: unmarked custom English labels, an icon-scanner false positive from setup state literals, and the final-Cyber-import cascade rule. All were corrected within custom files/the six-file allowance; the complete suite then passed. A one-time React hook error occurred during development dependency reoptimization while the shell was still being authored; a fresh reload after optimization had no hub errors.

Local ignored screenshots: `qa-artifacts/phase-1/hub-dark-desktop.png`, `mobile-guide-light.png`, `globe-status-dark.png`, `globe-status-light.png`, and `globe-mobile-light-final.png`. These are local QA views, not redistributed application assets.

Limitations: the CLI browser harness itself remains unexecuted; custom chrome is English-only; no exhaustive live-layer/provider check, tracking baseline, GPU/FPS measurement or full device matrix is claimed. Missing Phase 0 checks remain waived historical gaps. Phase 4 performance/provider/device work remains separate. Hosting is unselected.

**Stop for Phase 1 acceptance. Phase 2 is not authorized.**

## Phase 1 review correction — dependency and clean-install receipt

October 20, 2026; Node **24.22.0**, npm **11.19.1**. The pinned official shadcn helper reexported `cn`, explaining its original inclusion. The sidebar does not need that package specifically. `cn@0.5.0` has been removed, and `hub/src/lib/utils.ts` now uses the local `twMerge(clsx(inputs))` helper with direct exact dependencies `clsx@2.1.1` and `tailwind-merge@3.7.0` (MIT). See the component review for pinned provenance.

| Requested check | Result | Local ignored evidence |
| --- | --- | --- |
| `npm ci` after package/lock correction | Pass; 0 vulnerabilities | `cn-review/npm-ci.log` |
| `npm run typecheck:hub` | Pass | `cn-review/typecheck.log` |
| `GEV_REQUIRE_ALLOCATION_GATE=1 npm test` | **8,261 passed, 1 platform skip, 0 failures** (8,262 total) | `cn-review/tests.log` |
| `npm run build` (globe + hub) | Pass, 5.29 s | `cn-review/build.log` |
| `npm run build:panel` | Pass, 4.79 s | `cn-review/panel.log` |
| `npm run check:boundaries` | Pass | `cn-review/boundaries.log` |
| `npm run doctor` | Pass; optional credentials absent | `cn-review/doctor.log` |
| Lockfile comparison against pre-review HEAD | `cn` absent; only new package is `tailwind-merge`; no unrelated locked version changed or disappeared | `cn-review/receipt.json` |

Evidence directory: `.gev-logs/phase1-2026-10-20/`. The added regression checks conditional class inputs, conflicting Tailwind utilities, and the sidebar's data-attribute variant overrides. Existing large-chunk build warnings remain. npm retained its existing unapproved-install-script warnings; no additional script approval was granted. These checks make no new live-feed, browser, or FPS claim.

### User-run QA receipt — received; rerun required

The user supplied `npm run qa:hub` output: **7/9 passed**, with the full-v2 handoff and dependent globe branding/status/setup/credits checks failing. The matching local receipt is `.gev-logs/qa-custom-hub-2026-10-20T15-57-41-177Z.json` (timestamp `2026-10-20T15:57:41.178Z`). It records zero unhandled page errors, zero setup reads, and zero blocked acquisition requests. Node/browser versions were not included in that receipt. This is a failed QA result, not Phase 1 acceptance. The agent has not executed the browser harness.

**Dependency correction resolved. The initial user-run QA result is recorded as failed; Phase 1 acceptance requires a passing user-run rerun after the correction below. No acceptance is inferred from the earlier browser evidence.**

## User QA failure review — harness state isolation

The negative share-form check leaves a rejected credential-shaped test URL in the React-controlled input. The positive case then calls `page.goto()` with the same dashboard hash and uses `page.type()` without clearing that field. Same-document hash navigation can retain React state, so the valid fixture is appended to the rejected value. The form correctly rejects that combined value; navigation cannot complete. The following globe check then has no ready globe prerequisite. This is a concrete harness isolation defect and a plausible explanation for both reported failures, not proof that globe behavior passed.

Correction is confined to custom QA code:

- `scripts/qa-custom-hub-input.mjs` clears and replaces the controlled input, then checks the exact value before submission. Both negative and positive cases use it.
- `scripts/qa-custom-hub.mjs` records only fixed checkpoint names on failure, removes its navigation listener on completion/failure, and identifies a downstream globe check as blocked by globe readiness when that prerequisite failed. A blocked check still fails the overall gate. No raw errors, page text, URLs, credentials, or provider payloads are added to receipts.
- `src/custom/hub/qaHarness.test.mjs` reproduces a retained rejected field and append-only failure, then proves replacement produces a valid full-v2 handoff. Its page-evaluation callback is tested without caller closures, matching serialization behavior. This is an offline regression, not a browser pass.

Verification on Node 24.22.0: both modified/new harness modules pass `node --check`; the QA-input, hub router/render, and full-state handoff regression group passes **11/11**, zero failures. Local evidence: `.gev-logs/phase1-2026-10-20/qa-review/focused.log`. Product code, dependencies, acquisition rules, and the six-file upstream intersection did not change. The prior clean-install/typecheck/full-suite/build receipts remain historical results for unchanged product code; they were not rerun or relabeled as browser verification.

**Awaiting the user's fresh `npm run qa:hub` output. Neither failed browser check is marked passed. Phase 1 is not accepted; Phase 2a remains planning only.**

## Second user QA receipt — stale Vite dependency startup failure

The user supplied a second `npm run qa:hub` output reporting **1/9 passed**. The matching receipt is `.gev-logs/qa-custom-hub-2026-10-20T16-16-18-120Z.json`, timestamp `2026-10-20T16:16:18.121Z`. Every hub-dependent check failed before the positive input helper was reached; the globe presentation check was blocked by readiness. The receipt again records zero setup reads, zero blocked acquisition requests, and zero page errors. The reported JavaScript-error pass only counted exceptions; it did not establish that the application ran.

**Confirmed cause:** the original long-running Vite process retained stale optimizer state after dependency installation. A read-only traversal of 36 local hub modules found one failed asset: the optimized `tailwind-merge` module returned **HTTP 504, “Outdated Optimize Dep”**. The other optimized modules used a different cache version. The optimizer metadata file was absent from disk. Hub HTML and its entry module returned 200, but that failed dependency prevented React startup. The permitted original in-app browser path also showed a blank hub after reload. This cause is separate from the prior harness input-state defect.

Recovery: stopped only the verified GEV Vite process and restarted with supported Node 24.22.0 and `HOST=localhost PORT=4173 npm run dev -- --strictPort`. No dependency/cache deletion, credential configuration, Keychain launcher, host-gate change, or external exposure was used. No local `.env` ladder files were present; the checked inherited provider variables were unset. The new listener is only `[::1]:4173`. This operational check does not manufacture the waived Phase 0 baseline.

Post-restart evidence:

- All **36** local hub modules return HTTP 200; optimized dependencies use one consistent cache version, including `tailwind-merge`.
- The permitted in-app browser rendered Dashboard. Submitting the existing synthetic all-layers-off fixture reached the exact initial full v2 URL, then GEV performed its normal URL normalization. The globe rendered with custom branding, the no-active-layers disclosure, OFF layer controls, and visible Cesium/data credits. Returned to Dashboard afterward. These observations are targeted browser recovery checks, not execution of `qa:hub` or a full replacement for its nine assertions.
- Local screenshot: `qa-artifacts/phase-1/hub-after-optimizer-restart.png` (ignored QA evidence, not an application asset).

Harness improvements: new `scripts/qa-custom-hub-diagnostics.mjs` classifies failed local document/module/optimized-dependency responses into fixed counters/codes. The main harness verifies successful document delivery **and actual hub rendering** before dependent checks; startup failures block those checks immediately. A zero exception count cannot pass on an unrendered app. Receipts retain safe checkpoints, fixed failure categories, status/count data, and readiness state; they do not retain response bodies, raw errors, request URLs, console content, or credentials. Acquisition restrictions remain unchanged. `SETUP.md` now requires restarting the dev server after dependency changes.

Verification: harness/diagnostics syntax checks pass; the focused QA-input/diagnostics, hub router/render, and full-state handoff group passes **13/13**, zero failures, on Node 24.22.0. Evidence: `.gev-logs/phase1-2026-10-20/qa-review/startup-focused.log`. Product code, dependencies, and original-upstream files are unchanged by this recovery. The earlier full-suite/build/install receipts remain historical results, not newly repeated checks.

**Phase 1 still awaits a passing user-run `npm run qa:hub` receipt after this recovery. Both reported failed runs remain recorded as failed. No Phase 2 implementation is authorized.**

## Third user QA receipt — incorrect readiness selector

The user's third output reports **0/9 passed**, with all checks blocked at `hub-render` and reason `readiness-timeout`. Matching receipt: `.gev-logs/qa-custom-hub-2026-10-20T16-27-29-926Z.json`, timestamp `2026-10-20T16:27:29.927Z`. The document status is 200; every local document/module/optimized-dependency failure counter is zero, and page-error count is zero. The prior Vite recovery did not establish that the newly added readiness predicate was correct.

**Confirmed cause: an agent-introduced selector error.** The predicate required `main#main-content h1`. The actual shell is `<main data-slot="sidebar-inset"><div id="main-content"><h1>Dashboard</h1>…`, so that selector can never match (`hub/src/components/HubShell.tsx`, `SidebarInset` in `hub/src/components/ui/sidebar.tsx`). This made the new startup gate fail even when Dashboard rendered normally.

Correction: export a self-contained `hubIsReady()` from the existing custom QA diagnostics module and pass that exact function to Puppeteer's `waitForFunction`. It uses `main #main-content h1`, plus the navigation and share input. Product markup, runtime, dependencies, server configuration, and original-upstream files remain unchanged.

Verification:

- The exact serialized `hubIsReady()` is tested against the **real App server-rendered markup** using the already installed JSDOM. Dashboard passes; Library, Settings, and an empty root fail. Removing the heading, navigation, or share input independently fails readiness. The test also confirms the obsolete selector cannot match the actual shell. No fake app markup or new dependency is used.
- Through the permitted original in-app browser path, the same exported predicate evaluated against the live rendered Dashboard returns **true**; the obsolete selector matches **zero** elements. This is direct DOM verification of the corrected gate, not a CLI browser-harness run.
- Syntax checks pass. The QA-input/diagnostics, real App routing/rendering/readiness, and full-state handoff group passes **14/14**, zero failures, on Node 24.22.0. Evidence: `.gev-logs/phase1-2026-10-20/qa-review/readiness-dom-focused.log`.
- A separate read-only audit of the remaining harness assertions against current markup/APIs found no further deterministic selector mismatch. Browser interaction, responsive layout, GPU initialization and credit visibility still require the actual user-run gate; this audit is not a declaration that all nine pass.

**All three user results (7/9, 1/9, 0/9) remain recorded as failed. Await a fresh passing user-run `npm run qa:hub` receipt. Phase 1 is pending; Phase 2a remains planning only.**

## Fourth user QA receipt — Puppeteer click option mismatch

The latest user result is **6/9 passed**. Matching receipt: `.gev-logs/qa-custom-hub-2026-10-20T16-31-06-069Z.json`, timestamp `2026-10-20T16:31:06.070Z`. Startup is ready with document status 200, all failed-resource counters zero, and no unhandled page errors. The first five UI checks pass. Both share-input checks fail exact-value assertions; the dependent globe check is blocked. The negative check's stale `hub-route-heading` checkpoint did not mean navigation failed.

**Confirmed cause:** the installed Puppeteer **25.10.0** mouse click implementation takes `count` and overwrites the lower-level `clickCount` from that value. The custom input helper supplied `{ clickCount: 3 }`, so the default `count: 1` produced one click. Backspace then removed one character instead of the previous complete URL. The first empty-field submission can work, while replacing the existing value fails. The official [MouseClickOptions reference](https://pptr.dev/api/puppeteer.mouseclickoptions) documents `count`; the installed implementation is in `node_modules/puppeteer-core/src/cdp/Input.ts`.

Correction: `scripts/qa-custom-hub-input.mjs` now uses **`{ count: 3 }`**. Negative input replacement and destination rejection also get their own fixed checkpoints in the main harness. Exact-value and URL preservation assertions are retained. No product code or dependency changed.

The earlier input test incorrectly assumed that passing `clickCount` meant three clicks. It is strengthened to use the **actual installed Puppeteer mouse and keyboard classes**, exported by the direct `puppeteer` dependency, with an in-memory transport. It checks the emitted click counts `[1, 2, 3]` and drives the selection model from those events. No browser, remote-debugging connection, or network transport is opened. This avoids teaching the stub the same wrong API assumption as the helper.

Evidence: before the helper change, the strengthened input test reproduces the exact-value failure (`input-api-before-fix.log`). After the one-option correction, the focused QA diagnostics/input, real App readiness/rendering, and full-state handoff group passes **14/14**, zero failures (`input-api-after-fix.log`), on Node 24.22.0. Harness/helper syntax checks pass. Both logs are under `.gev-logs/phase1-2026-10-20/qa-review/`. An independent in-memory controlled-React/Input check also reproduced failure with the old option and exact DOM/state replacement with the corrected option. These are offline checks, not a full browser QA receipt.

**All four user runs (7/9, 1/9, 0/9, 6/9) remain recorded as failed. Phase 1 awaits a fresh passing user-run `npm run qa:hub` result. Phase 2a remains planning only.**
