import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createSuccessResponse, validateRequiredFields } from '@/lib/api-utils'
import { includeVoteCount, defaultInfrastructureOrder } from '@/lib/prisma-queries'

// GET /api/infrastructures - Get all infrastructures with vote counts
export async function GET() {
  try {
    const infrastructures = await prisma.infrastructure.findMany({
      include: includeVoteCount,
      orderBy: defaultInfrastructureOrder
    })

    return createSuccessResponse(infrastructures)
  } catch (error: unknown) {
    return createErrorResponse({
      message: 'Failed to fetch infrastructures',
      status: 500,
      logMessage: 'Error fetching infrastructures',
      error
    })
  }
}

// POST /api/infrastructures - Create a new infrastructure
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate body is an object (not null, not an array)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return createErrorResponse({
        message: 'Invalid request body',
        status: 400
      })
    }

    const validationError = validateRequiredFields(body as Record<string, unknown>, ['name', 'description'])
    if (validationError) {
      return createErrorResponse({
        message: validationError,
        status: 400
      })
    }

    const { name, description, imageUrl } = body

    const infrastructure = await prisma.infrastructure.create({
      data: {
        name: String(name),
        description: String(description),
        imageUrl: imageUrl ? String(imageUrl) : null
      }
    })

    return createSuccessResponse(infrastructure, 201)
  } catch (error: unknown) {
    return createErrorResponse({
      message: 'Failed to create infrastructure',
      status: 500,
      logMessage: 'Error creating infrastructure',
      error
    })
  }
}
