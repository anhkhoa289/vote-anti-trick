# Observability Guide

This document describes the observability features implemented in the vote-anti-trick application.

## Overview

The application includes comprehensive observability features:

- **Structured Logging** using Pino
- **Distributed Tracing** using OpenTelemetry
- **Error Tracking** with custom error classes and handlers
- **Performance Monitoring** with execution time measurements
- **Request/Response Logging** with middleware

## Features

### 1. Structured Logging (Pino)

All application logs are structured JSON logs for easy parsing and analysis.

**Configuration:**
- Set `LOG_LEVEL` environment variable (options: `trace`, `debug`, `info`, `warn`, `error`, `fatal`)
- Default: `info`
- Development mode uses `pino-pretty` for human-readable console output
- Production mode outputs JSON for log aggregation tools

**Usage:**
```typescript
import logger from '@/lib/logger'

logger.info({ userId: '123', action: 'login' }, 'User logged in')
logger.error({ error: err }, 'Database connection failed')
```

**Creating Child Loggers:**
```typescript
import { createLogger } from '@/lib/logger'

const requestLogger = createLogger({ requestId: 'abc-123' })
requestLogger.info('Processing request')
```

### 2. Distributed Tracing (OpenTelemetry)

OpenTelemetry provides distributed tracing across the application.

**Configuration:**
- Set `ENABLE_OTEL_TRACING=true` to enable tracing
- Configure `OTEL_EXPORTER_OTLP_ENDPOINT` to point to your OTLP collector
- Set `OTEL_SERVICE_NAME` (default: `vote-anti-trick`)

**Supported Collectors:**
- Jaeger
- Zipkin
- Cloud providers (AWS X-Ray, Google Cloud Trace, Azure Monitor)
- Any OTLP-compatible backend

**Auto-instrumentation includes:**
- HTTP requests/responses
- PostgreSQL queries (via Prisma)
- Next.js API routes

**Example Jaeger Setup:**
```bash
# Run Jaeger locally with Docker
docker run -d --name jaeger \
  -p 4318:4318 \
  -p 16686:16686 \
  jaegertracing/all-in-one:latest

# Update .env
ENABLE_OTEL_TRACING=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
```

View traces at: http://localhost:16686

### 3. Error Tracking

Custom error classes with context and proper HTTP status codes.

**Available Error Classes:**
- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `InternalServerError` (500)

**Usage:**
```typescript
import { NotFoundError, BadRequestError } from '@/lib/errors'

// Throw with context
throw new NotFoundError('User not found', { userId: '123' })

// Error handler automatically logs and returns appropriate response
throw new BadRequestError('Invalid email format', {
  email: userInput.email
})
```

### 4. API Middleware

All API routes are wrapped with `withObservability` middleware which provides:

- Automatic request/response logging
- Distributed tracing span creation
- Error handling and formatting
- Request ID generation
- Performance timing

**Usage:**
```typescript
import { withObservability } from '@/lib/middleware'

async function myHandler(request: NextRequest) {
  // Your logic here
  return NextResponse.json({ data: 'response' })
}

export const GET = withObservability(myHandler, 'GET /api/my-route')
```

### 5. Performance Monitoring

Track execution time of critical operations.

**Usage:**
```typescript
import { measureTime } from '@/lib/middleware'

const result = await measureTime(
  async () => {
    return await prisma.user.findMany()
  },
  'prisma.user.findMany',
  { operation: 'fetch-users' }
)
```

## Log Format

### Development
```
[14:23:45 UTC] INFO: Incoming request
    requestId: "1732551825123-abc123"
    method: "GET"
    url: "http://localhost:3000/api/infrastructures"
    ip: "127.0.0.1"
```

### Production (JSON)
```json
{
  "level": "INFO",
  "time": "2025-11-25T14:23:45.123Z",
  "env": "production",
  "service": "vote-anti-trick",
  "requestId": "1732551825123-abc123",
  "method": "GET",
  "url": "http://localhost:3000/api/infrastructures",
  "ip": "127.0.0.1",
  "msg": "Incoming request"
}
```

## Monitoring Dashboards

### Log Aggregation
Export logs to:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Grafana Loki**
- **Datadog**
- **AWS CloudWatch**
- **Google Cloud Logging**

### Tracing Visualization
Use OpenTelemetry-compatible backends:
- **Jaeger** (open source)
- **Zipkin** (open source)
- **Honeycomb**
- **New Relic**
- **Datadog APM**

### Metrics
OpenTelemetry automatically exports:
- HTTP request duration
- HTTP request count
- Database query duration
- Error rates

## Best Practices

1. **Always use structured logging** - Include context objects instead of string concatenation
   ```typescript
   // Good
   logger.info({ userId, action }, 'User performed action')

   // Bad
   logger.info(`User ${userId} performed ${action}`)
   ```

2. **Use appropriate log levels**
   - `trace`: Very detailed debugging
   - `debug`: Debugging information
   - `info`: General informational messages
   - `warn`: Warning messages (operational but concerning)
   - `error`: Error events
   - `fatal`: Fatal errors requiring immediate attention

3. **Include context in errors**
   ```typescript
   throw new NotFoundError('Resource not found', {
     resourceType: 'infrastructure',
     resourceId: id
   })
   ```

4. **Use measureTime for slow operations**
   - Database queries
   - External API calls
   - Heavy computations

5. **Don't log sensitive data**
   - Passwords
   - API keys
   - Personal identification numbers
   - Credit card information

## Troubleshooting

### Logs not appearing
- Check `LOG_LEVEL` environment variable
- Ensure logger is imported correctly
- In production, check your log aggregation service

### Traces not showing in Jaeger/Zipkin
- Verify `ENABLE_OTEL_TRACING=true`
- Check `OTEL_EXPORTER_OTLP_ENDPOINT` is correct
- Ensure trace collector is running and accessible
- Check application logs for OpenTelemetry errors

### High overhead from tracing
- Reduce sampling rate in `instrumentation.node.ts`
- Disable specific instrumentations
- Use head-based sampling

## Environment Variables Reference

```bash
# Logging
LOG_LEVEL=info                    # Log verbosity level

# Tracing
ENABLE_OTEL_TRACING=false         # Enable OpenTelemetry tracing
OTEL_SERVICE_NAME=vote-anti-trick # Service name in traces
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
# OTEL_EXPORTER_OTLP_HEADERS={}   # Optional auth headers (JSON)
```

## Further Reading

- [Pino Documentation](https://getpino.io/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Jaeger Documentation](https://www.jaegertracing.io/docs/)
- [Next.js Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
