# Phase 0: installation, baseline, and requirement gap analysis

Audit date: October 19, 2026, America/New_York. The command receipts use UTC where indicated and therefore also include October 20 UTC timestamps.

## 1. Scope and evidence

This audit implements only the approved Phase 0 plan for the user's **Geospatial Intelligence Hub — Project Request (v2)**. It adds documentation, installs the locked dependencies, and checks the unmodified upstream foundation. It does not implement the hub or authorize a later phase.

| Item | Verified value |
| --- | --- |
| Upstream | `bilawalsidhu/gods-eye-view` |
| Fork | https://github.com/getumwanna/gods-eye-view; GitHub API reports `fork: true`, parent `bilawalsidhu/gods-eye-view` |
| Pin | `de2138e84c1778fd98a48b7c9fd0b9788c318946` |
| Version | `package.json` reports `0.2.1` |
| Branch | `hub/phase-0-audit` |
| Remotes | `origin` = user fork; `upstream` = original repository |
| Pin in fork | Fetched `origin/main`; ancestry check passed |
| Upstream edits | None; four added documentation files only |
| Runtime used | Node `24.22.0`, npm `11.19.1`; package requires `>=24.14.0 <25` or `>=26 <27` |
| Machine | Apple M5 Max, `Mac17,14`, 36 GiB memory, macOS `27.2`, arm64 runtime |

Source evidence comes from the pinned checkout, especially `docs/CURRENT-STATE.md`, `DATA_SOURCES.md`, `SECURITY.md`, `THIRD_PARTY_NOTICES.md`, `CONTRIBUTING.md`, `TESTING.md`, and focused implementation owners. Historical sections in CURRENT-STATE are checked against newer source where they disagree. File/line references below refer to this pin, not a future upstream branch.

**Meaning of evidence:** `Exists` means the capability is present in pinned source; it does not certify current provider availability or successful rendering of every feature. Source-described cadences are configuration, not observed freshness guarantees. Terms below are the repository's recorded notices, not a completed provider/legal review for deployment. No live data was fabricated and no provider/model keys were configured.

## 2. Installation and baseline

| Check | Result | Evidence / limits |
| --- | --- | --- |
| Supported Node installation | Pass | Installed `24.22.0` in existing nvm; project commands use its bin path; no tracked runtime file changed |
| `npm ci` | Pass, exit 0 | 169 packages added, 170 audited; npm reported 0 vulnerabilities for this install snapshot. This is not a security audit |
| Install notices | Recorded | Deprecated `sourcemap-codec@1.4.8`; npm 11 reported install-script declarations for esbuild/fsevents/puppeteer outside its allowScripts list. No additional script approvals or dependency changes were made |
| `npm run doctor` | Pass, exit 0 | Ready; all optional provider credentials unconfigured; keyless Esri/terrain path, optional AI/vessels/FIRMS off |
| `GEV_REQUIRE_ALLOCATION_GATE=1 npm test` | Pass, exit 0 | Ordinary group: 8,208 pass, 1 skip; focus allocation group: 1 pass; overlay allocation group: 14 pass. Total **8,223 pass, 1 skip, 0 fail** |
| Skipped unit | Expected platform skip | `src/keySetupHardening.test.mjs:405`: Windows native DACL hardener does not execute on macOS |
| `npm run build` | Pass, exit 0 | 868 transformed modules; Vite reports 4.02 s. Large chunks over 1,500 kB warned; no bundling changes made |
| Dev server | Started unmodified | `HOST=localhost PORT=4173 npm run dev -- --strictPort`; listener observed at `[::1]:4173`, no wildcard/LAN listener |
| HTTP / security headers | Pass | HEAD `/` returned 200; CSP, DENY framing, and nosniff headers present |
| Keyless rendered globe | User-verified | User answered **“Yes, the globe renders”** at `http://localhost:4173/`. This is manual user evidence, not an agent screenshot |
| Individual layer loading | Not verified | Inventory below separates source-supported keyless availability from observed runtime results; no provider-by-provider success is claimed |
| `npm run test:track` / browser gates | Not run | Automatic browser approval rejected localhost inspection. No alternate browser, CDP, or browser-driving harness was used to work around it |
| Cold startup / GPU / FPS | Not measured | HTTP readiness and build time are not rendering performance. Upstream `docs/PERFORMANCE.md` describes another historical capture, not this machine's result |

The automatic browser denial stated that the URL policy did not grant access. Consequently the source audit and shell checks can establish installation, listener, headers, and unit/build outcomes, but cannot establish a captured screenshot, feed UI state, share restoration, or GPU performance. The user's render confirmation is recorded separately. Permitted browser verification must be restored, or those outstanding checks explicitly waived, before they are treated as accepted evidence.

The contributor baseline names build, unit tests, and tracking (`CONTRIBUTING.md:24-26`). This checkpoint records two passing command families and explicitly leaves tracking unrun; it does not call all contributor/browser gates green. The unit suite includes fixtures and allocation probes; their synthetic records are test data, not a source of displayed live intelligence.

