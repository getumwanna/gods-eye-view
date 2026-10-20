# Geospatial Intelligence Hub agent instructions

## Scope and authorization

The user requested a local hub that wraps and extends God's Eye View. The approved work is **Phase 0 only**: fork/pin/install, unmodified runtime checks, baseline tests, and the written gap analysis. The approval does not authorize Phase 1 implementation.

At session start read `CUSTOMIZATION.md`, `STATUS.md`, and `docs/custom/PHASE-0-AUDIT.md`; inspect HEAD, branch, status, and diff. Read the current upstream `docs/CURRENT-STATE.md`, `DATA_SOURCES.md`, `SECURITY.md`, `CONTRIBUTING.md`, and `TESTING.md` for the feature being considered.

Before each new phase, present a short plan listing files to create/change and wait for explicit approval. Phase 0 gap approval and any unmet acceptance criteria must be addressed before Phase 1. Stop at every phase gate. A documentation checkpoint is not evidence that a phase has been accepted.

## Architecture

- Existing globe: vanilla JavaScript, CesiumJS, Vite, standalone entry at `/`.
- Root `vite.config.js` delegates to `server/standalone/vite.config.js`; provider middleware is under `server/providers/`.
- Future hub: sibling React/TypeScript entry, proposed `/hub/`, using Tailwind, shadcn/ui, and reviewed 21st.dev components. It must share the existing local server and provider acquisition/cache ownership.
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
- Persistent secret keys stay server-side and outside logs, URLs, version control, and exports. Browser-designated public tokens and ephemeral AI credentials require the exceptions recorded as open questions in the audit; leave them unconfigured until resolved.
- Bind localhost only. Do not weaken Host/origin/forwarding-header gates, expose the server, or deploy without separate approval and the Phase 4 audit.
- Preserve all map/provider credits and the operational-use disclaimer. Code's MIT license does not license every dataset/media asset. Check each source and recorder retention right separately.
- No named-person search, face recognition, plate recognition, or individual tracking. ALPR means mapped locations/tags only.
- AI is optional. Do not make paid model/provider calls, retrieve quota-consuming 21st.dev code, or enable credentials without the applicable user authorization.
- Prefer Node for any future recorder; do not rewrite GEV in Rust. Rust tools/services are isolated optional later work.

## Known verification boundary

During Phase 0, automatic browser approval rejected access to `http://localhost:4173/`. Do not work around that denial through another browser, raw CDP, a browser-driving shell script, or indirect page execution. The user separately confirmed that the globe renders. Automated browser gates, individual layer load checks, and GPU/FPS measurements remain unverified. Reassess permitted tooling with the user before attempting those checks in a later session.

Do not mark Phase 0 accepted until the user reviews the gap analysis and any remaining acceptance gaps are explicitly resolved or waived. `STATUS.md` is the authoritative local work list.
