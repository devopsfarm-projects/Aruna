'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { GiGoldMine } from 'react-icons/gi'
import Link from 'next/link'

interface Mine {
  id: string
  Mines_name: string
  address: string
  mail_id: string
  phone: Array<{ number: string }>
}

export default function MinesPage() {
  const [mines, setMines] = useState<Mine[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMines = async () => {
    try {
      const res = await axios.get('/api/Mines')
      setMines(res.data.docs || [])
    } catch (error) {
      console.error('Error fetching mines:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMines()
  }, [])

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Mines Directory</h1>
        <Link href="/Mines/addmine">
          <button className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-primary-500 dark:bg-primary-600 text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-primary-600 dark:hover:bg-primary-700 transition">
            <GiGoldMine className="w-5 h-5" />
            Add Mine
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 dark:border-primary-600"></div>
        </div>
      ) : mines.length === 0 ? (
        <div className="text-center py-10">
          <GiGoldMine className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No mines found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Get started by adding your first mine</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mines.map((mine) => (
            <div
              key={mine.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 p-3 rounded-full mr-4">
                  <GiGoldMine className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{mine.Mines_name}</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="w-8 text-gray-500 dark:text-gray-400">Address:</span>
                  <p className="text-gray-700 dark:text-gray-300">{mine.address}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-8 text-gray-500 dark:text-gray-400">Email:</span>
                  <p className="text-gray-700 dark:text-gray-300">{mine.mail_id}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400">Phones:</span>
                  <ul className="list-disc list-inside pl-2 text-gray-700 dark:text-gray-300">
                    {mine.phone?.map((p: any, i: number) => (
                      <li key={i}>{p.number}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
