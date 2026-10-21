# Phase 2a dependency review

Reviewed October 20, 2026 under Node 24.22.0 / npm 11.19.1. The user approved this dependency list subject to milestone 1 version review. Phase 2b is deferred.

| Dependency     | Exact version | Role                                                                           | License |
| -------------- | ------------- | ------------------------------------------------------------------------------ | ------- |
| react-markdown | 10.1.0        | Library Markdown rendering; raw HTML disabled                                  | MIT     |
| remark-gfm     | 4.0.1         | Library tables and other GFM syntax                                            | MIT     |
| unified        | 11.0.5        | Local Markdown analysis and section/search extraction                          | MIT     |
| remark-parse   | 11.0.0        | Parse admitted Markdown                                                        | MIT     |
| minisearch     | 7.2.0         | Local Library search                                                           | MIT     |
| ajv            | 8.20.0        | devDependency: authoritative Node validation, DEV-only lazy Library validation | MIT     |

The first five are runtime dependencies confined to the lazy Library graph. Ajv is a development dependency: the complete compiler and schema-validation branch must be absent from production output. No MDX, raw HTML renderer, hosted search, remote CMS, new UI kit, or new provider adapter is added. React Markdown accepts React and React types >=18; the existing React 19 stack satisfies those peer requirements. Existing runtime/engine requirements remain unchanged.

The isolated exact-version review resolved 110 packages: 108 MIT, one ISC and one BSD-3-Clause. None declared an install, preinstall or postinstall hook. Its audit reported zero vulnerabilities. Registry metadata, complete resolved graph, licenses, engines, lock and audit are retained under `.gev-logs/phase2a-m1/dependency-review/`. The project lock adds 111 paths, including type/transitive placement differences from the isolated fixture. Every previously locked package version is preserved; no `npm audit fix` or stack upgrade was performed. A clean project `npm ci` completed successfully.

Package roles and original sources: [React Markdown](https://github.com/remarkjs/react-markdown), [remark-gfm](https://github.com/remarkjs/remark-gfm), [unified](https://github.com/unifiedjs/unified), [remark-parse](https://github.com/remarkjs/remark/tree/main/packages/remark-parse), [MiniSearch](https://github.com/lucaong/minisearch), [Ajv](https://github.com/ajv-validator/ajv). Exact package metadata was retrieved from the official npm registry before project installation.

## Existing stack audit finding

The fresh baseline audit identifies the already locked Vite 6.4.3 through three editor-launching advisories; none is introduced by these Library dependencies. The aggregate npm finding is high. [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm) and [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv) describe Windows command handling. [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw) describes a Vite exposure requiring WSL and specific editors plus an attacker-created filename. The current server is native macOS, so those described platform conditions do not apply to this local run. Vite 6.4.4 is the published patch; upgrading the preserved stack is separate from this approved addition and has not been performed. Previous zero-finding audit receipts remain historical results, not current audit claims.

## Bundle review

The approved post-pin comparison in `PHASE-2A-REVERIFICATION.md` measured Ajv raw/gzip/Brotli cost in an isolated fixture. Implementation acceptance must also measure actual production chunks, ensure no Ajv compiler/schema-validator runtime remains, and show that the globe and initial hub graphs have no editable corpus, Markdown, MiniSearch or lazy validation dependency. Record those actual results in `PHASE-2A-VALIDATION.md`; no fixture measurement is substituted for the product checks.
