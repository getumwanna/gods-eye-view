# Phase 2b – I1: Free Recent Imagery

## Adopted PU safety calibration — October 25, 2026

The user reported CDSE monthly limits of 10,000 requests and 10,000 PU, reset
November 1. GEV retains **8,000 requests AND 8,000 PU**, plus its existing
120 requests / 120 PU per minute scheduler limits. No provider calls were
authorized for this reconciliation.

Matched October 23 usage is 80 requests / 81.95134765625 local PU versus the
dashboard's 80 / 97. The previous 81-request receipt included October 22's
failed 1 request / 0.01 PU reservation. The 18.3629% excess cannot be explained
by ordinary daily-total rounding. Historical remaining-quota headers were not
retained; the precise charging cause remains unresolved. CDSE's documented
0.005 PU Process minimum and excluded dataMask band do not explain it.

The user authorized a conservative correction: **multiply model PU by 1.25**
before dispatch, including retries/unknown outcomes, monthly admission and
rolling-minute pacing. This is an empirical safety allowance, not a verified
provider formula or an account-wide guarantee. A larger numeric spending header
tops up the reservation; a smaller or missing one never refunds it. Warm cache
reuse remains zero. Version 2 stores the factor; locked legacy migration scales
the current month and events once without resetting request/OAuth counts,
changing cached imagery or rewriting historical receipts. Passive status reads
project legacy values without writing storage.

The following replaces earlier capacity allowances. It scales the retained
three-date measurements; there was no new acquisition, changed box or reduced
resolution. Each session includes Catalog, visible previews and native grids.

| Case | Cold requests / calibrated PU | Cold sessions/month | With one measured scroll: requests / calibrated PU | Sessions/month with scroll |
| --- | ---: | ---: | ---: | ---: |
| Typical 1,000 × 800 | 8 / 11.7081 | 683 | 10 / 11.8338 | 676 |
| Heavy 2,040 × 2,040 | 7 / 59.7790 | 133 | 10 / 60.0134 | 133 |
| Oversized 2,500 × 800, clipped chunks | 35 / 28.7228 | 228 | 38 / 28.7979 | 210 |

Capacity is `floor(min(8000 / requests, 8000 / calibrated PU))`; extra cards,
retries and other clients reduce usable capacity. The migration preserved the
current ledger's 98 requests / 7 OAuth attempts and scaled 115.7956 PU to
144.7445. There is no matching local interval for the user's 86/108 export;
failed/unknown reservations are retained, and 11 of the 12 excess local requests
remain unclassified beyond the known October 22 failure. Do not replace local
counts with that export. Full evidence and qualifications:
`.gev-logs/phase2b-i1/quota-reconciliation-zqgSfz/REPORT.md` and
`docs/custom/FREE-IMAGERY-VALIDATION.md`. The 50-path scope is unchanged; final
visual review/explicit I1 acceptance and other Phase 2b boundaries remain.

[CDSE PU accounting](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Overview/ProcessingUnit.html)

Decision record and file-level plan, October 21, 2026.

**Historical authorization checkpoint — October 21, 2026:** Phase 2a M3/M4 and final
Phase 2a acceptance are complete. This I1 plan remains approved as documentation
only; implementation is **deferred until the user's separate explicit go-ahead**.
The 47-path inventory, quota/request model, scope and acceptance gates are unchanged.
No account, credentials, runtime code, dependencies or upstream edits are authorized
by recording Phase 2a acceptance. Other Phase 2b work stays deferred.

## Implementation go-ahead and count amendment — October 22, 2026

The user explicitly approved I1 implementation under the original 47-path plan,
free data only, with all other Phase 2b work deferred. Phase 2a is accepted. No
paid provider, trial/card requirement, dependency, NAIP or Earth Search addition
is approved. The user reports the account verified and credentials saved locally;
passive local configuration presence is verified, not provider authentication.

The reviewed inventory is 150 products / 39 guides. The user explicitly approved
adding only `src/custom/library/registry.test.mjs`,
`src/custom/library/rendering.test.mjs` and `src/custom/library/search.test.mjs`:
**47→50 paths**, with the **23 original-upstream paths unchanged**. Only the
reviewed exact-count changes are applied: two guide counts 38→39 and one product
count 149→150. No assertion or acceptance gate is weakened. The complete Node 24
unit/allocation runner now passes **8,377 / 0 failed / 1 Windows-only skip**.
Earlier failures remain retained. User QA, CDSE authentication/rendering and
measurements, and final I1 acceptance remain pending.

