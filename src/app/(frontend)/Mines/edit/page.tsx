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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!mine) {
    return <div className="flex justify-center items-center min-h-screen">Mine not found</div>
  }

  console.log(mine)

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Mine
          </h1>
          <Link href="/Mines" className="text-gray-600 hover:text-gray-800">
            ← Back to Mines List
          </Link>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Mine Name</label>
                      <input
                        type="text"
                        value={mine.Mines_name}
                        onChange={(e) => setMine({ ...mine, Mines_name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                        placeholder="Enter mine name"
                      />
                    </div>
      
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
                      <input
                        type="email"
                        value={mine.mail_id}
                        onChange={(e) => setMine({ ...mine, mail_id: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
      
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Address</label>
                      <textarea
                        value={mine.address}
                        onChange={(e) => setMine({ ...mine, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        rows={4}
                        required
                        placeholder="Enter mine address"
                      />
                    </div>
      
                    <div className="space-y-4">
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Phone Numbers</label>
                      <div className="space-y-3">
                        {mine.phone.map((phone, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <input
                              type="text"
                              value={phone.number}
                              onChange={(e) => {
                                const newPhones = [...mine.phone]
                                newPhones[index].number = e.target.value
                                setMine({ ...mine, phone: newPhones })
                              }}
                              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                              required
                              placeholder="Enter phone number"
                            />
                            {mine.phone.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newPhones = mine.phone.filter((_, i) => i !== index)
                                  setMine({ ...mine, phone: newPhones })
                                }}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                              >
                                <FaTrash className="h-4 w-4 mr-2" />
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setMine({
                              ...mine,
                              phone: [...mine.phone, { number: '' }],
                            })
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                          <FaPlus className="h-4 w-4 mr-2" />
                          Add Phone Number
                        </button>
                      </div>
                    </div>
                  </div>
      
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => router.push('/Mines')}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                    >
                      <FaArrowLeft className="h-5 w-5 mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                    >
                      <FaSave className="h-5 w-5 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
      </div>
    </div>
  )
}
