# Phase 1 validation record

Updated October 20, 2026, America/New_York. Phase 1 implementation is approved. All four milestones are implemented and checked; user acceptance remains pending the user-run QA receipt. Phase 2a planning is authorized separately; no Phase 2 implementation is authorized.

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

### User-run QA receipt — pending

The user will run `npm run qa:hub` and paste the output. No output has been received for this review, and the harness has not been executed by the agent. Record the actual result, timestamp/environment, and any failure resolution here when it arrives.

**Dependency correction resolved. Phase 1 acceptance remains pending the user-run QA receipt and its outcome. No acceptance is inferred from the earlier browser evidence.**
