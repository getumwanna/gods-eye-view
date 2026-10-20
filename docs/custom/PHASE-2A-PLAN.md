# Phase 2a — Library and source directory file-level plan

October 20, 2026. **Approved with conditions; implementation has not started.** Shipping adopted pin `064d51f7be2675f1c69e16068e9c49d1a60144d1` with all non-browser gates passing. Shipping hub QA 9/9 matches its fresh receipt and all Street Level smoke checks are user-reported passed. Tracking is incomplete after 88 successful assertions and a navigation/context error; the unchanged root server is in temporary HMR-off mode for a user rerun. Preserve 4174/logs until tracking completes; then stop 4174 and produce the Phase 2a reverification/Ajv comparison before milestone 1. Phase 2b remains deferred.

## Scope and phase gates

Phase 2a delivers the descriptive source registry, Data Sources directory, Knowledge Center, six case pages, and search within Library. Existing GEV documentation is bundled from explicitly admitted local files; external articles receive original summaries and links. The globe stays vanilla JavaScript at `/`; the React hub stays at `/hub/`, on the same localhost-only server.

Phase 2b will be planned **after 2a ships and is accepted**. Its future scope is acquisition ownership, read-only summaries, browser-direct adapters, an upcoming-launch query, and the dashboard. This document does not design or authorize those services. Recording, new data feeds, global Cmd/Ctrl+K, saved workspace features, AI search, and hosting remain outside 2a.

Before milestone 1, complete and verify the approved shipping integration, including user-run `qa:hub`, synthetic `test:track --offline-imagery`, and the Street Level manual smoke check on localhost:4173. Then retain the rehearsal logs, stop the verified 4174 listener, and reverify this plan against the new pin. Check layer IDs, conditional credentials versus setup key IDs, source/coverage facts, admitted documentation sections/hashes, dependency compatibility, and exact file paths. Present changes, compare both Ajv approaches with measured bundle cost, and resolve amendment approvals before implementation. Work through the four milestones in order; milestones 2 and 3 stop for editorial review before committing, followed by final Phase 2a acceptance.

## Upstream edit allowlist — exactly two files approved for Phase 2a

“Upstream” means paths present in the original GEV pin `de2138e84c1778fd98a48b7c9fd0b9788c318946`, not custom files now tracked in this fork.

| Existing upstream path | Proposed change |
| --- | --- |
| `package.json` | Exact reviewed Library dependency versions, `check:library`, and content-validation preflights for both production build commands; never for `dev` |
| `package-lock.json` | Lock that reviewed dependency graph, preserving unrelated versions |

No upstream application, layer, provider, scene, security, documentation, stylesheet, or test file is proposed for editing. In particular, leave `vite.config.js`, `src/main.js`, `style.css`, and `src/tooling/viteBuild.test.mjs` unchanged during 2a. Record the two package edits in `CUSTOMIZATION.md`.

The user approved only these two original-upstream paths for Phase 2a; any additional original-upstream edit requires an amendment. Rehearsal import/repair limits are separate and approved in `UPSTREAM-SYNC-PLAN.md`.

Proposed direct dependencies, **not installed by this planning work**:

| Package | Purpose / boundary |
| --- | --- |
| `react-markdown` | Render licensed local Markdown as React elements; hub graph only |
| `remark-gfm` | Existing documentation tables and other GFM syntax |
| `unified`, `remark-parse` | Public parser APIs shared by section extraction and search text; declare direct imports rather than relying on transitive packages |
| `minisearch` | Local full-text index, field weighting, and prefix matching |
| `ajv` (development dependency, original proposal) | Node-side schema validation for the explicit check command and production build gates. This original role cannot also provide full schema validation inside the development Library; the pending role amendment below must be resolved before milestone 1 |

