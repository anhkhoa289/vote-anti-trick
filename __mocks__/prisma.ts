import { mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaClient } from '../prisma/generated/client'

// Create a deep mock of PrismaClient
export const prismaMock = mockDeep<PrismaClient>()

// Reset the mock before each test
beforeEach(() => {
  mockReset(prismaMock)
})

// Export mock instance
export const prisma = prismaMock as unknown as PrismaClient
