import { createHash, randomUUID } from 'node:crypto';
import {
  lstat,
  realpath,
  readFile,
  mkdir,
  writeFile,
  rename,
  unlink,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REGISTERED_LAYER_IDS } from '../src/data/layerState.js';
import { KEY_SETUP_KEYS } from '../src/keySetupCore.mjs';
import { validateGlobeLink } from '../src/custom/shared/shareHandoff.js';

export const FROZEN_UPSTREAM_REVISION =
  '064d51f7be2675f1c69e16068e9c49d1a60144d1';
/** User-reviewed byte and heading admissions; never widened by a content edit. */
export const ADMITTED_DOCUMENTS = deepFreeze([
  {
    path: 'README.md',
    sha256: '71dcf820eaf5f38d0891818d7e7775b637f2832cd9e578b6e26bcde282bc3289',
    sections: [
      {
        startHeading: '## 🌍 Why This Exists',
        startOccurrence: 1,
        endHeading: '## 🎛️ What This Thing Does',
        endOccurrence: 1,
        sha256:
          'e405c7febda4942332596da68a42536ad818d51580e8cde8857cb87458fa69b0',
        startLine: 41,
        endLine: 56,
      },
      {
        startHeading: '## 📷 Street Level',
        startOccurrence: 1,
        endHeading: '## 🎖️ Field Missions',
        endOccurrence: 1,
        sha256:
          '21175d2fcc5288b3407944e26f18ddd870c03eb6b94028276e92d20a620723d5',
        startLine: 422,
        endLine: 431,
      },
      {
        startHeading: '## 📋 Responsible & Open',
        startOccurrence: 1,
        endHeading: "## 🧭 What's Next",
        endOccurrence: 1,
        sha256:
          '745f4992edffdc8908bea1685ca4fc1c9af906489a91083b04f6fcdb96c926ac',
        startLine: 627,
        endLine: 649,
      },
    ],
  },
  {
    path: 'docs/CURRENT-STATE.md',
    sha256: '420279fd1ef76614e87bfd68f8e12490d1b0fbf90b07bda8fa5887d0528a592e',
    sections: [
      {
        startHeading: '## Canonical Docs Order',
        startOccurrence: 1,
        endHeading: '## Current Baseline',
        endOccurrence: 1,
        sha256:
          'debdeb999c158c0af1cc70fd7e5b981cb94d5b2f185818c15d91a9bad0e28bb4',
        startLine: 3435,
        endLine: 3444,
      },
      {
        startHeading: '## Current Baseline',
        startOccurrence: 1,
        endHeading: '## Runtime Stack',
        endOccurrence: 1,
        sha256:
          '9e42c86b2bbd98df94049f692986dbaf7baefcb056358c9b129ceefd143d3fbf',
        startLine: 3445,
        endLine: 3450,
      },
      {
        startHeading: '### Recent Imagery (September 2026)',
        startOccurrence: 1,
        endHeading: '### 3D Aircraft + Tracking (June 2026)',
        endOccurrence: 1,
        sha256:
          'be752df08d357098a6dd75e77fe0866d72361fe0d9f9c359cd2b9b8653babf8d',
        startLine: 4992,
        endLine: 5010,
      },
      {
        startHeading: '## Maintenance Rule',
        startOccurrence: 1,
        endHeading: '## Dependency security baseline',
        endOccurrence: 1,
        sha256:
          'a96873384dbce8d66f61350d83a6aedd7deb0fbc491ddb16ba003765aeefc8bd',
        startLine: 5569,
        endLine: 5572,
      },
    ],
  },
  {
    path: 'DATA_SOURCES.md',
    sha256: 'fc18b241756d3b029c2c521de1fd73b27c0252529037620956f5ce1d4159242c',
    sections: [
      {
        startHeading: '# Data Sources & Attribution',
        startOccurrence: 1,
        endHeading:
          '## Live sources (fetched at runtime — not stored in this repo)',
        endOccurrence: 1,
        sha256:
          'd022fe7ec0ed00c8c25cdf9a57df094116fdc15776152c51e18a627cdd28d8aa',
        startLine: 1,
        endLine: 13,
      },
      {
        startHeading:
          '## Live sources (fetched at runtime — not stored in this repo)',
        startOccurrence: 1,
        endHeading: '### Local receiver input (not fetched from a service)',
        endOccurrence: 1,
        sha256:
          'e017d00a7868902c7637be3b06fc4626fe5497203fb705b11a00d4973c693990',
        startLine: 14,
        endLine: 100,
      },
      {
        startHeading: '## Bundled snapshots',
        startOccurrence: 1,
        endHeading: '### ALPR camera mapping',
        endOccurrence: 1,
        sha256:
          '8ffbe7a97e814464b0a291945a6de812adb4c3770232246a9975b866d7abddfd',
        startLine: 192,
        endLine: 218,
      },
      {
        startHeading: '### ALPR camera mapping',
        startOccurrence: 1,
        endHeading:
          '### CCTV Camera Database (`src/layers/cctv/modelSpecs.js`)',
        endOccurrence: 1,
        sha256:
          '54f0dffb7ed840d9e280423bcf650763e8e6a38791ef941aed8149a6e888d6fa',
        startLine: 219,
        endLine: 234,
      },
      {
        startHeading: '### NASA FIRMS acknowledgement',
        startOccurrence: 1,
        endHeading: '### Natural Earth physical regions (`natural_earth/`)',
        endOccurrence: 1,
        sha256:
          '7737f87a3f94799e999297e412797b9819eb1c178dc90cf4fc66c7097b62f4bc',
        startLine: 250,
        endLine: 260,
      },
      {
        startHeading: '### Weather: NHC/CPHC cyclone advisories',
        startOccurrence: 1,
        endHeading: '### Weather: observed lightning density',
        endOccurrence: 1,
        sha256:
          'bbf5eb459fd85a6650d0ffd00f6b7585af57758e38e40fd4f8f8501e82d69939',
        startLine: 388,
        endLine: 402,
      },
      {
        startHeading: '## In-app attribution',
        startOccurrence: 1,
        endHeading: null,
        endOccurrence: null,
        sha256:
          '49fb1b2246ccc43f6efea29e33a37b4d0373183802cce0f9f0e9e61fcc866d0a',
        startLine: 434,
        endLine: 436,
      },
    ],
  },
  {
    path: 'SECURITY.md',
    sha256: '44be7e36c892af9311d8702f5574ebeff5bbca1843a6d0cf3202af2e68b3423f',
    sections: [
      {
        startHeading: '## Reporting a vulnerability',
        startOccurrence: 1,
        endHeading: '## How secrets are handled',
        endOccurrence: 1,
        sha256:
          '43577e1f7713407e5a7dab8e0c98b10475f8056d2517aec3b42e9657d1b3703f',
        startLine: 5,
        endLine: 13,
      },
      {
        startHeading: '## How secrets are handled',
        startOccurrence: 1,
        endHeading: '### Configuring separate Google keys locally',
        endOccurrence: 1,
        sha256:
          '064d431dc0c0512fb0ef602cb4156578a24753deb26c3ab551e4a9453372eda4',
        startLine: 14,
        endLine: 49,
      },
      {
        startHeading: '## Scope & expectations',
        startOccurrence: 1,
        endHeading: '## Responsible use',
        endOccurrence: 1,
        sha256:
          'c32d93fc57b878efb0658488035db4a34c00a214b3512d7878cc58e21e813d8b',
        startLine: 121,
        endLine: 126,
      },
      {
        startHeading: '## Responsible use',
        startOccurrence: 1,
        endHeading: null,
        endOccurrence: null,
        sha256:
          '73b61b70d58299f1ba0fc14e93ffc89c5068ad197ea5ba6bd1cda225661715eb',
        startLine: 127,
        endLine: 129,
      },
    ],
  },
  {
    path: 'CONTRIBUTING.md',
    sha256: '0fa5e6749f93a6decb05c25565c71bb155de72903ce1cee524a2e967d9d23833',
    sections: [
      {
        startHeading: '## Coding style',
        startOccurrence: 1,
        endHeading: '## Pull requests',
        endOccurrence: 1,
        sha256:
          'c160f98bfc5cf4ff1e512c36e065e36b0f8e0b193ae45bfc62e1ed171934a785',
        startLine: 124,
        endLine: 148,
      },
      {
        startHeading: '## Pull requests',
        startOccurrence: 1,
        endHeading: '## Maintainers',
        endOccurrence: 1,
        sha256:
          'dac11df3a14921ed213d20f4aed01f08ea65fddff3cb59c252d94c7c2ca972d8',
        startLine: 149,
        endLine: 156,
      },
      {
        startHeading: '## Maintainers',
        startOccurrence: 1,
        endHeading: '## Ground rules',
        endOccurrence: 1,
        sha256:
          '9439e901c5cc20e66155aa84eb96971b669c3e2e0a004232119b209856485f1b',
        startLine: 157,
        endLine: 163,
      },
      {
        startHeading: '## Ground rules',
        startOccurrence: 1,
        endHeading: null,
        endOccurrence: null,
        sha256:
          'bc7c1151f35fa1ab3ca01a4e9198032abbce697175e12e9bec5b018314099eb1',
        startLine: 164,
        endLine: 169,
      },
    ],
  },
  {
    path: 'TESTING.md',
    sha256: '43a166e3e27d66f6226c8363fd91bb5364854d32795259a3bb880902e3ee7e22',
    sections: [
      {
        startHeading:
          "# God's Eye View — Testing Guide (voice map-annotation whiteboard + live tracking)",
        startOccurrence: 1,
        endHeading: '## Focus/horizon moving evidence',
        endOccurrence: 1,
        sha256:
          'f8f91b9174545493e08eec262b5f731bff58b7e2fcb8ed4843740bc65cc525ff',
        startLine: 1,
        endLine: 12,
      },
      {
        startHeading: '## Browser harness renderers',
        startOccurrence: 1,
        endHeading: null,
        endOccurrence: null,
        sha256:
          '94e4b4a7ecb12468b3417206881d332a1422c6ca6a9aaab4e0409600712a0b4e',
        startLine: 235,
        endLine: 256,
      },
    ],
  },
  {
    path: 'THIRD_PARTY_NOTICES.md',
    sha256: '785419169c062ab4ec00ecbdf5e4c5a28dc94b3067ece5132dfed4b23960a614',
    sections: [
      {
        startHeading: '# Third-party software notices',
        startOccurrence: 1,
        endHeading: null,
        endOccurrence: null,
        sha256:
          '785419169c062ab4ec00ecbdf5e4c5a28dc94b3067ece5132dfed4b23960a614',
        startLine: 1,
        endLine: 47,
      },
    ],
  },
]);

