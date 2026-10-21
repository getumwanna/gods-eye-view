## Coverage belongs to a product

A layer name describes a presentation, while its products determine where and when information is available. Transit and bikeshare draw from registered operators; camera coverage depends on individual packs. A source appearing in the directory proves that it is represented in the reviewed checkout, not that its service is currently healthy.

Use the Data Sources directory to inspect the particular product's geography, gaps, access tier, attribution and evidence. Publisher cadence, application refresh interval and cache lifetime are separate facts. If one is undocumented, keep it unknown rather than deriving it from a nearby timer. The [pinned source inventory](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md) is the primary upstream reference.

## Camera packs have different gates

Ontario 511 highway cameras require the server-side `ONTARIO_511_API_KEY` at this pin. Without it, that pack is skipped. This is an accepted loss of keyless Ontario coverage; it does not make every CCTV product key-required. POWER UP has no Ontario field in this revision, so leave the pack unconfigured under the current workflow. Do not paste an Ontario credential into another provider's field.

Hong Kong and Taiwan camera packs remain disabled by the project's persistent shipping policy. Their presence in incoming upstream code does not grant approval to enable them. A separate terms review and explicit activation approval are required. The offline policy check verifies the disabled gates without making live camera requests. The upstream [camera catalog owner](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/server/providers/cctv/catalog.js) is distinct from that local policy.

## Street imagery is local and dated

Mapillary and Google have their own credential and use requirements. KartaView and Panoramax can be used without a key where contributor imagery is available. None provides guaranteed coverage at an arbitrary location.

Zoom into an area: KartaView coverage is limited to below about 6 km camera height and Panoramax sequence coverage to below 60 km. This pin does not draw an orbital Street Level overview. A missing line above those display thresholds is not a provider outage. Check the [Street Level documentation](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/README.md#-street-level) and the photo's own attribution and license.

## Environmental layers are not universal sensors

The air-quality layer uses ECCC AQHI observations for supported Canadian stations. It should not be interpreted as worldwide air-quality coverage or as interchangeable with another country's index. Use the [Canadian AQHI explanation](https://www.canada.ca/en/environment-climate-change/services/air-quality-health-index.html) to understand what that index communicates.

GNSS integrity is a derived classification using aircraft-related inputs. An anomaly can have more than one explanation; a score or mapped region is not proof of intentional interference, its source or a responsible actor. Read it as **Estimated** context and seek corroborating evidence. The [GNSS implementation](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/src/layers/gnss/index.js) supplies the local capability, not an independent finding of cause.

## Preserve temporal and geographic limits

Recent Imagery supports a bounded selected-area comparison using documented HLS or VIIRS products and recent dates. It is not an arbitrary historical imagery archive. Launch replay uses recent launch metadata and estimated or reconstructed trajectories; an upcoming-launch query remains deferred. Weather advisories retain their issuing source and coverage rather than becoming a new local forecast.

For any comparison, retain the product, date, footprint, missing regions and model limitations. A detailed globe can still contain incomplete or delayed information.
