// Tiny in-memory rate limiter. Acceptable for our single-region deploy;
// swap for a KV store if we ever scale out.

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

type Entry = { times: number[] };

const BUCKET = new Map<string, Entry>();

/**
 * Allow up to `max` requests per `windowMs` for a given key.
 * Returns `{ ok: true }` if the request is allowed, or `{ ok: false, retryAfter }`.
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number,
  now = Date.now(),
): RateLimitResult {
  const cutoff = now - windowMs;
  const entry = BUCKET.get(key) ?? { times: [] };
  // drop old
  entry.times = entry.times.filter((t) => t > cutoff);
  if (entry.times.length >= max) {
    const retryAfter = Math.ceil((entry.times[0] + windowMs - now) / 1000);
    BUCKET.set(key, entry);
    return { ok: false, retryAfter: Math.max(1, retryAfter) };
  }
  entry.times.push(now);
  BUCKET.set(key, entry);
  return { ok: true };
}

/** For tests only. */
export function __resetRateLimit() {
  BUCKET.clear();
}
