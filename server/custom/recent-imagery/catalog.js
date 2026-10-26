import { createHash } from 'node:crypto';

export function imageryError(code, message, status = 503) {
  return Object.assign(new Error(message), { code, status });
}

export function validateBox(value) {
  const box =
    value &&
    Object.fromEntries(
      ['west', 'south', 'east', 'north'].map((key) => [key, value[key]]),
    );
  if (
    !box ||
    Object.values(box).some(
      (v) => typeof v !== 'number' || !Number.isFinite(v),
    ) ||
    box.west < -180 ||
    box.east > 180 ||
    box.west >= box.east ||
    box.south < -80 ||
    box.north > 80 ||
    box.south >= box.north
  ) {
    throw imageryError(
      'invalid_box',
      'Select a non-polar box that does not cross the antimeridian.',
      400,
    );
  }
  return box;
}

export function imagePlan(value) {
  const box = validateBox(value);
  // Conservative latitude-range scale; fitting the camera never changes this grid.
  const closestToEquator =
    box.south <= 0 && box.north >= 0
      ? 0
      : Math.min(Math.abs(box.south), Math.abs(box.north));
  const width = Math.max(
    1,
    Math.ceil(
      ((box.east - box.west) *
        111_700 *
        Math.cos((closestToEquator * Math.PI) / 180)) /
        10,
    ),
  );
  const height = Math.max(
    1,
    Math.ceil(((box.north - box.south) * 111_700) / 10),
  );
  // A bounded fixed grid prevents arbitrarily large jobs/metadata even in chunk mode.
  if (width > 8192 || height > 8192 || width * height > 16_777_216)
    throw imageryError(
      'box_too_large',
      'Sentinel-2 box exceeds the bounded 10 m processing grid. Select a smaller box.',
      400,
    );
  const mode = width <= 2048 && height <= 2048 ? 'single' : 'chunks';
  return {
    width,
    height,
    mode,
    columns: mode === 'single' ? 1 : Math.ceil(width / 512),
    rows: mode === 'single' ? 1 : Math.ceil(height / 512),
  };
}

export function imageGeometry(boxValue, { preview = false, part } = {}) {
  const box = validateBox(boxValue);
  const plan = imagePlan(box);
  if (preview) {
    if (part)
      throw imageryError(
        'invalid_part',
        'A preview cannot request a grid part.',
        400,
      );
    const factor = Math.min(1, 128 / Math.max(plan.width, plan.height));
    return {
      box,
      width: Math.max(1, Math.ceil(plan.width * factor)),
      height: Math.max(1, Math.ceil(plan.height * factor)),
      preview: true,
    };
  }
  if (plan.mode === 'single') {
    if (part)
      throw imageryError(
        'invalid_part',
        'This box uses one bounded image.',
        400,
      );
    return { box, width: plan.width, height: plan.height, preview: false };
  }
  if (
    !part ||
    Object.keys(part).some((key) => !['column', 'row'].includes(key)) ||
    !Number.isInteger(part.column) ||
    !Number.isInteger(part.row) ||
    part.column < 0 ||
    part.row < 0 ||
    part.column >= plan.columns ||
    part.row >= plan.rows
  )
    throw imageryError(
      'invalid_part',
      'Request a valid fixed-grid column and row for this box.',
      400,
    );
  const x = part.column * 512;
  const y = part.row * 512;
  const width = Math.min(512, plan.width - x);
  const height = Math.min(512, plan.height - y);
  return {
    box: {
      west: box.west + ((box.east - box.west) * x) / plan.width,
      east: box.west + ((box.east - box.west) * (x + width)) / plan.width,
      north: box.north - ((box.north - box.south) * y) / plan.height,
      south: box.north - ((box.north - box.south) * (y + height)) / plan.height,
    },
    width,
    height,
    preview: false,
  };
}

export function catalogQuery(input, now = Date.now()) {
  if (
    !input ||
    Object.keys(input).some(
      (key) => !['box', 'startDay', 'endDay', 'maxCloud'].includes(key),
    )
  )
    throw imageryError(
      'invalid_request',
      'Only a box, day range and optional max-cloud filter are accepted.',
      400,
    );
  const box = validateBox(input.box);
  imagePlan(box);
  const today = new Date(now).toISOString().slice(0, 10);
  const oldest = new Date(Date.parse(today) - 29 * 86_400_000)
    .toISOString()
    .slice(0, 10);
  const startDay = input.startDay ?? oldest;
  const endDay = input.endDay ?? today;
  const validDay = (day) =>
    typeof day === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(day) &&
    Number.isFinite(Date.parse(day)) &&
    new Date(day).toISOString().slice(0, 10) === day;
  if (
    !validDay(startDay) ||
    !validDay(endDay) ||
    startDay < oldest ||
    endDay > today ||
    startDay > endDay
  )
    throw imageryError(
      'invalid_days',
      'Choose dates within the last 30 UTC days.',
      400,
    );
  const maxCloud = input.maxCloud === 100 ? null : (input.maxCloud ?? null);
  if (
    maxCloud !== null &&
    (typeof maxCloud !== 'number' ||
      !Number.isFinite(maxCloud) ||
      maxCloud < 0 ||
      maxCloud > 100)
  )
    throw imageryError(
      'invalid_cloud',
      'Maximum scene cloud cover must be between 0 and 100 percent.',
      400,
    );
  return { box, startDay, endDay, maxCloud };
}

export function productIdentity(value) {
  const id = String(value ?? '').replace(/\.SAFE$/, '');
  return /^S2[ABC]_MSIL2A_\d{8}T\d{6}_N\d{4}_R\d{3}_T\d{2}[A-Z]{3}_\d{8}T\d{6}$/.test(
    id,
  )
    ? id
    : null;
}

export function candidatesFromCatalog(payload, query) {
  if (
    !payload ||
    !Array.isArray(payload.features) ||
    payload.features.length > 100
  )
    throw imageryError(
      'invalid_catalog',
      'Sentinel-2 returned an invalid catalog response.',
    );
  const plan = imagePlan(query.box);
  const candidates = new Map();
  for (const feature of payload.features) {
    const identity = productIdentity(feature.id);
    const acquisitionTime = feature.properties?.datetime;
    if (
      !identity ||
      typeof acquisitionTime !== 'string' ||
      !Number.isFinite(Date.parse(acquisitionTime))
    )
      continue;
    const day = acquisitionTime.slice(0, 10);
    if (day < query.startDay || day > query.endDay) continue;
    const raw = feature.properties?.['eo:cloud_cover'];
    const cloudPercent =
      typeof raw === 'number' && raw >= 0 && raw <= 100 ? raw : null;
    if (
      query.maxCloud !== null &&
      (cloudPercent === null || cloudPercent > query.maxCloud)
    )
      continue;
    const id = `S2:${day}:${createHash('sha256').update(`${identity}|${acquisitionTime}`).digest('hex')}`;
    const credit = `Contains modified Copernicus Sentinel data ${day.slice(0, 4)}. Processed with Sentinel Hub / Copernicus Data Space Ecosystem.`;
    candidates.set(id, {
      id,
      key: id,
      product: 'S2',
      source: 'cdse',
      day,
      acquisitionTime,
      cloudPercent,
      contributors: [{ id: identity, acquisitionTime, cloudPercent }],
      imagePlan: plan,
      credit,
    });
  }
  return [...candidates.values()].sort(
    (a, b) =>
      b.acquisitionTime.localeCompare(a.acquisitionTime) ||
      a.id.localeCompare(b.id),
  );
}
