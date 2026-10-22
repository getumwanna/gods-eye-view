## An observed comparison, with a clear resolution limit

On October 21, 2026, the user confirmed that both images rendered in the existing Recent Imagery A/B tool. Their supplied screenshot shows A assigned to **October 13, 2026 — Sentinel-2, HLS S30, 30 m**, and B to **October 12, 2026 — Landsat 8/9, HLS L30, 30 m**. The cards display 4% and 43% cloud metadata respectively. Those percentages describe the catalog records, not a measurement of cloud over this selected box.

The current globe URL supplied with the observation identifies a box bounded by west **−74.22481°**, south **40.31969°**, east **−74.21304°**, and north **40.32950°**. The camera is centered near **40.3239° N, 74.2184° W**. These bounds come from the supplied URL; the agent did not independently inspect a live browser or acquire the imagery. This is a **Static** account of user-observed coverage, with its observation date and product dates kept separate from feed health or present availability.

This mixed-sensor pair demonstrates that the A/B workflow can render both products at this location. It does not establish a like-for-like change on the ground, and no physical change is claimed here.

## Why the overlays look blurry

Both selected products have 30 m output pixels. NASA's [HLS S30 description](https://hls.gsfc.nasa.gov/products-description/s30/) identifies a 30 m output grid for the harmonized Sentinel-2 product; this is not native 10 m Sentinel-2 imagery. The [HLS L30 description](https://hls.gsfc.nasa.gov/products-description/l30/) likewise describes the 30 m Landsat product.

This box is roughly 1.0 by 1.09 km: only about **33 by 36 samples** at 30 m. Enlarging those samples to a close neighborhood view makes the overlay soft and blocky. Individual houses, swimming pools and small roads cannot be interpreted at the detail visible in the supplied Esri basemap screenshot. VIIRS NOAA-21, the other supported Recent Imagery product, is coarser still at 250 m. Zooming out makes the comparison easier to read but does not create more source detail.

The sharper basemap is useful for orientation; its capture date is unverified here, so it is not a dated before image. The screenshot's HUD value of approximately 0.27 m is also not the resolution of the selected HLS image. The [pinned HUD implementation](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/hud.js) derives that number from camera altitude, rather than the imagery product's pixel spacing.

## Reopen the area, then choose available dates

The globe action restores the geographic camera view, Esri basemap, Recent Imagery layer, selected box and **A/B mode only**. It does not pin images, restore either observed date or assert that those images remain available. Choose the products and dates manually in the panel, inspect the credits and timestamps, then drag the divider. Use a wider view for regional patterns rather than trying to read building-scale detail.

The observed October 12/13 pair was within the supported window on October 21. Recent Imagery searches only the last 30 UTC days; this pair will leave that window. An unavailable date later does not invalidate this dated observation or imply an archive exists. A future comparison needs its own availability and coverage check.

## Interpret coverage and differences cautiously

The documented products are HLS S30/L30 at 30 m and VIIRS NOAA-21 at 250 m, with each box side limited to 1,000 km. HLS candidates come from NASA CMR; VIIRS uses a daily mosaic without a granule catalog. The [product and box model](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/recentImagery/model.js), [catalog](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/recentImagery/catalog.js) and [rendering owner](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/recentImagery/rendering.js) describe the existing implementation. These are capability limits, not a guarantee of cloud-free coverage.

Clouds, haze, shadows, acquisition time, sensors and processing can all change the appearance of an image. First prefer a comparable product and usable coverage, then describe only visible patterns at its native scale. A visual difference alone does not establish its cause. This raster workflow is separate from estimated satellite orbit propagation and the licensed Nepal event scene; it adds no arbitrary-date archive or new service.
