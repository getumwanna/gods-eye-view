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
        input: {
          globe: path.join(root, 'index.html'),
          hub: path.join(root, 'hub/index.html'),
        },
      },
    },
  };
}
