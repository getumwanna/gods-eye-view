import {
  getLayerMetadata,
  getSourceGuide,
  sourceGuideHref,
} from '../shared/layerMetadata.js';

const text = (value) => (typeof value === 'string' ? value.trim() : '');

/** Required-key guidance is separate from both configuration presence and health. */
export function getKeyGuidanceModels(rows, presence) {
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((row) => {
    if (!row || typeof row.id !== 'string') return [];
    const metadata = getLayerMetadata(row.id);
    const stats = row.stats || {};
    const active =
      row.enabled === true ||
      ['enabling', 'disabling'].includes(row.lifecycleState) ||
      row.lifecycleUncertain === true;
    const reportedRequirement = active && stats.keyRequired === true;
    const requiredId = metadata?.requiredKeyId || null;
    const keyId =
      requiredId || (reportedRequirement ? text(row.requiresKeyId) : null);
    if (!requiredId && !reportedRequirement) return [];
    const guide = getSourceGuide(keyId);
    const configured =
      presence?.state === 'ready' &&
      guide &&
      typeof presence?.keys?.[guide.id] === 'boolean'
        ? presence.keys[guide.id]
        : null;
    if (configured === true && !reportedRequirement) return [];
    const state =
      configured === false
        ? 'missing'
        : reportedRequirement
          ? 'attention'
          : 'unknown';
    const explanation =
      state === 'missing'
        ? `${guide?.name || 'Provider'} configuration is missing.`
        : state === 'attention'
          ? 'The selected provider reports that credential setup needs attention.'
          : 'Key configuration is unknown. It has not been confirmed missing.';
    const sourceIds = guide ? [guide.id] : metadata?.sources || [];
    return [
      Object.freeze({
        id: `${row.id}:${guide?.id || 'provider'}`,
        layerId: row.id,
        name: text(row.name) || row.id,
        state,
        explanation,
        alternatives:
          row.id === 'street-level'
            ? 'See Street Level controls for available provider alternatives.'
            : null,
        sources: Object.freeze(
          sourceIds.flatMap((id) => {
            const source = getSourceGuide(id);
            return source
              ? [
                  Object.freeze({
                    name: source.name,
                    href: sourceGuideHref(id),
                  }),
                ]
              : [];
          }),
        ),
      }),
    ];
  });
}

/** Observe only the existing setup surface, never the upstream layer panel. */
function watchPowerUp(documentRef, signal, onChange) {
  const windowRef = documentRef.defaultView || globalThis;
  let disposed = false;
  let observer;
  let timer;
  let state = 'initializing';
  const clean = () => {
    observer?.disconnect();
    if (timer !== undefined) windowRef.clearTimeout(timer);
  };
  const publish = (next) => {
    if (disposed || next === state) return;
    state = next;
    onChange(state);
  };
  const inspect = () => {
    if (disposed) return;
    const chip = documentRef.getElementById('key-setup-chip');
    const root = documentRef.getElementById('key-setup');
    if (!chip || !root) {
      publish('unavailable');
      clean();
      return;
    }
    if (root.querySelector('[data-key-id]')) {
      publish('ready');
      clean();
    }
  };
  const destroy = () => {
    if (disposed) return;
    disposed = true;
    clean();
    signal?.removeEventListener('abort', destroy);
  };
  const root = documentRef.getElementById('key-setup');
  if (root && windowRef.MutationObserver) {
    observer = new windowRef.MutationObserver(inspect);
    observer.observe(root, { childList: true, subtree: true });
    if (root.parentNode) observer.observe(root.parentNode, { childList: true });
  }
  timer = windowRef.setTimeout(() => {
    publish('unavailable');
    clean();
  }, 8_000);
  if (signal?.aborted) destroy();
  else {
    signal?.addEventListener('abort', destroy, { once: true });
    inspect();
  }
  return {
    getState: () => state,
    open() {
      if (disposed || state !== 'ready') return false;
      const chip = documentRef.getElementById('key-setup-chip');
      if (!chip) return false;
      chip.click();
      return true;
    },
    destroy,
  };
}

