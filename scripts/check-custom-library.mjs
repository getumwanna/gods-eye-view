#!/usr/bin/env node
import { validateLibrary } from '../build/libraryValidation.js';

const args = process.argv.slice(2);
if (args.some((arg) => arg !== '--write-projection') || args.length > 1) {
  console.error(
    'Usage: node scripts/check-custom-library.mjs [--write-projection]',
  );
  process.exitCode = 2;
} else {
  const result = await validateLibrary({
    writeProjection: args.includes('--write-projection'),
  });
  if (result.ok) {
    const { layers, values, guides, products, documents, sections, items } =
      result.stats;
    console.log(
      `[PASS] Library: ${layers} layers, ${values} values, ${guides} guides, ${products} products, ${documents} documents, ${sections} admitted sections, ${items} articles/cases.`,
    );
    if (args.length)
      console.log('[PASS] Validated source metadata projection written.');
  } else {
    for (const error of result.errors)
      console.error(`[FAIL] ${error.code} (${error.fileId}): ${error.message}`);
    process.exitCode = 1;
  }
}
