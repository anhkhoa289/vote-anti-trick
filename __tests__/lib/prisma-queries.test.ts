import { describe, it, expect } from '@jest/globals'
import {
  includeVoteCount,
  defaultInfrastructureOrder,
} from '@/lib/prisma-queries'

describe('prisma-queries', () => {
  describe('includeVoteCount', () => {
    it('should have correct structure for including vote count', () => {
      expect(includeVoteCount).toEqual({
        _count: {
          select: { votes: true },
        },
      })
    })

    it('should have _count property', () => {
      expect(includeVoteCount).toHaveProperty('_count')
    })

    it('should have select property within _count', () => {
      expect(includeVoteCount._count).toHaveProperty('select')
    })

    it('should select votes in _count', () => {
      expect(includeVoteCount._count.select).toHaveProperty('votes')
      expect(includeVoteCount._count.select.votes).toBe(true)
    })

    it('should be an object type', () => {
      expect(typeof includeVoteCount).toBe('object')
      expect(includeVoteCount).not.toBeNull()
    })
  })

  describe('defaultInfrastructureOrder', () => {
    it('should have correct structure for ordering by createdAt desc', () => {
      expect(defaultInfrastructureOrder).toEqual({
        createdAt: 'desc',
      })
    })

    it('should have createdAt property', () => {
      expect(defaultInfrastructureOrder).toHaveProperty('createdAt')
    })

    it('should order by descending', () => {
      expect(defaultInfrastructureOrder.createdAt).toBe('desc')
    })

    it('should order newest first', () => {
      // 'desc' means newest first (most recent createdAt timestamp first)
      expect(defaultInfrastructureOrder.createdAt).toBe('desc')
    })

    it('should be usable as Prisma orderBy parameter', () => {
      // This test verifies the structure is compatible with Prisma orderBy
      const orderBy = defaultInfrastructureOrder

      expect(typeof orderBy).toBe('object')
      expect(orderBy).not.toBeNull()
      expect(Object.keys(orderBy)).toContain('createdAt')
    })
  })

  describe('integration compatibility', () => {
    it('should export both constants', () => {
      expect(includeVoteCount).toBeDefined()
      expect(defaultInfrastructureOrder).toBeDefined()
    })

    it('should have the correct types for use in Prisma queries', () => {
      // Verify includeVoteCount can be used in a query structure
      const mockQuery = {
        include: includeVoteCount,
        orderBy: defaultInfrastructureOrder,
      }

      expect(mockQuery.include).toEqual({
        _count: {
          select: { votes: true },
        },
      })

      expect(mockQuery.orderBy).toEqual({
        createdAt: 'desc',
      })
    })

    it('should be compatible with Prisma findMany query', () => {
      // Mock a typical Prisma findMany query structure
      const queryParams = {
        include: includeVoteCount,
        orderBy: defaultInfrastructureOrder,
      }

      expect(queryParams).toEqual({
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
  })

  describe('type safety', () => {
    it('should have consistent structure for includeVoteCount', () => {
      // Verify the structure matches expected Prisma include pattern
      expect(includeVoteCount).toHaveProperty('_count')
      expect(includeVoteCount._count).toHaveProperty('select')
      expect(includeVoteCount._count.select).toHaveProperty('votes')
      expect(includeVoteCount._count.select.votes).toBe(true)
    })

    it('should have consistent structure for defaultInfrastructureOrder', () => {
      // Verify the structure matches expected Prisma orderBy pattern
      expect(defaultInfrastructureOrder).toHaveProperty('createdAt')
      expect(['asc', 'desc']).toContain(defaultInfrastructureOrder.createdAt)
    })
  })
})
