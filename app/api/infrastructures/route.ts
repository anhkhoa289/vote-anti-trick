import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/infrastructures - Get all infrastructures with vote counts
export async function GET() {
  try {
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

    return NextResponse.json(infrastructures)
  } catch (error) {
    console.error('Error fetching infrastructures:', error)
    return NextResponse.json(
      { error: 'Failed to fetch infrastructures' },
      { status: 500 }
    )
  }
}

// POST /api/infrastructures - Create a new infrastructure
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, imageUrl } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      )
    }

    const infrastructure = await prisma.infrastructure.create({
      data: {
        name,
        description,
        imageUrl: imageUrl || null
      }
    })

    return NextResponse.json(infrastructure, { status: 201 })
  } catch (error) {
    console.error('Error creating infrastructure:', error)
    return NextResponse.json(
      { error: 'Failed to create infrastructure' },
      { status: 500 }
    )
  }
}
