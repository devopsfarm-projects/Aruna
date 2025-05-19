'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

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

// Interfaces
interface Labour {
  id: number
  name: string
  // rate?: number
  createdAt: string
  updatedAt: string
}

interface Truck {
  id: number
  number: string
  capacity?: number
  createdAt: string
  updatedAt: string
}

// Response types
interface ApiResponse<T> {
  docs: T[]
  // Add other pagination fields if your API returns them
  // total?: number
  // limit?: number
  // offset?: number
  // etc.
}

type Measure = {
  qty: number
  l: number
  b: number
  h: number
  // rate: number
}

type Block = {
  vender_id: string
  BlockType: string
  date: string
  mines: string
  qty: number
  todi: {
    todicost: number
    addmeasures: {
      qty: number
      l: number
      b: number
      h: number
     
    }[]
  }[]
  total_quantity: number
  issued_quantity: number
  left_quantity: number
  final_total: number
  partyRemainingPayment: number
  partyAdvancePayment: number
  transportType: string
  createdBy: string
}

interface Phone {
  number: string
  type?: string
}

interface Mines {
  name: ReactNode
  id: number
  Mines_name: string
  address: string
  phone: Phone[]
  mail_id: string
  createdAt: string
  updatedAt: string
}

interface Vendor {
  name: ReactNode
  id: number
  vendor: string
  vendor_no: string
  address: string
  mail_id: string
  Company_no: string
  Mines_name: Mines
  phone: Phone[]
  createdAt: string
  updatedAt: string
}

