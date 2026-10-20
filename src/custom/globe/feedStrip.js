import { layerFeedState } from '../../data/feedState.js';
import { snapshotAgeLabel } from '../../data/layerSnapshot.js';
import { getLayerKindValues } from '../shared/layerMetadata.js';

const HEALTH_LABELS = Object.freeze({
  nominal: 'ON', loading: 'LOADING', degraded: 'DEGRADED', stale: 'STALE',
  partial: 'PARTIAL', fallback: 'FALLBACK', unavailable: 'UNAVAILABLE', off: 'OFF',
});
const text = (value) => typeof value === 'string' ? value.trim() : '';

function epoch(value, allowIso = false) {
  const stamp = typeof value === 'number' ? value
    : allowIso && typeof value === 'string' ? Date.parse(value) : NaN;
  return Number.isFinite(stamp) && stamp > 0 && !Number.isNaN(new Date(stamp).getTime())
    ? stamp : null;
}

/** Pure projection of existing state; count defaults never become displayed data. */
export function presentLayer(row, { now = Date.now() } = {}) {
  const stats = row?.stats && typeof row.stats === 'object' ? row.stats : {};
  const transition = ['enabling', 'disabling'].includes(row?.lifecycleState)
    ? row.lifecycleState.toUpperCase() : null;
  const active = row?.enabled === true || transition !== null || row?.lifecycleUncertain === true;
  const source = text(stats.source) || text(row?.source) || 'Not reported here';
  // Preserve explicit fallback:false, partial and normalized manager error fields.
  const health = active ? layerFeedState({ ...stats, source }) : 'off';
  const healthLabel = HEALTH_LABELS[health] || 'UNKNOWN';
  const stateLabel = [row?.lifecycleUncertain ? 'UNCERTAIN' : transition, healthLabel]
    .filter(Boolean).join(' · ');
  const lastUpdate = epoch(stats.lastUpdate);
  const observedAt = epoch(stats.observedAt, true);
  const advisoryAt = epoch(stats.advisoryAt, true);
  const observation = observedAt ?? advisoryAt;
  return Object.freeze({
    id: text(row?.id),
    name: text(row?.name) || text(row?.id) || 'Unnamed layer',
    active,
    health,
    stateLabel,
    source,
    coverage: text(stats.coverageLabel) || text(stats.coverage) || 'Coverage not reported here',
    kinds: getLayerKindValues(row),
    lastUpdate,
    updateLabel: lastUpdate === null ? 'Update time unavailable'
      : `Last updated ${snapshotAgeLabel(lastUpdate, now)}`,
    observation,
    observationLabel: observation === null ? null
      : `${advisoryAt !== null && observedAt === null ? 'Advisory issued' : 'Observed/captured'} ${new Date(observation).toISOString()}`,
    detail: text(stats.statusMessage),
  });
}

const setText = (node, value) => {
  if (node.textContent !== value) node.textContent = value;
};

