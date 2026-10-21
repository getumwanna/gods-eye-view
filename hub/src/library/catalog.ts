import {
  getLayerMetadata,
  getSourceGuides,
} from '../../../src/custom/shared/layerMetadata.js';
import { SOURCE_REGISTRY_PROJECTION } from '../../../src/custom/shared/sourceRegistry.generated.js';
import { KEY_SETUP_KEYS } from '../../../src/keySetupCore.mjs';
import {
  admittedUpstreamPaths,
  loadUpstreamDocuments,
  validateAdmittedDocuments,
} from './upstreamDocuments';
import { isLibraryId, safeExternalUrl, safeRepositoryPath } from './links';
import type {
  LibraryCatalog,
  LibraryManifest,
  LibrarySnapshot,
  SourceRegistry,
  ValidationIssue,
} from './types';

const corpusModules = import.meta.glob(
  [
    '../../../content/sources.json',
    '../../../content/library.json',
    '../../../content/knowledge/project-background.md',
    '../../../content/knowledge/first-five-minutes.md',
    '../../../content/knowledge/understanding-data-labels.md',
    '../../../content/knowledge/layers-and-coverage.md',
    '../../../content/knowledge/keys-and-costs.md',
    '../../../content/knowledge/gis-geoint-fundamentals.md',
    '../../../content/knowledge/development-and-updates.md',
    '../../../content/knowledge/gods-eye-view-blew-up-then-astra-summary.md',
    '../../../content/knowledge/i-open-sourced-gods-eye-view-summary.md',
    '../../../content/cases/nepal-flood.md',
    '../../../content/cases/hurricane-tracking.md',
    '../../../content/cases/launch-reconstruction.md',
    '../../../content/cases/aircraft-incidents.md',
    '../../../content/cases/satellite-imagery-change.md',
    '../../../content/cases/ai-reconstruction-demonstrations.md',
  ],
  { query: '?raw', import: 'default' },
);

const pin = '064d51f7be2675f1c69e16068e9c49d1a60144d1';
const issue = (
  file: string,
  code: string,
  message: string,
): ValidationIssue => ({ file, code, message });
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const setupIds = new Set<string>(KEY_SETUP_KEYS.map((key) => key.id));
const kinds = new Set([
  'Live',
  'Refreshed',
  'Simulated',
  'Estimated',
  'Static',
]);

/** Pure cross-reference checks supplement the full development schema validator. Node remains authoritative. */
export function validateBrowserRegistry(
  registry: SourceRegistry,
): ValidationIssue[] {
  const errors: ValidationIssue[] = [];
  const fail = (code: string) =>
    errors.push(
      issue('sources.json', code, 'A source registry reference is invalid.'),
    );
  if (
    !record(registry) ||
    registry.version !== 1 ||
    registry.upstreamRevision !== pin ||
    !Array.isArray(registry.sources) ||
    !Array.isArray(registry.bindings) ||
    !Array.isArray(registry.guideGroups) ||
    !Array.isArray(registry.capabilities)
  )
    return [
      issue(
        'sources.json',
        'registry-shape',
        'The source registry structure is invalid.',
      ),
    ];
  const sourceIds = new Set<string>();
  const products = new Set<string>();
  const capabilities = new Set<string>();
  const guides = new Set<string>();
  const values = new Set<string>();
  for (const capability of registry.capabilities) {
    if (!isLibraryId(capability.id) || capabilities.has(capability.id))
      fail('capability-id');
    capabilities.add(capability.id);
    if (capability.setupKeyId !== null && !setupIds.has(capability.setupKeyId))
      fail('setup-id');
  }
  for (const source of registry.sources) {
    if (!isLibraryId(source.id) || sourceIds.has(source.id)) fail('source-id');
    sourceIds.add(source.id);
    if (
      !safeExternalUrl(source.homepage) ||
      !safeExternalUrl(source.docsUrl) ||
      !Array.isArray(source.products)
    )
      fail('source-url');
    for (const product of source.products) {
      const ref = `${source.id}/${product.id}`;
      if (!isLibraryId(product.id) || products.has(ref)) fail('product-id');
      products.add(ref);
      for (const ref of [
        ...product.access.requiredCapabilityRefs,
        ...product.access.optionalCapabilityRefs,
      ])
        if (!capabilities.has(ref)) fail('capability-reference');
      if (product.terms.urls.some((url) => !safeExternalUrl(url)))
        fail('terms-url');
      for (const evidence of product.evidence)
        if (
          !safeRepositoryPath(evidence.path) ||
          (evidence.url !== null && !safeExternalUrl(evidence.url))
        )
          fail('evidence-reference');
    }
  }
  for (const guide of registry.guideGroups) {
    if (!isLibraryId(guide.id) || guides.has(guide.id)) fail('guide-id');
    guides.add(guide.id);
    if (!getSourceGuides().some((known) => known.id === guide.id))
      fail('guide-identity');
    if (
      !safeExternalUrl(guide.docsHref) ||
      (guide.setupUrl !== null && guide.setupUrl !== '/?setup=1') ||
      guide.sourceProductRefs.some((ref) => !products.has(ref))
    )
      fail('guide-reference');
  }
  for (const binding of registry.bindings) {
    const value = `${binding.layerId}/${binding.valueId}`;
    if (
      !getLayerMetadata(binding.layerId) ||
      !isLibraryId(binding.layerId) ||
      !isLibraryId(binding.valueId) ||
      values.has(value) ||
      !kinds.has(binding.kind)
    )
      fail('binding-id');
    values.add(value);
    if (
      binding.sourceProductRefs.some((ref) => !products.has(ref)) ||
      binding.guideRefs.some((ref) => !guides.has(ref)) ||
      [
        ...binding.requiredCapabilityRefs,
        ...binding.optionalCapabilityRefs,
      ].some((ref) => !capabilities.has(ref))
    )
      fail('binding-reference');
  }
  if (
    new Set(registry.bindings.map((binding) => binding.layerId)).size !== 32 ||
    guides.size !== getSourceGuides().length
  )
    fail('registry-coverage');
  return errors;
}

