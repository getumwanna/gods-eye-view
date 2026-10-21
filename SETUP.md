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

After `npm ci` or any dependency change, stop and restart the development server before browser QA. A server left running across installation can serve HTTP 504 “Outdated Optimize Dep” for optimized modules even while `/hub/` returns 200, leaving the app blank. Restart with the same explicit localhost command above; do not start a second listener or delete caches as the first response. The QA harness checks actual hub rendering first and reports safe startup/resource failure codes. A blocked startup remains a failed gate.

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

## Camera-pack adoption policy

The user approved upstream `064d51f7` with **Hong Kong and Taiwan camera packs kept disabled** until separate terms review and explicit activation approval. The approved integration carries the persistent policy below into shipping at upstream pin `064d51f7be2675f1c69e16068e9c49d1a60144d1`; user verification is tracked in `STATUS.md`. The rehearsal retains its launch flags until shipping verification is complete.

The tracked `build/customProviderPolicy.js`, loaded by the project-owned root wrapper before provider setup, forces `CCTV_HK_ENABLED=0` and `CCTV_TAIWAN_ENABLED=0` on every root dev/secure/preview start, overriding shell/dotenv attempts to enable them. Other packs keep their existing settings. A reviewed source-contract guard stops startup if upstream changes invalidate the disable mechanism. Preserve this hook/check in future upstream updates. Direct launches using the upstream standalone config bypass the hook and are unsupported for shipping; MCP stdio uses the already-running protected server.

Offline verification command:

```sh
node scripts/check-custom-provider-policy.mjs
```

The check exercises the actual catalog loader with mocked fetches, an existing-pack positive control, hostile enabled flags, temporary dotenv fixtures, and fresh-process restarts. It proves zero Hong Kong/Taiwan catalog requests and rows, without live camera requests or inspecting real credential files. Later activation requires approval after terms review and a reviewed policy change, rather than an environment toggle.

**Ontario 511 is key-required at the new pin.** Without `ONTARIO_511_API_KEY`, its highway camera pack is skipped; this accepted coverage loss does not lock all CCTV. POWER UP has no Ontario field at this pin. Leave it unconfigured; do not paste it into another provider's field. Adding POWER UP support needs separate scope approval.

## Getting provider keys

Reviewed October 20, 2026 against accepted target `064d51f7` and the official references below; shipping verification is tracked in `STATUS.md`. Confirm current plans/quotas before enabling a provider. Create and restrict credentials yourself, then use **POWER UP** for supported fields. No key was requested, configured, read, or handled for this documentation task. Keep persistent secrets server-side and out of chat, URLs, Git, and exports. Provider-designated public client tokens and short-lived AI session credentials retain the browser exceptions already approved.

POWER UP does **not** expose Ontario 511 or the optional Google server key at this pin; leave them unconfigured under the POWER UP-only workflow. A key is not blanket permission for recording, redistribution, operational use, or hosting. GEV budgets are separate from provider billing controls. Where no provider-side referrer lock or budget alert was verified, the entries say so rather than promise one.

### 1. Cesium ion

For aircraft or vessel tracking, select **Google 3D or the default Esri imagery**, subject to their terms; use these instead of ion-hosted Bing imagery.

