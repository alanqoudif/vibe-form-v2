/**
 * API timeout utility
 * Helps prevent long-running requests from exceeding Netlify function timeouts
 */

export class TimeoutError extends Error {
  constructor(message: string = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Creates a promise that rejects after a timeout
 */
function createTimeout(timeoutMs: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
}

/**
 * Wraps a promise with a timeout
 * @param promise The promise to wrap
 * @param timeoutMs Timeout in milliseconds
 * @returns The result of the promise or throws TimeoutError
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([promise, createTimeout(timeoutMs)]);
}

/**
 * Netlify function timeout limits
 * Free tier: 10 seconds
 * Paid tier: 26 seconds
 * We use 8 seconds for free tier to leave buffer for response processing
 */
export const NETLIFY_TIMEOUTS = {
  FREE_TIER: 8000, // 8 seconds (with 2s buffer)
  PAID_TIER: 24000, // 24 seconds (with 2s buffer)
  DEFAULT: 8000, // Default to free tier
} as const;

/**
 * Gets the appropriate timeout based on environment
 * Can be configured via NETLIFY_FUNCTION_TIMEOUT env var
 */
export function getNetlifyTimeout(): number {
  const envTimeout = process.env.NETLIFY_FUNCTION_TIMEOUT;
  if (envTimeout) {
    const parsed = parseInt(envTimeout, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  // Default to free tier timeout
  return NETLIFY_TIMEOUTS.DEFAULT;
}

