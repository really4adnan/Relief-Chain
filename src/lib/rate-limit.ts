/**
 * Fixed-window in-memory rate limiter for API routes.
 * Suitable for a single-instance deployment (Vercel serverless / one Node process).
 * For multi-region production, swap for a Redis-backed limiter — interface stays the same.
 */

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** Simple timestamp check: reject forms submitted suspiciously fast (bots). */
export function tooFast(submittedAt: number, minMs = 2500): boolean {
  return Date.now() - submittedAt < minMs;
}