Local raw receipts are ignored under `.gev-logs/phase0-2026-10-19/`: `npm-ci.log`, `doctor.log`, `npm-test.log`, `build.log`, and `dev-server.log`. No raw log, cache, build output, or credential is committed. The source tree and lockfile remained unchanged after these commands.

## 3. Requirement gap table

Statuses use the requested vocabulary: **Exists; Exists, needs surfacing; Partial; New work; Out of scope**. S/M/L are relative engineering estimates, not dates or commitments: S is bounded documentation/presentation glue, M crosses several owners or state contracts, L is a new subsystem or substantial integration. Estimates assume one developer, existing provider access where needed, no upstream regression, and approved requirements. Unverified runtime/provider behavior can change effort.

### Ground rules and architecture

| Requirement | Status | Where it lives in GEV | Work needed | Effort |
| --- | --- | --- | --- | --- |
| Extend the existing vanilla/Cesium globe, preserve working capabilities | Exists | `src/main.js:1-11`; `src/app/application.js:1-18` | Keep standalone composition; regression-check narrow hooks | S |
| Two shells, one local server and one URL origin | Partial | `server/standalone/vite.config.js:14-35`; `build/vite.js:50-116` | Add sibling hub HTML/TSX entry and multi-page production input without replacing globe | M |
| React, TypeScript, Tailwind, shadcn/ui hub | New work | Existing frontend is vanilla; no hub entry | Add hub-only dependencies, routes, and shell | L |
| Share-link handoff of camera/style/layers/provider state/one supported target | Exists, needs surfacing | `src/sharelink.js:544-603`; `src/view/index.js:247-289,381-384` | Generate/validate existing URLs; retain full original v2 hash for complete presets | M |
| Shared provider caches and no duplicate dashboard acquisition | Partial | `server/providers/local.js:36-68`; `src/tools/services.js:45-74` | Define one acquisition owner, passive cache reads/subscriptions, and adapters for browser-direct feeds | L |
| Additive customization and upstream edit ledger | Partial | Focused app/layer/provider ownership; this `CUSTOMIZATION.md` | Put new hub/content/design glue in new files; list every eventual upstream edit | S |
| No invented live data; unavailable values never rendered as zero | Partial | Existing source/status contracts; `src/data/layerSnapshot.js:136-140` defaults missing counts to 0 | Gate dashboard values on source availability/completeness before reading counts | M |
| Five observation-kind labels for every value | Partial | Existing feed-health model is different: `src/data/feedState.js`; `src/data/layerSnapshot.js:14-37` | New observation-kind schema; per-value labels for mixed layers; retain health independently | M |
| Coverage on every layer/widget | Partial | Per-provider registries, stats, `DATA_SOURCES.md`; layer rows | Normalize coverage including fallback bounds and display with each widget | M |
| Responsible use and operational disclaimer | Exists | `README.md:631,641-646`; `DATA_SOURCES.md:217-229` | Preserve wording and no-person/no-recognition boundary in hub and case studies | S |
| Persistent provider secrets stay server-side | Exists | `SECURITY.md:16-36`; server provider proxies | Preserve controls; resolve public-token/ephemeral-credential exception below | S |
| Proprietary articles/demos are described honestly | New work | Not an upstream implementation of WorldFX/Astra | Original summaries/links, clearly marked demonstrations; no implied working feature | S |

### Design, navigation, and globe presentation

