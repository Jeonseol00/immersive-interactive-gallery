/**
 * ═══════════════════════════════════════════════════════
 * IMGAL In-Memory Rate Limiter
 * ═══════════════════════════════════════════════════════
 * 
 * IP-based sliding window rate limiter for API endpoints.
 * Uses in-memory storage — suitable for single-instance deployments.
 * For multi-instance (Vercel serverless), upgrade to Redis/Upstash.
 * 
 * Auto-cleans expired entries to prevent memory leaks.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp in ms
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired entries (every 60 seconds)
let cleanupScheduled = false;

function scheduleCleanup() {
  if (cleanupScheduled) return;
  cleanupScheduled = true;
  
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now >= entry.resetAt) {
        store.delete(key);
      }
    }
  }, 60_000);
}

/**
 * Check if a request should be rate-limited.
 * 
 * @param identifier - Unique client identifier (IP address)
 * @param limit - Maximum number of requests per window
 * @param windowMs - Window duration in milliseconds
 * @returns Object with `allowed` boolean and rate limit metadata
 */
export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60_000
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  scheduleCleanup();
  
  const now = Date.now();
  const key = `rl:${identifier}`;
  const existing = store.get(key);

  // Window expired or first request — reset counter
  if (!existing || now >= existing.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  // Within window — increment
  existing.count += 1;

  if (existing.count > limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/**
 * Extract the client IP from request headers.
 * Handles Vercel, Cloudflare, and standard proxies.
 */
export function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