interface _BlockResponse {
  id: number
  vender_id: number
  BlockType: string
  date: string
  mines: Mines
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

interface ApiResponse<T> {
  docs: T[]
  // Add other pagination fields if your API returns them
  // total?: number
  // limit?: number
  // offset?: number
}

export default function AddBlockPage() {
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [mines, setMines] = useState<Mines[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [, setIsLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [newBlock, setNewBlock] = useState<Block>({
    vender_id: '',
    BlockType: '',
    date: new Date().toISOString().split('T')[0],
    mines: '',
    qty: 0,
    todi: [
      {
        todicost: 0,
        addmeasures: [
          {
            qty: 0,
            l: 0,
            b: 0,
            h: 0,
            // rate: 0,
          }
        ]
      }
    ],
    total_quantity: 0,
    issued_quantity: 0,
    left_quantity: 0,
    final_total: 0,
    partyRemainingPayment: 0,
    partyAdvancePayment: 0,
    transportType: 'Hydra',
    createdBy: '',
  })

  // Add new Todi section
  const addNewTodi = () => {
    setNewBlock((prev) => ({
      ...prev,
      todi: [...(prev.todi || []), {
        todicost: 0,
        addmeasures: [{
          qty: 0,
          l: 0,
          b: 0,
          h: 0,
          // rate: 0,
        }]
      }]
    }))
  }

  // Remove Todi section
  const removeTodi = (index: number) => {
    setNewBlock(prev => ({
      ...prev,
      todi: prev.todi?.filter((_, i) => i !== index) || []
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [vendorsRes, minesRes] = await Promise.all([
          axios.get<ApiResponse<Vendor>>('/api/vendor'),
          axios.get<ApiResponse<Mines>>('/api/Mines'),
        ])

        setVendors(vendorsRes.data.docs || [])
        setMines(minesRes.data.docs || [])
      } catch (error) {
        setError('Failed to load data. Please try again later.')
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Calculate totals
      const totalQuantity = newBlock.todi?.reduce((sum, todi) => {
        return sum + todi.addmeasures.reduce((tSum, measure) => {
          return tSum + (measure.qty || 0)
        }, 0)
      }, 0) || 0

      const finalTotal = newBlock.todi?.reduce((sum, todi) => {
        return sum + todi.addmeasures.reduce((tSum, measure) => {
          return tSum + ((measure.qty || 0) * (measure.l || 0) * (measure.b || 0) * (measure.h || 0))
        }, 0) + (todi.todicost || 0)
      }, 0) || 0

      // Update newBlock with calculated values
      const blockToSubmit = {
        ...newBlock,
        total_quantity: totalQuantity,
        final_total: finalTotal,
        partyRemainingPayment: finalTotal - (newBlock.partyAdvancePayment || 0),
        createdBy: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : '',
        // Format relationship fields
        vender_id: newBlock.vender_id || null,
        mines: newBlock.mines || null,
        // Format todi array with nested addmeasures
        todi: newBlock.todi?.map(todi => ({
          todicost: Number(todi.todicost),
          addmeasures: todi.addmeasures?.map(measure => ({
            qty: Number(measure.qty),
            l: Number(measure.l),
            b: Number(measure.b),
            h: Number(measure.h),
            // rate: Number(measure.rate)
          })) || []
        })) || [],
        // Format numeric fields
        qty: Number(newBlock.qty),
        issued_quantity: newBlock.issued_quantity ? Number(newBlock.issued_quantity) : null,
        left_quantity: newBlock.left_quantity ? Number(newBlock.left_quantity) : null,
        partyAdvancePayment: newBlock.partyAdvancePayment ? Number(newBlock.partyAdvancePayment) : null,
        transportType: newBlock.transportType || 'Hydra'
      }

      console.log('Submitting data:', JSON.stringify(blockToSubmit, null, 2))

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
        console.error('Detailed error:', {
          message: error.message,
          response: {
            status: error.response?.status,
            statusText: error.response?.statusText,
            headers: error.response?.headers,
            data: error.response?.data,
          },
          request: error.request,
          config: error.config,
        })
        console.error('Request config:', {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers,
        })

        // Type guard for error responses
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


  const updateTodiMeasure = (todiIndex: number, measureIndex: number, field: keyof Measure, value: string | number) => {
    const newTodi = [...newBlock.todi]
    const newMeasures = [...newTodi[todiIndex].addmeasures]
    newMeasures[measureIndex] = { ...newMeasures[measureIndex], [field]: Number(value) }
    newTodi[todiIndex].addmeasures = newMeasures

    // Calculate final total
    const finalTotal = newTodi.reduce((sum, todi) => {
      return sum + todi.addmeasures.reduce((tSum, m) => {
        const l = m.l || 0
        const b = m.b || 0
        const h = m.h || 0
        // const rate = m.rate || 0
        const todicost = todi.todicost || 0
        const qty = newBlock.qty || 0
        return tSum + (l * b * h * qty  * todicost)
      }, 0)
    }, 0)

    // Calculate remaining payment
    const remainingPayment = finalTotal - (Number(newBlock.partyAdvancePayment) || 0)

    setNewBlock((prev) => ({
      ...prev,
      todi: newTodi,
      final_total: finalTotal,
      partyRemainingPayment: remainingPayment,
    }))
  }

  const updateTodiCost = (todiIndex: number, value: string | number) => {
    const newTodi = [...newBlock.todi]
    newTodi[todiIndex].todicost = Number(value)

    // Calculate final total
    let finalTotal = 0
    for (const todi of newTodi) {
      const todicost = todi.todicost || 0
      for (const measure of todi.addmeasures) {
        const l = measure.l || 0
        const b = measure.b || 0
        const h = measure.h || 0
        finalTotal += l * b * h * newBlock.qty  * todicost
      }
    }

    // Calculate remaining payment
    const remainingPayment = finalTotal - (Number(newBlock.partyAdvancePayment) || 0)

    setNewBlock((prev) => ({
      ...prev,
      todi: newTodi,
      final_total: finalTotal,
      partyRemainingPayment: remainingPayment,
    }))
  }

  const updatePartyAdvancePayment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const advancePayment = Number(e.target.value)
    const finalTotal = newBlock.todi.reduce((sum, todi) => {
      return sum + todi.addmeasures.reduce((tSum, m) => {
        const l = m.l || 0
        const b = m.b || 0
        const h = m.h || 0
        // const rate = m.rate || 0
        const todicost = todi.todicost || 0
        const qty = newBlock.qty || 0
        return tSum + (l * b * h * qty * todicost)
      }, 0)
    }, 0)

    // Calculate remaining payment
    const remainingPayment = finalTotal - advancePayment

    setNewBlock((prev) => ({
      ...prev,
      partyAdvancePayment: advancePayment,
      partyRemainingPayment: remainingPayment,
      final_total: finalTotal
    }))
  }





  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          <span className="text-indigo-600 dark:text-indigo-400">Add</span> New Block
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Block Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Block Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newBlock.BlockType}
                  onChange={(e) => setNewBlock({ ...newBlock, BlockType: e.target.value })}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Brown">Brown</option>
                  <option value="White">White</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newBlock.date}
                  onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
                  required
                />
              </div>


              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Vendor
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newBlock.vender_id}
                  onChange={(e) => setNewBlock({ ...newBlock, vender_id: Number(e.target.value) })}
                  required
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.vendor} - {vendor.Company_no}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mines */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Mine
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newBlock.mines}
                  onChange={(e) => setNewBlock({ ...newBlock, mines: Number(e.target.value) })}
                  required
                >
                  <option value="">Select Mine</option>
                  {mines.map((mine) => (
                    <option key={mine.id} value={mine.id}>
                      {mine.Mines_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transport Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Transport Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newBlock.transportType}
                  onChange={(e) => setNewBlock({ ...newBlock, transportType: e.target.value })}
                  required
                >
                  <option value="Hydra">Hydra</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              {/* Party Advance Payment */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Advance Payment
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newBlock.partyAdvancePayment}
                  onChange={updatePartyAdvancePayment}
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Quantity
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newBlock.qty}
                  onChange={(e) => setNewBlock({ ...newBlock, qty: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            {/* Todi Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Todi Details
                </h2>
                <button
                  onClick={addNewTodi}
                  className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                >
                  Add Todi
                </button>
              </div>

              {newBlock.todi?.map((todi, todiIndex) => (
                <div key={todiIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Todi {todiIndex + 1}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Todi Cost
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={todi.todicost}
                          onChange={(e) => updateTodiCost(todiIndex, e.target.value)}
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {todi.addmeasures?.map((measure, measureIndex) => (
                      <div key={measureIndex} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  

                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                              L
                            </label>
                            <input
                              type="number"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              value={measure.l}
                              onChange={(e) => updateTodiMeasure(todiIndex, measureIndex, 'l', e.target.value)}
                              min="0"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                              B
                            </label>
                            <input
                              type="number"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              value={measure.b}
                              onChange={(e) => updateTodiMeasure(todiIndex, measureIndex, 'b', e.target.value)}
                              min="0"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                              H
                            </label>
                            <input
                              type="number"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              value={measure.h}
                              onChange={(e) => updateTodiMeasure(todiIndex, measureIndex, 'h', e.target.value)}
                              min="0"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removeTodi(todiIndex)}
                      className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
                      disabled={newBlock.todi?.length === 1}
                    >
                      Remove Todi
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/Block')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>


              {/* Summary */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="text-indigo-600 dark:text-indigo-400">Summary</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Total Quantity
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {newBlock.total_quantity.toFixed(2)}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Final Total
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{newBlock.final_total.toFixed(2)}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Remaining Payment
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{newBlock.partyRemainingPayment.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
