## Use the reviewed checkout

The adopted upstream pin is `064d51f7be2675f1c69e16068e9c49d1a60144d1`. Project-owned customization records explain how the hub extends that version. The globe stays at `/`, the hub at `/hub/`, and both share the existing localhost server. Root `vite.config.js` delegates to the standalone configuration; focused source and layer owners retain their upstream responsibilities.

Start from the current work list, customization ledger and phase gates before changing code. The [upstream contribution guide](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/CONTRIBUTING.md) supplies general contributor expectations, while local approvals bound this fork's work. Phase 2b, recording, hosting and new providers remain separate work.

## Keep the runtime repeatable

The supported Node range is at least 24.14.0 within 24.x, or a supported 26.x release. This project's allocation checks are calibrated with Node 24.22.0. Use that version when comparing their outcomes:

```sh
nvm use 24.22.0
npm ci
npm run doctor
HOST=localhost PORT=4173 npm run dev -- --strictPort
```

Optional configured environment values still apply to this command. Do not describe a run as keyless without checking configuration safely. The macOS `dev-fresh.sh` launcher can load Keychain credentials, so it is unsuitable for a deliberately keyless check. After dependency installation or changes, stop and restart the development server rather than leaving it attached to an obsolete optimizer graph.

## Validate Library changes explicitly

The registry and manifest are authored inputs. `check:library` is the authoritative Node validation command, and both production builds run it before invoking a builder. Generated source metadata is an output, not a second editable source of facts. Regenerate it explicitly after a valid change and inspect the resulting diff:

```sh
node scripts/check-custom-library.mjs --write-projection
npm run check:library
npm run typecheck:hub
GEV_REQUIRE_ALLOCATION_GATE=1 npm test
npm run check:boundaries
npm run format:check
npm run build
npm run build:panel
npm run doctor
```

Invalid Library content must fail checks and builds while leaving the development server, globe, Dashboard and Settings usable. In development, schema validation is lazy and confined to Library. Production output excludes the development Ajv compiler. Library errors must be accessible and recover after the input is restored; globally suppressing HMR or error overlays does not satisfy that requirement.

## Keep browser evidence separate

Node tests and successful builds do not establish rendered behavior, live-source coverage or GPU performance. The existing `test:track` harness uses synthetic fixtures. Its offline-imagery option substitutes known map tiles; it does not make every possible network operation offline. The [upstream testing guide](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/TESTING.md) also contains historical manual scenarios that are distinct from automated gates.

In this project, the user runs the CLI browser harnesses. With the normal-HMR server already running, the custom hub check and tracking command are:

```sh
QA_BASE_URL=http://localhost:4173 npm run qa:hub
npm run test:track -- --url http://localhost:4173 --offline-imagery
```

The upstream aliases `qa:map-source-tray`, `qa:street-level`, `qa:street-level:fixtures` and `qa:transit` have feature-specific prerequisites. Read each harness header before selecting it; the strict Street Level fixture path is not a universally keyless smoke test. Never enable a credential or paid call just to make a gate appear green. Record tool denials, skips and user reports accurately.

## Rehearse upstream changes

Use a separate reviewed worktree and frozen target for an upstream-sync rehearsal. Compare layer and setup identities, sources, coverage, terms and manual repair paths; then make an explicit adoption decision. Preserve the project-owned Hong Kong/Taiwan-off policy and its offline check. A successful rehearsal is evidence for a particular target, not a promise that later pulls will be conflict-free.

For milestone 2 and milestone 3, validation precedes the user's editorial review, and committing waits for that review. Keep original summaries linked to primary references, preserve admitted documentation hashes and never replace a failed acceptance requirement with a weaker one.
