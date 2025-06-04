'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

type Measure = {
  qty: number
  l: number
  b: number
  h: number
  rate: number
  labour?: string
  hydra?: string
}

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
  total_amount: number | null
  final_total: number
  partyRemainingPayment: number
  partyAdvancePayment: number | null
  transportType: string | null
  vehicle_number: string | null
  vehicle_cost: number | null
  labour_name: string | null
  createdBy: { name: string } | null
  createdAt: string
  updatedAt: string
}

export default function StoneList() {
  const [stones, setStones] = useState<Stone[]>([])
  const [filteredStones, setFilteredStones] = useState<Stone[]>([])
  const [searchVendor, setSearchVendor] = useState('')
  const [searchMine, setSearchMine] = useState('')
  const [selectedStones, setSelectedStones] = useState<Set<string>>(new Set())
  const [isSelectAll, setIsSelectAll] = useState(false)

  useEffect(() => {
    fetchAllData()
  }, [])

  useEffect(() => {
    const filtered = stones.filter(stone => {
      const matchesVendor = !searchVendor ||
        stone.vender_id?.vendor?.toLowerCase().includes(searchVendor.toLowerCase()) ||
        stone.vender_id?.Company_no?.toLowerCase().includes(searchVendor.toLowerCase())
      const matchesMine = !searchMine ||
        stone.mines?.Mines_name?.toLowerCase().includes(searchMine.toLowerCase())
      return matchesVendor && matchesMine
    })
    setFilteredStones(filtered)
  }, [stones, searchVendor, searchMine])

  const fetchAllData = async () => {
    try {
      const res = await axios.get<{ docs: Stone[] }>('/api/stone')
      setStones(res.data.docs || [])
      setSelectedStones(new Set())
      setIsSelectAll(false)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedStones(new Set())
    } else {
      const newSelection = new Set(stones.map((stone) => stone.id.toString()))
      setSelectedStones(newSelection)
    }
    setIsSelectAll(!isSelectAll)
  }

  const handleSelectStone = (id: string) => {
    const newSelection = new Set(selectedStones)
    if (newSelection.has(id)) newSelection.delete(id)
    else newSelection.add(id)
    setSelectedStones(newSelection)
    setIsSelectAll(newSelection.size === stones.length)
  }

  const handleBulkDelete = async () => {
    if (selectedStones.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedStones.size} stone(s)?`)) return
    try {
      const ids = Array.from(selectedStones)
      await Promise.all(ids.map((id) => axios.delete(`/api/stone/${id}`)))
      fetchAllData()
    } catch (err) {
      console.error(err)
      alert('Error deleting stones')
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

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              <span className="text-indigo-600 dark:text-indigo-400">Stone</span> Inventory
            </h1>
            <div className="flex gap-3 flex-wrap">
              {selectedStones.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete {selectedStones.size}
                </button>
              )}
              <Link href="/stone/addstone">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Add Stone
                </button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Search Vendor</label>
              <input
                type="text"
                value={searchVendor}
                onChange={(e) => setSearchVendor(e.target.value)}
                placeholder="Vendor name or company no."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Search Mine</label>
              <input
                type="text"
                value={searchMine}
                onChange={(e) => setSearchMine(e.target.value)}
                placeholder="Mine name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="space-y-4 md:hidden">
          {filteredStones.map((stone, index) => (
            <div key={stone.id} className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</div>
                <input
                  type="checkbox"
                  checked={selectedStones.has(stone.id.toString())}
                  onChange={() => handleSelectStone(stone.id.toString())}
                  className="rounded"
                />
              </div>
              <div className="text-gray-900 dark:text-white font-semibold">{stone.vender_id?.vendor || '-'}</div>
              <div className="text-sm mt-1">Type: {stone.stoneType}</div>
              <div className="text-sm">Date: {new Date(stone.date).toLocaleDateString()}</div>
              <div className="text-sm">Qty: {stone.total_quantity || '-'}</div>
              <div className="text-sm">Issued: {stone.issued_quantity || '-'}</div>
              <div className="text-sm">Amount: ₹{stone.total_amount || '-'}</div>
              <div className="flex gap-4 mt-3">
                <Link href={`/stone/edit?id=${stone.id}`} className="text-blue-500">Edit</Link>
                <button onClick={() => handleDelete(stone.id)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-800 text-white dark:bg-gray-700">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={isSelectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3 text-left">S.No.</th>
                <th className="p-3 text-left">Stone Type</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Issued</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 dark:text-white">
              {filteredStones.map((stone, index) => (
                <tr key={stone.id} className="border-b border-gray-200 dark:border-gray-600">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedStones.has(stone.id.toString())}
                      onChange={() => handleSelectStone(stone.id.toString())}
                    />
                  </td>
                  <td className="p-3 text-center">{index + 1}</td>
                  <td className="p-3">{stone.stoneType}</td>
                  <td className="p-3"> {stone.date ? new Date(stone.date).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) : '-'}</td>
                  <td className="p-3">{stone.total_quantity || '-'}</td>
                  <td className="p-3">{stone.issued_quantity || '-'}</td>
                  <td className="p-3">₹{stone.total_amount || '-'}</td>
                  <td className="p-3">
                    <div className="flex gap-4">
                      <Link href={`/stone/edit?id=${stone.id}`} className="text-blue-500">Edit</Link>
                      <button onClick={() => handleDelete(stone.id)} className="text-red-500">Delete</button>
                    </div>
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
