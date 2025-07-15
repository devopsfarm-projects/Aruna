'use client'

import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Message } from '../../components/Message'

interface Vendor {
  id: string
  vendor: string
  vendor_no: string
  address: string
  Company_no: string
  phone: { number: string }[]
  name: string
}

export default function VendorForm() {
  const router = useRouter()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
const [errorMessage, setErrorMessage] = useState('')
const [showErrorMessage, setShowErrorMessage] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
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
      const response = await axios.post('/api/vendorpost', {
        vendor: newVendor.vendor,
        vendor_no: newVendor.vendor_no,
        address: newVendor.address,
      })

      if (response.status === 201) setShowSuccessModal(true)
    } catch (err) {
    setErrorMessage('Failed to add vendor.')
    setShowErrorMessage(true)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

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
        path={'/vendor'} 
        type='success' 
        message='Vendor has been added successfully.'
      />
    )
  }

  return (
    <div className="min-h-screen py-6 px-4">
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-black p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Vendor added successfully!</h2>
            <button
              onClick={() => {
                setShowSuccessModal(false)
                router.push('/vendor')
              }}
              className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Add Vendor</h1>
          <Link href="/vendor" className="text-blue-500 text-sm">← Back</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-black p-4 rounded shadow">
          <input
            type="text"
            placeholder="Vendor Name"
            value={newVendor.vendor}
            onChange={(e) => setNewVendor({ ...newVendor, vendor: e.target.value })}
            required
            className="w-full border dark:bg-gray-600 px-3 py-2 rounded"
          />
          <input
            type="tel"
            placeholder="Mobile No."
            pattern="[0-9]{10,15}"
            value={newVendor.vendor_no}
            onChange={(e) => setNewVendor({ ...newVendor, vendor_no: e.target.value })}
            required
            className="w-full border dark:bg-gray-600 px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={newVendor.address}
            onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
            required
            className="w-full border dark:bg-gray-600 px-3 py-2 rounded"
          />

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
