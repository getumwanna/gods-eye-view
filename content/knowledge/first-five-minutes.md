## Start with the default globe

Open the local hub, then choose **Open globe**. The default Esri imagery provides a way to begin without a provider account; optional services can remain unconfigured. A globe that renders successfully establishes a working map view, not successful acquisition from every optional layer. The upstream [setup instructions](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/CONTRIBUTING.md#getting-set-up) describe the keyless start and supported runtime.

For aircraft or vessel tracking, use the default Esri imagery or Google 3D subject to its own requirements. Do not select ion-hosted Bing imagery for that tracking use. Review the [Cesium content requirements](https://cesium.com/learn/ion/content-usage-and-attribution-guide/) before choosing an ion-delivered asset.

## Inspect one layer at a time

Choose a place, enable one layer and inspect its source, coverage and value labels. Use the globe's **Feeds** disclosure to distinguish observation origin from health or freshness. An empty display can mean no local coverage, no matching observations, a missing optional credential or an unavailable source. It is not automatically a measured zero.

Open the corresponding Library source guide for reference facts. Library health remains **Not checked in Library**; its documentation review date is separate from the time an observation was made. The [pinned data-source inventory](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md) provides the upstream starting point.

## Try Street Level within its coverage

Enable **STREET LEVEL** and open its panel. An unconfigured Mapillary option should explain that a client token is required. KartaView and Panoramax offer keyless alternatives where their contributors have supplied imagery; a successful map does not imply a nearby photograph exists.

Zoom close enough for the chosen provider. At this pin, KartaView draws coverage below about 6 km camera height, while Panoramax sequence coverage appears below 60 km. There is no orbital Street Level overview. These are application display thresholds, not promises of image resolution or geographic coverage. The reviewed [KartaView policy](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/streetLevel/providers/kartaview/policy.js) and [Panoramax policy](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/streetLevel/providers/panoramax/policy.js) define those thresholds.

Select an available photo. **EXPAND** opens it fullscreen; **SHRINK** returns to the panel. Escape exits fullscreen while retaining the selected photo and panel, and **×** closes the viewer. Check the provider credit and photo license before reuse. Google Street View is associated with the Google map path and its credential requirements; its absence on default Esri is expected. See the upstream [Street Level guide](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/README.md#-street-level).

## Keep a view and return

Use the existing globe share URL if you want to reopen supported view state. The hub's handoff accepts local GEV links and rejects external destinations or credential-shaped fields. Do not put provider credentials in a URL. A saved view is not a saved observation history or event replay.

Return with **Back to Geospatial Intelligence Hub** to read the Library or change the theme. Provider setup stays in the existing **POWER UP** workflow; no key is needed just to read these guides.
