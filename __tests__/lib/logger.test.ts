import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { logger } from '@/lib/logger'

// We need to test the actual logger, not a mock
// So we'll spy on console methods instead
describe('logger', () => {
  let consoleLogSpy: jest.SpiedFunction<typeof console.log>
  let consoleWarnSpy: jest.SpiedFunction<typeof console.warn>
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>

  beforeEach(() => {
    // Mock Date to have consistent timestamps in tests
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-01T12:00:00.000Z'))

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.useRealTimers()
    consoleLogSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('info', () => {
    it('should log info message with timestamp', () => {
      logger.info('Test info message')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [INFO] Test info message',
        'undefined'
      )
    })

    it('should log info message with data', () => {
      logger.info('User action', { userId: '123', action: 'login' })

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [INFO] User action',
        '[object Object]'
      )
    })

    it('should log info message with string data', () => {

      logger.info('Request received', 'GET /api/users')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [INFO] Request received',
        'GET /api/users'
      )
    })

    it('should log info message with number data', () => {

      logger.info('Processing items', 42)

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [INFO] Processing items',
        '42'
      )
    })
  })

  describe('warn', () => {
    it('should log warning message with timestamp', () => {

      logger.warn('Test warning message')

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [WARN] Test warning message',
        'undefined'
      )
    })

    it('should log warning message with data', () => {

      logger.warn('Deprecated API usage', { endpoint: '/old-api', replacement: '/new-api' })

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [WARN] Deprecated API usage',
        '[object Object]'
      )
    })

    it('should log warning message with null data', () => {

      logger.warn('Warning occurred', null)

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [WARN] Warning occurred',
        'null'
      )
    })
  })

  describe('error', () => {
    it('should log error message with timestamp', () => {

      logger.error('Test error message')

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [ERROR] Test error message',
        'undefined'
      )
    })

    it('should log error message with Error object', () => {

      const error = new Error('Something went wrong')
      logger.error('Operation failed', error)

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [ERROR] Operation failed',
        'Something went wrong'
      )
    })

    it('should log error message with custom error object', () => {

      const customError = new TypeError('Invalid type')
      logger.error('Type validation failed', customError)

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [ERROR] Type validation failed',
        'Invalid type'
      )
    })

    it('should log error message with string error', () => {

      logger.error('Database error', 'Connection timeout')

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [ERROR] Database error',
        'Connection timeout'
      )
    })

    it('should log error message with non-Error object', () => {

      logger.error('Unexpected error', { code: 500, message: 'Internal error' })

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [ERROR] Unexpected error',
        '[object Object]'
      )
    })

    it('should handle undefined error', () => {

      logger.error('Error occurred', undefined)

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [ERROR] Error occurred',
        'undefined'
      )
    })

    it('should handle null error', () => {

      logger.error('Null error', null)

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [ERROR] Null error',
        'null'
      )
    })
  })

  describe('timestamp formatting', () => {
    it('should format timestamp correctly at different times', () => {

      // Test at a different time
      jest.setSystemTime(new Date('2024-12-31T23:59:59.999Z'))

      logger.info('End of year message')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[2024-12-31T23:59:59.999Z] [INFO] End of year message',
        'undefined'
      )
    })
  })

  describe('log level formatting', () => {
    it('should format all log levels in uppercase', () => {

      logger.info('Info message')
      logger.warn('Warn message')
      logger.error('Error message')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.anything()
      )
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        expect.anything()
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.anything()
      )
    })
  })

  describe('multiple log calls', () => {
    it('should handle multiple consecutive logs correctly', () => {

      logger.info('First message')
      logger.warn('Second message')
      logger.error('Third message')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })
  })
})