These projects publish MIT licenses: [React Markdown](https://github.com/remarkjs/react-markdown), [remark/GFM](https://github.com/remarkjs/remark-gfm), [unified](https://github.com/unifiedjs/unified), [remark parser](https://github.com/remarkjs/remark), [MiniSearch](https://github.com/lucaong/minisearch), [Ajv](https://github.com/ajv-validator/ajv). Milestone 1 must review and record exact compatible versions, transitive licenses, Node/React compatibility, install scripts, audit findings, and installed/bundled size before adopting them. Keep the Phase 1 local `clsx` + `tailwind-merge` helper. Do not add MDX, raw-HTML execution, a remote search service, or another UI library.

## Validation boundary and pending post-pin amendments

`npm run check:library` must fail on invalid authored content. Both production commands, `npm run build` and `npm run build:panel`, must run that check as a strict preflight and exit nonzero on failure. The root hub build must also enforce validation from a Rollup-only `buildStart` hook under `build.rollupOptions.plugins` in the existing project-owned wrapper. Do not add another top-level Vite plugin or change the upstream plugin-prefix test. The Node validator must defer content/schema reads, parsing and validation until the check or production hook runs; importing its module during config evaluation must not validate anything. Do not infer development versus production from `process.argv` or `NODE_ENV`, and do not add validation to the dev command or config-loading path.

**Invalid content must never prevent development-server startup or stop the globe.** In development, validation errors belong inside Library routes only. The shell, Dashboard, Settings and globe must continue working. The Library must show an accessible content-error state rather than silently displaying stale content. Its guarded loader must catch malformed content/schema JSON, invalid schemas and records, missing files/sections, unsafe references, asynchronous imports and rendering failures. Content edits, deletions and recovery through HMR/reload must preserve that isolation.

The mandatory post-pin review must settle two proposed implementation amendments before milestone 1. They are explicitly pending; the approved inventory and original dependency category recorded above are not silently amended by this document:

- Proposed new project-owned path: `src/custom/shared/sourceRegistry.generated.js`, a deterministic validated metadata projection from canonical `content/sources.json`. The already planned `scripts/check-custom-library.mjs --write-projection` could generate it without another command file. Existing globe metadata APIs would import only this last validated projection, never editable JSON, Markdown or schema code. It is generated output, not a second authored authority. Checks and production builds would reject a stale projection; invalid development edits would leave globe metadata intact. Approval would change the original **62-path inventory to 63 paths**, with the same two original-upstream files.
- Pending Ajv-role comparison requested by the user: compare **(a)** server-side development validation passing only normalized errors to Library against **(b)** lazy Ajv and schemas in the hub. Neither design is selected. After exact-version review, measure actual raw/gzip/Brotli Library chunk delta and initial hub/globe graph impact. Compare full-schema coverage, HMR/recovery, missing/stale inputs, offline behavior, dependency category, server endpoint/lifecycle maintenance, and existing Vite plugin-prefix/allowlist constraints. Present exact file/dependency-role amendments for approval before adoption. Never send raw server content, secrets, or keys in validation diagnostics, throw during config loading, or stop the dev server/globe because content is invalid.

These choices remain part of the required post-pin plan review. No generated projection, browser validator, planned dependency or Phase 2a content is created by this documentation update.

## Exact project-owned existing files to change

| Path | Responsibility |
| --- | --- |
| `build/customHub.js` | Add a build-only Rollup validation hook under `build.rollupOptions.plugins`; never validate content while evaluating Vite config. Preserve the standalone configuration and top-level Vite plugin prefix |
| `hub/src/App.tsx` | Lazy Library routes and document loading/error states |
| `hub/src/router.js` | Bounded knowledge/case/search routes; preserve existing source routes and unknown-route behavior |
| `hub/src/components/HubShell.tsx` | Library active navigation, route title and focus behavior |
| `hub/src/pages/Library.tsx` | Replace Library placeholders with real section navigation and scoped search |
| `hub/src/pages/SourceGuide.tsx` | Render the canonical directory record while retaining setup actions and old URLs |
| `hub/src/styles.css` | Articles, accessible tables, citations, results, disclosures; existing tokens in both themes |
| `src/custom/shared/layerMetadata.js` | Preserve source/layer metadata APIs and derive their facts from the canonical registry through a validated projection. Do not import editable content or browser schema validation into the globe graph; settle the generated-projection amendment described above before implementation |
| `src/custom/hub/router.test.mjs` | Route/real-application rendering coverage, with an admitted-file raw-import test adapter |
| `src/custom/globe/feedStrip.test.mjs` | Preserve existing metadata API contracts while testing the canonical-registry projection |
| `scripts/qa-custom-hub.mjs` | Add bounded Library navigation/search/handoff checks and evidence of zero Library-originated provider calls |
| `AGENTS.md`, `CUSTOMIZATION.md`, `STATUS.md`, `SETUP.md` | Approved scope, source provenance, authoring/check commands, acceptance and update procedures |


## Approved new-file inventory — implementation remains gated

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

Use fixed, explicitly admitted Vite raw-text globs in `upstreamDocuments.ts` and the Library catalog for Markdown, JSON manifests and schemas. A deleted admitted file must become a missing catalog entry handled by the Library loader, rather than an unresolved direct import. Parse JSON, compile/validate schemas, check manifest references and select admitted sections inside caught Library loading code; never import editable JSON through the JSON compiler. Filter admitted README sections before exposing Library pages. Markdown is bundled locally at build time and rendered by React Markdown in the browser; this does not promise prerendered HTML. Keep the Library loader behind its route boundary, with caught asynchronous and rendering failures and HMR handling that replaces content with either valid data or the Library error state. The project-owned SSR adapter resolves only these admitted raw-text inputs with repository containment checks and uses the real production corpus in integration tests.

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

**Prerequisite stop:** verified shipping integration and the post-pin plan/Ajv review must be complete. Adoption itself is approved with conditions. Resolve file-list, allowlist, and dependency-role amendments before milestone 1. This documentation checkpoint does not start implementation.

1. **Registry and directory.** Review exact dependency versions, licenses, compatibility, install scripts, audit findings, and bundle costs before adoption/installation; record the review in `PHASE-2A-DEPENDENCIES.md`. Add schemas, canonical source/product/value bindings, explicit validator, globe-safe metadata adapter, directory, and old-route compatibility. Verify invalid content fails checks/builds while dev and the globe remain usable. Show the two original-upstream diffs, then commit this buildable milestone.
2. **Knowledge Center.** Admit the reviewed upstream doc sections and author the nine original guides/summaries. Check rendering/links, real-corpus results, stable headings, provenance, changed-input rejection, route/focus behavior, and lazy graph isolation. Measure corpus/search/bundle costs. **Stop before committing:** list every new article with its local path and primary references. Explicitly identify the two Spatial Intelligence summaries and the original URLs above for the user's comparison. Wait for editorial review, resolve requested changes, rerun affected checks, and commit only after that review is resolved.
3. **Cases.** Author all six original pages; label interactivity limits, verify each share-link's actual restored scope, and preserve notices. No new dataset or media asset is acquired; missing exact replay support yields an honest partial/view-only action. Run milestone checks, then **stop before committing:** list all six pages with local paths, evidence links, limitations, and globe CTA scope. Wait for user editorial review, resolve requested changes, rerun affected checks, and commit only after that review is resolved.
4. **Validation and acceptance review.** Run clean `npm ci`, `npm run check:library`, hub typecheck, `GEV_REQUIRE_ALLOCATION_GATE=1 npm test`, boundaries, doctor, and both production builds on supported Node. Preserve the established browser boundary: the CLI `qa:hub` harness remains user-run; use only permitted browser tooling for agent checks. Record actual outcomes and any explicit new waiver. Review the final upstream diff and customization ledger, commit the validation checkpoint, then stop for user acceptance.

Keep each milestone buildable: manifests and raw-content admission lists reference only content already present in that milestone, not articles scheduled for a later commit. Admit additional files as content and evidence are reviewed. The milestone 2/3 editorial stops are pre-commit gates, not reviews deferred until the end of the phase.

Focused tests must exercise schema failures and references; all existing layers and mixed value labels; both projections changing from one registry fixture; unsafe links/HTML and path/symlink escapes; retained notices and no automatic media; real-corpus/Unicode/empty/long search queries; result anchors and deterministic ranking; unknown coverage/health; full existing handoffs; and zero provider/API calls originating in Library. Negative validation tests must include malformed JSON, invalid schema definitions and schema fields, missing admitted files or sections, rejected paths, dangling references, and stale generated metadata. Each invalid case must fail `check:library` and both production build commands. During development the same cases must leave the server running, Dashboard and Settings usable, and the globe usable with its last validated metadata; only Library displays an accessible error state. Test invalid edits and file deletion while the server is already running, then restore the inputs and verify Library recovery through HMR/reload without uncaught errors or a server-wide Vite error overlay. Provider fixtures are tests, never displayed as live content. Browser acceptance includes dark/light, desktop/mobile, keyboard access, readable tables, empty/error states, and every published case CTA. No redundant documentation-only tests are needed for this plan itself.

Phase 2a is accepted only when the registry covers every current layer, the directory and compatibility APIs share it, admitted upstream docs and original articles render with provenance, all six honest case pages are present, Library search works across the published corpus, required checks are recorded, and the user accepts the phase. Unverified checks remain explicit gaps, never implied passes.

## Upstream integration and mandatory post-pin review

Rehearsal results and every repair are in `docs/custom/UPSTREAM-SYNC-REHEARSAL.md`. User reruns on 4174 passed: hub 9/9 with its matching receipt, and synthetic tracking 109/0/0 as the user report. Adoption of frozen `064d51f7be2675f1c69e16068e9c49d1a60144d1` and the integration execution plan are approved, including persistent project-owned Hong Kong/Taiwan-off policy, accepted Ontario keyless coverage loss, and carry-forward repairs. The isolated candidate adds `build/customProviderPolicy.js`, `scripts/check-custom-provider-policy.mjs`, and `src/custom/server/providerPolicy.test.mjs`, and changes the project-owned `build/customHub.js`; all are explicitly outside the six-file rehearsal manual repair list and introduced under the separate integration approval. Offline policy scenarios and focused unit tests each pass 6/6. No further original-upstream manual repair is introduced. Shipping fast-forward is now complete; all non-browser shipping gates pass, while user/browser verification remains pending.

**Wait for user shipping hub/tracking/Street Level results.** The approved fast-forward is complete, all non-browser shipping gates pass, and localhost:4173 is running. Keep 4174 until shipping verification resolves, then stop only its verified listener and retain its logs. Produce `docs/custom/PHASE-2A-REVERIFICATION.md` against the adopted pin: exact layer IDs, conditional credentials versus setup key IDs, coverage/source claims, admitted files/sections/hashes, provenance, dependencies and implementation inventory. List changes and resolve amendments before milestone 1.

The generated metadata projection remains proposed. Compare server-side development validation passing only normalized Library errors against lazy hub Ajv with measured raw/gzip/Brotli Library chunk cost and initial hub/globe impact; cover HMR, missing/stale inputs, offline behavior, dependency role, lifecycle maintenance, and plugin/allowlist constraints. Neither design is selected. Preserve the two-file Phase 2a upstream allowlist and milestone 2/3 pre-commit editorial stops. Phase 2b waits until 2a ships and is accepted.

The latest shipping verification checkpoint is in `UPSTREAM-SYNC-REHEARSAL.md`: hub/manual checks are resolved, tracking alone requires a complete rerun summary. Earlier generic pending-user-check wording is historical. No dependency or generated-metadata/Ajv amendment has been selected; all file allowlists and editorial gates remain unchanged.
