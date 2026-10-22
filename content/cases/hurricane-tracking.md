## A current advisory view

This case uses the globe's existing cyclone and weather layers to compare current advisory context with available weather imagery. NHC/CPHC cyclone coverage is the Atlantic and eastern/central North Pacific, not every ocean basin. Advisory products are **Refreshed**; forecast or modeled fields are **Estimated**. A forecast cone describes uncertainty in the storm center's future position, not the full area of wind, rain or other hazards.

The [pinned source documentation](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md) and [cyclone source owner](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/cyclones/source.js) identify the existing products. Reading this page does not check whether a storm or a provider response is currently available.

## Open the geographic view

The globe action opens an Atlantic view on Esri imagery with cyclone advisories and the weather satellite layer enabled. It does not restore a named storm, advisory issue time, weather frame or historical track. Inspect the globe's product timestamps and coverage, then select an available advisory or weather time manually. An empty view is not evidence that a region has no hazards.

## Keep the time window explicit

The weather provider exposes a bounded timeline: at most 13 frames selected from the preceding 24 hours. Products have different geographic coverage, cadence and availability. The [weather provider implementation](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/server/providers/weather.js) is the authority for that window; regional imagery does not become global because the camera moves.

This is a partial local capability, not the external WorldFX hurricane replay described in the author's demonstrations. It supplies no long-term recording, archived storm reconstruction or new forecast service. Do not infer a causal explanation from a visual alignment between imagery and an advisory. Keep provider credits visible and use official public safety information for actual decisions.
