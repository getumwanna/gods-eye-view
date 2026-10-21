import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { applyCustomProviderPolicy } from './customProviderPolicy.js';

const root = fileURLToPath(new URL('../', import.meta.url));

// Root config calls the upstream standalone factory after module evaluation.
// Set both gates first so its dotenv loader cannot enable either camera pack.
applyCustomProviderPolicy();

/** Extend the root website build; direct standalone/MCP builds stay single-entry. */
export function withHubConfig(standalone) {
  applyCustomProviderPolicy();
  return {
    ...standalone,
    // Integration-test servers use Vite's default cache in this same checkout.
    cacheDir:
      standalone.cacheDir ?? path.join(root, 'node_modules/.vite-custom-hub'),
    optimizeDeps: {
      ...standalone.optimizeDeps,
      include: [
        ...new Set([
          ...(standalone.optimizeDeps?.include || []),
          // esbuild injects these imports after dependency scanning.
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
          // DEV Library validation is lazy; prebundle before the server starts
          // so its first visit cannot restart the globe's dependency graph.
          'ajv',
        ]),
      ],
    },
    plugins: [
      ...standalone.plugins,
      ...tailwindcss(),
      customLibraryHmrContent(root),
    ],
    resolve: {
      ...standalone.resolve,
      alias: { ...standalone.resolve?.alias, '@': path.join(root, 'hub/src') },
    },
    esbuild: { ...standalone.esbuild, jsx: 'automatic' },
    build: {
      ...standalone.build,
      rollupOptions: {
        ...standalone.build?.rollupOptions,
        plugins: [
          ...(standalone.build?.rollupOptions?.plugins || []),
          {
            name: 'custom-library-build-validation',
            async buildStart() {
              // This hook only runs during production builds. Never validate
              // editable content at configuration time or dev-server startup.
              const { validateLibrary } =
                await import('./libraryValidation.js');
              const result = await validateLibrary({ root });
              if (!result.ok) {
                this.error(
                  'Library content is invalid. Run npm run check:library for normalized diagnostics.',
                );
              }
            },
          },
        ],
        input: {
          globe: path.join(root, 'index.html'),
          hub: path.join(root, 'hub/index.html'),
        },
      },
    },
  };
}

// DEV-only transport for the explicitly admitted public Library inputs.
// Content remains DEV-browser validated; this hook only contains Vite graph invalidation.
export const PUBLIC_LIBRARY_INPUTS = Object.freeze([
  'content/sources.json',
  'content/library.json',
  'content/sources.schema.json',
  'content/library.schema.json',
  'content/knowledge/project-background.md',
  'content/knowledge/first-five-minutes.md',
  'content/knowledge/understanding-data-labels.md',
  'content/knowledge/layers-and-coverage.md',
  'content/knowledge/keys-and-costs.md',
  'content/knowledge/gis-geoint-fundamentals.md',
  'content/knowledge/development-and-updates.md',
  'content/knowledge/gods-eye-view-blew-up-then-astra-summary.md',
  'content/knowledge/i-open-sourced-gods-eye-view-summary.md',
  'content/cases/nepal-flood.md',
  'content/cases/hurricane-tracking.md',
  'content/cases/launch-reconstruction.md',
  'content/cases/aircraft-incidents.md',
  'content/cases/satellite-imagery-change.md',
  'content/cases/ai-reconstruction-demonstrations.md',
  'README.md',
  'docs/CURRENT-STATE.md',
  'DATA_SOURCES.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'TESTING.md',
  'THIRD_PARTY_NOTICES.md',
]);
const normalize = (value) => path.resolve(value).split(path.sep).join('/');

export function customLibraryHmrContent(root) {
  const admitted = new Set(
    PUBLIC_LIBRARY_INPUTS.map((file) => normalize(path.join(root, file))),
  );
  const catalogId = normalize(path.join(root, 'hub/src/library/catalog.ts'));
  const upstreamId = normalize(
    path.join(root, 'hub/src/library/upstreamDocuments.ts'),
  );
  return {
    name: 'custom-library-hmr-content',
    apply: 'serve',
    hotUpdate: {
      order: 'post',
      handler({ file, modules, timestamp }) {
        if (
          this.environment.name !== 'client' ||
          !admitted.has(normalize(file))
        )
          return;
        const graph = this.environment.moduleGraph;
        const seen = new Set();
        // Vite's raw watch node may have lost its importer during unlink; it still
        // needs invalidation, but must not become the HMR propagation boundary.
        const invalidated = new Set([
          ...(graph.getModulesByFile(normalize(file)) || []),
          ...modules,
        ]);
        // The admitted upstream-document glob is a separate cached module. Keep
        // it fresh even when the changed file was absent at initial startup.
        for (const ownerId of [upstreamId, catalogId]) {
          const owner = graph.getModuleById(ownerId);
          if (owner) invalidated.add(owner);
        }
        for (const module of invalidated)
          graph.invalidateModule(module, seen, timestamp, true);
        const catalog = graph.getModuleById(catalogId);
        return catalog?.isSelfAccepting === true ? [catalog] : [];
      },
    },
  };
}
