# Phase 2a reverification and Ajv decision review

**Current checkpoint:** all M1 gates pass, including user tracking 109/0/0, hub QA 10/10, full normal-HMR containment 21/21 and invalid-content startup 3/3, with exact restoration and native/build/graph evidence recorded in `PHASE-2A-VALIDATION.md`. Commit the buildable M1 milestone and continue to M2 under the existing approval. Its nine original articles require editorial review before committing; M3 retains its case review and Phase 2a final acceptance remains pending. The 63-path inventory/two-file upstream allowlist are unchanged; Phase 2b stays deferred. Earlier conditional/pending passages are historical.

October 20, 2026 · America/New_York. **The user approved the generated projection, Ajv option(b) and all frozen-pin facts/admissions/content constraints.** Implementation milestone 1 onward is now conditionally approved after a complete normal-HMR `test:track` pass on 4173. Restore normal HMR and diagnose any failure before implementation. The accepted inventory is 63 paths and the original-upstream allowlist remains exactly two files. Preserve milestone 2/3 editorial stops; stop/report if HMR containment acceptance fails. Phase 2b remains deferred.

## Shipping closeout and evidence

- Adopted upstream pin: `064d51f7be2675f1c69e16068e9c49d1a60144d1`; prior pin: `de2138e84c1778fd98a48b7c9fd0b9788c318946`. Reviewed shipping product-code checkpoint: `fd136b60ce9421bd8636692232766a5f7d2226e3`; documentation HEAD when this review began: `c48f866a572cb483a34894f480dd1cdb9fa58072`.
- Shipping hub QA: **9/9 passed**, matched to `.gev-logs/qa-custom-hub-2026-10-20T19-28-09-202Z.json` at `2026-10-20T19:28:09.203Z`, origin `http://localhost:4173`, all assertions true, no resource/browser-error counters.
- Street Level smoke: **all checks passed, user-reported**. Tracking rerun: **109 passed / 0 failed / 0 skipped, user-reported in the latest direct message**. No new tracking transcript/receipt or independent agent rerun is claimed. The earlier 88-pass incomplete run and its fatal context-destruction error remain preserved as separate evidence.
- All previously recorded shipping non-browser gates remain passing: install, policy, doctor, typecheck, boundaries, formatting, both builds, and **8,176 unit/allocation passes / zero failures / one native-Windows platform skip**. There were no product changes requiring those suites to be repeated for this documentation review.
- Rehearsal listener **PID 55130 on `[::1]:4174` was verified against its command and worktree, then stopped** at `2026-10-20T19:41:08.391625+00:00` (15:41 EDT). Port 4174 has no listener. Its worktree `/Users/getumwanna/.codex/worktrees/upstream-sync-rehearsal/GEV` is retained, including **94 log files / 59,428,182 bytes**. The SHA-256 inventory is `.gev-logs/post-pin-review/rehearsal-log-retention.json`. No logs were deleted or worktree archived.
- Shipping 4173 remains running as PID 65423 in the temporary root-config HMR-off verification mode. Normal HMR must be restored for Phase 2a authoring/recovery tests when implementation is authorized; HMR-off must not be used to claim that invalid-content isolation or HMR recovery works.

This closeout accepts the approved integration, not Phase 2a implementation or content. It makes no new live-source, FPS, provider-rights, or recording claim. Hong Kong/Taiwan remain policy-disabled, Ontario remains key-required and unconfigured, and both user-requested Cesium/OpenSky notes remain in `SETUP.md`.

## Changes to the Phase 2a plan requiring review

1. **Proposed generated metadata projection:** add `src/custom/shared/sourceRegistry.generated.js` to the previously approved 62 implementation paths, giving **63**. `content/sources.json` remains the sole authored metadata authority. The globe consumes only the last validated plain-JavaScript projection; Node checks and production builds reject stale output. Invalid development content changes only Library state, leaving the globe's validated metadata intact. This path was already proposed for post-pin review; it has not been created.
2. **Recommend Ajv option (b), development-only lazy compilation.** Ajv stays a **devDependency**, but its role expands from Node-only to Node plus development Library validation. Guard the dynamic import with `import.meta.env.DEV`; strict Node checks validate production inputs before either build. The measured production fixture removes Ajv entirely. No server validation endpoint or extra top-level Vite plugin is needed. Full production runtime Ajv is an unnecessary measured upper bound, not the recommendation.
3. **Adopt the precise frozen-pin facts and proposed doc admissions in this report.** There are no renamed layer/setup/guide identities to migrate. The corrections concern product-specific credentials, policy-disabled packs, Street Level behavior, imagery/reconstruction limits, and dated provenance. All case filenames, article filenames, public metadata APIs, and editorial stops stay as planned.

The original-upstream allowlist remains **exactly `package.json` and `package-lock.json`** for the recommended option. Do not implement option (a) by hiding middleware in an upstream plugin, using a fake Tailwind plugin name, or changing the original tooling test without an explicit amendment.


## Exact layer identity and metadata contract

31 serialized layer IDs in authoritative src/data/layerState.js; local-adsb is additionally local-only via src/app/constructCatalog.js:41-48. Total32. These four upstream owner files are byte-identical across pins: src/data/layerState.js, src/keySetupCore.mjs, src/app/constructCatalog.js, src/app/sourceComposition.js (git diff --numstat empty). The source registry must cover all32, not only shareable layers.

Ordered serialized IDs (registry order):

1. `air-quality`
2. `ais-live-vessels`
3. `alpr-cameras`
4. `bhote-koshi-2026`
5. `bhote-koshi-locator`
6. `bikeshare`
7. `cctv`
8. `directions`
9. `earthquakes`
10. `fire-perimeters`
11. `flights`
12. `gnss-integrity`
13. `local-dams`
14. `local-datacenters`
15. `local-firms`
16. `military`
17. `military-awareness`
18. `military-installations`
19. `radio`
20. `recent-imagery`
21. `rocket-launches`
22. `satellites`
23. `street-level`
24. `telegeography-submarine-cables`
25. `traffic`
26. `transit`
27. `weather-cyclones`
28. `weather-lightning`
29. `weather-radar`
30. `weather-satellite`
31. `wind`

32. `local-adsb` (local-only; exclude from portable/shared serialized state).

Existing custom metadata values below are compatibility classification, not verified feed-health evidence and not an exhaustive list of every runtime layer value. Keep each value identity and kind, while adding product-level evidence/coverage.

| Layer ID | Value ID: kind | Guide source references | Layer-wide requiredKeyId |
| --- | --- | --- | --- |
| air-quality | observations: Refreshed | eccc-aqhi | null |
| ais-live-vessels | observations: Live | aisstream | aisstream |
| alpr-cameras | locations: Static | openstreetmap | null |
| bhote-koshi-2026 | imagery: Static; reconstruction: Estimated | bhote-koshi | null |
| bhote-koshi-locator | locator: Static | bhote-koshi | null |
| bikeshare | availability: Live | gbfs | null |
| cctv | pose: Estimated | cctv | null |
| directions | route: Estimated | osrm | null |
| earthquakes | observations: Refreshed | usgs | null |
| fire-perimeters | perimeters: Refreshed | wfigs | null |
| flights | observations: Live | opensky, adsb-lol | null |
| gnss-integrity | score: Estimated | adsb-lol, gnss-integrity | null |
| local-dams | locations: Static | openstreetmap, openinframap | null |
| local-datacenters | locations: Static | openstreetmap | null |
| local-firms | detections: Refreshed | firms | firms |
| military | observations: Live | adsb-lol | null |
| military-awareness | context: Estimated | gev-context | null |
| military-installations | locations: Static | openstreetmap, openfreemap, overture-military-names, overpass, google-maps | null |
| radio | directory: Static | radio-browser | null |
| recent-imagery | imagery: Refreshed | nasa-gibs, nasa-cmr | null |
| rocket-launches | metadata: Refreshed; trajectory: Estimated | launch-library, celestrak | null |
| satellites | position: Estimated | celestrak | null |
| street-level | imagery: Static | mapillary, google-maps, kartaview, panoramax | null |
| telegeography-submarine-cables | geometry: Static | telegeography | null |
| traffic | vehicles: Simulated | openstreetmap, tomtom | null |
| transit | observations: Live | transit | null |
| weather-cyclones | advisories: Refreshed | nhc-cphc | null |
| weather-lightning | density: Refreshed | noaa-nowcoast | null |
| weather-radar | observations: Refreshed | noaa-nowcoast | null |
| weather-satellite | observations: Refreshed | noaa-nowcoast | null |
| wind | wind: Estimated | noaa-gfs, ecmwf-ifs | null |
| local-adsb | observations: Live | local-adsb | null |

