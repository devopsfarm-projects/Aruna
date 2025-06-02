'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ApiResponse } from './types'
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
}

type Vendor = {
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

type Mine = {
  id: number
  Mines_name: string
  address: string
  phone: { number: string }[]
  mail_id: string
}

export default function EditStone() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stone, setStone] = useState<Stone | null>(null)
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState<{ id: number; vendor: string }[]>([])
  const [mines, setMines] = useState<{ id: number; Mines_name: string }[]>([])
  const id = searchParams.get('id')

  useEffect(() => {
    const fetchStone = async () => {
      if (!id) return

      try {
        // Fetch block data
        const blockRes = await axios.get<Stone>(`/api/stone/${id}`)
        const blockData = blockRes.data
        
        // Fetch vendors
        const vendorsRes = await axios.get<ApiResponse<Vendor>>('/api/vendor')
        const vendorsData = vendorsRes.data.docs

        // Fetch mines
        const minesRes = await axios.get<ApiResponse<Mine>>('/api/Mines')
        const minesData = minesRes.data.docs

        // Ensure measurements array exists
        if (!blockData.addmeasures) {
          blockData.addmeasures = []
        }

        setStone(blockData)
        setVendors(vendorsData)
        setMines(minesData)
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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-md"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Vendor Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Vendor Name
              </label>
              <select
                value={stone.vender_id.id}
                onChange={(e) => {
                  const selectedVendor = vendors.find(v => v.id === Number(e.target.value))
                  if (selectedVendor) {
                    setStone((prev) =>
                      prev && {
                        ...prev,
                        vender_id: {
                          ...prev.vender_id,
                          id: Number(e.target.value),
                          vendor: selectedVendor.vendor
                        }
                      }
                    )
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.vendor}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Mine Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Mine Name
              </label>
              <select
                value={stone.mines.id}
                onChange={(e) => {
                  const selectedMine = mines.find(m => m.id === Number(e.target.value))
                  if (selectedMine) {
                    setStone((prev) =>
                      prev && {
                        ...prev,
                        mines: {
                          ...prev.mines,
                          id: Number(e.target.value),
                          Mines_name: selectedMine.Mines_name
                        }
                      }
                    )
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Mine</option>
                {mines.map((mine) => (
                  <option key={mine.id} value={mine.id}>
                    {mine.Mines_name}
                  </option>
                ))}
              </select>
            </div>
  
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min={0}
              />
            </div>
  
            {/* Issued Quantity */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Issued Quantity
              </label>
              <input
                type="number"
                value={stone.issued_quantity ?? ''}
                onChange={(e) =>
                  setStone((prev) =>
                    prev
                      ? { ...prev, issued_quantity: parseInt(e.target.value) || 0 }
                      : prev
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min={0}
              />
            </div>
  
            {/* Left Quantity */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Left Quantity
              </label>
              <input
                type="number"
                value={stone.left_quantity ?? ''}
                onChange={(e) =>
                  setStone((prev) =>
                    prev ? { ...prev, left_quantity: parseInt(e.target.value) || 0 } : prev
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min={0}
              />
            </div>
  
            {/* Transport Type */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Transport Type
              </label>
              <input
                type="text"
                value={stone.transportType ?? ''}
                onChange={(e) =>
                  setStone((prev) =>
                    prev ? { ...prev, transportType: e.target.value } : prev
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
  
            {/* Vehicle Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Vehicle Number
              </label>
              <input
                type="text"
                value={stone.vehicle_number || ''}
                onChange={(e) =>
                  setStone((prev) =>
                    prev ? { ...prev, vehicle_number: e.target.value } : prev
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
  
            {/* Vehicle Cost */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Vehicle Cost
              </label>
              <input
                type="number"
                value={stone.vehicle_cost ?? ''}
                onChange={(e) =>
                  setStone((prev) =>
                    prev ? { ...prev, vehicle_cost: parseInt(e.target.value) || 0 } : prev
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min={0}
              />
            </div>
          </div>
  
          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-lg font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              Update Stone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}
