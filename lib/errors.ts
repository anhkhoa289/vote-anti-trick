import logger from './logger'

/**
 * Custom error class with additional context
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly context?: Record<string, unknown>

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = context

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Error handler that logs and optionally sends to external monitoring
 */
export function handleError(error: unknown, context?: Record<string, unknown>) {
  const errorDetails = {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    statusCode: error instanceof AppError ? error.statusCode : 500,
    isOperational: error instanceof AppError ? error.isOperational : false,
    context: {
      ...(error instanceof AppError ? error.context : {}),
      ...context,
    },
  }

  // Log error with appropriate level
  if (error instanceof AppError && error.isOperational) {
    logger.warn(errorDetails, 'Operational error occurred')
  } else {
    logger.error(errorDetails, 'Unexpected error occurred')
  }

  return errorDetails
}

/**
 * Common HTTP error classes
 */
export class BadRequestError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 400, true, context)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 404, true, context)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 401, true, context)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 403, true, context)
  }
}

export class InternalServerError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 500, false, context)
  }
}
