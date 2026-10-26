import test from 'node:test';
import assert from 'node:assert/strict';
import { imageryResolutionLabel } from './viewport.js';

test('loaded source resolution replaces camera GSD in IMAGE and preserves both independent AB identities', () => {
  const a = {
    loaded: true,
    product: 'S2',
    nativeResolutionM: 10,
    day: '2026-10-13',
  };
  const b = {
    loaded: true,
    product: 'L30',
    nativeResolutionM: 30,
    day: '2026-10-12',
  };
  assert.equal(
    imageryResolutionLabel({ active: true, slots: { a }, cameraGsd: 0.27 }),
    'Imagery: A: S2 10 m',
  );
  assert.equal(
    imageryResolutionLabel({ active: true, slots: { a, b }, cameraGsd: 0.27 }),
    'Imagery: A: S2 10 m / B: HLS L30 30 m',
  );
});

test('pending card cannot impersonate loaded image; transition keeps actual loaded identity and no camera number', () => {
  const state = {
    active: true,
    pending: true,
    slots: { a: { loaded: false, product: 'S2', nativeResolutionM: 10 } },
    cameraGsd: 0.27,
    cameraNiirs: 6.8,
  };
  assert.equal(imageryResolutionLabel(state), 'Imagery: loading');
  state.slots.b = { loaded: true, product: 'S30', nativeResolutionM: 30 };
  assert.equal(
    imageryResolutionLabel(state),
    'Imagery: B: HLS S30 30 m · loading',
  );
  assert.doesNotMatch(imageryResolutionLabel(state), /0\.27|6\.8|S2/);
});

test('clear/disable restores camera HUD path and VIIRS keeps its actual overview resolution', () => {
  assert.equal(
    imageryResolutionLabel({
      active: false,
      slots: { a: { loaded: true, product: 'S2', nativeResolutionM: 10 } },
    }),
    null,
  );
  assert.equal(imageryResolutionLabel(null), null);
  assert.equal(
    imageryResolutionLabel({
      active: true,
      slots: { a: { loaded: true, product: 'VIIRS', nativeResolutionM: 250 } },
    }),
    'Imagery: A: VIIRS 250 m',
  );
});
