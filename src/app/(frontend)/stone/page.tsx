'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function StoneListPage() {
  const [stones, setStones] = useState([])

  useEffect(() => {
    axios.get('/api/stone') // Make sure you have an API route or direct Payload URL with auth
      .then(res => setStones(res.data.docs))
      .catch(err => console.error(err))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return
    await axios.delete(`/api/stone/${id}`)
    setStones(stones.filter(s => s.id !== id))
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Stones</h1>
      <div className="grid gap-4">
        {stones.map((stone: any) => (
          <div key={stone.id} className="p-4 bg-white shadow-md rounded-xl">
            <p><strong>Vendor ID:</strong> {stone.vender_id?.name || 'N/A'}</p>
            <p><strong>Stone Type:</strong> {stone.stoneType}</p>
            <p><strong>Date:</strong> {stone.date}</p>
            <div className="mt-2 flex gap-4">
              <Link
                href={`/stone/${stone.id}/edit`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(stone.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
