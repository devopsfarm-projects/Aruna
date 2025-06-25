'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Stone } from '../../../../collections/Stone'

interface FormError {
  field: keyof Stone
  message: string
}

export default function EditStone() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stone, setStone] = useState<Stone | null>(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<FormError[]>([])
  const id = searchParams.get('id')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const fetchStone = async () => {
      if (!id) return

      try {
        // Fetch block data
        const blockRes = await axios.get<Stone>(`/api/stone/${id}`)
        const blockData = blockRes.data

        setStone(blockData)
      } catch (error) {
        console.error('Error fetching stone:', error)
        alert('Error loading stone data')
      } finally {
        setLoading(false)
      }
    }
    fetchStone()
  }, [id])

  const validateForm = () => {
    const newErrors: FormError[] = []

    if (!stone?.stoneType) {
      newErrors.push({ field: 'stoneType', message: 'Stone type is required' })
    }

    if (!stone?.date) {
      newErrors.push({ field: 'date', message: 'Date is required' })
    }

    if (stone?.rate !== undefined && stone.rate <= 0) {
      newErrors.push({ field: 'rate', message: 'Rate must be greater than 0' })
    }

    if (
      stone?.total_quantity !== undefined &&
      (stone.total_quantity === null || stone.total_quantity < 0)
    ) {
      newErrors.push({
        field: 'total_quantity',
        message: 'Total quantity must be a positive number',
      })
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stone || !id) return

    if (!validateForm()) {
      return
    }

    try {
      await axios.patch(`/api/stone/${id}`, stone)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error updating stone:', error)
      alert('Error updating stone')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!stone) {
    return <div className="flex justify-center items-center min-h-screen">Stone not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 px-4 sm:px-6 lg:px-8">
        {/* Success Modal */}
        {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 -lg shadow-lg max-w-md mx-4 z-50 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Success
              </h2>
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/stone')
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <svg className="w-12 h-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
              Stone updated successfully!
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/stone')
                }}
                className="bg-blue-500 text-white px-4 py-2 -md hover:bg-blue-600 transition duration-200"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Edit Stone
          </h1>
          <Link
            href="/stone"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600 transition"
          >
            ← Back to Stone List
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 -2xl p-4 sm:p-6 shadow-md"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stone Type */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Stone Type
              </label>
              <select
                value={stone.stoneType}
                onChange={(e) =>
                  setStone(
                    (prev: Stone | null) =>
                      prev && { ...prev, stoneType: e.target.value as 'Khanda' | 'Gudiya' },
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Khanda">Khanda</option>
                <option value="Gudiya">Gudiya</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={stone.date}
                onChange={(e) =>
                  setStone((prev: Stone | null) =>
                    prev ? { ...prev, date: e.target.value } : prev,
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={stone.rate}
                  onChange={(e) =>
                    setStone((prev: Stone | null) =>
                      prev ? { ...prev, rate: parseFloat(e.target.value) } : prev,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  ₹
                </span>
              </div>
            </div>

            {/* Total Quantity */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Total Quantity
              </label>
              <input
                type="number"
                value={stone.total_quantity ?? ''}
                onChange={(e) =>
                  setStone((prev: Stone | null) =>
                    prev ? { ...prev, total_quantity: parseInt(e.target.value) || 0 } : prev,
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                minum
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={stone.minum}
                  onChange={(e) =>
                    setStone((prev: Stone | null) =>
                      prev ? { ...prev, minum: e.target.value } : prev,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  ₹
                </span>
              </div>
            </div>

            {/* Hydra Cost */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                hydra cost
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={stone.hydra_cost}
                  onChange={(e) =>
                    setStone((prev: Stone | null) =>
                      prev ? { ...prev, hydra_cost: parseFloat(e.target.value) } : prev,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  ₹
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-semibold -lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              disabled={errors.length > 0}
            >
              {errors.length > 0 ? 'Fix Errors' : 'Update Stone'}
            </button>
          </div>
        </form>

        {/* Display Errors */}
        {errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 -lg border border-red-200 dark:border-red-800">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
