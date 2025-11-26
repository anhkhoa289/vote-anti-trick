import { Prisma } from '../prisma/generated/client'

/**
 * Common Prisma query patterns to reduce duplication
 */

/**
 * Include configuration for fetching infrastructure with vote count
 */
export const includeVoteCount = {
  _count: {
    select: { votes: true }
  }
} satisfies Prisma.InfrastructureInclude

/**
 * Default ordering for infrastructures (newest first)
 */
export const defaultInfrastructureOrder = {
  createdAt: 'desc'
} satisfies Prisma.InfrastructureOrderByWithRelationInput
