/**
 * Centralized logging utility to replace console.error usage
 * This helps maintain consistent logging and avoid SonarQube code smells
 */

type LogLevel = 'info' | 'warn' | 'error'

class Logger {
  private log(level: LogLevel, message: string, error?: unknown): void {
    const timestamp = new Date().toISOString()
    const errorDetails = error instanceof Error ? error.message : String(error)

    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`

    if (level === 'error') {
      // eslint-disable-next-line no-console
      console.error(logMessage, errorDetails)
    } else if (level === 'warn') {
      // eslint-disable-next-line no-console
      console.warn(logMessage, errorDetails)
    } else {
      // eslint-disable-next-line no-console
      console.log(logMessage, errorDetails)
    }
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data)
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data)
  }

  error(message: string, error?: unknown): void {
    this.log('error', message, error)
  }
}

export const logger = new Logger()
