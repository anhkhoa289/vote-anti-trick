import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import {
  createErrorResponse,
  createSuccessResponse,
  getIpAddress,
  validateRequiredFields,
} from '@/lib/api-utils'
import { logger } from '@/lib/logger'

// Mock the logger
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}))

describe('api-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createErrorResponse', () => {
    it('should create error response with message and status', async () => {
      const response = createErrorResponse({
        message: 'Not found',
        status: 404,
      })

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data).toEqual({ error: 'Not found' })
      expect(logger.error).not.toHaveBeenCalled()
    })

    it('should log error when logMessage is provided', async () => {
      const response = createErrorResponse({
        message: 'Internal error',
        status: 500,
        logMessage: 'Database connection failed',
      })

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data).toEqual({ error: 'Internal error' })
      expect(logger.error).toHaveBeenCalledWith(
        'Database connection failed',
        undefined
      )
    })

    it('should log error with error object when both logMessage and error are provided', async () => {
      const error = new Error('Connection timeout')
      const response = createErrorResponse({
        message: 'Service unavailable',
        status: 503,
        logMessage: 'Failed to connect to database',
        error,
      })

      expect(response.status).toBe(503)
      const data = await response.json()
      expect(data).toEqual({ error: 'Service unavailable' })
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to connect to database',
        error
      )
    })

    it('should handle different HTTP status codes', async () => {
      const statuses = [400, 401, 403, 404, 500, 503]

      for (const status of statuses) {
        const response = createErrorResponse({
          message: `Error ${status}`,
          status,
        })

        expect(response.status).toBe(status)
        const data = await response.json()
        expect(data).toEqual({ error: `Error ${status}` })
      }
    })
  })

  describe('createSuccessResponse', () => {
    it('should create success response with default status 200', async () => {
      const data = { id: '1', name: 'Test' }
      const response = createSuccessResponse(data)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual(data)
    })

    it('should create success response with custom status', async () => {
      const data = { id: '1', name: 'Created' }
      const response = createSuccessResponse(data, 201)

      expect(response.status).toBe(201)
      const responseData = await response.json()
      expect(responseData).toEqual(data)
    })

    it('should handle different data types', async () => {
      const testCases = [
        { data: { key: 'value' }, status: 200 },
        { data: [1, 2, 3], status: 200 },
        { data: 'string response', status: 200 },
        { data: 42, status: 200 },
        { data: true, status: 200 },
        { data: null, status: 200 },
      ]

      for (const { data, status } of testCases) {
        const response = createSuccessResponse(data, status)
        expect(response.status).toBe(status)
        const responseData = await response.json()
        expect(responseData).toEqual(data)
      }
    })

    it('should handle complex nested objects', async () => {
      const complexData = {
        user: {
          id: '1',
          name: 'John',
          settings: {
            theme: 'dark',
            notifications: true,
          },
        },
        metadata: {
          timestamp: new Date('2024-01-01').toISOString(),
        },
      }

      const response = createSuccessResponse(complexData)
      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual(complexData)
    })
  })

  describe('getIpAddress', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const headers = new Headers({
        'x-forwarded-for': '192.168.1.1',
      })

      const ip = getIpAddress(headers)
      expect(ip).toBe('192.168.1.1')
    })

    it('should extract first IP from x-forwarded-for with multiple IPs', () => {
      const headers = new Headers({
        'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
      })

      const ip = getIpAddress(headers)
      expect(ip).toBe('192.168.1.1')
    })

    it('should trim whitespace from x-forwarded-for IP', () => {
      const headers = new Headers({
        'x-forwarded-for': '  192.168.1.1  ',
      })

      const ip = getIpAddress(headers)
      expect(ip).toBe('192.168.1.1')
    })

    it('should fall back to x-real-ip when x-forwarded-for is not present', () => {
      const headers = new Headers({
        'x-real-ip': '10.0.0.1',
      })

      const ip = getIpAddress(headers)
      expect(ip).toBe('10.0.0.1')
    })

    it('should prefer x-forwarded-for over x-real-ip', () => {
      const headers = new Headers({
        'x-forwarded-for': '192.168.1.1',
        'x-real-ip': '10.0.0.1',
      })

      const ip = getIpAddress(headers)
      expect(ip).toBe('192.168.1.1')
    })

    it('should return "unknown" when no IP headers are present', () => {
      const headers = new Headers()

      const ip = getIpAddress(headers)
      expect(ip).toBe('unknown')
    })

    it('should handle empty x-forwarded-for header', () => {
      const headers = new Headers({
        'x-forwarded-for': '',
        'x-real-ip': '10.0.0.1',
      })

      const ip = getIpAddress(headers)
      expect(ip).toBe('10.0.0.1')
    })

    it('should handle IPv6 addresses', () => {
      const headers = new Headers({
        'x-forwarded-for': '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      })

      const ip = getIpAddress(headers)
      expect(ip).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
    })
  })

  describe('validateRequiredFields', () => {
    it('should return null when all required fields are present', () => {
      const body = {
        name: 'John',
        email: 'john@example.com',
        age: 30,
      }

      const error = validateRequiredFields(body, ['name', 'email'])
      expect(error).toBeNull()
    })

    it('should return error message when a required field is missing', () => {
      const body = {
        name: 'John',
      }

      const error = validateRequiredFields(body, ['name', 'email'])
      expect(error).toBe('email is required')
    })

    it('should return error message when a required field is null', () => {
      const body = {
        name: 'John',
        email: null,
      }

      const error = validateRequiredFields(body, ['name', 'email'])
      expect(error).toBe('email is required')
    })

    it('should return error message when a required field is undefined', () => {
      const body = {
        name: 'John',
        email: undefined,
      }

      const error = validateRequiredFields(body, ['name', 'email'])
      expect(error).toBe('email is required')
    })

    it('should return error message when a required string field is empty', () => {
      const body = {
        name: '',
        email: 'john@example.com',
      }

      const error = validateRequiredFields(body, ['name', 'email'])
      expect(error).toBe('name is required')
    })

    it('should return error message when a required string field contains only whitespace', () => {
      const body = {
        name: '   ',
        email: 'john@example.com',
      }

      const error = validateRequiredFields(body, ['name', 'email'])
      expect(error).toBe('name is required')
    })

    it('should handle empty required fields array', () => {
      const body = {
        name: 'John',
      }

      const error = validateRequiredFields(body, [])
      expect(error).toBeNull()
    })

    it('should return first missing field when multiple fields are missing', () => {
      const body = {
        age: 30,
      }

      const error = validateRequiredFields(body, ['name', 'email', 'phone'])
      expect(error).toBe('name is required')
    })

    it('should reject numeric zero as it is falsy', () => {
      const body = {
        count: 0,
        value: 0,
      }

      const error = validateRequiredFields(body, ['count', 'value'])
      expect(error).toBe('count is required')
    })

    it('should reject boolean false as it is falsy', () => {
      const body = {
        enabled: false,
        verified: false,
      }

      const error = validateRequiredFields(body, ['enabled', 'verified'])
      expect(error).toBe('enabled is required')
    })

    it('should accept non-empty arrays and objects as valid', () => {
      const body = {
        items: [1, 2, 3],
        metadata: { key: 'value' },
      }

      const error = validateRequiredFields(body, ['items', 'metadata'])
      expect(error).toBeNull()
    })

    it('should accept empty arrays and objects as valid (they are truthy)', () => {
      const body = {
        items: [],
        metadata: {},
      }

      const error = validateRequiredFields(body, ['items', 'metadata'])
      expect(error).toBeNull()
    })

    it('should accept positive numbers as valid', () => {
      const body = {
        count: 42,
        value: 1,
      }

      const error = validateRequiredFields(body, ['count', 'value'])
      expect(error).toBeNull()
    })

    it('should accept boolean true as valid', () => {
      const body = {
        enabled: true,
        verified: true,
      }

      const error = validateRequiredFields(body, ['enabled', 'verified'])
      expect(error).toBeNull()
    })
  })
})
