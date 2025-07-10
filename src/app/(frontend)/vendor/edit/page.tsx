'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { Message } from '../../components/Message'

interface Vendor {
  id: number
  vendor: string
  vendor_no: string
  address: string
}

export default function EditVendor() {
  const id = useSearchParams().get('id')
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
const [showSuccessMessage, setShowSuccessMessage] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (!id) return
    axios.get<Vendor>(`/api/vendor/${id}`).then(res => {
      setVendor(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendor) return
    try {
      await axios.patch(`/api/vendor/${vendor.id}`, vendor)
      setShowSuccessMessage(true)
    } catch (err) {
    setErrorMessage('Update failed')
    setShowErrorMessage(true)
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
        message='Vendor has been updated successfully.'
      />
    )
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!vendor) return <div className="min-h-screen flex items-center justify-center">Vendor not found</div>

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 dark:bg-black">
      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <p className="text-center text-gray-800 dark:text-gray-200 mb-4">Vendor updated successfully!</p>
            <button
              onClick={() => router.push('/vendor')}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Vendor</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
            type="text"
            value={vendor.vendor}
            onChange={(e) => setVendor({ ...vendor, vendor: e.target.value })}
            placeholder="Vendor Name"
            required
          />
          <input
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
            type="tel"
            value={vendor.vendor_no}
            onChange={(e) => setVendor({ ...vendor, vendor_no: e.target.value })}
            placeholder="Mobile No"
            required
          />
          <input
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
            type="text"
            value={vendor.address}
            onChange={(e) => setVendor({ ...vendor, address: e.target.value })}
            placeholder="Address"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
