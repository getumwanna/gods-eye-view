import { branding } from '../shared/branding.js';

/** Bind public branding before the upstream async gaze renderer is initialized. */
export function applyGlobeBranding(documentRef) {
  documentRef.title = branding.name;
  documentRef.documentElement.style.setProperty('--gih-accent', branding.accent);
  const title = documentRef.querySelector('#title-bar h1');
  if (title) {
    let name = title.querySelector('[translate="no"]');
    if (!name) { name = documentRef.createElement('span'); title.append(name); }
    name.classList.add('gih-brand-name');
    name.setAttribute('translate', 'no');
    name.removeAttribute('data-i18n');
    name.textContent = branding.name;
    title.title = branding.name;
  }
  const subtitle = documentRef.querySelector('#title-bar p');
  if (subtitle) {
    subtitle.removeAttribute('data-i18n');
    // i18n-ignore: The Phase 1 custom workspace subtitle is intentionally English, outside the core globe catalog.
    subtitle.textContent = 'Local personal workspace';
  }
  for (const wrapper of documentRef.querySelectorAll('[data-logo-gaze], #title-bar .brand-logo, #loading-screen .brand-logo')) {
    wrapper.removeAttribute('data-logo-gaze');
    wrapper.removeAttribute('data-logo-src');
    const img = documentRef.createElement('img');
    img.src = branding.logo;
    img.alt = '';
    wrapper.replaceChildren(img);
  }
  const loadingTitle = documentRef.querySelector('#loading-screen h2');
  if (loadingTitle) {
    loadingTitle.removeAttribute('data-i18n');
    loadingTitle.setAttribute('translate', 'no');
    loadingTitle.textContent = branding.shortName;
  }
  const mime = branding.logo.endsWith('.svg') ? 'image/svg+xml' : branding.logo.endsWith('.png') ? 'image/png' : 'image/webp';
  for (const icon of documentRef.querySelectorAll('link[rel~="icon"]')) {
    icon.setAttribute('href', branding.logo);
    icon.setAttribute('type', mime);
    icon.removeAttribute('sizes');
  }
}

/** Mount a fixed same-origin link without intercepting upstream globe controls. */
export function mountBackToHub(documentRef, container = documentRef.body) {
  const link = documentRef.createElement('a');
  link.className = 'gih-back-link';
  link.href = '/hub/#/dashboard';
  // i18n-ignore: Phase 1 custom navigation is intentionally English; Hub is this workspace's product destination.
  link.textContent = '← Hub';
  // i18n-ignore: Phase 1 custom navigation accessibility text is intentionally English; core globe localization is preserved.
  link.setAttribute('aria-label', 'Back to Geospatial Intelligence Hub');
  container.append(link);
  return () => link.remove();
}
