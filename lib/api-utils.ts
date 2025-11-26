import { NextResponse } from 'next/server'
import { logger } from './logger'

/**
 * Centralized API utilities to reduce code duplication
 */

export interface ApiError {
  error: string
}

export interface ApiErrorOptions {
  message: string
  status: number
  logMessage?: string
  error?: unknown
}

/**
 * Creates a standardized error response with logging
 */
export function createErrorResponse(options: ApiErrorOptions): NextResponse<ApiError> {
  const { message, status, logMessage, error } = options

  if (logMessage) {
    logger.error(logMessage, error)
  }

  return NextResponse.json(
    { error: message },
    { status }
  )
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status })
}

/**
 * Extracts IP address from request headers
 */
export function getIpAddress(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Validates required fields in request body
 */
export function validateRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[]
): string | null {
  for (const field of requiredFields) {
    if (!body[field] || (typeof body[field] === 'string' && !String(body[field]).trim())) {
      return `${field} is required`
    }
  }
  return null
}
