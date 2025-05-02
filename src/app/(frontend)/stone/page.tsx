'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

type Stone = {
  id: string
  vender_id?: { name: string }
  stoneType: string
  date: string
}

export default function StoneListPage() {
  const [stones, setStones] = useState<Stone[]>([])
  const [newStone, setNewStone] = useState({ vender_id: '', stoneType: '', date: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ stoneType: '', date: '' })

  useEffect(() => {
    fetchStones()
  }, [])

  const fetchStones = async () => {
    try {
      const res = await axios.get('/api/stone')
      setStones(res.data.docs || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleAdd = async () => {
    if (!newStone.vender_id || !newStone.stoneType || !newStone.date) return alert('Fill all fields')
    try {
      await axios.post('/api/stone', newStone)
      setNewStone({ vender_id: '', stoneType: '', date: '' })
      fetchStones()
    } catch (err) {
      console.error(err)
      alert('Error adding stone')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stone?')) return
    try {
      await axios.delete(`/api/stone/${id}`)
      fetchStones()
    } catch (err) {
      console.error(err)
      alert('Error deleting stone')
    }
  }

  const handleEdit = (stone: Stone) => {
    setEditingId(stone.id)
    setEditData({ stoneType: stone.stoneType, date: stone.date })
  }

  const handleUpdate = async (id: string) => {
    try {
      await axios.put(`/api/stone/${id}`, editData)
      setEditingId(null)
      fetchStones()
    } catch (err) {
      console.error(err)
      alert('Error updating stone')
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Stones</h1>

      {/* Add Stone Form */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Vendor Name"
          value={newStone.vender_id}
          onChange={(e) => setNewStone({ ...newStone, vender_id: e.target.value })}
          className="border px-3 py-2 rounded w-full md:w-1/4"
        />
        <input
          type="text"
          placeholder="Stone Type"
          value={newStone.stoneType}
          onChange={(e) => setNewStone({ ...newStone, stoneType: e.target.value })}
          className="border px-3 py-2 rounded w-full md:w-1/4"
        />
        <input
          type="date"
          value={newStone.date}
          onChange={(e) => setNewStone({ ...newStone, date: e.target.value })}
          className="border px-3 py-2 rounded w-full md:w-1/4"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full md:w-auto"
        >
          Add Stone
        </button>
      </div>

      {/* Stone List */}
      <div className="grid gap-4">
        {stones.map((stone) => (
          <div key={stone.id} className="p-4 bg-white shadow-md rounded-xl flex justify-between items-start flex-wrap gap-4">
            {editingId === stone.id ? (
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <p><strong>Vendor:</strong> {stone.vender_id?.name || 'N/A'}</p>
                <input
                  type="text"
                  value={editData.stoneType}
                  onChange={(e) => setEditData({ ...editData, stoneType: e.target.value })}
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  className="border px-2 py-1 rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(stone.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p><strong>Vendor:</strong> {stone.vender_id?.name || 'N/A'}</p>
                  <p><strong>Stone Type:</strong> {stone.stoneType}</p>
                  <p><strong>Date:</strong> {stone.date}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(stone)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(stone.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