| Requirement | Status | Where it lives in GEV | Work needed | Effort |
| --- | --- | --- | --- | --- |
| `branding.json` with name/logo/accent | Partial | Hard-coded title/logo `src/ui/templates/scene-chrome.html:10-15` | Add user-editable config and minimal binding, preserve credits | M |
| Shared dark command-center design tokens | Partial | `src/ui/styles/foundation.css:6-33`; `style.css:1-30` | Add one token source and globe adapter; hub consumes same variables | M |
| Light/custom themes and browser persistence | New work | Existing foundation sets dark color scheme at `:81` | Alternate tokens, stored preference, contrast/readability review | M |
| Typography, spacing, radii, five status colors with text | Partial | Existing CSS foundation/controls | Extend shared tokens; readable sans/telemetry mono; never color alone | M |
| 21st.dev visual shortlist before quota-consuming code retrieval | New work | Candidate URLs in request | Visually review candidates in Phase 1; select before fetching code; no retrieval performed in Phase 0 | S |
| Adopted components restyled and recorded in `design/COMPONENTS.md` | New work | No hub/component ledger | Record source URL/license and adapt to shared tokens; keep API keys out of logs/install URLs | M |
| Top-level Globe, Dashboard, Library, Settings navigation | New work | Globe entry and existing in-globe controls | Hub shell/navigation in Phase 1; page bodies delivered in later phases | M |
| Global Cmd/Ctrl+K searches places, coordinates, Library, sources, saved views | New work | Existing command dock is not a global palette: `src/ui/templates/command-dock.html:1-15,67-94` | Shared palette, local search index, handoff links; Phase 3 | M |
| Place/coordinate search reused; entity search stays in globe | Exists, needs surfacing | `src/search/index.js:1-15`; `coordinateGeocoder.js:25-44` | Reuse parsing/search service; do not create a second entity tracker | S |
| Mobile search/toggles/info bottom sheets; explain hidden heavy controls | Partial | `src/ui/styles/responsive.css:1-95`; existing panel/dock markup | New bottom-sheet presentation and mobile testing; no mobile acceptance yet | L |
| Preserve basemap ladder and all source/layer families | Exists | Application catalog and sources; full inventory below | Keep runtime owners and provider constraints; no rebuild | S |
| Preserve sensor styles, HUD, detection overlay | Exists | `src/styles/`; `src/hud.js`; detection/overlay owners | Keep behavior; token changes must not rewrite sensor modes | S |
| Preserve cockpit, Contacts, click-to-track | Exists | `src/ui/cockpit.js`; aircraft/tracking owners | Preserve and run tracking/browser checks before implementation acceptance | S |
| Preserve Director, share links, keyless search, directions | Exists | `src/scenes/director.js`; `src/sharelink.js`; `src/search/`; directions layer | Document/surface; do not replace existing engines | S |
| Preserve voice whiteboard, POWER UP, Nepal scene | Exists | `src/voice/`; `src/keySetup.js`; `src/data/bhoteKoshiEvent.js` | Keep optional/keyed behavior and Nepal licensing | S |
| Persistent active-feed strip with source age and connection health | Exists, needs surfacing | `src/data/layerSnapshot.js:116-153`; existing layer rows `src/ui/layerPanel.js:650-736` | Add presentation over existing snapshots, not a second health classifier | M |
| Needs-key badges link to matching source and POWER UP | Partial | Existing key guidance `src/ui/layerPanel.js:790-805` | Add visible badges, canonical source IDs and deep-link hooks | M |
| Regional coverage outline option per layer | Partial | Weather coverage controls `src/layers/weather/index.js:714-743` | Add explicit geometry/metadata only where supported; never invent global coverage | M |
| Back-to-hub control and hub-generated share-link acceptance | Partial | Share restoration exists; action nav `scene-chrome.html:23-41` | Add fixed same-origin hub destination; verify full share round trip | S |
| New data modules follow existing focused owners | Exists | `CONTRIBUTING.md`; current `src/layers/<family>/`, source factories and server providers | Preserve registration/token rules; additions only after their approved phase/source review | S |

### Library, content, and cases

| Requirement | Status | Where it lives in GEV | Work needed | Effort |
| --- | --- | --- | --- | --- |
| Knowledge Center renders upstream docs and README sections at build time | New work | Existing docs are Markdown, not an in-app Library | Build content renderer/navigation; preserve notices and sanitize unsafe Markdown/HTML | L |
| Original `content/knowledge/` guides, keys, GIS/GEOINT fundamentals, development notes | New work | README field missions/docs supply reusable MIT text | Write original, attributed articles tied to verified features | M |
| Adapt First Five Minutes into walkthroughs | Exists, needs surfacing | README field missions | Convert to linked guides without treating README media as unrestricted assets | S |
| Spatialintelligence.ai articles as original summaries/links | New work | External references in brief | Read and summarize in Phase 2; never republish articles or imply proprietary demos are bundled | M |
| Official video players or links | Partial | Nepal embedded media already uses official providers/CSP | License review; link by default; explicitly review any needed player/CSP change | S |
| Case study pages with sources, licensed visuals, honest interactivity, globe link | New work | Scene/query/imagery primitives exist; case table below | Build pages and evidence-specific handoffs; omit unsupported reconstructed data | M |
| `content/sources.json` as canonical provider registry | New work | Source metadata scattered across registries, notices and `src/data/dataCredits.js:13-26` | Define schema and migrate verified source/terms/coverage/key/cadence/attribution data | M |
| Generated Data Sources directory, layer cards and widget source lines | Partial | Existing credits/row stats; no universal manifest | Generate all presentations from canonical metadata; attach live health separately | M |
| One local search index across all Library content | New work | Existing geospatial search is not document search | Select MiniSearch/Pagefind during plan; build index from original/upstream content | M |

### Personal workspace and advanced features

