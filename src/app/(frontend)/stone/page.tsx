'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

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

type Entity = {
  vendor: string
  Mines_name: string
  id: string
  name: string
}

export default function StoneListPage() {
  const [stones, setStones] = useState<Stone[]>([])
  const [newStone, setNewStone] = useState({
    vender_id: '',
    stoneType: '',
    date: '',
    mines: '',
    addmeasures: [],
    total_quantity: 0,
    issued_quantity: 0,
    left_quantity: 0,
    final_total: 0,
    partyRemainingPayment: 0,
    partyAdvancePayment: 0,
    transportType: '',
    createdBy: '',
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ stoneType: '', date: '' })
  const [mines, setMines] = useState<Entity[]>([])
  const [vendors, setVendors] = useState<Entity[]>([])
  const [users, setUsers] = useState<Entity[]>([])

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [stoneRes, mineRes, vendorRes, userRes] = await Promise.all([
        axios.get('/api/stone'),
        axios.get('/api/Mines'),
        axios.get('/api/vendor'),
        axios.get('/api/accounts'),
      ])

      setStones(stoneRes.data.docs || [])
      setMines(mineRes.data.docs || [])
      setVendors(vendorRes.data.docs || [])
      setUsers(userRes.data.docs || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

console.log(stones)

  const handleAdd = async () => {
    if (!newStone.vender_id || !newStone.stoneType || !newStone.date) {
      return alert('Please fill all required fields')
    }

    const totals = calculateTotals()

    try {
      await axios.post('/api/stone', { ...newStone, ...totals })
      setNewStone({
        vender_id: '',
        stoneType: '',
        date: '',
        mines: '',
        addmeasures: [],
        total_quantity: 0,
        issued_quantity: 0,
        left_quantity: 0,
        final_total: 0,
        partyRemainingPayment: 0,
        partyAdvancePayment: 0,
        transportType: '',
        createdBy: '',
      })
      fetchAllData()
    } catch (err) {
      console.error(err)
      alert('Error adding stone')
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

  const updateMeasure = (index: number, field: string, value: string) => {
    const updated = [...newStone.addmeasures]
    updated[index][field] = Number(value)
    setNewStone({ ...newStone, addmeasures: updated })
  }

  const addNewMeasure = () => {
    setNewStone({
      ...newStone,
      addmeasures: [...newStone.addmeasures, { qty: '', l: '', b: '', h: '', rate: '' }],
    })
  }

  const calculateTotals = () => {
    const totalQty = newStone.addmeasures.reduce((sum, m) => sum + (m.qty || 0), 0)
    const finalTotal = newStone.addmeasures.reduce(
      (sum, m) => sum + m.l * m.b * m.h * m.qty * m.rate,
      0,
    )

    const leftQty = totalQty - (newStone.issued_quantity || 0)
    const remaining = finalTotal - (newStone.partyAdvancePayment || 0)

    return {
      total_quantity: totalQty,
      final_total: finalTotal,
      left_quantity: leftQty,
      partyRemainingPayment: remaining,
    }
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Stone Inventory</h1>

      <div className="bg-white p-6 rounded-lg text-black shadow-md grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Dropdowns and Inputs */}
        <select
          value={newStone.stoneType}
          onChange={(e) => setNewStone({ ...newStone, stoneType: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="Khanda">Khanda</option>
          <option value="Raskat">Raskat</option>
        </select>

        <input
          type="date"
          value={newStone.date}
          onChange={(e) => setNewStone({ ...newStone, date: e.target.value })}
          className="border p-2 rounded"
        />

        <select
          value={newStone.vender_id}
          onChange={(e) => setNewStone({ ...newStone, vender_id: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Vendor</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.vendor}
            </option>
          ))}
        </select>

        <select
          value={newStone.mines}
          onChange={(e) => setNewStone({ ...newStone, mines: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Mine</option>
          {mines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.Mines_name}
            </option>
          ))}
        </select>

        <select
          value={newStone.createdBy}
          onChange={(e) => setNewStone({ ...newStone, createdBy: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Created By</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

    


        <select
          value={newStone.transportType}
          onChange={(e) => setNewStone({ ...newStone, transportType: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="Hydra">Hydra</option>
          <option value="Truck">Truck</option>
        </select>

        {newStone.addmeasures.map((m, index) => (
          <div key={index} className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="Qty"
              value={m.qty}
              onChange={(e) => updateMeasure(index, 'qty', e.target.value)}
            />
            <input
              type="number"
              placeholder="L"
              value={m.l}
              onChange={(e) => updateMeasure(index, 'l', e.target.value)}
            />
            <input
              type="number"
              placeholder="B"
              value={m.b}
              onChange={(e) => updateMeasure(index, 'b', e.target.value)}
            />
            <input
              type="number"
              placeholder="H"
              value={m.h}
              onChange={(e) => updateMeasure(index, 'h', e.target.value)}
            />
            <input
              type="number"
              placeholder="Rate"
              value={m.rate}
              onChange={(e) => updateMeasure(index, 'rate', e.target.value)}
            />
          </div>
        ))}
        <button onClick={() => addNewMeasure()} className="bg-blue-500 text-white p-1 rounded">
          Add Measure
        </button>

        <button
          onClick={handleAdd}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700 mt-2"
        >
          Add Stone
        </button>
      </div>

      <div className="mt-8 grid gap-4">
        {stones.map((stone) => (
          <div
            key={stone.id}
            className="p-4 bg-white rounded shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {editingId === stone.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editData.stoneType}
                  onChange={(e) => setEditData({ ...editData, stoneType: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  className="border p-2 rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(stone.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Stones List</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Vendor</th>
                        <th className="px-4 py-3 text-left">Stone Type</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Final Total</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800 text-sm">
                      {stones.map((stone) => (
                        <tr key={stone.id} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3">{stone.vender_id?.name || '-'}</td>
                          <td className="px-4 py-3">{stone.stoneType}</td>
                          <td className="px-4 py-3">{stone.date}</td>
                          <td className="px-4 py-3">{stone.final_total}</td>
                          <td className="px-4 py-3 flex space-x-2">
                            <button
                              onClick={() => handleEdit(stone)}
                              className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(stone.id)}
                              className="text-red-600 hover:text-red-800 font-medium transition duration-200"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="flex gap-2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