Only ais-live-vessels requires aisstream and local-firms requires firms at the layer level. Ontario's conditional camera-pack key must not become cctv.requiredKeyId. Street Level is mixed: required Mapillary/Google provider credentials do not make the whole layer key-required; KartaView/Panoramax remain keyless.

API contracts from src/custom/shared/layerMetadata.js:4,62-102,287-295:

- DATA_KINDS: Live, Refreshed, Simulated, Estimated, Static.
- getSourceGuides(): stable frozen ordered array (38 items), each frozen guide has exactly id, name, setupKeyId, setupUrl, docsHref, explanation. Setup guides have setupUrl '/?setup=1' and setupKeyId matching safe catalog; public guides have both null.
- getSourceGuide(id): exact known string lookup, otherwise null (including non-string).
- sourceGuideHref(id): known ID -> '/hub/#/library/sources/'+encodeURIComponent(id); unknown -> null; never caller-supplied URL.
- getLayerMetadata(id): known string -> frozen {id,valueKinds,sources,requiredKeyId}; unknown/non-string -> null. Nested valueKinds and sources arrays frozen; each value is frozen {id,label,kind}.
- getLayerKindValues(row): accepts string or object with id, returns matching frozen valueKinds; unknown returns shared frozen empty array. Preserve referential/API behavior instead of exposing registry internal shapes.
- Existing public docsHref points at unpinned main/DATA_SOURCES.md. Phase 2a should use pin-specific document evidence/routes; never silently treat moving-main text as admitted content at this pin.

## Exact setup identifiers vs conditional credentials

Source owner src/keySetupCore.mjs:38-139; safe setup catalog returned at :474. 11 identifiers total:10 visible plus google-maps-server hidden. Ontario is absent here. No keys/values were read.

| Setup ID | Environment credential names (schema identifiers only) | Visibility |
| --- | --- | --- |
| google-maps | GOOGLE_MAPS_API_KEY | visible |
| google-maps-server | GOOGLE_MAPS_SERVER_API_KEY | hidden |
| openai | OPENAI_API_KEY | visible |
| gemini | GEMINI_API_KEY | visible |
| aisstream | AISSTREAM_API_KEY | visible |
| firms | FIRMS_MAP_KEY | visible |
| tomtom | TOMTOM_API_KEY | visible |
| cesium-ion | CESIUM_ION_TOKEN | visible |
| opensky | OPENSKY_CLIENT_ID + OPENSKY_CLIENT_SECRET | visible |
| mapillary | MAPILLARY_CLIENT_TOKEN | visible |
| launch-library | LL2_API_TOKEN | visible |

OpenSky is a paired credential capability, not two setup IDs. Gemini is an existing supported safe setup ID despite not appearing in the user's ten-provider key-guide ordering. Preserve it in the canonical registry. google-maps-server is known to the setup system but hidden and not a public guide. ONTARIO_511_API_KEY is server-env-only, conditional for Ontario pack, no POWER UP field at this pin; credential reference must be represented separately with setupKeyId:null and truthful no-supported-setup-control guidance. Do not configure or expose a credential.

Exact38 public guide route identities (existing order):

1. `google-maps` (setup google-maps)
2. `openai` (setup openai)
3. `gemini` (setup gemini)
4. `aisstream` (setup aisstream)
5. `firms` (setup firms)
6. `tomtom` (setup tomtom)
7. `cesium-ion` (setup cesium-ion)
8. `opensky` (setup opensky)
9. `mapillary` (setup mapillary)
10. `launch-library` (setup launch-library)
11. `adsb-lol`
12. `local-adsb`
13. `celestrak`
14. `openstreetmap`
15. `openfreemap`
16. `overpass`
17. `overture-military-names`
18. `openinframap`
19. `transit`
20. `gbfs`
21. `cctv`
22. `nasa-gibs`
23. `nasa-cmr`
24. `kartaview`
25. `panoramax`
26. `telegeography`
27. `usgs`
28. `wfigs`
29. `gnss-integrity`
30. `eccc-aqhi`
31. `noaa-gfs`
32. `ecmwf-ifs`
33. `noaa-nowcoast`
34. `nhc-cphc`
35. `osrm`
36. `radio-browser`
37. `bhote-koshi`
38. `gev-context`

Umbrella groups transit, gbfs, cctv must keep their identities while individual products retain separate coverage/licensing records. Setup/provider IDs and layer IDs are separate namespaces (e.g. firms vs local-firms, launch-library vs rocket-launches). Provider key and safe setup IDs must not be inferred from layer labels.

## Frozen-pin changes and custom policy distinction

These are repository/source facts; implementation presence is not a live feed check. References and prior-vs-target comparison corroborate docs/custom/UPSTREAM-SYNC-REHEARSAL.md:49-67.

