import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  getArticleMarkdown,
  headingIdBase,
  parseMarkdownSections,
  remarkLibraryHeadings,
} from '../../library/markdown';
import {
  knowledgeHref,
  pinnedRepositoryUrl,
  resolveRepositoryReference,
  safeExternalUrl,
  safeLibraryHref,
} from '../../library/links';
import type { LibraryCatalog, LibraryItem } from '../../library/types';

const mediaAsset =
  /\.(?:avif|gif|jpe?g|png|svg|webp|ico|mp[34]|webm|mov|m3u8|ogg|wav|pdf|zip)(?:[?#]|$)/i;
function matchingSection(
  fragment: string,
  item: LibraryItem,
  catalog: LibraryCatalog,
) {
  const content = getArticleMarkdown(item, catalog);
  if (content === null) return null;
  const headings = parseMarkdownSections(content).headings;
  if (fragment === 'section-start') return fragment;
  return (
    headings.find(
      (heading) =>
        heading.id === fragment || heading.id === headingIdBase(fragment),
    )?.id || null
  );
}

/** Markdown links never become filesystem reads or media requests. Relative repository references are pinned. */
export function resolveArticleHref(
  href: string | undefined,
  item: LibraryItem,
  catalog: LibraryCatalog,
): string | null {
  if (!href || mediaAsset.test(href)) return null;
  if (href.startsWith('#/library')) return safeLibraryHref(href);
  if (href.startsWith('#')) {
    const section = matchingSection(href.slice(1), item, catalog);
    return section ? knowledgeHref(item.slug, section) : null;
  }
  const external = safeExternalUrl(href);
  if (external) return external;
  const document = catalog.manifest.upstreamDocuments.find(
    (document) => document.id === item.upstreamDocumentId,
  );
  const relative = resolveRepositoryReference(
    href,
    document?.path || item.contentPath || 'README.md',
  );
  if (!relative || mediaAsset.test(relative.path)) return null;
  const admitted = catalog.manifest.upstreamDocuments.find(
    (document) => document.path === relative.path && document.published,
  );
  const destination =
    admitted &&
    catalog.manifest.items.find(
      (candidate) =>
        candidate.upstreamDocumentId === admitted.id &&
        candidate.status === 'published' &&
        candidate.kind === 'upstream-documentation',
    );
  if (destination) {
    if (!relative.fragment) return knowledgeHref(destination.slug);
    const section = matchingSection(relative.fragment, destination, catalog);
    if (section) return knowledgeHref(destination.slug, section);
  }
  const canonical = pinnedRepositoryUrl(relative.path);
  return canonical
    ? `${canonical}${relative.fragment ? `#${relative.fragment}` : ''}`
    : null;
}

export function ArticleRenderer({
  item,
  catalog,
  markdown,
}: {
  item: LibraryItem;
  catalog: LibraryCatalog;
  markdown?: string;
}) {
  const body = markdown ?? getArticleMarkdown(item, catalog);
  const components = useMemo(() => {
    const heading =
      (tag: 'h2' | 'h3' | 'h4' | 'h5' | 'h6') =>
      ({
        node: _node,
        children,
        ...props
      }: React.HTMLAttributes<HTMLHeadingElement> & { node?: unknown }) =>
        React.createElement(tag, { ...props, tabIndex: -1 }, children);
    return {
      h1: heading('h2'),
      h2: heading('h2'),
      h3: heading('h3'),
      h4: heading('h4'),
      h5: heading('h5'),
      h6: heading('h6'),
      a: ({
        href,
        children,
        title,
      }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
        const safe = resolveArticleHref(href, item, catalog);
        return safe ? (
          <a
            href={safe}
            title={title}
            {...(safe.startsWith('#/')
              ? {}
              : { target: '_blank', rel: 'noreferrer noopener' })}
          >
            {children}
            {!safe.startsWith('#/') && (
              <span className="gih-sr-only"> (opens in a new tab)</span>
            )}
          </a>
        ) : (
          <span>{children}</span>
        );
      },
      img: ({ alt }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <span className="gih-omitted-media">
          [Image omitted{alt ? `: ${alt}` : ''}]
        </span>
      ),
      table: ({
        node: _node,
        children,
        ...props
      }: React.TableHTMLAttributes<HTMLTableElement> & { node?: unknown }) => (
        <div
          className="gih-article-table"
          role="region"
          aria-label={`Table in ${item.title}`}
          tabIndex={0}
        >
          <table {...props}>
            <caption className="gih-sr-only">
              Reference table in {item.title}
            </caption>
            {children}
          </table>
        </div>
      ),
      th: ({
        node: _node,
        children,
        ...props
      }: React.ThHTMLAttributes<HTMLTableCellElement> & { node?: unknown }) => (
        <th {...props} scope="col">
          {children}
        </th>
      ),
    };
  }, [item, catalog]);
  if (body === null)
    return <p role="alert">This article's reviewed content is unavailable.</p>;
  return (
    <div className="gih-article-body" id="section-start" tabIndex={-1}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkLibraryHeadings]}
        skipHtml
        urlTransform={(url) => url}
        components={components}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
