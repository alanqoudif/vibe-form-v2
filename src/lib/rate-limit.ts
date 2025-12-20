/**
 * Rate limiting utility for API routes
 * Uses in-memory store (can be upgraded to Redis for production)
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (clears on server restart)
// For production, consider using Redis or a persistent store
const store: RateLimitStore = {};

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // Clean up every minute

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  identifier?: (request: Request) => string; // Custom identifier function
}

/**
 * Rate limit middleware
 * @param options Rate limit configuration
 * @returns Response if rate limit exceeded, null otherwise
 */
export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    maxRequests,
    identifier = (req) => {
      // Default: use IP address
      const forwarded = req.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
      return ip;
    },
  } = options;

  return (request: Request): Response | null => {
    const key = identifier(request);
    const now = Date.now();

    // Get or create entry
    let entry = store[key];

    if (!entry || entry.resetTime < now) {
      // Create new entry or reset expired one
      entry = {
        count: 1,
        resetTime: now + windowMs,
      };
      store[key] = entry;
      return null; // Not rate limited
    }

    // Increment count
    entry.count++;

    if (entry.count > maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
          },
        }
      );
    }

    // Update store
    store[key] = entry;
    return null; // Not rate limited
  };
}

/**
 * Pre-configured rate limiters
 */
export const rateLimiters = {
  // Strict rate limit for AI endpoints (expensive operations)
  ai: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 requests per minute
  }),

  // Standard rate limit for API endpoints
  api: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  }),

  // Lenient rate limit for general endpoints
  general: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  }),
};

