import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { selectAdmittedSections } from './upstreamDocuments';
import type { LibraryCatalog, LibraryItem } from './types';

type MarkdownNode = {
  type: string;
  value?: string;
  depth?: number;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown>; [key: string]: unknown };
};
export type MarkdownHeading = { id: string; title: string; depth: number };
export type MarkdownSection = { id: string; title: string; text: string };
const processor = unified().use(remarkParse).use(remarkGfm);

/** Only visible prose/code contributes to headings and search. Raw HTML and media are never indexed. */
export function markdownVisibleText(node: MarkdownNode): string {
  if (
    node.type === 'html' ||
    node.type === 'image' ||
    node.type === 'imageReference' ||
    node.type === 'definition'
  )
    return '';
  if (typeof node.value === 'string') return node.value;
  return (node.children || [])
    .map(markdownVisibleText)
    .filter(Boolean)
    .join(
      node.type === 'root' ||
        node.type === 'list' ||
        node.type === 'table' ||
        node.type === 'tableRow' ||
        node.type === 'listItem' ||
        node.type === 'blockquote'
        ? '\n'
        : '',
    );
}
export function headingIdBase(title: string) {
  const slug = title
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
    .replace(/-$/, '');
  return `section-${slug || 'heading'}`;
}
function headingIdentity() {
  const counts = new Map<string, number>([['section-start', 1]]);
  return (title: string) => {
    const base = headingIdBase(title);
    const count = (counts.get(base) || 0) + 1;
    counts.set(base, count);
    return count > 1 ? `${base}-${count}` : base;
  };
}
/** Walk block containers in one shared order; atomic prose/table/code blocks contribute visible text once. */
function walkMarkdownContent(
  node: MarkdownNode,
  visitHeading: (node: MarkdownNode, title: string) => void,
  visitText: (text: string) => void,
) {
  if (['html', 'image', 'imageReference', 'definition'].includes(node.type))
    return;
  if (node.type === 'heading') {
    visitHeading(node, markdownVisibleText(node).trim() || 'Untitled section');
    return;
  }
  if (
    ['paragraph', 'code', 'table'].includes(node.type) ||
    !node.children?.length
  ) {
    const text = markdownVisibleText(node).trim();
    if (text) visitText(text);
    return;
  }
  for (const child of node.children)
    walkMarkdownContent(child, visitHeading, visitText);
}
export function parseMarkdownSections(markdown: string): {
  headings: MarkdownHeading[];
  sections: MarkdownSection[];
  text: string;
} {
  const tree = processor.parse(markdown) as MarkdownNode;
  const nextId = headingIdentity();
  const headings: MarkdownHeading[] = [];
  const sections: MarkdownSection[] = [];
  let current: MarkdownSection = {
    id: 'section-start',
    title: 'Introduction',
    text: '',
  };
  const all: string[] = [];
  walkMarkdownContent(
    tree,
    (node, title) => {
      if (current.text.trim())
        sections.push({ ...current, text: current.text.trim() });
      const id = nextId(title);
      headings.push({ id, title, depth: node.depth || 2 });
      current = { id, title, text: title };
      all.push(title);
    },
    (text) => {
      current.text += `${current.text ? '\n' : ''}${text}`;
      all.push(text);
    },
  );
  if (current.text.trim())
    sections.push({ ...current, text: current.text.trim() });
  return { headings, sections, text: all.join('\n') };
}

/** Rendering and indexing assign IDs through the same traversal, including nested block/list headings. */
export function remarkLibraryHeadings() {
  return (tree: MarkdownNode) => {
    const nextId = headingIdentity();
    walkMarkdownContent(
      tree,
      (node, title) => {
        node.data = {
          ...node.data,
          hProperties: { ...node.data?.hProperties, id: nextId(title) },
        };
      },
      () => {},
    );
  };
}

/** Read only manifest-published authored files or selected admitted upstream sections. */
export function getArticleMarkdown(
  item: LibraryItem,
  catalog: LibraryCatalog,
): string | null {
  if (item.status !== 'published') return null;
  if (item.contentPath !== null)
    return catalog.originalDocuments[item.contentPath] ?? null;
  const document = catalog.manifest.upstreamDocuments.find(
    (document) => document.id === item.upstreamDocumentId && document.published,
  );
  if (
    !document ||
    !item.sectionIds.length ||
    item.sectionIds.some(
      (id) => !document.sections.some((section) => section.id === id),
    )
  )
    return null;
  const selected = {
    ...document,
    sections: document.sections.filter((section) =>
      item.sectionIds.includes(section.id),
    ),
  };
  const raw = catalog.upstreamDocuments[document.path];
  return typeof raw === 'string' ? selectAdmittedSections(selected, raw) : null;
}
