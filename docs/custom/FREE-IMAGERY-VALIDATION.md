# Phase 2b – I1 validation

Updated October 25, 2026, America/New_York.

## Current PU reconciliation and calibration — October 25, 2026

The user supplied dashboard statistics, without credentials: October 23
**80 requests / 97 PU** (72/97 plus 8/0), October 25 **6/11** (3/11 plus 3/0,
their own browser check), and month to date **86/108**. Account limits are
**10,000 requests / 10,000 PU**, resetting **November 1**. This completes the
user's quota/reset confirmation, not the final visual sign-off or I1 acceptance.
The user authorized a reservation calibration if needed and **no extra provider
requests**. Local ceilings remain **8,000 / 8,000**.

The retained Oct 23 month endpoint (81 / 81.96134765625) includes Oct 22's failed
1 request / 0.01 PU. The matched Oct 23 interval is therefore
**80 / 81.95134765625**. Request counts agree exactly; the dashboard PU excess
is **15.04865234375**, or **18.3629%**. Ordinary aggregate rounding does not
explain that difference. No historical remaining-quota headers are available:
the server read `x-processingunits-spent` transiently but did not persist it,
and never retained remaining-quota headers. The three header-search matches in
old evidence are source code/documentation, not response values. Do not claim
an observed minimum-charge, OAuth, Catalog or sample-count explanation.
The documented Process minimum (0.005 PU) and excluded dataMask band do not
explain this shortfall. A per-request rounding/backend-cost mechanism remains
unclassified without per-response measurements.

The accounting repair uses an empirical **1.25 PU safety factor** on every raw
reservation before monthly admission and rolling-minute pacing, including
failures/retries. Spending headers above that reservation add only the excess;
smaller/absent headers never refund reservations. Missing headers remain unknown.
Warm cache repeats remain zero. The locked, idempotent version 1→2 migration
preserved requests, OAuth counts, month, history, event timestamps and all cached
files, scaling only PU/events and conservatively retaining pacing. Passive
reads do not migrate, reset or rewrite storage. Version 2 records the factor.

The ledger had advanced to **98 requests / 115.79559814453127 PU / 7 OAuth
attempts** before this task. Migration produces
**98 / 144.7444976806641 / 7**. This increase is accounting headroom, not new
provider spending. No matching October 25 six-call local interval was retained.
Local reservations include failed/unknown outcomes: one of the 12 excess month
requests is the known October 22 failure; the other 11 are unclassified. The
entire delta cannot be attributed to those six calls. Dashboard totals
were not substituted for local counts. Future account clients and billing
differences can still reduce available capacity.

| Three-date session | Cold requests / calibrated PU | Full-month sessions | With one measured scroll: requests / calibrated PU | Sessions with scroll |
| --- | ---: | ---: | ---: | ---: |
| Typical 1,000 × 800 | 8 / 11.7081 | 683 | 10 / 11.8338 | 676 |
| Heavy 2,040 × 2,040 | 7 / 59.7790 | 133 | 10 / 60.0134 | 133 |
| Oversized 2,500 × 800 | 35 / 28.7228 | 228 | 38 / 28.7979 | 210 |

These project the retained Oct 23 native grids/visible previews under both
8,000 ceilings; there was no new acquisition, box change or resolution reduction.
Including the migrated current ledger, remaining local equivalents are
**670 / 131 / 225** cold, or **663 / 130 / 207** with one scroll. They are
theoretical ledger allowances, not provider-billed guarantees. All original
receipts, including inconclusive typical two-date attempts, remain unchanged.

Verification on Node 24.22.0: **50/50 focused checks**; full gated suite
**8,388 passed / 0 failed / 1 Windows-only skip** (8,373 ordinary, 1 focus,
14 world allocation); all nine checks including formatting, Library, boundaries,
typecheck, i18n, camera policy, doctor and both builds pass. Terrain restored
byte-for-byte. No real provider/OAuth call or credential/token read/log occurred.
Four existing project-owned runtime/test paths changed; no dependency or added
upstream path. No staging/commit. Evidence, migration/headers audit, calculation
and gate logs: `.gev-logs/phase2b-i1/quota-reconciliation-zqgSfz/REPORT.md`.

Verified standard normal-HMR PID 39317 was stopped before edits to prevent open
S2 tabs from acquiring during reload. **4173 remains paused**; 4174 remains
stopped. Blank globe pixels, narrow voice-selector overlap and final visual
sign-off remain unresolved; this accounting repair does not accept I1 or expand
other Phase 2b scope. Earlier uncalibrated capacities/server checkpoints below
are retained as historical evidence.

[CDSE PU accounting](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Overview/ProcessingUnit.html)

## Historical implementation checkpoint — October 22, 2026

**Implementation is in place under the approved 50-path scope. I1 is not yet
accepted or committed.** The approved three-test count amendment is applied and
the complete Node 24 gated suite passes **8,377 / 0 failed / 1 Windows-only skip**.
Other Phase 2b work stays deferred. Free CDSE General-user only; no paid provider,
trial/card requirement or new dependency is introduced.

## Scope and retained evidence

Base: `a1fcf80686903a9a1c2c5c2235e1ba4c19c61a5a`; branch:
`codex/phase-2b-i1-free-imagery`. The source/doc upstream pin remains
`064d51f7be2675f1c69e16068e9c49d1a60144d1`. All Phase 2a acceptance,
earlier failed/inconclusive receipts and stopped 4174 rehearsal artifacts remain
retained. Six unrelated duplicate files are hashed in the run's `start.json`
and excluded from this work. Package manifest/lockfile are unchanged.

Initial implementation evidence: `.gev-logs/phase2b-i1/implementation-fioktvbe/`.
Its original 47-path inventory, reviewed unapplied proposal and earlier failures
are preserved. The user subsequently approved the three-test47→50 amendment.
The exact approved 50-path inventory, application hashes, patch, full passing run
and preservation receipt are under
`.gev-logs/phase2b-i1/approved-count-amendment-i5p_9ii3/`.

The registry adds exactly one CDSE source/product and one separate
environment-only guide: **150 products, 39 guides**. Existing 149 product
records, 38 guides and 12 capability records are preserved. The generated
projection is updated. Custom facts reference the approved I1 plan commit
`a860327edc694fbcc313eb0791629fe88070a0b0`, with no invented public URL; they
are not attributed to the frozen upstream pin. Seven upstream document and
25 section admissions, hashes and publication records remain unchanged.

## Native gate results

All commands used Node 24.22.0 / npm 11.19.1. Browser harnesses and manual
helpers were not agent-executed.

