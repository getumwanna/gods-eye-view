import { KEY_SETUP_KEYS } from '../../keySetupCore.mjs';

/** Value origin and feed health are independent presentation dimensions. */
export const DATA_KINDS = Object.freeze([
  'Live',
  'Refreshed',
  'Simulated',
  'Estimated',
  'Static',
]);

const UPSTREAM_DATA_DOCS =
  'https://github.com/bilawalsidhu/gods-eye-view/blob/main/DATA_SOURCES.md';
const SETUP_EXPLANATION =
  'Use the existing GEV POWER UP panel for provider configuration. This Phase 1 setup guide does not report current feed health. The full source directory, including coverage, cadence, attribution and terms, is planned for Phase 2.';
const SOURCE_EXPLANATION =
  'This source supports an existing GEV capability. This Phase 1 guide links to upstream documentation and does not report current feed health. The full source directory, including coverage, cadence, attribution and terms, is planned for Phase 2.';

// Names and route identities only: this is not a second source/license manifest.
const PUBLIC_SOURCE_NAMES = Object.freeze([
  ['adsb-lol', 'adsb.lol'],
  ['local-adsb', 'Local ADS-B receiver'],
  ['celestrak', 'CelesTrak'],
  ['openstreetmap', 'OpenStreetMap'],
  ['openfreemap', 'OpenFreeMap'],
  ['overpass', 'Operator-configured Overpass'],
  ['overture-military-names', 'Overture / OpenStreetMap military names'],
  ['openinframap', 'Open Infrastructure Map'],
  ['transit', 'Registered transit operators'],
  ['gbfs', 'Registered bikeshare operators'],
  ['cctv', 'Registered public camera providers'],
  ['nasa-gibs', 'NASA GIBS'],
  ['nasa-cmr', 'NASA CMR'],
  ['kartaview', 'KartaView'],
  ['panoramax', 'Panoramax'],
  ['telegeography', 'TeleGeography'],
  ['usgs', 'USGS earthquakes'],
  ['wfigs', 'NIFC WFIGS'],
  ['gnss-integrity', 'GEV GNSS integrity classification'],
  ['eccc-aqhi', 'ECCC AQHI'],
  ['noaa-gfs', 'NOAA GFS'],
  ['ecmwf-ifs', 'ECMWF IFS'],
  ['noaa-nowcoast', 'NOAA nowCOAST'],
  ['nhc-cphc', 'NOAA NHC / CPHC'],
  ['osrm', 'OSRM / FOSSGIS'],
  ['radio-browser', 'Radio Browser'],
  ['bhote-koshi', 'Bhote Koshi event sources'],
  ['gev-context', 'GEV derived context'],
]);

const sourceGuides = Object.freeze([
  ...KEY_SETUP_KEYS.filter((key) => !key.hidden).map((key) =>
    Object.freeze({
      id: key.id,
      name: key.title,
      setupKeyId: key.id,
      setupUrl: '/?setup=1',
      docsHref: key.getUrl,
      explanation: SETUP_EXPLANATION,
    }),
  ),
  ...PUBLIC_SOURCE_NAMES.map(([id, name]) =>
    Object.freeze({
      id,
      name,
      setupKeyId: null,
      setupUrl: null,
      docsHref: UPSTREAM_DATA_DOCS,
      explanation: SOURCE_EXPLANATION,
    }),
  ),
]);
const sourceGuidesById = new Map(sourceGuides.map((guide) => [guide.id, guide]));

/** Known setup guides; no credentials, configuration or feed reads are involved. */
export function getSourceGuides() {
  return sourceGuides;
}

/** Unknown route IDs do not become invented source records. */
export function getSourceGuide(id) {
  return typeof id === 'string' ? sourceGuidesById.get(id) || null : null;
}

/** The source route is always on this local hub, never a caller-supplied URL. */
export function sourceGuideHref(id) {
  const guide = getSourceGuide(id);
  return guide ? `/hub/#/library/sources/${encodeURIComponent(guide.id)}` : null;
}

const value = (id, label, kind) => Object.freeze({ id, label, kind });
const defineLayer = (id, valueKinds, sources, requiredKeyId = null) =>
  Object.freeze({
    id,
    valueKinds: Object.freeze(valueKinds),
    sources: Object.freeze(sources),
    requiredKeyId,
  });

