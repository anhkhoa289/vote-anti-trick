import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils'
import { includeVoteCount } from '@/lib/prisma-queries'

// GET /api/infrastructures/[id] - Get a specific infrastructure
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const infrastructure = await prisma.infrastructure.findUnique({
      where: { id },
      include: includeVoteCount
    })

    if (!infrastructure) {
      return createErrorResponse({
        message: 'Infrastructure not found',
        status: 404
      })
    }

    return createSuccessResponse(infrastructure)
  } catch (error) {
    return createErrorResponse({
      message: 'Failed to fetch infrastructure',
      status: 500,
      logMessage: 'Error fetching infrastructure',
      error
    })
  }
}
