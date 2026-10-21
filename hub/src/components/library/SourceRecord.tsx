import React from 'react';
import { safeExternalUrl, pinnedRepositoryUrl } from '../../library/links';
import type {
  IntervalFact,
  SourceBinding,
  SourceProduct,
  SourceProvider,
} from '../../library/types';

export function ReferenceLink({
  href,
  children,
}: {
  href: string | null;
  children: React.ReactNode;
}) {
  const safe = safeExternalUrl(href);
  return safe ? (
    <a href={safe} target="_blank" rel="noreferrer noopener">
      {children}
      <span className="gih-sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <span>{children}</span>
  );
}
function Interval({ value, unit, notes }: IntervalFact) {
  return (
    <>
      {value === null || unit === null ? 'Not specified' : `${value} ${unit}`}
      <span className="gih-fact-notes">{notes}</span>
    </>
  );
}

export function SourceRecord({
  source,
  product,
  bindings,
}: {
  source: SourceProvider;
  product: SourceProduct;
  bindings: SourceBinding[];
}) {
  const reference = `${source.id}/${product.id}`;
  const associated = bindings.filter((binding) =>
    binding.sourceProductRefs.includes(reference),
  );
  return (
    <article
      className="gih-card gih-source-record"
      id={`source-${source.id}-${product.id}`}
    >
      <div className="gih-source-record-top">
        <p className="gih-eyebrow">{source.name}</p>
        <span className="gih-reference-badge">Static reference</span>
      </div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <dl className="gih-source-facts">
        <div>
          <dt>Coverage</dt>
          <dd>
            {product.coverage.geography}
            <span className="gih-fact-notes">{product.coverage.gaps}</span>
          </dd>
        </div>
        <div>
          <dt>Access</dt>
          <dd>
            {product.access.tier.replaceAll('-', ' ')}
            <span className="gih-fact-notes">{product.access.notes}</span>
          </dd>
        </div>
        <div>
          <dt>Shipping availability</dt>
          <dd>
            {product.shipping.state.replaceAll('-', ' ')}
            <span className="gih-fact-notes">{product.shipping.notes}</span>
          </dd>
        </div>
        <div>
          <dt>Observation kind</dt>
          <dd>
            {associated.length ? (
              <ul className="gih-observation-list">
                {associated.map((binding) => (
                  <li key={`${binding.layerId}/${binding.valueId}`}>
                    <span
                      className={`gih-kind gih-kind-${binding.kind.toLowerCase()}`}
                    >
                      {binding.kind}
                    </span>
                    <span>
                      {binding.label}{' '}
                      <span className="gih-fact-notes">
                        {binding.layerId} / {binding.valueId}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              'No displayed layer value is bound to this product.'
            )}
          </dd>
        </div>
        <div>
          <dt>Publisher cadence</dt>
          <dd>
            <Interval {...product.publisherCadence} />
          </dd>
        </div>
        <div>
          <dt>Application refresh</dt>
          <dd>
            <Interval {...product.applicationRefresh} />
          </dd>
        </div>
        <div>
          <dt>Application cache TTL</dt>
          <dd>
            <Interval {...product.cacheTtl} />
          </dd>
        </div>
        <div>
          <dt>Cost</dt>
          <dd>
            {product.cost.category}
            <span className="gih-fact-notes">
              {product.cost.notes} Cost documentation reviewed{' '}
              {product.cost.reviewedDate}.
            </span>
          </dd>
        </div>
        <div>
          <dt>Terms and license</dt>
          <dd>
            {product.terms.license ||
              'License not established in this directory.'}
            <span className="gih-fact-notes">
              Evidence status: {product.terms.status.replaceAll('-', ' ')}.
            </span>
            {product.terms.restrictions.map((restriction, i) => (
              <p key={i}>{restriction}</p>
            ))}
            {product.terms.urls.length > 0 && (
              <ul className="gih-reference-links">
                {product.terms.urls.map((url, i) => (
                  <li key={url}>
                    <ReferenceLink href={url}>
                      Terms reference {i + 1}
                    </ReferenceLink>
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </div>
        <div>
          <dt>Required attribution</dt>
          <dd>
            {product.attribution.length
              ? product.attribution.map((attribution, i) => (
                  <p key={i}>{attribution}</p>
                ))
              : 'No additional attribution recorded; check the provider terms.'}
          </dd>
        </div>
        <div>
          <dt>Feed health</dt>
          <dd>
            <strong>Not checked in Library.</strong>
            <span className="gih-fact-notes">
              Documentation review dates are not observation timestamps or feed
              freshness.
            </span>
          </dd>
        </div>
      </dl>
      <details className="gih-source-evidence">
        <summary>Documentation evidence ({product.evidence.length})</summary>
        <ul>
          {product.evidence.map((evidence, i) => (
            <li key={`${evidence.path}-${i}`}>
              <ReferenceLink
                href={evidence.url || pinnedRepositoryUrl(evidence.path)}
              >
                {evidence.path} · {evidence.section}
              </ReferenceLink>
              <span className="gih-fact-notes">
                Reviewed {evidence.reviewedDate} ·{' '}
                {evidence.status.replaceAll('-', ' ')} · revision{' '}
                {evidence.revision.slice(0, 8)}
              </span>
            </li>
          ))}
        </ul>
      </details>
      <div className="gih-reference-links">
        <ReferenceLink href={source.homepage}>Provider website</ReferenceLink>
        <ReferenceLink href={source.docsUrl}>
          Source documentation
        </ReferenceLink>
      </div>
    </article>
  );
}
