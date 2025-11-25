import pino from 'pino'

// Create logger instance with appropriate configuration
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() }
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(process.env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      }
    : {}),
  base: {
    env: process.env.NODE_ENV || 'development',
    service: 'vote-anti-trick',
  },
})

// Helper function to create child loggers with context
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context)
}

// Export default logger
export default logger
