'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

type Measure = { qty: number; l: number; b: number; h: number; rate: number; labour?: string; hydra?: string }

type Stone = {
  id: number | string
  vender_id: {
    id: number
    vendor: string
    vendor_no: string
    address: string
    mail_id: string
    Company_no: string
    Mines_name: {
      id: number
      Mines_name: string
      address: string
      phone: { number: string }[]
      mail_id: string
    }
  }
  stoneType: string
  date: string
  mines: {
    id: number
    Mines_name: string
    address: string
    phone: { number: string }[]
    mail_id: string
  }
  addmeasures: Measure[]
  total_quantity: number | null
  issued_quantity: number | null
  left_quantity: number | null
  final_total: number
  partyRemainingPayment: number
  partyAdvancePayment: number | null
  transportType: string | null
  createdBy: { name: string } | null
  createdAt: string
  updatedAt: string
}

export default function StoneList() {
  const [stones, setStones] = useState<Stone[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Stone>>({ 
    stoneType: '', 
    date: '',
    mines: undefined,
    vender_id: {
      id: 0,
      vendor: '',
      vendor_no: '',
      address: '',
      mail_id: '',
      Company_no: '',
      Mines_name: {
        id: 0,
        Mines_name: '',
        address: '',
        phone: [],
        mail_id: ''
      }
    },
    addmeasures: [],
    total_quantity: undefined,
    issued_quantity: undefined,
    left_quantity: undefined,
    final_total: undefined,
    partyRemainingPayment: undefined,
    partyAdvancePayment: undefined,
    transportType: undefined
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const res = await axios.get<{ docs: Stone[] }>('/api/stone')
      console.log('Fetched stones:', res.data.docs)
      setStones(res.data.docs || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const handleDelete = async (id: string | number) => {
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
    setEditingId(stone.id?.toString())
    setEditData({
      stoneType: stone.stoneType,
      date: stone.date,
      mines: stone.mines, 
      vender_id: stone.vender_id,
      addmeasures: stone.addmeasures,
      total_quantity: stone.total_quantity,
      issued_quantity: stone.issued_quantity,
      left_quantity: stone.left_quantity,
      final_total: stone.final_total,
      partyRemainingPayment: stone.partyRemainingPayment,
      partyAdvancePayment: stone.partyAdvancePayment,
      transportType: stone.transportType
    })
  }

  const handleUpdate = async (id: string | number) => {
    try {
      await axios.put(`/api/stone/${id}`, {
        stoneType: editData.stoneType,
        date: editData.date,
        mines: editData.mines,
        vender_id: editData.vender_id,
        addmeasures: editData.addmeasures,
        total_quantity: editData.total_quantity,
        issued_quantity: editData.issued_quantity,
        left_quantity: editData.left_quantity,
        final_total: editData.final_total,
        partyRemainingPayment: editData.partyRemainingPayment,
        partyAdvancePayment: editData.partyAdvancePayment,
        transportType: editData.transportType
      })
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
              <th className="px-6 py-4">Mine</th>
              <th className="px-6 py-4">Stone Type</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total Qty</th>
              <th className="px-6 py-4">Issued Qty</th>
              <th className="px-6 py-4">Left Qty</th>
              <th className="px-6 py-4">Final Total</th>
              <th className="px-6 py-4">Advance</th>
              <th className="px-6 py-4">Remaining</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {stones.map((stone) => (
              <tr key={stone.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  {stone.vender_id?.vendor || '-'}
                  {stone.vender_id?.vendor_no && ` (${stone.vender_id.vendor_no})`}
                </td>
                <td className="px-6 py-4">
                  {stone.mines?.Mines_name || '-'}
                </td>
                <td className="px-6 py-4">
                  {editingId === stone.id ? (
                    <input
                      type="text"
                      value={editData.stoneType || ''}
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
                      value={editData.date || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, date: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    stone.date
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingId === stone.id ? (
                    <input
                      type="number"
                      value={editData.total_quantity || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, total_quantity: Number(e.target.value) || null })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    stone.total_quantity || '-'
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingId === stone.id ? (
                    <input
                      type="number"
                      value={editData.issued_quantity || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, issued_quantity: Number(e.target.value) || null })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    stone.issued_quantity || '-'
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingId === stone.id ? (
                    <input
                      type="number"
                      value={editData.left_quantity || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, left_quantity: Number(e.target.value) || null })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    stone.left_quantity || '-'
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingId === stone.id ? (
                    <input
                      type="number"
                      value={editData.final_total || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, final_total: Number(e.target.value) })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    stone.final_total || '-'
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingId === stone.id ? (
                    <input
                      type="number"
                      value={editData.partyAdvancePayment || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, partyAdvancePayment: Number(e.target.value) || null })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    stone.partyAdvancePayment || '-'
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingId === stone.id ? (
                    <input
                      type="number"
                      value={editData.partyRemainingPayment || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, partyRemainingPayment: Number(e.target.value) })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    stone.partyRemainingPayment || '-'
                  )}
                </td>
                <td className="px-6 py-4">₹{stone.final_total.toLocaleString('en-IN') || '0'}</td>
                <td className="px-6 py-4">₹{stone.partyAdvancePayment?.toLocaleString('en-IN') || '0'}</td>
                <td className="px-6 py-4">₹{stone.partyRemainingPayment?.toLocaleString('en-IN') || '0'}</td>

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
