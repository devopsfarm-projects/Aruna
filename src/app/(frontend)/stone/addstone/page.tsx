'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
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
import { useRouter } from 'next/navigation'

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
  rate?: number
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
  rate: number
  labour?: string
  hydra?: string
}

type Stone = {
  vender_id: string
  stoneType: string
  date: string
  mines: string
  addmeasures: Measure[]
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

interface _StoneResponse {
  id: number
  vender_id: number
  stoneType: string
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

export default function AddStonePage() {
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [mines, setMines] = useState<Mines[]>([])
  const [labours, setLabours] = useState<Labour[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [, setIsLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [newStone, setNewStone] = useState<Stone>({
    vender_id: '',
    stoneType: '',
    date: new Date().toISOString().split('T')[0],
    mines: '',
    addmeasures: [],
    total_quantity: 0,
    issued_quantity: 0,
    left_quantity: 0,
    final_total: 0,
    partyRemainingPayment: 0,
    partyAdvancePayment: 0,
    transportType: 'Hydra',
    createdBy: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [vendorsRes, minesRes, laboursRes, trucksRes] = await Promise.all([
          axios.get<ApiResponse<Vendor>>('/api/vendor'),
          axios.get<ApiResponse<Mines>>('/api/Mines'),
          axios.get<ApiResponse<Labour>>('/api/labour'),
          axios.get<ApiResponse<Truck>>('/api/truck'),
        ])

        setVendors(vendorsRes.data.docs || [])
        setMines(minesRes.data.docs || [])
        setLabours(laboursRes.data.docs || [])
        setTrucks(trucksRes.data.docs || [])
      } catch (error) {
        setError('Failed to load data. Please try again later.')
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const updateMeasure = (index: number, field: keyof Measure, value: string | number) => {
    const newMeasures = [...newStone.addmeasures]
    newMeasures[index] = { ...newMeasures[index], [field]: Number(value) }

    // Calculate total quantity
    const totalQty = newMeasures.reduce((sum, m) => sum + (Number(m.qty) || 0), 0)

    // Calculate final total (sum of all measure totals)
    const finalTotal = newMeasures.reduce(
      (sum, m) => sum + (Number(m.qty) * Number(m.rate) || 0),
      0,
    )

    // Calculate remaining payment
    const remainingPayment = finalTotal - (Number(newStone.partyAdvancePayment) || 0)

    setNewStone((prev) => ({
      ...prev,
      addmeasures: newMeasures,
      total_quantity: totalQty,
      final_total: finalTotal,
      partyRemainingPayment: remainingPayment,
      left_quantity: totalQty - (prev.issued_quantity || 0),
    }))
  }

  const updatePartyAdvancePayment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const advancePayment = Number(e.target.value)
    const finalTotal = newStone.addmeasures.reduce(
      (sum, m) => sum + (Number(m.qty) * Number(m.rate) || 0),
      0,
    )

    // Calculate remaining payment
    const remainingPayment = finalTotal - advancePayment

    setNewStone((prev) => ({
      ...prev,
      partyAdvancePayment: advancePayment,
      partyRemainingPayment: remainingPayment,
    }))
  }

  const addNewMeasure = () => {
    setNewStone((prev) => ({
      ...prev,
      addmeasures: [...prev.addmeasures, { qty: 0, l: 0, b: 0, h: 0, rate: 0 }],
    }))
  }

  const removeMeasure = (index: number) => {
    const newMeasures = newStone.addmeasures.filter((_, i) => i !== index)
    const totalQty = newMeasures.reduce((sum, m) => sum + (Number(m.qty) || 0), 0)

    setNewStone((prev) => ({
      ...prev,
      addmeasures: newMeasures,
      total_quantity: totalQty,
      left_quantity: totalQty - (prev.issued_quantity || 0),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare the data in the format expected by the API
      const payload = {
        ...newStone,
        vender_id: Number(newStone.vender_id), // Convert string to number
        mines: Number(newStone.mines), // Convert string to number
        // Ensure numeric fields are numbers
        total_quantity: Number(newStone.total_quantity),
        issued_quantity: Number(newStone.issued_quantity),
        left_quantity: Number(newStone.left_quantity),
        final_total: Number(newStone.final_total),
        partyRemainingPayment: Number(newStone.partyRemainingPayment),
        partyAdvancePayment: Number(newStone.partyAdvancePayment),
      }

      console.log('Submitting data:', JSON.stringify(payload, null, 2))

      const response = await axios.post('/api/stone', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        alert('Stone added successfully!')
        router.push('/stone')
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          <span className="text-indigo-600 dark:text-indigo-400">Add</span> New Stone
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stone Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Stone Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newStone.stoneType}
                  onChange={(e) => setNewStone({ ...newStone, stoneType: e.target.value })}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Khanda">Khanda</option>
                  <option value="Raskat">Raskat</option>
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
                  value={newStone.date}
                  onChange={(e) => setNewStone({ ...newStone, date: e.target.value })}
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
                  value={newStone.vender_id}
                  onChange={(e) => setNewStone({ ...newStone, vender_id: e.target.value })}
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
                  value={newStone.mines}
                  onChange={(e) => setNewStone({ ...newStone, mines: e.target.value })}
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
                  value={newStone.transportType}
                  onChange={(e) => setNewStone({ ...newStone, transportType: e.target.value })}
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
                  value={newStone.partyAdvancePayment}
                  onChange={updatePartyAdvancePayment}
                />
              </div>
            </div>

            {/* Measurements */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  <span className="text-indigo-600 dark:text-indigo-400">Measurements</span>
                </h2>
                <button
                  type="button"
                  onClick={addNewMeasure}
                  className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                >
                  <span className="font-medium">Add Measurement</span>
                </button>
              </div>

              {newStone.addmeasures.map((measure, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={measure.qty}
                      onChange={(e) => updateMeasure(index, 'qty', e.target.value)}
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      L
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={measure.l}
                      onChange={(e) => updateMeasure(index, 'l', e.target.value)}
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
                      onChange={(e) => updateMeasure(index, 'b', e.target.value)}
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
                      onChange={(e) => updateMeasure(index, 'h', e.target.value)}
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Rate
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={measure.rate}
                      onChange={(e) => updateMeasure(index, 'rate', e.target.value)}
                      min="0"
                      required
                    />
                  </div>

                  {newStone.transportType === 'Hydra' ? (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Hydra
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={measure.hydra || ''}
                        onChange={(e) => {
                          const newMeasures = [...newStone.addmeasures]
                          newMeasures[index].hydra = e.target.value
                          setNewStone({ ...newStone, addmeasures: newMeasures })
                        }}
                      >
                        <option value="">Select Hydra</option>
                        {trucks.map((truck) => (
                          <option key={truck.id} value={truck.id}>
                            {truck.number}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Labour
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={measure.labour || ''}
                        onChange={(e) => {
                          const newMeasures = [...newStone.addmeasures]
                          newMeasures[index].labour = e.target.value
                          setNewStone({ ...newStone, addmeasures: newMeasures })
                        }}
                      >
                        <option value="">Select Labour</option>
                        {labours.map((labour) => (
                          <option key={labour.id} value={labour.id}>
                            {labour.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removeMeasure(index)}
                      className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
                      disabled={newStone.addmeasures.length === 1}
                    >
                      <span className="font-medium">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

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
                    {newStone.total_quantity.toFixed(2)}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Final Total
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{newStone.final_total.toFixed(2)}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Remaining Payment
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{newStone.partyRemainingPayment.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-600 dark:bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <span className="font-medium">Cancel</span>
              </button>
              <button
                type="submit"
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                disabled={isSubmitting}
              >
                <span className="font-medium">{isSubmitting ? 'Saving...' : 'Save Stone'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