| Scope | Confirmed old→new change and Phase 2a consequence | Current source references |
| --- | --- | --- |
| CCTV / Ontario511 | Keyless catalog -> server ONTARIO_511_API_KEY required; missing key skips this pack. Geographic extent/frame host unchanged. Accept coverage loss, list product key-required, configure no key. Free developer registration+approval, 10 calls/min, intended-use/third-party disclosure and distributor as-is notice are repository-documented; terms approval is not implied. | server/providers/cctv/sources.js:544-584; .env.example:210; DATA_SOURCES.md:159; SETUP.md provider guide |
| CCTV / Hong Kong | New upstream default-on keyless Transport Department XML catalog/snapshot host, Hong Kong Island/Kowloon/New Territories. Default cap1100, configurable8–1200; documented approx1013 not an observed loaded count. New DATA.GOV.HK/Transport Department credit terms. Shipping custom policy forces OFF until separate review/activation. | server/providers/cctv/catalog.js:111-115; server/providers/cctv/constants.js:314-344; server/providers/cctv/sources.js:2013-2230; DATA_SOURCES.md:66,173; build/customProviderPolicy.js:7-12 |
| CCTV / Taiwan | New upstream default-on keyless freeway MOTC2 XML+four pinned official camera hosts. Default cap600, configurable1–2000. MJPEG→same-camera JPEG paths not explicit in source table; off-island reachability caveat; hourly failure retry/last-good up to24h. New Taiwan OGD1.0 attribution. Shipping custom policy forces OFF. | server/providers/cctv/catalog.js:163-167; server/providers/cctv/taiwan.js:11-33,139-148,205-208,226-303; DATA_SOURCES.md:116; build/customProviderPolicy.js |
| StreetLevel / Mapillary | Same source/public client token. Above60km overview removed; z11–14 tiles. Generic nearest-image Graph method removed; sequence selection stays, computed altitude omitted. Disk cache becomes memory-only24h, max120tiles, max4MiB each; old ignored disk files not read/deleted. Pinned HTTPS/redirect refusal. No licensing change documented (CC BY-SA/API terms). | src/layers/streetLevel/providers/mapillary/policy.js:11,73-74; src/layers/streetLevel/providers/mapillary/source.js:111-125; src/layers/streetLevel/tileMath.js:146-152; server/providers/mapillary/tiles.js:5-29,79-115,182-208; SECURITY.md:32 |
| StreetLevel / Panoramax | Same keyless federated sources/per-picture license. Above60km density overview removed; per-tile equal line budget. Physical coverage unchanged, displayed overview reduced. Global credit added. | src/layers/streetLevel/providers/panoramax/policy.js:33-54; DATA_SOURCES.md:26; src/data/dataCredits.js:343-344 |
| StreetLevel / KartaView, Google | Source/key/billing/license/availability unchanged; global credits added. Google remains default-off and requires Google3D map stack, billable panorama loads. Shared FOLLOW/cast/portable-panel modes removed; current photo controls EXPAND/SHRINK/Escape. Explain current UI only. | src/layers/streetLevel/providers/google/index.js:57-69; src/layers/streetLevel/providers/kartaview/policy.js:38-50; README.md:427-430; src/data/dataCredits.js:335-340 |
| Satellites / CelesTrak | Same provider/no key/catalog scope. Cached TLE stale provenance now carried through core+dense records and getStats(), no hardcoded false. Explain estimated propagation and freshness independently, separate globe-loaded count from cached catalog; no claim of live observations. | src/layers/satellites/{catalog,ingestion,state,lifecycle}.js; src/layers/satellites/controls.js:547-561 |
| Flights, LocalADS-B / adsbdb | Same sources/keys/aircraft coverage; stricter route plausibility excludes beyond origin–destination segment with200km tolerance. Route label disappearance is metadata admission, not lost aircraft coverage. | src/data/routePlausible.js:79-107; src/layers/flights/tracking.js:872; src/layers/localAdsb/index.js:282 |

Custom shipping policy is separate from upstream behavior: build/customProviderPolicy.js validates reviewed catalog and standalone config hashes, applies forced0 before standalone configuration in build/customHub.js, reasserts0 inside wrapper. The offline six-scenario checker proves actual catalog requests/rows for HK+Taiwan are zero with Austin positive control. Persist flags and drift-fail checks across root dev/preview/build starts; do not describe default upstream itself as off. Other existing live camera packs retain settings; rehearsal broad suppression of live packs was not shipping policy. Existing NYC/Lithuania/Florida opt-ins unchanged. Global catalog cap4000 means publisher totals are not current loaded counts.

## Existing source-owner boundaries to preserve

