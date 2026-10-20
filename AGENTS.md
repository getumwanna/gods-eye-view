# Geospatial Intelligence Hub agent instructions

## Scope and authorization

**Phase 1 is accepted.** The user ran `npm run qa:hub`, reported all 9 checks passing, and explicitly approved acceptance. The matching receipt at `2026-10-20T16:48:33.899Z` has nine true assertions and overall `passed: true`; see `docs/custom/PHASE-1-VALIDATION.md`. The `cn` dependency review is resolved, all four milestones are complete, and earlier failed receipts remain historical evidence. The agent did not execute the CLI browser harness. Missing historical Phase 0 baselines remain explicitly waived, not passed. Official MIT shadcn/ui supersedes the 21st.dev choice.

The user approved **Phase 2a with conditions**. Rehearsal user reruns now pass (hub 9/9, tracking 109/0/0), and adoption is approved with three conditions: persistently disable Hong Kong/Taiwan until separate terms/activation approval; accept Ontario keyless coverage loss without configuring a key; carry the reviewed cache/format/annotation/diagnostic repairs. The user approved `docs/custom/UPSTREAM-INTEGRATION-PLAN.md` as written: implement the project-owned provider policy in the separate integration worktree, fast-forward shipping to the reviewed integration, and restart only shipping on localhost:4173 after its non-browser gates. The integration candidate incorporates frozen upstream pin `064d51f7be2675f1c69e16068e9c49d1a60144d1`. Shipping browser checks remain user-run; keep 4174 running until their results are resolved. After approved integration is verified on 4173, stop only 4174, keep logs, and produce the post-pin Phase 2a/Ajv review before milestone 1. Phase 2b planning remains deferred until 2a ships and is accepted.

The accepted Phase 1 six-file upstream allowlist was `package.json`, `package-lock.json`, `vite.config.js`, `src/main.js`, `style.css`, and `src/tooling/viteBuild.test.mjs`; its milestone 1 diff is recorded in `docs/custom/PHASE-1-M1-UPSTREAM.patch`. Phase 2a permits only the two original-upstream package files. Rehearsal execution has a separately approved import/repair scope in `docs/custom/UPSTREAM-SYNC-PLAN.md`; incoming upstream changes are distinct from manual customization repairs. No additional original-upstream manual repair is authorized without an amendment.

At each session start read `CUSTOMIZATION.md`, `STATUS.md`, `docs/custom/PHASE-0-AUDIT.md`, `docs/custom/PHASE-1-PLAN.md`, and `docs/custom/PHASE-1-VALIDATION.md`; inspect HEAD, branch, status, and diff. Read the relevant upstream runtime/security/source/testing documents. Before a new phase, present a short file-level plan and wait for explicit approval. The earlier B/A license hold is historical and was resolved by choosing official shadcn; neither 21st component was adopted.

Phase 2a content validation must fail `check:library` and both production builds, but must never stop the development server or the globe. In dev, invalid content produces an accessible error state inside Library routes only. Avoid configuration-time content validation and direct editable-content imports into the globe graph. The metadata projection and Ajv role remain pending post-pin review. Compare server-side dev validation sending only normalized errors into Library against lazy hub Ajv, including measured raw/gzip/Brotli bundle cost, graph isolation, HMR, lifecycle maintenance, and the existing plugin-prefix/allowlist constraints; do not presume either design is selected. At the end of milestones 2 and 3, run the checks, list every new article/case page with references, and stop for user editorial review **before committing**. The user will compare both Spatial Intelligence summaries with their originals.

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

All four Phase 1 milestones and final checks are recorded in `docs/custom/PHASE-1-VALIDATION.md`. `STATUS.md` is the current work list. Accent remains `#38BDF8`; Refreshed is `#2DD4BF` dark / `#0F766E` light. Token contrast and both rendered colors were verified. The user-run CLI browser harness now passes 9/9 and Phase 1 is accepted. The agent has not executed that harness; the passing receipt and all five earlier failed receipts remain recorded. Phase 2a is conditionally approved. Rehearsal user reruns pass and adoption is approved with conditions; the integration execution plan still needs approval. Phase 2a reverification/Ajv comparison follows verified shipping integration, before milestone 1. Phase 2b stays deferred until 2a ships and is accepted.
