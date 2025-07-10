'use client'

import React, { useState } from 'react'
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
import { Message } from '../../components/Message'

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
  munim: string
  transportType: string
  vehicle_number: string
  hydra_cost: number
  createdBy: string
}

export default function AddStonePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [newStone, setNewStone] = useState<Stone>({
    vender_id: '',
    stoneType: '',
    date: new Date().toISOString(),
    mines: '',
    addmeasures: [],
    total_quantity: 1,
    issued_quantity: 1,
    left_quantity: 1,
    rate: 1,
    block_amount: 1,
    total_amount: 1,
    munim: '',
    transportType: 'Hydra',
    vehicle_number: '',
    hydra_cost: 1,
    createdBy: '',
  })

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
        hydra_cost: Number(newStone.hydra_cost),
      }

      console.log('Submitting data:', JSON.stringify(payload, null, 2))

      const response = await axios.post('/api/stone', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        setShowSuccessMessage(true)
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
            setErrorMessage(`Validation errors:\n${errorMessages}`)
            setShowErrorMessage(true)
          } else if (error.response.data.message) {
            setErrorMessage(`Failed to add stone. ${error.response.data.message}`)
            setShowErrorMessage(true)
          }
        } else {
          setErrorMessage('An unknown error occurred. Please check the console for details.')
          setShowErrorMessage(true)
        }
      } else {
        setErrorMessage('An unknown error occurred. Please check the console for details.')
        setShowErrorMessage(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }



 const [errorMessage, setErrorMessage] = useState('')

if (showErrorMessage) {
  return (
    <Message 
      setShowMessage={setShowErrorMessage} 
      type='error' 
      message={errorMessage}
    />
  )
}



  if (showSuccessMessage) {
    return (
     <Message 
     setShowMessage={setShowSuccessMessage} 
     path={'/stone'} 
     type='success' 
     message='Stone has been added successfully.'
   />
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-24">
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
              Vendor added successfully!
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <span className="text-indigo-600 dark:text-indigo-400">Add</span> New Stone
          </h1>
        </div>
        <div className="bg-white dark:bg-gray-800 -2xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stone Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Stone Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newStone.stoneType}
                  onChange={(e) => setNewStone({ ...newStone, stoneType: e.target.value })}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Khanda">Khanda</option>
                  <option value="Gudiya">Gudiya</option>
                </select>
              </div>

           

              {/* Rate */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                    value={newStone.rate === 0 ? '' : newStone.rate}
                    onChange={(e) => {
                      const rate = Number(e.target.value)
                      setNewStone((prev) => {
                        const totalAmount =
                          (prev.total_quantity || 0) * rate * (prev.hydra_cost || 0)
                        return {
                          ...prev,
                          rate: rate,
                          total_amount: totalAmount,
                        }
                      })
                    }}
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    ₹
                  </span>
                </div>
              </div>

              {/* Total Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Total Quantity
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newStone.total_quantity || ''}
                  onChange={(e) => {
                    const quantity = Number(e.target.value) || 0
                    setNewStone((prev) => {
                      const totalAmount = quantity * (prev.rate || 0) * (prev.hydra_cost || 0)
                      return {
                        ...prev,
                        total_quantity: quantity,
                        total_amount: totalAmount,
                      }
                    })
                  }}
                  min="0"
                  required
                  placeholder="Enter quantity"
                />
              </div>

              {/* Munim */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Munim
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newStone.munim}
                  onChange={(e) => setNewStone({ ...newStone, munim: e.target.value })}
                  required
                />
              </div>

              {/* Hydra Cost */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Hydra Cost
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                    value={newStone.hydra_cost || ''}
                    onChange={(e) => {
                      const cost = Number(e.target.value) || 0
                      setNewStone((prev) => {
                        const totalAmount = (prev.total_quantity || 0) * (prev.rate || 0) * cost
                        return {
                          ...prev,
                          hydra_cost: cost,
                          total_amount: totalAmount,
                        }
                      })
                    }}
                    min="0"
                    required
                    placeholder="Enter cost"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    ₹
                  </span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-100 dark:bg-gray-700 -lg p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                <span className="text-indigo-600 dark:text-indigo-400">Summary</span>
              </h3>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 -lg shadow-sm">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Total Quantity
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {newStone.total_quantity.toFixed(2)}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 -lg shadow-sm">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Rate
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{(newStone.rate || 0).toFixed(2)}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 -lg shadow-sm">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Hydra Cost
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{(newStone.hydra_cost || 0).toFixed(2)}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 -lg shadow-sm">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Total Amount
                  </div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    ₹{(newStone.total_amount || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full md:w-auto bg-gray-600 dark:bg-gray-500 text-white px-4 py-2 -lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 text-sm md:text-base"
              >
                <span className="font-medium">Cancel</span>
              </button>
              <button
                type="submit"
                className="w-full md:w-auto bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 -lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 text-sm md:text-base"
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
