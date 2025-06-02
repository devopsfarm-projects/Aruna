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
  rate: number
  block_amount: number
  total_amount: number
  labour_name: string
  transportType: string
  vehicle_number: string
  vehicle_cost: number
  createdBy: string
}

interface Phone {
  number: string
  type?: string
}

interface Mines {
  id: number
  Mines_name: string
  name: ReactNode
}

interface Vendor {
  id: string
  vendor: string
  Company_no: string
  name?: string
  vendor_no?: string
  address?: string
  mail_id?: string
  Mines_name?: {
    id: number
    Mines_name: string
    address: string
    phone: Phone[]
    mail_id: string
  }
  phone?: Phone[]
  createdAt?: string
  updatedAt?: string
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
  // const [vendors, setVendors] = useState<Vendor[]>([])
  // const [mines, setMines] = useState<Mines[]>([])
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
    rate: 0,
    block_amount: 0,
    total_amount: 0,
    labour_name: '',
    transportType: 'Hydra',
    vehicle_number: '',
    vehicle_cost: 0,
    createdBy: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch vendors
        try {
          const vendorsRes = await axios.get('/api/vendor')
          const vendorsData = vendorsRes.data as {
            docs: { id: string; vendor: string; Company_no: string }[]
          }
          console.log('Vendors response:', vendorsData)
          const vendors = vendorsData.docs.map((v) => ({
            id: v.id,
            vendor: v.vendor,
            vendor_no: v.Company_no,
            name: v.vendor,
            Company_no: v.Company_no,
            address: '',
            mail_id: '',
            Mines_name: {
              id: 0,
              Mines_name: '',
              address: '',
              phone: [],
              mail_id: '',
            },
            phone: [],
            createdAt: '',
            updatedAt: '',
          }))
         // setVendors(vendors)
        } catch (vendorError) {
          console.error('Error fetching vendors:', vendorError)
        }

        // Fetch mines
        try {
          const minesRes = await axios.get<ApiResponse<Mines>>('/api/Mines')
          console.log('Mines response:', minesRes.data)
          const mines = minesRes.data.docs.map((m: Mines) => ({
            id: m.id,
            Mines_name: m.Mines_name,
            name: m.Mines_name,
          }))
         // setMines(mines)
        } catch (mineError) {
          console.error('Error fetching mines:', mineError)
        }
      } catch (error) {
        setError('Failed to load data. Please try again later.')
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // const updateMeasure = (index: number, field: keyof Measure, value: string | number) => {
  //   const newMeasures = [...newStone.addmeasures]
  //   newMeasures[index] = { ...newMeasures[index], [field]: Number(value) }

  //   // Calculate total volume from all measures
  //   const totalVolume = newMeasures.reduce((sum, m) => {
  //     const l = m.l || 0
  //     const b = m.b || 0
  //     const h = m.h || 0
  //     return sum + l * b * h
  //   }, 0)

  //   // Calculate block amount: total_quantity * (rate * total_volume)
  //   const blockAmount = (newStone.total_quantity || 0) * ((newStone.rate || 0) * totalVolume)
  //   // Calculate total amount: block_amount + vehicle_cost
  //   const totalAmount = blockAmount + (newStone.vehicle_cost || 0)

  //   setNewStone((prev) => ({
  //     ...prev,
  //     addmeasures: newMeasures,
  //     block_amount: blockAmount,
  //     total_amount: totalAmount,
  //     left_quantity: prev.total_quantity - prev.issued_quantity,
  //   }))
  // }

  // const addNewMeasure = () => {
  //   setNewStone((prev) => ({
  //     ...prev,
  //     addmeasures: [...prev.addmeasures, { qty: 0, l: 0, b: 0, h: 0, rate: 0 }],
  //   }))
  // }

  // const removeMeasure = (index: number) => {
  //   const newMeasures = newStone.addmeasures.filter((_, i) => i !== index)
  //   const totalQty = newMeasures.reduce((sum, m) => sum + (Number(m.qty) || 0), 0)

  //   setNewStone((prev) => ({
  //     ...prev,
  //     addmeasures: newMeasures,
  //     total_quantity: totalQty,
  //     left_quantity: totalQty - (prev.issued_quantity || 0),
  //   }))
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare the data in the format expected by the API
      const payload = {
        ...newStone,
        vender_id: Number(newStone.vender_id),
        mines: Number(newStone.mines),
        total_quantity: Number(newStone.total_quantity),
        issued_quantity: Number(newStone.issued_quantity),
        left_quantity: Number(newStone.left_quantity),
        rate: Number(newStone.rate),
        block_amount: Number(newStone.block_amount),
        total_amount: Number(newStone.total_amount),
        vehicle_cost: Number(newStone.vehicle_cost),
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
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <span className="text-indigo-600 dark:text-indigo-400">Add</span> New Stone
          </h1>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <span className="text-indigo-600 dark:text-indigo-400">Mines: </span>The Jodhpur Mines
          </h1>
        </div>
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

          

           

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Rate
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newStone.rate === 0 ? '' : newStone.rate}
                  onChange={(e) => {
                    const rate = Number(e.target.value)
                    setNewStone((prev) => {
                      const totalAmount = (prev.total_quantity || 0) * rate * (prev.vehicle_cost || 0)
                      
                      return {
                        ...prev,
                        rate: rate,
                        total_amount: totalAmount,
                      }
                    })
                  }}
                  defaultValue={1}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Total Quantity
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={newStone.total_quantity === 0 ? '' : newStone.total_quantity}
             defaultValue={1}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Munim
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={newStone.labour_name}
                onChange={(e) => setNewStone({ ...newStone, labour_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
               Loading: - Hydra
              </label>
             
            </div>
           
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Hydra Cost
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={newStone.vehicle_cost === 0 ? '' : newStone.vehicle_cost}
              defaultValue={1}
                required
              />
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
                    Block Amount
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{(newStone.block_amount || 0).toFixed(2)}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Total Amount  

                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{(newStone.total_amount || 0).toFixed(2)}
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
