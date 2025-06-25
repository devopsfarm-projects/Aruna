'use client'

import React, { ReactNode, useEffect, useState } from 'react'
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
  rate: string
  munim: ReactNode
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
  hydra_cost: number | null
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
  const [searchVendor] = useState('')
  const [searchMine] = useState('')
  const [selectedStones, setSelectedStones] = useState<Set<string>>(new Set())
  const [isSelectAll, setIsSelectAll] = useState(false)

  const [stonesLoading, setStonesLoading] = useState(true)
  const [stonesError, setStonesError] = useState<string | null>(null)

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
      setStonesLoading(true)
      setStonesError(null)
      const res = await axios.get<{ docs: Stone[] }>('/api/stone')
      setStones(res.data.docs || [])
      setSelectedStones(new Set())
      setIsSelectAll(false)
    } catch (err) {
      setStonesError('Failed to fetch stones')
      console.error('Error fetching stones:', err)
    } finally {
      setStonesLoading(false)
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


  if (stonesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            Loading data...
          </p>
        </div>
      </div>
    )
  }

  if (stonesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <div className="text-center">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4v2m0-6h2m-4 0h-2m-4 6h2m0 0h2m0 0h2m0-6h2m0 6h2"
            />
          </svg>
          <p className="text-red-600 dark:text-red-400 text-lg font-medium">{stonesError}</p>
        </div>
      </div>
    )
  } 

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              <span className="text-indigo-600 dark:text-indigo-400">Stone</span> Inventory
            </h1>
          </div>  
        </div>

        <div className="space-y-4 md:hidden">
          {filteredStones.map((stone, index) => (
            <div key={stone.id} className="p-4 -xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</div>
            
              </div>
              
              <div className="space-y-2">
                <div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Munim: {stone.munim || '-'}</span>
                  </div>
                  <div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Stone Type: {stone.stoneType || '-'}</span>
                  </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Date: {new Date(stone.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-sm">Qty: {stone.total_quantity || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Amount: ₹{stone.total_amount || '-'}</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Link 
                  href={`/stone/edit?id=${stone.id}`} 
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-600 -lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto -lg">
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
                <th className="p-3 text-left">munim</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Rate</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Hydra</th>                
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
                 
                  <td className="p-3">{stone.munim}</td>
                  <td className="p-3"> {stone.date ? new Date(stone.date).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) : '-'}</td>
                  <td className="p-3">{stone.rate || '-'}</td>
                  <td className="p-3">{stone.total_quantity || '-'}</td>
                  <td className="p-3">{stone.hydra_cost || '-'}</td>
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
      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 z-50">
        <div className="flex flex-col items-end space-y-2">
          {selectedStones.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white p-3 -full hover:bg-red-700 transition-all flex items-center justify-center shadow-md"
              title={`Delete ${selectedStones.size} selected items`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <Link href="/stone/addstone">
            <button className="bg-indigo-600 text-white p-3 -full shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
