'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

type Measure = { qty: number; l: number; b: number; h: number; rate: number }

type Stone = {
  id: string
  vender_id?: { name: string }
  stoneType: string
  date: string
  mines: { name: string }
  addmeasures: Measure[]
  total_quantity: number
  issued_quantity: number
  left_quantity: number
  final_total: number
  partyRemainingPayment: number
  partyAdvancePayment: number
  transportType: string
  createdBy: { name: string }
}

export default function StoneList() {
  const [stones, setStones] = useState<Stone[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ stoneType: '', date: '' })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const res = await axios.get('/api/stone')
      setStones(res.data.docs || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stone?')) return
    try {
      await axios.delete(`/api/stone/${id}`)
      fetchAllData()
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
      fetchAllData()
    } catch (err) {
      console.error(err)
      alert('Error updating stone')
    }
  }


  console.log("2222222222",stones)

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen mt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Stone Inventory</h1>
        <Link
          href="/stone/addstone"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add New Stone
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Vendor</th>
              <th className="px-6 py-4">Stone Type</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Final Total</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {stones.map((stone) => (
              <tr key={stone.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{stone.vender_id?.name || '-'}</td>

                <td className="px-6 py-4">
                  {editingId === stone.id ? (
                    <input
                      type="text"
                      value={editData.stoneType}
                      onChange={(e) =>
                        setEditData({ ...editData, stoneType: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    stone.stoneType
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingId === stone.id ? (
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) =>
                        setEditData({ ...editData, date: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    stone.date
                  )}
                </td>

                <td className="px-6 py-4">{stone.final_total}</td>

                <td className="px-6 py-4 flex gap-2">
                  {editingId === stone.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(stone.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(stone)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(stone.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}
