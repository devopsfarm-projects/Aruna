'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { GiGoldMine } from 'react-icons/gi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Mine {
  id: string
  Mines_name: string
  address: string
  phone: Array<{ number: string }>
  mail_id: string
}

export default function MinesPage() {
  const [mines, setMines] = useState<Mine[]>([])
  const router = useRouter()

  // Fetch Mines
  const fetchMines = async () => {
    try {
      const res = await axios.get('/api/Mines')
      setMines(res.data.docs || [])
    } catch (error) {
      console.error('Error fetching mines:', error)
    }
  }

  useEffect(() => {
    fetchMines()
  }, [])


  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this mine?')) {
      try {
        await axios.delete(`/api/Mines/${id}`)
        fetchMines()
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  const handleEdit = async (mine: Mine) => {
    // Navigate to edit page with mine data
    router.push(`/Mines/editmine/${mine.id}`)
  }

  return (
    <div className="p-8 max-w-7xl pt-24 mx-auto">
      <div className="flex flex-col gap-8">
  <Link href="/Mines/addmine">
  <button className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-primary-500 dark:bg-primary-600 text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-primary-600 dark:hover:bg-primary-700 transition">
            Add Mine
  </button> 
  </Link>

        {/* List Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mines.map((mine) => (
            <div
              key={mine.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full mr-4">
                  <GiGoldMine className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{mine.Mines_name}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="w-12 text-gray-500 dark:text-gray-400">Address:</span>
                  <p className="text-gray-700 dark:text-gray-300">{mine.address}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-12 text-gray-500 dark:text-gray-400">Email:</span>
                  <p className="text-gray-700 dark:text-gray-300">{mine.mail_id}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400">Phones:</span>
                  <ul className="list-disc list-inside pl-2 text-gray-700 dark:text-gray-300">
                    {mine.phone?.map((p, i) => (
                      <li key={i}>{p.number}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleEdit(mine)}
                  className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(mine.id)}
                  className="flex-1 bg-red-600 dark:bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
