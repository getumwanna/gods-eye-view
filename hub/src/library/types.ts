export type ObservationKind =
  'Live' | 'Refreshed' | 'Simulated' | 'Estimated' | 'Static';
export type ValidationIssue = { file: string; code: string; message: string };
export type IntervalFact = {
  value: number | null;
  unit: string | null;
  notes: string;
};
export type SourceProduct = {
  id: string;
  name: string;
  description: string;
  access: {
    tier: string;
    requiredCapabilityRefs: string[];
    optionalCapabilityRefs: string[];
    notes: string;
  };
  coverage: { geography: string; gaps: string };
  publisherCadence: IntervalFact;
  applicationRefresh: IntervalFact;
  cacheTtl: IntervalFact;
  cost: { category: string; notes: string; reviewedDate: string };
  terms: {
    status: string;
    license: string | null;
    urls: string[];
    restrictions: string[];
  };
  attribution: string[];
  shipping: { state: string; notes: string };
  evidence: {
    path: string;
    section: string;
    revision: string;
    reviewedDate: string;
    url: string | null;
    status: string;
  }[];
};
export type SourceProvider = {
  id: string;
  name: string;
  homepage: string;
  docsUrl: string;
  products: SourceProduct[];
};
export type SourceBinding = {
  layerId: string;
  valueId: string;
  label: string;
  kind: ObservationKind;
  sourceProductRefs: string[];
  requiredCapabilityRefs: string[];
  optionalCapabilityRefs: string[];
  guideRefs: string[];
  requiredKeyId: string | null;
};
export type SourceGuideGroup = {
  id: string;
  name: string;
  setupKeyId: string | null;
  setupUrl: string | null;
  docsHref: string;
  explanation: string;
  sourceProductRefs: string[];
};
export type SourceRegistry = {
  version: number;
  upstreamRevision: string;
  reviewedDate: string;
  capabilities: {
    id: string;
    setupKeyId: string | null;
    environmentNames: string[];
    visibility: string;
    notes: string;
  }[];
  sources: SourceProvider[];
  bindings: SourceBinding[];
  guideGroups: SourceGuideGroup[];
};
export type AdmittedDocument = {
  id: string;
  title: string;
  path: string;
  sourceUrl: string;
  upstreamRevision: string;
  sha256: string;
  sections: {
    id: string;
    startHeading: string;
    startOccurrence: number;
    endHeading: string | null;
    endOccurrence: number | null;
    startLine: number;
    endLine: number;
    sha256: string;
  }[];
  licenseNotice: string;
  published: boolean;
};
export type LibraryManifest = {
  version: number;
  upstreamRevision: string;
  reviewedDate: string;
  upstreamDocuments: AdmittedDocument[];
  items: {
    id: string;
    contentPath: string | null;
    upstreamDocumentId: string | null;
    sectionIds: string[];
    sourceProductRefs: string[];
    references: { title: string; url: string; reviewedDate: string }[];
    [key: string]: unknown;
  }[];
};
export type LibraryCatalog = {
  registry: SourceRegistry;
  manifest: LibraryManifest;
  upstreamDocuments: Record<string, string>;
  originalDocuments: Record<string, string>;
};
export type LibrarySnapshot = {
  status: 'idle' | 'loading' | 'ready' | 'error';
  revision: number;
  data: LibraryCatalog | null;
  errors: ValidationIssue[];
};
