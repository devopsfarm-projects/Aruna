'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Block } from './types'
import Summary from './components/Summary'

const isAxiosError = (
  error: unknown,
): error is {
  config: {
    url: string
    method: string
    headers: Record<string, string>
    data: unknown
  }
  response: {
    status: number
    statusText: string
    headers: Record<string, string>
    data: unknown
  }
  request: unknown
  message: string
} => {
  return (
    error instanceof Error &&
    'config' in error &&
    'response' in error &&
    'request' in error &&
    'message' in error
  )
}

interface Vendor {
  id: number
  vendor: string
  vendor_no: string
  address: string
  mail_id: string
  Company_no: string
  phone: Array<{
    number: string
    type?: string
  }>
  createdAt: string
  updatedAt: string
}

interface _StoneResponse {
  id: number
  vender_id: number
  stoneType: string
  date: string
  addmeasures: Measure[]
  final_total: number
  issued_quantity: number | null
  left_quantity: number | null
  partyAdvancePayment: number | null
  partyRemainingPayment: number
  total_quantity: number | null
  transportType: string | null
  createdAt: string
  updatedAt: string
  createdBy: string | null
}

// Error response types
interface ValidationError {
  message: string
}

interface ErrorResponse {
  errors?: ValidationError[]
  message?: string
}

// Type guard for error responses
const isErrorResponse = (obj: unknown): obj is ErrorResponse => {
  if (typeof obj !== 'object' || obj === null) return false
  const data = obj as ErrorResponse
  return ('errors' in data && Array.isArray(data.errors)) || 'message' in data
}

// Response types
interface ApiResponse<T> {
  docs: T[]
}

