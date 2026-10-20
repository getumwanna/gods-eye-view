# Phase 2a — Library and source directory file-level plan

October 20, 2026. **Proposal only; implementation and dependency installation are not approved.** Phase 1 was accepted by the user after the 9/9 `qa:hub` receipt on October 20; this Phase 2a proposal remains unapproved for implementation. Its dependency review correction is recorded separately in `PHASE-1-VALIDATION.md` and commit `7f21ab83`.

## Scope and phase gates

Phase 2a delivers the descriptive source registry, Data Sources directory, Knowledge Center, six case pages, and search within Library. Existing GEV documentation is bundled from explicitly admitted local files; external articles receive original summaries and links. The globe stays vanilla JavaScript at `/`; the React hub stays at `/hub/`, on the same localhost-only server.

Phase 2b will be planned **after 2a ships and is accepted**. Its future scope is acquisition ownership, read-only summaries, browser-direct adapters, an upcoming-launch query, and the dashboard. This document does not design or authorize those services. Recording, new data feeds, global Cmd/Ctrl+K, saved workspace features, AI search, and hosting remain outside 2a.

Phase 1's acceptance condition is resolved. Phase 2a implementation may start only after this file-level plan is explicitly approved. Work in the four milestones below, commit each with its evidence, and stop for Phase 2a acceptance. A request to prepare this plan does not authorize its code or dependencies.

## Upstream edit allowlist — exactly two files proposed

“Upstream” means paths present in the original GEV pin `de2138e84c1778fd98a48b7c9fd0b9788c318946`, not custom files now tracked in this fork.

| Existing upstream path | Proposed change |
| --- | --- |
| `package.json` | Exact reviewed Library dependency versions and a `check:library` command pointing at the new local validator |
| `package-lock.json` | Lock that reviewed dependency graph, preserving unrelated versions |

No upstream application, layer, provider, scene, security, documentation, stylesheet, or test file is proposed for editing. In particular, leave `vite.config.js`, `src/main.js`, `style.css`, and `src/tooling/viteBuild.test.mjs` unchanged during 2a. Record the two package edits in `CUSTOMIZATION.md`.

A literal zero-file option would replace direct upstream-document rendering with prewritten summaries or require maintaining a Markdown/search implementation. It changes the requested product or adds avoidable maintenance. The two-file proposal preserves the requested Markdown documentation and uses maintained libraries. Approval of this plan would approve only these two upstream paths; any additional upstream edit requires an amendment.

Proposed direct dependencies, **not installed by this planning work**:

| Package | Purpose / boundary |
| --- | --- |
| `react-markdown` | Render licensed local Markdown as React elements; hub graph only |
| `remark-gfm` | Existing documentation tables and other GFM syntax |
| `unified`, `remark-parse` | Public parser APIs shared by section extraction and search text; declare direct imports rather than relying on transitive packages |
| `minisearch` | Local full-text index, field weighting, and prefix matching |
| `ajv` (development dependency) | Validate the authored source/content manifests against JSON Schema at config load and in the explicit check command; never ship it in either browser graph |

