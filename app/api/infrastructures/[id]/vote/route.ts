import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withObservability, measureTime, getClientIp } from '@/lib/middleware'
import { NotFoundError } from '@/lib/errors'
import logger from '@/lib/logger'

// POST /api/infrastructures/[id]/vote - Vote for an infrastructure
async function createVote(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { voterName, voterEmail } = body

  // Get IP address from request
  const ipAddress = getClientIp(request)

  // Check if infrastructure exists
  const infrastructure = await measureTime(
    async () => prisma.infrastructure.findUnique({ where: { id } }),
    'prisma.infrastructure.findUnique',
    { infrastructureId: id }
  )

  if (!infrastructure) {
    throw new NotFoundError('Infrastructure not found', { infrastructureId: id })
  }

  // Create the vote
  const vote = await measureTime(
    async () => {
      return prisma.vote.create({
        data: {
          infrastructureId: id,
          voterName: voterName || null,
          voterEmail: voterEmail || null,
          ipAddress
        }
      })
    },
    'prisma.vote.create',
    { infrastructureId: id, voterName, ipAddress }
  )

  // Get updated vote count
  const voteCount = await measureTime(
    async () => prisma.vote.count({ where: { infrastructureId: id } }),
    'prisma.vote.count',
    { infrastructureId: id }
  )

  logger.info(
    {
      voteId: vote.id,
      infrastructureId: id,
      infrastructureName: infrastructure.name,
      voterName,
      ipAddress,
      totalVotes: voteCount
    },
    'Vote created successfully'
  )

  return NextResponse.json(
    {
      vote,
      totalVotes: voteCount
    },
    { status: 201 }
  )
}

export const POST = withObservability(createVote, 'POST /api/infrastructures/[id]/vote')
