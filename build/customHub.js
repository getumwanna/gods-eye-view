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
    plugins: [...standalone.plugins, ...tailwindcss()],
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
