# Phase 1 component gate and token correction

Reviewed October 20, 2026, America/New_York. **Stop before milestone 1.** Phase 1 implementation is approved conditionally, but B's license has not been established and baseline results are unavailable. No component was adopted, no Phase 1 shell dependencies installed, and none of the six upstream files changed.

## User direction and outcome

The user selected B (Arun Dass), subject to license/dependency review, and instructed that an unclear/restrictive license or heavy dependencies must lead to a report on A instead of proceeding. This report follows that condition. A is an evaluated alternative, not an automatically approved substitution.

The user also asked to keep accent `#38BDF8`, give Refreshed a distinct teal/cyan in both themes, and check contrast. The planned values and calculations are below. No token CSS exists yet; this corrects the specification without starting implementation behind an unresolved gate.

## B and requested A fallback

| Item | B — selected conditionally | A — requested fallback details |
| --- | --- | --- |
| Component | [Dashboard Sidebar, Arun Dass](https://21st.dev/@arunjdass/components/dashboard-sidebar) | [Dashboard with Collapsible Sidebar, Sonu kumar](https://21st.dev/@uniquesonu/components/dashboard-with-collapsible-sidebar) |
| Visual role | Neutral navigation/sidebar to fit a surrounding layout | Fuller sidebar/header/content-frame composition |
| Public license evidence | `license` empty; `license_url`, `source_url`, `copyright_notice` null | Same empty license and null source/license/copyright fields |
| Author/source review | No component-specific source/grant located through the linked public author/profile repositories | No component-specific source/grant located through the linked public author/profile repositories |
| Declared additional npm library | `lucide-react: latest` | `lucide-react: latest` |
| Additional 21st registry component dependencies | None declared | None declared |
| Planned foundation | React/React DOM and Tailwind | Same |
| Dependency finding | No declared chart, animation or state-management package; no evidence of a heavier declared graph than A | Same declared library count; more demo composition is not evidence of a smaller runtime bundle |
| Adoption decision | **Not cleared: license unclear** | **Not cleared: license also unclear** |

These are bounded public-evidence findings, not a claim that a license does not exist or that either author chose a restrictive license. An explicit grant may be available through the account's component-license view or from the author. No such grant was available to this review. Do not infer MIT from the platform, another package's license, or a Tailwind comment inside demo output.

[21st's terms](https://21st.dev/terms), sections 2–3, distinguish authors' component rights from marketplace previews/media and impose reuse conditions. They do not supply the missing component-specific permission in this record. No copied preview or demo content is being added to the product or public repository.

Required next evidence is a license/grant covering the chosen component and intended local adaptation/redistribution, or a separately approved licensed alternative. This review does not contact authors, create accounts, accept agreements, or install another shell on the user's behalf.

## Dependency footprint: what is and is not known

Read-only npm metadata for `lucide-react@1.60.0` reports:

- License: ISC.
- No declared runtime dependencies; React and React-types are peers.
- Full package unpacked size: 36,273,527 bytes, approximately 34.6 MiB.
- The complete icon package size is **not a measured browser bundle size**. [Lucide's React documentation](https://lucide.dev/guide/react) describes tree shaking: selected icon imports can exclude unused icons.

Metadata source: [versioned npm package record](https://registry.npmjs.org/lucide-react/1.60.0). No package was installed for these findings. A future adoption must pin a reviewed version instead of retaining `latest`, inspect the resolved lockfile/peer graph, and measure actual built imports. There is no dependency-weight reason established here to prefer A over B; the unresolved license is the active component gate.

## Distinct Refreshed tokens and contrast

Keep accent **`#38BDF8`**. Change Refreshed text to:

- Dark theme: **`#2DD4BF`**, teal.
- Light theme: **`#0F766E`**, teal.

The calculation uses the standard sRGB linearization (threshold 0.04045), relative luminance weights 0.2126 / 0.7152 / 0.0722, and `(lighter + 0.05) / (darker + 0.05)`. Comparisons use unrounded values; ratios below are displayed to two decimals. The normal-text minimum is 4.5:1. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

| Foreground / role | Background | Contrast | Normal-text threshold |
| --- | --- | --- | --- |
| Refreshed dark `#2DD4BF` | Dark page `#0B0F14` | 10.32:1 | Pass |
| Refreshed dark `#2DD4BF` | Dark panel `#121923` | 9.49:1 | Pass |
| Refreshed light `#0F766E` | Light page `#F8FAFC` | 5.23:1 | Pass |
| Refreshed light `#0F766E` | Light panel `#FFFFFF` | 5.47:1 | Pass |

The unchanged sky-blue accent has only 2.14:1 contrast against white, so it must not become small light-theme text. Retain it for the brand/fill/decorative role and use readable text/border roles. `#0F172A` text on that accent is 8.33:1. Visible “Refreshed” text and separate feed-health text remain required; hue alone never communicates status.

This is a token-pair calculation, **not** a rendered accessibility pass. Actual opacity/backdrops, font size/weight, focus, selected/hover/disabled states and responsive layout still require implementation-stage checks.

## Baseline and milestone state

The approval message contained two bracketed baseline alternatives saying results were in STATUS. The actual file still listed them as pending. When asked for the missing results, the user answered **“I don't have it.”**

- `test:track`: no new result available.
- Manual individual layer outcomes: no new result available.
- FPS baseline: no new result or explicit waiver available.
- Earlier unit/build/doctor results remain historical Phase 0 evidence; they do not fill these gaps.
- The previous automatic localhost browser denial is still recorded; no alternative browser/CDP/harness workaround was attempted.

Implementation approval itself is recorded and is not being requested again. The unresolved component condition and baseline evidence/waiver must be addressed before product changes. **Milestone 1 has not started**, so there are no upstream implementation diffs to present yet. Once eligible, work milestones 1–4 in order, show the six upstream diffs after milestone 1, and stop for Phase 1 acceptance. Phase 2 remains unapproved.
