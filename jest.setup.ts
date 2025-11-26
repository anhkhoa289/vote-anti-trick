// Jest setup file for additional configuration
// This file runs before each test suite

// Mock environment variables if needed
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