export function validateBrowserManifest(
  manifest: LibraryManifest,
  registry: SourceRegistry,
  availableOriginalPaths: string[],
): ValidationIssue[] {
  const errors: ValidationIssue[] = [];
  if (
    !record(manifest) ||
    manifest.version !== 1 ||
    manifest.upstreamRevision !== pin ||
    !Array.isArray(manifest.upstreamDocuments) ||
    !Array.isArray(manifest.items)
  )
    return [
      issue(
        'library.json',
        'manifest-shape',
        'The Library manifest structure is invalid.',
      ),
    ];
  const ids = new Set<string>();
  for (const doc of manifest.upstreamDocuments) {
    if (
      !isLibraryId(doc.id) ||
      ids.has(doc.id) ||
      !admittedUpstreamPaths.includes(doc.path) ||
      doc.upstreamRevision !== registry.upstreamRevision ||
      !safeExternalUrl(doc.sourceUrl)
    )
      errors.push(
        issue(
          'library.json',
          'document-reference',
          'An upstream document reference is invalid.',
        ),
      );
    ids.add(doc.id);
  }
  const routeSlugs = new Set<string>();
  for (const item of manifest.items) {
    const routeKey = `${item.kind === 'case-study' ? 'cases' : 'knowledge'}/${item.slug}`;
    if (!isLibraryId(item.slug) || routeSlugs.has(routeKey))
      errors.push(
        issue(
          'library.json',
          'route-reference',
          'A Library article route is ambiguous or invalid.',
        ),
      );
    routeSlugs.add(routeKey);
    if (
      !isLibraryId(item.id) ||
      ids.has(item.id) ||
      (item.contentPath !== null &&
        (!safeRepositoryPath(item.contentPath) ||
          !availableOriginalPaths.includes(item.contentPath)))
    )
      errors.push(
        issue(
          'library.json',
          'content-reference',
          'An authored Library file is unavailable or its reference is invalid.',
        ),
      );
    if (item.contentPath === null) {
      const doc = manifest.upstreamDocuments.find(
        (document) => document.id === item.upstreamDocumentId,
      );
      if (
        !doc ||
        !item.sectionIds.length ||
        item.sectionIds.some(
          (section) => !doc.sections.some((known) => known.id === section),
        )
      )
        errors.push(
          issue(
            'library.json',
            'content-reference',
            'An authored Library document reference is invalid.',
          ),
        );
    }
    if (item.kind === 'upstream-documentation') {
      const document = manifest.upstreamDocuments.find(
        (document) => document.id === item.upstreamDocumentId,
      );
      if (
        item.contentPath !== null ||
        !document ||
        item.inputSha256 !== document.sha256 ||
        item.upstreamRevision !== registry.upstreamRevision ||
        (item.status === 'published' && !document.published)
      )
        errors.push(
          issue(
            'library.json',
            'document-reference',
            'A Library article differs from its reviewed upstream input.',
          ),
        );
    } else if (
      item.contentPath === null ||
      item.upstreamDocumentId !== null ||
      item.upstreamRevision !== null ||
      item.sectionIds.length
    )
      errors.push(
        issue(
          'library.json',
          'content-reference',
          'An original article has an invalid input reference.',
        ),
      );
    const productRefs = new Set(
      registry.sources.flatMap((source) =>
        source.products.map((product) => `${source.id}/${product.id}`),
      ),
    );
    if (
      item.sourceProductRefs.some((reference) => !productRefs.has(reference)) ||
      item.references.some((reference) => !safeExternalUrl(reference.url))
    )
      errors.push(
        issue(
          'library.json',
          'content-reference',
          'An authored Library source reference is invalid.',
        ),
      );
    ids.add(item.id);
  }
  return errors;
}