| Gate | Result | Retained evidence |
| --- | --- | --- |
| Complete gated runner after approved count amendment | **8,377 pass / 0 fail / 1 Windows-only skip**, including both allocation groups | `approved-count-amendment-i5p_9ii3/unit-allocation.log`, `passing-receipt.json` |
| Full ordinary unit portion, before the count amendment | **8,359 pass, 3 fail, 1 platform skip**; failures are only unchanged exact inventory counts in the three pending amendment files | `native-final-2/unit-allocation.log` |
| Node 24 GC-bracketed focus allocation probe | 1/1 pass | `focus-allocation-final.log` |
| Node 24 GC-bracketed world-overlay allocation probes | 14/14 pass | `world-allocation-final.log` |
| Focused provider ownership/security/cache/budget/response-memory tests | 25/25 pass | `provider-memory-lease-tests.log` |
| Source/export/fit/HUD focused tests | 29/29 pass; also included in the full ordinary run | Owned test files and native full log |
| Globe/model/render/UI/share focused tests | 169/169 pass | `globe-integration/i1-peer-fixes-1.log` |
| Registry/content admission tests | 66/66 pass | `library-content-recheck.log` |
| Unmodified standalone config/security tests | 9/9 pass | `config-order-recheck.log` |
| Hub typecheck | Exit 0 | `typecheck-final.log` |
| Doctor | Exit 0 | `doctor-final.log` |
| Package/import ownership boundaries | Exit 0 after explicit custom-source ownership additions | `boundaries-recheck-2.log` |
| HK/Taiwan-off policy | 6/6 offline process checks; both camera packs remain disabled | `policy-final.log` |
| Strict Library validation | Exit 0; 150 products / 39 guides | `library-final.log` |
| Localization | 2,685 messages complete in each locale | `i18n-final.log` |
| Formatting | Exit 0, 1,465 files checked | `format-recheck.log` |
| Unmodified production build | Exit 0, reported 4.47 s | `build-final.log` |
| Unmodified panel production build | Exit 0, reported 3.60 s | `build-panel-final.log` |
| Production graph / fake-credential isolation | Pass, see below | `production-summary.json`, `production-isolation.json` |

The earlier failed ordinary runs correctly stopped before allocation probes;
their separate 15 passing allocation observations were not claimed as a passing
complete runner. After explicit approval, the unmodified allocation-gated runner
now completes all three groups: ordinary 8,362, focus 1 and world-overlay 14,
with zero failures and the existing Windows-only skip. The terrain cache was
restored byte-for-byte in every run. Earlier receipts remain retained.

## First failures and reviewed repairs

Every initial log remains retained. No test or acceptance condition was relaxed.

- The first focused Library run exposed a legacy share-decoder shape change.
  The codec now adds S2/cloud fields only when encoded, preserving unchanged
  NASA defaults and old full-state case assertions.
- The first full run had four failures: the three stale exact inventory counts
  and a provider-order invariant. Inserting the new provider before the existing
  final key-setup plugin preserves all old relative ordering; the unmodified
  configuration tests now pass. No extra upstream test edit was needed.
- Peer review corrected unknown usage being represented as zero, S2 cloud-field
  normalization, exact Process product identity, independent PNG validity and
  alpha-coverage checks, decode readiness before HUD/fit/export, cache orphan
  and deletion accounting, candidate recovery and retry/cancellation paths.
- Every S2 thumbnail now has visible accessible source/year attribution even
  before an overlay is assigned. Fallback reasons come from the failed request,
  so another A/B success cannot erase a quota/setup cause.
- Warm and cold PNGs enter bounded server memory admission before cache reads.
  Shared response-buffer leases last through HTTP finish/close, including slow
  responses. Cancellation while waiting for a ledger lock is rechecked before
  reservation or dispatch. Retained fixtures prove these cases.
- New ownership imports required explicit entries in the already approved
  boundary inventory. The last formatting check found one test file; a
  whitespace-only repair passes the unchanged formatter.

The initial imagery QA script syntax error, focused intermediate attempts and
review notes also remain under the globe-integration evidence directory. None
of those logs is a rendered browser test.

## Production output and request model

Both real build commands ran unmodified, in sequence. A separate `write:false`
measurement omitted only the redundant Cesium post-build asset copy; it does
not replace either acceptance build. Its graph contains no server CDSE module,
DEV Ajv/schema compiler, or hub/React/Tailwind dependency in the initial globe.
Fake non-secret CDSE credential sentinels are absent from output; actual
credential values were neither read nor inspected.

Compared with the accepted Vite 6.4.5 Phase 2a measurement:

| Initial entry | Raw byte change | Gzip byte change | Brotli byte change |
| --- | ---: | ---: | ---: |
| Globe | +40,150 | +14,592 | +10,845 |
| Hub | +448 | +167 | +199 |

The existing large-chunk warning remains visible. No new dependency is added.
The fixture request/PU table in `FREE-IMAGERY-PLAN.md` includes typical two/three
unique-date sessions, exact warm reuse, clipped 512-pixel pieces and the
2,040-square heavy case. For three unique dates: typical **7 requests / 9.3162
reserved PU**; heavy **7 / 47.8232**. These are deterministic mocked transport
reservations, not actual CDSE consumption or scene/rendering observations.
Warm repeats consume zero additional provider calls in those fixtures. The
browser's shared 128 MiB guard covers native images, previews and export
buffers; heavy A/B/export may explicitly refuse admission rather than lower
native resolution. Guard estimates are not physical GPU-memory measurements.

## Shipping development listener

The verified root standard Vite listener PID 84521 was replaced by **PID 55188**
on `[::1]:4173`, normal HMR, no HMR/overlay override, Node 24.22.0. A new process
loads the final provider closures instead of retaining earlier config-restart
owner instances. Security/provider policy and optimizer-cache isolation remain
intact. Port 4174 remains stopped; its logs/worktree are retained.

Fresh native HTTP checks of `/`, `/hub/`, `/@vite/client` and passive usage all
return 200. The passive endpoint reports `configured:false`, `setup_required`,
and unknown usage as null; it performs no OAuth or imagery acquisition. This is
native serving evidence, not rendered browser proof. Restart records and the
new normal-HMR log are `server-restart-before.json`,
`server-restart-after.json`, and `server-normal-hmr.log`.

## Local credential configuration verified — October 22, 2026

The user reports the CDSE account verified and the OAuth credentials saved only
locally, with Sentinel-2 still off. The previously documented PID 55188 had
already exited; native checks found both 4173 and 4174 free. No unrelated process
was stopped. A fresh standard Node 24 CLI server now runs as **PID 32310** on
`[::1]:4173`, normal HMR without HMR/overlay overrides. Port 4174 stays stopped.

