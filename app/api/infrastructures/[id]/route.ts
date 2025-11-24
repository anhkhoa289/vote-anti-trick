import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/infrastructures/[id] - Get a specific infrastructure
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const infrastructure = await prisma.infrastructure.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { votes: true }
        }
      }
    })

    if (!infrastructure) {
      return NextResponse.json(
        { error: 'Infrastructure not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(infrastructure)
  } catch (error) {
    console.error('Error fetching infrastructure:', error)
    return NextResponse.json(
      { error: 'Failed to fetch infrastructure' },
      { status: 500 }
    )
  }
}
