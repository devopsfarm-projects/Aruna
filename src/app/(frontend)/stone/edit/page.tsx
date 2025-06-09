'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
type Measure = {
  qty: number
  l: number
  b: number
  h: number
  rate: number
  labour?: string
  hydra?: string
}

type Stone = {
  id: number | string
  vender_id: {
    id: number
    vendor: string
    vendor_no: string
    address: string
    mail_id: string
    Company_no: string
    Mines_name: {
      id: number
      Mines_name: string
      address: string
      phone: { number: string }[]
      mail_id: string
    }
  }
  labour_name?: string
  stoneType: string
  date: string
  mines: {
    id: number
    Mines_name: string
    address: string
    phone: { number: string }[]
    mail_id: string
  }
  vehicle_number?: string
  addmeasures: Measure[]
  total_quantity: number | null
  issued_quantity: number | null
  left_quantity: number | null
  final_total: number
  partyRemainingPayment: number
  partyAdvancePayment: number | null
  transportType: string | null
  createdBy: { name: string } | null
  createdAt: string
  updatedAt: string
  vehicle_cost?: number
  rate: number
  munim?: string
}

export default function EditStone() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stone, setStone] = useState<Stone | null>(null)
  const [loading, setLoading] = useState(true)
  const id = searchParams.get('id')

  useEffect(() => {
    const fetchStone = async () => {
      if (!id) return

      try {
        // Fetch block data
        const blockRes = await axios.get<Stone>(`/api/stone/${id}`)
        const blockData = blockRes.data
        
      
    

        // Ensure measurements array exists
        if (!blockData.addmeasures) {
          blockData.addmeasures = []
        }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stone || !id) return

    try {
      await axios.patch(`/api/stone/${id}`, stone)
      alert('Stone updated successfully')
      router.push('/stone')
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-md"
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
                  setStone((prev) =>
                    prev && { ...prev, stoneType: e.target.value }
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Khanda">Khanda</option>
                <option value="Raskat">Raskat</option>
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
                  setStone((prev) => (prev ? { ...prev, date: e.target.value } : prev))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    setStone((prev) => (prev ? { ...prev, rate: parseFloat(e.target.value) } : prev))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">₹</span>
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
                  setStone((prev) =>
                    prev
                      ? { ...prev, total_quantity: parseInt(e.target.value) || 0 }
                      : prev
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Munim
              </label>
              <input
                type="text"
                value={stone.munim ?? ''}
                onChange={(e) =>
                  setStone((prev) => (prev ? { ...prev, munim: e.target.value } : prev))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min={0}
              />
            </div>



            {/* Hydra Cost */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Hydra Cost
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={stone.vehicle_cost ?? ''}
                  onChange={(e) =>
                    setStone((prev) =>
                      prev ? { ...prev, vehicle_cost: parseInt(e.target.value) || 0 } : prev
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                  min={0}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">₹</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              Update Stone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}