export default function AddBlockPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [newBlock, setNewBlock] = useState<Block>({
    vender_id: '',
    BlockType: '',
    date: new Date().toISOString().split('T')[0],
    labour_name: '',
    block: [{
      blockcost: 0,
      addmeasures: []
    }],
    qty: 0,
    vehicle_number: '',
    hydra_cost: 0,
    truck_cost: 0,
    total_cost: 0,
    total_area: 0,
    total_todi_cost: 0,
    total_quantity: 0,
    issued_quantity: 0,
    left_quantity: 0,
    final_total: 0,
    partyRemainingPayment: 0,
    partyAdvancePayment: 0,
    transportType: 'Hydra',
    createdBy: '',
    block_id: '',
    front_l: 0,
    front_b: 0,
    front_h: 0,
    back_l: 0,
    back_b: 0,
    back_h: 0,
    transport_cost: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const blockToSubmit = {
        ...newBlock,
        total_quantity: newBlock.total_quantity,
        final_total: newBlock.final_total,
        partyRemainingPayment: newBlock.partyRemainingPayment,
        createdBy: (() => {
          const userStr = localStorage.getItem('user')
          if (!userStr) return ''
          try {
            const user = JSON.parse(userStr)
            return typeof user === 'object' && user !== null && 'id' in user ? user.id : ''
          } catch {
            return ''
          }
        })(),
        vender_id: newBlock.vender_id ? Number(newBlock.vender_id) : null,
        block: newBlock.block?.map((b) => ({
          blockcost: Number(b.blockcost),
          addmeasures: b.addmeasures?.map((m) => ({
            l: Number(m.l),
            b: Number(m.b),
            h: Number(m.h),
            black_area: Number(m.black_area),
            black_cost: Number(m.black_cost),
          })) || [],
        })) || [],
        qty: Number(newBlock.qty),
        issued_quantity: newBlock.issued_quantity
          ? Number(newBlock.issued_quantity).toString()
          : '',
        left_quantity: newBlock.left_quantity ? Number(newBlock.left_quantity).toString() : '',
        partyAdvancePayment: newBlock.partyAdvancePayment
          ? Number(newBlock.partyAdvancePayment).toString()
          : '',
        transportType: newBlock.transportType || 'Hydra',
      }

      const response = await axios.post('/api/Block', blockToSubmit, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        alert('Block added successfully!')
        router.push('/block')
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.data && isErrorResponse(error.response.data)) {
          if (error.response.data.errors) {
            const errorMessages = error.response.data.errors.map((err) => err.message).join('\n')
            alert(`Validation errors:\n${errorMessages}`)
          } else if (error.response.data.message) {
            alert(`Error: ${error.response.data.message}`)
          }
        } else {
          alert('Failed to add stone. Please check the console for details.')
        }
      } else {
        alert('An unknown error occurred. Please check the console for details.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [vendorsRes] = await Promise.all([axios.get<ApiResponse<Vendor>>('/api/vendor')])

        // Convert vendor IDs to numbers
        const vendorsWithNumberIds = (vendorsRes.data.docs || []).map((vendor) => ({
          ...vendor,
          id: Number(vendor.id),
        }))

        setVendors(vendorsWithNumberIds)
      } catch (error) {
        setError('Failed to load data. Please try again later.')
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [setVendors, setIsLoading, setError])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-12">
      <div className=" pt-20">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <header className="px-6 py-6 sm:px-8 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Add New Block
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-prose">
              Enter block details and measurements
            </p>
          </header>

          <form onSubmit={handleSubmit} className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Basic Block Information */}
            <section className="px-6 py-6 sm:px-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-5">
                Block Information
              </h2>
              <div className="space-y-6">
                <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  {/* Basic Block Information */}
                  <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                      Basic Block Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="blockType"
                          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                        >
                          Block Type
                        </label>
                        <select
                          id="blockType"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          value={newBlock.BlockType}
                          onChange={(e) => setNewBlock({ ...newBlock, BlockType: e.target.value })}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Brown">Brown</option>
                          <option value="White">White</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                        >
                          Date
                        </label>
                        <input
                          id="date"
                          type="date"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          value={newBlock.date}
                          onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="vendor"
                          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                        >
                          Vendor
                        </label>
                        <select
                          id="vendor"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          value={newBlock.vender_id || ''}
                          onChange={(e) => setNewBlock({ ...newBlock, vender_id: e.target.value })}
                          required
                          disabled={vendors.length === 0}
                        >
                          <option value="">
                            {vendors.length === 0 ? 'Loading vendors...' : 'Select Vendor'}
                          </option>
                          {vendors.map((vendor) => (
                            <option key={vendor.id} value={vendor.id}>
                              {vendor.vendor}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="munim"
                          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                        >
                          Munim
                        </label>
                        <input
                          id="munim"
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          value={newBlock.munim}
                          onChange={(e) => setNewBlock({ ...newBlock, munim: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="todiCost"
                          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                        >
                          Todi cost
                        </label>
                        <input
                          id="todiCost"
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          value={newBlock.total_cost}
                          onChange={(e) => setNewBlock({ ...newBlock, total_cost: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </section>

                  {/* Block Details */}
                  <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                      Todi Details
                    </h2>

                    {/* Front Side Measurements */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                        Front Side
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <label
                            htmlFor="front-l"
                            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                          >
                            Front L (लम्बाई) - Length
                          </label>
                          <input
                            id="front-l"
                            type="number"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={newBlock.front_l || ''}
                            onChange={(e) =>
                              setNewBlock({ ...newBlock, front_l: Number(e.target.value) || 0 })
                            }
                            required
                            min="0"
                            placeholder="Enter front length"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="front-b"
                            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                          >
                            Front B (चौड़ाई) - Breadth
                          </label>
                          <input
                            id="front-b"
                            type="number"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={newBlock.front_b || ''}
                            onChange={(e) =>
                              setNewBlock({ ...newBlock, front_b: Number(e.target.value) || 0 })
                            }
                            required
                            min="0"
                            placeholder="Enter front breadth"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="front-h"
                            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                          >
                            Front H (ऊंचाई) - Height
                          </label>
                          <input
                            id="front-h"
                            type="number"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={newBlock.front_h || ''}
                            onChange={(e) =>
                              setNewBlock({ ...newBlock, front_h: Number(e.target.value) || 0 })
                            }
                            required
                            min="0"
                            placeholder="Enter front height"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Back Side Measurements */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                        Back Side
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <label
                            htmlFor="back-l"
                            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                          >
                            Back L (लम्बाई) - Length
                          </label>
                          <input
                            id="back-l"
                            type="number"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={newBlock.back_l || ''}
                            onChange={(e) =>
                              setNewBlock({ ...newBlock, back_l: Number(e.target.value) || 1 })
                            }
                            required
                            min="1"
                            placeholder="Enter back length"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="back-b"
                            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                          >
                            Back B (चौड़ाई) - Breadth
                          </label>
                          <input
                            id="back-b"
                            type="number"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={newBlock.back_b || ''}
                            onChange={(e) =>
                              setNewBlock({ ...newBlock, back_b: Number(e.target.value) || 1 })
                            }
                            required
                            min="1"
                            placeholder="Enter back breadth"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="back-h"
                            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                          >
                            Back H (ऊंचाई) - Height
                          </label>
                          <input
                            id="back-h"
                            type="number"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={newBlock.back_h || ''}
                            onChange={(e) =>
                              setNewBlock({ ...newBlock, back_h: Number(e.target.value) || 1 })
                            }
                            required
                            min="1"
                            placeholder="Enter back height"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                  <div>
                    <label
                      htmlFor="todiCost"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Total Area
                    </label>
                    <input
                      id="todiCost"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      value={newBlock.total_area}
                      onChange={(e) => setNewBlock({ ...newBlock, todi_cost: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="todiCost"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Total Todi cost
                    </label>
                    <input
                      id="todiCost"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      value={newBlock.total_todi_cost}
                      onChange={(e) => setNewBlock({ ...newBlock, todi_cost: e.target.value })}
                      required
                    />
                  </div>

                  {/* Transport Details */}
                  <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                      Transport Details
                    </h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="hydraCost"
                            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                          >
                            Hydra Cost
                          </label>
                          <input
                            id="hydraCost"
                            type="number"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={newBlock.hydra_cost}
                            onChange={(e) => setNewBlock({ ...newBlock, hydra_cost: e.target.value })}
                            min="1"
                            placeholder="Enter hydra cost"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="truckCost"
                            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                          >
                            Truck Cost
                          </label>
                          <input
                            id="truckCost"
                            type="number"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={newBlock.truck_cost}
                            onChange={(e) => setNewBlock({ ...newBlock, truck_cost: e.target.value })}
                            min="1"
                            placeholder="Enter truck cost"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </section>

           
     

            {/* Summary */}
            <section className="px-6 py-6 sm:px-8 bg-gray-50 dark:bg-gray-800 rounded-lg mt-8">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Summary</h3>
              <Summary block={newBlock} />
            </section>

            {/* Action Buttons */}
            <div className="px-6 py-6 sm:px-8 bg-gray-50 dark:bg-gray-700 mt-8 rounded-lg flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
              <button
                type="button"
                onClick={() => router.push('/block')}
                className="w-full sm:w-auto inline-flex justify-center py-3 px-5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex justify-center py-3 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
