import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes, defaultResource } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import logger from './lib/logger'

let sdk: NodeSDK | undefined

export async function registerInstrumentation() {
  // Skip if already initialized or if tracing is disabled
  if (sdk || process.env.ENABLE_OTEL_TRACING !== 'true') {
    if (process.env.ENABLE_OTEL_TRACING !== 'true') {
      logger.info('OpenTelemetry tracing is disabled')
    }
    return
  }

  try {
    // Create OTLP trace exporter
    const traceExporter = new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
      headers: process.env.OTEL_EXPORTER_OTLP_HEADERS
        ? JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS)
        : {},
    })

    // Create resource with service information
    const resource = defaultResource().merge(
      resourceFromAttributes({
        [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'vote-anti-trick',
        [ATTR_SERVICE_VERSION]: process.env.npm_package_version || '0.1.0',
        environment: process.env.NODE_ENV || 'development',
      })
    )

    // Initialize OpenTelemetry SDK
    sdk = new NodeSDK({
      resource,
      traceExporter,
      instrumentations: [
        getNodeAutoInstrumentations({
          // Customize instrumentation configuration
          '@opentelemetry/instrumentation-http': {
            enabled: true,
          },
          '@opentelemetry/instrumentation-pg': {
            enabled: true,
            enhancedDatabaseReporting: true,
          },
          '@opentelemetry/instrumentation-fs': {
            enabled: false, // Disable FS instrumentation to reduce noise
          },
        }),
      ],
    })

    // Start the SDK
    await sdk.start()
    logger.info('OpenTelemetry instrumentation initialized successfully')

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      try {
        await sdk?.shutdown()
        logger.info('OpenTelemetry SDK shut down successfully')
      } catch (error) {
        logger.error({ error }, 'Error shutting down OpenTelemetry SDK')
      } finally {
        process.exit(0)
      }
    })
  } catch (error) {
    logger.error({ error }, 'Failed to initialize OpenTelemetry instrumentation')
  }
}
