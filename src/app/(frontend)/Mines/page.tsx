'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
  const [filteredMine, setFilteredMine] = useState<Mine[]>([])
  const [searchMine, setSearchMine] = useState('')

  const fetchMines = async () => {
    try {
      const res = await axios.get<{ docs: Mine[] }>('/api/Mines')
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

  useEffect(() => {
    const filtered = mines.filter((mine) =>
      mine.Mines_name?.toLowerCase().includes(searchMine.toLowerCase())
    )
    setFilteredMine(filtered)
  }, [mines, searchMine])

  return (
    <div className="max-w-7xl mx-auto p-4 pt-24 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between pt-24 items-start md:items-center gap-4 mb-8">
        <div className="w-full md:w-2/3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Search Mine
          </label>
          <input
            type="text"
            value={searchMine}
            onChange={(e) => setSearchMine(e.target.value)}
            placeholder="Search by mine name..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <Link href="/Mines/addmine">
          <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition">
            Add New Mine
          </button>
        </Link>
      </div>

      {/* Data Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="p-3 text-center">S.No.</th>
                <th className="p-3">Mine Name</th>
                <th className="p-3">Address</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-100">
              {filteredMine.map((mine, index) => (
                <tr
                  key={mine.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-3 text-center">{index + 1}</td>
                  <td className="p-3 font-medium">{mine.Mines_name || '-'}</td>
                  <td className="p-3">{mine.address || '-'}</td>
                  <td className="p-3">
                    <ul className="list-disc list-inside space-y-1">
                      {mine.phone?.map((p, i) => <li key={i}>{p.number}</li>)}
                    </ul>
                  </td>
                  <td className="p-3">{mine.mail_id || '-'}</td>
                  <td className="p-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/Mines/edit?id=${mine.id}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(mine.id)}
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredMine.map((mine, index) => (
            <div
              key={mine.id}
              className="rounded-xl border border-gray-300 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 shadow"
            >
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">#{index + 1}</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{mine.Mines_name}</div>
              <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                <strong>Address:</strong> {mine.address}
              </p>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                <strong>Phone:</strong>
                <ul className="list-disc list-inside mt-1">
                  {mine.phone?.map((p, i) => <li key={i}>{p.number}</li>)}
                </ul>
              </p>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> {mine.mail_id}
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <Link
                  href={`/Mines/edit?id=${mine.id}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(mine.id)}
                  className="text-red-600 dark:text-red-400 hover:underline text-sm"
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
