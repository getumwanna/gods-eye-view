import config from '../../../branding.json' with { type: 'json' };

const defaults = Object.freeze({
  name: 'Geospatial Intelligence Hub',
  shortName: 'GEV Hub',
  logo: '/custom/brand.svg',
  accent: '#38BDF8',
});

/** Accept public branding values only; never arbitrary CSS or remote images. */
export function validateBranding(input = {}) {
  const text = (value, fallback, limit) =>
    typeof value === 'string' && value.trim() && value.trim().length <= limit
      ? value.trim()
      : fallback;
  return Object.freeze({
    name: text(input.name, defaults.name, 80),
    shortName: text(input.shortName, defaults.shortName, 24),
    logo:
      typeof input.logo === 'string' &&
      /^\/custom\/[a-zA-Z0-9_-]+\.(svg|png|webp)$/.test(input.logo)
        ? input.logo
        : defaults.logo,
    accent:
      typeof input.accent === 'string' && /^#[0-9a-f]{6}$/i.test(input.accent)
        ? input.accent
        : defaults.accent,
  });
}

export const branding = validateBranding(config);
