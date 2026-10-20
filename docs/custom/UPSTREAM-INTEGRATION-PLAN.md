# Shipping integration — execution plan

October 20, 2026. **Adoption approved with conditions; integration execution awaits approval of this plan.** No shipping merge, policy implementation, server restart, or Phase 2a implementation is authorized by this documentation checkpoint.

## Inputs and merge method

Shipping is clean on `codex/phase-1-foundation` at `7595ca34884e4f6a8159077b3d44a84e38ce0950`. The reviewed rehearsal code is `eac89c8fbae4222d97c1058a44c8f3ed1b619c64`, plus this documentation checkpoint. User reruns on localhost:4174 passed: `qa:hub` 9/9 and synthetic `test:track --offline-imagery` 109/0/0. The report preserves their evidence and all earlier failures.

After approval, freeze the actual reviewed rehearsal HEAD and create a separate managed integration worktree/branch, `codex/upstream-integration`, from it. Implement and check the policy there, preserving the running rehearsal and its ignored logs. Shipping is currently an ancestor; recheck clean state and ancestry, then use **`git merge --ff-only codex/upstream-integration`** in shipping. If ancestry diverges, report it and amend the merge method; do not silently rebase/reset user work. No push or deployment.

The new upstream pin will be **`064d51f7be2675f1c69e16068e9c49d1a60144d1`**, with the existing reviewed customizations and repairs on top. Record the shipping integration checkpoint and pin when the fast-forward occurs, distinguishing integration from final verification.

## Persistent Hong Kong / Taiwan policy

Use a tracked, project-owned server policy, rather than relying on shell history or an ignored dotenv file. It unconditionally sets `CCTV_HK_ENABLED=0` and `CCTV_TAIWAN_ENABLED=0` during `build/customHub.js` module evaluation, before the root config calls the upstream standalone/provider factory; reassert when wrapping the result. Existing dotenv loading preserves these defined values, including when inherited/dotenv switches say `1`. Shipping disables only these two packs; existing packs keep their upstream settings.

Pin/check the reviewed gate implementation in `server/providers/cctv/catalog.js` and dotenv-loading contract in `server/standalone/vite.config.js`. A changed contract fails root startup before provider routes are installed until reviewed. Future upstream integration must also prove the root wrapper still loads the policy. No original-upstream file is edited for this policy, and no top-level Vite plugin is added.

The offline check must exercise the **actual upstream catalog loader** with all fetches mocked: zero Hong Kong/Taiwan catalog requests and rows, an existing-pack positive control, hostile `1` values, temporary dotenv fixtures, and fresh-process/restart cases. Never read/write real credential files or request live `/api/cctv/sources` to prove this. Emit a non-secret startup acknowledgement of both disabled switches. Root dev/secure/preview launches enforce the policy; direct `--config server/standalone/vite.config.js` is unsupported for shipping. MCP stdio uses the already-running protected HTTP server. Enabling either pack later needs current terms review, separate user approval, and a reviewed policy change.

## Exact integration file list

New project-owned files:

```text
build/customProviderPolicy.js
scripts/check-custom-provider-policy.mjs
src/custom/server/providerPolicy.test.mjs
```

Existing project-owned edits:

```text
build/customHub.js
SETUP.md
AGENTS.md
CUSTOMIZATION.md
STATUS.md
docs/custom/UPSTREAM-SYNC-REHEARSAL.md
docs/custom/PHASE-2A-PLAN.md
```

No dependencies or additional original-upstream edits. Carry the approved cache isolation, diagnostic follow-up, formatting, and annotation repairs unchanged. Any extra original-upstream repair requires an amendment. Ontario's keyless coverage loss is accepted: label its pack key-required, leave the key unconfigured, and disclose the missing POWER UP field.

## Shipping gates and user checks

First run the policy check and focused regressions in the integration worktree. Stop only the verified shipping listener on 4173 before fast-forward/install. In shipping run `npm ci`, `node scripts/check-custom-provider-policy.mjs`, doctor, hub typecheck, allocation-gated `npm test`, boundaries, formatting, and root/panel builds under Node 24.22.0. Complete fixture servers/builds before pre-bundling/restarting the root server on localhost:4173. Preserve key configuration without reading/logging values; configure no credentials or new provider calls. Check policy startup acknowledgement, loopback listener, HTTP assets, and finalized/stable dedicated optimizer metadata.

Then the user runs:

```sh
cd /Users/getumwanna/Documents/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0
QA_BASE_URL=http://localhost:4173 npm run qa:hub
npm run test:track -- --url http://localhost:4173 --offline-imagery
```

Also request a short manual smoke check of changed Street Level EXPAND/return controls, narrow-screen layout, and retained credits, using only already-permitted providers/configuration. No new key is needed or configured for the plan. Record outcomes and any remaining gaps; infer no live-feed or FPS baseline.

## After verification

Once shipping gates and user checks are resolved, stop only the verified rehearsal listener on 4174. Keep its worktree, ignored logs/receipts, and failure history; preserve ignored evidence separately before any later archive. Update the report with shipping verification.

Create `docs/custom/PHASE-2A-REVERIFICATION.md` and update the Phase 2a plan against the new pin: exact layer IDs, conditional credentials versus setup key IDs, source/coverage facts, admitted docs/sections/hashes, content claims, and file/dependency amendments. Compare **(a)** server-side dev validation returning only normalized Library errors with **(b)** lazy hub Ajv, including actual raw/gzip/Brotli bundle cost, initial hub/globe graph impact, HMR/recovery, offline behavior, server lifecycle, and plugin/allowlist constraints. Use isolated measurement fixtures after candidate-version/license review; introduce no production Library implementation or dependencies. Present that review before milestone 1. Phase 2b stays deferred until 2a ships and is accepted.