Fresh native requests to `/`, `/hub/` and `/@vite/client` return 200. The passive
CDSE usage endpoint returns 200, **configured true / status ready**, no queued,
active or retrying work, and unchanged 8,000 request / 8,000 PU safety limits.
Month/request/PU/OAuth totals remain unknown (`null`), not zero. The usage ledger
was unchanged and no OAuth, catalog or Process request was made by this check.
Configuration presence is not successful authentication, provider-tier/quota
verification or imagery coverage. Sentinel-2 was not enabled by the agent.

The agent inspected only `.env` file metadata and Git-ignore status, not its
contents or credential values. The normal server loads credentials internally;
no secret value was printed by the check, copied into documentation or sent to
a browser. Safe aggregate receipt and listener evidence are retained in
`.gev-logs/phase2b-i1/local-configuration-bufCRD/`; `server.log` is the new normal
server log. Earlier unconfigured receipts and all test failures remain retained.
This operational/configuration checkpoint changes no runtime code or dependency
and does not resolve the three-test scope amendment or grant final I1 acceptance.

## Approved count amendment and full gated pass — October 22, 2026

The user explicitly approved exactly three project-owned test-file additions to
the I1 allowlist (47→50; original-upstream allowance remains 23). Applying the
retained reviewed patch changes only guide expectations 38→39 in registry and
rendering tests and the product expectation 149→150 in search. Independent
read-only review confirms all strict assertions and other lines are intact.

The complete `GEV_REQUIRE_ALLOCATION_GATE=1 npm test` runner exits 0 on Node 24.22.0:
**8,377 passed, 0 failed, 1 Windows-only skip**. Its child process excludes live
CDSE credentials; configured-provider tests still use their existing injected
fixtures. The running server's configuration is unchanged. Terrain restoration
and formatting pass. No runtime/config source or package file changed since
both unmodified I1 builds, so their recorded passing results remain applicable.
No browser harness/helper, OAuth/catalog/Process request, S2 enable action,
staging or commit was performed. Root PID 32310 remains normal-HMR loopback 4173;
4174 stays stopped. Safe passive configuration is true with no active/queued work.

Receipt: `.gev-logs/phase2b-i1/approved-count-amendment-i5p_9ii3/passing-receipt.json`.
The initial audit's assumed indentation for 149 was corrected without another
test-file mutation; exact patch application is verified against HEAD and the
retained reverse-apply check. All earlier logs/proposals remain intact.

## Regression results recorded — October 22, 2026

The user explicitly reports **hub14/14, Recent Imagery passed and tracking
109 passed/0 failed/0 skipped**, with Sentinel-2 kept off throughout. Hub result
matches `.gev-logs/qa-custom-hub-2026-10-22T17-21-24-450Z.json`, overall passed,
14 true assertions and zero page errors. SHA-256:
`1820c7af03ad81d4333e60f2e0d53dc87733b04944844b645d25c5e1bb8e8fc8`.
Its timestamp follows the approved native gate. The hub assertion-only receipt
is copied into `.gev-logs/phase2b-i1/user-regression-M2StTp/` alongside the
provenance record. Earlier receipts are retained.

Recent Imagery and tracking are **explicit user-reported passes**. No matching
fresh terminal summary/receipt is saved; the imagery harness's named output
directory is empty. Do not invent an imagery assertion count, infer a failure
from absent artifacts, or describe these as agent/browser executions. S2-off is
the user's attestation. These results close the regression step; actual CDSE
authentication, 10m rendering/attribution/fit and capacity remain unverified.
I1 remains unaccepted and uncommitted; other Phase 2b work stays deferred.

## User-run I1 QA — completed regression sequence

Use the already-running localhost:4173 server and run these sequentially from
the shipping checkout. Keep Sentinel-2 **off for these regression runs**. These
commands do not establish CDSE authentication, S2 rendering or real capacity;
those checks follow the regression results. The agent does not execute browser
harnesses under the retained denial boundary.

```sh
cd /Users/getumwanna/Documents/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0

QA_BASE_URL=http://localhost:4173 npm run qa:hub

QA_BASE_URL=http://localhost:4173 \
QA_SHOT_DIR="$(mktemp -d .gev-logs/phase2b-i1/user-imagery-XXXXXX)" \
node scripts/qa-recent-imagery.mjs

npm run test:track -- --url http://localhost:4173 --offline-imagery
```

Report each final summary and its receipt/screenshot-directory path. Expected
hub result is 14/14; tracking 109 passed/0 failed/0 skipped. For Recent Imagery,
report the entire final summary and any failures or NASA-unavailable SKIP;
a SKIP remains unverified, even if the script exits 0. The imagery script checks
the new controls and HLS fit with S2 off; it uses live NASA imagery. Its older
launcher instruction does not apply to this already-running server. Existing
checks are all retained, with no weaker assertion or unapproved source added.

## Remaining acceptance gates

1. **Completed:** the explicit count amendment is approved, applied exactly and
   passes the complete calibrated runner as recorded above. The allowlist is 50,
   the original-upstream allowance 23, with no extra dependency. I1 remains
   uncommitted and awaits user-rendered/real-source acceptance.
2. Local account/client setup is user-reported complete and passive presence
   verified. Actual authentication, account quota/reset confirmation and source
   measurements remain pending. Keep values local and S2 off for the three
   regression harnesses above; report only non-secret quota/reset information.
3. **Completed regression step:** user reports hub14/14, Recent Imagery passed
   and tracking109/0/0 with S2off. Hub is receipt-backed; the other observations
   retain their user-report provenance above. Do not ask to repeat unchanged
   regression gates solely because their terminal output was not retained.
4. User observations: wide/narrow/keyboard controls; S2 on/off without damaging
   NASA defaults; visible-card-only loading and cloud filtering; first-assignment
   auto-fit, manual Fit and Restore without box/request changes; coarser A/B fit;
   source-native loaded HUD; specific visible fallback/unknown states; source and
   capture-year credits on thumbnails, both A/B slots and both PNG exports.
5. Measure actual free-source two/three-date 10 × 8 km sessions, exact warm
   repeats, visible-card scroll, oversized clipped-piece path and near-cap
   approximately 2,040-square heavy sessions. Record fixed bounds, dimensions,
   calls/reserved and reported PU where available, cache hits, queue/backoff and
   memory admission. Reconcile the dashboard where possible without handling
   secrets. Do not weaken quotas or change resolution/bounds to improve results.
6. Record rendered and real-provider results, retain receipts and failures, then
   stop for explicit final I1 acceptance. All other Phase 2b work remains deferred.


## User-operated CDSE authentication, rendering and capacity walkthrough

These are the remaining real-source gates, not another regression run. The agent
has not authenticated with CDSE, enabled S2 or driven a browser. All credentials
stay local. No account or client needs to be recreated.

