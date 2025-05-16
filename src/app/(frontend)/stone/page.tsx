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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <span className="text-indigo-600 dark:text-indigo-400">Stone</span> Inventory
          </h1>
          <Link
            href="/stone/addstone"
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
          >
            <span className="font-medium">Add New Stone</span>
          </Link>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="p-4 text-left">Vendor</th>
                <th className="p-4 text-left">Mine</th>
                <th className="p-4 text-left">Stone Type</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Total Qty</th>
                <th className="p-4 text-left">Issued Qty</th>
                <th className="p-4 text-left">Left Qty</th>
                <th className="p-4 text-left">Final Total</th>
                <th className="p-4 text-left">Advance</th>
                <th className="p-4 text-left">Remaining</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 dark:text-white">
              {stones.map((stone) => (
                <tr 
                  key={stone.id} 
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stone.vender_id?.vendor || '-'}</span>
                      {stone.vender_id?.vendor_no && (
                        <span className="text-gray-600 dark:text-gray-400">({stone.vender_id.vendor_no})</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{stone.mines?.Mines_name || '-'}</span>
                  </td>
                  <td className="p-4">
                    {editingId === stone.id ? (
                      <input
                        type="text"
                        value={editData.stoneType || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, stoneType: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <span className="font-medium">{stone.stoneType}</span>
                    )}
                  </td>

                  <td className="p-4">
                    {editingId === stone.id ? (
                      <input
                        type="date"
                        value={editData.date || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, date: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <span>{stone.date}</span>
                    )}
                  </td>

                  <td className="p-4">
                    {editingId === stone.id ? (
                      <input
                        type="number"
                        value={editData.total_quantity || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, total_quantity: Number(e.target.value) || null })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <span>{stone.total_quantity || '-'}</span>
                    )}
                  </td>

                  <td className="p-4">{stone.issued_quantity || '-'}</td>
                  <td className="p-4">{stone.left_quantity || '-'}</td>
                  <td className="p-4">₹{stone.final_total.toLocaleString('en-IN') || '0'}</td>
                  <td className="p-4">₹{stone.partyAdvancePayment?.toLocaleString('en-IN') || '0'}</td>
                  <td className="p-4">₹{stone.partyRemainingPayment?.toLocaleString('en-IN') || '0'}</td>

                  <td className="p-4">
                    {editingId === stone.id ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdate(stone.id)}
                          className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-600 dark:bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEdit(stone)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(stone.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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
