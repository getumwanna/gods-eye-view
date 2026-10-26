import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeImageryFit,
  createImageryViewportController,
  nativeImageryResolution,
  unobstructedViewport,
} from './viewport.js';

test('panel-aware CSS viewport uses the largest free rectangle without double counting overlaps', () => {
  const canvas = { left: 50, top: 20, width: 1200, height: 800 };
  const panels = [
    { left: 950, top: 20, width: 300, height: 800 },
    { left: 950, top: 20, width: 300, height: 400 },
  ];
  const visible = unobstructedViewport(canvas, panels);
  assert.deepEqual(visible, {
    left: 50,
    top: 20,
    right: 950,
    bottom: 820,
    width: 900,
    height: 800,
  });
  assert.equal(unobstructedViewport(canvas, [canvas]), null);
  assert.equal(unobstructedViewport({ width: 0, height: 800 }), null);
});

test('fit targets one native source pixel per CSS pixel, coarse AB and actual panel-free footprint', () => {
  const input = {
    canvasRect: { width: 1200, height: 800 },
    panelRects: [{ left: 900, top: 0, width: 300, height: 800 }],
    images: [{ product: 'S2' }, { product: 'L30' }],
    center: { lon: -74, lat: 40 },
    verticalFovRadians: Math.PI / 3,
  };
  const before = JSON.stringify(input);
  const fit = computeImageryFit(input);
  assert.equal(fit.nativeResolutionM, 30);
  assert.deepEqual(fit.footprintM, { width: 27000, height: 24000 });
  assert.ok(
    Math.abs(fit.heightM - (30 * 800) / (2 * Math.tan(Math.PI / 6))) < 1e-8,
  );
  assert.ok(
    fit.destination.lon > -74,
    'camera offset puts selected center in free left viewport',
  );
  assert.equal(
    JSON.stringify(input),
    before,
    'no selected/search/processing extent changed',
  );
  assert.deepEqual(
    computeImageryFit({ ...input, devicePixelRatio: 3 }),
    fit,
    'DPR cannot enlarge a request or fitted ground pixel',
  );
});

test('narrow layout subtracts bottom panel and unsupported sources/geometries refuse instead of guessing', () => {
  const fit = computeImageryFit({
    canvasRect: { width: 390, height: 844 },
    panelRects: [{ top: 500, left: 0, width: 390, height: 344 }],
    images: [{ product: 'S30' }],
    center: { lon: 0, lat: 0 },
  });
  assert.deepEqual(fit.footprintM, { width: 11700, height: 15000 });
  assert.equal(
    nativeImageryResolution({ product: 'VIIRS', nativeResolutionM: 250 }),
    null,
  );
  assert.equal(
    computeImageryFit({
      canvasRect: { width: 100, height: 100 },
      images: [{ product: 'VIIRS' }],
      center: { lon: 0, lat: 0 },
    }),
    null,
  );
  assert.equal(
    computeImageryFit({
      canvasRect: { width: 100, height: 100 },
      images: [{ product: 'S2' }],
      center: { lon: 0, lat: 89 },
    }),
    null,
  );
});

test('camera-only controller latches initial image/comparison, restores an independent pose and never changes frozen box', () => {
  const box = Object.freeze({
    west: -74.2,
    east: -74.1,
    south: 40.2,
    north: 40.3,
  });
  const calls = [];
  const viewer = {
    camera: {
      positionWC: { x: 1, y: 2, z: 3 },
      heading: 0.2,
      pitch: -1,
      roll: 0.1,
      frustum: { fovy: Math.PI / 3 },
      setView: (value) => calls.push(value),
    },
    scene: {
      canvas: { clientWidth: 1200, clientHeight: 800 },
      requestRender() {},
    },
  };
  const controller = createImageryViewportController({
    viewer,
    destinationFactory: (point) => ({ ...point }),
  });
  const a = Object.freeze({ product: 'S2', box });
  const b = Object.freeze({ product: 'L30', box });
  assert.ok(controller.fit([a], { auto: true, assignmentKey: 'image' }));
  assert.equal(
    controller.fit([b], { auto: true, assignmentKey: 'different-date' }),
    false,
  );
  assert.equal(
    controller.fit([a, b], { auto: true, assignmentKey: 'ab' })
      .nativeResolutionM,
    30,
  );
  assert.equal(
    controller.fit([b, a], { auto: true, assignmentKey: 'ab' }),
    false,
  );
  assert.equal(controller.canRestore(), true);
  viewer.camera.positionWC.x = 999;
  assert.equal(controller.restore(), true);
  assert.deepEqual(calls.at(-1), {
    destination: { x: 1, y: 2, z: 3 },
    orientation: { heading: 0.2, pitch: -1, roll: 0.1 },
  });
  assert.equal(controller.restore(), false);
  assert.equal(controller.fit([a], { auto: true }), false);
  controller.reset();
  assert.ok(controller.fit([a], { auto: true }));
  assert.deepEqual(box, { west: -74.2, east: -74.1, south: 40.2, north: 40.3 });
});
