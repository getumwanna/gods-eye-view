# Phase 1 component gate and token correction

Reviewed and updated October 20, 2026, America/New_York. **Resolved: user selected official MIT shadcn/ui and explicitly waived every missing Phase 0 baseline check. Phase 1 implementation is approved and milestone 1 is complete; milestone 2 is underway. Neither 21st candidate was adopted. Phase 2 remains unauthorized.**

## Current decision: official MIT shadcn/ui

The user explicitly replaced the 21st selection with the official shadcn/ui Radix sidebar and approved continuing Phase 1 within the exact six-file upstream allowlist. The earlier B/A findings below are preserved as historical public-evidence review, not a current implementation hold.

- Source pin: `ba1503c64472b82256d9de95e2e62c5901a38e8b` in [shadcn-ui/ui](https://github.com/shadcn-ui/ui/commit/ba1503c64472b82256d9de95e2e62c5901a38e8b).
- Code license: [MIT, copyright 2023 shadcn](https://raw.githubusercontent.com/shadcn-ui/ui/ba1503c64472b82256d9de95e2e62c5901a38e8b/LICENSE.md). Preserve the copyright and permission notice with copied source.
- Explicit variant: [Radix sidebar](https://ui.shadcn.com/docs/components/radix/sidebar), with source under `apps/v4/registry/new-york-v4/`. The generic documentation URL redirects to Base UI; do not mix variants.
- Needed source files: `ui/sidebar.tsx`, `ui/button.tsx`, `ui/sheet.tsx`, `ui/input.tsx`, `ui/separator.tsx`, `ui/skeleton.tsx`, `ui/tooltip.tsx`, `hooks/use-mobile.ts`, and `lib/utils.ts`.
- The official current source imports `cn`, `class-variance-authority`, `lucide-react`, and the `radix-ui` umbrella alongside React. The approved implementation adapts the four used Radix primitives to individual `@radix-ui/react-slot`, `@radix-ui/react-dialog`, `@radix-ui/react-separator`, and `@radix-ui/react-tooltip` imports. This reduces installed scope and must be recorded as an adaptation.
- Selected direct versions at the read-only review: `cn@0.5.0` (MIT), `class-variance-authority@0.7.1` (Apache-2.0), and `lucide-react@1.60.0` (ISC). The lockfile records the installed Radix primitive versions. `class-variance-authority` brings `clsx` transitively; the current official `utils.ts` simply reexports `cn`.

No 21st component source, preview media, mock dashboard metrics, or marketplace metadata is being adopted. Milestone 1 installed the approved shell dependencies; component integration proceeds in milestone 2.

## Historical 21st selection and review outcome

The user selected B (Arun Dass), subject to license/dependency review, and instructed that an unclear/restrictive license or heavy dependencies must lead to a report on A instead of proceeding. This report follows that condition. A is an evaluated alternative, not an automatically approved substitution.

The user also asked to keep accent `#38BDF8`, give Refreshed a distinct teal/cyan in both themes, and check contrast. The planned values and calculations are below. No token CSS exists yet; this corrects the specification without starting implementation behind an unresolved gate.

## Historical B and requested A fallback

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

Historical next-evidence requirement for the 21st candidates: a component-specific permission grant or an approved licensed alternative was required. The subsequent user choice of official MIT shadcn/ui satisfies the alternative path; neither 21st candidate is adopted.

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

The earlier approval message contained bracketed baseline alternatives; when asked for missing results, the user answered “I don't have it.” The subsequent user message explicitly waived **all missing Phase 0 baseline checks**, including browser/tracking checks, individual layer outcomes, and GPU/FPS measurements. These checks remain unperformed/unverified and must never be recorded as passing. Historical unit/build/doctor results remain unchanged.

The user also explicitly chose official MIT shadcn/ui, resolving the component-selection hold. Phase 1 implementation is approved under its exact six-file upstream allowlist. Milestone 1 is complete, its six-file patch was shown to the user, and its checks are in `PHASE-1-VALIDATION.md`. Continue milestones 2–4 in order and stop at Phase 1 acceptance. Phase 2 is not authorized.
