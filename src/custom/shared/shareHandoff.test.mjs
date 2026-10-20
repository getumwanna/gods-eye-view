import test from 'node:test';
import assert from 'node:assert/strict';
import { createGlobeUrl, validateGlobeLink } from './shareHandoff.js';

const origin = 'http://localhost:4173';

for (const [kind, id] of [['aircraft', 'a1b2c3'], ['military_aircraft', 'ae1234'], ['satellite', '25544']]) {
  test(`full v2 ${kind} handoff retains provider, target, panel and shader state`, () => {
    const url = new URL(createGlobeUrl({ camera: { lat: 30.2672, lon: -97.7431, altitude_m: 800000 }, layers: ['earthquakes'], style: 'thermal', map: 'esri-imagery', follow: { kind, id } }, { origin }));
    const full = new URLSearchParams(url.hash.slice(1));
    for (const [key, value] of Object.entries({ hud: 'tactical', hv: '1', bi: '0.25', bv: '2', si: '49', sc: '1', scf: '11', ui: 'c.c.1_c.p.0_d.c.1', future_view_field: 'keep this exact value' })) full.set(key, value);
    url.hash = full.toString();
    assert.equal(validateGlobeLink(url.href, { origin }), url.href);
    assert.ok(full.has('lo'), 'upstream follow target options remain in the full hash');
  });
}

test('portable follow kinds exclude vessels while ordinary vessel view state can be handed off', () => {
  assert.throws(() => createGlobeUrl({ camera: { lat: 1, lon: 2 }, follow: { kind: 'vessel', id: '123456789' } }, { origin }));
  const link = `${origin}/#v=2&lat=1&lon=2&alt=800&l=v&map=esri-imagery`;
  assert.equal(validateGlobeLink(link, { origin }), link);
});

test('handoff refuses encoded credentials, extra paths and out-of-range camera state', () => {
  for (const link of ['/#v=2&lat=1&lon=2&alt=800&api%5Fkey=secret', '/#v=2&lat=91&lon=2&alt=800', '/#v=2&lat=1&lon=-181&alt=800', '/#v=2&lat=1x&lon=2&alt=800', '/#v=2&lat=1&lon=2&alt=-1', '/hub/../other/#v=2&lat=1&lon=2&alt=800', 'http://user:password@localhost:4173/']) {
    assert.throws(() => validateGlobeLink(link, { origin }), link);
  }
});