| Requirement | Status | Where it lives in GEV | Work needed | Effort |
| --- | --- | --- | --- | --- |
| No accounts; browser/file-based workspace | Partial | Current preferences and scene projects use browser storage | Versioned local hub state, no authentication/account subsystem in initial phases | M |
| Home region sets default camera and dashboard filter | New work | Reusable view camera; existing explicit share precedence `docs/CURRENT-STATE.md:4660-4665` | Store point/bounds; explicit share URLs must override home preference | M |
| Named saved views/favorite locations | Partial | Share URLs `src/sharelink.js:509-522,544-603`; durable layer state | Named collection, Settings UI and portable export | M |
| Named layer presets | Partial | `src/data/layerStateCoordinator.js:102-115` | Save validated original v2 hashes and restore through existing authority | M |
| Saved Director scenes and file import/export | Exists, needs surfacing | `src/scenes/director.js:68-77,2025-2075` | Surface existing project storage and validated JSON APIs; no replacement engine | S |
| Bookmarked entities with unavailable-target explanation | Partial | Follow codec `src/view/index.js:46-64`; coordinator `:25-29` | Existing aircraft/military/satellite target links only; no vessel follow codec; handle disappeared targets | M |
| Custom GeoJSON/KML importer | Exists, needs surfacing | `src/data/geoFileImport.js:7-22`; `src/ui/geoFileImport.js:21-41`; app tools `:60-68` | Reuse shipped GeoJSON/JSON/KML/KMZ/GPX loader, bounds and rendering | S |
| Persistent local `custom-data/` folder | Partial | Import is explicitly session-local: `src/ui/geoFileImport.js:1,44-57` | Explicit bounded persistence/manifest/local-server file access; no arbitrary path exposure | L |
| One workspace JSON export/import excluding keys | New work | Director has its own document API; hub collections do not exist | Versioned, self-contained export including branding/preferences/collections and scene/custom-dataset contents; validate imports and exclude secrets. References alone do not fulfill the requested portable single file | L |
| Optional local snapshots, history charts and recorded replay | New work | Last-good disk caches; bounded AIS/transit session trails are not a recorder | Node-first recorder, per-source retention permission, timestamps and honest gaps | L |
| Optional large vector datasets via Martin/PMTiles | New work | Existing import/LOD handles current data | Assess need only after workload measured; reuse established tools | L |
| No Rust rewrite; isolated Rust tools only if justified | Exists | Existing Node/JS architecture | Preserve choice; document measured reason for any future isolated service | S |
| Optional Tauri desktop packaging | New work | Browser-hosted local app | Separate Phase 4 packaging scope after reliable web foundation | L |

### AI, security, hosting, and durable deliverables

| Requirement | Status | Where it lives in GEV | Work needed | Effort |
| --- | --- | --- | --- | --- |
| Keep OpenAI voice, annotations, analyst queries and AI HUD | Exists | `src/voice/`; `src/tools/`; HUD; `docs/CURRENT-STATE.md:4810-4814` | Preserve provider implementations; document rather than rebuild | S |
| Keep existing Gemini and experimental ChatGPT OAuth paths | Exists | `README.md:312-330`; provider-specific voice owners | Preserve newer upstream capability; disclose OAuth uncertainty and separate metering behavior | S |
| Live spend, $2 warning/$5 cap on API-key OpenAI sessions | Exists | `src/voice/voiceCost.js`; `src/voice/realtimeCost.js`; CURRENT-STATE `:4788-4796` | Preserve session guard; label as estimate and do not present it as provider billing guarantee or Gemini/OAuth cap | S |
| Every unusable AI control disabled with setup explanation | Partial | Token acquisition `src/voice/realtimeConnection.js:54-98`; optional HUD fallback | Add capability-aware presentation for usable key/OAuth; keyless UI state still needs browser test | M |
| AI setup/cost/experimental OAuth Library page | New work | Existing provider/setup docs | Explain allowed data transmission, optionality, approximate costs and current provider terms | M |
| MCP client integration | Exists, needs surfacing | `docs/MCP_SETUP.md`; CURRENT-STATE `:89-124`; `src/tools/index.js:6-55` | Document existing HTTP/stdio tools and setup; no new protocol implementation | S |
| Optional Ask Library assistant, server-side/off switch/cost note | New work | No Library retrieval index/assistant | Separately approved content retrieval and AI budget; optional Phase 3 | L |
| Localhost-only service, ignored secrets, provider restrictions and quotas | Exists | `SECURITY.md`; `build/vite.js:57-65,89-114`; `.gitignore` | Preserve gates; never widen bind or configure paid keys during audit | S |
| Phase 4 hosting selection, licensing/security audit and deployment guide | New work | Upstream local security/notices are starting evidence | Review actual topology and every provider/dataset/media/dependency; no hosting selected | L |
| Chrome/Firefox/Safari/Edge and usable mobile layout | Partial | Existing responsive CSS; browser harnesses focus on Chromium | Test actual browsers/devices after implementation; no cross-browser claim now | L |
| Performance comparison against Phase 0 | Partial | `docs/PERFORMANCE.md` describes historical controls | Capture this machine's GPU/viewport/focus/cache/layer-count baseline before changes or waive explicitly | M |
| `SETUP.md` covering install, keys, run, update, troubleshooting | New work | Upstream README and this audit reproduce baseline | Write hub-specific guide once actual architecture is implemented | M |
| `CUSTOMIZATION.md`, `STATUS.md`, agent ground rules, milestone commits | Exists, needs surfacing | Four Phase 0 documentation files | Keep ledger/status current, commit docs checkpoint; later phases remain gated | S |
| One local URL gives branded globe, dashboard, searchable Library | New work | Unmodified globe works; hub pages do not exist | Integrate approved Phases 1–3; do not call current upstream app the completed hub | L |

## 4. Layer inventory: keyless availability, labels, and coverage

The source constructs **32 catalog instances: 31 shareable registry IDs and hardware-local `local-adsb`** (`src/app/constructCatalog.js:41-48,107-178`; `src/data/layerState.js:587-732`). The standard sidebar has **29 IDs in six groups** (`src/ui/layerPanel.js:40-92`). Two Nepal overlays and military-awareness are additional catalog-owned instances. These are not 32 independent network feeds.