A fresh passive checkpoint at `2026-10-22T19:27:57.509Z` confirms configured true,
ready, zero queued/active/retrying work, and local limits of 8,000 requests / 8,000
PU monthly, 120 requests / 120 reserved PU per minute. Month, consumption, OAuth
count, cache and memory remain null before the first acquisition. Unknown is not
zero. Receipt:
`.gev-logs/phase2b-i1/real-check-preparation/captures/2026-10-22T19-27-57-509Z-baseline-before-user-cdse-640f671a-953b-40d9-ae50-654681b77e4f.json`.
During the interrupted turn, the previous listener exited. On resumption both ports were free; no process was killed. The standard Node 24 Vite CLI was restored as PID 92468 on `[::1]:4173`, with normal HMR and no source/configuration changes; 4174 remains stopped. The new passive receipt at `2026-10-22T20:48:28.329Z` still reports configured true / ready, zero queued/active/retrying work and unknown consumption totals. It is retained under `real-check-preparation/captures/2026-10-22T20-48-28-329Z-after-walkthrough-restart-b4aee04b-a27f-4c1f-8300-f416a8cdc32d.json`; verified process/listener evidence is `.gev-logs/phase2b-i1/walkthrough-server-5bfvib18/verified.json`. No provider call was made.

### 1. Confirm the account limits and prepare a terminal