function deepFreeze(value) {
  for (const child of Object.values(value))
    if (child && typeof child === 'object') deepFreeze(child);
  return Object.freeze(value);
}

const PROJECT_ROOT = fileURLToPath(new URL('../', import.meta.url));
const PROJECTION_PATH = 'src/custom/shared/sourceRegistry.generated.js';
const INPUT_FILES = [
  'content/sources.json',
  'content/sources.schema.json',
  'content/library.json',
  'content/library.schema.json',
];
const PUBLIC_GUIDE_IDS = [
  'adsb-lol',
  'local-adsb',
  'celestrak',
  'openstreetmap',
  'openfreemap',
  'overpass',
  'overture-military-names',
  'openinframap',
  'transit',
  'gbfs',
  'cctv',
  'nasa-gibs',
  'nasa-cmr',
  'kartaview',
  'panoramax',
  'telegeography',
  'usgs',
  'wfigs',
  'gnss-integrity',
  'eccc-aqhi',
  'noaa-gfs',
  'ecmwf-ifs',
  'noaa-nowcoast',
  'nhc-cphc',
  'osrm',
  'radio-browser',
  'bhote-koshi',
  'gev-context',
];
const ORIGINAL_CONTENT_PATHS = new Set([
  ...[
    'project-background',
    'first-five-minutes',
    'understanding-data-labels',
    'layers-and-coverage',
    'keys-and-costs',
    'gis-geoint-fundamentals',
    'development-and-updates',
    'gods-eye-view-blew-up-then-astra-summary',
    'i-open-sourced-gods-eye-view-summary',
  ].map((id) => `content/knowledge/${id}.md`),
  ...[
    'nepal-flood',
    'hurricane-tracking',
    'launch-reconstruction',
    'aircraft-incidents',
    'satellite-imagery-change',
    'ai-reconstruction-demonstrations',
  ].map((id) => `content/cases/${id}.md`),
]);
const KINDS = new Set([
  'Live',
  'Refreshed',
  'Simulated',
  'Estimated',
  'Static',
]);
const EXPECTED_LAYERS = new Set([...REGISTERED_LAYER_IDS, 'local-adsb']);
const SETUP_KEYS = new Map(KEY_SETUP_KEYS.map((key) => [key.id, key]));
const EXPECTED_GUIDES = new Set([
  ...KEY_SETUP_KEYS.filter((key) => !key.hidden).map((key) => key.id),
  ...PUBLIC_GUIDE_IDS,
]);
const APPROVED_CUSTOM_REVISION = 'fd136b60ce9421bd8636692232766a5f7d2226e3';
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_CORPUS_BYTES = 32 * 1024 * 1024;
const MAX_ERRORS = 40;
const CODE_MESSAGES = Object.freeze({
  FILE_UNAVAILABLE: 'A required local input is missing or unreadable.',
  FILE_LIMIT: 'A local input exceeds the reviewed file-size limit.',
  CORPUS_LIMIT: 'The local input corpus exceeds the reviewed size limit.',
  UNSAFE_PATH: 'A local reference is outside its allowed repository scope.',
  SYMLINK_REJECTED: 'Local references must not traverse symbolic links.',
  INVALID_JSON: 'A local JSON input could not be parsed.',
  INVALID_SCHEMA: 'A Library schema definition is invalid or unsupported.',
  SCHEMA_MISMATCH: 'A Library input does not match its strict schema.',
  DUPLICATE_ID: 'Stable identifiers must be unique within their collection.',
  UNKNOWN_REFERENCE: 'A declared reference has no known local identity.',
  IDENTITY_MISMATCH:
    'The registry does not preserve the existing identity contract.',
  UNSAFE_URL: 'A declared link does not meet the Library URL policy.',
  FORBIDDEN_FIELD:
    'Authored content contains a credential or runtime-state field.',
  PIN_MISMATCH: 'A declared revision differs from the reviewed upstream pin.',
  EVIDENCE_MISMATCH: 'A local evidence section or revision cannot be verified.',
  ADMISSION_MISMATCH:
    'An upstream admission differs from the reviewed sections.',
  HASH_MISMATCH: 'Admitted documentation bytes have changed since review.',
  CONTENT_MISMATCH:
    'A content item is inconsistent with its local file or references.',
  STALE_PROJECTION: 'The generated metadata projection is absent or stale.',
  PROJECTION_WRITE_FAILED:
    'The validated metadata projection could not be written.',
  VALIDATOR_UNAVAILABLE: 'Library validation could not complete.',
});
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const canonical = (value) =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, canonical(value[key])]),
        )
      : value;
