# Geospatial Intelligence Hub customization ledger

## Provenance

- Request: Geospatial Intelligence Hub, v2, October 19, 2026.
- Authorized scope: Phase 0 audit approved; Phase 1 implementation approved on October 20, 2026, subject to selected B's license/dependency review, baseline resolution, the exact six-file upstream allowlist, milestone order/diff checkpoint, and final acceptance. Phase 2 is not approved. Implementation is currently held because license evidence and baseline results are missing.
- Upstream: https://github.com/bilawalsidhu/gods-eye-view
- User-owned fork: https://github.com/getumwanna/gods-eye-view
- Verified upstream pin: `de2138e84c1778fd98a48b7c9fd0b9788c318946`.
- Upstream commit subject: `Merge pull request #1233 from yaka0007/fix/tarktee-datex-catalog-hardening`.
- Manifest version at this pin: `0.2.1`. The commit, rather than a floating release name, is the baseline authority.
- Local checkout: `/Users/getumwanna/Documents/GEV`.
- Local milestone branch: `hub/phase-0-audit`.
- `origin`: `https://github.com/getumwanna/gods-eye-view.git`.
- `upstream`: `https://github.com/bilawalsidhu/gods-eye-view.git`.
- Initial checkout was shallow with blob filtering. Fetch additional history explicitly when an update/review requires it.
- GitHub API confirmed `fork: true` and parent `bilawalsidhu/gods-eye-view`; a fetch confirmed that the pinned commit is present in `origin/main`.

## Upstream files touched

**None.** Work through the Phase 1 component-review checkpoint is documentation only. Application code, lockfile, declared dependencies, templates, assets, provider configuration, and security controls have not been customized. The six approved upstream paths have no implementation diff yet; milestone 1 has not started.

## Added files

| File | Reason |
| --- | --- |
| `CUSTOMIZATION.md` | Pin, fork/remotes, and upstream edit ledger |
| `docs/custom/PHASE-0-AUDIT.md` | Baseline, layer inventory, requirement gap table, conflicts, and recommended sequencing |
| `STATUS.md` | Verified state, outstanding verification, dependencies, and phase gates |
| `AGENTS.md` | Architecture, commands, evidence rules, and authorization boundaries |
| `docs/custom/PHASE-1-PLAN.md` | Exact proposed upstream/new-file scope, visual component shortlist, implementation and verification gates |
| `docs/custom/PHASE-1-COMPONENT-REVIEW.md` | B license/dependency gate, A fallback details, and independently computed Refreshed contrast evidence |

## Local installation artifacts

Node `24.22.0` was installed in the user's existing nvm installation; commands for this project used its explicit `bin` directory. No tracked runtime configuration was changed. `npm ci` installed the locked dependencies. Development/build/test artifacts remain ignored under `node_modules/`, `dist/`, and `.gev-logs/`.

Local evidence logs: `.gev-logs/phase0-2026-10-19/`. These are machine-local receipts, not committed project content. The durable baseline summary is in the audit. No `.env` was created and no provider credentials were configured.

Visual catalog captures for the Phase 1 shortlist are local review evidence in ignored `qa-artifacts/phase-1-shortlist/`, not adopted application assets or component code. Canonical source links are in the plan. A public catalog response automatically included embedded source; it was not used or copied into component files. No registry/API retrieval, install command, or quota-consuming component tool was used.

## Future customization rules

1. Phase 0 audit and conditional Phase 1 plan approval are recorded. Resolve selected component permission/dependencies and the missing baseline before implementation. Do not treat B's selection as permission to adopt unlicensed source or automatically switch to A.
2. Prefer new hub/custom modules over upstream edits. Record each eventual upstream edit here with its purpose and owning phase.
3. Preserve the standalone vanilla/Cesium globe. Add a separate React hub entry on the same local server; retain share links as the handoff contract.
4. Preserve upstream Host/origin checks, localhost binding, attribution, responsible-use restrictions, and provider request budgets.
5. Use the pinned source as acceptance evidence. Upstream updates require a separate reviewed rebase/update and new baseline; do not silently advance this pin.
6. Never commit credentials, raw logs, caches, generated builds, provider payloads, or unlicensed media.

See [the Phase 0 audit](docs/custom/PHASE-0-AUDIT.md) and [current status](STATUS.md).
