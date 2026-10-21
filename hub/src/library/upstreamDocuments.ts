import type { AdmittedDocument, ValidationIssue } from './types';

// Explicit, reviewed admission list. Missing files produce an absent map entry, not a failed JSON compiler import.
const upstreamRawModules = import.meta.glob(
  [
    '../../../README.md',
    '../../../docs/CURRENT-STATE.md',
    '../../../DATA_SOURCES.md',
    '../../../SECURITY.md',
    '../../../CONTRIBUTING.md',
    '../../../TESTING.md',
    '../../../THIRD_PARTY_NOTICES.md',
  ],
  { query: '?raw', import: 'default' },
);

export const admittedUpstreamPaths = Object.freeze([
  'README.md',
  'docs/CURRENT-STATE.md',
  'DATA_SOURCES.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'TESTING.md',
  'THIRD_PARTY_NOTICES.md',
]);

export async function loadUpstreamDocuments(): Promise<Record<string, string>> {
  const entries = await Promise.all(
    Object.entries(upstreamRawModules).map(
      async ([path, load]) =>
        [path.replace('../../../', ''), await load()] as const,
    ),
  );
  if (
    entries.some(
      ([, value]) =>
        typeof value !== 'string' ||
        new TextEncoder().encode(value).byteLength > 2_000_000,
    )
  )
    throw new Error('raw-document');
  return Object.fromEntries(entries) as Record<string, string>;
}

function headingLine(lines: string[], heading: string, occurrence: number) {
  let count = 0;
  return lines.findIndex(
    (line) => line.replace(/\r$/, '') === heading && ++count === occurrence,
  );
}

export function selectAdmittedSections(
  document: AdmittedDocument,
  raw: string,
): string | null {
  const lines = raw.split(/(?<=\n)/);
  const plainLines = lines.map((line) => line.replace(/\r?\n$/, ''));
  const sections: string[] = [];
  for (const section of document.sections) {
    const start = headingLine(
      plainLines,
      section.startHeading,
      section.startOccurrence,
    );
    const end =
      section.endHeading === null
        ? lines.length
        : headingLine(
            plainLines,
            section.endHeading,
            section.endOccurrence || 1,
          );
    if (
      start < 0 ||
      end <= start ||
      start + 1 !== section.startLine ||
      end !== section.endLine
    )
      return null;
    sections.push(lines.slice(start, end).join(''));
  }
  return sections.join('\n');
}