const same = (left, right) =>
  JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
const isId = (value) =>
  typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(value);

/** Reject secret-bearing or executable links without returning untrusted input. */
export function isSafeLibraryUrl(value, { allowLocal = false } = {}) {
  if (
    typeof value !== 'string' ||
    value.length > 2048 ||
    /[\u0000-\u0020\\]/.test(value)
  )
    return false;
  if (
    allowLocal &&
    (value === '/?setup=1' ||
      /^\/hub\/#\/library(?:\/[a-z0-9/-]*)?(?:#[a-z0-9-]+)?$/.test(value))
  )
    return true;
  try {
    const url = new URL(value);
    if (
      url.protocol !== 'https:' ||
      !url.hostname ||
      url.username ||
      url.password
    )
      return false;
    return [...url.searchParams.keys()].every(
      (key) =>
        !/(?:api.?key|access.?token|secret|password|credential|authorization|^key$|^token$)/i.test(
          key,
        ),
    );
  } catch {
    return false;
  }
}

/** Deterministic, data-only output. It is never an input authority. */
export function createMetadataProjection(registry, inputDigest) {
  const layers = new Map();
  for (const binding of registry.bindings) {
    let layer = layers.get(binding.layerId);
    if (!layer) {
      layer = {
        id: binding.layerId,
        valueKinds: [],
        sources: [...binding.guideRefs],
        requiredKeyId: binding.requiredKeyId,
      };
      layers.set(binding.layerId, layer);
    }
    layer.valueKinds.push({
      id: binding.valueId,
      label: binding.label,
      kind: binding.kind,
    });
  }
  return {
    upstreamRevision: registry.upstreamRevision,
    inputDigest,
    sourceGuides: registry.guideGroups.map(
      ({ id, name, setupKeyId, setupUrl, docsHref, explanation }) => ({
        id,
        name,
        setupKeyId,
        setupUrl,
        docsHref,
        explanation,
      }),
    ),
    layers: [...layers.values()],
  };
}
export const createProjection = createMetadataProjection;
export function serializeMetadataProjection(projection) {
  return `// Generated by check-custom-library.mjs --write-projection; do not edit.\n// prettier-ignore\nexport const SOURCE_REGISTRY_PROJECTION = ${JSON.stringify(projection, null, 2)};\n`;
}

function headingRange(text, section) {
  const lines = text.match(/[^\n]*\n|[^\n]+$/g) || [];
  const position = (heading, occurrence) => {
    let seen = 0;
    return lines.findIndex(
      (line) => line.replace(/\r?\n$/, '') === heading && ++seen === occurrence,
    );
  };
  const start = position(section.startHeading, section.startOccurrence);
  const end =
    section.endHeading === null
      ? lines.length
      : position(section.endHeading, section.endOccurrence);
  if (start < 0 || end <= start) return null;
  return {
    text: lines.slice(start, end).join(''),
    startLine: start + 1,
    endLine: end,
  };
}

/** Explicit check/build entry point. Importing this module performs no IO. */
export async function validateLibrary({
  root = PROJECT_ROOT,
  checkProjection = true,
  writeProjection = false,
} = {}) {
  const errors = [];
  const add = (code, fileId = 'library') => {
    if (
      errors.length < MAX_ERRORS &&
      !errors.some((error) => error.code === code && error.fileId === fileId)
    )
      errors.push(
        Object.freeze({ code, fileId, message: CODE_MESSAGES[code] }),
      );
  };
  const failed = () => ({ ok: false, errors });
  try {
    const rootPath = await realpath(root);
    const cache = new Map();
    let corpusBytes = 0;
    const safePath = async (relative, fileId, { optional = false } = {}) => {
      if (
        typeof relative !== 'string' ||
        relative.length > 220 ||
        !/^[A-Za-z0-9_./-]+$/.test(relative) ||
        relative.startsWith('/') ||
        relative
          .split('/')
          .some((part) => !part || part === '.' || part === '..')
      ) {
        add('UNSAFE_PATH', fileId);
        return null;
      }
      let cursor = rootPath;
      for (const part of relative.split('/')) {
        cursor = path.join(cursor, part);
        try {
          if ((await lstat(cursor)).isSymbolicLink()) {
            add('SYMLINK_REJECTED', fileId);
            return null;
          }
        } catch {
          if (optional)
            return cursor === path.join(rootPath, relative) ? cursor : null;
          add('FILE_UNAVAILABLE', fileId);
          return null;
        }
      }
      const resolved = await realpath(cursor);
      if (!resolved.startsWith(`${rootPath}${path.sep}`)) {
        add('UNSAFE_PATH', fileId);
        return null;
      }
      return resolved;
    };
    const read = async (relative, fileId = relative) => {
      if (cache.has(relative)) return cache.get(relative);
      const resolved = await safePath(relative, fileId);
      if (!resolved) return null;
      try {
        const stat = await lstat(resolved);
        if (!stat.isFile()) {
          add('FILE_UNAVAILABLE', fileId);
          return null;
        }
        if (stat.size > MAX_FILE_BYTES) {
          add('FILE_LIMIT', fileId);
          return null;
        }
        const buffer = await readFile(resolved);
        if (buffer.length > MAX_FILE_BYTES) {
          add('FILE_LIMIT', fileId);
          return null;
        }
        corpusBytes += buffer.length;
        if (corpusBytes > MAX_CORPUS_BYTES) {
          add('CORPUS_LIMIT', 'library');
          return null;
        }
        const result = { buffer, text: buffer.toString('utf8') };
        cache.set(relative, result);
        return result;
      } catch {
        add('FILE_UNAVAILABLE', fileId);
        return null;
      }
    };
    const inputs = [];
    for (const file of INPUT_FILES) {
      const input = await read(file);
      if (!input) {
        inputs.push(null);
        continue;
      }
      try {
        inputs.push(JSON.parse(input.text));
      } catch {
        add('INVALID_JSON', file);
        inputs.push(null);
      }
    }
    if (errors.length) return failed();
    const [registry, registrySchema, manifest, manifestSchema] = inputs;
    let Ajv;
    try {
      Ajv = (await import('ajv')).default;
    } catch {
      add('VALIDATOR_UNAVAILABLE');
      return failed();
    }
    for (const [data, schema, fileId, schemaId] of [
      [registry, registrySchema, INPUT_FILES[0], INPUT_FILES[1]],
      [manifest, manifestSchema, INPUT_FILES[2], INPUT_FILES[3]],
    ]) {
      try {
        const ajv = new Ajv({
          strict: true,
          allErrors: true,
          logger: false,
          verbose: false,
          coerceTypes: false,
          useDefaults: false,
          removeAdditional: false,
          validateFormats: false,
          ownProperties: true,
          loopRequired: 100,
          loopEnum: 100,
        });
        const valid = ajv.compile(schema);
        if (!valid(data)) add('SCHEMA_MISMATCH', fileId);
      } catch {
        add('INVALID_SCHEMA', schemaId);
      }
    }
    if (errors.length) return failed();
    for (const [data, fileId] of [
      [registry, INPUT_FILES[0]],
      [manifest, INPUT_FILES[2]],
    ]) {
      if (data.upstreamRevision !== FROZEN_UPSTREAM_REVISION)
        add('PIN_MISMATCH', fileId);
      const visit = (value) => {
        if (value === null || typeof value !== 'object') return;
        for (const [key, child] of Object.entries(value)) {
          if (
            /^(?:apiKey|api_key|secret|token|password|authorization|credential|keyPresence|keyPresent|health|feedHealth|freshness|timestamp|loadedCount|cacheSize|observedAt)$/i.test(
              key,
            )
          )
            add('FORBIDDEN_FIELD', fileId);
          if (
            /Date$/.test(key) &&
            child !== null &&
            (typeof child !== 'string' ||
              !/^\d{4}-\d{2}-\d{2}$/.test(child) ||
              !Number.isFinite(Date.parse(`${child}T00:00:00Z`)) ||
              new Date(`${child}T00:00:00Z`).toISOString().slice(0, 10) !==
                child)
          )
            add('CONTENT_MISMATCH', fileId);
          visit(child);
        }
      };
      visit(data);
    }
    const unique = (rows, key, fileId) => {
      const values = rows.map((row) => row[key]);
      if (
        values.some((value) => !isId(value)) ||
        new Set(values).size !== values.length
      )
        add('DUPLICATE_ID', fileId);
      return new Set(values);
    };
    const capabilities = unique(registry.capabilities, 'id', INPUT_FILES[0]);
    const sourceIds = unique(registry.sources, 'id', INPUT_FILES[0]);
    const guides = unique(registry.guideGroups, 'id', INPUT_FILES[0]);
    if (!same([...guides].sort(), [...EXPECTED_GUIDES].sort()))
      add('IDENTITY_MISMATCH', INPUT_FILES[0]);
    const declaredSetup = registry.capabilities
      .filter((row) => row.setupKeyId !== null)
      .map((row) => row.setupKeyId);
    if (
      new Set(declaredSetup).size !== declaredSetup.length ||
      !same([...declaredSetup].sort(), [...SETUP_KEYS.keys()].sort())
    )
      add('IDENTITY_MISMATCH', INPUT_FILES[0]);
    for (const capability of registry.capabilities) {
      const key = SETUP_KEYS.get(capability.setupKeyId);
      const expected =
        key?.envVars ||
        (capability.id === 'ontario-511' ? ['ONTARIO_511_API_KEY'] : null);
      if (
        !expected ||
        !same([...capability.environmentNames].sort(), [...expected].sort())
      )
        add('IDENTITY_MISMATCH', INPUT_FILES[0]);
      if (
        capability.visibility !==
        (key ? (key.hidden ? 'hidden' : 'visible') : 'environment-only')
      )
        add('IDENTITY_MISMATCH', INPUT_FILES[0]);
    }
    const refs = (values, known, fileId = INPUT_FILES[0]) => {
      if (
        new Set(values).size !== values.length ||
        values.some((value) => !known.has(value))
      )
        add('UNKNOWN_REFERENCE', fileId);
    };
    const link = (url, fileId, options) => {
      if (!isSafeLibraryUrl(url, options)) add('UNSAFE_URL', fileId);
    };
    const products = new Set();
    for (const source of registry.sources) {
      link(source.homepage, INPUT_FILES[0]);
      link(source.docsUrl, INPUT_FILES[0]);
      unique(source.products, 'id', INPUT_FILES[0]);
      for (const product of source.products)
        products.add(`${source.id}/${product.id}`);
    }
    for (const source of registry.sources)
      for (const product of source.products) {
        refs(product.access.requiredCapabilityRefs, capabilities);
        refs(product.access.optionalCapabilityRefs, capabilities);
        if (
          product.access.requiredCapabilityRefs.some((id) =>
            product.access.optionalCapabilityRefs.includes(id),
          )
        )
          add('UNKNOWN_REFERENCE', INPUT_FILES[0]);
        for (const cadence of [
          product.publisherCadence,
          product.applicationRefresh,
          product.cacheTtl,
        ]) {
          if ((cadence.value === null) !== (cadence.unit === null))
            add('CONTENT_MISMATCH', INPUT_FILES[0]);
        }
        for (const url of product.terms.urls) link(url, INPUT_FILES[0]);
        for (const evidence of product.evidence) {
          if (evidence.url !== null) link(evidence.url, INPUT_FILES[0]);
          if (
            ![FROZEN_UPSTREAM_REVISION, APPROVED_CUSTOM_REVISION].includes(
              evidence.revision,
            )
          )
            add('PIN_MISMATCH', INPUT_FILES[0]);
          const allowedEvidencePath =
            /^(?:(?:src|server)\/[A-Za-z0-9_/-]+\.(?:js|mjs|json)|build\/customProviderPolicy\.js|README\.md|DATA_SOURCES\.md|SECURITY\.md|TESTING\.md|THIRD_PARTY_NOTICES\.md|CONTRIBUTING\.md|docs\/CURRENT-STATE\.md|public\/events\/bhote-koshi-2026\/README\.md)$/.test(
              evidence.path,
            );
          if (!allowedEvidencePath) {
            add('UNSAFE_PATH', INPUT_FILES[0]);
            continue;
          }
          const isCustomEvidence =
            evidence.path.startsWith('src/custom/') ||
            evidence.path === 'build/customProviderPolicy.js';
          if (
            evidence.revision !==
            (isCustomEvidence
              ? APPROVED_CUSTOM_REVISION
              : FROZEN_UPSTREAM_REVISION)
          )
            add('PIN_MISMATCH', INPUT_FILES[0]);
          const local = await read(evidence.path, INPUT_FILES[0]);
          if (
            local &&
            (!evidence.section || !local.text.includes(evidence.section))
          )
            add('EVIDENCE_MISMATCH', INPUT_FILES[0]);
        }
      }
    for (const guide of registry.guideGroups) {
      if (guide.setupKeyId !== null && !SETUP_KEYS.has(guide.setupKeyId))
        add('UNKNOWN_REFERENCE', INPUT_FILES[0]);
      if (
        guide.setupKeyId !== null &&
        (guide.id !== guide.setupKeyId ||
          SETUP_KEYS.get(guide.setupKeyId)?.hidden ||
          guide.setupUrl !== '/?setup=1')
      )
        add('IDENTITY_MISMATCH', INPUT_FILES[0]);
      if (guide.setupKeyId === null && guide.setupUrl !== null)
        add('IDENTITY_MISMATCH', INPUT_FILES[0]);
      if (guide.setupUrl !== null)
        link(guide.setupUrl, INPUT_FILES[0], { allowLocal: true });
      link(guide.docsHref, INPUT_FILES[0], { allowLocal: true });
      refs(guide.sourceProductRefs, products);
    }
    const bindingIds = new Set();
    const layerBindings = new Map();
    for (const binding of registry.bindings) {
      const id = `${binding.layerId}/${binding.valueId}`;
      if (bindingIds.has(id)) add('DUPLICATE_ID', INPUT_FILES[0]);
      bindingIds.add(id);
      if (!EXPECTED_LAYERS.has(binding.layerId) || !KINDS.has(binding.kind))
        add('UNKNOWN_REFERENCE', INPUT_FILES[0]);
      refs(binding.sourceProductRefs, products);
      refs(binding.requiredCapabilityRefs, capabilities);
      refs(binding.optionalCapabilityRefs, capabilities);
      refs(binding.guideRefs, guides);
      if (
        binding.requiredKeyId !== null &&
        !SETUP_KEYS.has(binding.requiredKeyId)
      )
        add('UNKNOWN_REFERENCE', INPUT_FILES[0]);
      const requiredKey =
        { 'ais-live-vessels': 'aisstream', 'local-firms': 'firms' }[
          binding.layerId
        ] || null;
      if (binding.requiredKeyId !== requiredKey)
        add('IDENTITY_MISMATCH', INPUT_FILES[0]);
      const existing = layerBindings.get(binding.layerId);
      if (
        existing &&
        (!same(existing.guideRefs, binding.guideRefs) ||
          existing.requiredKeyId !== binding.requiredKeyId)
      )
        add('IDENTITY_MISMATCH', INPUT_FILES[0]);
      layerBindings.set(binding.layerId, binding);
    }
    if (!same([...layerBindings.keys()].sort(), [...EXPECTED_LAYERS].sort()))
      add('IDENTITY_MISMATCH', INPUT_FILES[0]);
    const docIds = unique(manifest.upstreamDocuments, 'id', INPUT_FILES[2]);
    if (manifest.upstreamDocuments.length !== ADMITTED_DOCUMENTS.length)
      add('ADMISSION_MISMATCH', INPUT_FILES[2]);
    const docPaths = new Set();
    for (const doc of manifest.upstreamDocuments) {
      const admission = ADMITTED_DOCUMENTS.find((row) => row.path === doc.path);
      if (!admission || docPaths.has(doc.path)) {
        add('ADMISSION_MISMATCH', INPUT_FILES[2]);
        continue;
      }
      docPaths.add(doc.path);
      if (doc.upstreamRevision !== FROZEN_UPSTREAM_REVISION)
        add('PIN_MISMATCH', INPUT_FILES[2]);
      const canonicalUrl = `https://github.com/bilawalsidhu/gods-eye-view/blob/${FROZEN_UPSTREAM_REVISION}/${doc.path}`;
      if (doc.sourceUrl !== canonicalUrl)
        add('ADMISSION_MISMATCH', INPUT_FILES[2]);
      unique(doc.sections, 'id', INPUT_FILES[2]);
      const actualSelections = doc.sections.map(
        ({ id, ...section }) => section,
      );
      if (
        doc.sha256 !== admission.sha256 ||
        !same(actualSelections, admission.sections)
      )
        add('ADMISSION_MISMATCH', INPUT_FILES[2]);
      const local = await read(doc.path, INPUT_FILES[2]);
      if (!local) continue;
      if (sha256(local.buffer) !== admission.sha256)
        add('HASH_MISMATCH', INPUT_FILES[2]);
      for (const section of doc.sections) {
        const range = headingRange(local.text, section);
        if (
          !range ||
          range.startLine !== section.startLine ||
          range.endLine !== section.endLine
        )
          add('ADMISSION_MISMATCH', INPUT_FILES[2]);
        else if (sha256(range.text) !== section.sha256)
          add('HASH_MISMATCH', INPUT_FILES[2]);
      }
    }
    unique(manifest.items, 'id', INPUT_FILES[2]);
    const slugs = new Set();
    for (const item of manifest.items) {
      const routeFamily = item.kind === 'case-study' ? 'cases' : 'knowledge';
      if (
        !isId(item.slug) ||
        item.slug.length > 64 ||
        slugs.has(`${routeFamily}/${item.slug}`)
      )
        add('DUPLICATE_ID', INPUT_FILES[2]);
      slugs.add(`${routeFamily}/${item.slug}`);
      refs(item.sourceProductRefs, products, INPUT_FILES[2]);
      if (item.kind === 'upstream-documentation') {
        const doc = manifest.upstreamDocuments.find(
          (document) => document.id === item.upstreamDocumentId,
        );
        if (!doc || item.contentPath !== null || !item.sectionIds.length)
          add('UNKNOWN_REFERENCE', INPUT_FILES[2]);
        else {
          refs(
            item.sectionIds,
            new Set(doc.sections.map((section) => section.id)),
            INPUT_FILES[2],
          );
          if (
            item.inputSha256 !== doc.sha256 ||
            item.upstreamRevision !== FROZEN_UPSTREAM_REVISION ||
            (item.status === 'published' && !doc.published)
          )
            add('CONTENT_MISMATCH', INPUT_FILES[2]);
        }
      } else {
        if (!ORIGINAL_CONTENT_PATHS.has(item.contentPath)) {
          add('UNSAFE_PATH', INPUT_FILES[2]);
          continue;
        }
        if (
          item.upstreamDocumentId !== null ||
          item.sectionIds.length ||
          item.upstreamRevision !== null
        )
          add('CONTENT_MISMATCH', INPUT_FILES[2]);
        if (
          (item.kind === 'case-study') !==
          item.contentPath.startsWith('content/cases/')
        )
          add('CONTENT_MISMATCH', INPUT_FILES[2]);
        const local = await read(item.contentPath, INPUT_FILES[2]);
        if (
          local &&
          (local.buffer.length > 256 * 1024 ||
            !local.text.trim() ||
            item.inputSha256 !== sha256(local.buffer))
        )
          add('CONTENT_MISMATCH', INPUT_FILES[2]);
        if (item.kind === 'external-summary') {
          const required = new Map([
            [
              'content/knowledge/gods-eye-view-blew-up-then-astra-summary.md',
              'https://www.spatialintelligence.ai/p/gods-eye-view-blew-up-then-astra',
            ],
            [
              'content/knowledge/i-open-sourced-gods-eye-view-summary.md',
              'https://www.spatialintelligence.ai/p/i-open-sourced-gods-eye-view',
            ],
          ]).get(item.contentPath);
          if (
            !required ||
            !item.references.some((reference) => reference.url === required)
          )
            add('CONTENT_MISMATCH', INPUT_FILES[2]);
        }
      }
      if (item.kind === 'case-study') {
        const details = item.caseDetails;
        if (
          !details ||
          (details.globeUrl !== null && !details.restoredScope) ||
          (details.globeUrl === null && details.restoredScope !== null)
        )
          add('CONTENT_MISMATCH', INPUT_FILES[2]);
        if (details?.globeUrl !== null && details?.globeUrl !== undefined) {
          try {
            validateGlobeLink(details.globeUrl, {
              origin: 'http://localhost:4173',
            });
          } catch {
            add('UNSAFE_URL', INPUT_FILES[2]);
          }
        }
      } else if (item.caseDetails !== null)
        add('CONTENT_MISMATCH', INPUT_FILES[2]);
      for (const reference of item.references)
        link(reference.url, INPUT_FILES[2]);
    }
    if (errors.length) return failed();
    const inputDigest = sha256(
      INPUT_FILES.map((file) => `${file}\0${cache.get(file).text}`).join('\0'),
    );
    const projection = createMetadataProjection(registry, inputDigest);
    const projectionText = serializeMetadataProjection(projection);
    if (writeProjection) {
      const destination = await safePath(PROJECTION_PATH, 'projection', {
        optional: true,
      });
      if (!destination) {
        add('PROJECTION_WRITE_FAILED', 'projection');
        return failed();
      }
      const temporary = `${destination}.${randomUUID()}.tmp`;
      try {
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(temporary, projectionText, { flag: 'wx' });
        await rename(temporary, destination);
      } catch {
        add('PROJECTION_WRITE_FAILED', 'projection');
        await unlink(temporary).catch(() => {});
      }
    } else if (checkProjection) {
      const projectionInput = await read(PROJECTION_PATH, 'projection');
      if (!projectionInput || projectionInput.text !== projectionText)
        add('STALE_PROJECTION', 'projection');
    }
    if (errors.length) return failed();
    return {
      ok: true,
      errors,
      registry,
      manifest,
      projection,
      stats: {
        sources: sourceIds.size,
        products: products.size,
        guides: guides.size,
        layers: layerBindings.size,
        values: bindingIds.size,
        documents: docIds.size,
        sections: manifest.upstreamDocuments.reduce(
          (count, doc) => count + doc.sections.length,
          0,
        ),
        items: manifest.items.length,
        corpusBytes,
      },
    };
  } catch {
    add('VALIDATOR_UNAVAILABLE');
    return failed();
  }
}
