## Read the value before the badge

A layer can mix several kinds of information. A satellite layer combines orbital inputs with a calculated position; a traffic display can animate simulated vehicles over mapped roads. Label the displayed value, not the provider or the whole layer.

The hub uses these five observation kinds:

| Kind | What it describes | Example in this checkout |
| --- | --- | --- |
| Live | A received observation from a live-source workflow | An aircraft or vessel observation, subject to its timestamp and health |
| Refreshed | Observations or records obtained by periodic retrieval | Earthquake reports or dated launch metadata |
| Simulated | A generated scenario or animation | Animated traffic vehicles |
| Estimated | A model, propagation or inference | Propagated satellite position or a reconstructed trajectory |
| Static | Bundled or descriptive reference information | A mapped location, source-directory record or dated street photograph |

A **Live** label does not guarantee zero delay, uninterrupted reception or complete coverage. **Static** does not mean an image was captured today. The [upstream source inventory](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md) explains the different runtime and bundled inputs underlying these presentations.

## Health is a separate question

Observation kind describes how a value originated. Feed health describes whether its acquisition or delivery is working; freshness describes its age. A value can remain **Estimated** while its input feed is stale, or remain **Refreshed** while a retrieval fails. A source being configured is not evidence that the credential is valid or that the feed is healthy.

Look for source, geographic coverage and an observation or update timestamp alongside the kind. When a field is unavailable, retain that uncertainty. Do not substitute the page's review date or the current clock for a missing observation time. The Library deliberately reports **Not checked in Library** because its records are reference information, not a second acquisition monitor.

## Count the same thing

A cached satellite catalog and the satellites loaded into the current globe are different populations. A catalog can contain entries that have not been loaded, propagated or drawn for this view. A globe-loaded count must not be relabeled as the full cached catalog, and a catalog count must not imply that all entries are visible.

The same care applies to coverage. No visible aircraft or camera marker is not proof that no aircraft or camera exists there. Use the source's scope, filters, enabled layers and health before interpreting an empty map. Never turn unavailable information into a displayed zero.

## Treat pictures and models carefully

A camera pose or viewshed is an estimate of viewing geometry; it is not proof that a current frame is arriving. Street imagery is dated media, even when its viewer is interactive. A reconstructed launch path is not a measured complete ascent, and an animated flood corridor is not a validated hazard forecast.

For imagery comparisons, compare the actual product, capture dates, cloud conditions and footprint. The reviewed [Recent Imagery description](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/docs/CURRENT-STATE.md#recent-imagery-september-2026) describes the supported comparison workflow. An apparent visual difference can support a question; it does not establish its cause.
