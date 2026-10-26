import {
  mkdirSync,
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  renameSync,
  unlinkSync,
  utimesSync,
  lstatSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

export const CACHE_LIMITS = Object.freeze({
  bytes: 2 * 1024 ** 3,
  lowWater: 1.8 * 1024 ** 3,
  entries: 20_000,
  ttl: 14 * 86_400_000,
});
export const cacheKey = (value) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** Only bounded processed Sentinel data is persisted; no credentials or token responses. */
export function createImageryCache({
  root,
  now = Date.now,
  limits = CACHE_LIMITS,
} = {}) {
  mkdirSync(root, { recursive: true, mode: 0o700 });
  const entries = new Map();
  const readers = new Map();
  let bytes = 0;
  let hits = 0;
  let misses = 0;
  let reducedReuse = null;
  let unsafeNamespace = false;
  function diskUsage() {
    let size = 0;
    try {
      for (const name of readdirSync(root)) {
        const info = lstatSync(join(root, name));
        if (!info.isFile()) {
          unsafeNamespace = true;
          continue;
        }
        size += info.size;
      }
    } catch {
      unsafeNamespace = true;
    }
    return size;
  }
  const remove = (key) => {
    const entry = entries.get(key);
    if (!entry || readers.has(key)) return false;
    for (const suffix of ['.json', '.bin']) {
      try {
        const path = join(root, key + suffix);
        const size = lstatSync(path).size;
        unlinkSync(path);
        bytes = Math.max(0, bytes - size);
      } catch {
        /* A retained/unreadable file remains counted against the cap. */
      }
    }
    entries.delete(key);
    return true;
  };
  // Recover stale temporary/orphan files; count both metadata and image bytes.
  for (const name of readdirSync(root)) {
    if (!/^[a-f0-9]{64}\.(json|bin)$/.test(name)) {
      if (/\.tmp$/.test(name)) {
        try {
          unlinkSync(join(root, name));
        } catch {
          /* Counted below if removal fails. */
        }
      }
      continue;
    }
    if (!name.endsWith('.json')) continue;
    const key = name.slice(0, -5);
    try {
      const record = JSON.parse(readFileSync(join(root, name), 'utf8'));
      const blobSize = statSync(join(root, `${key}.bin`)).size;
      if (
        record.version !== 1 ||
        !Number.isFinite(record.createdAt) ||
        !Number.isFinite(record.expiresAt) ||
        record.expiresAt <= now() ||
        blobSize !== record.blobBytes
      )
        throw new Error('expired');
      const size = blobSize + statSync(join(root, name)).size;
      entries.set(key, {
        ...record,
        size,
        touched: statSync(join(root, name)).mtimeMs,
      });
    } catch {
      for (const suffix of ['.json', '.bin']) {
        try {
          unlinkSync(join(root, key + suffix));
        } catch {
          /* no-op */
        }
      }
    }
  }
  for (const name of readdirSync(root)) {
    if (/^[a-f0-9]{64}\.bin$/.test(name) && !entries.has(name.slice(0, -4))) {
      try {
        unlinkSync(join(root, name));
      } catch {
        /* no-op */
      }
    }
  }
  bytes = diskUsage();
  function prune(extra = 0) {
    for (const [key, entry] of entries)
      if (entry.expiresAt <= now()) remove(key);
    if (bytes + extra > limits.bytes || entries.size >= limits.entries) {
      const target = Math.min(limits.lowWater, limits.bytes - extra);
      for (const [key] of [...entries].sort(
        (a, b) => a[1].touched - b[1].touched,
      )) {
        if (bytes <= target && entries.size < limits.entries) break;
        remove(key);
      }
    }
    return (
      !unsafeNamespace &&
      bytes + extra <= limits.bytes &&
      entries.size < limits.entries
    );
  }
  prune();
  function get(key) {
    if (!/^[a-f0-9]{64}$/.test(key)) return null;
    const entry = entries.get(key);
    if (!entry || entry.expiresAt <= now()) {
      if (entry) remove(key);
      misses++;
      return null;
    }
    readers.set(key, (readers.get(key) ?? 0) + 1);
    try {
      const value = readFileSync(join(root, `${key}.bin`));
      if (
        value.length !== entry.blobBytes ||
        createHash('sha256').update(value).digest('hex') !== entry.digest
      )
        throw new Error('cache corruption');
      hits++;
      entry.touched = now();
      try {
        utimesSync(
          join(root, `${key}.json`),
          new Date(entry.touched),
          new Date(entry.touched),
        );
      } catch {
        /* In-memory LRU still applies when access times cannot persist. */
      }
      return { bytes: value, metadata: entry.metadata };
    } catch {
      misses++;
      return null;
    } finally {
      const count = readers.get(key) - 1;
      if (count) readers.set(key, count);
      else readers.delete(key);
    }
  }
  function put(key, value, metadata, ttl = limits.ttl) {
    if (!/^[a-f0-9]{64}$/.test(key)) return false;
    const data = Buffer.isBuffer(value) ? value : Buffer.from(value);
    const createdAt = now();
    const record = {
      version: 1,
      createdAt,
      expiresAt: createdAt + Math.min(ttl, limits.ttl),
      blobBytes: data.length,
      digest: createHash('sha256').update(data).digest('hex'),
      metadata,
    };
    const json = Buffer.from(JSON.stringify(record));
    const size = data.length + json.length;
    // Reconcile every retained regular file, including orphan/temporary bytes,
    // before admission. Unknown directories/symlinks fail closed for writes.
    bytes = diskUsage();
    remove(key);
    if (!prune(size)) {
      reducedReuse =
        'Local imagery cache is full; this response will not be cached.';
      return false;
    }
    const binTemp = join(root, `${key}.${process.pid}.bin.tmp`);
    const jsonTemp = join(root, `${key}.${process.pid}.json.tmp`);
    try {
      writeFileSync(binTemp, data, { mode: 0o600 });
      writeFileSync(jsonTemp, json, { mode: 0o600 });
      renameSync(binTemp, join(root, `${key}.bin`));
      renameSync(jsonTemp, join(root, `${key}.json`));
      entries.set(key, { ...record, size, touched: createdAt });
      bytes += size;
      reducedReuse = null;
      return true;
    } catch {
      for (const path of [
        binTemp,
        jsonTemp,
        join(root, `${key}.bin`),
        join(root, `${key}.json`),
      ]) {
        try {
          unlinkSync(path);
        } catch {
          /* no-op */
        }
      }
      bytes = diskUsage();
      reducedReuse =
        'Local imagery cache is unavailable; this response will not be cached.';
      return false;
    }
  }
  return {
    get,
    put,
    summary: () => {
      prune();
      return {
        bytes,
        entries: entries.size,
        hits,
        misses,
        byteLimit: limits.bytes,
        ttlDays: limits.ttl / 86_400_000,
        reducedReuse,
      };
    },
  };
}
