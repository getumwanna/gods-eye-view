import standaloneConfig from './server/standalone/vite.config.js';
import { withHubConfig } from './build/customHub.js';

export default (env) => withHubConfig(standaloneConfig(env));
// Preserve existing test and tooling imports while provider modules are split.
export * from './server/providers/local.js';
