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
      console.log('Fetched stones:', res.data.docs)
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
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
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
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              <span className="text-indigo-600 dark:text-indigo-400">Stone</span> Inventory
            </h1>
            {selectedStones.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
              >
                Delete {selectedStones.size} Selected
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center  gap-4">
          <div >
          <div className="flex gap-6">
          <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Search Vendor
              </label>
              <input
                type="text"
                value={searchVendor}
                onChange={(e) => setSearchVendor(e.target.value)}
                placeholder="Search by vendor name or company number..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Search Mine
              </label>
              <input
                type="text"
                value={searchMine}
                onChange={(e) => setSearchMine(e.target.value)}
                placeholder="Search by mine name..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          </div>
          <Link   href="/stone/addstone">
            <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
              <span className="text-sm font-medium">Add New Stone</span>
            </button>
          </Link>
        </div>
       
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={isSelectAll}
                    onChange={handleSelectAll}
                    className="rounded cursor-pointer"
                  />
                </th>
                <th className="p-4 text-left">S.No.</th>
                <th className="p-4 text-left">Vendor</th>
                <th className="p-4 text-left">Mine</th>
                <th className="p-4 text-left">Stone Type</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Total Qty</th>
                <th className="p-4 text-left">Issued Qty</th>
                <th className="p-4 text-left">Total Amount</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 dark:text-white">
              {filteredStones.map((stone,index) => (
                <tr
                  key={stone.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedStones.has(stone.id.toString())}
                      onChange={() => handleSelectStone(stone.id.toString())}
                      className="rounded cursor-pointer"
                    />
                  </td>
                  <td className="p-4 text-center">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stone.vender_id?.vendor || '-'}</span>
                      {stone.vender_id?.vendor_no && (
                        <span className="text-gray-600 dark:text-gray-400">
                          ({stone.vender_id.vendor_no})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{stone.mines?.Mines_name || '-'}</span>
                  </td>
                  <td className="p-4">
                 
                      <span className="font-medium">{stone.stoneType}</span>
                  
                  </td>

                  <td className="p-4">
                 
                      <span>{new Date(stone.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                 
                  </td>

                  <td className="p-4">
        
                      <span>{stone.total_quantity || '-'}</span>
                   
                  </td>

                  <td className="p-4">{stone.issued_quantity || '-'}</td>
                  <td className="p-4">{stone.total_amount || '-'}</td>
                 
                  <td className="p-4">
                    
                      <div className="flex gap-4">
                        <Link href={`/stone/edit?id=${stone.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(stone.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                        >
                          Delete
                        </button>
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