**Runtime result for each row:** not individually observed in this audit. The user confirmed the rendered keyless globe only. “Keyless” below means source-supported availability without a provider credential, not proof that the feed currently loads, that all its data is globally complete, or that its license permits redistribution.

The five labels below are proposed hub classifications. Existing health is separately ON/LOADING/DEGRADED/STALE/PARTIAL/FALLBACK/UNAVAILABLE, with transitional states. Nominal polling/cache intervals come from implementation/configuration and must be distinguished from the upstream observation timestamp.

| Group / catalog ID | Proposed label | Coverage / caveat | Keyless or dependency; nominal cadence |
| --- | --- | --- | --- |
| Movement: `flights` | Live | Reported OpenSky aircraft, or bounded adsb.lol fallback; incomplete observations | Keyless; OpenSky OAuth optional; browser 30 s, server about 9 s/adaptive |
| `military` | Live | adsb.lol-reported/classified military aircraft; classification not independently verified | Keyless; poll 15 s/cache 12 s |
| `local-adsb` | Live | User's local receiver/decoder range | Hardware/decoder required, not provider key; streamed/polled with 1 s freshness tick |
| `ais-live-vessels` | Live | Received AIS within subscriptions; terrestrial coverage thins mid-ocean | AISStream key required; poll 60 s over server websocket/cache |
| `satellites` | Estimated | Selected CelesTrak catalogs; propagated positions, stale TLE caveat | Keyless; propagation 1 s, TLE cache 6 h |
| `traffic` | Simulated cars; Live observed flow values | Road data coverage varies; individual animated cars are not observations | Keyless simulation; optional TomTom key for flow; viewport-driven, flow cache 120 s |
| `transit` | Live | 16 registered feeds/regions, reported age and delayed playback | Keyless admitted feeds; poll/cache 15 s; some admission opt-ins |
| `bikeshare` | Live station availability | Registered GBFS systems only; no individual rider tracking | Keyless current providers; 60 s |
| Cameras: `cctv` | Live frames; Estimated pose | Listed public catalogs only; retain capture age and fallback-still/placeholder state | Most keyless; certain packs require opt-in/agreement; active about 10 s, idle about 60 s |
| `recent-imagery` | Refreshed | NASA HLS/VIIRS selected box/product/cloud/capture-date limits | Keyless; on demand bounded 30-day query |
| `street-level` | Static dated imagery | Provider/community coverage; not live street video; Google imagery restricted to Google stack | KartaView/Panoramax keyless; Mapillary public token or Google key+billing for those providers; camera-driven, Mapillary tile cache 24 h |
| Infrastructure: `alpr-cameras` | Static | US/Canada incomplete OSM locations/tags; no plates/video or operating-state claim | Keyless; hourly extract/decoded-tile cache |
| `military-installations` | Static | Incomplete community mappings, not evidence of current activity | Keyless tiles/name index; optional configured Overpass/Google Places; viewport-driven |
| `local-datacenters` | Static | Bundled incomplete OSM snapshot | Keyless bundled data |
| `local-dams` | Static | Bundled OpenInfraMap/OSM snapshot | Keyless bundled data |
| `telegeography-submarine-cables` | Static | Bundled public map, not cable operational health; CC BY-NC-SA 3.0 | Keyless bundled data; incompatible commercial use requires exclusion/license |
| Events: `rocket-launches` | Refreshed metadata; Estimated replay | Existing query is past 30 days, at most 100 results; no upcoming query | Keyless, optional LL2 token; browser 5 min/cache 15 min |
| `earthquakes` | Refreshed | USGS trailing day; normalization keeps M2.5+ | Keyless browser-direct; 60 s |
| `local-firms` | Refreshed | Global last-24-hour detections from four products; not unique fire incidents | FIRMS key required; poll 10 min/cache 30 min |
| `fire-perimeters` | Refreshed | US WFIGS incident perimeters; reporting/mapping gaps | Keyless; 5 min; separate incident-link metadata |
| `gnss-integrity` | Estimated derived score | Sampled 250 nm circles at visited views, rolling 30 min; unvalidated classification, not confirmed interference | Keyless; camera-driven and 60 s poll/cache |
| Weather: `air-quality` | Refreshed | Canadian ECCC AQHI stations only | Keyless browser-direct; observations 20 min/stations 12 h |
| `wind` | Estimated | GFS/IFS model/forecast grid; disclose run and valid time | Keyless; hourly cache, six-hourly cycles |
| `weather-radar` | Refreshed | Contiguous US; missing data does not mean no rain | Keyless; source nominal about 4 min, metadata cache 2 min |
| `weather-satellite` | Refreshed | Global IR nominally 60°S–60°N, polar gaps; regional GOES option | Keyless; global hourly/regional about 5 min, metadata cache 2 min |
| `weather-lightning` | Refreshed | Americas/Pacific density, 110°E across dateline to 0°, 25°S–80°N; not individual live strikes | Keyless; 15-minute density, metadata cache 10 min |
| `weather-cyclones` | Refreshed | Atlantic/eastern-central North Pacific, not worldwide | Keyless; server cache 5 min, disclose advisory timestamp |
| Utilities: `directions` | Estimated computed route | OSRM/OSM coverage and routing availability; fallback/direct lines must stay explicit | Keyless, user-requested; server cache 10 min |
| `radio` | Static directory; Live audio | Geolocated listed stations, not universal coverage/current-program metadata | Keyless; directory 45 min; audio browser-direct, not recorded by GEV |
| Additional: `bhote-koshi-2026` | Static imagery; Estimated reconstruction | Specific historical Nepal event; CC BY-NC 4.0 data | Keyless bundled scene |
| `bhote-koshi-locator` | Static | Bundled scene locator for that event | Keyless bundled data |
| `military-awareness` | Estimated derived context, with input labels | Derived from loaded inputs, not an independent intelligence feed | Inherits source dependencies; refresh 750 ms/motion 175 ms |

