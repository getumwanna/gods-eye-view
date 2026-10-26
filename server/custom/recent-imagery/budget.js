import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
  openSync,
  closeSync,
  unlinkSync,
  fsyncSync,
} from 'node:fs';
import { join } from 'node:path';
import { imageryError } from './catalog.js';

export const CDSE_LIMITS = Object.freeze({
  requests: 8000,
  pu: 8000,
  requestsPerMinute: 120,
  puPerMinute: 120,
  concurrent: 4,
  queue: 128,
});
// Empirical safety margin, not a provider billing formula. The October 23
// dashboard exceeded the matched local model by about 18.36%; retain headroom
// above that observation for admission, pacing and unknown request outcomes.
export const CDSE_PU_CALIBRATION = 1.25;
export const calibratedPu = (pu) => pu * CDSE_PU_CALIBRATION;
const monthAt = (time) => new Date(time).toISOString().slice(0, 7);
const abortError = () =>
  Object.assign(new Error('Imagery request cancelled.'), {
    name: 'AbortError',
    code: 'cancelled',
    status: 499,
  });

function atomicJson(path, value) {
  const temp = `${path}.${process.pid}.tmp`;
  const fd = openSync(temp, 'w', 0o600);
  try {
    writeFileSync(fd, JSON.stringify(value));
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
  renameSync(temp, path);
}

function validLedger(state) {
  return (
    (state?.version === 1 ||
      (state?.version === 2 &&
        state.puCalibrationFactor === CDSE_PU_CALIBRATION)) &&
    /^\d{4}-(0[1-9]|1[0-2])$/.test(state.month) &&
    ['requests', 'pu', 'oauthCalls', 'nextDispatch', 'pauseUntil'].every(
      (key) => Number.isFinite(state[key]) && state[key] >= 0,
    ) &&
    Number.isSafeInteger(state.requests) &&
    Number.isSafeInteger(state.oauthCalls) &&
    Number.isFinite(calibratedPu(state.pu)) &&
    Array.isArray(state.events) &&
    state.events.length <= 10_000 &&
    state.events.every(
      (entry) =>
        Number.isFinite(entry.at) &&
        entry.at >= 0 &&
        Number.isFinite(entry.pu) &&
        Number.isFinite(calibratedPu(entry.pu)) &&
        entry.pu >= 0,
    ) &&
    Array.isArray(state.history) &&
    state.history.length <= 24
  );
}

/** Reservations are persisted before dispatch. Unknown outcomes remain charged. */
export function createBudget({
  root,
  now = Date.now,
  sleep = (ms, signal) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(done, ms);
      function done() {
        signal?.removeEventListener('abort', cancel);
        resolve();
      }
      function cancel() {
        clearTimeout(timer);
        reject(abortError());
      }
      signal?.addEventListener('abort', cancel, { once: true });
      if (signal?.aborted) cancel();
    }),
  limits = CDSE_LIMITS,
} = {}) {
  mkdirSync(root, { recursive: true, mode: 0o700 });
  const file = join(root, 'usage.json');
  let fault = null;
  let state;
  try {
    state = JSON.parse(readFileSync(file, 'utf8'));
    if (!validLedger(state)) throw new Error('invalid');
  } catch (error) {
    if (error.code === 'ENOENT') {
      state = {
        version: 2,
        puCalibrationFactor: CDSE_PU_CALIBRATION,
        month: monthAt(now()),
        requests: 0,
        pu: 0,
        oauthCalls: 0,
        nextDispatch: 0,
        pauseUntil: 0,
        events: [],
        history: [],
      };
      try {
        const initial = openSync(file, 'wx', 0o600);
        try {
          writeFileSync(initial, JSON.stringify(state));
          fsyncSync(initial);
        } finally {
          closeSync(initial);
        }
      } catch (creation) {
        if (creation.code === 'EEXIST') {
          try {
            state = JSON.parse(readFileSync(file, 'utf8'));
            if (!validLedger(state)) throw new Error('invalid');
          } catch {
            fault = 'Usage ledger cannot be read safely.';
          }
        } else fault = 'Usage ledger cannot be written.';
      }
    } else
      fault =
        'Usage ledger is unreadable or corrupt; acquisition is paused. Preserve it for review.';
  }
  let active = 0;
  let queued = 0;
  let retrying = 0;
  let transaction = Promise.resolve();
  const write = () => {
    try {
      atomicJson(file, state);
    } catch {
      fault = 'Usage ledger cannot be written; acquisition is paused.';
      throw imageryError('ledger_unavailable', fault);
    }
  };
  const assertHealthy = () => {
    if (fault) throw imageryError('ledger_unavailable', fault);
  };
  function calibrateLegacy() {
    assertHealthy();
    if (state.version !== 1) return;
    // Called only under the cross-process lock. Preserve request/OAuth counts,
    // timestamps and historical records; never apply the factor twice.
    state = {
      ...state,
      version: 2,
      puCalibrationFactor: CDSE_PU_CALIBRATION,
      pu: calibratedPu(state.pu),
      events: state.events.map((entry) => ({
        ...entry,
        pu: calibratedPu(entry.pu),
      })),
    };
    for (const entry of state.events)
      state.nextDispatch = Math.max(
        state.nextDispatch,
        entry.at + (entry.pu * 60_000) / limits.puPerMinute,
      );
    write();
  }
  function refresh() {
    assertHealthy();
    const month = monthAt(now());
    if (month < state.month)
      throw imageryError(
        'clock_changed',
        'Clock moved before the saved usage period; acquisition is paused.',
      );
    calibrateLegacy();
    if (month !== state.month) {
      state.history = [
        ...state.history,
        {
          month: state.month,
          requests: state.requests,
          pu: state.pu,
          puCalibrationFactor: state.puCalibrationFactor,
          oauthCalls: state.oauthCalls,
        },
      ].slice(-24);
      state.month = month;
      state.requests = 0;
      state.pu = 0;
      state.oauthCalls = 0;
      write();
    }
    state.events = state.events.filter((entry) => entry.at > now() - 60_000);
  }
  function summary() {
    // Status reads do not acquire data, roll periods, reset totals, or rewrite the ledger.
    if (!fault) {
      try {
        const saved = JSON.parse(readFileSync(file, 'utf8'));
        if (!validLedger(saved)) throw new Error('invalid');
        state = saved;
      } catch {
        fault = 'Usage ledger cannot be read safely; acquisition is paused.';
      }
    }
    return {
      label: 'GEV measured/reserved usage',
      accountWide: false,
      month: state?.month ?? null,
      requests: state?.requests ?? null,
      // A passive legacy read projects the conservative value without migrating
      // or writing storage. Explicit calibration/acquisition persists it once.
      pu: state
        ? state.version === 1
          ? calibratedPu(state.pu)
          : state.pu
        : null,
      puCalibrationFactor: CDSE_PU_CALIBRATION,
      puCalibrationApplied: state ? state.version === 2 : null,
      oauthCalls: state?.oauthCalls ?? null,
      limits: { ...limits },
      resetsAt: state
        ? new Date(`${state.month}-01T00:00:00Z`).setUTCMonth(
            Number(state.month.slice(5)),
          )
        : null,
      queued,
      active,
      retrying,
      status: fault
        ? 'paused'
        : retrying
          ? 'retrying'
          : queued
            ? 'queued'
            : 'ready',
      reason: fault,
      pauseUntil: state?.pauseUntil ?? null,
    };
  }
  function lock(work) {
    const result = transaction.then(async () => {
      const lockPath = join(root, 'usage.lock');
      let fd;
      for (let attempt = 0; attempt < 100; attempt++) {
        try {
          fd = openSync(lockPath, 'wx', 0o600);
          writeFileSync(fd, String(process.pid));
          break;
        } catch (error) {
          if (error.code !== 'EEXIST')
            throw imageryError(
              'ledger_unavailable',
              'Usage ledger cannot be locked; acquisition is paused.',
            );
          try {
            const pid = Number(readFileSync(lockPath, 'utf8'));
            if (Number.isSafeInteger(pid) && pid > 0) {
              try {
                process.kill(pid, 0);
              } catch (probe) {
                if (probe.code === 'ESRCH') {
                  unlinkSync(lockPath);
                  continue;
                }
              }
            }
          } catch {
            /* An active writer may still be creating its lock. */
          }
          await sleep(10);
        }
      }
      if (fd === undefined)
        throw imageryError(
          'ledger_unavailable',
          'Another local imagery owner holds the usage ledger. Retry after it finishes.',
        );
      try {
        // A second process may have updated the shared owner ledger since our last operation.
        try {
          const saved = JSON.parse(readFileSync(file, 'utf8'));
          if (!validLedger(saved)) throw new Error('invalid');
          state = saved;
        } catch {
          fault =
            'Usage ledger changed or became unreadable; acquisition is paused.';
          assertHealthy();
        }
        return work();
      } finally {
        closeSync(fd);
        try {
          unlinkSync(lockPath);
        } catch {
          /* A later operation fails closed if the lock remains. */
        }
      }
    });
    transaction = result.catch(() => {});
    return result;
  }
  async function reserve(pu, signal) {
    if (!Number.isFinite(pu) || pu <= 0 || pu > limits.puPerMinute)
      throw imageryError(
        'invalid_cost',
        'Imagery request exceeds the per-request safety budget.',
        400,
      );
    for (;;) {
      signal?.throwIfAborted();
      const wait = await lock(() => {
        // Cancellation may occur while another owner/transaction holds the lock.
        // It must be checked at the actual reservation boundary, before charging.
        signal?.throwIfAborted();
        refresh();
        if (state.requests + 1 > limits.requests || state.pu + pu > limits.pu)
          throw imageryError(
            'monthly_ceiling',
            'The local monthly Sentinel-2 safety ceiling is reached.',
            429,
          );
        const eventPu = state.events.reduce((sum, entry) => sum + entry.pu, 0);
        const minuteWait =
          state.events.length >= limits.requestsPerMinute ||
          eventPu + pu > limits.puPerMinute
            ? Math.max(1, state.events[0].at + 60_000 - now())
            : 0;
        const delay = Math.max(
          minuteWait,
          state.nextDispatch - now(),
          state.pauseUntil - now(),
          0,
        );
        if (delay) return delay;
        state.requests += 1;
        state.pu += pu;
        state.events.push({ at: now(), pu });
        state.nextDispatch =
          now() +
          Math.max(
            60_000 / limits.requestsPerMinute,
            (pu * 60_000) / limits.puPerMinute,
          );
        write();
        return 0;
      });
      if (!wait) return;
      await sleep(wait, signal);
    }
  }
  async function run(pu, work, { signal } = {}) {
    assertHealthy();
    if (queued >= limits.queue)
      throw imageryError(
        'queue_full',
        'Sentinel-2 queue is full. Wait for current imagery work.',
        503,
      );
    queued++;
    let waiting = true;
    try {
      while (active >= limits.concurrent) {
        signal?.throwIfAborted();
        await sleep(25, signal);
      }
      signal?.throwIfAborted();
      active++;
      try {
        await reserve(calibratedPu(pu), signal);
        queued--;
        waiting = false;
        return await work();
      } finally {
        active--;
      }
    } catch (error) {
      if (waiting) queued--;
      throw error;
    }
  }
  return {
    summary,
    run,
    sleep,
    async calibrate() {
      await lock(calibrateLegacy);
      return summary();
    },
    async pause(ms) {
      await lock(() => {
        refresh();
        state.pauseUntil = Math.max(
          state.pauseUntil,
          now() + Math.min(300_000, Math.max(0, ms)),
        );
        write();
      });
    },
    setRetrying(delta) {
      retrying = Math.max(0, retrying + delta);
    },
    async oauth() {
      await lock(() => {
        refresh();
        state.oauthCalls++;
        write();
      });
    },
    async reconcile(reserved, actual) {
      reserved = calibratedPu(reserved);
      if (!Number.isFinite(actual) || actual <= reserved) return; // Conservative reservations are never refunded.
      await lock(() => {
        refresh();
        const extra = actual - reserved;
        state.pu += extra;
        // Count unexpected extra PU in the rolling limit too. Its extra event is
        // conservative for request pacing; no usage reservation is refunded.
        state.events.push({ at: now(), pu: extra });
        state.nextDispatch = Math.max(
          state.nextDispatch,
          now() + (extra * 60_000) / limits.puPerMinute,
        );
        write();
      });
    },
  };
}
