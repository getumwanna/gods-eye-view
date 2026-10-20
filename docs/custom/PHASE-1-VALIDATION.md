# Phase 1 validation record

Updated October 20, 2026, America/New_York. Phase 1 implementation is approved. Milestone 1 is implemented and its checks below passed; milestones 2–4 and phase-level acceptance remain pending. Phase 2 is not authorized.

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
