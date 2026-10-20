# Hub component provenance

The user approved the official MIT-licensed shadcn sidebar after the 21st.dev candidates did not provide a verified adoption license. No 21st.dev implementation is included. The shell contains no sample business metrics, account controls or demo people.

All vendored components below come from **shadcn-ui/ui**, commit **ba1503c64472b82256d9de95e2e62c5901a38e8b**, `new-york-v4`. The complete upstream MIT copyright and permission notice is preserved in [hub/SHADCN-LICENSE.md](../hub/SHADCN-LICENSE.md).

| Local component | Pinned source | License |
| --- | --- | --- |
| `hub/src/components/ui/sidebar.tsx` | [sidebar.tsx](https://github.com/shadcn-ui/ui/blob/ba1503c64472b82256d9de95e2e62c5901a38e8b/apps/v4/registry/new-york-v4/ui/sidebar.tsx) | MIT |
| `hub/src/components/ui/button.tsx` | [button.tsx](https://github.com/shadcn-ui/ui/blob/ba1503c64472b82256d9de95e2e62c5901a38e8b/apps/v4/registry/new-york-v4/ui/button.tsx) | MIT |
| `hub/src/components/ui/input.tsx` | [input.tsx](https://github.com/shadcn-ui/ui/blob/ba1503c64472b82256d9de95e2e62c5901a38e8b/apps/v4/registry/new-york-v4/ui/input.tsx) | MIT |
| `hub/src/components/ui/separator.tsx` | [separator.tsx](https://github.com/shadcn-ui/ui/blob/ba1503c64472b82256d9de95e2e62c5901a38e8b/apps/v4/registry/new-york-v4/ui/separator.tsx) | MIT |
| `hub/src/components/ui/sheet.tsx` | [sheet.tsx](https://github.com/shadcn-ui/ui/blob/ba1503c64472b82256d9de95e2e62c5901a38e8b/apps/v4/registry/new-york-v4/ui/sheet.tsx) | MIT |
| `hub/src/components/ui/skeleton.tsx` | [skeleton.tsx](https://github.com/shadcn-ui/ui/blob/ba1503c64472b82256d9de95e2e62c5901a38e8b/apps/v4/registry/new-york-v4/ui/skeleton.tsx) | MIT |
| `hub/src/components/ui/tooltip.tsx` | [tooltip.tsx](https://github.com/shadcn-ui/ui/blob/ba1503c64472b82256d9de95e2e62c5901a38e8b/apps/v4/registry/new-york-v4/ui/tooltip.tsx) | MIT |
| `hub/src/hooks/use-mobile.ts` | [use-mobile.ts](https://github.com/shadcn-ui/ui/blob/ba1503c64472b82256d9de95e2e62c5901a38e8b/apps/v4/registry/new-york-v4/hooks/use-mobile.ts) | MIT |

Adaptations: imports use local companion paths and individually installed Radix Slot, Dialog, Separator and Tooltip packages; the local `hub/src/lib/utils.ts` helper now composes `clsx@2.1.1` with `tailwind-merge@3.7.0` (both MIT). The reviewed upstream helper reexported `cn@0.5.0`; that package was removed during Phase 1 review because no package-specific API was required. Styles map to shared `--gih-*` tokens, with hub-only Tailwind utilities and no Preflight. The application supplies its own navigation, branding, accessible labels, mobile close action and explanatory page content. Optional skeleton/input sidebar exports remain upstream primitives and do not represent fabricated live information.

The new application shell, pages, routing and shared-theme wiring are project-specific implementation. No React Refresh preamble, second Vite server, external font service, component API key, account service or provider acquisition is added by the hub.

Accessibility adaptation: the mobile sheet close handler returns keyboard focus to the navigation trigger on dismissal, while preserving content focus after a route change. This is the only behavioral change inside the vendored sidebar; the remaining adaptations are notices and imports.
