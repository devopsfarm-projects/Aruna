'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Block, Vendor, Mines, Measure } from './types'

import FormSection from './components/FormSection'
import TodiSection from './components/TodiSection'
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
  const [mines, setMines] = useState<Mines[]>([])
  const [newBlock, setNewBlock] = useState<Block>({
    vender_id: '',
    BlockType: '',
    date: '',
    mines: '',
    labour_name: '',
    qty: 0,
    vehicle_number: '',
    vehicle_cost: 0,
    todi: [],
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
      todi: [
        ...(prev.todi || []),
        {
          todicost: 0,
          addmeasures: [
            {
              qty: 0,
              l: 0,
              b: 0,
              h: 0,
              rate: 0
            }
          ]
        },
      ],
    }))
  }

  // Remove Todi section
  const removeTodi = (index: number) => {
    setNewBlock((prev) => ({
      ...prev,
      todi: prev.todi?.filter((_, i) => i !== index) || [],
    }))
  }

  // Update block field
  const updateBlock = (field: keyof Block, value: string | number) => {
    setNewBlock((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Update Todi measure
  const updateTodiMeasure = (
    todiIndex: number,
    measureIndex: number,
    field: keyof Measure | 'add' | 'remove',
    value: string | number,
  ) => {
    const newTodi = [...newBlock.todi]
    
    if (field === 'add') {
      newTodi[todiIndex].addmeasures = [...(newTodi[todiIndex].addmeasures || []), {
        l: 0,
        b: 0,
        h: 0,
        qty: 0,
      }]
    } else if (field === 'remove') {
      // Remove measure
      newTodi[todiIndex].addmeasures = newTodi[todiIndex].addmeasures.filter((_, i) => i !== measureIndex)
    } else {
      // Update existing measure
      const newMeasures = [...newTodi[todiIndex].addmeasures]
      newMeasures[measureIndex] = { ...newMeasures[measureIndex], [field]: Number(value) }
      newTodi[todiIndex].addmeasures = newMeasures
    }

    // Calculate final total
    const finalTotal = newTodi.reduce((sum, todi) => {
      return (
        sum +
        todi.addmeasures.reduce((tSum, m) => {
          const l = m.l || 0
          const b = m.b || 0
          const h = m.h || 0
          const todicost = todi.todicost || 0
          const qty = newBlock.qty || 0
          return tSum + l * b * h * qty * todicost
        }, 0)
      )
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

  // Remove a measure from a todi
  const removeMeasure = (todiIndex: number, measureIndex: number) => {
    const newTodi = [...newBlock.todi]
    newTodi[todiIndex].addmeasures = [
      ...newTodi[todiIndex].addmeasures.slice(0, measureIndex),
      ...newTodi[todiIndex].addmeasures.slice(measureIndex + 1)
    ]

    // Calculate final total
    let finalTotal = 0
    for (const todi of newTodi) {
      const todicost = todi.todicost || 0
      for (const measure of todi.addmeasures) {
        const l = measure.l || 0
        const b = measure.b || 0
        const h = measure.h || 0
        finalTotal += l * b * h * newBlock.qty * todicost
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

  // Update Todi cost
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
        finalTotal += l * b * h * newBlock.qty * todicost
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const blockToSubmit = {
        ...newBlock,
        total_quantity: newBlock.total_quantity,
        final_total: newBlock.final_total,
        partyRemainingPayment: newBlock.partyRemainingPayment,
        createdBy: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : '',
        vender_id: newBlock.vender_id || null,
        mines: newBlock.mines || null,
        todi:
          newBlock.todi?.map((t) => ({
            todicost: Number(t.todicost),
            addmeasures:
              t.addmeasures?.map((m) => ({
                qty: Number(m.qty),
                l: Number(m.l),
                b: Number(m.b),
                h: Number(m.h),
              })) || [],
          })) || [],
        qty: Number(newBlock.qty),
        issued_quantity: newBlock.issued_quantity ? Number(newBlock.issued_quantity) : null,
        left_quantity: newBlock.left_quantity ? Number(newBlock.left_quantity) : null,
        partyAdvancePayment: newBlock.partyAdvancePayment
          ? Number(newBlock.partyAdvancePayment)
          : null,
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
  }, [setVendors, setMines, setIsLoading, setError])



  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Block</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter block details and measurements
            </p>
          </div>
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Basic Block Information */}
            <div className="px-4 py-5 sm:p-6">
              <div className="grid  gap-6 ">
                <div className="col-span-2">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Block Information
                  </h2>
                  <FormSection block={newBlock} onChange={updateBlock} vendors={vendors} mines={mines} />
             
                </div>
              
              </div>
            </div>

            {/* Todi Section */}
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Todi Measurements
              </h2>
              <TodiSection
                todis={newBlock.todi}
                onRemove={removeTodi}
                onMeasureChange={updateTodiMeasure}
                onCostChange={updateTodiCost}
                onAddNewTodi={addNewTodi}
                onMeasureRemove={removeMeasure}
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Summary
                  </h3>
                  <Summary block={newBlock} />
                </div>

            {/* Action Buttons */}
            <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/block')}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