// Frozen reviewed identities and byte ranges; editable manifests cannot widen their own admission.
const frozenAdmissions = [
  {
    id: 'readme',
    path: 'README.md',
    sourceUrl:
      'https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/README.md',
    upstreamRevision: '064d51f7be2675f1c69e16068e9c49d1a60144d1',
    sha256: '71dcf820eaf5f38d0891818d7e7775b637f2832cd9e578b6e26bcde282bc3289',
    sections: [
      {
        id: 'readme-1',
        startHeading: '## 🌍 Why This Exists',
        startOccurrence: 1,
        endHeading: '## 🎛️ What This Thing Does',
        endOccurrence: 1,
        startLine: 41,
        endLine: 56,
        sha256:
          'e405c7febda4942332596da68a42536ad818d51580e8cde8857cb87458fa69b0',
      },
      {
        id: 'readme-2',
        startHeading: '## 📷 Street Level',
        startOccurrence: 1,
        endHeading: '## 🎖️ Field Missions',
        endOccurrence: 1,
        startLine: 422,
        endLine: 431,
        sha256:
          '21175d2fcc5288b3407944e26f18ddd870c03eb6b94028276e92d20a620723d5',
      },
      {
        id: 'readme-3',
        startHeading: '## 📋 Responsible & Open',
        startOccurrence: 1,
        endHeading: "## 🧭 What's Next",
        endOccurrence: 1,
        startLine: 627,
        endLine: 649,
        sha256:
          '745f4992edffdc8908bea1685ca4fc1c9af906489a91083b04f6fcdb96c926ac',
      },
    ],
  },
  {
    id: 'docs-current-state',
    path: 'docs/CURRENT-STATE.md',
    sourceUrl:
      'https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/docs/CURRENT-STATE.md',
    upstreamRevision: '064d51f7be2675f1c69e16068e9c49d1a60144d1',
    sha256: '420279fd1ef76614e87bfd68f8e12490d1b0fbf90b07bda8fa5887d0528a592e',
    sections: [
      {
        id: 'docs-current-state-1',
        startHeading: '## Canonical Docs Order',
        startOccurrence: 1,
        endHeading: '## Current Baseline',
        endOccurrence: 1,
        startLine: 3435,
        endLine: 3444,
        sha256:
          'debdeb999c158c0af1cc70fd7e5b981cb94d5b2f185818c15d91a9bad0e28bb4',
      },
      {
        id: 'docs-current-state-2',
        startHeading: '## Current Baseline',
        startOccurrence: 1,
        endHeading: '## Runtime Stack',
        endOccurrence: 1,
        startLine: 3445,
        endLine: 3450,
        sha256:
          '9e42c86b2bbd98df94049f692986dbaf7baefcb056358c9b129ceefd143d3fbf',
      },
      {
        id: 'docs-current-state-3',
        startHeading: '### Recent Imagery (September 2026)',
        startOccurrence: 1,
        endHeading: '### 3D Aircraft + Tracking (June 2026)',
        endOccurrence: 1,
        startLine: 4992,
        endLine: 5010,
        sha256:
          'be752df08d357098a6dd75e77fe0866d72361fe0d9f9c359cd2b9b8653babf8d',
      },
      {
        id: 'docs-current-state-4',
        startHeading: '## Maintenance Rule',
        startOccurrence: 1,
        endHeading: '## Dependency security baseline',
        endOccurrence: 1,
        startLine: 5569,
        endLine: 5572,
        sha256:
          'a96873384dbce8d66f61350d83a6aedd7deb0fbc491ddb16ba003765aeefc8bd',
      },
    ],
  },
  {
    id: 'data-sources',
    path: 'DATA_SOURCES.md',
    sourceUrl:
      'https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md',
    upstreamRevision: '064d51f7be2675f1c69e16068e9c49d1a60144d1',
    sha256: 'fc18b241756d3b029c2c521de1fd73b27c0252529037620956f5ce1d4159242c',
    sections: [
      {
        id: 'data-sources-1',
        startHeading: '# Data Sources & Attribution',
        startOccurrence: 1,
        endHeading:
          '## Live sources (fetched at runtime — not stored in this repo)',
        endOccurrence: 1,
        startLine: 1,
        endLine: 13,
        sha256:
          'd022fe7ec0ed00c8c25cdf9a57df094116fdc15776152c51e18a627cdd28d8aa',
      },
      {
        id: 'data-sources-2',
        startHeading:
          '## Live sources (fetched at runtime — not stored in this repo)',
        startOccurrence: 1,
        endHeading: '### Local receiver input (not fetched from a service)',
        endOccurrence: 1,
        startLine: 14,
        endLine: 100,
        sha256:
          'e017d00a7868902c7637be3b06fc4626fe5497203fb705b11a00d4973c693990',
      },
      {
        id: 'data-sources-3',
        startHeading: '## Bundled snapshots',
        startOccurrence: 1,
        endHeading: '### ALPR camera mapping',
        endOccurrence: 1,
        startLine: 192,
        endLine: 218,
        sha256:
          '8ffbe7a97e814464b0a291945a6de812adb4c3770232246a9975b866d7abddfd',
      },
      {
        id: 'data-sources-4',
        startHeading: '### ALPR camera mapping',
        startOccurrence: 1,
        endHeading:
          '### CCTV Camera Database (`src/layers/cctv/modelSpecs.js`)',
        endOccurrence: 1,
        startLine: 219,
        endLine: 234,
        sha256:
          '54f0dffb7ed840d9e280423bcf650763e8e6a38791ef941aed8149a6e888d6fa',
      },
      {
        id: 'data-sources-5',
        startHeading: '### NASA FIRMS acknowledgement',
        startOccurrence: 1,
        endHeading: '### Natural Earth physical regions (`natural_earth/`)',
        endOccurrence: 1,
        startLine: 250,
        endLine: 260,
        sha256:
          '7737f87a3f94799e999297e412797b9819eb1c178dc90cf4fc66c7097b62f4bc',
      },
      {
        id: 'data-sources-6',
        startHeading: '### Weather: NHC/CPHC cyclone advisories',
        startOccurrence: 1,
        endHeading: '### Weather: observed lightning density',
        endOccurrence: 1,
        startLine: 388,
        endLine: 402,
        sha256:
          'bbf5eb459fd85a6650d0ffd00f6b7585af57758e38e40fd4f8f8501e82d69939',
      },
      {
        id: 'data-sources-7',
        startHeading: '## In-app attribution',
        startOccurrence: 1,
        endHeading: null,
        endOccurrence: null,
        startLine: 434,
        endLine: 436,
        sha256:
          '49fb1b2246ccc43f6efea29e33a37b4d0373183802cce0f9f0e9e61fcc866d0a',
      },
    ],
  },
  {
    id: 'security',
    path: 'SECURITY.md',
    sourceUrl:
      'https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/SECURITY.md',
    upstreamRevision: '064d51f7be2675f1c69e16068e9c49d1a60144d1',
    sha256: '44be7e36c892af9311d8702f5574ebeff5bbca1843a6d0cf3202af2e68b3423f',
    sections: [
      {
        id: 'security-1',
        startHeading: '## Reporting a vulnerability',
        startOccurrence: 1,
        endHeading: '## How secrets are handled',
        endOccurrence: 1,
        startLine: 5,
        endLine: 13,
        sha256:
          '43577e1f7713407e5a7dab8e0c98b10475f8056d2517aec3b42e9657d1b3703f',
      },
      {
        id: 'security-2',
        startHeading: '## How secrets are handled',
        startOccurrence: 1,
        endHeading: '### Configuring separate Google keys locally',
        endOccurrence: 1,
        startLine: 14,
        endLine: 49,
        sha256:
          '064d431dc0c0512fb0ef602cb4156578a24753deb26c3ab551e4a9453372eda4',
      },
      {
        id: 'security-3',
        startHeading: '## Scope & expectations',
        startOccurrence: 1,
        endHeading: '## Responsible use',
        endOccurrence: 1,
        startLine: 121,
        endLine: 126,
        sha256:
          'c32d93fc57b878efb0658488035db4a34c00a214b3512d7878cc58e21e813d8b',
      },
      {
        id: 'security-4',
        startHeading: '## Responsible use',
        startOccurrence: 1,
        endHeading: null,
        endOccurrence: null,
        startLine: 127,
        endLine: 129,
        sha256:
          '73b61b70d58299f1ba0fc14e93ffc89c5068ad197ea5ba6bd1cda225661715eb',
      },
    ],
  },
  {
    id: 'contributing',
    path: 'CONTRIBUTING.md',
    sourceUrl:
      'https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/CONTRIBUTING.md',
    upstreamRevision: '064d51f7be2675f1c69e16068e9c49d1a60144d1',
    sha256: '0fa5e6749f93a6decb05c25565c71bb155de72903ce1cee524a2e967d9d23833',
    sections: [
      {
        id: 'contributing-1',
        startHeading: '## Coding style',
        startOccurrence: 1,
        endHeading: '## Pull requests',
        endOccurrence: 1,
        startLine: 124,
        endLine: 148,
        sha256:
          'c160f98bfc5cf4ff1e512c36e065e36b0f8e0b193ae45bfc62e1ed171934a785',
      },
      {
        id: 'contributing-2',
        startHeading: '## Pull requests',
        startOccurrence: 1,
        endHeading: '## Maintainers',
        endOccurrence: 1,
        startLine: 149,
        endLine: 156,
        sha256:
          'dac11df3a14921ed213d20f4aed01f08ea65fddff3cb59c252d94c7c2ca972d8',
      },
      {
        id: 'contributing-3',
        startHeading: '## Maintainers',
        startOccurrence: 1,
        endHeading: '## Ground rules',
        endOccurrence: 1,
        startLine: 157,
        endLine: 163,
        sha256:
          '9439e901c5cc20e66155aa84eb96971b669c3e2e0a004232119b209856485f1b',
      },
      {
        id: 'contributing-4',
        startHeading: '## Ground rules',
        startOccurrence: 1,
        endHeading: null,
        endOccurrence: null,
        startLine: 164,
        endLine: 169,
        sha256:
          'bc7c1151f35fa1ab3ca01a4e9198032abbce697175e12e9bec5b018314099eb1',
      },
    ],
  },
  {
    id: 'testing',
    path: 'TESTING.md',
    sourceUrl:
      'https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/TESTING.md',
    upstreamRevision: '064d51f7be2675f1c69e16068e9c49d1a60144d1',
    sha256: '43a166e3e27d66f6226c8363fd91bb5364854d32795259a3bb880902e3ee7e22',
    sections: [
      {
        id: 'testing-1',
        startHeading:
          "# God's Eye View — Testing Guide (voice map-annotation whiteboard + live tracking)",
        startOccurrence: 1,
        endHeading: '## Focus/horizon moving evidence',
        endOccurrence: 1,
        startLine: 1,
        endLine: 12,
        sha256:
          'f8f91b9174545493e08eec262b5f731bff58b7e2fcb8ed4843740bc65cc525ff',
      },
      {
        id: 'testing-2',
        startHeading: '## Browser harness renderers',
        startOccurrence: 1,
        endHeading: null,
        endOccurrence: null,
        startLine: 235,
        endLine: 256,
        sha256:
          '94e4b4a7ecb12468b3417206881d332a1422c6ca6a9aaab4e0409600712a0b4e',
      },
    ],
  },
  {
    id: 'third-party-notices',
    path: 'THIRD_PARTY_NOTICES.md',
    sourceUrl:
      'https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/THIRD_PARTY_NOTICES.md',
    upstreamRevision: '064d51f7be2675f1c69e16068e9c49d1a60144d1',
    sha256: '785419169c062ab4ec00ecbdf5e4c5a28dc94b3067ece5132dfed4b23960a614',
    sections: [
      {
        id: 'third-party-notices-1',
        startHeading: '# Third-party software notices',
        startOccurrence: 1,
        endHeading: null,
        endOccurrence: null,
        startLine: 1,
        endLine: 47,
        sha256:
          '785419169c062ab4ec00ecbdf5e4c5a28dc94b3067ece5132dfed4b23960a614',
      },
    ],
  },
];

