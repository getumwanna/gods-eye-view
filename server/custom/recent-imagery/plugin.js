import {
  readFileSync,
  mkdirSync,
  openSync,
  closeSync,
  writeFileSync,
  unlinkSync,
} from 'node:fs';
import { resolve, join } from 'node:path';
import { sameSiteGated } from '../../providers/common/same-site.js';
import { createCdseOwner } from './cdse.js';
import { CDSE_LIMITS, CDSE_PU_CALIBRATION, calibratedPu } from './budget.js';
import { imageryError } from './catalog.js';

// Vite config restarts can reevaluate this module in one Node process. Reuse the
// same owner rather than creating another token/cache/budget acquisition path.
const OWNER_SYMBOL = Symbol.for('gev.custom.cdse-recent-imagery.owners');
const OWNERS = (globalThis[OWNER_SYMBOL] ??= new Map());
const PREFIX = '/api/recent-imagery/cdse';
function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function localSocket(req) {
  const address = req.socket?.remoteAddress;
  if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address)) return false;
  try {
    const url = new URL(`http://${req.headers?.host}`);
    return (
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) &&
      url.username === '' &&
      url.password === ''
    );
  } catch {
    return false;
  }
}

async function readBody(req) {
  if (
    !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(
      req.headers?.['content-type'] ?? '',
    )
  )
    throw imageryError(
      'invalid_content_type',
      'Use application/json for imagery requests.',
      415,
    );
  if (Number(req.headers?.['content-length']) > 8192)
    throw imageryError(
      'request_too_large',
      'Imagery request body exceeds 8 KiB.',
      413,
    );
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 8192)
      throw imageryError(
        'request_too_large',
        'Imagery request body exceeds 8 KiB.',
        413,
      );
    chunks.push(chunk);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!value || typeof value !== 'object' || Array.isArray(value))
      throw new Error('object');
    return value;
  } catch {
    throw imageryError(
      'invalid_json',
      'Imagery request must be a JSON object.',
      400,
    );
  }
}

/** No-config/status inspection never creates an owner, token call, cache or ledger. */
function passiveUsage(root, configured) {
  let ledger;
  let reason = configured
    ? 'No imagery acquisition in this server session.'
    : 'Set CDSE_CLIENT_ID and CDSE_CLIENT_SECRET locally to enable Sentinel-2.';
  try {
    ledger = JSON.parse(readFileSync(join(root, 'usage.json'), 'utf8'));
    if (
      !(
        ledger.version === 1 ||
        (ledger.version === 2 &&
          ledger.puCalibrationFactor === CDSE_PU_CALIBRATION)
      ) ||
      !/^\d{4}-\d{2}$/.test(ledger.month) ||
      !['requests', 'pu', 'oauthCalls'].every(
        (key) => Number.isFinite(ledger[key]) && ledger[key] >= 0,
      ) ||
      !Number.isFinite(calibratedPu(ledger.pu))
    )
      throw new Error('ledger');
  } catch (error) {
    ledger = null;
    if (error.code !== 'ENOENT')
      reason = 'Usage ledger is unreadable or corrupt; acquisition is paused.';
  }
  return {
    label: 'GEV measured/reserved usage',
    accountWide: false,
    configured,
    month: ledger?.month ?? null,
    requests: ledger?.requests ?? null,
    pu: ledger
      ? ledger.version === 1
        ? calibratedPu(ledger.pu)
        : ledger.pu
      : null,
    puCalibrationFactor: CDSE_PU_CALIBRATION,
    puCalibrationApplied: ledger ? ledger.version === 2 : null,
    oauthCalls: ledger?.oauthCalls ?? null,
    limits: { ...CDSE_LIMITS },
    queued: 0,
    active: 0,
    retrying: 0,
    status: configured ? 'ready' : 'setup_required',
    reason,
    cache: null,
  };
}

function claimOwner(root) {
  mkdirSync(root, { recursive: true, mode: 0o700 });
  const path = join(root, 'owner.lock');
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const fd = openSync(path, 'wx', 0o600);
      try {
        writeFileSync(fd, String(process.pid));
      } finally {
        closeSync(fd);
      }
      return;
    } catch (error) {
      if (error.code !== 'EEXIST')
        throw imageryError(
          'owner_unavailable',
          'The local Sentinel-2 owner cannot use its cache directory.',
        );
      let stale = false;
      try {
        const pid = Number(readFileSync(path, 'utf8'));
        if (Number.isSafeInteger(pid) && pid > 0) {
          try {
            process.kill(pid, 0);
          } catch (probe) {
            stale = probe.code === 'ESRCH';
          }
        }
      } catch {
        /* An unreadable owner lock must not be bypassed. */
      }
      if (!stale)
        throw imageryError(
          'owner_busy',
          'Another local Sentinel-2 acquisition owner is active. Close it before retrying.',
        );
      try {
        unlinkSync(path);
      } catch {
        throw imageryError(
          'owner_unavailable',
          'The previous Sentinel-2 owner lock cannot be recovered safely.',
        );
      }
    }
  }
  throw imageryError(
    'owner_unavailable',
    'The local Sentinel-2 owner cannot be initialized safely.',
  );
}

