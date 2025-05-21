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
    qty: 0,
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
    <div className="container max-w-7xl pt-28 mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Block</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSection block={newBlock} onChange={updateBlock} vendors={vendors} mines={mines} />
       
        </div>
        <TodiSection
            todis={newBlock.todi}
            onRemove={removeTodi}
            onMeasureChange={updateTodiMeasure}
            onCostChange={updateTodiCost}
            onAddNewTodi={addNewTodi}
          />
        <Summary block={newBlock} />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/Block')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Cancel
          </button>
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
  )
}
