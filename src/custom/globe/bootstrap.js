/** Build boundary for the Phase 1 globe hooks, implemented in milestone 3. */
import { applyTheme, subscribeTheme } from '../shared/theme.js';
import { createKeyAccess } from '../shared/keyAccess.js';
import { applyGlobeBranding, mountBackToHub } from './branding.js';
import { mountFeedStrip } from './feedStrip.js';
import { mountKeyBadges } from './keyBadges.js';

export function installHubGlobeCustomization(application, {
  documentRef = globalThis.document,
  windowRef = globalThis.window,
} = {}) {
  const embedded = globalThis.GEV_EMBED_INLINE === true || windowRef?.GEV_EMBED_INLINE === true
    || new URLSearchParams(windowRef?.location?.search || '').get('embed') === '1'
    || windowRef?.location?.pathname?.startsWith('/panel/')
    || import.meta.env?.BASE_URL === '/panel/';
  if (!documentRef || embedded) return () => {};
  const lifetime = new AbortController();
  const disposers = [];
  let mounted = false;
  let disposed = false;
  documentRef.documentElement.dataset.gevHubCustomization = '';
  applyTheme(documentRef);
  // Locale ran in createStandaloneApplication; this precedes initLogoGaze.
  applyGlobeBranding(documentRef);
  disposers.push(subscribeTheme(() => applyTheme(documentRef)));
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    lifetime.abort();
    for (const stop of disposers.splice(0).reverse()) stop();
    delete documentRef.documentElement.dataset.gevHubCustomization;
  };
  const unsubscribe = application.subscribe(({ status }) => {
    if (['destroying', 'destroyed', 'failed'].includes(status)) { dispose(); return; }
    if (status !== 'ready' || mounted || disposed) return;
    mounted = true;
    const container = documentRef.createElement('nav');
    container.className = 'gih-globe-tools';
    // i18n-ignore: Phase 1 custom controls are intentionally English; core globe localization is preserved.
    container.setAttribute('aria-label', 'Hub and feed controls');
    const title = documentRef.getElementById('title-bar');
    if (!title) container.dataset.floating = 'true';
    (title || documentRef.body).append(container);
    disposers.push(() => container.remove());
    const closeDetails = (restoreFocus = false) => {
      const open = [...container.querySelectorAll('details[open]')];
      for (const detail of open) detail.open = false;
      if (restoreFocus) open[0]?.querySelector('summary')?.focus();
      return open.length > 0;
    };
    const outside = (event) => { if (!container.contains(event.target)) closeDetails(); };
    const escape = (event) => {
      if (event.key === 'Escape' && !event.defaultPrevented && container.contains(event.target) && closeDetails(true)) {
        event.preventDefault();
      }
    };
    const exclusive = (event) => {
      if (event.target.tagName !== 'DETAILS' || !event.target.open) return;
      for (const detail of container.querySelectorAll('details[open]')) {
        if (detail !== event.target) detail.open = false;
      }
    };
    documentRef.addEventListener('pointerdown', outside);
    documentRef.addEventListener('keydown', escape);
    container.addEventListener('toggle', exclusive, true);
    disposers.push(() => {
      documentRef.removeEventListener('pointerdown', outside);
      documentRef.removeEventListener('keydown', escape);
      container.removeEventListener('toggle', exclusive, true);
    });
    disposers.push(mountBackToHub(documentRef, container));
    const dataManager = application.getComponents().data?.dataManager;
    if (!dataManager?.getAll || !dataManager?.subscribeActivity) return;
    const keyAccess = createKeyAccess({ signal: lifetime.signal });
    disposers.push(keyAccess.destroy);
    disposers.push(mountFeedStrip({ documentRef, dataManager, container, signal: lifetime.signal }));
    disposers.push(mountKeyBadges({ documentRef, dataManager, keyAccess, container, signal: lifetime.signal }));
    void keyAccess.load();
  });
  if (disposed) unsubscribe();
  else disposers.push(unsubscribe);
  import.meta.hot?.dispose(dispose);
  return dispose;
}
