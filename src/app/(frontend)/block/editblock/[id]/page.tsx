'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type { Block } from '../../../../../payload-types'

export default function EditBlockPage() {
  const router = useRouter()
  const { id } = useParams()
  const [block, setBlock] = useState<Block | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/block/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) throw new Error('Failed to fetch block')
        const data = await response.json()
        setBlock(data)
      } catch (_) {
        setError('Failed to fetch block data')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlock()
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!block) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/block/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          BlockType: block.BlockType,
          qty: block.qty,
          // Add other fields as needed
        }),
      })
      if (!response.ok) throw new Error('Failed to update block')
      router.push('/block')
    } catch (_) {
      setError('Failed to update block')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!block) {
    return <div>Block not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          <span className="text-indigo-600 dark:text-indigo-400">Edit</span> Block
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Block Type
                </label>
                <input
                  type="text"
                  value={block.BlockType}
                  onChange={(e) => {
                    const value = e.target.value as 'Brown' | 'White'
                    setBlock({ ...block, BlockType: value })
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={block.qty ?? ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    if (!isNaN(value)) {
                      setBlock({ ...block, qty: value })
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Add other fields as needed */}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => router.push('/block')}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
