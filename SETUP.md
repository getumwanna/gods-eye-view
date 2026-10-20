# Geospatial Intelligence Hub — local setup

This is the Phase 1 foundation around God's Eye View (GEV). The existing globe remains at `/`; the React hub is at `/hub/` on the same local server. Phase 2 information services are not implemented or authorized by completing this foundation.

The hub provides navigation, shared branding and dark/light appearance, provider setup guides, and a form that opens existing complete local globe share links. The globe adds a back-to-hub link, passive active-layer status and provider-key guidance. Dashboard summaries, the searchable Knowledge Center and full Data Sources directory remain future work. Existing GEV layers, Director scenes, voice, drawing and session-local geodata imports remain upstream features with their existing requirements.

## Install and start

Use Node 24.14.0 or later within 24.x, or a supported 26.x release. This checkout was installed and its allocation checks calibrated with **Node 24.22.0**. Keep that runtime for repeatable allocation testing. With an existing nvm installation:

```sh
cd /Users/getumwanna/Documents/GEV
source "$HOME/.nvm/nvm.sh"
nvm use 24.22.0
npm ci
npm run doctor
HOST=localhost PORT=4173 npm run dev -- --strictPort
```

Open [the hub](http://localhost:4173/hub/) or [the globe](http://localhost:4173/). No second Vite server is needed. Stop the development server with Ctrl+C in its terminal.

`doctor` describes this checkout's actual provider configuration. Optional providers can remain unconfigured. Do not use `scripts/dev-fresh.sh` for a deliberately keyless check: the upstream macOS launcher can import Keychain configuration. This guide's explicit `npm run dev` command uses the existing server model; any `.env` or process-environment configuration already present still applies.

Production asset checks use the same root build. Preview intentionally lacks the dev-only provider-settings endpoint:

```sh
npm run build
npm run build:panel
npm run preview -- --host localhost --port 4173 --strictPort
```

Stop an existing listener before running preview on its port. A successful static build is not proof that every live provider works. In preview, key configuration may be **Unknown** and POWER UP may be unavailable; the setup guides remain accessible.

## Branding and appearance

Edit the public fields in `branding.json`: `name`, `shortName`, `logo` and `accent`. The logo must be a supported local image path; the accent must be a valid six-digit hex color. The shared validator bounds these values and falls back safely on invalid fields. The provided logo is in `public/custom/brand.svg`. Do not put credentials, remote tracking-image URLs or arbitrary CSS into this configuration.

Reload the browser after editing branding. Name/logo changes apply to the hub and globe title/loading presentation. Custom branding does not remove provider credits or change sensor/map behavior. The globe's original logo-gaze renderer is excluded from the custom logo wrappers so it cannot overwrite the selected mark.

Choose **Dark theme** or **Light theme** in Settings, or use **Toggle color theme** in the header. The preference is stored in this browser and shared across hub/globe pages on the same origin. It does not configure providers. Shared tokens live in `design/tokens.css`; the hub maps them to shadcn variables in `hub/src/styles.css`. Tailwind utilities stay in the hub graph and its Preflight reset is omitted.

The official shadcn sidebar, companions and mobile hook are pinned with their MIT notice in `hub/SHADCN-LICENSE.md`. Sources and local adaptations are recorded in `design/COMPONENTS.md`. No 21st.dev implementation was adopted.

## Open globe views and read status

- **Globe** and **Open globe** navigate to the existing globe shell.
- **Open a shared view** on Dashboard accepts a local GEV URL. Complete validated version 2 hashes retain supported camera, layer, provider-switch, panel, shader and target state. External destinations and credential-shaped fields are rejected. The form creates no saved-view collection.
- **Back to Geospatial Intelligence Hub** returns to the fixed hub Dashboard route.
- **Feeds** opens the passive active-layer status disclosure. Data-kind labels such as Live, Simulated or Estimated describe a value's origin; STALE, FALLBACK or UNAVAILABLE describe independent health. A missing timestamp or coverage field is explicitly unavailable, not invented.
- **Setup** opens provider guidance. Missing keys, unknown configuration and a provider reporting a credential problem are different states. Credential presence does not prove validity or provider health. Optional providers do not make an otherwise keyless layer universally locked.

The custom status UI reads existing manager state. Its age clock changes text only; it does not refresh feeds or enable layers. One custom read of `/api/setup/status` obtains known key-presence booleans, not values; upstream POWER UP owns its separate existing read. Local-request restrictions remain intact. POWER UP uses the existing dialog and does not offer automatic provider focus through the new links.

The source setup guides are brief explanations, not a competing complete source directory. Canonical coverage, terms, costs, attribution and shared-cache dashboard services belong to Phase 2.

## Optional providers and responsible use

The keyless foundation needs no provider account. Existing optional providers retain their GEV requirements: restricted browser-designated Google/Cesium/Mapillary credentials, server-held persistent secrets for paid or keyed services, and short-lived AI session credentials where supported. See existing `README.md`, `DATA_SOURCES.md`, `SECURITY.md` and `THIRD_PARTY_NOTICES.md` before enabling them. No credentials are shipped or required by the hub shell.

Keep the server bound to localhost. A reachable server can broker configured keys for other callers; app throttles are not provider billing caps. Public or private hosting remains unselected until Phase 4. The code license does not replace dataset/media/provider terms; bundled Nepal and cable data have noncommercial constraints. Confirm source terms before recording data, adding a source or hosting it elsewhere.

Use the app for learning and exploration, never navigation, emergency response or other safety-critical decisions. Coverage is incomplete and observations may be delayed or wrong. Model events, assets, infrastructure and systems; do not add named-person search, face recognition or tracking of individuals. Mapped ALPR camera locations contain location/tags, not plate recognition or plate histories.

## Validation and evidence

Run these checks with Node 24.22.0 after an approved change:

```sh
npm run doctor
npm run typecheck:hub
node scripts/check-import-directions.mjs
node scripts/check-package-boundaries.mjs
GEV_REQUIRE_ALLOCATION_GATE=1 npm test
npm run build
npm run build:panel
```

Tracking and visual browser checks are separate:

```sh
npm run test:track
npm run qa:hub
```

Run browser-driving commands only when authorized. A prior browser denial must not be bypassed through another driver. The agent authored and syntax-checked `scripts/qa-custom-hub.mjs` but did **not** execute it. Actual command and permitted-browser results belong in `docs/custom/PHASE-1-VALIDATION.md` and `STATUS.md`; this guide does not predeclare a pass.

`qa:hub` uses installed Puppeteer/Chrome and a fresh isolated browser context. It requires an already-running loopback server. Its default is `http://localhost:4173`; another loopback origin or a visible browser can be selected:

```sh
QA_BASE_URL=http://127.0.0.1:4173 QA_HEADFUL=1 npm run qa:hub
```

The harness checks routes, theme persistence, desktop collapse, mobile Escape/focus, share-link rejection and full-hash handoff, custom globe controls, branding and visible credits. It opens no credential forms, changes no provider configuration and enables no layers. A synthetic **URL-state fixture** keeps every layer off; it is not an observation dataset. Provider/API acquisition is blocked except the existing read-only setup status and public OSM basemap tiles. Assertion-only JSON receipts go under ignored `.gev-logs/`; no raw page text, request URLs, console output, key-presence values or screenshots are saved. These bounded checks do not establish live feed availability, tracked-target acquisition, cross-browser acceptance or FPS performance.

The user explicitly waived the missing historical Phase 0 baseline checks. That waiver does not manufacture baseline measurements or waive Phase 1 acceptance. Phase 1 remains subject to its recorded checks and user review. Phase 2 requires a separate approved plan.

## Maintain the upstream fork

`CUSTOMIZATION.md` records the upstream pin, fork/remotes, project-owned files and customization ledger. The Phase 1 upstream edit allowlist is:

1. `package.json`
2. `package-lock.json`
3. `vite.config.js`
4. `src/main.js`
5. `style.css`
6. `src/tooling/viteBuild.test.mjs`

Hub implementation, design tokens, public branding and `src/custom/` adapters are additive. No provider acquisition services, share codecs, lifecycle owners, layer implementations, upstream templates or security gates were changed for this foundation. The root Vite wrapper appends hub integration; the direct standalone configuration remains the single-entry MCP panel build.

Before a future upstream update, start from a clean reviewed working tree, fetch `upstream`, inspect its changes from the recorded pin and prepare an update branch. Merge only the reviewed update, resolve customizations deliberately, and rerun the checks above. Preserve named config exports, the full standalone plugin prefix, root/panel entry isolation, provider credits, reserved share-layer identities and source license boundaries. Review any lockfile changes rather than upgrading the GEV stack to resolve hub dependencies. Record the resulting pin and every upstream customization in `CUSTOMIZATION.md`; amend the approved scope before introducing additional customization edits.

## Language boundary

The new hub and custom globe chrome use intentional English labels in Phase 1. Existing globe language controls remain available for upstream UI. Custom localization requires a separately scoped catalog update; these English labels do not claim translated coverage.
