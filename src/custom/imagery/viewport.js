/** Camera-only fitting. No catalog, processing or selected-box state is owned here. */
const EARTH_RADIUS_M = 6378137;
const radians = (degrees) => (degrees * Math.PI) / 180;
const rect = (value) => {
  const left = Number(value?.left ?? value?.x ?? 0);
  const top = Number(value?.top ?? value?.y ?? 0);
  const width = Number(value?.width ?? value?.right - left);
  const height = Number(value?.height ?? value?.bottom - top);
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
};
const intersects = (a, b) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/** Largest unobstructed CSS rectangle; overlapping panels never double-count. */
export function unobstructedViewport(canvasRect, panelRects = []) {
  const canvas = rect(canvasRect);
  if (!(canvas.width > 0) || !(canvas.height > 0)) return null;
  const obstacles = panelRects
    .map(rect)
    .filter(
      (panel) =>
        panel.width > 0 && panel.height > 0 && intersects(canvas, panel),
    )
    .map((panel) =>
      rect({
        left: Math.max(canvas.left, panel.left),
        top: Math.max(canvas.top, panel.top),
        right: Math.min(canvas.right, panel.right),
        bottom: Math.min(canvas.bottom, panel.bottom),
      }),
    );
  const xs = [
    ...new Set([
      canvas.left,
      canvas.right,
      ...obstacles.flatMap((item) => [item.left, item.right]),
    ]),
  ].sort((a, b) => a - b);
  const ys = [
    ...new Set([
      canvas.top,
      canvas.bottom,
      ...obstacles.flatMap((item) => [item.top, item.bottom]),
    ]),
  ].sort((a, b) => a - b);
  let best = null;
  for (let l = 0; l < xs.length - 1; l++)
    for (let r = l + 1; r < xs.length; r++) {
      for (let t = 0; t < ys.length - 1; t++)
        for (let b = t + 1; b < ys.length; b++) {
          const candidate = rect({
            left: xs[l],
            right: xs[r],
            top: ys[t],
            bottom: ys[b],
          });
          if (obstacles.some((panel) => intersects(candidate, panel))) continue;
          if (
            !best ||
            candidate.width * candidate.height > best.width * best.height
          )
            best = candidate;
        }
    }
  return best;
}

export function nativeImageryResolution(image) {
  const metadata = image?.metadata || image;
  const product = metadata?.product || metadata?.candidate?.product;
  if (product && !['S2', 'S30', 'L30'].includes(product)) return null;
  const value = Number(metadata?.nativeResolutionM ?? metadata?.resolutionM);
  if (value > 0 && Number.isFinite(value)) return value;
  return product === 'S2' ? 10 : ['S30', 'L30'].includes(product) ? 30 : null;
}

/** Loaded-slot identity, never a focused card or camera-derived GSD/NIIRS. */
export function imageryResolutionLabel(state) {
  if (!state?.active) return null;
  const labels = [];
  for (const slot of ['a', 'b']) {
    const image = state.slots?.[slot];
    if (!image?.loaded) continue;
    const product = image.product || image.metadata?.product;
    const resolution = Number(
      image.nativeResolutionM ?? image.metadata?.nativeResolutionM,
    );
    const name =
      product === 'S2'
        ? 'S2'
        : ['S30', 'L30'].includes(product)
          ? `HLS ${product}`
          : product;
    if (name && resolution > 0 && Number.isFinite(resolution))
      labels.push(`${slot.toUpperCase()}: ${name} ${resolution} m`);
  }
  return labels.length
    ? `Imagery: ${labels.join(' / ')}${state.pending ? ' · loading' : ''}`
    : 'Imagery: loading';
}