type Store = {
  snapshot: LibrarySnapshot;
  listeners: Set<() => void>;
  pending: Promise<LibrarySnapshot> | null;
  reload: () => Promise<LibrarySnapshot>;
  refresh: () => void;
};
const initialSnapshot: LibrarySnapshot = {
  status: 'idle',
  revision: 0,
  data: null,
  errors: [],
};
const store: Store = import.meta.hot?.data.libraryStore || {
  snapshot: initialSnapshot,
  listeners: new Set(),
  pending: null,
  reload: loadCurrentLibrary,
  refresh: refreshCurrentLibrary,
};
let schemaCache: {
  key: string;
  validators: ((value: unknown) => boolean)[];
} | null = null;
function publish(snapshot: LibrarySnapshot) {
  store.snapshot = snapshot;
  for (const listener of store.listeners) listener();
}
export function getLibrarySnapshot() {
  return store.snapshot;
}
export function subscribeLibrary(listener: () => void) {
  store.listeners.add(listener);
  return () => {
    store.listeners.delete(listener);
  };
}

async function validateSchemas(
  raw: Record<string, string>,
  registry: unknown,
  manifest: unknown,
): Promise<ValidationIssue[]> {
  if (import.meta.env.DEV) {
    // This whole compiler/schema graph is eliminated from production builds. Nothing validates during Vite configuration.
    const schemaModules = import.meta.glob(
      [
        '../../../content/sources.schema.json',
        '../../../content/library.schema.json',
      ],
      { query: '?raw', import: 'default' },
    );
    const schemas: string[] = [];
    const names = ['sources', 'library'];
    for (const name of names) {
      const load = schemaModules[`../../../content/${name}.schema.json`];
      if (!load)
        return [
          issue(
            `${name}.schema.json`,
            'missing-schema',
            'A Library validation schema is unavailable.',
          ),
        ];
      const value = await load();
      if (
        typeof value !== 'string' ||
        new TextEncoder().encode(value).byteLength > 256_000
      )
        return [
          issue(
            `${name}.schema.json`,
            'schema-load',
            'A Library validation schema could not be loaded.',
          ),
        ];
      schemas.push(value);
    }
    const key = schemas.join('\u0000');
    if (!schemaCache || schemaCache.key !== key) {
      const { default: Ajv } = await import('ajv');
      const ajv = new Ajv({
        strict: true,
        allErrors: true,
        logger: false,
        verbose: false,
        ownProperties: true,
        coerceTypes: false,
        useDefaults: false,
        removeAdditional: false,
      });
      try {
        schemaCache = {
          key,
          validators: schemas.map((schema) => ajv.compile(JSON.parse(schema))),
        };
      } catch {
        schemaCache = null;
        return [
          issue(
            'Library schemas',
            'invalid-schema',
            'A Library validation schema is invalid.',
          ),
        ];
      }
    }
    const digestInput = [
      ['content/sources.json', raw['content/sources.json']],
      ['content/sources.schema.json', schemas[0]],
      ['content/library.json', raw['content/library.json']],
      ['content/library.schema.json', schemas[1]],
    ]
      .map(([path, text]) => `${path}\0${text}`)
      .join('\0');
    const digest = await globalThis.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(digestInput),
    );
    const inputDigest = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join('');
    if (inputDigest !== SOURCE_REGISTRY_PROJECTION.inputDigest)
      return [
        issue(
          'source metadata projection',
          'stale-projection',
          'The generated source metadata is stale. Run the authoritative Library check before publishing this revision.',
        ),
      ];
    const values = [registry, manifest];
    return schemaCache.validators.flatMap((validate, i) =>
      validate(values[i])
        ? []
        : [
            issue(
              `${names[i]}.json`,
              'schema-validation',
              'Library content does not match its reviewed schema.',
            ),
          ],
    );
  }
  void raw;
  return [];
}

export function loadLibrary(): Promise<LibrarySnapshot> {
  return store.reload();
}

