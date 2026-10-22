## A recent mission, reconstructed

The existing Space Missions experience combines recent Launch Library 2 records with available CelesTrak orbital elements. It can present a mission's launch context and an estimated path. Reconstructed ascent geometry and timing are **Estimated**, not measured continuous telemetry from the vehicle. A source record being present does not establish a complete trajectory or a successful orbital outcome.

The [launch source owner](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/launches/source.js) defines the existing acquisition path. The [path construction](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/launches/paths.js) and [mission policy helpers](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/launches/policyHelpers.js) explain how available evidence constrains the reconstruction.

## Open a launch-site view

The globe action opens the Cape Canaveral area on Esri imagery with the existing rocket-launch layer enabled. It does not select a mission, restore a replay clock or promise that the displayed recent mission launched from that site. Open Space Missions, select an available recent mission, and inspect its source, status and reconstruction notices before starting playback.

Changing the mission may change what evidence is available. A path drawn between known stages or positions should not be read as an observed position at every intervening instant. Launch failures must not receive a fabricated fallback orbit marker. Missing orbital evidence should remain missing.

## Limits of this case

This page documents the existing interactive experience. It does not add upcoming-launch queries, a new launch provider, historical replay files or a recorder. The source documentation is reviewed reference information, not a claim that a particular mission is currently loaded or healthy. The [pinned data-source notes](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md) remain the starting point for provider coverage and attribution. Treat timing and geometry as estimates when discussing what the animation shows.
