import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createSuccessResponse, getIpAddress } from '@/lib/api-utils'

// POST /api/infrastructures/[id]/vote - Vote for an infrastructure
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate body is an object (not null, not an array)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return createErrorResponse({
        message: 'Invalid request body',
        status: 400
      })
    }

    const { voterName, voterEmail } = body as { voterName?: unknown; voterEmail?: unknown }

    // Get IP address from request
    const ipAddress = getIpAddress(request.headers)

    // Check if infrastructure exists
    const infrastructure = await prisma.infrastructure.findUnique({
      where: { id }
    })

    if (!infrastructure) {
      return createErrorResponse({
        message: 'Infrastructure not found',
        status: 404
      })
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        infrastructureId: id,
        voterName: voterName ? String(voterName) : null,
        voterEmail: voterEmail ? String(voterEmail) : null,
        ipAddress
      }
    })

    // Get updated vote count
    const voteCount = await prisma.vote.count({
      where: { infrastructureId: id }
    })

    return createSuccessResponse({
      vote,
      totalVotes: voteCount
    }, 201)
  } catch (error: unknown) {
    return createErrorResponse({
      message: 'Failed to create vote',
      status: 500,
      logMessage: 'Error creating vote',
      error
    })
  }
}
