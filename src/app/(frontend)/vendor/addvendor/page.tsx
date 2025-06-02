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

// API response types
interface MinesApiResponse {
  docs: Mines[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
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
  id: string
  vendor: string
  vendor_no: string
  address: string
  mail_id: string
  Company_no: string
  Mines_name: string
  phone: Phone[]
  createdAt: string
  updatedAt: string
}

export default function VendorForm() {
  const router = useRouter()
  const [mines, setMines] = useState<Mines[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [, setIsLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [newVendor, setNewVendor] = useState<Vendor>({
    id: '',
    vendor: '',
    vendor_no: '',
    address: '',
    mail_id: '',
    Company_no: '',
    Mines_name: '',
    phone: [],
    createdAt: '',
    updatedAt: '',
    name: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // Fetch mines
        try {
          const minesRes = await axios.get<MinesApiResponse>('/api/Mines')
          console.log('Mines response:', minesRes.data)
          const Mines_name = minesRes.data.docs.map((m: Mines) => ({
            id: m.id,
            Mines_name: m.Mines_name,
            name: m.Mines_name,
            address: m.address || '',
            phone: m.phone || [],
            mail_id: m.mail_id || '',
            createdAt: m.createdAt || '',
            updatedAt: m.updatedAt || '',
          }))
          setMines(Mines_name)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare the data in the format expected by the API
      const payload = {
        ...newVendor,
        Mines_name: Number(newVendor.Mines_name),
        vendor_no: Number(newVendor.vendor_no),
        Company_no: Number(newVendor.Company_no),
        address: newVendor.address,
        vendor: newVendor.vendor,
        mail_id: newVendor.mail_id,
      }

      console.log('Submitting data:', JSON.stringify(payload, null, 2))

      const response = await axios.post('/api/vendor', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        alert('Vendor added successfully!')
        router.push('/vendor')
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
          alert('Failed to add vendor. Please check the console for details.')
        }
      } else {
        alert('An unknown error occurred. Please check the console for details.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 sm:pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-white">
          <span className="text-indigo-600 dark:text-indigo-400">Add</span> New Vendor
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Mines Select */}
              {/* <div>
                <label
                  htmlFor="mine"
                  className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
                >
                  Mine
                </label>
                <select
                  id="mine"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={newVendor.Mines_name ?? ''}
                  onChange={(e) => {
                    const selectedMine = mines.find((m) => m.id === parseInt(e.target.value))
                    setNewVendor({
                      ...newVendor,
                      Mines_name: selectedMine ? selectedMine.id.toString() : '',
                    })
                  }}
                  required
                  disabled={mines.length === 0}
                >
                  <option value="">
                    {mines.length === 0 ? 'Loading mines...' : 'Select Mine'}
                  </option>
                  {mines.map((mine) => (
                    <option key={mine.id} value={mine.id}>
                      {mine.name}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Vendor Name */}
              <div>
                <label
                  htmlFor="vendor"
                  className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
                >
                  Vendor Name
                </label>
                <input
                  id="vendor"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={newVendor.vendor}
                  onChange={(e) => setNewVendor({ ...newVendor, vendor: e.target.value })}
                  required
                  placeholder="Enter vendor name"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={newVendor.address}
                onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                required
                placeholder="Enter address"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Vendor Mobile No */}
              <div>
                <label
                  htmlFor="vendor_no"
                  className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
                >
                  Vendor Mobile No.
                </label>
                <input
                  id="vendor_no"
                  type="tel"
                  pattern="[0-9]{10,15}"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={newVendor.vendor_no}
                  onChange={(e) => setNewVendor({ ...newVendor, vendor_no: e.target.value })}
                  required
                  placeholder="Enter vendor mobile number"
                />
              </div>

              {/* Company Mobile No */}
              {/* <div>
                <label
                  htmlFor="company_no"
                  className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
                >
                  Company Mobile No.
                </label>
                <input
                  id="company_no"
                  type="tel"
                  pattern="[0-9]{10,15}"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={newVendor.Company_no}
                  onChange={(e) => setNewVendor({ ...newVendor, Company_no: e.target.value })}
                  required
                  placeholder="Enter company mobile number"
                />
              </div> */}
            </div>

            {/* Mail ID */}
            {/* <div>
              <label
                htmlFor="mail_id"
                className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                id="mail_id"
                type="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={newVendor.mail_id}
                onChange={(e) => setNewVendor({ ...newVendor, mail_id: e.target.value })}
                required
                placeholder="Enter email address"
              />
            </div> */}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto bg-gray-600 dark:bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <span className="font-semibold">Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-semibold">{isSubmitting ? 'Saving...' : 'Save Vendor'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
