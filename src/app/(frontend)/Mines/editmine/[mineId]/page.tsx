'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { GiGoldMine } from 'react-icons/gi'

interface Mine {
  id: string
  Mines_name: string
  address: string
  phone: Array<{ number: string }>
  mail_id: string
}

export default function EditMinePage() {
  const params = useParams()
  const router = useRouter()
  const [mine, setMine] = useState<Mine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const res = await axios.get(`/api/Mines/${params.mineId}`)
        setMine(res.data)
      } catch (err) {
        setError('Failed to fetch mine data')
        console.error('Error fetching mine:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.mineId) {
      fetchMine()
    }
  }, [params.mineId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mine) return

    try {
      await axios.patch(`/api/Mines/${mine.id}`, {
        Mines_name: mine.Mines_name,
        address: mine.address,
        phone: mine.phone,
        mail_id: mine.mail_id,
      })
      router.push('/Mines')
    } catch (err) {
      setError('Failed to update mine')
      console.error('Error updating mine:', err)
    }
  }

  if (loading) return <div className="text-gray-900 dark:text-white">Loading...</div>
  if (error) return <div className="text-red-600 dark:text-red-400">Error: {error}</div>
  if (!mine) return <div className="text-gray-900 dark:text-white">Mine not found</div>

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <GiGoldMine className="text-2xl text-yellow-500 dark:text-yellow-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Mine</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Mine Name</label>
            <input
              type="text"
              value={mine.Mines_name}
              onChange={(e) => setMine({ ...mine, Mines_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Address</label>
            <textarea
              value={mine.address}
              onChange={(e) => setMine({ ...mine, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Phone Numbers</label>
            <div className="space-y-3">
              {mine.phone.map((phone, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={phone.number}
                    onChange={(e) => {
                      const newPhones = [...mine.phone]
                      newPhones[index].number = e.target.value
                      setMine({ ...mine, phone: newPhones })
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {mine.phone.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newPhones = mine.phone.filter((_, i) => i !== index)
                        setMine({ ...mine, phone: newPhones })
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                    >
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
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
              >
                Add Phone Number
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={mine.mail_id}
              onChange={(e) => setMine({ ...mine, mail_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/Mines')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
