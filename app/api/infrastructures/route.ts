import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withObservability, measureTime } from '@/lib/middleware'
import { BadRequestError, InternalServerError } from '@/lib/errors'
import logger from '@/lib/logger'

// GET /api/infrastructures - Get all infrastructures with vote counts
async function getInfrastructures(request: NextRequest) {
  return measureTime(
    async () => {
      const infrastructures = await prisma.infrastructure.findMany({
        include: {
          _count: {
            select: { votes: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      logger.info({ count: infrastructures.length }, 'Fetched infrastructures')
      return NextResponse.json(infrastructures)
    },
    'prisma.infrastructure.findMany',
    { operation: 'GET /api/infrastructures' }
  )
}

export const GET = withObservability(getInfrastructures, 'GET /api/infrastructures')

// POST /api/infrastructures - Create a new infrastructure
async function createInfrastructure(request: NextRequest) {
  const body = await request.json()
  const { name, description, imageUrl } = body

  if (!name || !description) {
    throw new BadRequestError('Name and description are required', {
      providedFields: { name: !!name, description: !!description }
    })
  }

  const infrastructure = await measureTime(
    async () => {
      return prisma.infrastructure.create({
        data: {
          name,
          description,
          imageUrl: imageUrl || null
        }
      })
    },
    'prisma.infrastructure.create',
    { name }
  )

  logger.info({ infrastructureId: infrastructure.id, name }, 'Created new infrastructure')
  return NextResponse.json(infrastructure, { status: 201 })
}

export const POST = withObservability(createInfrastructure, 'POST /api/infrastructures')
