'use client'

import React, { useState, ReactNode, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
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

interface Phone {
  number: string
  type?: string
}



interface Vendor {
  name: ReactNode
  id: string
  vendor: string
  vendor_no: string
  address: string
  Company_no: string
  phone: Phone[]
}

export default function VendorForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [newVendor, setNewVendor] = useState<Vendor>({
    id: '',
    vendor: '',
    vendor_no: '',
    address: '',
    Company_no: '',
    phone: [],
    name: '',
  })



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare the data in the format expected by the API
      const payload = {
        vendor_no: Number(newVendor.vendor_no),
        address: newVendor.address,
        vendor: newVendor.vendor,
      }

      console.log('Submitting data:', JSON.stringify(payload, null, 2))

      const response = await axios.post('/api/vendor', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        setShowSuccessModal(true)
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
    <div className="min-h-screen bg-gray-50 dark:bg-black py-6 flex flex-col justify-center sm:py-12">
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
                  router.push('/vendor')
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
                  router.push('/vendor')
                }}
                className="bg-blue-500 text-white px-4 py-2 -md hover:bg-blue-600 transition duration-200"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            <span className="text-indigo-600 dark:text-indigo-400">Add</span> New Vendor
          </h1>
          <Link
            href="/vendor"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600 transition"
          >
            ← Back to Vendor List
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 -2xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="vendor"
                  className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                >
                  Vendor Name
                </label>
                <input
                  id="vendor"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={newVendor.vendor}
                  onChange={(e) => setNewVendor({ ...newVendor, vendor: e.target.value })}
                  required
                  placeholder="Enter vendor name"
                />
              </div>

              <div>
                <label
                  htmlFor="vendor_no"
                  className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                >
                   Mobile No.
                </label>
                <div className="relative">
                  <input
                    id="vendor_no"
                    type="tel"
                    pattern="[0-9]{10,15}"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-8"
                    value={newVendor.vendor_no}
                    onChange={(e) => setNewVendor({ ...newVendor, vendor_no: e.target.value })}
                    required
                    placeholder="Enter vendor mobile number"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">📞</span>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={newVendor.address}
                onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                required
                placeholder="Enter address"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto bg-gray-600 dark:bg-gray-500 text-white px-4 py-2 -lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 text-sm sm:text-base"
              >
                <span className="font-medium">Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 -lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-medium">{isSubmitting ? 'Saving...' : 'Save Vendor'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
