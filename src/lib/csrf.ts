import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

/**
 * CSRF token generation and validation
 */

const CSRF_TOKEN_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generates a new CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Gets the current CSRF token from cookies or generates a new one
 */
export async function getCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  let token = cookieStore.get(CSRF_TOKEN_NAME)?.value;

  if (!token) {
    token = generateCsrfToken();
    cookieStore.set(CSRF_TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  return token;
}

/**
 * Validates a CSRF token from the request
 * @param request The request object
 * @returns true if valid, false otherwise
 */
export async function validateCsrfToken(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) {
    return false;
  }

  return cookieToken === headerToken;
}

/**
 * Middleware to validate CSRF token for POST/PUT/DELETE requests
 * @param request The request object
 * @returns Response if invalid, null if valid
 */
export async function csrfProtection(request: Request): Promise<Response | null> {
  // Only protect state-changing methods
  const protectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  
  if (!protectedMethods.includes(request.method)) {
    return null; // No protection needed
  }

  const isValid = await validateCsrfToken(request);
  
  if (!isValid) {
    return new Response(
      JSON.stringify({
        error: 'Invalid CSRF token',
        code: 'CSRF_TOKEN_INVALID',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return null; // Valid token
}

