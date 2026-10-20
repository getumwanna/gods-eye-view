import test from 'node:test';
import assert from 'node:assert/strict';
import { createKeyAccess } from './keyAccess.js';
import { keySetupStatus } from '../../keySetupCore.mjs';

const expectedIds = keySetupStatus({}).keys.map(({ id }) => id).sort();
const response = (body, ok = true) => ({ ok, json: async () => body });
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function assertUnknown(snapshot, state) {
  assert.equal(snapshot.state, state);
  assert.deepEqual(Object.keys(snapshot.keys).sort(), expectedIds);
  assert.ok(Object.values(snapshot.keys).every(value => value === null));
}

test('key status starts unknown and immutable, matching the visible upstream registry', () => {
  const api = createKeyAccess({ fetchImpl: () => { throw new Error('No request expected'); } });
  assertUnknown(api.getSnapshot(), 'idle');
  assert.ok(Object.isFrozen(api.getSnapshot()));
  assert.ok(Object.isFrozen(api.getSnapshot().keys));
  assert.equal(Object.hasOwn(api.getSnapshot().keys, 'google-maps-server'), false);
  api.destroy();
});

test('upstream status projects literal presence only and issues one bounded local request', async () => {
  const payload = keySetupStatus({ OPENAI_API_KEY: 'test-only-not-a-real-key', FIRMS_MAP_KEY: 'test-only-firms' });
  const calls = [];
  const states = [];
  const wait = deferred();
  const started = deferred();
  const api = createKeyAccess({ fetchImpl: (...args) => { calls.push(args); started.resolve(); return wait.promise; } });
  api.subscribe(snapshot => states.push(snapshot.state));
  const first = api.load();
  const second = api.load();
  assert.strictEqual(first, second);
  await started.promise;
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], '/api/setup/status');
  assert.equal(calls[0][1].cache, 'no-store');
  assert.equal(calls[0][1].credentials, 'same-origin');
  assert.ok(calls[0][1].signal instanceof AbortSignal);
  wait.resolve(response(payload));
  await first;
  const current = api.getSnapshot();
  assert.equal(current.state, 'ready');
  for (const key of payload.keys) assert.equal(current.keys[key.id], key.set);
  assert.deepEqual(Object.keys(current).sort(), ['keys', 'state']);
  assert.deepEqual(states, ['idle', 'loading', 'ready']);
  await api.load();
  assert.equal(calls.length, 1, 'settled loads reuse this controller’s one acquisition');
  api.destroy();
});

test('untrusted extra fields and credential-shaped data never survive projection', async () => {
  const secret = 'TEST-CREDENTIAL-MATERIAL-DO-NOT-RETAIN';
  const api = createKeyAccess({ fetchImpl: async () => response({
    keys: [
      { id: 'openai', set: true, value: secret, suffix: secret, envVars: [secret] },
      { id: 'firms', set: false, error: secret },
      { id: 'unknown-provider', set: true, value: secret },
      { id: 'google-maps-server', set: true, value: secret },
    ],
    error: secret, token: secret, source: secret, setCount: secret,
  }) });
  await api.load();
  const current = api.getSnapshot();
  assert.equal(current.keys.openai, true);
  assert.equal(current.keys.firms, false);
  assert.equal(current.keys.aisstream, null);
  assert.deepEqual(Object.keys(current.keys).sort(), expectedIds);
  assert.ok(!JSON.stringify(current).includes(secret));
  api.destroy();
});

test('missing, nonboolean and duplicate presence values remain unknown', async () => {
  const api = createKeyAccess({ fetchImpl: async () => response({ keys: [
    { id: 'openai', set: 'true' },
    { id: 'firms', set: 0 },
    { id: 'aisstream', set: true },
    { id: 'aisstream', set: false },
    { id: 'aisstream', set: true },
    null, 1, 'openai', {},
  ] }) });
  await api.load();
  assertUnknown(api.getSnapshot(), 'ready');
  api.destroy();
});

test('a loading subscriber cannot cause a second setup acquisition', async () => {
  let calls = 0;
  let reentered = false;
  let nested;
  const api = createKeyAccess({ fetchImpl: async () => { calls += 1; return response({ keys: [] }); } });
  api.subscribe(snapshot => {
    if (snapshot.state === 'loading' && !reentered) {
      reentered = true;
      nested = api.load();
    }
  });
  const initial = api.load();
  await Promise.all([initial, nested]);
  assert.equal(calls, 1);
  assert.strictEqual(initial, nested);
  api.destroy();
});