export function createCdseMiddleware(options = {}) {
  const env = options.env ?? process.env;
  const root =
    options.root ?? resolve(process.cwd(), '.gev-cache/custom-recent-imagery');
  let owner = options.owner ?? OWNERS.get(resolve(root)) ?? null;
  const configured = () =>
    Boolean(env.CDSE_CLIENT_ID?.trim() && env.CDSE_CLIENT_SECRET?.trim());
  const usage = () =>
    owner ? owner.usage() : passiveUsage(root, configured());
  function acquireOwner() {
    if (!configured())
      throw imageryError(
        'missing_configuration',
        'Create a free CDSE account and OAuth client, then set CDSE_CLIENT_ID and CDSE_CLIENT_SECRET in the local gitignored .env.',
      );
    if (!owner) {
      const identity = resolve(root);
      owner = OWNERS.get(identity);
      if (!owner) {
        claimOwner(identity);
        try {
          owner = createCdseOwner({ ...options, root, env });
          OWNERS.set(identity, owner);
        } catch (error) {
          try {
            unlinkSync(join(identity, 'owner.lock'));
          } catch {
            /* no-op */
          }
          throw error;
        }
      }
    }
    return owner;
  }
  return sameSiteGated(async (req, res, next) => {
    if (!localSocket(req))
      return json(res, 403, {
        code: 'localhost_required',
        error: 'Recent Imagery is restricted to localhost.',
      });
    const raw = String(req.url ?? '');
    const path = raw.startsWith(PREFIX) ? raw.slice(PREFIX.length) : raw;
    if (!['/usage', '/catalog', '/image'].includes(path)) {
      if (
        next &&
        !raw.startsWith(PREFIX) &&
        !path.startsWith('/usage') &&
        !path.startsWith('/catalog') &&
        !path.startsWith('/image')
      )
        return next();
      return json(res, 404, {
        code: 'invalid_route',
        error: 'Unknown imagery endpoint; query strings are not accepted.',
      });
    }
    if (
      (path === '/usage' && req.method !== 'GET') ||
      (path !== '/usage' && req.method !== 'POST')
    )
      return json(res, 405, {
        code: 'method_not_allowed',
        error: 'Method not allowed.',
      });
    if (path === '/usage') return json(res, 200, usage());
    const controller = new AbortController();
    const cancelled = () => {
      if (!res.writableEnded) controller.abort();
    };
    req.on?.('aborted', cancelled);
    res.on?.('close', cancelled);
    let responseImage = null;
    try {
      const input = await readBody(req);
      const current = acquireOwner();
      if (path === '/catalog')
        return json(
          res,
          200,
          await current.catalog(input, { signal: controller.signal }),
        );
      const image = await current.image(input, { signal: controller.signal });
      responseImage = image;
      if (controller.signal.aborted) return;
      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        image.release?.();
        res.off?.('finish', release);
        res.off?.('close', release);
      };
      res.once?.('finish', release);
      res.once?.('close', release);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-GEV-Imagery', JSON.stringify(image.metadata));
      res.end(image.bytes);
      // Node may retain the response Buffer after end() while a slow socket is
      // draining. finish/close owns this lease from here, including cache hits.
      responseImage = null;
    } catch (error) {
      if (controller.signal.aborted) return;
      const known =
        typeof error.code === 'string' && Number.isInteger(error.status);
      const message = known
        ? error.message
        : 'Sentinel-2 request could not be completed safely.';
      json(res, known ? error.status : 503, {
        code: known ? error.code : 'provider_unavailable',
        error: message,
        reason: message,
        ...(known &&
        ['oauth', 'catalog', 'process'].includes(error.providerStage)
          ? {
              providerStage: error.providerStage,
              ...(Number.isInteger(error.providerStatus) &&
              error.providerStatus >= 100 &&
              error.providerStatus <= 599
                ? { providerStatus: error.providerStatus }
                : {}),
            }
          : {}),
        usage: usage(),
      });
    } finally {
      responseImage?.release?.();
      req.off?.('aborted', cancelled);
      res.off?.('close', cancelled);
    }
  });
}

export function cdseRecentImageryProxy(options = {}) {
  const middleware = createCdseMiddleware(options);
  const install = (server) => {
    server.middlewares.use(PREFIX, middleware);
  };
  return {
    name: 'custom-cdse-recent-imagery',
    configureServer: install,
    configurePreviewServer: install,
  };
}