Inventory evidence and corrections:

- Active-layer cadence documentation: `docs/CURRENT-STATE.md:3433-3467`; its older transit count is superseded by the **16** source entries at `src/data/transitFeeds.js:392-714`.
- Earthquake threshold/direct source: `src/layers/earthquakes/records.js:29-30`, `source.js:2-16`.
- Canada AQHI/direct source: `src/layers/airQuality/model.js:111-117`, `source.js:8-18,79-88`.
- Weather/cyclone bounds: `server/providers/weather.js:6-50`, `server/providers/cyclones.js:9-10`.
- Satellite estimates: `src/layers/satellites/policy.js:5-13,30-31,45-58`; pass calculation `src/data/satellitePass.js:1-9`.
- FIRMS products are combined without cross-product incident deduplication: `server/providers/firms.js:8-26`.
- ALPR: `DATA_SOURCES.md:216-230`; dataset provenance/licenses: `:189-214`; recent imagery: `:39`.

## 5. Dashboard-specific gaps and cache contract

| Requirement | Status | Where it lives in GEV | Work needed / honest value | Effort |
| --- | --- | --- | --- | --- |
| Feed health, key configuration, update age | Partial | Existing snapshots and specialized FIRMS/TomTom/Mapillary/wind/CCTV status endpoints | Unified passive status registry, with unknown/unconfigured/stale distinguished | M |
| Region filter, home default, widget-to-globe links | New work | Portable view and area-query primitives | Region point/bounds and intersection semantics; default/home behavior; each widget links to real supported view | M |
| Aircraft in region, separate military count | Partial | `src/tools/queries/aviation.js:89-117`; existing proxy coverage headers | Reuse query semantics; incomplete reported counts, not complete airspace census | M |
| Earthquakes last 24 h, magnitude/location list | Partial | USGS browser source and normalized M2.5+ records | Add shared server acquisition/cache or revise source wiring; disclose threshold | M |
| FIRMS detections and US perimeters | Exists, needs surfacing | Proxied FIRMS/status and WFIGS source | Filter cached observations; detections and perimeter incidents are different measures; no key means empty explanation | M |
| Active cyclones and advisory time | Exists, needs surfacing | Existing geometry/advisory source | Region intersection and summary; retain basin limits | M |
| Satellites loaded | Partial | Globe session controls `src/layers/satellites/controls.js:547-558` | Define current-session loaded vs server-cached catalog; server cache alone cannot prove browser loaded count | M |
| Next ISS pass for home location | Exists, needs surfacing | `src/data/satellitePass.js`; `src/tools/queries/space.js:164-212` | Reuse prediction; Estimated, home point and TLE age shown | M |
| Vessels in region | Exists, needs surfacing | AIS server cache/status | Count received fresh records; preserve no-key, subscription bounds and mid-ocean caveat | M |
| Recent launches in 30-day window | Exists, needs surfacing | `src/data/spaceProviderRequests.js:9-18`; LL2 cache | Expose current past window, count cap, provenance and replay-estimate label | S |
| Upcoming launches | New work | Current request has `net__lte=now` | Add bounded future query, cache, pagination/cap and date-window semantics | M |
| Short history charts | New work | Last-good caches; transit/AIS short process-local trails | Separate persistent recorder and source retention allowlist; Phase 3 only | L |

Existing shared services are useful, but a single server does not by itself satisfy a single provider request budget:

| Service | Cache / available evidence |
| --- | --- |
| `/api/flights` | OpenSky about 9 s/adaptive, explicit bounded fallback/source headers; `server/providers/aircraft/opensky.js:28,101-145,260-289`; consumer `src/sources/live/standalone.js:63-95` |
| `/api/military` | 12 s memory cache/backoff/stale; `server/providers/aircraft/adsb-lol.js:4-10,21-31` |
| `/api/vessels` | Websocket/cache status, last-message/watchdog, unkeyed 503; `server/providers/vessels/ais-live.js:100-105,121-140` |
| `/api/celestrak/:group` | Per-group memory/disk, 6 h, stale serving; `server/providers/space/celestrak.js:16-30` |
| `/api/launches` | Memory/disk 15 min, coalescing/stale error; `server/providers/space/launch-library.js:9,23-34,93-125` |
| `/api/firms` and `/api/firms/status` | 30 min cache and key/fetch/stale/transaction metadata; `server/providers/firms.js:8-26` |
| `/api/transit/vehicles/:feedId` | 15 s/coalescing, 10 min stale limit; `src/sources/transitService.js:90-113` |
| Transit trails | Process-local 15 min bounded history, not persistent recorder; `src/sources/transitHistoryStore.js:3-11` |
| `/api/fire-perimeters` | Bounded/paged WFIGS proxy; `server/providers/firePerimeters.js:9-41` |
| Direct browser sources | USGS earthquakes, ECCC AQHI and recent-imagery acquisition lack the requested common server snapshot contract |

