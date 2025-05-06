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

type Entity = {
  vendor: string
  Mines_name: string
  id: string
  name: string
}

type NewStone = {
  vender_id: string
  stoneType: string
  date: string
  mines: string
  addmeasures: Measure[]
  total_quantity: number
  issued_quantity: number
  left_quantity: number
  final_total: number
  partyRemainingPayment: number
  partyAdvancePayment: number
  transportType: string
  createdBy: string
}

export default function StoneListPage() {
  const [stones, setStones] = useState<Stone[]>([])
  const [newStone, setNewStone] = useState<NewStone>({
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

  const updateMeasure = (index: number, field: keyof Measure, value: string) => {
    const updated = [...newStone.addmeasures]
    updated[index][field] = Number(value)
    setNewStone({ ...newStone, addmeasures: updated })
  }

  const addNewMeasure = () => {
    setNewStone({
      ...newStone,
      addmeasures: [...newStone.addmeasures, { qty: 0, l: 0, b: 0, h: 0, rate: 0 }],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const totals = calculateTotals()
    const stoneData = { ...newStone, ...totals }

    try {
      await axios.post('/api/stone', stoneData)
    } catch (error) {
      console.error('Error adding stone:', error)
    }
  }

  console.log('Stone data being submitted:', newStone)

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Stone Inventory</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="bg-white p-6 rounded-lg text-black shadow-md grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <select
            value={newStone.stoneType}
            onChange={(e) => setNewStone({ ...newStone, stoneType: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Select Stone Type</option>
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
            <option value="">Select Transport</option>
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
            type="submit"
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700 mt-2"
          >
            Submit Stone
          </button>

          <Link
            href="/stone"
            className="bg-blue-600 text-white p-2 text-center rounded hover:bg-blue-700 mt-2"
          >
            View All Stones
          </Link>
        </div>
      </form>
    </div>
  )
}