## Historical authorization and sequence

The user approved this plan and its QA-file amendment, expressly authorizing
documentation updates now. Implementation still requires both Phase 2a closeout
and a separate user go-ahead. The approved future inventory is 47 paths.
Keep this document separate from M3: commit only this plan as a docs-only commit
immediately after the verified M3 commit, before the unchanged M4 checkpoint.
Do not stage or commit it while M3 checks/editorial acceptance are pending.

1. Finish the existing M3 checks and all-six-case editorial review; verify the
   receipts and restoration/server-log evidence, then commit M3.
2. Complete the existing Phase 2a M4 clean-install validation and stop for final
   Phase 2a acceptance. Its scope is unchanged.
3. Open this separately scoped Phase 2b I1 milestone only after that acceptance
   and the user's implementation go-ahead.

Other Phase 2b acquisition/dashboard work remains deferred. I1 authorizes no paid
provider, quote, trial, card-bearing account, paid dependency, hosting, recorder,
commercial imagery, or automatic quota upgrade. Do not create or handle the
user's credentials. Keep 4174 stopped and retain its worktree/logs.

Planning baseline: shipping branch codex/phase-2a-library, M2 HEAD
6bc45033982de7b9a31c7b49f7b5ff2038ad8d9e; frozen original-upstream pin
064d51f7be2675f1c69e16068e9c49d1a60144d1. Initial planning preceded M3. Its accepted implementation is now committed as
dae36cf0de737116615fd9e5efc615be965cd81e. Recheck
the actual post-M4 HEAD before implementing; this document does not advance the pin.

## Selected free access route

Use the Copernicus Data Space Ecosystem (CDSE) General-user Sentinel Hub Catalog
and synchronous Process APIs. Add native-10 m Sentinel-2 L2A RGB alongside HLS;
retain the existing HLS/VIIRS acquisition and rendering defaults.

| Consideration | Anonymous Earth Search/public COGs | CDSE free tier, selected for I1 |
| --- | --- | --- |
| Setup | Public HTTPS COG assets can be read without an AWS account; exclude requester-pays assets. | User creates a free General-user account and server-side OAuth client. Stop if registration requests a card, trial or paid plan. |
| Rendering | Range reads, GeoTIFF decoding, UTM reprojection, RGB/no-data processing and local tile generation are needed. Raw COGs are not rendered XYZ/WMTS images. | Process API supplies PNG output for explicit bounds, CRS, time and dimensions. Prefer one bounded image per assigned date; retain 512-pixel tiles/chunks for oversized boxes. |
| Dependencies | Would require a new raster rendering stack or separately operated tiler. | No new runtime or development dependency is planned. Reuse Node fetch, existing Cesium, canvas and the existing server/plugin infrastructure. |
| Latency | Additional mirror/COG ingestion. Older registry latency wording references OpenHub; it is not a verified current SLA. | Managed catalog/processing path; availability and clear captures are not guaranteed. Record sensing time separately from acquisition/cache times. |
| Budget | No published numeric Earth Search quota was established. A local request/byte guard would not represent provider-wide allowance. | Published General-user limits support a request/PU ledger and rate scheduler. |
| Fit with current GEV | A new raster tile renderer is required; there is no generic local COG renderer today. | New local owner produces bounded PNGs for Cesium single-image A/B layers, with a tiled fallback; existing NASA transport remains separate. |

