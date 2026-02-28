/**
 * Simple in-memory rate limiter for Server Actions and API routes.
 * 
 * For production at scale, replace with Redis-based (Upstash @upstash/ratelimit)
 * or Arcjet (arcjet.com). This is sufficient for MVP / low-medium traffic.
 * 
 * Usage:
 *   import { rateLimit } from '@/lib/rate-limit'
 *   const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 })
 *   const { success } = await limiter.check(10, identifier) // 10 requests per interval
 */

const tokenCache = new Map<string, { count: number; expiresAt: number }>()

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now()
        for (const [key, value] of tokenCache.entries()) {
            if (value.expiresAt < now) {
                tokenCache.delete(key)
            }
        }
    }, 5 * 60 * 1000)
}

export function rateLimit(options: {
    interval: number     // Time window in ms (e.g. 60_000 for 1 minute)
    uniqueTokenPerInterval?: number // Max unique tokens to track (memory cap)
}) {
    const { interval, uniqueTokenPerInterval = 500 } = options

    return {
        check: (limit: number, token: string): { success: boolean; remaining: number } => {
            const now = Date.now()
            const entry = tokenCache.get(token)

            if (!entry || entry.expiresAt < now) {
                // Enforce memory cap
                if (tokenCache.size >= uniqueTokenPerInterval) {
                    // Evict oldest entries
                    const firstKey = tokenCache.keys().next().value
                    if (firstKey) tokenCache.delete(firstKey)
                }

                tokenCache.set(token, { count: 1, expiresAt: now + interval })
                return { success: true, remaining: limit - 1 }
            }

            entry.count += 1

            if (entry.count > limit) {
                return { success: false, remaining: 0 }
            }

            return { success: true, remaining: limit - entry.count }
        }
    }
}

// ── Pre-configured limiters ──────────────────────────────

/** Checkout: max 5 attempts per minute per IP/user */
export const checkoutLimiter = rateLimit({ interval: 60_000 })

/** Login: max 10 attempts per minute per IP */
export const loginLimiter = rateLimit({ interval: 60_000 })

/** General API: max 30 requests per minute */
export const apiLimiter = rateLimit({ interval: 60_000 })
