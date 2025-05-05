'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { GiGoldMine } from 'react-icons/gi'
import Link from 'next/link'

export default function MinesPage() {
  const [mines, setMines] = useState<any[]>([])
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
    <div className="p-6 bg-slate-600 rounded-2xl mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-100">Mines Directory</h1>
        <Link href="/Mines">
          <button className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-yellow-400 text-black font-semibold px-5 py-2 rounded-xl shadow hover:bg-yellow-500 transition">
            + Add Mine
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-white text-lg py-10">Loading mines data...</div>
      ) : mines.length === 0 ? (
        <div className="text-center text-white text-lg py-10">No mines found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mines.map((mine) => (
            <div
              key={mine.id}
              className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-full mr-4">
                  <GiGoldMine size={28} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{mine.Mines_name}</h2>
              </div>
              <div className="text-gray-700 space-y-1">
                <p><span className="font-semibold">Address:</span> {mine.address}</p>
                <p><span className="font-semibold">Email:</span> {mine.mail_id}</p>
                <div>
                  <p className="font-semibold">Phones:</p>
                  <ul className="list-disc list-inside pl-2">
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
