import { SOURCE_REGISTRY_PROJECTION } from './sourceRegistry.generated.js';

/** Value origin and feed health are independent presentation dimensions. */
export const DATA_KINDS = Object.freeze([
  'Live',
  'Refreshed',
  'Simulated',
  'Estimated',
  'Static',
]);

// Only the explicitly validated, committed projection enters the globe graph.
// Editable Library content, schema compilers and acquisition code stay outside.
const sourceGuides = Object.freeze(
  SOURCE_REGISTRY_PROJECTION.sourceGuides.map((guide) =>
    Object.freeze({ ...guide }),
  ),
);
const sourceGuidesById = new Map(
  sourceGuides.map((guide) => [guide.id, guide]),
);
const layersById = new Map(
  SOURCE_REGISTRY_PROJECTION.layers.map((layer) => [
    layer.id,
    Object.freeze({
      ...layer,
      valueKinds: Object.freeze(
        layer.valueKinds.map((value) => Object.freeze({ ...value })),
      ),
      sources: Object.freeze([...layer.sources]),
    }),
  ]),
);
const NO_VALUES = Object.freeze([]);

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
  return guide
    ? `/hub/#/library/sources/${encodeURIComponent(guide.id)}`
    : null;
}

/** Layer presentation references; source facts remain owned by their sources. */
export function getLayerMetadata(id) {
  return typeof id === 'string' ? layersById.get(id) || null : null;
}

/** Classify only known values, never guess a kind from a label or health word. */
export function getLayerKindValues(row) {
  const id = typeof row === 'string' ? row : row?.id;
  return getLayerMetadata(id)?.valueKinds || NO_VALUES;
}
