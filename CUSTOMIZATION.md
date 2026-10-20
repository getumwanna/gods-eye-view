# Geospatial Intelligence Hub customization ledger

## Provenance

- Request: Geospatial Intelligence Hub, v2, October 19, 2026.
- Authorized scope: The user explicitly approved Phase 1 implementation with the exact six-file upstream allowlist, replaced the 21st.dev selection with the official MIT-licensed shadcn/ui Radix sidebar, and explicitly waived all missing Phase 0 baseline checks on October 20, 2026. The waived checks remain unperformed/unverified; they are not passing results. Phase 1 acceptance remains at the end of the phase. Phase 2 is not authorized.
- Upstream: https://github.com/bilawalsidhu/gods-eye-view
- User-owned fork: https://github.com/getumwanna/gods-eye-view
- Verified upstream pin: `de2138e84c1778fd98a48b7c9fd0b9788c318946`.
- Upstream commit subject: `Merge pull request #1233 from yaka0007/fix/tarktee-datex-catalog-hardening`.
- Manifest version at this pin: `0.2.1`. The commit, rather than a floating release name, is the baseline authority.
- Local checkout: `/Users/getumwanna/Documents/GEV`.
- Historical Phase 0 milestone branch: `hub/phase-0-audit`.
- Current Phase 1 branch: `codex/phase-1-foundation`.
- `origin`: `https://github.com/getumwanna/gods-eye-view.git`.
- `upstream`: `https://github.com/bilawalsidhu/gods-eye-view.git`.
- Initial checkout was shallow with blob filtering. Fetch additional history explicitly when an update/review requires it.
- GitHub API confirmed `fork: true` and parent `bilawalsidhu/gods-eye-view`; a fetch confirmed that the pinned commit is present in `origin/main`.

## Upstream files touched

Milestone 1 implementation is present. Exactly these six files from the pinned upstream repository are edited:

| Upstream file | Approved responsibility |
| --- | --- |
| `package.json` | Add pinned hub runtime/dev dependencies and hub validation commands; preserve existing stack versions. |
| `package-lock.json` | Lock approved additions; existing locked package versions remain unchanged. |
| `vite.config.js` | Wrap standalone configuration for the sibling hub entry while preserving security/provider setup. |
| `src/main.js` | Add the custom bootstrap hook without migrating the globe framework. |
| `style.css` | Import shared tokens and scoped custom-globe styles; isolate hub Tailwind/reset CSS. |
| `src/tooling/viteBuild.test.mjs` | Verify hub inputs and preserved standalone/panel configuration invariants. |

The concrete milestone 1 patch shown to the user is `docs/custom/PHASE-1-M1-UPSTREAM.patch`. Source pin remains `de2138e84c1778fd98a48b7c9fd0b9788c318946`. No additional upstream path is authorized. Validation is in `docs/custom/PHASE-1-VALIDATION.md`.

## Added files

| File | Reason |
| --- | --- |
| `CUSTOMIZATION.md` | Pin, fork/remotes, and upstream edit ledger |
| `docs/custom/PHASE-0-AUDIT.md` | Baseline, layer inventory, requirement gap table, conflicts, and recommended sequencing |
| `STATUS.md` | Verified state, outstanding verification, dependencies, and phase gates |
| `AGENTS.md` | Architecture, commands, evidence rules, and authorization boundaries |
| `docs/custom/PHASE-1-PLAN.md` | Exact proposed upstream/new-file scope, visual component shortlist, implementation and verification gates |
| `docs/custom/PHASE-1-COMPONENT-REVIEW.md` | B license/dependency gate, A fallback details, and independently computed Refreshed contrast evidence |

## Phase 1 source and validation records

Official shadcn/ui source is pinned at `ba1503c64472b82256d9de95e2e62c5901a38e8b`; its MIT notice must accompany copied code. Radix primitive imports are adapted to the four needed packages instead of the full `radix-ui` umbrella. `docs/custom/PHASE-1-COMPONENT-REVIEW.md` records the selection and dependency evidence. `docs/custom/PHASE-1-VALIDATION.md` records milestone checks; ignored logs remain under `.gev-logs/phase1-2026-10-20/`. Component attribution belongs in `design/COMPONENTS.md` as the shell is integrated.

## Local installation artifacts

Node `24.22.0` was installed in the user's existing nvm installation; commands for this project used its explicit `bin` directory. No tracked runtime configuration was changed. `npm ci` installed the locked dependencies. Development/build/test artifacts remain ignored under `node_modules/`, `dist/`, and `.gev-logs/`.

Local evidence logs: `.gev-logs/phase0-2026-10-19/`. These are machine-local receipts, not committed project content. The durable baseline summary is in the audit. No `.env` was created and no provider credentials were configured.

Visual catalog captures for the Phase 1 shortlist are local review evidence in ignored `qa-artifacts/phase-1-shortlist/`, not adopted application assets or component code. Canonical source links are in the plan. A public catalog response automatically included embedded source; it was not used or copied into component files. No registry/API retrieval, install command, or quota-consuming component tool was used.

## Future customization rules

1. Phase 0 audit and Phase 1 implementation approval are recorded. The user explicitly waived missing Phase 0 baselines and selected official MIT shadcn/ui. Keep waivers distinct from passes; neither 21st candidate is adopted. Continue approved milestones and stop at Phase 1 acceptance.
2. Prefer new hub/custom modules over upstream edits. Record each eventual upstream edit here with its purpose and owning phase.
3. Preserve the standalone vanilla/Cesium globe. Add a separate React hub entry on the same local server; retain share links as the handoff contract.
4. Preserve upstream Host/origin checks, localhost binding, attribution, responsible-use restrictions, and provider request budgets.
5. Use the pinned source as acceptance evidence. Upstream updates require a separate reviewed rebase/update and new baseline; do not silently advance this pin.
6. Never commit credentials, raw logs, caches, generated builds, provider payloads, or unlicensed media.

See [the Phase 0 audit](docs/custom/PHASE-0-AUDIT.md) and [current status](STATUS.md).

### Phase 1 milestone 2

Implemented only new hub components/pages/router, official shadcn companions and MIT notice, the component provenance ledger, shared layer/source-guide metadata, and four router/render tests. Existing upstream paths remain the same six. Dashboard and Library explain Phase 2 availability; there are no fabricated feed metrics.

### Phase 1 milestone 3

New custom globe modules bind branding/theme before gaze initialization, install a back link and owned passive disclosures at application ready, read existing DataManager activity, and project one abortable same-origin setup-status read into presence/unknown only. No provider polling, cache owner, source implementation or credential form changed. Lifecycle tests cover destroy/failed/embedded cleanup. Scoped CSS positions desktop disclosures away from native rails and bounds narrow overlays; explicit dismissal preserves keyboard access.