These projects publish MIT licenses: [React Markdown](https://github.com/remarkjs/react-markdown), [remark/GFM](https://github.com/remarkjs/remark-gfm), [unified](https://github.com/unifiedjs/unified), [remark parser](https://github.com/remarkjs/remark), [MiniSearch](https://github.com/lucaong/minisearch), [Ajv](https://github.com/ajv-validator/ajv). Milestone 1 must review and record exact compatible versions, transitive licenses, Node/React compatibility, install scripts, audit findings, and installed/bundled size before adopting them. Keep the Phase 1 local `clsx` + `tailwind-merge` helper. Do not add MDX, raw-HTML execution, a remote search service, or another UI library.

## Exact project-owned existing files to change

| Path | Responsibility |
| --- | --- |
| `build/customHub.js` | Invoke local content validation through `withHubConfig`; preserve standalone configuration and plugin prefix |
| `hub/src/App.tsx` | Lazy Library routes and document loading/error states |
| `hub/src/router.js` | Bounded knowledge/case/search routes; preserve existing source routes and unknown-route behavior |
| `hub/src/components/HubShell.tsx` | Library active navigation, route title and focus behavior |
| `hub/src/pages/Library.tsx` | Replace Library placeholders with real section navigation and scoped search |
| `hub/src/pages/SourceGuide.tsx` | Render the canonical directory record while retaining setup actions and old URLs |
| `hub/src/styles.css` | Articles, accessible tables, citations, results, disclosures; existing tokens in both themes |
| `src/custom/shared/layerMetadata.js` | Derive existing source/layer metadata exports from `content/sources.json`; remove parallel authored source-name/layer facts |
| `src/custom/hub/router.test.mjs` | Route/real-application rendering coverage, with an admitted-file raw-import test adapter |
| `src/custom/globe/feedStrip.test.mjs` | Preserve existing metadata API contracts while testing the canonical-registry projection |
| `scripts/qa-custom-hub.mjs` | Add bounded Library navigation/search/handoff checks and evidence of zero Library-originated provider calls |
| `AGENTS.md`, `CUSTOMIZATION.md`, `STATUS.md`, `SETUP.md` | Approved scope, source provenance, authoring/check commands, acceptance and update procedures |


## New files to create after approval

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
```

These are planned outputs, not files created by this plan. No downloaded article copies, media, provider responses, credentials, search-query logs, or generated production indexes belong in Git.

## Registry contract and directory

`sources.schema.json` will use JSON Schema draft-07 with strict object shapes (`additionalProperties: false`), bounded strings/arrays, and a versioned root. `sources.json` contains three related collections:

| Collection | Required information |
| --- | --- |
| `sources` | Stable provider ID/name; product IDs/names; primary homepage/docs URLs; access tier and known setup-key IDs; product-specific coverage, update facts, cost notes, terms/license status, required attribution, restrictions, and evidence |
| `bindings` | Existing `layerId`, distinct `valueId`, human label, observation `kind`, product references, and required/optional capability references |
| `guideGroups` | Stable guide ID/name, member product references, and an explanation for umbrella guides such as `transit`, `gbfs`, and `cctv` |

Each product's coverage states its documented geographic footprint and known gaps. Publisher cadence, application refresh interval, and cache TTL are distinct facts with units; unknown values remain `null` plus an explanation. Evidence includes the local path/section, full upstream revision or custom content revision, reviewed date, canonical official URL where available, and `repo-documented`, `officially-reviewed`, or `unknown` status. Cost notes carry an “as reviewed” date. Missing published terms are shown as unknown, never inferred from GEV's code license.

Observation kind is **per displayed value**, using exactly `Live`, `Refreshed`, `Simulated`, `Estimated`, or `Static`. For example, OSM road geometry can support simulated traffic; CelesTrak orbital inputs support estimated positions. Neither source gets a blanket Live badge. Required, optional, and fallback products remain distinct. No new provider, request endpoint, key configuration, recorder retention right, or acquisition behavior is introduced.

Example binding (illustrative schema example, not a runtime fixture):

```json
{
  "layerId": "earthquakes",
  "valueId": "observations",
  "label": "Earthquake observations",
  "kind": "Refreshed",
  "sourceProductRefs": ["usgs/earthquakes"]
}
```

The validator cross-checks every current layer ID and known setup-key ID against existing owners. It rejects duplicate IDs, dangling product references, alias collisions, unknown kinds, unsafe URLs, and forbidden credential/health fields. Setup IDs refer to the existing safe setup catalog; no secret value or credential-derived string is stored. Provider request registries remain acquisition authorities; this registry owns descriptive Library/custom metadata and records evidence for its facts.

Preserve `getSourceGuide`, `getSourceGuides`, `sourceGuideHref`, `getLayerMetadata`, and `getLayerKindValues`, including existing return shapes and guide links. One registry edit must update both directory and custom layer metadata projections. Split operator/product terms where needed; umbrella guide IDs remain group landings.

Directory health reads **“Not checked in Library.”** Do not serialize live health, observation timestamps, loaded counts, cache sizes, or key presence into authored content. The review date describes documentation review, not feed freshness. All directory facts are labeled Static reference information; a separate “Observation kind” describes the associated data. Health and timestamps from actual acquisition are deferred to 2b.

## Knowledge Center, rights, and case pages

The explicit `library.json` manifest supplies stable IDs/slugs, content kind/category, title/tags, description, author, published/review dates, content path or admitted upstream document/heading range, upstream revision and input hash, evidence/source-product links, license/adaptation notices, and publication status. Cases add an honest interactivity classification, limitations, optional validated globe URL, and an exact description of the state that URL restores.

Initial upstream text admission is limited to selected sections of `README.md`, `docs/CURRENT-STATE.md`, `DATA_SOURCES.md`, `SECURITY.md`, `CONTRIBUTING.md`, `TESTING.md`, and `THIRD_PARTY_NOTICES.md`. Record the selected headings/hashes in the manifest and fail validation if an admitted section disappears or changes without review. Treat current authoritative runtime/source/security docs as primary; preserve historical labels on historical notes. Do not crawl all repository Markdown. MCP integration remains Phase 3; 2a can link its setup documentation without implementing an integration.

Use explicit static Vite `?raw` imports/lazy imports in `upstreamDocuments.ts` for the admitted paths. Filter admitted README sections before exposing them as Library pages. Markdown is bundled locally at build time and rendered by React Markdown in the browser; this is not a promise of prerendered HTML. A pure validator called from the existing custom config checks manifests and paths; **no new Vite content plugin** is needed. Keep the upstream test requiring appended plugins to be Tailwind plugins unchanged. The project-owned SSR adapter resolves only the admitted `.md?raw` imports, with repository containment checks; use the real production corpus in integration tests.

The nine original Knowledge articles cover the topics in their filenames. The two Spatial Intelligence pieces must first be read from their primary pages, then summarized in original language with author/title/date/link and a clear distinction between article claims and features verified in this checkout:

- [God's Eye View blew up, then Astra](https://www.spatialintelligence.ai/p/gods-eye-view-blew-up-then-astra)
- [I open-sourced God's Eye View](https://www.spatialintelligence.ai/p/i-open-sourced-gods-eye-view)

Never store, republish, or index those external article bodies, paywalled text, screenshots, or transcripts. If access is incomplete, disclose that limitation and leave the summary unpublished until adequately sourced. Do not fill missing evidence with assumptions. Original tutorials and case narratives follow the same original-summary-and-link rule. Licensed upstream repository documentation is shown explicitly as upstream documentation with preserved notices, not presented as original authorship.

Media is linked by default. `docs/media/README.md` expressly excludes README captures from the code's MIT grant; third-party datasets retain their own terms. No automatic GIF/image copying, remote image loading, iframe, or video embed is included. A future visual requires an individually reviewed permission/license, creator/source, modifications, and attribution, plus a plan amendment if it adds files.

| Case | Planned honest presentation |
| --- | --- |
| Nepal/Bhote Koshi | Explain bundled interaction and non-commercial data limits; 2021 imagery is historical context and the corridor progression is schematic, not a hazard model |
| Hurricane tracking | Partial: current advisories and existing weather history; no claim of long-term recorded replay |
| Launch reconstruction | Existing Space Missions capability, with estimated geometry/timing; no upcoming-launch query |
| Aircraft incidents | Demonstration; no imported incident track dataset |
| Satellite imagery change | Partial: existing Recent Imagery supports selected-box HLS 30 m / VIIRS 250 m dated A/B comparisons within documented product/date/coverage limits; use a demonstrably covered case. Arbitrary imagery/history remains demonstration-only; no new imagery service |
| WorldFX/Astra | Separate proprietary demonstrations; no local reconstruction capability implied |

A validated share URL only proves an accepted URL/state format. It does not prove a Director recipe, mission, target, or historical scene is restored. Test every published CTA in the permitted browser path and label its actual restored scope. Use “Open globe view” plus instructions for manual scene selection where the existing codec cannot encode the exact experience. Do not extend the globe codec in 2a. Omit unsupported actions rather than showing decorative buttons.

## Routes, safe rendering, and local search

```text
#/library
#/library/knowledge
#/library/knowledge/<slug>
#/library/cases
#/library/cases/<slug>
#/library/sources
#/library/sources/<existing-source-id>
#/library/search?q=<bounded-query>
```

Library navigation remains under the existing four-item shell. Articles expose title, provenance, review date, table of contents, readable citations, and limitations. Keep keyboard focus and heading announcements correct after hash navigation, including section links within the hash router. Map admitted relative doc links to Library routes; other repository links go to the pinned canonical upstream path. Never reinterpret arbitrary paths as file access.

Use `skipHtml`, no MDX/`rehype-raw`, controlled links, inert code blocks, and explicit URL-scheme/path checks. Preserve safe internal anchors; reject traversal, executable schemes, protocol-relative URLs, and unapproved assets. Render results/highlights as React text, never injected HTML. Tables need headers, captions or contextual labels, and horizontal scrolling on narrow screens.

One Library-local MiniSearch index covers published upstream sections, original articles, case narratives, and source-product descriptions. Use the shared remark parser to extract visible text/section IDs and the same heading-ID function for rendering and results. Build the index locally on the first search from the admitted, build-bundled corpus; keep it in memory for the session. No server, provider, external search request, query telemetry, or persistent user-query history is needed. Loading this app's static lazy content chunks is allowed.

Boost titles/headings/tags over body text; support type/category/source filters, prefix matching, clear no-results states, and source-linked section results. Bound queries to 160 characters and results to 30 per page. Exclude drafts, raw HTML nodes, repository-wide files, credentials, runtime feed records, and external article bodies. Lazy-load article content/search code within the hub so the globe graph gains no React, Markdown, MiniSearch, or Tailwind reset. Measure corpus size, search readiness, and incremental bundle size in milestone 2; record and review any unacceptable main-thread cost before adding more content. Global command palette and AI answers remain later work.

## Four implementation milestones and acceptance

1. **Registry and directory.** Review/pin dependencies; add schema, canonical source/product/value bindings, validator, compatibility adapter, directory, and old-route preservation. Prove complete layer coverage, unknown states, safe setup references, and no acquisition. Show the two upstream package diffs and dependency footprint in `PHASE-2A-DEPENDENCIES.md`.
2. **Knowledge Center and search.** Admit the bounded upstream corpus, author original guides/summaries, add safe rendering/links, and build the local index. Verify real-corpus results, stable headings, provenance, changed-input rejection, route/focus behavior, and lazy graph isolation.
3. **Cases.** Author all six original pages, label interactivity and limits, verify share-link restored scope, and retain required notices. No new dataset or media asset is acquired. Missing exact replay support yields an honest partial/view-only action.
4. **Validation and review.** Run clean `npm ci`, `npm run check:library`, hub typecheck, `GEV_REQUIRE_ALLOCATION_GATE=1 npm test`, boundaries, doctor, and both production builds on supported Node. Run the extended `qa:hub` only through a permitted browser path; record actual outcomes and any explicit waiver. Review the final upstream diff and ledger, then stop for acceptance.

Keep each milestone buildable: manifests and static imports reference only content files already present in that milestone, not articles scheduled for a later commit. Admit additional files as their content and evidence are reviewed.

Focused tests must exercise schema failures and references; all existing layers and mixed value labels; both projections changing from one registry fixture; unsafe links/HTML and path/symlink escapes; retained notices and no automatic media; real-corpus/Unicode/empty/long search queries; result anchors and deterministic ranking; unknown coverage/health; full existing handoffs; and zero provider/API calls originating from Library. Provider fixtures are tests, never displayed as live content. Browser acceptance includes dark/light, desktop/mobile, keyboard access, readable tables, empty states, and every published case CTA. No redundant documentation-only tests are needed for this plan itself.

Phase 2a is accepted only when the registry covers every current layer, the directory and compatibility APIs share it, admitted upstream docs and original articles render with provenance, all six honest case pages are present, Library search works across the published corpus, required checks are recorded, and the user accepts the phase. Unverified checks remain explicit gaps, never implied passes.

## Upstream-sync rehearsal proposal — before Phase 2b

Perform only after 2a ships, under a separately approved short execution plan. Create an isolated `codex/upstream-sync-rehearsal` branch/worktree from the accepted 2a SHA, leave the shipping branch untouched, and freeze a freshly verified upstream target SHA before merging. Current baseline remains `de2138e84c1778fd98a48b7c9fd0b9788c318946`.

Read-only research on October 20 found upstream main at `064d51f7be2675f1c69e16068e9c49d1a60144d1`: **72 commits and 151 changed files** beyond the pin. This snapshot must be rechecked when rehearsal is approved. The [pinned comparison](https://github.com/bilawalsidhu/gods-eye-view/compare/de2138e84c1778fd98a48b7c9fd0b9788c318946...064d51f7be2675f1c69e16068e9c49d1a60144d1) overlaps only `package.json` among our six upstream customizations; do not predict six textual conflicts. It removes an old panel-resize QA command and changes panel/StreetLevel behavior, satellite-cache freshness, camera sources/key requirements, and documentation. These require semantic review even where the merge is clean.

The rehearsal should merge that frozen target into the isolated branch, inventory actual conflicts, review the six customization boundaries and 2a source/doc hashes against new upstream facts, and run the new upstream-required gates plus hub typecheck, boundaries, doctor, both builds, Library validation and permitted browser checks. Any additional original-upstream repair path needs a reviewed allowlist amendment. Keep new provider use disabled pending its terms/configuration review.

Record before/after SHAs, affected custom files, required registry/editorial revisions, test/browser results and unresolved issues in a future `docs/custom/UPSTREAM-SYNC-REHEARSAL.md`. Review that report and decide whether to adopt the update before planning 2b. Rehearsal does not advance the authoritative pin or merge into the shipping branch; adoption requires separate approval. If declined, retain its report and abandon the isolated branch without resetting shipping work. **No rehearsal branch, merge, rebase, pin advance, or Phase 2b plan is executed by this document.**