test('403, 404 and network failures stay unavailable rather than missing-key claims', async () => {
  for (const kind of [403, 404, 'network']) {
    const api = createKeyAccess({ fetchImpl: async () => {
      if (kind === 'network') throw new Error('TEST-SECRET-ERROR');
      return { ok: false, status: kind, json: () => { throw new Error('Error bodies must not be retained'); } };
    } });
    await api.load();
    assertUnknown(api.getSnapshot(), 'unavailable');
    assert.ok(!JSON.stringify(api.getSnapshot()).includes('TEST-SECRET'));
    api.destroy();
  }
});

test('malformed, oversized and invalid JSON responses become unavailable', async () => {
  for (const body of [null, {}, { keys: {} }, { keys: new Array(65).fill({ id: 'openai', set: true }) }]) {
    const api = createKeyAccess({ fetchImpl: async () => response(body) });
    await api.load();
    assertUnknown(api.getSnapshot(), 'unavailable');
    api.destroy();
  }
  const api = createKeyAccess({ fetchImpl: async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } }) });
  await api.load();
  assertUnknown(api.getSnapshot(), 'unavailable');
  api.destroy();
});

test('subscriber failures and unsubscriptions do not disrupt other views', async () => {
  const observed = [];
  const removed = [];
  const api = createKeyAccess({ fetchImpl: async () => response({ keys: [] }) });
  api.subscribe(() => { throw new Error('Broken view'); });
  api.subscribe(snapshot => observed.push(snapshot.state));
  const unsubscribe = api.subscribe(snapshot => removed.push(snapshot.state));
  unsubscribe();
  await api.load();
  assert.deepEqual(observed, ['idle', 'loading', 'ready']);
  assert.deepEqual(removed, ['idle']);
  api.destroy();
});

test('destroy aborts a pending request and prevents late publication or later acquisition', async () => {
  const wait = deferred();
  let calls = 0;
  let requestSignal;
  const observed = [];
  const started = deferred();
  const api = createKeyAccess({ fetchImpl: (_url, options) => { calls += 1; requestSignal = options.signal; started.resolve(); return wait.promise; } });
  api.subscribe(snapshot => observed.push(snapshot.state));
  const pending = api.load();
  await started.promise;
  api.destroy();
  api.destroy();
  assert.equal(requestSignal.aborted, true);
  wait.resolve(response({ keys: [{ id: 'openai', set: true }] }));
  await pending;
  await api.load();
  assert.equal(calls, 1);
  assert.deepEqual(observed, ['idle', 'loading']);
  assertUnknown(api.getSnapshot(), 'loading');
  let lateNotifications = 0;
  api.subscribe(() => { lateNotifications += 1; });
  assert.equal(lateNotifications, 0);
});

test('external abort during JSON parsing prevents late credential-presence publication', async () => {
  const external = new AbortController();
  const json = deferred();
  const parsing = deferred();
  const observed = [];
  let requestSignal;
  const api = createKeyAccess({ signal: external.signal, fetchImpl: async (_url, options) => {
    requestSignal = options.signal;
    return { ok: true, json: () => { parsing.resolve(); return json.promise; } };
  } });
  api.subscribe(snapshot => observed.push(snapshot.state));
  const pending = api.load();
  await parsing.promise;
  external.abort();
  json.resolve({ keys: [{ id: 'openai', set: true }] });
  await pending;
  assert.equal(requestSignal.aborted, true);
  assert.deepEqual(observed, ['idle', 'loading']);
  assertUnknown(api.getSnapshot(), 'loading');
});

test('an already-aborted external lifetime never starts acquisition or subscribes', async () => {
  const external = new AbortController();
  external.abort();
  let calls = 0;
  const api = createKeyAccess({ signal: external.signal, fetchImpl: () => { calls += 1; throw new Error('Not expected'); } });
  let notifications = 0;
  api.subscribe(() => { notifications += 1; });
  await api.load();
  assert.equal(calls, 0);
  assert.equal(notifications, 0);
  assertUnknown(api.getSnapshot(), 'idle');
});
