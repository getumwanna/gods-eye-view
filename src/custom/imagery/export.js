/** Full-resolution, locally credited exports. No transport or Process request. */
let exportJobs = 0;
let exportTurn = Promise.resolve();
const exportLeases = new WeakMap();

/** The download caller releases only after revoking its output object URL. */
export function releaseCreditedImageryExport(blob) {
  exportLeases.get(blob)?.release();
  exportLeases.delete(blob);
}

/** Conservative logical working allocation; this is not a GPU heap reading. */
export function imageryExportWorkingBytes(snapshot) {
  const outputWidth = Math.max(768, snapshot.width);
  const outputHeight = snapshot.height + 72;
  const largestPartPixels = Math.max(
    ...(snapshot.parts || [snapshot]).map((part) => part.width * part.height),
  );
  // Canvas RGBA + worst-case PNG RGBA, one serial decode, row/encoder scratch.
  return (
    outputWidth * outputHeight * 8 +
    largestPartPixels * 4 +
    outputWidth * 64 +
    65536
  );
}
export function copernicusAttribution(candidate) {
  const metadata = candidate?.metadata || candidate;
  const contributors =
    metadata?.contributors || metadata?.candidate?.contributors || [];
  const dates = contributors
    .map((item) => item.acquisitionTime)
    .filter(Boolean);
  if (!dates.length)
    dates.push(
      metadata?.acquisitionTime ||
        metadata?.sensingTime ||
        metadata?.day ||
        metadata?.candidate?.day,
    );
  const years = [
    ...new Set(
      dates
        .filter((value) => /^\d{4}-\d\d-\d\d/.test(value || ''))
        .map((value) => value.slice(0, 4)),
    ),
  ].sort();
  if (!years.length)
    throw new Error('Verified Sentinel-2 capture year is required for export');
  return [
    `Contains modified Copernicus Sentinel data ${years.join(', ')}`,
    `Sentinel-2 L2A · native 10 m · ${dates.filter(Boolean).join(', ')}`,
    'Processed via Copernicus Data Space Ecosystem / Sentinel Hub',
  ];
}

function canvasBlob(canvas) {
  if (canvas.convertToBlob) return canvas.convertToBlob({ type: 'image/png' });
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))),
      'image/png',
    ),
  );
}

function waitForExportTurn(previous, signal) {
  if (!signal) return previous;
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const abort = () =>
      reject(
        signal.reason || new DOMException('Export cancelled', 'AbortError'),
      );
    signal.addEventListener('abort', abort, { once: true });
    previous
      .then(resolve, reject)
      .finally(() => signal.removeEventListener('abort', abort));
  });
}

/** Adds a footer, preserving every full-resolution image pixel above it. */
export async function createCreditedImageryExport({
  snapshot,
  candidate = snapshot?.metadata?.candidate || snapshot?.metadata,
  canvasFactory = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },
  decodeImage = (blob) => createImageBitmap(blob),
  signal,
} = {}) {
  signal?.throwIfAborted();
  if (exportJobs >= 2)
    throw new Error(
      'An imagery export is already queued; wait for it to finish',
    );
  const held = snapshot?.retain ? snapshot.retain() : snapshot;
  if (
    !held ||
    !Number.isInteger(held.width) ||
    !Number.isInteger(held.height) ||
    held.width < 1 ||
    held.height < 1
  ) {
    if (held !== snapshot || snapshot?.retain) held?.release?.();
    throw new Error('A loaded native-resolution image is required');
  }
  exportJobs++;
  const previous = exportTurn;
  let finish;
  exportTurn = new Promise((resolve) => {
    finish = resolve;
  });
  const bitmaps = [];
  let workingLease = null;
  let canvas = null;
  let started = false;
  try {
    // Serialize heavy raster work; only one pending export may retain a handle.
    await waitForExportTurn(previous, signal);
    started = true;
    signal?.throwIfAborted();
    if (
      held.metadata?.product !== 'S2' ||
      held.metadata?.source !== 'cdse' ||
      held.metadata?.preview
    )
      throw new Error(
        'Only a verified Sentinel-2 snapshot can use this export',
      );
    const lines = copernicusAttribution({ ...candidate, ...held.metadata });
    if (typeof held.reserveWorkingBytes !== 'function')
      throw Object.assign(
        new Error('Loaded imagery has no shared export memory budget'),
        { code: 'memory_limit' },
      );
    workingLease = held.reserveWorkingBytes(imageryExportWorkingBytes(held));
    // Annotation padding keeps credits readable for very small selected boxes;
    // source pixels are copied once at 1:1 and never stretched to this width.
    const outputWidth = Math.max(768, held.width);
    const footerHeight = 72;
    canvas = canvasFactory(outputWidth, held.height + footerHeight);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('PNG canvas is unavailable');
    for (const part of held.parts || [held]) {
      signal?.throwIfAborted();
      if (!(part.blob instanceof Blob))
        throw new Error('Full-resolution PNG bytes are no longer loaded');
      const bitmap = await decodeImage(part.blob);
      bitmaps.push(bitmap);
      signal?.throwIfAborted();
      if (bitmap.width !== part.width || bitmap.height !== part.height)
        throw new Error(
          'Loaded image dimensions do not match the verified snapshot',
        );
      context.drawImage(
        bitmap,
        (part.column || 0) * 512,
        (part.row || 0) * 512,
      );
      bitmap.close?.();
      bitmaps.pop();
    }
    context.fillStyle = '#07111f';
    context.fillRect(0, held.height, outputWidth, footerHeight);
    context.fillStyle = '#ffffff';
    context.font = '12px sans-serif';
    context.textBaseline = 'top';
    lines.forEach((line, index) =>
      context.fillText(line, 8, held.height + 8 + index * 18, outputWidth - 16),
    );
    const blob = await canvasBlob(canvas);
    signal?.throwIfAborted();
    if (!(blob instanceof Blob) || blob.type !== 'image/png')
      throw new Error('Export did not produce a PNG');
    if (blob.size > outputWidth * (held.height + footerHeight) * 4 + 65536)
      throw Object.assign(
        new Error('Export PNG exceeds its reserved local memory budget'),
        { code: 'memory_limit' },
      );
    exportLeases.set(blob, workingLease);
    workingLease = null;
    return blob;
  } finally {
    for (const bitmap of bitmaps) bitmap.close?.();
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }
    workingLease?.release();
    if (held !== snapshot || snapshot?.retain) held.release?.();
    exportJobs--;
    if (started) finish();
    else previous.then(finish, finish);
  }
}