In the user's CDSE/Sentinel Hub dashboard, confirm the account is the free
General-user tier and note its numerical allowances, current usage and reset
time. The published allowance is currently 10,000 requests / 10,000 PU monthly
and 300 requests / 300 PU per minute; GEV deliberately uses lower limits.
See [CDSE quotas](https://documentation.dataspace.copernicus.eu/Quotas.html).
Stop if the account requires a card/trial/paid plan or its actual allowance is
below the local guard. Report only quota numbers and reset time, never account
identifiers, OAuth responses, client IDs/secrets, cookies or full HAR exports.

```sh
cd /Users/getumwanna/Documents/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0
node .gev-logs/phase2b-i1/real-check-preparation/checkpoint.mjs auth-before
```

The checkpoint prints only a unique receipt path. It GETs the fixed local passive
usage endpoint, saves an explicitly typed projection with private file
permissions, and performs no OAuth, Catalog, Process or browser call. Paste its
path with the observations; the agent can read those safe receipts and calculate
deltas. A successful capture is not an authentication pass. The helper and its
four isolated fixtures are ignored operational verification artifacts, not a new
runtime module, dependency or recorder. Initial null counters remain unknown;
only subtract numeric counters from the same provider month.

### 2. Use the small authentication box first

Turn S2 OFF in the current globe, then open the **Authentication** link below in
a fresh/reloaded document. Merely changing the fragment on an already loaded
page does not reapply state. Close other S2-enabled globe tabs. All four links
explicitly restore S2 OFF, Recent Imagery ON, VIIRS OFF, cloud ceiling 100, IMAGE
mode and no pins. They use different fixed boxes so the small probe does not
prewarm the capacity images. HLS can still acquire NASA data independently.

| Fixed view link | Bounds west / south / east / north | Native 10 m grid | Full-image Process parts per date, before retries | PNG with credit footer |
| --- | --- | --- | ---: | --- |
| [Authentication](http://localhost:4173/#v=2&lat=40.3200&lon=-74.2200&alt=10000&heading=0&pitch=-90&roll=0&style=normal&map=esri-imagery&l=1&lo=1.w.-7423171_1.s.4031107_1.e.-7420829_1.n.4032893_k.o.n_1.c.0) | -74.23171 / 40.31107 / -74.20829 / 40.32893 | 200 × 200 | 1 | 768 × 272 |
| [Typical](http://localhost:4173/#v=2&lat=40.3200&lon=-74.2200&alt=30000&heading=0&pitch=-90&roll=0&style=normal&map=esri-imagery&l=1&lo=1.w.-7427865_1.s.4028421_1.e.-7416135_1.n.4035579_k.o.n_1.c.0) | -74.27865 / 40.28421 / -74.16135 / 40.35579 | 1000 × 800 | 1 | 1000 × 872 |
| [Heavy](http://localhost:4173/#v=2&lat=40.3200&lon=-74.2200&alt=50000&heading=0&pitch=-90&roll=0&style=normal&map=esri-imagery&l=1&lo=1.w.-7433958_1.s.4022871_1.e.-7410042_1.n.4041129_k.o.n_1.c.0) | -74.33958 / 40.22871 / -74.10042 / 40.41129 | 2040 × 2040 | 1 | 2040 × 2112 |
| [Oversized](http://localhost:4173/#v=2&lat=40.3200&lon=-74.2200&alt=50000&heading=0&pitch=-90&roll=0&style=normal&map=esri-imagery&l=1&lo=1.w.-7436667_1.s.4028421_1.e.-7407333_1.n.4035579_k.o.n_1.c.0) | -74.36667 / 40.28421 / -74.07333 / 40.35579 | 2500 × 800 | 10 | 2500 × 872 |

Do not press USE VIEW, SELECT BOX or CLEAR during a fixed-box measurement. Fitting
must move only the camera, never alter the selected box or request dimensions.
The exact grids above were checked with shipping quantization, image-plan and
share codecs in pure Node fixtures; they are not evidence of current coverage.

In DATA LAYERS, expand Recent Imagery if its source chips are hidden; expand the
right-hand RECENT IMAGERY panel. Confirm `SENTINEL-2 · 10 m` is OFF, then turn it
ON for this first bounded real-provider check. No credential needs to be pasted
into the UI or terminal. Allow the catalog/queue to settle without scrolling.

Cards specifically marked CDSE / Sentinel-2 L2A / 10 m identify the new source;
HLS Sentinel-2 cards are a different 30 m product. Report available acquisition
dates and scene cloud percentages. Cards prove Catalog access; they do not prove
full-image Process access. In IMAGE mode, click **SHOW** on one actual CDSE 10 m
card and wait for its full image. Hover/focus alone is not the full-image test.
Then run:

```sh
node .gev-logs/phase2b-i1/real-check-preparation/checkpoint.mjs auth-image
```

Report whether a full 10 m image renders, source/date/cloud and any safe visible
notice. A cleanly reported no-coverage response is not a rendering pass. If there
is an authentication, quota or provider error, stop before the larger scenarios
and report the exact panel notice. A fallback must visibly say
“Sentinel-2 unavailable: showing HLS 30 m, [reason]”; HLS rendering is not an S2
pass. Do not repeatedly retry authentication errors or change credentials blindly.

### 3. Check rendering, camera controls and credits on the small box

1. Confirm the first successful full-image assignment fits once and the HUD names
   the loaded imagery as S2 10 m. Check the Copernicus source and capture year on
   the thumbnail, loaded overlay and Details. Record the actual UTC acquisition;
   scene cloud percentage does not measure cloud inside the selected box.
2. Use **Fit imagery resolution** and **Restore view**. The previous camera view
   should restore; the geographic selection and native grid must stay unchanged.
3. Switch to **A / B**, retain the first date as A, and choose a different CDSE
   date with B. If needed use the first card's A button. Confirm both render and
   the divider/SWAP expose the correct dates. If fewer than two usable dates
   exist, report that limit instead of passing A/B.
4. Capture `render-loaded`, then use Fit, Restore, SWAP and EXPORT A/B, then
   capture `render-controls`. With both images already loaded, these operations
   must make no additional provider acquisition. Inspect both PNGs for correct
   image/date and visible Copernicus source/year credit. The 72-pixel footer and
   minimum 768-pixel canvas width add credit space; the 200-pixel source content
   is copied 1:1, not upscaled to 768 pixels.
5. Separately check a mixed loaded S2 10 m / HLS 30 m pair fits to the coarser
   source and that each side/HUD/credit retains its own source. Check the cloud
   filter (for example 100 → 50 → 100), narrow layout and keyboard operation.
   Filtering can cause a separate Catalog query; unknown cloud is included at
   100 and excluded below 100. Keep these observations outside capacity totals.
6. Turn S2 OFF and confirm the existing HLS behavior remains usable.

Use the same checkpoint command with the stated stage name, for example:

```sh
node .gev-logs/phase2b-i1/real-check-preparation/checkpoint.mjs render-loaded
# Perform Fit, Restore, SWAP and both exports, then:
node .gev-logs/phase2b-i1/real-check-preparation/checkpoint.mjs render-controls
```

For exact native metadata, the user may inspect only the same-origin image
request's safe `box`, `width`, `height`, `nativeResolutionM` and source/date fields
in `X-GEV-Imagery`, or report PNG dimensions and prepared grid. Do not send full
headers, HAR files or authentication screenshots. Rounded UI box dimensions are
not exact pixel measurements.

### 4. Measure typical, heavy and oversized boxes sequentially

Begin only after authentication and small-box rendering succeed. For each row,
turn S2 OFF, open that row's link in a fresh/reloaded document, leave its box and
cloud ceiling unchanged, and substitute `typical`, `heavy` or `oversized` below:

```sh
node .gev-logs/phase2b-i1/real-check-preparation/checkpoint.mjs typical-before
# Enable S2; do not scroll. SHOW date 1, then A/B with date 1 and date 2.
node .gev-logs/phase2b-i1/real-check-preparation/checkpoint.mjs typical-two-dates
# Replace A with a third distinct date; B remains date 2.
node .gev-logs/phase2b-i1/real-check-preparation/checkpoint.mjs typical-three-dates
# Turn S2 OFF/ON without reloading or changing the box.
# Repeat the same date-1 / date-1-and-2 / date-3-and-2 sequence
# within 15 minutes, without scrolling or changing the cloud ceiling.
node .gev-logs/phase2b-i1/real-check-preparation/checkpoint.mjs typical-warm
# Scroll once to newly visible S2 cards; wait for their thumbnails.
node .gev-logs/phase2b-i1/real-check-preparation/checkpoint.mjs typical-scroll
```

Wait for queued/active/retrying work to settle before each after-snapshot. Record
how many CDSE thumbnails were actually visible/loaded, all acquisition dates,
elapsed time, native grids, cache hits, queue/backoff messages and safe errors.
The one-image date-1 step followed by A/B date-1/date-2 covers the two-date reuse
case; replacing A with date-3 covers three distinct full images in total.

A warm repeat should reuse cached results; new Catalog TTL expiry, unseen
thumbnails, retries or a different query can add calls and must be reported.
Do not clear the cache or usage ledger to force a cold run. If the box is already
cached, mark it warm; do not manufacture cold evidence. The oversized path should
retain the 2500 × 800 native grid using ten clipped parts (512-pixel full parts,
452-pixel right edge and 288-pixel bottom edge), never coarsen the source or grow
the selected box. Report a coverage or memory limit as an incomplete variant.

The near-cap heavy case approaches the 128 MiB shared admission budget. A/B or
export may visibly queue/refuse admission, particularly with loaded thumbnails.
Record the exact refusal and the step it blocked. Unpinning the other slot may
permit a separate single-image export, but does not turn a blocked A/B export
into a pass. Never reduce resolution or change the box to conceal the limit.
Snapshots measure reserved working-memory admission, not physical GPU/browser
peak memory. If measuring peak process memory, record the tool, baseline and
observed peak; otherwise leave peak memory explicitly unmeasured.

Planning references only: the three-date typical fixture reserves about 9.32 PU,
the heavy fixture 47.82 PU, and the oversized calculation about 22.96 PU, before
extra visible cards/retries. Together they are about 80.10 PU plus the small
probe and extra UI checks. This is an estimate, not a new budget or actual charge.
Local PU is a conservative reservation, increased if CDSE reports a larger cost;
it is not an exact account billing meter. Reconcile before/after dashboard usage
where available, keeping other clients/account-wide traffic separate. The
[official PU model](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Overview/ProcessingUnit.html)
and actual account usage govern interpretation. Do not deliberately exhaust a
quota or force 429 responses; queue/quota/fallback failure paths already have
native fixture coverage.

### 5. Report and pause for evidence review

Paste checkpoint paths, quota/reset numbers, actual scene dates and concise
PASS / FAIL / unavailable observations for authentication, small-box rendering,
fit/restore, same/mixed-source A/B, HUD, credits/exports, cloud filtering and
narrow/keyboard behavior. For each capacity case report two-date, three-date,
warm and scroll outcomes, dimensions, elapsed time and any memory/provider limit.
Unknown counters, unavailable coverage and unmeasured memory remain explicit.
The agent will read the safe receipts and calculate measured request/PU deltas
and revised session capacity. No acceptance is inferred from account setup or a
capture succeeding. Stop for final I1 review and explicit acceptance; keep all
other Phase 2b work deferred.

Final scope review: 48 I1 paths are touched within the approved 50; only this validation record, STATUS.md and AGENTS.md changed since the passing native gate. Package files and all six duplicate hashes remain unchanged. Seven unrelated `.idea/` files appeared while the turn was paused, including five staged files; they were left untouched. The agent did not stage or commit I1. Scope evidence: `.gev-logs/phase2b-i1/user-regression-M2StTp/final-scope.json`.


## First Catalog attempt and endpoint repair — October 22, 2026

The user enabled S2 on the small fixed authentication box and reported one
request / 0.01 reserved PU, a generic provider-unavailable notice and no loaded
HLS image. This is a failed real-source check, not a rendering or capacity pass.
The safe passive snapshot at 21:46:14.371Z confirms one OAuth attempt, one
request / 0.01 PU, zero cache entries and zero queued/active/retrying work.
Evidence: `real-check-preparation/captures/2026-10-22T21-46-14-371Z-reported-catalog-failure-b12cd31a-787e-4d18-b007-3ccc21fa2470.json`
under `.gev-logs/phase2b-i1/`.

The code reserves a Catalog request only after accepting the token response;
this suggests that token acquisition completed before the failed Catalog step.
It does not prove Catalog authorization, scene coverage or image rendering.
The original upstream HTTP status was not retained, so no observed 404, 406,
provider outage or credential defect is claimed.

An independent source review found a deployment endpoint mismatch. The current
[CDSE API reference](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/ApiReference.html)
and [beginner examples](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/UserGuides/BeginnersGuide.html)
document `https://sh.dataspace.copernicus.eu/catalog/v1/search` and
`https://sh.dataspace.copernicus.eu/process/v1`. The implementation used
`/api/v1/catalog/1.0.0/search` and `/api/v1/process` instead. Both fixed URLs now
match the current reference; Catalog explicitly negotiates `application/geo+json`.
The OAuth endpoint is unchanged. This corrects the identified code contract;
only the user's next attempt can verify successful real Catalog access.

The user explicitly confirmed S2 OFF in all tabs before runtime edits/restart.
Repair files are all already inside the 50-path allowance:

- `server/custom/recent-imagery/cdse.js`: fixed deployment paths, Catalog media type,
  and fixed-stage/numeric-status diagnostics.
- `server/custom/recent-imagery/plugin.js`: only allowlisted stage values and a
  bounded integer HTTP status cross the local error boundary.
- `src/custom/imagery/source.js`: safe fallback formatting and a specific
  authentication failure reason; no raw provider message/body is echoed.
- Existing `src/custom/imagery/provider.test.mjs` and `source.test.mjs`: independent
  literal endpoint contract and error/consumption/redaction regressions.

No dependency, additional original-upstream file, quota, request size, selected
box, cache policy or security guard changed. Provider error bodies remain unread
and credentials remain server-local. `ready` in passive usage describes local
queue/budget readiness; it does not certify successful provider access.

Evidence is `.gev-logs/phase2b-i1/endpoint-repair-1b675_r5/`:

- New endpoint/diagnostic tests first fail as intended: 39 pass / 4 fail; after
  repair the focused group passes 43/43. The fake URL contract is independent
  of the production constants, closing the earlier fixture blind spot.
- The first full run catches an unnecessary quota-message wording change. The
  prior wording was restored; the existing assertion was not altered. That
  failed log remains retained.
- Final complete Node 24 gated suite passes **8,381 / 0 failed / 1 Windows-only
  skip**: ordinary 8,366, focus allocation 1, world-overlay allocation 14. Terrain
  cache restores byte-for-byte. See `gated-final/unit-allocation.log` and
  `gated-final/terrain-cache-preservation.json`.
- Format, strict Library validation, boundaries, hub typecheck, i18n, camera
  policy, doctor and both builds pass; `gated-final/checks.json` and individual
  logs retain each exit status. No browser harness was executed by the agent.

After listener/cwd/command verification, only PID 92468 was stopped. Fresh
standard Node 24 Vite CLI is PID 39317 on `[::1]:4173`, normal HMR, with 4174
stopped. The new passive snapshot remains configured true / ready, one request /
0.01 PU and one OAuth attempt; consumption was not reset and no provider call
was made by the agent. See `verified-restart.json` in the repair evidence and
`real-check-preparation/captures/2026-10-22T21-51-56-945Z-after-endpoint-repair-restart-885e5b74-7e11-442f-bd6c-57a86e30ece7.json`.

Next, keep the same small fixed box and run a new `auth-before` checkpoint.
Reload the globe while S2 is OFF, then enable S2 once. If CDSE 10 m cards appear,
SHOW one, wait for the full image, then run `auth-image`. Report both receipt
paths, source/date/cloud, whether the image renders and any exact safe fallback
notice. If it fails, turn S2 OFF and stop before capacity checks; the new notice
can identify a fixed stage and HTTP status without disclosing provider bodies.
No credentials need to be re-entered on the evidence currently available.

Earlier hub14/14, Recent Imagery and tracking109/0/0 results remain valid historical
regression evidence at their recorded revision. This repair does not fabricate
new rendered passes. I1 remains uncommitted and awaits real-source verification
and final explicit acceptance; other Phase 2b work remains deferred.


## Successful small-box CDSE retry — October 23, 2026

The user explicitly reports that CDSE 10 m cards now appear and SHOW renders the
full image. Record **Catalog access and basic Process authentication/rendering
as passed by user observation**. The agent did not inspect a browser or make a
provider request. This closes the failed small-box retry gate, not the remaining
fit, A/B, attribution, capacity or final I1 acceptance gates. No credential needs
to be recreated or re-entered.

The supplied passive receipts are preserved byte-for-byte in
`.gev-logs/phase2b-i1/auth-success-kmul_h70/`, with hashes and provenance in
`receipt.json`; the original capture files remain intact:

| Safe receipt | UTC time | Requests | Local reserved PU | OAuth attempts |
| --- | --- | ---: | ---: | ---: |
| `2026-10-23T07-32-31-272Z-auth-before-f6cc6ffd-b769-413f-99e6-88b1eb7bb808.json` | 07:32:31.272 | 3 | 0.0825 | 2 |
| `2026-10-23T07-34-12-701Z-auth-image-82ba1c55-d6d1-4e18-9a03-435efa795993.json` | 07:34:12.701 | 19 | 1.352763671875 | 2 |

Both snapshots have month `2026-10`, configured true / ready and zero
queued/active/retrying work at capture time. The interval adds **16 requests /
1.270263671875 locally reserved PU / zero OAuth attempts**, plus 21 cache hits
and 16 cache misses. The baseline already contains three requests and 16 cached
entries, so this is neither a cold session nor an isolated one-SHOW measurement.
The receipts do not identify which intervening actions caused each request.
Do not attribute the entire interval to one image, extrapolate sessions/month
from it, or equate reserved PU with provider billing. Cache bytes rise from
64,762 to 704,144 and entries from 16 to 32. Snapshot memory admission of zero
is not a browser/GPU peak-memory measurement.

Runtime files are unchanged since the passing endpoint repair (native8381/0/1,
both builds and all nine native checks). Only evidence/status documentation is
updated here; no new tests, server restart, provider call, credential read,
staging or commit. The observed 4173 listener remains PID39317; 4174 is stopped.
Earlier failed attempts and every historical receipt remain retained. Other
Phase 2b work stays deferred under the same 50-path allowance.

### Remaining rendering checks on the small box

Keep only one S2-enabled globe tab. Use the already-rendered small box; do not
press USE VIEW, SELECT BOX or CLEAR. Set up this passive command shortcut once:

```sh
cd /Users/getumwanna/Documents/GEV
source /Users/getumwanna/.nvm/nvm.sh
nvm use 24.22.0
cap() { node .gev-logs/phase2b-i1/real-check-preparation/checkpoint.mjs "$1"; }
```

1. Record the displayed UTC acquisition date, scene cloud percentage (or Unknown)
   and loaded HUD/source label. It must identify S2 10 m. Check thumbnail/overlay
   Copernicus source and capture-year credit. The earlier successful SHOW is not
   being requested again as an authentication test.
2. In A / B, retain the existing CDSE date as A and assign a different CDSE date
   to B. Confirm both render; record both dates/cloud values. If only one usable
   date exists, report A/B unavailable rather than claiming a pass.
3. Wait for loading to finish and run `cap render-loaded`. If Restore view is
   already available, use it first: it restores the pose saved before the first
   fit, not the latest manual pan. Then deliberately pan/zoom and remember that
   view, press Fit imagery resolution, and press Restore view again. This second
   restore must return to the deliberately remembered pre-fit view; selected
   bounds stay fixed throughout. Confirm SWAP trades sides without changing
   dates. Repeated assignments/SWAP must not continually auto-fit. If the first
   successful assignment's automatic fit was not observed, leave it unverified
   and watch the next fresh capacity box's first assignment.
4. EXPORT A and EXPORT B. Inspect both PNGs for the correct dated image and
   visible Copernicus source/year credit. The small box exports a 768 × 272
   canvas: its 200 × 200 image content stays at native size with credit padding
   and a 72-pixel footer. Run `cap render-controls`. Fit, Restore, SWAP and export
   must add no provider requests/PU once the two images are loaded. Do not scroll
   cards, change sources or change filters between these two captures.
5. Separately try mixed S2 10 m / HLS 30 m A/B. Once both are loaded, manual Fit
   must use the coarser 30 m source; each side's date/source/HUD/credit must remain
   correct. NASA coverage unavailable is an incomplete mixed-source check.
6. Check max scene cloud 100 → 50 → 100 (or choose a threshold that exercises
   available cards), visible-card-only CDSE thumbnails, narrow layout without
   horizontal overflow and keyboard access/visible focus for controls. Cloud
   filtering may cause a separate query; it is per scene, not selected-box cloud.
   Unknown clouds are included at100 and excluded below100. Turn S2 OFF afterward
   and confirm HLS remains usable. Record safe notices rather than forcing quota
   or authentication failures.

The renderer retains the pose from its first fit until Restore consumes it;
a subsequent manual Fit then captures a new pose. Restore alone does not rearm
automatic fitting for that mode. Report a mismatch instead of changing the box
or treating a camera jump as a pass. For
rendered-memory measurement, note the actual tool, baseline and peak if available;
otherwise explicitly report peak memory unmeasured.

### Remaining capacity checks: three fixed boxes

Confirm the account's actual free-tier numerical quotas/reset and before/after
dashboard usage if not already reported. Do not share account identifiers or
secrets. GEV's local ceiling stays8,000 requests AND8,000 PU monthly; minute
pacing/backoff and cache bounds remain unchanged.

Run typical, heavy and oversized in that order. Before opening each link, turn
S2 OFF in all globe tabs. Open it in a fresh/reloaded document, not by changing
only the existing fragment. The links restore S2 OFF, cloud100 and an exact box.
Keep the box and native resolution fixed throughout that case.

| Fixed view | Native 10 m grid | Full-image Process parts per date before retries/cache | PNG with credit footer |
| --- | --- | ---: | --- |
| [Typical](http://localhost:4173/#v=2&lat=40.3200&lon=-74.2200&alt=30000&heading=0&pitch=-90&roll=0&style=normal&map=esri-imagery&l=1&lo=1.w.-7427865_1.s.4028421_1.e.-7416135_1.n.4035579_k.o.n_1.c.0) | 1000 × 800 | 1 | 1000 × 872 |
| [Heavy](http://localhost:4173/#v=2&lat=40.3200&lon=-74.2200&alt=50000&heading=0&pitch=-90&roll=0&style=normal&map=esri-imagery&l=1&lo=1.w.-7433958_1.s.4022871_1.e.-7410042_1.n.4041129_k.o.n_1.c.0) | 2040 × 2040 | 1 | 2040 × 2112 |
| [Oversized](http://localhost:4173/#v=2&lat=40.3200&lon=-74.2200&alt=50000&heading=0&pitch=-90&roll=0&style=normal&map=esri-imagery&l=1&lo=1.w.-7436667_1.s.4028421_1.e.-7407333_1.n.4035579_k.o.n_1.c.0) | 2500 × 800 | 10 | 2500 × 872 |

For each case, use the matching prefix (`typical`, then `heavy`, then `oversized`)
with the shortcut above. The additional cards/single checkpoints are passive;
they separate search/thumbnail overhead from full-image work without adding any
provider acquisition.

```sh
cap typical-before
# Enable S2; leave the card strip unscrolled and wait for visible thumbnails.
cap typical-cards
# SHOW the first CDSE date; wait for the full 10 m image.
cap typical-single
# A/B: reuse that first date as A; load a second distinct CDSE date as B.
cap typical-two-dates
# Replace A with a third distinct CDSE date; B remains date2.
cap typical-three-dates
# Within15 minutes: turn S2 OFF/ON without reloading/changing the box or filter.
# Repeat the same first date, first/second A/B, then third/second A/B sequence.
# Do not scroll or introduce another date. Wait for work to settle.
cap typical-warm
# Scroll once to newly visible CDSE cards; wait for those thumbnails.
cap typical-scroll
```

Record each phase's elapsed time, the number of visible/loaded CDSE thumbnails,
three actual acquisition dates/cloud values, native dimensions and any queue,
backoff, coverage or memory refusal. Wait for queued/active/retrying work to
settle before after-snapshots. If fewer than three usable dates exist, record
only the completed variants; never invent acquisitions.

Do not wipe the cache or ledger to force a cold result. Mark already-cached work
as warm. A warm repeat should add no acquisition for the exact same cached inputs;
Catalog TTL expiry, different dates/filters, newly visible thumbnails or retries
can add calls and must be recorded. If rendering at a different viewport exposes
more cards, note that too. The separate cards/single checkpoints let the agent
calculate these costs instead of assuming three thumbnails.

Watch the first full-image assignment on each fresh box for one automatic fit;
manual Fit/Restore must never change bounds/request dimensions. In A/B, fit uses
the coarser loaded image. The oversized grid must use ten clipped pieces, with
452-pixel right edges and288-pixel bottom edges, never enlarged request bounds
or downsampled imagery. The heavy case may reach the explicit128MiB admission
limit: report any refusal and the blocked variant; do not reduce resolution or
change the box. A single export after unpinning the other slot does not pass a
previously blocked A/B export.

Reference estimates only: three-date typical≈9.32 reserved PU, heavy≈47.82 PU,
oversized≈22.96 PU before extra cards/retries. Actual measured deltas replace
these planning figures; local reservations are not exact provider billing. No
intentional quota-exhaustion or429 test is requested. Keep peak process/GPU
memory separate from checkpoint admission counters.

Report rendering PASS/FAIL/unavailable observations, receipt paths, dates/clouds,
actual quota/reset and per-case timings/dimensions/limits. The agent can calculate
all numerical deltas directly from the safe receipts. On an unexpected error,
turn S2 OFF and report it before continuing the larger checks. No final I1
acceptance or commit occurs until the remaining evidence is reviewed explicitly.


## Agent browser authorization and bounded live run — October 23, 2026

The user explicitly lifts the project browser-denial rule and authorizes headless browser automation on localhost4173 plus standard Node24.22.0 server restarts. The agent may now perform the remaining real rendering/UI and typical/heavy/oversized capacity checks, within a fresh-baseline whole-run cap of300 CDSE ledger requests AND300 ledger PU. Credentials/tokens stay unread and unlogged, server-side. No product fixes during the run without asking; record failures and continue independent checks, with no repeated quota-burning failing step more than once. Preserve caches, selected boxes, native resolution and all historical evidence. Screenshots, exports and logs remain ignored under `.gev-logs/phase2b-i1/`. The user retains dashboard quota/reset review and final visual sign-off/explicit acceptance.

Run evidence directory: `.gev-logs/phase2b-i1/agent-live-cucuukcq`. Authorization and pre-run source hashes are in `authorization.json`. Outcomes follow after observation; no pass is inferred from this approval.


## Agent-run I1 results and visual stop — October 23, 2026

The browser authorization recorded above is now exercised and persists for this
project. Full report/evidence: `.gev-logs/phase2b-i1/agent-live-cucuukcq/REPORT.md`, with machine results in
`summary.json`, exact capture receipts in `checkpoints/`, screenshots and six
PNG exports opened by the agent. No product-code repair was made during the run.
The pre-run source hashes and final scope audit distinguish documentation and
ignored verification artifacts from runtime changes.

A single baseline of19 requests /1.352763671875 PU was retained through both
browser backends and every case. Final81 requests /81.96134765625 PU means
**62 requests /80.608583984375 reserved PU**, below the whole-run300/300 cap.
One OAuth attempt occurred without inspecting/logging credentials or tokens.
All recorded provider HTTP statuses are200; no retry/guard cancellation observed.
The approximate busiest completion-time60-second window was14 requests /
47.6257 reserved PU; this is an observational approximation, not a rate-limit
stress test or the provider accounting clock. Requests were guarded/serialized.
No cache/ledger clear, box change, downsampling, paid call, app asset addition,
staging or commit was performed. Normal-HMR4173 PID39317 remains up;4174 stopped.

| Case, three distinct dates | Measured cold requests / PU | Estimate | Warm additional | One scroll additional |
| --- | ---: | ---: | ---: | ---: |
| Typical1000×800 | 8 /9.3664 | 7 /9.3162 | 0 /0 | 2 /0.1006 |
| Heavy2040×2040 | 7 /47.8232 | 7 /47.8232 | 0 /0 | 3 /0.1875 |
| Oversized2500×800 | 35 /22.9783 | 34 /22.9582 | 0 /0 | 3 /0.0601 |

Typical and oversized each expose one extra thumbnail while selecting the third
date. Oversized retains ten clipped Process pieces per date (30 cold pieces
across three dates), including452-pixel right edges and288-pixel bottom edges.
Three-date cold monthly equivalents under both local8000 ceilings are854,167
and228; including the measured scroll they are **800,166,210**. These are local
reserved-usage estimates, not provider-billed/account-wide guarantees. Actual
user dashboard allowance/reset/reconciliation is still pending. The oversized
three-date estimate adds one native third grid to the earlier two-date fixture.

PASS for observed data/control behavior: small-box two-date S2, HUD10m, capture
dates and Copernicus2026 credits, all six inspected PNGs, saved camera restore,
SWAP, unchanged box, zero-usage loaded controls/exports, one-time camera fit,
no repeated fit after a manual movement/date reassignment, mixed S2/HLS metadata
and30m fit, cloud15→8→15, sampled visible-only thumbnails, keyboard focus and
activation, no horizontal overflow, HLS data retained after S2 OFF, all native
capacity dimensions and exact warm reuse. Small A/B exports are768×272 with
200×200 source content and footer/padding; typical1000×872 and oversized2500×872
retain native source pixels plus72-pixel footer. The report links each PNG.

**FAIL: actual on-globe image painting.** Both Metal and SwiftShader automated
sessions show blank/black globe areas (a later narrow capture blank/white), with
zero terrain tiles/render commands at the inspected point, despite loaded-image
metadata, ray/ellipsoid intersection and valid image exports. No cause is proven
and no product repair was attempted. Mixed-source/HLS pixel comparisons therefore
remain incomplete even though source/date/fit metadata passes. Narrow screenshots
also show a voice-provider selector overlapping Details; the cause/state needs
visual review. Do not erase these limitations behind passed numeric assertions.

The first typical two-date UI checkpoint overlapped the third action and is
inconclusive. Its cold two-date cost comes from the per-request ledger before
that third action. An initial warm helper clicked a selected chip and correctly
unpinned it; its raw failure is retained. The corrected idempotent, sequential
warm confirmation observes all three configurations and adds zero provider usage.
These were ignored-harness corrections, never product fixes or weakened product
requirements. See `typical-warm-correction.json` and original case observations.

All seven sampled oversized thumbnail requests matched visible cards. Unknown
cloud behavior could not be exercised live because the observed scenes all had
cloud values. Late oversized process RSS sampling is separately qualified in
`memory-window.json`; physical GPU memory and early/typical/heavy peaks are
unmeasured. No forced429/quota-exhaustion or cache-eviction test was attempted.
The report and machine summary carry exact timings, dimensions and provenance.

Final I1 acceptance is **not granted**. The user retains dashboard quota/reset
confirmation and visual sign-off, and any proposed product repair requires
approval. Agent-owned browsers/processes are closed; all evidence, six duplicate
files and unrelated editor/index state are preserved. Other Phase2b stays deferred.
