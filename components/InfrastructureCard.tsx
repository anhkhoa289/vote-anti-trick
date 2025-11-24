'use client'

import { useState } from 'react'
import { Infrastructure } from '@/types'
import Image from 'next/image'

interface InfrastructureCardProps {
  infrastructure: Infrastructure
  onVoteSuccess: () => void
}

export default function InfrastructureCard({
  infrastructure,
  onVoteSuccess
}: InfrastructureCardProps) {
  const [voting, setVoting] = useState(false)
  const [voted, setVoted] = useState(false)
  const [showVoteForm, setShowVoteForm] = useState(false)
  const [voterName, setVoterName] = useState('')
  const [voterEmail, setVoterEmail] = useState('')

  const handleVote = async () => {
    setVoting(true)
    try {
      const response = await fetch(`/api/infrastructures/${infrastructure.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voterName: voterName || undefined,
          voterEmail: voterEmail || undefined,
        }),
      })

      if (response.ok) {
        setVoted(true)
        setShowVoteForm(false)
        setVoterName('')
        setVoterEmail('')
        onVoteSuccess()
        setTimeout(() => setVoted(false), 3000)
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setVoting(false)
    }
  }

  const voteCount = infrastructure._count?.votes || 0

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      {infrastructure.imageUrl ? (
        <div className="relative h-48 bg-gray-200">
          <Image
            src={infrastructure.imageUrl}
            alt={infrastructure.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
          <span className="text-6xl">🏗️</span>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {infrastructure.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {infrastructure.description}
        </p>

        {/* Vote Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👍</span>
            <span className="text-xl font-bold text-indigo-600">
              {voteCount}
            </span>
            <span className="text-gray-600">votes</span>
          </div>
        </div>

        {/* Vote Button */}
        {!showVoteForm ? (
          <button
            onClick={() => setShowVoteForm(true)}
            disabled={voting || voted}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
              voted
                ? 'bg-green-500 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {voted ? '✓ Đã Vote!' : 'Vote'}
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tên của bạn (không bắt buộc)"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              placeholder="Email (không bắt buộc)"
              value={voterEmail}
              onChange={(e) => setVoterEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleVote}
                disabled={voting}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {voting ? 'Đang vote...' : 'Xác nhận'}
              </button>
              <button
                onClick={() => setShowVoteForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
