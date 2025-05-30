'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { ApiResponse } from './types'
import { useRouter, useSearchParams } from 'next/navigation'

interface Vendor {
  name: string
  id: number
  vendor: string
  vendor_no: string
  address: string
  mail_id: string
  Company_no: string
  phone: string[]
  createdAt: string
  updatedAt: string
  Mines_name: number | null | string | { id: number }
}

type Mine = {
  id: number
  Mines_name: string
  address: string
  phone: { number: string }[]
  mail_id: string
}

export default function EditVendor() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id') as string
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [mines, setMines] = useState<Mine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return

      try {
        // Fetch mines first
        const minesRes = await axios.get<ApiResponse<Mine>>('/api/Mines')
        const minesData = minesRes.data.docs
        if (minesData) {
          setMines(minesData)
        }

        // Then fetch vendor
        const res = await axios.get<Vendor>(`/api/vendor/${Number(id)}`)
        const vendorData = res.data
        
        // Handle Mines_name being either a number, null, or an object with id
        if (vendorData.Mines_name && typeof vendorData.Mines_name === 'object' && 'id' in vendorData.Mines_name) {
          vendorData.Mines_name = vendorData.Mines_name.id
        }
        
        setVendor(vendorData)
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('Error loading data')
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendor || !id) return

    try {
      await axios.patch(`/api/vendor/${id}`, vendor)
      alert('Vendor updated successfully')
      router.push('/vendor')
    } catch (error) {
      console.error('Error updating vendor:', error)
      alert('Error updating vendor')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!vendor) {
    return <div className="flex justify-center items-center min-h-screen">Vendor not found</div>
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Vendor</h1>
          <Link href="/vendor" className="text-gray-600 hover:text-gray-800">
            ← Back to Vendor List
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vendor Name
              </label>
              <input
                type="text"
                value={vendor.vendor}
                onChange={(e) =>
                  setVendor(
                    (prev) =>
                      prev && {
                        ...prev,
                        vendor: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vendor Number
              </label>
              <input
                type="text"
                value={vendor.vendor_no}
                onChange={(e) =>
                  setVendor(
                    (prev) =>
                      prev && {
                        ...prev,
                        vendor_no: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Company Number
              </label>
              <input
                type="text"
                value={vendor.Company_no}
                onChange={(e) =>
                  setVendor(
                    (prev) =>
                      prev && {
                        ...prev,
                        Company_no: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Address
              </label>
              <input
                type="text"
                value={vendor.address}
                onChange={(e) =>
                  setVendor(
                    (prev) =>
                      prev && {
                        ...prev,
                        address: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={vendor.mail_id}
                onChange={(e) =>
                  setVendor(
                    (prev) =>
                      prev && {
                        ...prev,
                        mail_id: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Mine Name
              </label>
              <select
                value={
                  vendor.Mines_name 
                    ? (typeof vendor.Mines_name === 'object' && 'id' in vendor.Mines_name
                        ? vendor.Mines_name.id
                        : vendor.Mines_name)
                    : ''
                }
                onChange={(e) =>
                  setVendor(
                    (prev) =>
                      prev && {
                        ...prev,
                        Mines_name: Number(e.target.value),
                      },
                  )
                }
                disabled={loading}
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
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


