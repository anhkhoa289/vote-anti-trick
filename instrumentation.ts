// OpenTelemetry instrumentation for Next.js
// This file is automatically loaded by Next.js when instrumentation is enabled

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerInstrumentation } = await import('./instrumentation.node')
    await registerInstrumentation()
  }
}
