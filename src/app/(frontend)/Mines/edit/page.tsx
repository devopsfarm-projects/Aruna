'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { FaArrowLeft, FaPlus, FaSave, FaTrash } from 'react-icons/fa'
import { useRouter, useSearchParams } from 'next/navigation'

interface Mine {
  id: string
  Mines_name: string
  address: string
  phone: Array<{ number: string }>
  mail_id: string
}

export default function EditMine() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mine, setMine] = useState<Mine | null>(null)
  const [loading, setLoading] = useState(true)
  const id = searchParams.get('id')

  useEffect(() => {
    const fetchMine = async () => {
      if (!id) return
      try {
        const res = await axios.get<Mine>(`/api/Mines/${id}`)
        setMine(res.data)
      } catch (error) {
        console.error('Error fetching mine:', error)
        alert('Error loading mine data')
      } finally {
        setLoading(false)
      }
    }
    fetchMine()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mine || !id) return
    try {
      await axios.patch(`/api/Mines/${id}`, mine)
      alert('Mine updated successfully')
      router.push('/Mines')
    } catch (error) {
      console.error('Error updating vendor:', error)
      alert('Error updating vendor')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-700 dark:text-gray-300">Loading...</div>
  }

  if (!mine) {
    return <div className="flex justify-center items-center min-h-screen text-gray-700 dark:text-gray-300">Mine not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Edit Mine
          </h1>
          <Link
            href="/Mines"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-sm sm:text-base"
          >
            ← Back to Mines List
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mine Name */}
          <div>
            <label
              htmlFor="mine-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Mine Name
            </label>
            <input
              id="mine-name"
              type="text"
              value={mine.Mines_name}
              onChange={(e) => setMine({ ...mine, Mines_name: e.target.value })}
              required
              placeholder="Enter mine name"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={mine.mail_id}
              onChange={(e) => setMine({ ...mine, mail_id: e.target.value })}
              required
              placeholder="Enter email address"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Address
            </label>
            <textarea
              id="address"
              value={mine.address}
              onChange={(e) => setMine({ ...mine, address: e.target.value })}
              rows={4}
              required
              placeholder="Enter mine address"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Phone Numbers */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Phone Numbers
            </label>
            <div className="space-y-4">
              {mine.phone.map((phone, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <input
                    type="text"
                    value={phone.number}
                    onChange={(e) => {
                      const newPhones = [...mine.phone]
                      newPhones[index].number = e.target.value
                      setMine({ ...mine, phone: newPhones })
                    }}
                    required
                    placeholder="Enter phone number"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                  {mine.phone.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newPhones = mine.phone.filter((_, i) => i !== index)
                        setMine({ ...mine, phone: newPhones })
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaTrash className="h-4 w-4" />
                      <span className="text-sm font-medium">Remove</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setMine({
                  ...mine,
                  phone: [...mine.phone, { number: '' }],
                })
              }
              className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              <FaPlus className="h-5 w-5" />
              Add Phone Number
            </button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => router.push('/Mines')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              <FaArrowLeft className="h-5 w-5" />
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              <FaSave className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
