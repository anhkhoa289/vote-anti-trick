import { GET } from '@/app/api/infrastructures/[id]/route'
import { NextRequest } from 'next/server'

// Mock the Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    infrastructure: {
      findUnique: jest.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'

describe('/api/infrastructures/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return infrastructure by id with vote count', async () => {
      const mockInfrastructure = {
        id: '123',
        name: 'Docker',
        description: 'Container platform',
        imageUrl: 'https://example.com/docker.png',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        _count: { votes: 5 },
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )

      const request = {} as NextRequest
      const params = Promise.resolve({ id: '123' })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        id: '123',
        name: 'Docker',
        description: 'Container platform',
        imageUrl: 'https://example.com/docker.png',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        _count: { votes: 5 },
      })
      expect(prisma.infrastructure.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        include: {
          _count: {
            select: { votes: true },
          },
        },
      })
    })

    it('should return infrastructure with zero votes', async () => {
      const mockInfrastructure = {
        id: '456',
        name: 'Kubernetes',
        description: 'Container orchestration',
        imageUrl: null,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        _count: { votes: 0 },
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )

      const request = {} as NextRequest
      const params = Promise.resolve({ id: '456' })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        id: '456',
        name: 'Kubernetes',
        description: 'Container orchestration',
        imageUrl: null,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
        _count: { votes: 0 },
      })
    })

    it('should return 404 error when infrastructure not found', async () => {
      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(null)

      const request = {} as NextRequest
      const params = Promise.resolve({ id: 'nonexistent' })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Infrastructure not found' })
      expect(prisma.infrastructure.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
        include: {
          _count: {
            select: { votes: true },
          },
        },
      })
    })

    it('should return 500 error when database query fails', async () => {
      const mockError = new Error('Database connection failed')
      ;(prisma.infrastructure.findUnique as jest.Mock).mockRejectedValue(
        mockError
      )

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation()

      const request = {} as NextRequest
      const params = Promise.resolve({ id: '123' })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch infrastructure' })
      expect(consoleErrorSpy).toHaveBeenCalled()
      const errorCall = consoleErrorSpy.mock.calls[0]
      expect(errorCall[0]).toMatch(/\[ERROR\] Error fetching infrastructure/)
      expect(errorCall[1]).toBe('Database connection failed')

      consoleErrorSpy.mockRestore()
    })

    it('should handle UUID format ids correctly', async () => {
      const uuidId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
      const mockInfrastructure = {
        id: uuidId,
        name: 'Terraform',
        description: 'Infrastructure as Code',
        imageUrl: null,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
        _count: { votes: 2 },
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )

      const request = {} as NextRequest
      const params = Promise.resolve({ id: uuidId })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        id: uuidId,
        name: 'Terraform',
        description: 'Infrastructure as Code',
        imageUrl: null,
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z',
        _count: { votes: 2 },
      })
      expect(prisma.infrastructure.findUnique).toHaveBeenCalledWith({
        where: { id: uuidId },
        include: {
          _count: {
            select: { votes: true },
          },
        },
      })
    })

    it('should handle numeric string ids correctly', async () => {
      const mockInfrastructure = {
        id: '999',
        name: 'Ansible',
        description: 'Automation tool',
        imageUrl: 'https://example.com/ansible.png',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
        _count: { votes: 10 },
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )

      const request = {} as NextRequest
      const params = Promise.resolve({ id: '999' })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        id: '999',
        name: 'Ansible',
        description: 'Automation tool',
        imageUrl: 'https://example.com/ansible.png',
        createdAt: '2024-01-04T00:00:00.000Z',
        updatedAt: '2024-01-04T00:00:00.000Z',
        _count: { votes: 10 },
      })
    })
  })
})