Normal data endpoints may refresh upstream when expired. A dashboard reading those endpoints can create additional acquisition demand even with caching. Recommended Phase 2 contract: one acquisition service per provider, immutable latest snapshot plus freshness/coverage/completeness, read-only health/summary endpoints that do not initiate upstream work, and a declared activation/subscription owner. If dashboard-alone use activates a source, it must do so through that same owner. Reuse `src/tools/queries/brief.js:18-62,133-205` and other portable query functions instead of duplicating metric logic.

## 6. Case-study audit

“Interactive” here means the pinned source provides a relevant capability. The new Library case-study page itself is still **New work** for every row; no additional licensed track/imagery dataset was acquired.

| Requested case | Pinned capability / status | Work and disclosure | Effort |
| --- | --- | --- | --- |
| Nepal Bhote Koshi flood | Exists, needs surfacing | Link bundled scene and before/after; historical reconstruction, CC BY-NC data; retain source attribution and license | S |
| Hurricane tracking/replay | Partial | Current NHC/CPHC advisories and weather timeline exist; distinguish bounded existing weather history from an unbuilt long-term cyclone archive | M |
| Launch reconstruction | Exists, needs surfacing | Space Missions replay is an estimate; current metadata window is past-only; no implied observed full trajectory | S |
| Aircraft incident reconstruction | Out of scope as a working reconstruction without admitted data | Demonstration/original reporting links only until licensed incident tracks and replay scope are approved | M |
| Satellite imagery change | Partial | Recent Imagery already has keyless HLS 30 m/VIIRS 250 m, dated comparisons and A/B modes; use a demonstrably covered case. Arbitrary imagery/history remains a demonstration until sourced | M |
| WorldFX/Astra AI 3D reconstruction | Out of scope | Proprietary demonstration only; original summary/link; no false interactive button | S |

Recent Imagery evidence: `docs/CURRENT-STATE.md:4978-4984`. Scene import/export and existing projects: `src/scenes/director.js:68-77,2025-2075`. Handoff should preserve validated share state; live target links are not a permanent dataset archive.

## 7. Conflicts and recommended alternatives

1. **Browser credentials:** the brief explicitly excepts only Google/Cesium browser keys. Upstream also injects a Mapillary public client token (`SECURITY.md:26-36`; `build/vite.js:108-114`; `server/standalone/vite.config.js:27-29`). OpenAI voice uses ephemeral Realtime credentials in the browser while the persistent key remains server-side (`SECURITY.md:16-24`). Recommended clarification: permit provider-designated public client tokens with restrictions and short-lived session credentials; keep permanent secrets server-side. No affected credentials were enabled. Obtain a decision before dependent keyed implementation.

2. **One label for mixed products:** a camera frame and estimated pose, refreshed TLE and estimated current orbit, simulated car and observed flow, launch advisory and reconstructed trajectory, or static radio directory and live audio cannot share one accurate label. Use per-value labels plus independent existing transport/freshness health. Do not call forecast wind a direct observation.

3. **Shared budgets:** some adapters are browser-direct and existing data endpoints can trigger refresh. Add explicit server acquisition/passive-summary ownership rather than claiming duplicate polling disappears because both shells share an origin. Do not generate live history from an array of invented sample points.

4. **Version drift:** the brief's approximate layer count and missing import/history features are not the pinned source inventory. Preserve 32 catalog instances (not 32 feeds), existing import, Recent Imagery, Gemini voice, portable queries/situation briefs, and MCP tools. Current transit source has 16 entries, while an older active-layer table says seven. Extend current focused owners instead of rebuilding earlier architecture.

5. **Saved target types:** full share/preset state is richer than the portable view subset, and current follow types do not include vessels. Preserve original validated v2 state for presets. Keep vessel bookmarks as a disclosed view-only alternative or approve a separate codec extension. A missing live target must yield an explanation, not a fabricated replacement.

6. **MIT versus data/media:** code licensing is not a license for every bundled asset. Nepal imagery **and** `src/data/bhoteKoshiFloodPath.js` are CC BY-NC 4.0; TeleGeography cables are CC BY-NC-SA 3.0 (`LICENSE:25-61`; `DATA_SOURCES.md:191-214`). Incompatible commercial hosting needs complete exclusion or separate licensing, including scene registrations/imports containing restricted data. Preserve attribution for permitted local use. README GIF permission covers unmodified inclusion with the repository/project documentation, not unrestricted standalone/rebranded reuse (`docs/media/README.md:5,25-27,38`; `README.md:639`). Prefer cleared visuals or links in new branded cases.