/** Own the additive setup area; GEV remains the only credential-editing surface. */
export function mountKeyBadges({
  documentRef,
  dataManager,
  keyAccess,
  container,
  signal,
}) {
  const root = documentRef.createElement('details');
  root.className = 'gih-key-badges';
  root.name = 'gih-globe-details';
  const summary = documentRef.createElement('summary');
  summary.className = 'gih-tool-summary';
  // i18n-ignore: Phase 1 custom setup navigation is intentionally English; core globe localization is preserved.
  summary.textContent = 'Provider setup';
  const panel = documentRef.createElement('div');
  panel.className = 'gih-custom-popup';
  panel.setAttribute('role', 'region');
  // i18n-ignore: Phase 1 custom setup-region accessibility text is intentionally English.
  panel.setAttribute('aria-label', 'Provider setup guidance');
  const panelHeading = documentRef.createElement('div');
  panelHeading.className = 'gih-popup-heading';
  const panelTitle = documentRef.createElement('strong');
  // i18n-ignore: Phase 1 custom setup headings are intentionally English; core globe localization is preserved.
  panelTitle.textContent = 'Provider setup';
  const closeButton = documentRef.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'gih-popup-close';
  // i18n-ignore: Phase 1 custom dismissal controls are intentionally English.
  closeButton.textContent = 'Close';
  // i18n-ignore: Phase 1 custom dismissal accessibility text is intentionally English.
  closeButton.setAttribute('aria-label', 'Close provider setup guidance');
  const close = () => {
    root.open = false;
    summary.focus();
  };
  closeButton.addEventListener('click', close);
  panelHeading.append(panelTitle, closeButton);
  const note = documentRef.createElement('p');
  note.className = 'gih-status-note';
  const surface = documentRef.createElement('p');
  surface.className = 'gih-status-note';
  const list = documentRef.createElement('div');
  const allGuides = documentRef.createElement('a');
  allGuides.href = '/hub/#/library';
  // i18n-ignore: Phase 1 custom setup-directory navigation is intentionally English.
  allGuides.textContent = 'Provider setup guides';
  panel.append(panelHeading, note, surface, list, allGuides);
  root.append(summary, panel);
  container.append(root);
  let disposed = false;
  let rows = [];
  let layerStateUnavailable = false;
  let presence = keyAccess.getSnapshot();
  const items = new Map();
  let powerUp;
  const stateText = {
    missing: 'Needs key',
    attention: 'Needs attention',
    unknown: 'Unknown',
  };
  const render = () => {
    if (disposed) return;
    const models = getKeyGuidanceModels(rows, presence);
    const summaryText = models.some((model) => model.state === 'attention')
      ? 'Setup · Attention'
      : models.some((model) => model.state === 'missing')
        ? 'Setup · Needs key'
        : models.length
          ? 'Setup · Unknown'
          : 'Provider setup';
    // i18n-ignore: Phase 1 custom setup-presence wording is intentionally English, separate from localized core health.
    summary.textContent = summaryText;
    summary.title = summary.textContent;
    const noteText =
      presence.state === 'ready'
        ? 'Configured means a credential is present, not that it is valid or the provider is healthy.'
        : ['idle', 'loading'].includes(presence.state)
          ? 'Checking local configuration presence. No provider request is made.'
          : 'Configuration status is unavailable here. Required keys remain Unknown.';
    // i18n-ignore: Phase 1 custom configuration-presence explanations are intentionally English.
    note.textContent = noteText;
    const powerState = powerUp?.getState() || 'initializing';
    const surfaceText =
      powerState === 'ready'
        ? 'POWER UP opens the original local provider settings.'
        : powerState === 'initializing'
          ? 'Provider settings are initializing.'
          : 'POWER UP is unavailable on this server. Use the provider setup documentation.';
    // i18n-ignore: Phase 1 custom English explanation names the existing POWER UP control without changing its localization.
    surface.textContent = surfaceText;
    const ids = new Set(models.map((model) => model.id));
    for (const [id, item] of items) {
      if (!ids.has(id)) {
        item.button.removeEventListener('click', item.open);
        item.article.remove();
        items.delete(id);
      }
    }
    models.forEach((model, index) => {
      let item = items.get(model.id);
      if (!item) {
        const article = documentRef.createElement('article');
        article.className = 'gih-key-item';
        const heading = documentRef.createElement('strong');
        const status = documentRef.createElement('span');
        status.className = 'gih-key-state';
        const explanation = documentRef.createElement('p');
        const alternatives = documentRef.createElement('p');
        const links = documentRef.createElement('div');
        links.className = 'gih-source-links';
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'gih-power-button';
        // i18n-ignore: POWER UP is the existing upstream provider-settings control name, retained in the English custom UI.
        button.textContent = 'POWER UP';
        const open = () => powerUp?.open();
        button.addEventListener('click', open);
        article.append(
          heading,
          status,
          explanation,
          alternatives,
          links,
          button,
        );
        item = {
          article,
          heading,
          status,
          explanation,
          alternatives,
          links,
          button,
          open,
        };
        items.set(model.id, item);
      }
      item.article.dataset.layerId = model.layerId;
      item.heading.textContent = model.name;
      item.status.textContent = stateText[model.state];
      item.status.dataset.state = model.state;
      item.explanation.textContent = model.explanation;
      item.alternatives.textContent = model.alternatives || '';
      item.alternatives.hidden = !model.alternatives;
      const signature = JSON.stringify(model.sources);
      if (signature !== item.linkSignature) {
        item.linkSignature = signature;
        item.links.replaceChildren(
          ...model.sources.map((source) => {
            const link = documentRef.createElement('a');
            link.href = source.href;
            // i18n-ignore: Source product names and Phase 1 custom setup-guide navigation remain English.
            link.textContent = `${source.name} setup guide`;
            return link;
          }),
        );
      }
      item.button.disabled = powerState !== 'ready';
      // i18n-ignore: Phase 1 custom provider-settings tooltip text is intentionally English.
      item.button.title =
        powerState === 'ready'
          ? 'Open existing GEV provider settings'
          : powerState === 'initializing'
            ? 'Provider settings are initializing'
            : 'Provider settings unavailable';
      if (list.children[index] !== item.article)
        list.insertBefore(item.article, list.children[index] || null);
    });
    const oldEmpty = panel.querySelector('.gih-keys-empty');
    const emptyText = layerStateUnavailable
      ? 'Layer state is unavailable, so setup requirements cannot be evaluated.'
      : 'No required-key setup issue is currently reported. Optional providers are described in the setup guides.';
    if (models.length) oldEmpty?.remove();
    else if (!oldEmpty) {
      const empty = documentRef.createElement('p');
      empty.className = 'gih-keys-empty';
      // i18n-ignore: Phase 1 custom setup empty-state explanations are intentionally English.
      empty.textContent = emptyText;
      panel.insertBefore(empty, allGuides);
    } else if (oldEmpty) {
      // i18n-ignore: Phase 1 custom setup empty-state explanations are intentionally English.
      oldEmpty.textContent = emptyText;
    }
  };
  const read = () => {
    if (disposed) return;
    try {
      rows = dataManager.getAll();
      layerStateUnavailable = !Array.isArray(rows);
    } catch {
      rows = [];
      layerStateUnavailable = true;
    }
    render();
  };
  let unsubscribeActivity = () => {};
  let unsubscribeKeys = () => {};
  const destroy = () => {
    if (disposed) return;
    disposed = true;
    unsubscribeActivity();
    unsubscribeKeys();
    powerUp?.destroy();
    signal?.removeEventListener('abort', destroy);
    closeButton.removeEventListener('click', close);
    for (const item of items.values())
      item.button.removeEventListener('click', item.open);
    items.clear();
    root.remove();
  };
  powerUp = watchPowerUp(documentRef, signal, render);
  unsubscribeActivity = dataManager.subscribeActivity((change) => {
    if (change.type === 'destroy-all') destroy();
    else read();
  });
  unsubscribeKeys = keyAccess.subscribe((next) => {
    presence = next;
    render();
  });
  if (signal?.aborted) destroy();
  else {
    signal?.addEventListener('abort', destroy, { once: true });
    read();
  }
  return destroy;
}
