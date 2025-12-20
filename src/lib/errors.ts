/**
 * Custom error classes for better error handling
 * These provide safe error messages that don't expose sensitive information
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string[] | undefined>) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', public retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    message: string = 'External service error',
    public service?: string
  ) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR');
  }
}

/**
 * Safe error response formatter
 * Prevents leaking sensitive information in production
 */
export function formatErrorResponse(error: unknown): {
  error: string;
  code?: string;
  statusCode: number;
} {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    // In production, don't expose internal error messages
    const isProduction = process.env.NODE_ENV === 'production';
    return {
      error: isProduction ? 'An unexpected error occurred' : error.message,
      statusCode: 500,
    };
  }

  return {
    error: 'An unexpected error occurred',
    statusCode: 500,
  };
}

