const approvedPaths = new Set([
  'README.md',
  'docs/CURRENT-STATE.md',
  'DATA_SOURCES.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'TESTING.md',
  'THIRD_PARTY_NOTICES.md',
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
]);

/** SSR test adapter for the application's exact Vite raw-text admission lists. No repository-wide Markdown crawling. */
export function libraryRawImportTestAdapter({
  root,
  readFile,
  realpath,
  path,
}) {
  if (
    !root ||
    typeof readFile !== 'function' ||
    typeof realpath !== 'function' ||
    !path?.resolve
  )
    throw new Error(
      'Library test adapter requires explicit test-only filesystem helpers.',
    );
  const projectRoot = path.resolve(root);
  return {
    name: 'custom-library-raw-test-adapter',
    setup(build) {
      build.onLoad(
        {
          filter:
            /[/\\]hub[/\\]src[/\\]library[/\\](catalog|upstreamDocuments)\.ts$/,
        },
        async (args) => {
          let contents = await readFile(args.path, 'utf8');
          const expression =
            /import\.meta\.glob\(\s*\[([\s\S]*?)\]\s*,\s*\{\s*query:\s*['"]\?raw['"],\s*import:\s*['"]default['"]\s*,?\s*\}\s*,?\s*\)/g;
          const matches = [...contents.matchAll(expression)];
          for (const match of matches.reverse()) {
            const imports = [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map(
              (item) => item[1],
            );
            const entries = [];
            for (const name of imports) {
              const absolute = path.resolve(path.dirname(args.path), name);
              const relative = path
                .relative(projectRoot, absolute)
                .split(path.sep)
                .join('/');
              if (!approvedPaths.has(relative))
                throw new Error(
                  'Library test adapter rejected an unadmitted input.',
                );
              let resolved;
              try {
                resolved = await realpath(absolute);
              } catch (error) {
                if (error.code === 'ENOENT') continue;
                throw new Error(
                  'Library test adapter could not resolve an admitted input.',
                );
              }
              const resolvedRelative = path.relative(projectRoot, resolved);
              if (
                resolvedRelative.startsWith(`..${path.sep}`) ||
                path.isAbsolute(resolvedRelative)
              )
                throw new Error(
                  'Library test adapter rejected a path outside the repository.',
                );
              const raw = await readFile(resolved, 'utf8');
              entries.push(
                `${JSON.stringify(name)}: async () => ${JSON.stringify(raw)}`,
              );
            }
            contents =
              contents.slice(0, match.index) +
              `{${entries.join(',')}}` +
              contents.slice(match.index + match[0].length);
          }
          if (contents.includes('import.meta.glob('))
            throw new Error(
              'Library test adapter encountered an unsupported raw admission expression.',
            );
          return {
            contents,
            loader: 'ts',
            resolveDir: path.dirname(args.path),
          };
        },
      );
    },
  };
}
export default libraryRawImportTestAdapter;