- **Unlocks / cost / signup:** `CESIUM_ION_TOKEN` enables ion-hosted Google Photorealistic 3D Tiles, terrain and supported imagery, subject to asset availability. Community is free for individual personal/noncommercial use and evaluation, with monthly quotas; commercial plans are paid. [Signup](https://ion.cesium.com/signup), [plans and quotas](https://cesium.com/platform/cesium-ion/pricing/).
- **Terms:** Preserve Cesium and dataset credits. Each asset has separate terms: **ion-delivered Bing imagery prohibits asset tracking, fleet management and routing**, and mixing with non-Bing imagery. Google assets have separate high-risk-use and combination restrictions. A token does not authorize every GEV use. [Content requirements](https://cesium.com/learn/ion/content-usage-and-attribution-guide/).
- **Restrictions / budgets:** Create a dedicated public `assets:read` token restricted to needed assets and actual localhost Allowed URLs. URL restrictions require a Referer header. Monitor account/per-token usage and rotate/revoke tokens; no configurable budget-alert or hard-spending-cap feature was verified. [Token controls](https://cesium.com/learn/ion/cesium-ion-access-tokens/).

### 2. NASA FIRMS

- **Unlocks / cost / signup:** `FIRMS_MAP_KEY` enables near-real-time VIIRS active-fire/thermal-anomaly detections. The email-issued key is free; the current limit is 5,000 transactions per ten minutes, with larger queries sometimes counting as multiple transactions. [Request a key and inspect quota](https://firms.modaps.eosdis.nasa.gov/api/map_key/).
- **Terms:** Preserve FIRMS acknowledgment, citation and LANCE disclaimer guidance. Thermal anomalies are not confirmed incident reports; NASA does not recommend these detections for tactical-level reliance. [NASA usage guidance](https://forum.earthdata.nasa.gov/viewtopic.php?t=5184), [NASA limitations](https://appliedsciences.nasa.gov/sites/default/files/2025-05/Part%203%20FIRMS%202025%20Q%26A%20Session.docx.pdf).
- **Restrictions / budgets:** Keep the key server-side. Use the provider's transaction-status check and bounded polling; domain/referrer restrictions, custom spending caps and budget alerts were not verified. This is a free, quota-limited service.

### 3. AISStream

- **Unlocks / cost / signup:** `AISSTREAM_API_KEY` enables live vessel AIS through GEV's server connection and same-origin cache. The service is advertised as free; sign in with GitHub and create a key in [Account](https://www.aisstream.io/account).
- **Terms:** Direct browser connections are expressly prohibited; use the backend and relay only needed information. No SLA or durable replay is promised. Public AIS broadcasts do not establish unrestricted recording or redistribution rights. [Official guidance](https://www.aisstream.io/documentation/).
- **Restrictions / budgets:** Keep the key server-side; rotate, disable or delete it in Account. Limits include three connections per account/IP and one subscription update/second/connection. Focus geographic/message filters. Provider domain locks, custom caps and budget alerts were not verified. [Limits](https://www.aisstream.io/documentation/).

### 4. Mapillary

- **Unlocks / cost / signup:** `MAPILLARY_CLIENT_TOKEN` enables Street Level coverage, image cones, sequences and the imagery viewer. The platform is free, including commercial use. [Developer dashboard](https://www.mapillary.com/dashboard/developers), [pricing FAQ](https://help.mapillary.com/hc/en-us/articles/8348198426396-Mapillary-FAQ).
- **Terms:** API/developer terms apply separately from imagery's CC BY-SA attribution obligations. [Terms](https://www.mapillary.com/terms), [imagery licensing](https://help.mapillary.com/hc/en-us/articles/115001770409-CC-BY-SA-license-for-open-data).
- **Restrictions / budgets:** Use only the designated client token, never a user token/client secret. Provider staff identifies a 50,000 coverage-tile/day/app quota, with possible earlier IP throttling. Domain/referrer locks and custom budget alerts were not verified. [Rate-limit clarification](https://forum.mapillary.com/t/50-000-requests-day-rate-limit-scope/10644).

### 5. TomTom

- **Unlocks / cost / signup:** `TOMTOM_API_KEY` enables live traffic-flow vector tiles. Current pricing includes 200,000 Traffic vector-tile requests/month, with paid usage by plan; no initial card is required. [Signup](https://docs.tomtom.com/platform/documentation/my-tomtom/how-to-get-a-tomtom-api-key), [pricing](https://docs.tomtom.com/pricing).
- **Terms:** Proprietary API/content terms apply; preserve traffic attribution and review storage/reuse permissions. [Terms](https://docs.tomtom.com/legal/terms-and-conditions).
- **Restrictions / budgets:** Keep GEV's key server-side, restrict assigned products and monitor analytics. Domain whitelists use CORS and therefore do not secure server-to-server requests. Free/prepaid exhaustion returns 429; adjustable QPS is enterprise-only. GEV's separate default 120-tile/day budget is local protection, not TomTom's quota; no configurable budget alert was verified. [Key controls](https://docs.tomtom.com/platform/documentation/my-tomtom/api-key-management), [CORS limitation](https://docs.tomtom.com/platform/documentation/api-best-practices/api-key-management-best-practices), [quota behavior](https://docs.tomtom.com/platform/documentation/status-and-support/faqs).

### 6. OpenSky

OpenSky terms also apply to the **anonymous default**, not only authenticated requests. Any future recorder or automated archiving of OpenSky data needs a terms check **before it is proposed**.

- **Unlocks / cost / signup:** Higher flight-polling allowance; anonymous access already works. Create an account and OAuth client through [OpenSky](https://opensky-network.org/), then enter the client ID and secret in POWER UP. Basic password authentication is obsolete. [Official OAuth and quota documentation](https://openskynetwork.github.io/opensky-api/rest.html) describes limited free access; licensed access is separately agreed.
- **Terms:** Standard access is for nonprofit research/education. [OpenSky's terms](https://opensky-network.org/about/terms-of-use) require prior written agreement for operational use of its REST API, including an internal live automated system, regardless of nonprofit status. Local personal use is not an automatic exemption.
- **Restrictions:** Keep the secret server-side, rotate exposed credentials, respect credit limits and `429` backoff. The public documentation does not specify domain/referrer restrictions or configurable budget alerts. Provider credit quotas are request limits, not financial budgets.

### 7. Launch Library 2

- **Unlocks / cost / signup:** Existing recent Space Missions launch/payload/stage/recovery context works anonymously; an optional POWER UP token raises request limits. It does not add the deferred upcoming-launch query or live ascent telemetry. Anonymous access is free at 15 calls/hour/IP; [paid higher-rate access](https://thespacedevs.com/supportus) uses a Patreon tier and generated token. [Token instructions](https://github.com/TheSpaceDevs/Tutorials/blob/main/faqs/faq_LL2.md#how-do-i-get-an-api-key).
- **Terms:** [The Space Devs' terms](https://github.com/TheSpaceDevs/Tutorials/blob/main/faqs/faq_TSD.md#terms-of-use) allow creating and sharing uses, discourage forwarding without added value, disclaim complete accuracy, and encourage attribution.
- **Restrictions:** Keep the token server-side and retain the shared cache. Respect the chosen tier's quota; official instructions describe quota inspection and token rotation, not domain/referrer restrictions or usage-based budget alerts.

### 8. Ontario 511

- **Unlocks / cost / signup:** Ontario highway CCTV catalog/stills require a free reviewed developer key. [Register](https://511on.ca/my511/register), then use the [developer key request page](https://511on.ca/developers/doc). Without a key, this camera pack is skipped; the accepted keyless coverage loss remains.
- **Terms:** The [Developer's Access Agreement](https://511on.ca/developers/resources) asks for intended use and third parties receiving/displaying data; approval is case by case. Open Government Licence–Ontario generally applies. Preserve attribution/disclaimers and avoid implying endorsement.
- **Restrictions / UI:** Official throttling is 10 calls/60 seconds; no domain/referrer controls or budget alerts are documented. This pin supports `ONTARIO_511_API_KEY` only through server environment configuration, **not POWER UP**. Leave it unconfigured under the current POWER UP-only workflow; never paste it into another provider's field.

### 9. Google Maps

- **Unlocks / cost / signup:** Photorealistic 3D tiles and Street View; optional server services provide Places/Geocoding/fallback imagery. [Create a billing-enabled project/key](https://developers.google.com/maps/documentation/tile/get-api-key). Usage is metered with product-specific free allowances.
- **Terms:** Follow [Maps terms](https://cloud.google.com/maps-platform/terms) and [Map Tiles policies](https://developers.google.com/maps/documentation/tile/policies): retain attribution and respect storage, visualization, and recording restrictions. Local use does not remove these obligations.
- **Restrictions / UI:** Separate browser/server keys and allow only required APIs. [Security guidance](https://developers.google.com/maps/api-security-best-practices) supports website restrictions for Maps JavaScript and IP restrictions for server services. Google's [credential matrix](https://developers.google.com/maps/faq#keysystem) lists Map Tiles with IP restrictions, differing from upstream's browser-referrer guidance: verify tile compatibility rather than assuming it. POWER UP exposes the browser key; the optional server key is hidden, so leave it unconfigured. Set [per-API quotas and budget alerts](https://developers.google.com/maps/billing-and-pricing/manage-costs); alerts alone do not cap spending.

### 10. OpenAI

- **Unlocks / cost / signup:** Optional Realtime voice/control and HUD summaries use a [metered API account/key](https://platform.openai.com/api-keys). Review [pricing](https://developers.openai.com/api/docs/pricing) before adding it through POWER UP; AI remains optional.
- **Terms:** Follow applicable API terms/usage policies and review [data handling](https://developers.openai.com/api/docs/guides/your-data) before transmitting context.
- **Restrictions:** Keep the persistent key server-side. Use a dedicated project, least privilege, model/rate limits, expiry/rotation and, with stable public egress, [IP allowlisting](https://developers.openai.com/api/docs/guides/ip-allowlist). [Spend alerts](https://developers.openai.com/api/docs/guides/spend-limits) only notify; explicitly enabling **Enforce a hard limit** stops affected requests with `429`, although enforcement lag can permit slight overshoot. Browser Realtime credentials remain ephemeral.

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


## Library content authoring and checks

Phase 2a milestone 1 currently exposes Data Sources and the existing source-guide routes. Knowledge articles, cases and local search remain later milestones. Library reference records do not test keys or feeds; their review date is a documentation date.

Use the supported Node version and run `npm run check:library` after editing `content/`. Invalid content fails that command and both production builds. It must leave the normal development server, globe, Dashboard and Settings usable, with an accessible error inside Library only. Keep normal HMR enabled; disabling HMR or the global error overlay cannot satisfy this requirement.

`content/sources.json` is the authored source registry. The globe imports only `src/custom/shared/sourceRegistry.generated.js`, its last validated projection. After reviewing a valid metadata/schema/manifest change, explicitly run `node scripts/check-custom-library.mjs --write-projection`, inspect the generated diff, then run `npm run check:library`. Checks/builds never repair stale output automatically; invalid input must never replace the last valid projection. Use only the approved provider/reference set and reviewed upstream pin. New sources, recording and hosting still require their separate terms/scope review. This workflow does not configure any key; use the existing POWER UP controls yourself.

### Knowledge authoring and local search

Only manifest-published original Markdown and explicitly admitted upstream sections appear in the Knowledge Center or search. Keep original author/title/date/source links for external summaries and write original prose; never import/index external article bodies or media. Upstream excerpts must preserve their license notice and selected-section/hash admissions. Unknown publication dates stay null; review dates describe editorial review rather than live feed freshness. Route slugs are limited to 64 characters.

After an intentional reviewed content/schema/manifest change, run `node scripts/check-custom-library.mjs --write-projection`, then `npm run check:library`. This updates the explicit validated projection digest; it does not fetch data or configure keys. Both production builds enforce validation. Normal dev keeps invalid content confined to Library; changing/removing an article must not reload the globe, stop the server or raise a global overlay. Search uses published local text in memory, with bounded URL queries and no provider request, query telemetry or persistent search history.
