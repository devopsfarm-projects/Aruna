'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { GiGoldMine } from 'react-icons/gi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Mines from '@/collections/Mines'

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
  const [filteredMine, setFilteredMine] = useState<Mine[]>([])
  const [searchMine, setSearchMine] = useState('')
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

  useEffect(() => {
    const filtered = mines.filter((mine) => {
      const mineMatch = !searchMine || 
        mine.Mines_name?.toLowerCase().includes(searchMine.toLowerCase())
      return  mineMatch
    })
    setFilteredMine(filtered)
  }, [ mines, searchMine])


  return (
    <div className="p-8 max-w-7xl pt-24 mx-auto">
      <div className="flex flex-col gap-8">
         <div className="flex flex-col md:flex-row justify-between items-center  gap-4">
                  <div >
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Search Mine
                      </label>
                      <input
                        type="text"
                        value={searchMine}
                        onChange={(e) => setSearchMine(e.target.value)}
                        placeholder="Search by mine name..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  </div>
                  <Link   href="/Mines/addmine">
                    <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
                      <span className="text-sm font-medium">Add New Mine</span>
                    </button>
                  </Link>
                </div>
    

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="p-4 text-center">S.No.</th>
                <th className="p-4 text-left">Mines_name</th>
                <th className="p-4 text-left">address</th>
                <th className="p-4 text-left">Phone Number</th>
                <th className="p-4 text-left">mail_id</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 dark:text-white">
              {filteredMine.map((mine, index) => (
                <tr
                  key={mine.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-4 text-center">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{mine.Mines_name || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{mine.address || '-'}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="font-medium">
                      {' '}
                      {mine.phone?.map((p, i) => <li key={i}>{p.number}</li>)}
                    </span>
                  </td>

                  <td className="p-4">
                    <span>{mine.mail_id}</span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEdit(mine)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(mine.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
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
      </div>
    </div>
  )
}
