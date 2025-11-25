import { NextRequest, NextResponse } from 'next/server'
import { trace, context, SpanStatusCode } from '@opentelemetry/api'
import logger, { createLogger } from './logger'
import { handleError, AppError } from './errors'

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Extract IP address from request
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Log incoming request with context
 */
export function logRequest(request: NextRequest, requestId: string) {
  const requestLogger = createLogger({
    requestId,
    method: request.method,
    url: request.url,
    ip: getClientIp(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
  })

  requestLogger.info('Incoming request')
  return requestLogger
}

/**
 * Log response with metrics
 */
export function logResponse(
  requestLogger: ReturnType<typeof createLogger>,
  response: NextResponse,
  startTime: number
) {
  const duration = Date.now() - startTime
  requestLogger.info(
    {
      statusCode: response.status,
      duration,
    },
    'Request completed'
  )
}

/**
 * Wrapper for API routes with logging, tracing, and error handling
 */
export function withObservability<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  operationName: string
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const startTime = Date.now()
    const requestId = generateRequestId()
    const requestLogger = logRequest(request, requestId)

    // Get tracer
    const tracer = trace.getTracer('vote-anti-trick')

    // Create span for this operation
    return tracer.startActiveSpan(operationName, async (span) => {
      try {
        // Add span attributes
        span.setAttributes({
          'http.method': request.method,
          'http.url': request.url,
          'http.request_id': requestId,
          'http.client_ip': getClientIp(request),
        })

        // Execute handler
        const response = await handler(request, ...args)

        // Log successful response
        logResponse(requestLogger, response, startTime)

        // Set span status
        span.setStatus({ code: SpanStatusCode.OK })
        span.setAttribute('http.status_code', response.status)

        return response
      } catch (error) {
        // Handle error
        const errorDetails = handleError(error, {
          requestId,
          method: request.method,
          url: request.url,
        })

        // Set span error status
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: errorDetails.message,
        })
        span.recordException(error as Error)
        span.setAttribute('http.status_code', errorDetails.statusCode)

        // Log error response
        requestLogger.error(
          {
            statusCode: errorDetails.statusCode,
            duration: Date.now() - startTime,
            error: errorDetails.message,
          },
          'Request failed'
        )

        // Return error response
        return NextResponse.json(
          {
            error: errorDetails.message,
            requestId,
          },
          { status: errorDetails.statusCode }
        )
      } finally {
        span.end()
      }
    })
  }
}

/**
 * Measure execution time of a function
 */
export async function measureTime<T>(
  fn: () => Promise<T>,
  operationName: string,
  context?: Record<string, unknown>
): Promise<T> {
  const startTime = Date.now()
  const operationLogger = createLogger({
    operation: operationName,
    ...context,
  })

  try {
    operationLogger.debug(`Starting operation: ${operationName}`)
    const result = await fn()
    const duration = Date.now() - startTime
    operationLogger.info({ duration }, `Operation completed: ${operationName}`)
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    operationLogger.error(
      { duration, error },
      `Operation failed: ${operationName}`
    )
    throw error
  }
}
