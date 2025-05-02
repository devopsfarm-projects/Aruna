'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'

export default function EditStone() {
  const { id } = useParams()
  const router = useRouter()
  const [stone, setStone] = useState<any>(null)

  useEffect(() => {
    axios.get(`/api/stone/${id}`)
      .then(res => setStone(res.data))
      .catch(err => console.error(err))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await axios.patch(`/api/stone/${id}`, stone)
    alert('Stone updated successfully')
    router.push('/stone')
  }

  if (!stone) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">Edit Stone</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Stone Type</label>
          <input
            type="text"
            value={stone.stoneType}
            onChange={e => setStone({ ...stone, stoneType: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            value={stone.date?.slice(0, 10) || ''}
            onChange={e => setStone({ ...stone, date: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  )
}