Primary references:
[AWS public COG registry](https://registry.opendata.aws/sentinel-2-l2a-cogs/),
[Earth Search](https://github.com/Element84/earth-search),
[collection/version notes](https://github.com/Element84/earth-search/blob/main/docs/collections/sentinel-2-l2a.md),
[CDSE L2A processing](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/S2L2A.html),
[OAuth setup](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Overview/Authentication.html).

## Acquisition and source identity

- One local CDSE owner handles token reuse/refresh, bounded catalog requests,
  tile/thumbnail/snapshot acquisition, in-flight coalescing, queueing, cache and
  usage reservations. Read-only usage summaries do not acquire imagery.
- Keep credentials and access tokens server-side. Proposed names are
  CDSE_CLIENT_ID and CDSE_CLIENT_SECRET in the existing gitignored local .env.
  Never use a VITE-prefixed secret, browser-side OAuth client, credential URL,
  export field or token-bearing log. Missing credentials produce a setup message
  and leave NASA sources usable. I1 does not add POWER UP support.
- Browser endpoints accept bounded identifiers, coordinates and output sizes,
  not arbitrary remote URLs or user-supplied scripts. Fix upstream hosts/paths,
  apply existing localhost/Host/origin rules, reject unsafe redirects, and cap
  response bytes, pagination, timeouts and queue length.
- Use native B04/B03/B02 RGB with no claim that screen interpolation creates
  finer source detail. Distinguish sensing timestamp, source/product, native
  resolution, coverage and acquisition health. A focused card or pending request
  is not proof that its imagery is loaded.
- Preserve exact contributing acquisition identities. Do not silently describe a
  multi-scene/day mosaic as one scene or attach one scene's cloud percentage to
  different rendered imagery. Verify catalog-to-Process selection and returned
  metadata during implementation.
- Show scene/tile cloud percentages on day cards, with unknown distinct from 0%.
  An optional max-cloud filter applies to Sentinel-2 only. Explain that scene
  cloud cover is not a measurement for the small selected box. If several scenes
  contribute, retain their separate metadata.
- Keep the existing 30-day Recent Imagery search window. Request 128-pixel
  thumbnails only for cards actually visible; the estimate below assumes three.
  Text/cloud/date metadata comes from the bounded catalog response, without one
  catalog request per card. Fetch further thumbnails only as cards become visible,
  cancel obsolete queued previews, and cache repeat cards. Thumbnail imagery is
  explicitly a reduced preview; it is never the assigned full-resolution drape
  or native-resolution export. Do not fetch full-resolution S2 merely on hover or
  scrolling; explicit image/A/B assignment requests it. Existing NASA preview
  semantics remain unchanged. No background geographic harvesting or prefetch tour.

## Quota, rate limiting and visible fallback

Published CDSE General-user Sentinel Hub limits are 10,000 requests and 10,000 PU
per month, plus 300 requests and 300 PU per minute. Request/PU monthly quotas reset
on the first day of each month; the separate download-transfer window is rolling
30 days. Verify the account's actual limits and reset boundary at I1 setup.
[Official quotas](https://documentation.dataspace.copernicus.eu/Quotas.html)

The approved GEV ceiling is 8,000 requests AND 8,000 PU per provider month.
Reserve both before dispatch using an atomic, restart-persistent ledger. All
callers, including thumbnails and exports, share this owner. Never release an
uncertain consumption reservation merely because a request timed out. Use actual
reported consumption where available; otherwise retain a conservative bound.
An unreadable/corrupt ledger stops new CDSE acquisition with a visible explanation
instead of silently resetting usage. Cache eviction does not reset the ledger.

Proposed initial pacing is at most 120 requests/minute AND 120 reserved PU/minute,
below the documented provider limits, with at most four in-flight requests.
Use a smoothly paced queue rather than a burst. Apply the lower account limit if
one is discovered. Token acquisition has its own bounded retry/reuse policy.
These scheduler settings are implementation defaults, not extra provider quota.

Show Queued/Retrying status during transient throttling. Honor CDSE's documented
millisecond Retry-After value and use bounded jittered exponential backoff.
Cancellation removes stale queued work. Do not repeatedly retry a monthly/local
budget exhaustion as though it were transient. A sustained outage or exhausted
retry window may fall back visibly; an ordinary queued request should not fail
merely because it must wait.
[Rate limiting and caching guidance](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Overview/RateLimiting.html)

The panel counter must say GEV measured/reserved usage, display requests and PU
separately with reset information, warn before the local ceiling, and expose the
source of any pause. OAuth network calls are tracked separately; documentation
does not establish that token calls debit the Sentinel Hub monthly request quota.
Other clients, including Copernicus Browser, can consume the same account's
allowance. Link the official account dashboard; never label the local ledger as
account-wide remaining quota or imply the local guard can observe other clients.

On a usable HLS fallback, show this visible panel notice:

> Sentinel-2 unavailable: showing HLS 30 m, [reason]

Use a specific safe reason, such as missing configuration, monthly safety ceiling,
provider quota, no coverage, or provider unavailable. Preserve the selected box.
Display the actual fallback product/date and credits, not the unavailable S2
selection's identity. If HLS is also unavailable, say so; do not claim fallback
imagery loaded. Missing credentials and quota failure must not stop the globe.

## Request-efficiency decision

Use one bounded synchronous Process PNG per unique assigned acquisition/date as
the default. Reuse it for IMAGE, the independent A/B layers and credited exports.
Cesium SingleTileImageryProvider can drape a geographic image within its rectangle;
layer split/opacity and per-acquisition credits remain owned by the existing
renderer. Preserve the NASA tiled branch.
[Cesium single-image provider](https://cesium.com/learn/cesiumjs/ref-doc/SingleTileImageryProvider.html),
[A/B layer controls](https://cesium.com/learn/cesiumjs/ref-doc/ImageryLayer.html)

Plan a 2,048-pixel maximum per image dimension, stricter than the documented
2,500-pixel Process limit. Compute dimensions from the immutable selected box at
approximately 10 m ground sampling, rounding up conservatively across its latitude
range. Request geographic CRS84/EPSG:4326 output for the geographic drape, not an
unreprojected UTM/Web Mercator PNG. Label the source native resolution as 10 m;
geographic reprojection is not lossless preservation of the native UTM pixel grid.
Never resize an oversized box down to the cap and describe it as 10 m sampling.
The cap corresponds to approximately 20.48 km per side at 10 m, subject to geometry.
[Process limit and native-resolution geometry](https://documentation.dataspace.copernicus.eu/FAQ.html)

When the selected box needs more native-resolution pixels than this cap, use
bounded 512 x 512 tiles/chunks with fixed acquisition identity and resolution.
Clip edge requests to the selected box and pad locally if the provider layout
needs it. Do not enlarge upstream bounds for a padded display cell. Any projection
or rendering constraint requiring this branch must be explicit and tested.
Unsupported polar/antimeridian geometry must produce a clear bounded error or a
correct reviewed tiled path, never a misplaced image or coarser substitute.
There is no need to create a tile pyramid for a normal box that fits one PNG.

An image/request descriptor is fixed by selected box, acquisition identity,
geographic grid, dimensions and render specification. Fit/Restore may not alter
it or trigger a higher-resolution/full-box replacement. The single-image path
keeps the loaded image across camera motion, avoiding Process LOD requests.
The larger-box tiled branch also retains the fixed search/processing extent and
resolution; camera movement does not authorize wider bounds or bigger requests.
Use assignment generations/cancellation so stale asynchronous loads cannot
replace the selected A/B scene or overwrite a fallback.

Changing 256-pixel tiles to 512-pixel tiles reduces requests for equal coverage.
PU is equal only if the number of processed pixels is equal: sixteen aligned
256-square tiles and four aligned 512-square tiles both process 1,048,576 pixels
(4 PU per date in the RGB model). Edge padding can reverse that saving: twenty-five
256-square cells are 6.25 PU, while nine full 512-square cells are 9 PU. These
full-cell examples compare costs, not permission to extend the selected box.
The planned fallback clips edge requests; measure its actual pixel count.

Smaller, visible-only thumbnails lower both calls and PU. Three 128-square
previews cost approximately 0.1875 PU, compared with 3 PU for twelve 256-square
previews. Reduced preview resolution never changes assigned or exported imagery.
[PU calculation](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Overview/ProcessingUnit.html)

At the cap, each 2,048-square RGBA image is about 16 MiB decoded. Two active A/B
images are about 32 MiB decoded, or 64 MiB with one GPU copy, before intermediates.
Budget decoded/GPU/transient allocations, serialize heavy replacement/export
work when needed and dispose obsolete resources/object URLs. Queue/refuse work
that cannot fit the memory policy; do not silently lower the source sampling.
No extra dependency or file beyond the approved 50-path inventory is expected.

## Revised session-capacity estimate, before implementation

Calculated cold-cache scenario, not measured provider usage:

- One catalog page for a selected 10 x 8 km box and at most 30 days.
- Three visible 128 x 128 day-card thumbnails; no hidden-card prefetch.
- The fixed box needs approximately 1,000 x 800 output pixels at 10 m.
  Viewport dimensions, fit zoom and device pixel ratio do not determine or
  silently enlarge the processing request.
- RGB plus exempt dataMask, 8-bit PNG, one sample, simple synchronous processing.
- Two distinct dates when the initial image becomes A and only B is new;
  three distinct dates when the initial image differs from both A and B.
- No extra visible-card scrolling, exports, catalog pages, retries or dates.

Each 1,000 x 800 date image costs approximately 3.0518 PU; the catalog minimum is
0.01 PU. Thumbnails add 0.1875 PU to either case. The comparison includes the old
12-thumbnail estimate as historical planning, not the selected design.

| Cold strategy | Unique dates | Requests | Estimated PU | Complete sessions under both 8,000 ceilings |
| --- | ---: | ---: | ---: | ---: |
| Previous: 25 x 256-square cells/date, 12 large thumbnails | 2 | 63 | 15.5100 | 126 |
| Previous: same, three distinct dates | 3 | 88 | 21.7600 | 90 |
| 512-square full-cell edge example, 3 small previews | 2 | 22 | 18.1975 | 363 |
| Selected: one bounded image/date, reuse the single image as A | 2 | 6 | 6.3010 | 1,269 |
| Selected: single image plus two different A/B dates | 3 | 7 | 9.3528 | 855 |
| Conservative selected-path planning allowance | Up to 3 | 10 | 12.0000 | 666 |

The selected design switches the modeled binding limit from requests to PU.
Use approximately 660 cold sessions/month for conservative planning, replacing
the earlier 80-session figure. The theoretical counts are floors of the smaller
of 8,000/requests and 8,000/PU; calculate using unrounded PU values. OAuth remains
separate network traffic, not a proven Sentinel Hub quota charge.

This is not a promise for every box. Three images at the 2,048-square cap already
cost about 48 PU before previews/catalog, or roughly 166 sessions before other
work. Larger tiled boxes, more dates/cards and retries consume more. Existing
other-client account usage is still invisible to GEV. Neither the estimate nor a
larger box changes the monthly/rate ceilings.

Exact warm-cache hits consume zero provider calls. Native-resolution exports
should reuse the loaded/cached Process image and add credits locally; only a
different uncached output descriptor needs a new quota-accounted request.

Before I1 acceptance, measure both two/three-date scenarios, a warm repeat, an
oversized-box 512-pixel fallback and an extra-card scroll. Include a separate
heavy-box case whose computed 10 m output is near the 2,048-pixel cap on both
axes (target approximately 2,040 x 2,040, without exceeding the cap). Measure
single-image then A/B reuse and three-distinct-date variants, followed by a warm
repeat, to expose the PU-bound case. Record the exact selected extent, dimensions,
calls, PU, cache hits, queue/backoff behavior and memory peaks; do not reduce
resolution or change the box to hide its cost. Reconcile dashboard usage where
possible without logging secrets. Revise capacity from evidence, never weaken
the ceilings.

## Historical native fixture measurements — October 22, 2026

These are the original uncalibrated results. The October 25 safety calibration
above supersedes their reservation and session-capacity allowances.

The initial transport-fixture implementation measures the following cold
sessions. These are deterministic mocked CDSE responses and conservative local
reservations, **not authenticated provider consumption, actual scene coverage,
or rendered memory/GPU measurements**. The original estimates above remain as
planning history. Aspect-preserving previews use fewer pixels than the original
128-square estimate. The unchanged conservative allowance remains about 660
cold sessions/month; other clients and retries reduce available capacity.

| Fixture scenario | Native output per date | Unique dates | Provider requests | Reserved PU | Theoretical sessions under both local ceilings |
| --- | --- | ---: | ---: | ---: | ---: |
| Typical, three visible previews | 1,000 × 800 | 2 | 6 | 6.2644 | 1,277 |
| Typical, three visible previews | 1,000 × 800 | 3 | 7 | 9.3162 | 858 |
| Near-cap heavy box, three visible previews | 2,040 × 2,040 | 2 | 6 | 31.9480 | 250 |
| Near-cap heavy box, three visible previews | 2,040 × 2,040 | 3 | 7 | 47.8232 | 167 |
| Oversized fixed box, clipped 512-pixel chunks | 2,500 × 800 | 2 | 24 | 15.3288 | 333 |
| Exact warm repeat of each fixture | Unchanged | Unchanged | 0 additional | 0 additional | No additional imagery charge |

OAuth acquisition is one separate network call in these fixtures. Full PNGs are
reused for A/B and export. The server and browser use independent bounded
working-memory admission; the browser shares its 128 MiB estimate across native
images, visible previews and export buffers. Near-cap A/B/export may explicitly
refuse admission rather than reduce resolution. Real-session measurements,
provider dashboard reconciliation where available, and user rendering/export
checks remain acceptance gates. Evidence:
`.gev-logs/phase2b-i1/implementation-fioktvbe/provider-tests.log`.

## Bounded local cache and terms

Proposed cache policy:

| Item | Limit/lifetime |
| --- | --- |
| CDSE data cache | 2 GiB on disk, including indexes and temporary data; at most 20,000 entries |
| I1 imagery working-memory budget | 128 MiB admission cap using decoded buffers, estimated GPU copies and transients; not a cap on the rest of Cesium or an exact driver-memory guarantee |
| Individual cached response | At most 32 MiB; output dimensions/decoded allocations also capped |
| Rendered tiles/thumbnails/snapshots | Expire after 14 days; evict least-recently-used entries earlier at the size cap |
| Catalog responses | 15-minute TTL; cached response retains sensing and fetch timestamps |
| Confirmed no-coverage response | At most five minutes; never cache authentication/quota errors as empty coverage |
| Pending queue | At most 128 jobs, cancellable, with explicit waiting status; no unlimited pending prefetch |

Store data under the existing ignored .gev-cache/custom-recent-imagery/data/
namespace. Enforce space reservations before writes, account for temporary files
and recover interrupted writes. Remove expired entries first, then evict LRU
entries toward a 1.8 GiB low-water mark before admitting more data. Protect active
readers while choosing other LRU victims. If caching cannot admit a bounded
response, explain reduced cache reuse;
do not grow past the cap. Provider response/dimension limits apply independently.
Use versioned keys incorporating product, acquisition identity, bounds, grid,
dimensions and render specification; never key different scenes as one date.

Keep the small usage/control ledger outside the evictable data subdirectory,
with a separate bounded retention of monthly aggregates. A clear-cache operation,
credential rotation or dependency reinstall must preserve current-period totals
and uncertain reservations. Never cache credential/token responses on disk. User-saved
exports are user files and are not automatically deleted by cache eviction.
Exports remain on-demand and quota-accounted.

The existing standalone watcher already excludes .gev-cache and .gev-logs.
Verify I1 cache writes still cause no source/HMR reload in both development and
preview; no watcher-policy amendment is planned.

CDSE terms section 3 applies the open Sentinel legal notice to Sentinel data,
and its rate-limit documentation expressly recommends caching repeated responses.
The Sentinel notice permits reproduction/modification/distribution with source
notices. This supports a bounded, on-demand local cache of processed Sentinel
imagery and credited exports. It does not license unrelated portal content or
commercial datasets. Respect CDSE good-faith/fair-use and availability terms; do
not evade limits with multiple accounts. Recheck these terms when I1 starts.
[CDSE terms](https://dataspace.copernicus.eu/terms-and-conditions),
[Sentinel legal notice](https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice),
[service caching guidance](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Overview/RateLimiting.html#caching)

## Fit, HUD and attribution

- Auto-fit once for the first successful explicit image/comparison assignment.
  Establishing the initial A/B pair uses the coarser loaded source. Ordinary day
  previews, swaps, repeated selection, share restoration and fallback must not
  repeatedly move the camera. Define the one-shot image/comparison latch in tests.
- Add manual Fit imagery resolution and Restore view controls. Save the prior
  camera pose; restoration never changes the selected box or imagery assignments.
- Use the actual unobstructed CSS viewport after panel exclusions and the source
  native resolution, targeting approximately one source pixel per screen pixel.
  A/B uses the coarser source; account for aspect, projection and camera geometry.
  Device pixel ratio must not silently multiply provider request dimensions.
- The operation moves only the camera. It must not rewrite the selected box,
  catalog bounds, processing bounds or request dimensions. Preserve the existing
  oversized-box ZOOM IN behavior separately. Apply the new fit to HLS 30 m and S2
  10 m; do not redesign VIIRS behavior.
- Read HUD resolution from actually draped imagery, not just a focused or pending
  card. Display both A/B sources, such as A: S2 10 m / B: HLS 30 m. Suppress the
  camera-derived GSD/NIIRS while a Recent Imagery overlay is displayed. During
  loading/transition do not pair the misleading camera number with coarse pixels.
  Clearing/disabling imagery restores the normal camera HUD.
- Preserve NASA and basemap credits. Add source/product/date/year provenance
  wherever S2 imagery is displayed and in each downloaded Export A/B PNG itself,
  not only a sidecar or filename. The processed-image notice is:
  Contains modified Copernicus Sentinel data [capture year].
  Add Sentinel Hub/CDSE service provenance; preserve separate years for A/B.

## Approved file inventory — 50 paths

The approved inventory is exactly 50 paths: the original 47-path plan plus the
three narrowly approved project-owned test files. The original-upstream
allowance remains23. No package manifest/lockfile change is planned. Any further
scope expansion requires an explicit amendment. Implementation is authorized;
final I1 acceptance remains separate.

### Original-upstream edits: 23

~~~text
server/providers/local.js
src/standalone/layerSources.js
src/app/layers/recentImagery.js
src/app/tools.js
src/layers/recentImagery/model.js
src/layers/recentImagery/index.js
src/layers/recentImagery/rendering.js
src/ui/recentImagery.js
src/ui/styles/recent-imagery.css
src/hud.js
src/data/layerState.js
src/layers/recentImagery/model.test.mjs
src/layers/recentImagery/index.test.mjs
src/layers/recentImagery/rendering.test.mjs
src/layers/recentImagery/source.test.mjs
src/layers/recentImagery/testDoubles.mjs
src/ui/recentImagery.test.mjs
src/data/layerState.test.mjs
scripts/qa-recent-imagery.mjs
scripts/package-boundaries.json
scripts/format-scope.json
src/i18n/locales/es.json
src/i18n/locales/ru.json
~~~

### Existing project-owned edits: 12

~~~text
AGENTS.md
CUSTOMIZATION.md
STATUS.md
SETUP.md
build/libraryValidation.js
content/sources.json
src/custom/shared/sourceRegistry.generated.js
src/custom/library/content.test.mjs
src/custom/library/registry.test.mjs
src/custom/library/rendering.test.mjs
src/custom/library/search.test.mjs
scripts/qa-custom-hub.mjs
~~~

The Library validator change must narrowly admit the CDSE environment-only
capability/guide and separately identified custom provenance. Preserve original
upstream pin/document admissions, byte/section hashes and all negative validation
requirements. Do not silently edit frozen source/security documents or cite
custom runtime behavior as if it existed at the immutable upstream pin.

### New project-owned files: 15

~~~text
server/custom/recent-imagery/plugin.js
server/custom/recent-imagery/cdse.js
server/custom/recent-imagery/catalog.js
server/custom/recent-imagery/cache.js
server/custom/recent-imagery/budget.js
src/custom/imagery/source.js
src/custom/imagery/viewport.js
src/custom/imagery/export.js
src/custom/imagery/provider.test.mjs
src/custom/imagery/source.test.mjs
src/custom/imagery/fit.test.mjs
src/custom/imagery/export.test.mjs
src/custom/imagery/hud.test.mjs
docs/custom/FREE-IMAGERY-PLAN.md
docs/custom/FREE-IMAGERY-VALIDATION.md
~~~

### QA-file amendment approved in advance

On October 21 the user explicitly approved adding scripts/qa-custom-hub.mjs to
the I1 allowlist in advance, bringing it to 47 paths. It is no longer pending.
The current assertion is exactly "149 of 149" source products. Update it only to
the reviewed new inventory, retaining every current check, exact-count assertion
and source/health separation. Do not replace it with a permissive assertion.
This approval covers the I1 path; runtime/QA edits still wait for Phase 2a
acceptance and the separate I1 implementation go-ahead. No QA code is changed now.

## Acceptance and validation logging

1. Test fixed-host/identifier-only endpoints, same-origin gates, redaction,
   capped catalog pagination/response bytes, abort and acquisition identities.
2. Test persistent concurrent request/PU reservations, minute pacing, bounded
   queue/backoff/cancellation, restart/month transition, uncertain consumption,
   corrupt ledger, token reuse, no paid escalation and visible fallback notices.
   Simulate 429/exhaustion in fixtures; never spend the real quota to test them.
3. Test cache key isolation, coalescing, TTLs, LRU/size/temp-write accounting,
   active-reader safety, cold/warm reuse, crash recovery, and ledger preservation.
   Test single-image reuse across A/B/export, visible-only thumbnail loading,
   2,048-dimension admission, native-resolution 512-pixel fallback and peak memory.
4. Test cloud unknown versus zero/filter semantics; catalog/render provenance;
   embedded source/date/year export credits; source-native loaded HUD states.
5. Test panel-aware wide/narrow fit, coarse A/B, one-shot behavior, manual restore,
   and byte-equivalent box/search/dimension invariants. Assert no Process refetch
   on single-image Fit/Restore; verify correct geographic rectangle, per-slot
   credits and stale-load cancellation. Preserve existing
   HLS/VIIRS behavior and share-link assertions; never reuse a layer token.
6. Run meaningful focused tests, full allocation-gated unit suite, doctor,
   formatting/i18n checks, package/import boundaries, strict Library checks,
   hub typecheck, both builds and production credential/graph inspection.
   Dependencies remain unchanged; stop for review if a new dependency is needed.
7. Preserve the browser-denial boundary. Browser harnesses remain user-run:
   hub QA, existing expanded imagery QA and tracking on normal-HMR 4173, plus
   manual fit/restore/credits/export/cloud/counter/fallback observations.
   Record actual free-source availability separately from synthetic fixtures.
8. Log request/PU measurements for the declared session and cache repeat, bundle
   effects, every gate and all failures under ignored .gev-logs/. Record concise
   outcomes and retained receipt locations in FREE-IMAGERY-VALIDATION.md.
   No raw token, credential, provider payload or imagery cache is committed.
9. Stop for user review of actual rendering, measured capacity and final I1
   acceptance. Other Phase 2b work remains deferred.

## User setup, when I1 starts

After Phase 2a acceptance and the separate I1 implementation go-ahead, the user
creates the CDSE free General-user account and server-side OAuth client, accepts
the applicable service/data terms and enters credentials locally. The user stops
if signup asks for a card, trial or paid account. Do not ask the user to paste a
secret into chat. No setup is needed for this documentation checkpoint.

## Deferred backlog

- NAIP: free/public-domain, US-only, dated high-detail reference. A mosaic year
  does not prove the capture date for each displayed location. Defer until a
  low-cost existing-tile route can supply trustworthy acquisition dates/footprints
  and clear dated-reference labels; otherwise scope it separately.
- Anonymous Earth Search/public COGs: possible no-account follow-up, requiring
  a separately reviewed decoding/reprojection/tile-rendering path and service
  admission. It is not an automatic I1 fallback or second acquisition owner.
- Commercial 30–50 cm imagery: separate future user decision. No quotes, trials,
  accounts, paid requests or commercial integration are included here.
- All remaining Phase 2b dashboards, other acquisition owners and summaries,
  browser-direct adapters, upcoming-launch queries and other features stay deferred.

## Phase 2a M4 reminder, unchanged

After M3 commits, run the existing clean npm ci, strict Library validation,
typecheck, full allocation-gated tests, boundaries, doctor and both production
builds on the supported Node version. Review the final customization/upstream
diff and production graph, record outcomes and commit the validation checkpoint.
Retain the completed M1 containment and M2/M3 editorial/receipt evidence.

Prepare one final user-run hub QA and normal-HMR tracking check on 4173, with a
short targeted manual recheck only if the clean-install/build review reveals a
material rendering change. Do not ask for unchanged articles/cases to be approved
again. Present the complete Phase 2a validation record for explicit final
acceptance; M3 approval alone does not accept the phase. No CDSE setup is needed
for M4, and no I1 runtime implementation is part of it.
