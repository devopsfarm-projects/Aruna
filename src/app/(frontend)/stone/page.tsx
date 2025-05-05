'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

type Stone = {
  id: string
  vender_id?: { name: string }
  stoneType: string
  date: string
  mines: { name: string }
  addmeasures: any[]
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
  vendor: string,
  Mines_name: string,
  id: string; name: string 
}

export default function StoneListPage() {
  const [stones, setStones] = useState<Stone[]>([])
  const [newStone, setNewStone] = useState({
    vender_id: '',
    stoneType: '',
    date: '',
    mines: '',
    addmeasures: '',
    total_quantity: '',
    issued_quantity: '',
    left_quantity: '',
    final_total: '',
    partyRemainingPayment: '',
    partyAdvancePayment: '',
    transportType: '',
    createdBy: ''
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
        axios.get('/api/accounts') // Assuming createdBy is from accounts
      ])

      setStones(stoneRes.data.docs || [])
      setMines(mineRes.data.docs || [])
      setVendors(vendorRes.data.docs || [])
      setUsers(userRes.data.docs || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const handleAdd = async () => {
    if (!newStone.vender_id || !newStone.stoneType || !newStone.date) {
      return alert('Please fill all required fields')
    }
    try {
      await axios.post('/api/stone', newStone)
      setNewStone({
        vender_id: '',
        stoneType: '',
        date: '',
        mines: '',
        addmeasures: '',
        total_quantity: '',
        issued_quantity: '',
        left_quantity: '',
        final_total: '',
        partyRemainingPayment: '',
        partyAdvancePayment: '',
        transportType: '',
        createdBy: ''
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

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Stone Inventory</h1>

      <div className="bg-white p-6 rounded-lg text-black shadow-md grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Dropdowns and Inputs */}
        <select
          value={newStone.vender_id}
          onChange={(e) => setNewStone({ ...newStone, vender_id: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Vendor</option>
          {vendors.map(v => <option key={v.id} value={v.id}>{v.vendor}</option>)}
        </select>

        <select
          value={newStone.mines}
          onChange={(e) => setNewStone({ ...newStone, mines: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Mine</option>
          {mines.map(m => <option key={m.id} value={m.id}>{m.Mines_name}</option>)}
        </select>

        <select
          value={newStone.createdBy}
          onChange={(e) => setNewStone({ ...newStone, createdBy: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Created By</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>


        <select
         value={newStone.stoneType}
          onChange={(e) => setNewStone({ ...newStone, stoneType: e.target.value })}
          className="border p-2 rounded"
        >
         <option value="Khanda">Khanda</option>
<option value="Raskat">Raskat</option>

        </select>

        <input type="date" value={newStone.date} onChange={(e) => setNewStone({ ...newStone, date: e.target.value })} className="border p-2 rounded" />
        {/* <input type="text" placeholder="Transport Type" value={newStone.transportType} onChange={(e) => setNewStone({ ...newStone, transportType: e.target.value })} className="border p-2 rounded" /> */}

        <select
        value={newStone.transportType}
        onChange={(e) => setNewStone({ ...newStone, transportType: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="Hydra">Hydra</option>
          <option value="Truck">Truck</option>
        </select>

        <button onClick={handleAdd} className="bg-green-600 text-white p-2 rounded hover:bg-green-700 mt-2">Add Stone</button>
      </div>

      <div className="mt-8 grid gap-4">
        {stones.map(stone => (
          <div key={stone.id} className="p-4 bg-white rounded shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                  <button onClick={() => handleUpdate(stone.id)} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <p><strong>Vendor:</strong> {stone.vender_id?.name || 'N/A'}</p>
                <p><strong>Mine:</strong> {stone.mines?.name || 'N/A'}</p>
                <p><strong>Type:</strong> {stone.stoneType}</p>
                <p><strong>Date:</strong> {stone.date}</p>
                <p><strong>Created By:</strong> {stone.createdBy?.name || 'N/A'}</p>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => handleEdit(stone)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
              <button onClick={() => handleDelete(stone.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
