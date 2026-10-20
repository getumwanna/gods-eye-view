# Geospatial Intelligence Hub agent instructions

## Scope and authorization

Phase 1 implementation is complete and its `cn` dependency review correction has passed clean-install, typecheck, allocation-gated tests, both builds, boundaries, and doctor. Acceptance still awaits the user's `npm run qa:hub` output and its resolution; record it in `docs/custom/PHASE-1-VALIDATION.md`. The user explicitly waived all missing historical Phase 0 baseline checks; those remain unperformed/unverified, not passed. Official MIT shadcn/ui supersedes the 21st.dev choice.

The user authorized **Phase 2a planning only**. `docs/custom/PHASE-2A-PLAN.md` proposes sources/schema, Data Sources, Knowledge Center, original article summaries, case studies, and local search, with only `package.json` and `package-lock.json` as proposed original-upstream edits. Do not implement, install these planned dependencies, or create 2a content until Phase 1 acceptance and explicit plan approval. Phase 2b planning is deferred until 2a ships. Its acquisition/read-only-summary/browser-direct-adapter/upcoming-launch/dashboard work is not authorized. The separate-branch upstream-sync rehearsal is only a proposal; do not execute it or advance the pin without separate approval.

Approved upstream files: `package.json`, `package-lock.json`, `vite.config.js`, `src/main.js`, `style.css`, `src/tooling/viteBuild.test.mjs`. No other existing upstream file may change without an approved amendment. New hub/custom files follow `docs/custom/PHASE-1-PLAN.md`. Work through milestones 1–4 in order; the milestone 1 six-file diff has been shown in `docs/custom/PHASE-1-M1-UPSTREAM.patch`. Do not add another approval pause within the approved scope.

At each session start read `CUSTOMIZATION.md`, `STATUS.md`, `docs/custom/PHASE-0-AUDIT.md`, `docs/custom/PHASE-1-PLAN.md`, and `docs/custom/PHASE-1-VALIDATION.md`; inspect HEAD, branch, status, and diff. Read the relevant upstream runtime/security/source/testing documents. Before a new phase, present a short file-level plan and wait for explicit approval. The earlier B/A license hold is historical and was resolved by choosing official shadcn; neither 21st component was adopted.

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

All four Phase 1 milestones and final checks are recorded in `docs/custom/PHASE-1-VALIDATION.md`. `STATUS.md` is the current work list. Accent remains `#38BDF8`; Refreshed is `#2DD4BF` dark / `#0F766E` light. Token contrast and both rendered colors were verified. The CLI harness itself is authored/syntax-checked, not executed. Phase 1 acceptance awaits the user-run QA receipt. Phase 2a is planning only; Phase 2b planning is deferred until 2a ships. No Phase 2 implementation is authorized.
