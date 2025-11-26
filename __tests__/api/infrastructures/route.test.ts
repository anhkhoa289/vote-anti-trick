import { GET, POST } from '@/app/api/infrastructures/route'
import { NextRequest } from 'next/server'

// Mock the Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    infrastructure: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'

describe('/api/infrastructures', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return all infrastructures with vote counts', async () => {
      const mockInfrastructures = [
        {
          id: '1',
          name: 'Docker',
          description: 'Container platform',
          imageUrl: 'https://example.com/docker.png',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          _count: { votes: 5 },
        },
        {
          id: '2',
          name: 'Kubernetes',
          description: 'Container orchestration',
          imageUrl: null,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
          _count: { votes: 3 },
        },
      ]

      const expectedResponse = [
        {
          id: '1',
          name: 'Docker',
          description: 'Container platform',
          imageUrl: 'https://example.com/docker.png',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          _count: { votes: 5 },
        },
        {
          id: '2',
          name: 'Kubernetes',
          description: 'Container orchestration',
          imageUrl: null,
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
          _count: { votes: 3 },
        },
      ]

      ;(prisma.infrastructure.findMany as jest.Mock).mockResolvedValue(
        mockInfrastructures
      )

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(expectedResponse)
      expect(prisma.infrastructure.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: { votes: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    })

    it('should return empty array when no infrastructures exist', async () => {
      ;(prisma.infrastructure.findMany as jest.Mock).mockResolvedValue([])

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })

    it('should return 500 error when database query fails', async () => {
      const mockError = new Error('Database connection failed')
      ;(prisma.infrastructure.findMany as jest.Mock).mockRejectedValue(
        mockError
      )

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation()

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch infrastructures' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching infrastructures:',
        mockError
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('POST', () => {
    it('should create a new infrastructure with all fields', async () => {
      const mockInfrastructure = {
        id: '1',
        name: 'Docker',
        description: 'Container platform',
        imageUrl: 'https://example.com/docker.png',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      ;(prisma.infrastructure.create as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )

      const requestBody = {
        name: 'Docker',
        description: 'Container platform',
        imageUrl: 'https://example.com/docker.png',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual({
        id: '1',
        name: 'Docker',
        description: 'Container platform',
        imageUrl: 'https://example.com/docker.png',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      })
      expect(prisma.infrastructure.create).toHaveBeenCalledWith({
        data: {
          name: 'Docker',
          description: 'Container platform',
          imageUrl: 'https://example.com/docker.png',
        },
      })
    })

    it('should create infrastructure without imageUrl', async () => {
      const mockInfrastructure = {
        id: '2',
        name: 'Kubernetes',
        description: 'Container orchestration',
        imageUrl: null,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      }

      ;(prisma.infrastructure.create as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )

      const requestBody = {
        name: 'Kubernetes',
        description: 'Container orchestration',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual({
        id: '2',
        name: 'Kubernetes',
        description: 'Container orchestration',
        imageUrl: null,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      })
      expect(prisma.infrastructure.create).toHaveBeenCalledWith({
        data: {
          name: 'Kubernetes',
          description: 'Container orchestration',
          imageUrl: null,
        },
      })
    })

    it('should return 400 error when name is missing', async () => {
      const requestBody = {
        description: 'Container platform',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Name and description are required' })
      expect(prisma.infrastructure.create).not.toHaveBeenCalled()
    })

    it('should return 400 error when description is missing', async () => {
      const requestBody = {
        name: 'Docker',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Name and description are required' })
      expect(prisma.infrastructure.create).not.toHaveBeenCalled()
    })

    it('should return 400 error when both name and description are missing', async () => {
      const requestBody = {
        imageUrl: 'https://example.com/image.png',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Name and description are required' })
      expect(prisma.infrastructure.create).not.toHaveBeenCalled()
    })

    it('should return 500 error when database create fails', async () => {
      const mockError = new Error('Database constraint violation')
      ;(prisma.infrastructure.create as jest.Mock).mockRejectedValue(mockError)

      const requestBody = {
        name: 'Docker',
        description: 'Container platform',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation()

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create infrastructure' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error creating infrastructure:',
        mockError
      )

      consoleErrorSpy.mockRestore()
    })

    it('should handle empty string values correctly', async () => {
      const requestBody = {
        name: '',
        description: 'Valid description',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Name and description are required' })
      expect(prisma.infrastructure.create).not.toHaveBeenCalled()
    })
  })
})