function loadCurrentLibrary(): Promise<LibrarySnapshot> {
  if (store.pending) return store.pending;
  if (store.snapshot.status === 'ready' || store.snapshot.status === 'error')
    return Promise.resolve(store.snapshot);
  const revision = store.snapshot.revision;
  publish({ status: 'loading', revision, data: null, errors: [] });
  const pending = (async () => {
    let file = 'Library';
    try {
      const raw = Object.fromEntries(
        await Promise.all(
          Object.entries(corpusModules).map(async ([path, load]) => [
            path.replace('../../../', ''),
            await load(),
          ]),
        ),
      );
      if (
        Object.values(raw).reduce(
          (total: number, value) =>
            total +
            (typeof value === 'string'
              ? new TextEncoder().encode(value).byteLength
              : 0),
          0,
        ) > 4_000_000
      )
        throw new Error('corpus-size');
      const parse = (path: string) => {
        file = path.replace('content/', '');
        if (typeof raw[path] !== 'string') throw new Error('missing-content');
        if (
          new TextEncoder().encode(raw[path] as string).byteLength > 2_000_000
        )
          throw new Error('content-size');
        return JSON.parse(raw[path] as string);
      };
      const registry = parse('content/sources.json') as SourceRegistry;
      const manifest = parse('content/library.json') as LibraryManifest;
      const schemaErrors = await validateSchemas(
        raw as Record<string, string>,
        registry,
        manifest,
      );
      if (schemaErrors.length) {
        if (store.snapshot.revision === revision)
          publish({
            status: 'error',
            revision,
            data: null,
            errors: schemaErrors.slice(0, 20),
          });
        return store.snapshot;
      }
      file = 'Library references';
      const originalDocuments = Object.fromEntries(
        Object.entries(raw).filter(
          ([path, value]) => path.endsWith('.md') && typeof value === 'string',
        ),
      ) as Record<string, string>;
      const errors = [
        ...validateBrowserRegistry(registry),
        ...validateBrowserManifest(
          manifest,
          registry,
          Object.keys(originalDocuments),
        ),
      ];
      if (import.meta.env.DEV) {
        for (const item of manifest.items) {
          if (item.contentPath === null) continue;
          const content = originalDocuments[item.contentPath];
          if (
            typeof content !== 'string' ||
            !content.trim() ||
            new TextEncoder().encode(content).byteLength > 256 * 1024
          ) {
            errors.push(
              issue(
                'Authored Library content',
                'content-size',
                'An authored article is unavailable or exceeds its size limit.',
              ),
            );
            continue;
          }
          const digest = await globalThis.crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(content),
          );
          const hash = Array.from(new Uint8Array(digest), (byte) =>
            byte.toString(16).padStart(2, '0'),
          ).join('');
          if (hash !== item.inputSha256)
            errors.push(
              issue(
                'Authored Library content',
                'content-revision',
                'An authored article differs from its reviewed revision.',
              ),
            );
        }
      }
      const upstreamDocuments = await loadUpstreamDocuments();
      if (
        [...Object.values(raw), ...Object.values(upstreamDocuments)].reduce(
          (total: number, value) =>
            total +
            (typeof value === 'string'
              ? new TextEncoder().encode(value).byteLength
              : 0),
          0,
        ) > 8_000_000
      )
        throw new Error('corpus-size');
      errors.push(
        ...(await validateAdmittedDocuments(
          manifest.upstreamDocuments,
          upstreamDocuments,
          import.meta.env.DEV,
        )),
      );
      if (store.snapshot.revision === revision)
        publish(
          errors.length
            ? {
                status: 'error',
                revision,
                data: null,
                errors: errors.slice(0, 20),
              }
            : {
                status: 'ready',
                revision,
                data: {
                  registry,
                  manifest,
                  upstreamDocuments,
                  originalDocuments,
                },
                errors: [],
              },
        );
    } catch {
      if (store.snapshot.revision === revision)
        publish({
          status: 'error',
          revision,
          data: null,
          errors: [
            issue(
              file,
              'content-load',
              'Library content could not be loaded or parsed. Restore the reviewed file and try again.',
            ),
          ],
        });
    }
    return store.snapshot;
  })();
  store.pending = pending;
  void pending.finally(() => {
    if (store.pending === pending) store.pending = null;
  });
  return pending;
}
store.reload = loadCurrentLibrary;

/** Self-accept raw data changes: only mounted Library subscribers refresh. Dashboard, Settings and globe do not reload. */
export function refreshLibrary() {
  store.refresh();
}

function refreshCurrentLibrary() {
  schemaCache = null;
  store.pending = null;
  publish({
    status: 'idle',
    revision: store.snapshot.revision + 1,
    data: null,
    errors: [],
  });
  if (store.listeners.size) void store.reload();
}
// Existing Library mounts retain their original exports across self-acceptance.
// Delegate through the shared store so those consumers and Retry callbacks use
// this module generation's raw imports and schema cache after each replacement.
store.refresh = refreshCurrentLibrary;
if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    data.libraryStore = store;
  });
  import.meta.hot.accept((updated) => {
    updated?.refreshLibrary();
  });
}
