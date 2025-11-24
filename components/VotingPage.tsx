'use client'

import { useState, useEffect } from 'react'
import { Infrastructure } from '@/types'
import InfrastructureCard from './InfrastructureCard'
import AddInfrastructureForm from './AddInfrastructureForm'

export default function VotingPage() {
  const [infrastructures, setInfrastructures] = useState<Infrastructure[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchInfrastructures = async () => {
    try {
      const response = await fetch('/api/infrastructures')
      if (response.ok) {
        const data = await response.json()
        setInfrastructures(data)
      }
    } catch (error) {
      console.error('Error fetching infrastructures:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInfrastructures()
  }, [])

  const handleInfrastructureAdded = () => {
    setShowForm(false)
    fetchInfrastructures()
  }

  const handleVoteSuccess = () => {
    fetchInfrastructures()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏗️ Bình Chọn Infrastructure Ấn Tượng
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Vote cho những infrastructure bạn thấy ấn tượng nhất!
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            {showForm ? 'Đóng Form' : '+ Thêm Infrastructure Mới'}
          </button>
        </div>

        {/* Add Infrastructure Form */}
        {showForm && (
          <div className="mb-12">
            <AddInfrastructureForm onSuccess={handleInfrastructureAdded} />
          </div>
        )}

        {/* Infrastructure Grid */}
        {infrastructures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Chưa có infrastructure nào. Hãy thêm infrastructure đầu tiên!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {infrastructures.map((infrastructure) => (
              <InfrastructureCard
                key={infrastructure.id}
                infrastructure={infrastructure}
                onVoteSuccess={handleVoteSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
