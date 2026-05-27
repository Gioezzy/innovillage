/**
 * Rate Limiter Service
 * 
 * Implements in-memory rate limiting for order creation to prevent abuse.
 * Tracks order creation attempts per user within a sliding time window.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxRequests: number = 10, windowMs: number = 60 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    // Start cleanup interval to remove expired entries
    this.startCleanup();
  }

  /**
   * Check if a user has exceeded the rate limit
   * @param userId - The user ID to check
   * @returns Object with allowed status and remaining attempts
   */
  checkLimit(userId: string): { allowed: boolean; remaining: number; resetAt: Date } {
    const now = Date.now();
    const entry = this.limits.get(userId);

    // No previous entry or window expired - allow and create new entry
    if (!entry || now - entry.windowStart >= this.windowMs) {
      this.limits.set(userId, {
        count: 1,
        windowStart: now,
      });
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetAt: new Date(now + this.windowMs),
      };
    }

    // Within the window - check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(entry.windowStart + this.windowMs),
      };
    }

    // Increment count and allow
    entry.count += 1;
    this.limits.set(userId, entry);

    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetAt: new Date(entry.windowStart + this.windowMs),
    };
  }

  /**
   * Reset rate limit for a specific user (useful for testing or admin override)
   * @param userId - The user ID to reset
   */
  reset(userId: string): void {
    this.limits.delete(userId);
  }

  /**
   * Get current rate limit status for a user without incrementing
   * @param userId - The user ID to check
   */
  getStatus(userId: string): { count: number; remaining: number; resetAt: Date | null } {
    const now = Date.now();
    const entry = this.limits.get(userId);

    if (!entry || now - entry.windowStart >= this.windowMs) {
      return {
        count: 0,
        remaining: this.maxRequests,
        resetAt: null,
      };
    }

    return {
      count: entry.count,
      remaining: Math.max(0, this.maxRequests - entry.count),
      resetAt: new Date(entry.windowStart + this.windowMs),
    };
  }

  /**
   * Start periodic cleanup of expired entries to prevent memory leaks
   */
  private startCleanup(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const expiredKeys: string[] = [];

      for (const [userId, entry] of this.limits.entries()) {
        if (now - entry.windowStart >= this.windowMs) {
          expiredKeys.push(userId);
        }
      }

      expiredKeys.forEach(key => this.limits.delete(key));

      if (expiredKeys.length > 0) {
        console.log(`[RateLimiter] Cleaned up ${expiredKeys.length} expired entries`);
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Stop the cleanup interval (useful for testing or shutdown)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Get total number of tracked users
   */
  getTrackedUsersCount(): number {
    return this.limits.size;
  }
}

// Singleton instance for order creation rate limiting
// Default: 10 orders per user per hour
export const orderRateLimiter = new RateLimiter(10, 60 * 60 * 1000);

/**
 * Check if a user can create an order based on rate limits
 * @param userId - The user ID to check
 * @returns Result object with allowed status and details
 */
export function checkOrderRateLimit(userId: string): {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  message?: string;
} {
  const result = orderRateLimiter.checkLimit(userId);

  if (!result.allowed) {
    const resetTime = result.resetAt.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      ...result,
      message: `Anda telah mencapai batas maksimal pembuatan pesanan (${orderRateLimiter['maxRequests']} pesanan per jam). Silakan coba lagi setelah ${resetTime}.`,
    };
  }

  return result;
}

/**
 * Get current rate limit status for a user
 * @param userId - The user ID to check
 */
export function getOrderRateLimitStatus(userId: string) {
  return orderRateLimiter.getStatus(userId);
}

/**
 * Reset rate limit for a user (admin function)
 * @param userId - The user ID to reset
 */
export function resetOrderRateLimit(userId: string): void {
  orderRateLimiter.reset(userId);
}