7. **Keyless does not mean publicly redistributable:** repo notices call out NYC DOT operator agreements; Florida personal-use limits; DelDOT permission review; OpenSky product-use agreement concerns; some GBFS feeds without published licenses; BiciMAD noncommercial terms; adsbdb restrictions; and no formal AISStream terms. Google content storage/redistribution and Google News RSS use have additional limits (`DATA_SOURCES.md:29,31-35,47-51,71-75,116-117,158,167,173,184`). Provider terms need current primary-source confirmation before new source admission, recording or public deployment. Use a per-source recorder allowlist; do not archive everything indiscriminately.

8. **Authenticated private hosting is not a drop-in option:** current cost/quota/log routes reject forwarding headers and cross-origin requests; Provider Settings has extra local socket/Host/origin/sharing gates (`SECURITY.md:76,102-110`; `src/localRequestGate.mjs:23-38,100-108`; `src/keySetupCore.mjs:265-280,295-333`). An authentication proxy can still get 403 responses. Keep hosting unselected until a specific topology/security review and end-to-end tests. Do not strip headers or weaken gates during Phase 0. Memory throttles are not provider billing caps.

9. **AI limits and optionality:** upstream's OpenAI API session meter/cap is not a billing guarantee for all providers or OAuth. Gemini lacks the same MINI/meter behavior; ChatGPT OAuth is experimental and upstream warns it can stop working or fall outside account terms (`README.md:312-330`). Preserve options, document uncertainty, and make no live AI calls in this audit. Questions about camera imagery can send a downscaled rendered screenshot to the model (`DATA_SOURCES.md:175`); explain that in setup before use.

10. **Phase boundaries:** Phase 1 navigation may expose Dashboard/Library/Settings route shells; Phase 2 supplies Library/dashboard content and real summaries; Phase 3 supplies named collections and full workspace behavior. Route scaffolding must not contain pretend live metrics. Each phase still needs its own file-level plan and acceptance review. Public hosting, extra feeds and Rust packaging are not part of the approved foundation.

`THIRD_PARTY_NOTICES.md:3-6` covers selected SDR/Street-Level packages, not a complete dependency/data/model license audit. Its listed package licenses do not settle the Phase 4 inventory. Retain all map/provider credits (`DATA_SOURCES.md:431-433`) and the responsible-use/operational disclaimer. ALPR remains location/tag data, never plates, face recognition, or person tracking.

## 8. Recommended implementation sequence for later approval

No application files in this sequence have been created or changed.

| Phase | Proposed scope / likely files | Gate |
| --- | --- | --- |
| 1 Foundation | Sibling `/hub/` HTML/TSX entry; hub-only React/TS/Tailwind/shadcn dependencies; `branding.json`; shared `design/tokens.css`; `design/COMPONENTS.md`; small `src/custom/` handoff/feed-strip/key-link adapters. Expected upstream touch points: browser build configuration, final stylesheet import, narrow globe template/startup hooks; exact list requires plan | Review Phase 0 result and residual verification; then approve exact file plan/21st.dev shortlist before implementation |
| 2 Information | `content/sources.json`, original knowledge/case Markdown/JSON, build-time docs renderer/local search, hub pages, read-only server summaries and source acquisition adapters. `SETUP.md` should describe implemented behavior | Source/coverage/license/schema approval, no duplicate polling, honest empty states, full-source directory |
| 3 Workspace | Home region, named views/presets, validated export/import, persistence around existing file importer, global palette, AI setup. Optional recorder/Ask Library receive separate scope | Source retention rights, secret-exclusion checks, real captured history only |
| 4 Refinement | Desktop/mobile/browser validation, measured performance comparison, dependency/data/media/security audit, chosen hosting/deployment guide. Optional packaging isolated | Explicit hosting decision and deployment authorization; no assumed proxy compatibility |

Recommended route contract is `/` for the intact globe and `/hub/` for the sibling application, both at the existing loopback origin. The browser Vite factory accepts additional plugins; the HTML expansion plugin handles explicit GEV template markers only (`build/application-html.js:16-38`). A sibling hub HTML file need not inherit globe DOM. Preserve middleware order, CSP, Host checks, frame protections, provider credits and same-origin APIs. Keep hub dependencies isolated and Tailwind resets out of globe CSS. This is a design recommendation, not an implemented or approved Phase 1 plan.

## 9. Acceptance and review request

- Fork, pin/remotes, supported installation, doctor, unit/allocation baseline and production build are verified.
- The unmodified loopback server/headers are verified; globe rendering is user-confirmed.
- Complete source/key/coverage inventory and written requirement gaps are delivered. Per-layer actual loading, automated browser regression and GPU/FPS baseline remain explicitly unverified.
- No future feature is described as implemented. No paid services or keys were enabled. No upstream code edits were made.
- **Phase 0 is awaiting the user's gap-analysis review.** Resolve or explicitly waive outstanding verification and any dependent requirement conflict; then present a separate Phase 1 file-level plan. Approval of the original Phase 0 plan does not satisfy this gate.

The actionable outstanding list is maintained in [STATUS.md](../../STATUS.md); the pin and file ledger are in [CUSTOMIZATION.md](../../CUSTOMIZATION.md).
