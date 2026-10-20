import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

const root = fileURLToPath(new URL('../', import.meta.url));

/** Extend the root website build; direct standalone/MCP builds stay single-entry. */
export function withHubConfig(standalone) {
  return {
    ...standalone,
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
