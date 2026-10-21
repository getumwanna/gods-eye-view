## Begin without optional credentials

Reading the hub and starting the default Esri globe do not require provider accounts. Optional credentials unlock specific services, and their absence should remain an explicit setup or availability state. The local `SETUP.md` key guide records the provider review performed on October 20, 2026; provider prices, quotas and terms should be checked again before enabling a service.

Create and restrict any credentials yourself, then use the supported **POWER UP** fields. This Library does not request, configure, read or export keys. The [upstream security guide](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/SECURITY.md#how-secrets-are-handled) describes the existing credential boundary.

## Separate public client tokens from secrets

Persistent secrets stay on the server and outside chat, URLs, Git, logs and exported content. GEV intentionally uses provider-designated browser credentials for Google Maps, Cesium ion and Mapillary, subject to provider restrictions. Short-lived AI session credentials also have an approved browser role. Those exceptions do not make arbitrary API keys safe to expose.

For a browser-designated credential, restrict the intended domains or referrers and permitted APIs or assets where the provider supports it. For a server credential, use the provider's available server restrictions and quotas. A local rate limiter is not a billing cap. Monitor provider usage and configure budget alerts where offered; an alert may notify you after spending rather than stop requests. See the official [Google Maps security guidance](https://developers.google.com/maps/api-security-best-practices) and [Cesium token controls](https://cesium.com/learn/ion/cesium-ion-access-tokens/).

## Review cost and intended use together

A free registration can still impose request limits, attribution requirements or restrictions on intended use. A metered service can incur charges when a configured layer or optional AI feature is used. Credential presence does not prove entitlement, sufficient quota or a healthy feed. Read the current provider plan before relying on a cost label in reference documentation.

For aircraft and vessel tracking, select Google 3D or the default Esri imagery instead of ion-hosted Bing imagery, subject to the chosen product's terms. An ion token does not authorize every asset for every use; inspect the [Cesium content conditions](https://cesium.com/learn/ion/content-usage-and-attribution-guide/).

OpenSky's terms apply to anonymous default access as well as authenticated access. Any proposed recorder or automated archiving of OpenSky data needs a terms review before the proposal is made. Authentication is not permission to retain or redistribute observations. Consult [OpenSky's current terms](https://opensky-network.org/about/terms-of-use).

## Leave unsupported setup paths alone

Ontario 511 is key-required, but POWER UP has no Ontario field at this pin. The optional separate Google server credential is also outside the visible setup fields. Leave them unconfigured under the current POWER UP-only workflow; do not substitute another provider's field.

Hong Kong and Taiwan camera packs remain policy-disabled pending separate review and approval. This guide does not authorize activating them, creating a recorder, adding a new source or exposing the server through hosting. Keep the application bound to localhost: anyone able to reach a configured local key broker can potentially use its enabled provider services. The [upstream local-server threat model](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/SECURITY.md#network-exposure--the-operator-threat-model) explains that boundary.