/** Largest loaded source pixel wins in A/B. CSS pixels deliberately ignore DPR. */
export function computeImageryFit({
  canvasRect,
  panelRects = [],
  images = [],
  nativeResolutionM,
  verticalFovRadians = Math.PI / 3,
  heading = 0,
  center,
} = {}) {
  const canvas = rect(canvasRect),
    visible = unobstructedViewport(canvas, panelRects);
  const resolutions = images
    .map(nativeImageryResolution)
    .filter((value) => value > 0);
  const resolution = Number(nativeResolutionM) || Math.max(0, ...resolutions);
  if (
    !visible ||
    !(resolution > 0) ||
    !(verticalFovRadians > 0 && verticalFovRadians < Math.PI) ||
    !Number.isFinite(center?.lon) ||
    !Number.isFinite(center?.lat) ||
    Math.abs(center.lat) >= 85
  )
    return null;
  // A top-down perspective has one uniform ground pixel scale. Obstructions
  // change the visible footprint and its center, never the image request size.
  const heightM =
    (resolution * canvas.height) / (2 * Math.tan(verticalFovRadians / 2));
  const dx =
    (visible.left + visible.width / 2 - canvas.left - canvas.width / 2) *
    resolution;
  const dy =
    (visible.top + visible.height / 2 - canvas.top - canvas.height / 2) *
    resolution;
  const offsetEastM = -dx * Math.cos(heading) + dy * Math.sin(heading);
  const offsetNorthM = dx * Math.sin(heading) + dy * Math.cos(heading);
  const latitude =
    center.lat + ((offsetNorthM / EARTH_RADIUS_M) * 180) / Math.PI;
  const longitude =
    center.lon +
    ((offsetEastM / (EARTH_RADIUS_M * Math.cos(radians(center.lat)))) * 180) /
      Math.PI;
  if (Math.abs(latitude) >= 85 || longitude < -180 || longitude > 180)
    return null;
  return {
    nativeResolutionM: resolution,
    visibleRect: visible,
    footprintM: {
      width: visible.width * resolution,
      height: visible.height * resolution,
    },
    heightM,
    center: { ...center },
    destination: { lon: longitude, lat: latitude, height: heightM },
    orientation: { heading, pitch: -Math.PI / 2, roll: 0 },
  };
}

function imageryCenter(images) {
  const boxes = images
    .map(
      (image) =>
        image?.metadata?.box ||
        image?.metadata?.bounds ||
        image?.box ||
        image?.bounds,
    )
    .filter(Boolean);
  if (!boxes.length) return null;
  const box = boxes[0];
  return {
    lon: (Number(box.west) + Number(box.east)) / 2,
    lat: (Number(box.south) + Number(box.north)) / 2,
  };
}

function clonePosition(value) {
  return value ? { x: value.x, y: value.y, z: value.z } : null;
}

/** An automatic fit latch is session-scoped until reset (CLEAR/new box). */
export function createImageryViewportController({
  viewer,
  readViewport = () => ({}),
  destinationFactory,
} = {}) {
  let savedPose = null;
  const fittedModes = new Set();
  const getViewer = () => (typeof viewer === 'function' ? viewer() : viewer);
  return {
    fit(images, { auto = false, assignmentKey, center } = {}) {
      const active = getViewer(),
        camera = active?.camera;
      const mode =
        assignmentKey === 'ab' || images?.length > 1 ? 'ab' : 'image';
      if (
        !camera?.setView ||
        !images?.length ||
        (auto && fittedModes.has(mode))
      )
        return false;
      const view = readViewport(active) || {};
      const canvas = active.scene?.canvas;
      const canvasRect = view.canvasRect ||
        canvas?.getBoundingClientRect?.() || {
          width: canvas?.clientWidth,
          height: canvas?.clientHeight,
        };
      const frustum = camera.frustum || {};
      const fovy =
        frustum.fovy ||
        (frustum.aspectRatio > 1 && frustum.fov
          ? 2 * Math.atan(Math.tan(frustum.fov / 2) / frustum.aspectRatio)
          : frustum.fov);
      const result = computeImageryFit({
        canvasRect,
        panelRects: view.panelRects || [],
        images,
        verticalFovRadians: fovy,
        heading: Number(camera.heading) || 0,
        center: center || imageryCenter(images),
      });
      if (!result) return false;
      const ellipsoid =
        active.scene?.ellipsoid || active.scene?.globe?.ellipsoid;
      const toDestination =
        destinationFactory ||
        ((point) =>
          ellipsoid?.cartographicToCartesian?.({
            longitude: radians(point.lon),
            latitude: radians(point.lat),
            height: point.height,
          }));
      const destination = toDestination(result.destination);
      if (!destination) return false;
      if (!savedPose)
        savedPose = {
          destination: clonePosition(camera.positionWC || camera.position),
          orientation: {
            heading: camera.heading,
            pitch: camera.pitch,
            roll: camera.roll,
          },
        };
      camera.setView({ destination, orientation: result.orientation });
      active.scene?.requestRender?.();
      if (auto) fittedModes.add(mode);
      return { ...result, assignmentKey };
    },
    restore() {
      const active = getViewer();
      if (!savedPose?.destination || !active?.camera?.setView) return false;
      active.camera.setView({
        destination: clonePosition(savedPose.destination),
        orientation: { ...savedPose.orientation },
      });
      active.scene?.requestRender?.();
      savedPose = null;
      return true;
    },
    reset() {
      savedPose = null;
      fittedModes.clear();
    },
    canRestore: () => Boolean(savedPose),
    getState: () => ({
      canRestore: Boolean(savedPose),
      fittedAutomatically: fittedModes.size > 0,
    }),
  };
}
