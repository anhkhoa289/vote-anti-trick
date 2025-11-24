import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/infrastructures/[id]/vote - Vote for an infrastructure
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { voterName, voterEmail } = body

    // Get IP address from request
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'

    // Check if infrastructure exists
    const infrastructure = await prisma.infrastructure.findUnique({
      where: { id: params.id }
    })

    if (!infrastructure) {
      return NextResponse.json(
        { error: 'Infrastructure not found' },
        { status: 404 }
      )
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        infrastructureId: params.id,
        voterName: voterName || null,
        voterEmail: voterEmail || null,
        ipAddress
      }
    })

    // Get updated vote count
    const voteCount = await prisma.vote.count({
      where: { infrastructureId: params.id }
    })

    return NextResponse.json({
      vote,
      totalVotes: voteCount
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating vote:', error)
    return NextResponse.json(
      { error: 'Failed to create vote' },
      { status: 500 }
    )
  }
}