/** Passive active-layer presentation with its own bounded UI clock and cleanup. */
export function mountFeedStrip({ documentRef, dataManager, container, signal }) {
  const windowRef = documentRef.defaultView || globalThis;
  const root = documentRef.createElement('details');
  root.className = 'gih-feed-strip';
  root.name = 'gih-globe-details';
  root.open = (windowRef.innerWidth || 1024) >= 900;
  const summary = documentRef.createElement('summary');
  summary.className = 'gih-tool-summary';
  const panel = documentRef.createElement('div');
  panel.className = 'gih-custom-popup';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Active layer status');
  const panelHeading = documentRef.createElement('div');
  panelHeading.className = 'gih-popup-heading';
  const panelTitle = documentRef.createElement('strong');
  panelTitle.textContent = 'Active layer status';
  const closeButton = documentRef.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'gih-popup-close';
  closeButton.textContent = 'Close';
  closeButton.setAttribute('aria-label', 'Close active layer status');
  const close = () => { root.open = false; summary.focus(); };
  closeButton.addEventListener('click', close);
  panelHeading.append(panelTitle, closeButton);
  const list = documentRef.createElement('div');
  const empty = documentRef.createElement('p');
  empty.className = 'gih-status-note';
  empty.textContent = 'No active layers. Use the existing layer controls to choose a feed.';
  panel.append(panelHeading, list, empty);
  root.append(summary, panel);
  container.append(root);
  const items = new Map();
  let rows = [];
  let disposed = false;
  let unavailable = false;
  let clock = null;
  const createItem = () => {
    const article = documentRef.createElement('article');
    article.className = 'gih-feed-item';
    const heading = documentRef.createElement('div');
    heading.className = 'gih-feed-heading';
    const name = documentRef.createElement('strong');
    const health = documentRef.createElement('span');
    health.className = 'gih-feed-health';
    heading.append(name, health);
    const kinds = documentRef.createElement('div');
    kinds.className = 'gih-kind-list';
    const source = documentRef.createElement('p');
    const coverage = documentRef.createElement('p');
    const updated = documentRef.createElement('time');
    updated.className = 'gih-feed-time';
    const observed = documentRef.createElement('p');
    observed.className = 'gih-feed-time';
    const detail = documentRef.createElement('p');
    article.append(heading, kinds, source, coverage, updated, observed, detail);
    return { article, name, health, kinds, source, coverage, updated, observed, detail };
  };
  const paint = () => {
    if (disposed) return;
    const models = rows.map((row) => presentLayer(row)).filter((row) => row.active);
    const ids = new Set(models.map((row) => row.id));
    for (const [id, item] of items) {
      if (!ids.has(id)) { item.article.remove(); items.delete(id); }
    }
    const states = [...new Set(models.map((row) => row.stateLabel))];
    setText(summary, unavailable ? 'Feeds · Status unavailable'
      : states.length ? `Feeds · ${states.join(' / ')}` : 'Feeds · No active layers');
    summary.title = summary.textContent;
    empty.hidden = models.length > 0;
    setText(empty, unavailable ? 'Layer status is unavailable. The original globe controls remain available.'
      : 'No active layers. Use the existing layer controls to choose a feed.');
    models.forEach((model, index) => {
      let item = items.get(model.id);
      if (!item) { item = createItem(); items.set(model.id, item); }
      item.article.dataset.layerId = model.id;
      item.health.dataset.health = model.health;
      setText(item.name, model.name);
      setText(item.health, model.stateLabel);
      const signature = JSON.stringify(model.kinds);
      if (item.kindSignature !== signature) {
        item.kindSignature = signature;
        item.kinds.replaceChildren(...model.kinds.map((value) => {
          const chip = documentRef.createElement('span');
          chip.className = 'gih-kind';
          chip.dataset.kind = value.kind.toLowerCase();
          chip.textContent = `${value.label}: ${value.kind}`;
          return chip;
        }));
        if (!model.kinds.length) setText(item.kinds, 'Value kind not classified');
      }
      setText(item.source, `Source: ${model.source}`);
      setText(item.coverage, model.coverage === 'Coverage not reported here'
        ? model.coverage : `Coverage: ${model.coverage}`);
      setText(item.updated, model.updateLabel);
      if (model.lastUpdate !== null) item.updated.dateTime = new Date(model.lastUpdate).toISOString();
      else item.updated.removeAttribute('datetime');
      setText(item.observed, model.observationLabel || '');
      item.observed.hidden = model.observationLabel === null;
      setText(item.detail, model.detail);
      item.detail.hidden = !model.detail;
      if (list.children[index] !== item.article) list.insertBefore(item.article, list.children[index] || null);
    });
  };
  const read = () => {
    if (disposed) return;
    try { rows = dataManager.getAll(); unavailable = !Array.isArray(rows); }
    catch { rows = []; unavailable = true; }
    if (unavailable) rows = [];
    paint();
  };
  let unsubscribe = () => {};
  const destroy = () => {
    if (disposed) return;
    disposed = true;
    unsubscribe();
    if (clock !== null) windowRef.clearInterval(clock);
    signal?.removeEventListener('abort', destroy);
    closeButton.removeEventListener('click', close);
    items.clear();
    root.remove();
  };
  unsubscribe = dataManager.subscribeActivity((change) => {
    if (change.type === 'destroy-all') destroy();
    else read();
  });
  // This clock only ages the already-read rows. It never refreshes any source.
  clock = windowRef.setInterval(paint, 10_000);
  if (signal?.aborted) destroy();
  else { signal?.addEventListener('abort', destroy, { once: true }); read(); }
  return destroy;
}