export function validateFrozenAdmissions(
  documents: AdmittedDocument[],
): ValidationIssue[] {
  const selection = (
    document: Pick<
      AdmittedDocument,
      'id' | 'path' | 'sourceUrl' | 'upstreamRevision' | 'sha256' | 'sections'
    >,
  ) => ({
    id: document.id,
    path: document.path,
    sourceUrl: document.sourceUrl,
    upstreamRevision: document.upstreamRevision,
    sha256: document.sha256,
    sections: document.sections.map((section) => ({
      id: section.id,
      startHeading: section.startHeading,
      startOccurrence: section.startOccurrence,
      endHeading: section.endHeading,
      endOccurrence: section.endOccurrence,
      startLine: section.startLine,
      endLine: section.endLine,
      sha256: section.sha256,
    })),
  });
  const actual = documents
    .map(selection)
    .sort((a, b) => a.path.localeCompare(b.path));
  const expected = frozenAdmissions
    .map(selection)
    .sort((a, b) => a.path.localeCompare(b.path));
  return JSON.stringify(actual) === JSON.stringify(expected)
    ? []
    : [
        {
          file: 'library.json',
          code: 'frozen-admission',
          message:
            'The document admissions differ from the reviewed frozen pin.',
        },
      ];
}

async function sha256(value: string) {
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export async function validateAdmittedDocuments(
  documents: AdmittedDocument[],
  raw: Record<string, string>,
  verifyHashes: boolean,
): Promise<ValidationIssue[]> {
  const errors: ValidationIssue[] = [];
  if (import.meta.env.DEV) errors.push(...validateFrozenAdmissions(documents));
  for (const document of documents) {
    const file = admittedUpstreamPaths.includes(document.path)
      ? document.path
      : 'library.json';
    if (
      !admittedUpstreamPaths.includes(document.path) ||
      typeof raw[document.path] !== 'string'
    ) {
      errors.push({
        file,
        code: 'missing-document',
        message: 'An admitted document is unavailable.',
      });
      continue;
    }
    const selected = selectAdmittedSections(document, raw[document.path]);
    if (selected === null) {
      errors.push({
        file,
        code: 'missing-section',
        message: 'An admitted document section is missing or has changed.',
      });
      continue;
    }
    if (import.meta.env.DEV && verifyHashes) {
      const lines = raw[document.path].split(/(?<=\n)/);
      if (
        (await sha256(raw[document.path])) !== document.sha256 ||
        (
          await Promise.all(
            document.sections.map(
              async (section) =>
                (await sha256(
                  lines.slice(section.startLine - 1, section.endLine).join(''),
                )) === section.sha256,
            ),
          )
        ).some((valid) => !valid)
      )
        errors.push({
          file,
          code: 'document-revision',
          message: 'An admitted document differs from its reviewed revision.',
        });
    }
  }
  return errors;
}
