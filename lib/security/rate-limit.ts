import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

let limiter: Ratelimit | null = null

function getLimiter() {
  if (limiter) return limiter

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Upstash rate limiting is not configured")
    }
    return null
  }

  limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "cargill:ratelimit",
  })

  return limiter
}

export async function checkRateLimit(identifier: string) {
  const currentLimiter = getLimiter()

  if (!currentLimiter) {
    return { success: true, limit: 5, remaining: 5, reset: Date.now() + 60_000 }
  }

  return currentLimiter.limit(identifier)
}
