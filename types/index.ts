export interface Infrastructure {
  id: string
  name: string
  description: string
  imageUrl: string | null
  createdAt: Date | string
  updatedAt: Date | string
  _count?: {
    votes: number
  }
}

export interface Vote {
  id: string
  infrastructureId: string
  voterName: string | null
  voterEmail: string | null
  ipAddress: string | null
  createdAt: Date | string
}
