import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));

// Terms review and separate user approval are required before changing these.
export const FROZEN_PROVIDER_POLICY = Object.freeze({
  CCTV_HK_ENABLED: '0',
  CCTV_TAIWAN_ENABLED: '0',
});

// These hashes cover the pack gates and the dotenv-before-provider contract.
// An upstream update must be reviewed before accepting replacement hashes.
export const REVIEWED_PROVIDER_CONTRACTS = Object.freeze([
  Object.freeze({
    path: 'server/providers/cctv/catalog.js',
    sha256: '773e57387ac9cb8011dd8cba17d5a9876d83673d6c44702b4432a7f64cde303c',
  }),
  Object.freeze({
    path: 'server/standalone/vite.config.js',
    sha256: '2b37eba1e127a5a44ca48bfcb674fdc5a24f92f3d6dab88b51974511f455c921',
  }),
]);

export function checkProviderPolicyContracts(root = projectRoot) {
  for (const contract of REVIEWED_PROVIDER_CONTRACTS) {
    let actual;
    try {
      actual = createHash('sha256')
        .update(readFileSync(path.join(root, contract.path)))
        .digest('hex');
    } catch {
      // Do not include filesystem errors, environment values, or credentials.
    }
    if (actual !== contract.sha256) {
      const error = new Error(
        `[GEV provider policy] Reviewed contract changed: ${contract.path}. Review the camera gates and configuration loading before starting this server.`,
      );
      error.code = 'CUSTOM_PROVIDER_POLICY_CONTRACT_CHANGED';
      throw error;
    }
  }
  return true;
}

let announced = false;

export function applyCustomProviderPolicy({
  projectRoot: root = projectRoot,
  environment = process.env,
  announce = true,
} = {}) {
  checkProviderPolicyContracts(root);
  for (const [name, value] of Object.entries(FROZEN_PROVIDER_POLICY)) {
    environment[name] = value;
  }
  if (announce && !announced) {
    console.info(
      '[GEV provider policy] Hong Kong cameras OFF; Taiwan cameras OFF. Reviewed contracts verified.',
    );
    announced = true;
  }
  return FROZEN_PROVIDER_POLICY;
}
