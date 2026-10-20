# Upstream-sync rehearsal — execution plan

October 20, 2026. **Proposed execution only; awaiting user approval.** This rehearsal must precede Phase 2a implementation. It does not authorize adoption, Phase 2a code, or Phase 2b planning.

## Frozen inputs and isolation

- Shipping branch: `codex/phase-1-foundation`; inspected clean at `67f48008223fb84ebb3599b86793aff511088af5`, before this planning checkpoint. After approval, record the actual clean planning-checkpoint HEAD as `BASE_SHA`.
- Authoritative upstream pin: `de2138e84c1778fd98a48b7c9fd0b9788c318946`.
- Proposed target: official upstream `064d51f7be2675f1c69e16068e9c49d1a60144d1`, confirmed by read-only `git ls-remote` on October 20. The earlier comparison counted 72 commits and 151 changed files from the pin; recompute the inventory after fetching. If upstream advances, retain this frozen target or request a target amendment; never merge floating `main`.
- After approval, create a separate managed worktree and branch, `codex/upstream-sync-rehearsal`, from `BASE_SHA`. Fetch and merge the frozen target there. Preserve the shipping checkout, its server, and its authoritative pin.

## Execution and file limits

1. Record clean status, SHAs, remotes, supported Node/npm versions, credential-presence checks without values, and listener state. Read the target's current runtime, source, security, contribution, and testing documents. Stop if the approved inputs or isolation cannot be established.
2. Import the complete frozen upstream diff on the rehearsal branch. Execution approval must cover those incoming upstream files; they are distinct from manual customization repairs. Inspect conflicts and semantic changes, including source/key requirements, satellite freshness, native panels/StreetLevel, and removed QA commands.
3. Review all six accepted Phase 1 upstream customizations. Manual repairs to original-upstream files are limited to:

   ```text
   package.json
   package-lock.json
   vite.config.js
   src/main.js
   style.css
   src/tooling/viteBuild.test.mjs
   ```

   Existing project-owned hub/custom/build/test glue and planning records may receive compatibility repairs, recorded path by path in `CUSTOMIZATION.md`. Do not add Phase 2a features or its dependencies. Any other original-upstream manual repair needs an allowlist amendment before editing. Review dependency/lockfile and install-script changes before installation.
4. Run `npm ci`, `npm run doctor`, `npm run typecheck:hub`, `GEV_REQUIRE_ALLOCATION_GATE=1 npm test`, the existing package/import boundary checks, `npm run build`, and `npm run build:panel` with the supported Node 24 runtime. Re-read target harness headers and run relevant changed-feature gates; do not assume a removed command remains valid.
5. For runtime checks, use an available, separate loopback port (proposed `localhost:4174`, strict port), without disrupting port 4173. Retarget user-run harnesses explicitly: `QA_BASE_URL=http://localhost:4174 npm run qa:hub` and `npm run test:track -- --url http://localhost:4174`. Confirm the target's documented options and record the tested origin in each receipt; a harness that cannot be retargeted is blocked, not run against shipping. Preserve the established browser boundary: CLI browser harnesses remain user-run; use only already-permitted browser tooling and stop on a new denial. Record results or explicit new waivers for required browser, tracking, layer, or FPS checks. The historical Phase 0 waiver is not a rehearsal pass. Keep providers unconfigured; no Keychain-loading launcher, paid calls, new source activation, wider bind, or deployment.
6. Create `docs/custom/UPSTREAM-SYNC-REHEARSAL.md` on the isolated branch. Record before/after SHAs, incoming paths, conflicts and manual repairs, dependencies, layer/key ID changes, admitted-document/section changes, source/terms implications, every check and limitation, and an adoption recommendation. Keep source inspection, fixtures, browser observations, and user reports distinct. Commit the isolated rehearsal/report checkpoint and **stop for user review and an adoption decision**.

## Adoption and Phase 2a gate

Rehearsal execution does not merge into shipping or advance its pin. Adoption needs a separate explicit decision. If declined, preserve the report and recoverable rehearsal work without resetting shipping files.

After that decision, reverify `PHASE-2A-PLAN.md` against the adopted or retained pin: layer IDs, key IDs and credential boundaries, coverage/source facts, admitted doc files/sections, content provenance, dependency compatibility, and the exact file list. Present changes before milestone 1; obtain approval for any allowlist, file-list, or dependency-role amendment. The proposed generated metadata projection and Library-only Ajv runtime role are pending items for this review, not additions silently included in the approved inventory.

Phase 2a must keep invalid content inside a Library error state in development, while `check:library` and both production builds fail. At the end of milestones 2 and 3, list the new articles/case pages and stop for editorial review **before committing**; identify both Spatial Intelligence originals for comparison. Phase 2b stays deferred until 2a ships and is accepted.

Approval requested here covers only the isolated rehearsal execution and report under these limits.