// These classify the values named here, not all possible values of a layer.
// Camera frames and radio playback need their existing source/playback state;
// catalog health or configuration alone cannot establish live media delivery.
const layers = [
  defineLayer('flights', [value('observations', 'Aircraft observations', 'Live')], ['opensky', 'adsb-lol']),
  defineLayer('military', [value('observations', 'Aircraft observations', 'Live')], ['adsb-lol']),
  defineLayer('local-adsb', [value('observations', 'Receiver observations', 'Live')], ['local-adsb']),
  defineLayer('ais-live-vessels', [value('observations', 'Received vessel observations', 'Live')], ['aisstream'], 'aisstream'),
  defineLayer('satellites', [value('position', 'Propagated position', 'Estimated')], ['celestrak']),
  defineLayer('traffic', [value('vehicles', 'Animated vehicles', 'Simulated')], ['openstreetmap', 'tomtom']),
  defineLayer('transit', [value('observations', 'Vehicle observations', 'Live')], ['transit']),
  defineLayer('bikeshare', [value('availability', 'Station availability', 'Live')], ['gbfs']),
  defineLayer('cctv', [value('pose', 'Camera pose and viewshed', 'Estimated')], ['cctv']),
  defineLayer('recent-imagery', [value('imagery', 'Dated satellite imagery', 'Refreshed')], ['nasa-gibs', 'nasa-cmr']),
  defineLayer('street-level', [value('imagery', 'Dated street imagery', 'Static')], ['mapillary', 'google-maps', 'kartaview', 'panoramax']),
  defineLayer('alpr-cameras', [value('locations', 'Mapped locations', 'Static')], ['openstreetmap']),
  defineLayer('military-installations', [value('locations', 'Mapped locations', 'Static')], ['openstreetmap', 'openfreemap', 'overture-military-names', 'overpass', 'google-maps']),
  defineLayer('local-datacenters', [value('locations', 'Bundled mapped locations', 'Static')], ['openstreetmap']),
  defineLayer('local-dams', [value('locations', 'Bundled mapped locations', 'Static')], ['openstreetmap', 'openinframap']),
  defineLayer('telegeography-submarine-cables', [value('geometry', 'Bundled cable map', 'Static')], ['telegeography']),
  defineLayer('rocket-launches', [value('metadata', 'Launch metadata', 'Refreshed'), value('trajectory', 'Replay trajectory', 'Estimated')], ['launch-library', 'celestrak']),
  defineLayer('earthquakes', [value('observations', 'Earthquake observations', 'Refreshed')], ['usgs']),
  defineLayer('local-firms', [value('detections', 'Satellite fire detections', 'Refreshed')], ['firms'], 'firms'),
  defineLayer('fire-perimeters', [value('perimeters', 'Reported perimeters', 'Refreshed')], ['wfigs']),
  defineLayer('gnss-integrity', [value('score', 'Derived integrity score', 'Estimated')], ['adsb-lol', 'gnss-integrity']),
  defineLayer('air-quality', [value('observations', 'Station observations', 'Refreshed')], ['eccc-aqhi']),
  defineLayer('wind', [value('wind', 'Modeled wind', 'Estimated')], ['noaa-gfs', 'ecmwf-ifs']),
  defineLayer('weather-radar', [value('observations', 'Radar observations', 'Refreshed')], ['noaa-nowcoast']),
  defineLayer('weather-satellite', [value('observations', 'Satellite observations', 'Refreshed')], ['noaa-nowcoast']),
  defineLayer('weather-lightning', [value('density', 'Reported lightning density', 'Refreshed')], ['noaa-nowcoast']),
  defineLayer('weather-cyclones', [value('advisories', 'Cyclone advisories', 'Refreshed')], ['nhc-cphc']),
  defineLayer('directions', [value('route', 'Computed route', 'Estimated')], ['osrm']),
  defineLayer('radio', [value('directory', 'Station directory', 'Static')], ['radio-browser']),
  defineLayer('bhote-koshi-2026', [value('imagery', 'Bundled imagery', 'Static'), value('reconstruction', 'Event reconstruction', 'Estimated')], ['bhote-koshi']),
  defineLayer('bhote-koshi-locator', [value('locator', 'Bundled scene locator', 'Static')], ['bhote-koshi']),
  defineLayer('military-awareness', [value('context', 'Derived context', 'Estimated')], ['gev-context']),
];
const layersById = new Map(layers.map((layer) => [layer.id, layer]));
const NO_VALUES = Object.freeze([]);

/** Layer presentation references; source facts remain owned by their sources. */
export function getLayerMetadata(id) {
  return typeof id === 'string' ? layersById.get(id) || null : null;
}

/** Classify only known values, never guess a kind from a label or health word. */
export function getLayerKindValues(row) {
  const id = typeof row === 'string' ? row : row?.id;
  return getLayerMetadata(id)?.valueKinds || NO_VALUES;
}
