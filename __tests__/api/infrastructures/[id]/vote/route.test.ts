import { POST } from '@/app/api/infrastructures/[id]/vote/route'
import { NextRequest } from 'next/server'

// Mock the Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    infrastructure: {
      findUnique: jest.fn(),
    },
    vote: {
      create: jest.fn(),
      count: jest.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'

describe('/api/infrastructures/[id]/vote', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should create a vote with all fields and return vote count', async () => {
      const mockInfrastructure = {
        id: '123',
        name: 'Docker',
        description: 'Container platform',
        imageUrl: 'https://example.com/docker.png',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      const mockVote = {
        id: 'vote-1',
        infrastructureId: '123',
        voterName: 'John Doe',
        voterEmail: 'john@example.com',
        ipAddress: '192.168.1.1',
        createdAt: new Date('2024-01-01'),
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )
      ;(prisma.vote.create as jest.Mock).mockResolvedValue(mockVote)
      ;(prisma.vote.count as jest.Mock).mockResolvedValue(6)

      const requestBody = {
        voterName: 'John Doe',
        voterEmail: 'john@example.com',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'x-forwarded-for') return '192.168.1.1'
            return null
          }),
        },
      } as unknown as NextRequest

      const params = Promise.resolve({ id: '123' })

      const response = await POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual({
        vote: {
          id: 'vote-1',
          infrastructureId: '123',
          voterName: 'John Doe',
          voterEmail: 'john@example.com',
          ipAddress: '192.168.1.1',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        totalVotes: 6,
      })

      expect(prisma.infrastructure.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      })
      expect(prisma.vote.create).toHaveBeenCalledWith({
        data: {
          infrastructureId: '123',
          voterName: 'John Doe',
          voterEmail: 'john@example.com',
          ipAddress: '192.168.1.1',
        },
      })
      expect(prisma.vote.count).toHaveBeenCalledWith({
        where: { infrastructureId: '123' },
      })
    })

    it('should create vote without optional fields', async () => {
      const mockInfrastructure = {
        id: '456',
        name: 'Kubernetes',
        description: 'Container orchestration',
        imageUrl: null,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      }

      const mockVote = {
        id: 'vote-2',
        infrastructureId: '456',
        voterName: null,
        voterEmail: null,
        ipAddress: '10.0.0.1',
        createdAt: new Date('2024-01-02'),
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )
      ;(prisma.vote.create as jest.Mock).mockResolvedValue(mockVote)
      ;(prisma.vote.count as jest.Mock).mockResolvedValue(1)

      const requestBody = {}

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'x-real-ip') return '10.0.0.1'
            return null
          }),
        },
      } as unknown as NextRequest

      const params = Promise.resolve({ id: '456' })

      const response = await POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual({
        vote: {
          id: 'vote-2',
          infrastructureId: '456',
          voterName: null,
          voterEmail: null,
          ipAddress: '10.0.0.1',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
        totalVotes: 1,
      })
      expect(prisma.vote.create).toHaveBeenCalledWith({
        data: {
          infrastructureId: '456',
          voterName: null,
          voterEmail: null,
          ipAddress: '10.0.0.1',
        },
      })
    })

    it('should use x-forwarded-for header for IP address', async () => {
      const mockInfrastructure = {
        id: '789',
        name: 'Terraform',
        description: 'IaC tool',
        imageUrl: null,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      }

      const mockVote = {
        id: 'vote-3',
        infrastructureId: '789',
        voterName: null,
        voterEmail: null,
        ipAddress: '203.0.113.1',
        createdAt: new Date('2024-01-03'),
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )
      ;(prisma.vote.create as jest.Mock).mockResolvedValue(mockVote)
      ;(prisma.vote.count as jest.Mock).mockResolvedValue(1)

      const requestBody = {}

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'x-forwarded-for') return '203.0.113.1'
            if (header === 'x-real-ip') return '10.0.0.1'
            return null
          }),
        },
      } as unknown as NextRequest

      const params = Promise.resolve({ id: '789' })

      const response = await POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.vote.ipAddress).toBe('203.0.113.1')
    })

    it('should use x-real-ip header when x-forwarded-for is not available', async () => {
      const mockInfrastructure = {
        id: '789',
        name: 'Terraform',
        description: 'IaC tool',
        imageUrl: null,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      }

      const mockVote = {
        id: 'vote-4',
        infrastructureId: '789',
        voterName: null,
        voterEmail: null,
        ipAddress: '172.16.0.1',
        createdAt: new Date('2024-01-03'),
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )
      ;(prisma.vote.create as jest.Mock).mockResolvedValue(mockVote)
      ;(prisma.vote.count as jest.Mock).mockResolvedValue(1)

      const requestBody = {}

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'x-real-ip') return '172.16.0.1'
            return null
          }),
        },
      } as unknown as NextRequest

      const params = Promise.resolve({ id: '789' })

      const response = await POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.vote.ipAddress).toBe('172.16.0.1')
    })

    it('should use "unknown" when no IP headers are available', async () => {
      const mockInfrastructure = {
        id: '999',
        name: 'Ansible',
        description: 'Automation',
        imageUrl: null,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      }

      const mockVote = {
        id: 'vote-5',
        infrastructureId: '999',
        voterName: null,
        voterEmail: null,
        ipAddress: 'unknown',
        createdAt: new Date('2024-01-04'),
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )
      ;(prisma.vote.create as jest.Mock).mockResolvedValue(mockVote)
      ;(prisma.vote.count as jest.Mock).mockResolvedValue(1)

      const requestBody = {}

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
        headers: {
          get: jest.fn(() => null),
        },
      } as unknown as NextRequest

      const params = Promise.resolve({ id: '999' })

      const response = await POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.vote.ipAddress).toBe('unknown')
      expect(prisma.vote.create).toHaveBeenCalledWith({
        data: {
          infrastructureId: '999',
          voterName: null,
          voterEmail: null,
          ipAddress: 'unknown',
        },
      })
    })

    it('should return 404 error when infrastructure not found', async () => {
      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(null)

      const requestBody = {
        voterName: 'John Doe',
        voterEmail: 'john@example.com',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
        headers: {
          get: jest.fn(() => null),
        },
      } as unknown as NextRequest

      const params = Promise.resolve({ id: 'nonexistent' })

      const response = await POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Infrastructure not found' })
      expect(prisma.vote.create).not.toHaveBeenCalled()
      expect(prisma.vote.count).not.toHaveBeenCalled()
    })

    it('should return 500 error when vote creation fails', async () => {
      const mockInfrastructure = {
        id: '123',
        name: 'Docker',
        description: 'Container platform',
        imageUrl: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )

      const mockError = new Error('Database constraint violation')
      ;(prisma.vote.create as jest.Mock).mockRejectedValue(mockError)

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation()

      const requestBody = {
        voterName: 'John Doe',
        voterEmail: 'john@example.com',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
        headers: {
          get: jest.fn(() => null),
        },
      } as unknown as NextRequest

      const params = Promise.resolve({ id: '123' })

      const response = await POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create vote' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error creating vote:',
        mockError
      )

      consoleErrorSpy.mockRestore()
    })

    it('should handle multiple votes for same infrastructure', async () => {
      const mockInfrastructure = {
        id: '123',
        name: 'Docker',
        description: 'Container platform',
        imageUrl: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      const mockVote = {
        id: 'vote-6',
        infrastructureId: '123',
        voterName: 'Jane Smith',
        voterEmail: 'jane@example.com',
        ipAddress: '192.168.1.2',
        createdAt: new Date('2024-01-05'),
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )
      ;(prisma.vote.create as jest.Mock).mockResolvedValue(mockVote)
      ;(prisma.vote.count as jest.Mock).mockResolvedValue(15)

      const requestBody = {
        voterName: 'Jane Smith',
        voterEmail: 'jane@example.com',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'x-forwarded-for') return '192.168.1.2'
            return null
          }),
        },
      } as unknown as NextRequest

      const params = Promise.resolve({ id: '123' })

      const response = await POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.totalVotes).toBe(15)
    })

    it('should handle empty string values for optional fields', async () => {
      const mockInfrastructure = {
        id: '123',
        name: 'Docker',
        description: 'Container platform',
        imageUrl: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      const mockVote = {
        id: 'vote-7',
        infrastructureId: '123',
        voterName: null,
        voterEmail: null,
        ipAddress: 'unknown',
        createdAt: new Date('2024-01-06'),
      }

      ;(prisma.infrastructure.findUnique as jest.Mock).mockResolvedValue(
        mockInfrastructure
      )
      ;(prisma.vote.create as jest.Mock).mockResolvedValue(mockVote)
      ;(prisma.vote.count as jest.Mock).mockResolvedValue(1)

      const requestBody = {
        voterName: '',
        voterEmail: '',
      }

      const request = {
        json: jest.fn().mockResolvedValue(requestBody),
        headers: {
          get: jest.fn(() => null),
        },
      } as unknown as NextRequest

      const params = Promise.resolve({ id: '123' })

      const response = await POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(prisma.vote.create).toHaveBeenCalledWith({
        data: {
          infrastructureId: '123',
          voterName: null,
          voterEmail: null,
          ipAddress: 'unknown',
        },
      })
    })
  })
})
