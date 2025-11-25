import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withObservability, measureTime } from '@/lib/middleware'
import { NotFoundError } from '@/lib/errors'
import logger from '@/lib/logger'

// GET /api/infrastructures/[id] - Get a specific infrastructure
async function getInfrastructure(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const infrastructure = await measureTime(
    async () => {
      return prisma.infrastructure.findUnique({
        where: { id },
        include: {
          _count: {
            select: { votes: true }
          }
        }
      })
    },
    'prisma.infrastructure.findUnique',
    { infrastructureId: id }
  )

  if (!infrastructure) {
    throw new NotFoundError('Infrastructure not found', { infrastructureId: id })
  }

  logger.info({ infrastructureId: id, name: infrastructure.name }, 'Fetched infrastructure')
  return NextResponse.json(infrastructure)
}

export const GET = withObservability(getInfrastructure, 'GET /api/infrastructures/[id]')