- Catalog/control assembly: src/app/{catalog,constructCatalog}.js. Layer state serialization: src/data/layerState.js. Family-specific source contracts: src/app/sourceComposition.js. Focused app bindings: src/app/layers/*.js.
- Data Sources Library must not call these acquisition APIs. Current contracts include getSnapshot (aircraft/vessels/weather/etc), CCTV getCatalog/getHealth/getFrameUrl/getMediaUrl, satellites readGroup, launches getLaunches/getActiveTle, recent-imagery searchHls/getThumbnail/getTileTemplate; Phase 2a remains static descriptive metadata, source ownership/passive summaries deferred2b.
- Mixed/direct owners: recentImagery model/catalog/source and GIBS/CMR browser-direct; StreetLevel provider-local adapters; server/provider modules for CCTV and Mapillary; registry entries must not invent replacement acquisitions.
- Terms guide notes already user-approved: Cesium tracking uses Google3D/defaultEsri instead of ion-hostedBing, subject to those terms; OpenSky anonymous access falls under its terms and any future recorder/archiving requires a terms check before proposal. No hosting/source/retention activation in2a.


## Post-pin content and case constraints
1. Recent Imagery exists and is not demo-only: keyless browser-direct NASA GIBS/CMR; products S30/L30 at30m, VIIRS NOAA21 at250m;30day catalog, max1000km each box side. HLS searched via CMR; VIIRS daily global mosaic has no granule catalog. A/B comparison can be interactive only within actual product/date/coverage limits. Arbitrary historical imagery/unsupported reconstruction remains demonstration-only. Sources src/layers/recentImagery/model.js:12-65,133-161; src/layers/recentImagery/catalog.js:175-224; DATA_SOURCES.md:39. These owners unchanged across pins, but article/case must use exact current facts.
2. Nepal: historical2021-10-16 Vantor context versus2026-08-27 post-event imagery; non-commercial CC BY-NC4.0; not immediate pre/post measurement.25-shot existing scene, schematic flood path not hazard model. Existing Google3D with Esri fallback/Re:Earth terrain where no ion; do not promise a share URL restores Director selection/shot/replay/mission. Sources public/events/bhote-koshi-2026/README.md:3,10-11,40-54; docs/CURRENT-STATE.md:607-618.
3. Launch reconstruction: existing30day recent-launch metadata and estimated/reconstructed replay; LL2+CelesTrak input not measured full ascent. Upcoming-launch query remains2b. Sources server/providers/space/launch-library.js:22,108; src/layers/launches/{source,model,replay,policy}.js; README.md:410-412,446.
4. Hurricane tracking: official NHC/CPHC advisories/cones/wind guidance, not proprietary forecast or arbitrary archival replay; represent advisories Refreshed, model fields Estimated. Existing source fallback/coverage remains unaltered.
5. Aircraft incidents: live-contact capability and presentation cannot prove incident truth, past replay, attribution, or complete aircraft coverage. adsbdb metadata plausibility narrowing must be disclosed if relevant; aircraft public IDs permissible per project rules, named-person tracking prohibited.
6. Satellite imagery change: distinguish existing bounded A/B raster comparison from estimated satellite orbit propagation and bundled licensed Nepal assets. Each product/date/coverage documented separately; CTA proves only accepted restored URL scope.
7. WorldFX/Astra: external proprietary demonstrations described as such; no claim local code reconstructs arbitrary video, no external article body/media replication. Two Spatial Intelligence articles need original summaries+links and user editorial check in milestone2.
8. Source-kind vocabulary: registry value kind must use exactly Live/Refreshed/Simulated/Estimated/Static and remain independent of health. Runtime sourceKind is NOT equivalent: CCTV catalog sourceKind identifies adapter/source pack; frame sourceKind upstream-image/hls-pull denotes current-frame transport, streetview is fallback and synthetic is unavailable, see src/tools/queries/media.js:143-181. Never infer Live from arbitrary sourceKind or a catalog being healthy. Static directory records describe products; dynamic observation timestamp/health/count/key presence absent.
9. hub/src/pages/SourceGuide.tsx:13 currently promises current health in Phase2 directory; new Library copy must explicitly say Not checked in Library because passive summaries deferred2b. Existing Phase 1 MAIN document links are moving refs, so canonical evidence must be frozen pin plus selected section/hash.


## Six case-page reverification

| Planned path | Current-pin applicability and required honest presentation | Source evidence / action limits |
| --- | --- | --- |
| `content/cases/nepal-flood.md` | Existing bundled Nepal scene. CC BY-NC 4.0 Vantor/GeoPera data; the 2021 image is historical context, not an immediate pre-event baseline. Corridor progression is schematic, not measured arrival time or a hazard model. | Pinned DATA_SOURCES bundled snapshots; link [event provenance](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/public/events/bhote-koshi-2026/README.md), `src/scenes/packs/nepal.js`, `src/data/bhoteKoshiFloodPath.js`. No media copying. Share CTA cannot promise scene selection until codec behavior is verified. |
| `content/cases/hurricane-tracking.md` | Partial local capability: current NHC/CPHC advisories and bounded nowCOAST weather history. Atlantic/eastern-central North Pacific, not global coverage. Cone describes forecast-center uncertainty, not hazard footprint. | Selected DATA_SOURCES cyclone section and live table; focused owners `src/layers/cyclones/`, `src/layers/weather/`. No archived hurricane replay or long-term recording claim; the author’s WorldFX replay is a separate demonstration. |
| `content/cases/launch-reconstruction.md` | Existing Space Missions recent-launch reconstruction. Timing/path geometry are estimates, not measured continuous ascent telemetry. Failed launches cannot receive fabricated fallback orbit markers. | `src/layers/launches/paths.js`, `policyHelpers.js`, `source.js`; DATA_SOURCES LL2 notes. No upcoming-launch query (deferred to 2b); no imported replay dataset or new source. |
| `content/cases/aircraft-incidents.md` | Demonstration narrative only. Existing live flight tracking and a synthetic tracking regression are not an imported historical incident track or established accident cause. | `src/layers/flights/`, `src/data/rocketLaunches.js` is unrelated; never substitute a live flight view for an incident reconstruction. Any historical case CTA must say it opens only a geographic view, with no incident dataset restoration. |
| `content/cases/satellite-imagery-change.md` | Partial local capability: Recent Imagery supports selected-box HLS S30/L30 30 m and VIIRS NOAA-21 250 m imagery over the last 30 UTC days. Dates/product/coverage/cloud limits must be explicit. A/B changes are observations, not automatically causal conclusions. | Selected CURRENT-STATE Recent Imagery; `src/layers/recentImagery/{source,catalog,model,rendering}.js`. Select a demonstrably covered case at editorial time; no arbitrary-date image archive or new service. |
| `content/cases/ai-reconstruction-demonstrations.md` | External WorldFX/Astra demonstrations; proprietary reconstruction is not a capability of this local hub. Attribute article claims and mark what was not locally reproduced. | Original linked primary summaries only; no copied media, article body, transcript or proprietary data. No model/provider calls. |

The six filenames and case classifications remain unchanged. Every published globe CTA must restore only supported v2 state; validate through the permitted browser path and label actual scope. The URL codec is not being extended in 2a.


## Original article claims to revisit at milestone 2

| Planned original article | Post-pin editorial requirement |
| --- | --- |
| `project-background.md` | Distinguish upstream code/documentation MIT grant from dataset/media licenses, local customization from upstream features, and current pin from old launch claims. |
| `first-five-minutes.md` | Use current Street Level EXPAND/SHRINK/Escape and zoom thresholds; do not copy README screenshots or promise disabled/credential-required camera coverage. |
| `understanding-data-labels.md` | Keep per-value observation kinds, separate health, launch geometry estimates, schematic Nepal progression and satellite loaded-versus-catalog count distinctions. |
| `layers-and-coverage.md` | Ontario key-required; HK/Taiwan policy-disabled; no orbital Street Level overview; air quality Canada-only; GNSS anomalies do not prove interference. Verify every number against current owners rather than promotional totals. |
| `keys-and-costs.md` | Match SETUP’s reviewed provider guide; no unrestricted browser secret advice, fixed “free forever” claims, or automatic key setup. Track flights/vessels on Google 3D/default Esri instead of ion Bing. Anonymous OpenSky terms still apply; recorders/archiving need terms review before proposal. |
| `gis-geoint-fundamentals.md` | Original conceptual tutorial; distinguish observations, models, inference, uncertainty and lack of an operational-use guarantee. No new service integration. |
| `development-and-updates.md` | Current pin/owners/Node requirements, both hub/globe build gates, four upstream QA aliases plus custom `qa:hub`, reviewed user-only browser boundary and evidence limits; upstream-sync is a process, not a guarantee of conflict-free updates. |
| Both Spatial Intelligence summaries | Cite exact titles/author/dates below. Separate historical author claims from current-pin source-verified capabilities, especially general “real data”, launch reconstruction estimates, hurricane replay, Miami incident reconstruction, Nepal imagery and proprietary Astra/WorldFX. User editorial comparison remains required before committing milestone 2. |



## Proposed upstream-document admission at the adopted pin

These are planning selections, not a created `content/library.json`. All seven current files are byte-identical to the adopted upstream blobs. The 25 proposed slices contain 441 source lines; the review independently rechecked every file/range hash. Only three selected slices changed versus the old pin: README Street Level, the DATA_SOURCES live-source table, and SECURITY credential roles. Whole-file changes outside admitted slices are not silently admitted.

Range hashes cover exact UTF-8 bytes with original line endings/newlines; lines are inclusive. Each end heading is excluded, and occurrence numbers refer to exact full heading lines. `EOF` means through the final byte. A changed/missing selected heading or range hash requires review and must fail the explicit check and both production builds. During development it becomes a Library-only data error. Full-file hashes and pin identify provenance; unselected sections are excluded from rendering and search.

Media-free slices exclude README captures and the CURRENT-STATE historical dump. In particular, the historical “Not Currently in Runtime” weather-radar claim is stale relative to the actual layer catalog and is not admitted. Preserve current-source precedence, dataset carve-outs, the existing root MIT license/notices, and the operational-use disclaimer. Do not download/embed media or infer dataset rights from the code license.


### `README.md`

[Pinned original](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/README.md). Git blob `12b0705e3a8b7e8b368eba379f16bae376dc8912`; full-file SHA-256 `71dcf820eaf5f38d0891818d7e7775b637f2832cd9e578b6e26bcde282bc3289`.

| Start heading and occurrence | Exclusive end heading and occurrence | Inclusive lines | Range SHA-256 | Changed |
| --- | --- | --- | --- | --- |

| ## 🌍 Why This Exists (#1) | ## 🎛️ What This Thing Does (#1) | 41–56 | `e405c7febda4942332596da68a42536ad818d51580e8cde8857cb87458fa69b0` | No |

| ## 📷 Street Level (#1) | ## 🎖️ Field Missions (#1) | 422–431 | `21175d2fcc5288b3407944e26f18ddd870c03eb6b94028276e92d20a620723d5` | Yes |

| ## 📋 Responsible & Open (#1) | ## 🧭 What's Next (#1) | 627–649 | `745f4992edffdc8908bea1685ca4fc1c9af906489a91083b04f6fcdb96c926ac` | No |


### `docs/CURRENT-STATE.md`

[Pinned original](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/docs/CURRENT-STATE.md). Git blob `7d3ff3ac7af5bbb97581f825c1d81ec71298cb62`; full-file SHA-256 `420279fd1ef76614e87bfd68f8e12490d1b0fbf90b07bda8fa5887d0528a592e`.

| Start heading and occurrence | Exclusive end heading and occurrence | Inclusive lines | Range SHA-256 | Changed |
| --- | --- | --- | --- | --- |

| ## Canonical Docs Order (#1) | ## Current Baseline (#1) | 3435–3444 | `debdeb999c158c0af1cc70fd7e5b981cb94d5b2f185818c15d91a9bad0e28bb4` | No |

| ## Current Baseline (#1) | ## Runtime Stack (#1) | 3445–3450 | `9e42c86b2bbd98df94049f692986dbaf7baefcb056358c9b129ceefd143d3fbf` | No |

| ### Recent Imagery (September 2026) (#1) | ### 3D Aircraft + Tracking (June 2026) (#1) | 4992–5010 | `be752df08d357098a6dd75e77fe0866d72361fe0d9f9c359cd2b9b8653babf8d` | No |

| ## Maintenance Rule (#1) | ## Dependency security baseline (#1) | 5569–5572 | `a96873384dbce8d66f61350d83a6aedd7deb0fbc491ddb16ba003765aeefc8bd` | No |


### `DATA_SOURCES.md`

[Pinned original](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md). Git blob `61b971b714f9a3587cb1b9e70bd2f07afa6ad660`; full-file SHA-256 `fc18b241756d3b029c2c521de1fd73b27c0252529037620956f5ce1d4159242c`.

| Start heading and occurrence | Exclusive end heading and occurrence | Inclusive lines | Range SHA-256 | Changed |
| --- | --- | --- | --- | --- |

| # Data Sources & Attribution (#1) | ## Live sources (fetched at runtime — not stored in this repo) (#1) | 1–13 | `d022fe7ec0ed00c8c25cdf9a57df094116fdc15776152c51e18a627cdd28d8aa` | No |

| ## Live sources (fetched at runtime — not stored in this repo) (#1) | ### Local receiver input (not fetched from a service) (#1) | 14–100 | `e017d00a7868902c7637be3b06fc4626fe5497203fb705b11a00d4973c693990` | Yes |

| ## Bundled snapshots (#1) | ### ALPR camera mapping (#1) | 192–218 | `8ffbe7a97e814464b0a291945a6de812adb4c3770232246a9975b866d7abddfd` | No |

| ### ALPR camera mapping (#1) | ### CCTV Camera Database (`src/layers/cctv/modelSpecs.js`) (#1) | 219–234 | `54f0dffb7ed840d9e280423bcf650763e8e6a38791ef941aed8149a6e888d6fa` | No |

| ### NASA FIRMS acknowledgement (#1) | ### Natural Earth physical regions (`natural_earth/`) (#1) | 250–260 | `7737f87a3f94799e999297e412797b9819eb1c178dc90cf4fc66c7097b62f4bc` | No |

| ### Weather: NHC/CPHC cyclone advisories (#1) | ### Weather: observed lightning density (#1) | 388–402 | `bbf5eb459fd85a6650d0ffd00f6b7585af57758e38e40fd4f8f8501e82d69939` | No |

| ## In-app attribution (#1) | EOF | 434–436 | `49fb1b2246ccc43f6efea29e33a37b4d0373183802cce0f9f0e9e61fcc866d0a` | No |


### `SECURITY.md`

[Pinned original](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/SECURITY.md). Git blob `30203ed941c1cfc65b9b6040c5e106fe042da204`; full-file SHA-256 `44be7e36c892af9311d8702f5574ebeff5bbca1843a6d0cf3202af2e68b3423f`.

| Start heading and occurrence | Exclusive end heading and occurrence | Inclusive lines | Range SHA-256 | Changed |
| --- | --- | --- | --- | --- |

| ## Reporting a vulnerability (#1) | ## How secrets are handled (#1) | 5–13 | `43577e1f7713407e5a7dab8e0c98b10475f8056d2517aec3b42e9657d1b3703f` | No |

| ## How secrets are handled (#1) | ### Configuring separate Google keys locally (#1) | 14–49 | `064d431dc0c0512fb0ef602cb4156578a24753deb26c3ab551e4a9453372eda4` | Yes |

| ## Scope & expectations (#1) | ## Responsible use (#1) | 121–126 | `c32d93fc57b878efb0658488035db4a34c00a214b3512d7878cc58e21e813d8b` | No |

| ## Responsible use (#1) | EOF | 127–129 | `73b61b70d58299f1ba0fc14e93ffc89c5068ad197ea5ba6bd1cda225661715eb` | No |


### `CONTRIBUTING.md`

[Pinned original](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/CONTRIBUTING.md). Git blob `442b9c1bf0bb9d0901eb70e715fdc6c5accae55b`; full-file SHA-256 `0fa5e6749f93a6decb05c25565c71bb155de72903ce1cee524a2e967d9d23833`.

| Start heading and occurrence | Exclusive end heading and occurrence | Inclusive lines | Range SHA-256 | Changed |
| --- | --- | --- | --- | --- |

| ## Coding style (#1) | ## Pull requests (#1) | 124–148 | `c160f98bfc5cf4ff1e512c36e065e36b0f8e0b193ae45bfc62e1ed171934a785` | No |

| ## Pull requests (#1) | ## Maintainers (#1) | 149–156 | `dac11df3a14921ed213d20f4aed01f08ea65fddff3cb59c252d94c7c2ca972d8` | No |

| ## Maintainers (#1) | ## Ground rules (#1) | 157–163 | `9439e901c5cc20e66155aa84eb96971b669c3e2e0a004232119b209856485f1b` | No |

| ## Ground rules (#1) | EOF | 164–169 | `bc7c1151f35fa1ab3ca01a4e9198032abbce697175e12e9bec5b018314099eb1` | No |


### `TESTING.md`

[Pinned original](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/TESTING.md). Git blob `19cff9fed0e3b9a800a59250dedb180b8f7dc321`; full-file SHA-256 `43a166e3e27d66f6226c8363fd91bb5364854d32795259a3bb880902e3ee7e22`.

| Start heading and occurrence | Exclusive end heading and occurrence | Inclusive lines | Range SHA-256 | Changed |
| --- | --- | --- | --- | --- |

| # God's Eye View — Testing Guide (voice map-annotation whiteboard + live tracking) (#1) | ## Focus/horizon moving evidence (#1) | 1–12 | `f8f91b9174545493e08eec262b5f731bff58b7e2fcb8ed4843740bc65cc525ff` | No |

| ## Browser harness renderers (#1) | EOF | 235–256 | `94e4b4a7ecb12468b3417206881d332a1422c6ca6a9aaab4e0409600712a0b4e` | No |


### `THIRD_PARTY_NOTICES.md`

[Pinned original](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/THIRD_PARTY_NOTICES.md). Git blob `ac186c25beff8fcb8e8bf9593604a07d05ec458e`; full-file SHA-256 `785419169c062ab4ec00ecbdf5e4c5a28dc94b3067ece5132dfed4b23960a614`.

| Start heading and occurrence | Exclusive end heading and occurrence | Inclusive lines | Range SHA-256 | Changed |
| --- | --- | --- | --- | --- |

| # Third-party software notices (#1) | EOF | 1–47 | `785419169c062ab4ec00ecbdf5e4c5a28dc94b3067ece5132dfed4b23960a614` | No |


### External article provenance; no draft content

Both primary Spatial Intelligence pages were accessible on October 20, 2026. Only title, author, date and access metadata were retained, not their bodies, comments, transcripts or media. Future summaries must be original, linked and explicit about article claims versus locally verified features. The user will compare both summaries to the originals before the milestone 2 commit.

| Primary page | Author | Publication date |
| --- | --- | --- |

| [God’s Eye View Blew Up. Then Astra Showed Up.](https://www.spatialintelligence.ai/p/gods-eye-view-blew-up-then-astra) | Bilawal Sidhu | 2026-09-19 |

| [I Open Sourced God’s Eye View](https://www.spatialintelligence.ai/p/i-open-sourced-gods-eye-view) | Bilawal Sidhu | 2026-08-25 |


## Ajv (a)/(b) comparison and dependency review

The following evidence comes from an isolated, ignored fixture, not Library implementation. No project manifest, lockfile, dependency tree, configuration or browser state was changed by the measurements.

## Candidate version and license review

Official npm registry `/<package>/latest` metadata was retrieved before the fixture install. Exact candidates: `react-markdown@10.1.0`, `remark-gfm@4.0.1`, `unified@11.0.5`, `remark-parse@11.0.0`, `minisearch@7.2.0`, and `ajv@8.20.0`. All six direct packages declare MIT and no `preinstall`/`install`/`postinstall` scripts. No package declares an engines restriction in this metadata. React Markdown peers are React >=18 and @types/react >=18; installed shipping React 19.3.1 / types 19.3.0 meet those declared ranges. This does not substitute for milestone 1 integration/typing/rendering review or the other five packages' full transitive audit.

Only `ajv@8.20.0` was installed into the fresh ignored fixture, using Node 24.22.0/npm 11.19.1, `--ignore-scripts`, and an isolated npm cache. Resolved transitive graph: fast-uri 3.1.9 (BSD-3-Clause), fast-deep-equal 3.1.3, json-schema-traverse 1.0.0, require-from-string 2.0.2 (the last three MIT). No installed package has an install lifecycle hook; npm install reported zero vulnerabilities. Ajv is not currently installed in shipping `node_modules`; only the ignored fixture contains it. Review metadata includes exact package integrity and tarball URLs in `ajv-measurement/package-review.json`; fixture package-lock preserves the isolated resolution.

## Measured payloads

Toolchain was the already installed shipping Vite 6.4.3 and esbuild 0.25.12. `configFile:false` means no root config/provider initialization. Production builds use Vite's default target, esbuild minification, one unchanged dynamic-import entry, and separately emitted lazy chunks. Compression is each output JS chunk independently using gzip level 9 and Brotli quality 11. No source maps are included. Bytes below are exact bytes, not KiB. Schemas are clearly synthetic test fixtures with bounded sources/products/value bindings and library items, not Phase 2a authored schemas or content. Combined schema JSON is 3,738 raw / 750 gzip / 618 Brotli bytes.

| Fixture lazy payload | Raw | gzip | Brotli | Delta over baseline raw / gzip / Brotli |
| --- | ---: | ---: | ---: | --- |
| Baseline (no validation) | 87 | 102 | 86 | 0 / 0 / 0 |
| (a) normalized-error formatter only | 353 | 267 | 212 | 266 / 165 / 126 |
| (b) Ajv compiler + formatter, excluding fixture schemas | 126,311 | 39,693 | 34,777 | 126,224 / 39,591 / 34,691 |
| (b) Ajv compiler + formatter + two fixture schemas | 129,595 | 40,366 | 35,374 | 129,508 / 40,264 / 35,288 |
| (b) DEV-guarded Ajv: production output | 87 | 102 | 86 | 0 / 0 / 0 |

Each entry is 1,239 raw bytes with no Ajv imports in its module list; gzip varies 725–727 and Brotli 616–618 because of dynamic chunk hashes. DEV-only variant is identical to baseline including compression (1,239 / 727 / 616). The DEV-only production output contains no Ajv module or validator chunk. Keeping a compiler in production is an unnecessary upper-bound comparison, not the recommended design.

Actual Vite development dependency optimization was also run without a listening server: `resolveConfig` with command `serve`, development defaults, `configFile:false`, `envFile:false`, no discovery, `optimizeDeps.include:['ajv']`, isolated cache, then `optimizeDeps(..., true, true)`. It emits one `ajv.js`: **269,412 raw / 50,631 gzip / 42,829 Brotli bytes**. This is the actual compiler dependency prebundle, excluding source maps, schema text and a future Library adapter. It is not a browser Network trace or a claim that dev HTTP compression is enabled. An unminified same-esbuild browser bundle including the representative schemas/formatter is 275,541 / 52,072 / 44,060 bytes; that is a normalized payload comparison, not exact optimizer output.

The formatter is intentionally small: known keyword codes and a fixed message, no raw `params`, data, schema, arbitrary error text, absolute paths or credential-like values. Both synthetic schemas compile in strict draft-07 mode; valid empty registries/manifests pass; wrong version and additional fields fail, all errors are collected, and a test-only sensitive sentinel never appears in normalized results. These sanity checks ran only in Node. This does not prove a future UI's performance, HMR or containment; those are implementation acceptance gates.

## (a) Server-side development validation, normalized errors only

Ajv remains a devDependency and runs in Node for explicit checks, both production preflights/build hook and deferred dev validation. A proper `build/libraryDevValidation.js` Vite plugin would register a fixed same-origin GET-only non-provider endpoint (for example `/__custom/library/validation`) after the existing host/security plugin prefix. It would send only state, corpus revision and normalized Library errors, never source bodies, raw exceptions, schema source, absolute paths or env values. Browser data delivery remains the existing planned inert local-text loader. No browser Ajv is needed: zero Ajv bytes in globe, initial hub or lazy Library graphs; the measured 266/165/126-byte helper delta excludes a future endpoint client, which is not implemented or measured here.

No file reads/compilation may run during config-module evaluation or throw from server startup. Validation starts on Library requests or a contained, debounced watcher after startup. Cache by content/schema revision; coalesce concurrent validations. Every read/parse/compile exception yields an error DTO while leaving the server and globe running. Watch add/change/unlink, invalidate once, discard stale in-flight revisions, and unregister listeners/clear timers on restart/close. Missing/stale endpoint, timeout or inconsistent revision means Library unavailable/error with bounded retry, never valid content. Production has no endpoint requirement because strict Node validation already gates the built corpus.

**Scope constraint:** the actual original-upstream `src/tooling/viteBuild.test.mjs` currently permits only `@tailwindcss/` names after the preserved upstream top-level plugin prefix. A real custom dev plugin cannot honestly fit that test unchanged. Do not masquerade as Tailwind or attach middleware to an upstream plugin. This choice requires an explicit third-original-file amendment to that test, allowing exactly the custom plugin and testing lifecycle/security; it conflicts with the currently approved two-file upstream allowlist until reviewed.

Exact delta from the proposed 63-path inventory (62 original + pending generated projection): add NEW `build/libraryDevValidation.js`, add EDIT original-upstream `src/tooling/viteBuild.test.mjs`; reassign already planned `build/customHub.js` to register the dev plugin as well as the build-only Rollup hook; use already planned `hub/src/library/catalog.ts` for the bounded client and `src/custom/library/content.test.mjs` for endpoint/lifecycle/error tests. Total would be **65 paths / three original-upstream files**. A custom launcher could instead add `scripts/dev-custom-hub.mjs` and change the package `dev` script (64 paths / two upstream), but direct root/API launches would bypass it; this introduces launch/lifecycle inconsistency and is not recommended.

## (b) Lazy browser Ajv for development only — recommended for review

Keep Ajv as a devDependency, amend its role from Node-only to Node plus **development Library only**. Use `import.meta.env.DEV` around the lazy `import('ajv')` inside the already lazy Library catalog loader. Node full validation remains authoritative for `check:library`, both build commands and build-only Rollup hook. Production does not need a compiler for already validated bundled content. Confirm the production build graph contains no Ajv, schemas/validator runtime or dev validation code in any globe/hub/Library chunk. This preserves the two-file upstream allowlist and keeps the pending inventory at **63 paths**, with no additional path beyond the proposed generated metadata projection.

Exact responsibility changes within existing planned paths: `hub/src/library/catalog.ts` owns bounded raw-text parse/schema compile/validation and Library-only errors in development; `build/libraryValidation.js` retains deferred strict Node filesystem/reference/projection validation; `build/customHub.js` adds `ajv` to the existing root hub `optimizeDeps.include` so the dev compiler is ready before first Library navigation (the compiled dependency is not fetched until its lazy import). Existing `src/custom/library/content.test.mjs`, `rendering.test.mjs`, `rawImportTestAdapter.mjs` and `scripts/qa-custom-hub.mjs` cover the acceptance cases. Neither the top-level Vite plugin tail nor the original tooling test changes.

Do not directly import editable JSON as JSON modules or statically require every authored path: malformed JSON or missing imports could fail Vite transforms and show a global overlay. Discover only fixed/allowlisted schema, manifest and admitted content paths as inert `?raw` text using glob lookup. An empty/missing match is data that the Library can report. Parse and compile inside a caught load operation, never at module scope. The self-accepting catalog HMR boundary clears old schema/loader caches and refreshes only mounted Library state; add/change/unlink, invalid schema JSON, missing schema/content and restoration must be tested to prove no global overlay or globe reload. These are proposed gates, not proven by this fixture. If that containment fails, revisit the design rather than weaken the requirement.

Cache compiled validators per schema revision, not repeatedly per render. Invalidate compiled functions when schema text changes; reject stale content revisions and clear partial indexes. Display an accessible Library alert with safe file IDs and fixed error text; keep Dashboard/Settings usable and the globe on its last validated generated metadata. This uses no dev validation endpoint and has no server-close watcher/timer lifecycle to maintain; Vite manages the raw module graph/HMR lifecycle. Production reads only its checked corpus and works without a dev endpoint.

Both designs need the same full JSON Schema checks. Browser validation additionally needs pure cross-reference/ID/source logic; Node alone checks realpath containment, symlinks, admitted-file bytes/sections/hashes and stale projection. Browser cannot inspect the filesystem and must never claim those checks. A syntactically valid browser corpus is not a substitute for passing the explicit Node/build gates.

## Security, cost and acceptance limits

Ajv runtime compilation uses dynamic code (`new Function`); existing `BROWSER_CSP` already permits `unsafe-eval`. Preserve the current CSP exactly; no policy relaxation is approved. The dev-only recommendation keeps that compiler out of production even though existing globe dependencies retain the policy. Use only locally authored, reviewed schemas, no remote schema loading/compileAsync, custom executable keywords or downloaded schema definitions. Disable Ajv logging; catch exceptions and expose fixed error categories only. Keep `verbose:false`, coercion/default insertion/additional-field removal disabled, and `ownProperties:true`.

Use file-byte limits before parse/compile, bounded arrays/strings, reviewed non-pathological regex patterns and a maximum displayed error count. `allErrors:true` was measured for bounded local authoring diagnostics; Ajv explicitly discourages it for untrusted production requests. Both production Node checks can fail fast. No validator endpoint should accept arbitrary documents or schemas. URL/path/published-reference policy remains an explicit semantic check, not an inferred benefit of Ajv.

Milestone 1 must prove malformed JSON, invalid schema definitions/unknown schema keywords, missing file/section, dangling reference, path escape, stale metadata projection and source-ID mismatch fail `check:library` and both production commands. The same edits in dev must leave the listener/globe/other hub routes usable and show accessible Library-only errors, then recover after restoration. Run the existing plugin-prefix/security/boundary tests unchanged for (b), verify last-good globe metadata and zero provider requests from Library, inspect final chunk graphs and remeasure the actual implementation/corpus. The fixture numbers do not include Markdown, MiniSearch, full source corpus, UI, network latency, parse/compile time or rendered browser performance.

## Primary references

- [Official Ajv options](https://ajv.js.org/options.html): strict errors, logging, verbose data, allErrors and remote-load options.
- [Ajv security considerations](https://ajv.js.org/security.html): schema trust, bounded inputs, patterns, allErrors and CSP.
- [Ajv schema lifecycle](https://ajv.js.org/guide/managing-schemas.html): compile once and invalidate/cache deliberately.
- [Ajv execution environments](https://ajv.js.org/guide/environments.html): Node/browser/CJS/ESM and compiler versus standalone choices.
- [Installed Vite 6.4.3 plugin API source](https://raw.githubusercontent.com/vitejs/vite/v6.4.3/docs/guide/api-plugin.md): configureServer ordering, lifecycle and HMR hooks. This version-pinned documentation was used instead of latest Vite's Rolldown-oriented page.
- [Installed Vite 6.4.3 env constants source](https://raw.githubusercontent.com/vitejs/vite/v6.4.3/docs/guide/env-and-mode.md): DEV constants are replaced for production tree shaking.
- Package metadata is from the official npm registry; direct exact-version/metadata/integrity URLs are recorded in `ajv-measurement/package-review.json`.


## Exact implementation inventory for recommended option (b)

This is the 62-path approved inventory plus the proposed generated projection: **2 original-upstream files + 15 existing project-owned files + 46 new project-owned files = 63**. The review/report files updated at this planning checkpoint are not new application implementation paths. No additional UI component, endpoint, source adapter, recorder, dashboard service, media file or dependency is proposed.

Original-upstream edits:

```text
package.json
package-lock.json
```

Existing project-owned edits:

```text
build/customHub.js
hub/src/App.tsx
hub/src/router.js
hub/src/components/HubShell.tsx
hub/src/pages/Library.tsx
hub/src/pages/SourceGuide.tsx
hub/src/styles.css
src/custom/shared/layerMetadata.js
src/custom/hub/router.test.mjs
src/custom/globe/feedStrip.test.mjs
scripts/qa-custom-hub.mjs
AGENTS.md
CUSTOMIZATION.md
STATUS.md
SETUP.md
```

New project-owned files, including the proposed projection:

```text
content/sources.json
content/sources.schema.json
content/library.json
content/library.schema.json
content/knowledge/project-background.md
content/knowledge/first-five-minutes.md
content/knowledge/understanding-data-labels.md
content/knowledge/layers-and-coverage.md
content/knowledge/keys-and-costs.md
content/knowledge/gis-geoint-fundamentals.md
content/knowledge/development-and-updates.md
content/knowledge/gods-eye-view-blew-up-then-astra-summary.md
content/knowledge/i-open-sourced-gods-eye-view-summary.md
content/cases/nepal-flood.md
content/cases/hurricane-tracking.md
content/cases/launch-reconstruction.md
content/cases/aircraft-incidents.md
content/cases/satellite-imagery-change.md
content/cases/ai-reconstruction-demonstrations.md
build/libraryValidation.js
scripts/check-custom-library.mjs
hub/src/vite-env.d.ts
hub/src/library/types.ts
hub/src/library/catalog.ts
hub/src/library/upstreamDocuments.ts
hub/src/library/markdown.ts
hub/src/library/links.ts
hub/src/library/search.ts
hub/src/components/library/ArticleRenderer.tsx
hub/src/components/library/LibraryNavigation.tsx
hub/src/components/library/SourceRecord.tsx
hub/src/components/library/SearchResults.tsx
hub/src/pages/KnowledgeCenter.tsx
hub/src/pages/KnowledgeArticle.tsx
hub/src/pages/CaseStudies.tsx
hub/src/pages/CaseStudy.tsx
hub/src/pages/DataSources.tsx
hub/src/pages/LibrarySearch.tsx
src/custom/library/registry.test.mjs
src/custom/library/content.test.mjs
src/custom/library/rendering.test.mjs
src/custom/library/search.test.mjs
src/custom/library/rawImportTestAdapter.mjs
docs/custom/PHASE-2A-DEPENDENCIES.md
docs/custom/PHASE-2A-VALIDATION.md
src/custom/shared/sourceRegistry.generated.js
```


## Reverified milestone and acceptance gates

**Before milestone 1:** user reviews this report and resolves the projection/Ajv-role amendments; implementation remains explicitly unapproved for this turn. Refresh exact dependency/license/transitive review at implementation time and record it in the already-planned `PHASE-2A-DEPENDENCIES.md`. Use the frozen pin, not moving upstream/main. Restore normal HMR before testing editing behavior.

1. **Registry/directory:** cover all 32 layer identities, 11 safe setup IDs, conditional product credentials, and 38 legacy guides without changing public metadata API shapes. Keep source products, umbrella guides, observation kinds and health separate. `Not checked in Library` replaces promises of current feed health. Generate the proposed validated metadata projection deterministically; reject stale projection in checks/builds. Show exactly two original-upstream diffs. Do not add an acquisition owner, provider request or live status summary.
2. **Knowledge Center:** admit only the exact reviewed files/sections and preserved notices; author all nine original articles with source links. Measure the real corpus/search/Markdown bundle rather than extrapolating from the Ajv fixture. **Stop before committing:** list every new article and reference, explicitly flag both Spatial Intelligence originals, and wait for the user's editorial review.
3. **Cases:** publish all six planned original case pages with the limitations above; prove each CTA's actual restored v2 state using the permitted browser path. A geographic view is not a mission, Director shot, historical replay or incident reconstruction. **Stop before committing:** list every new case page, sources, limitations and CTA scope for the user's review.
4. **Validation/acceptance:** clean install, `check:library`, hub typecheck, allocation-gated tests, import/package boundaries, formatting, doctor, both production builds, graph inspection and actual browser coverage. `qa:hub` remains user-run. Stop for user acceptance at the end; no Phase 2b implementation or planning is introduced.

For both validation designs, meaningful negative cases include malformed schema/content JSON, invalid schema definitions/unknown keywords, missing/deleted/restored admitted files or sections, unsafe links/path traversal/symlink escape, dangling IDs, stale projected metadata, and asynchronous load/render failures. Every invalid case must fail `check:library`, `npm run build` and `npm run build:panel`, while normal development remains listening and the globe, Dashboard and Settings stay usable. Library alone shows an accessible normalized error state. Restore inputs and prove recovery without a global Vite error overlay or unrelated globe reload; do not globally disable overlays to hide validation failures.

Option (b)'s lazy catalog must be a real HMR boundary, use inert allowlisted raw-text discovery, invalidate compiled validators/indexes by schema/content revision, and handle add/change/unlink. The browser cannot prove filesystem realpath containment; Node validation remains authoritative for that. Pre-include Ajv in the existing custom optimizer configuration before startup to avoid discovery-triggered mid-session optimization, without importing it into the globe or eager hub graph. Require a final production chunk-graph check proving that the DEV-only compiler is absent, not merely unreferenced in UI. The current HMR-off tracking workaround cannot satisfy any of these HMR acceptance gates.

## Retained evidence and current stop

- Rehearsal: `/Users/getumwanna/.codex/worktrees/upstream-sync-rehearsal/GEV/.gev-logs/`, retained in full; checksum inventory `.gev-logs/post-pin-review/rehearsal-log-retention.json`.
- Shipping UI receipt and interrupted transcript remain under `.gev-logs/`; the final 109/0/0 is explicitly user-reported, not a fabricated transcript.
- Review notes and exact doc-admission JSON: `.gev-logs/post-pin-review/{source-reverification.md,doc-admission.md,doc-admission.json}`.
- Ajv metadata, isolated package lock, scripts, schemas, chunks, optimizer output and JSON results: `.gev-logs/post-pin-review/ajv-measurement/`, with `ajv-comparison.md` and `ajv-comparison.json` beside it. These schemas are synthetic measurement fixtures, not proposed production content.

**Stop: review only.** No `content/` tree, generated metadata projection, Library feature, production dependency change or milestone 1 commit was created. The two pending amendments are the proposed generated projection and the development-only browser execution role for Ajv. Phase 2b remains deferred.

## Approval update: normal-HMR tracking before milestone 1

The user reviewed and approved the generated projection (63 paths), Ajv option(b) as a devDependency with DEV-only lazy Library validation and authoritative Node check/build validation, and this report's pin facts/doc admissions with hashes/case/article requirements. Earlier pending-amendment wording is the historical review proposal, now accepted. No new application file has been created yet.

The user requires a normal-HMR shipping tracking pass before implementation. Root 4173 is being restored through the standard CLI without an HMR override. The temporary HMR-off mode had suppressed Vite reload delivery so the earlier reported 109/0/0 could complete; it did not fix a demonstrated product/harness defect or establish normal-HMR reliability.

The interrupted 88-pass run ended in context destruction at `scripts/track-regression.mjs:3231` during `page.evaluate`, with no planned navigation there. Preserved normal-mode logs show 15 source reload messages, including three at 15:33:10 corresponding to metadata-change timestamps despite unchanged mtimes/content. This makes a dev-server reload interruption the leading explanation. The external metadata writer and exact browser navigation were not recorded, so a conclusive causal claim would exceed the evidence. Normal-mode rerun logs will be retained in `.gev-logs/normal-hmr-2026-10-20.3KpYkt/` and correlated if it fails.

Once normal tracking passes, milestone 1 onward is authorized under the accepted inventory and gates. If it fails, diagnose first. If Library HMR containment later fails its acceptance tests, stop and report; do not weaken it, turn off HMR, disable global overlays or move validation into dev startup to obtain a pass. All other scope/rights/security/editorial boundaries remain.

## Normal mode restored; user-run prerequisite commands

Standard root `HOST=localhost PORT=4173 npm run dev -- --strictPort` is running on `[::1]:4173`, PID 78207. The same-mode resolved configuration has `server.hmr:true` and both camera packs OFF. 76 HTTP-only requests pass with stable finalized metadata; 4174 remains stopped. Logs/configuration/check result are retained under `.gev-logs/normal-hmr-2026-10-20.3KpYkt/`. No product or harness code was changed and no browser harness was run by the agent. All documentation work is complete before handing off the rerun.

Run from shipping; `mktemp` keeps each attempt in a separate retained log:

```sh
cd /Users/getumwanna/Documents/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0
gev_track_log=$(mktemp .gev-logs/normal-hmr-2026-10-20.3KpYkt/test-track.XXXXXX)
set -o pipefail
npm run test:track -- --url http://localhost:4173 --offline-imagery 2>&1 | tee "$gev_track_log"
```

Await the full final tracking summary. If it fails, correlate this log and the normal server log before starting milestone 1. If it passes, the user's conditional implementation approval applies; all 63 paths/two-upstream-file limits, strict validation/HMR containment requirements and milestone 2/3 editorial stops remain.

## Approved M2 containment amendment — October 21

The user explicitly approved adding only `src/tooling/viteBuild.test.mjs` to the Phase 2a original-upstream allowlist (63→64 implementation paths). Earlier two-file/63-path wording is historical. The three permitted original-upstream files are now `package.json`, `package-lock.json`, and that test. No additional dependency, content admission, or application path is authorized by the amendment.

Ajv option (b) remains selected: DEV-only lazy Library browser validation and authoritative Node check/build validation. A narrowly admitted serve-only HMR transport in existing project-owned `build/customHub.js` handles the exact 26 public inputs without parsing content, adding an endpoint, or suppressing reload delivery globally. The amended upstream test preserves the standalone plugin prefix and security checks and asserts the hook's exact name/shape. Strict HMR containment and article approval remain unchanged; M2 commit/M3 are held pending repaired verification.
