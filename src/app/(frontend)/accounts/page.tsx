'use client'

import React, { useEffect, useState, useCallback, ReactNode } from 'react'
import axios from 'axios'

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
  total_cost: any
  type: 'stone'
  id: number | string
  munim: ReactNode
  vender_id: {
    id: number
    vendor: string
    vendor_no: string
    munim: string
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
  hydra_cost: number
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
  total_amount: number
  createdBy: {
    id: string
    email: string
    role: string
  }
  transportType: string | null
  partyRemainingPayment: number
  partyAdvancePayment: number | null
  createdAt: string
  updatedAt: string
}

type Block = {
  total_cost: any
  type: 'block'
  id: number
  munim: ReactNode
  BlockType: 'Brown' | 'White'
  date?: string
  vender_id?: number
  mines?: number
  addmeasures: Measure[]
  total_quantity: number | null
  issued_quantity: number | null
  left_quantity: number | null
  total_amount: number
  partyRemainingPayment: number
  partyAdvancePayment: number | null
  transportType: string | null
  createdBy: { name: string } | null
  createdAt: string
  updatedAt: string
}

export default function StoneList() {
  const [stones, setStones] = useState<Stone[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [searchVendor, setSearchVendor] = useState('')
  const [searchMine] = useState('')
  const [filteredStones, setFilteredStones] = useState<Stone[]>([])

  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get<{ docs: Block[] }>('/api/Block')
      setBlocks(res.data.docs)
    } catch (err) {
      setError('Failed to fetch blocks')
      console.error('Error fetching blocks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBlocks()
  }, [fetchBlocks])

  useEffect(() => {
    fetchAllData()
  }, [])

  useEffect(() => {
    const filtered = stones.filter((stone) => {
      const matchesVendor =
        !searchVendor ||
        stone.vender_id?.vendor?.toLowerCase().includes(searchVendor.toLowerCase()) ||
        stone.vender_id?.Company_no?.toLowerCase().includes(searchVendor.toLowerCase())

      const matchesMine =
        !searchMine || stone.mines?.Mines_name?.toLowerCase().includes(searchMine.toLowerCase())

      return matchesVendor && matchesMine
    })
    setFilteredStones(filtered)
  }, [stones, searchVendor, searchMine])

  const fetchAllData = async () => {
    try {
      const res = await axios.get<{ docs: Stone[] }>('/api/stone')
      setStones(res.data.docs || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  if (stones.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
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
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Loading data...</p>
        </div>
      </div>
    )
  }

  if (blocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
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
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Vendor
              </label>
              <input
                type="text"
                value={searchVendor}
                onChange={(e) => setSearchVendor(e.target.value)}
                placeholder="Vendor"
                className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center md:text-right">
            <span className="text-indigo-600 dark:text-indigo-400">Accounts</span> Statement
          </h1>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {[...filteredStones, ...blocks]
            .sort((a, b) => {
              const dateA = a.date || new Date().toISOString()
              const dateB = b.date || new Date().toISOString()
              return new Date(dateB).getTime() - new Date(dateA).getTime()
            })
            .map((item, index) => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.type === 'stone' ? 'Stone' : 'Block'}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    ₹
                    {item.type === 'stone'
                      ? item.total_amount?.toLocaleString('en-IN') || '0'
                      : item.total_amount?.toLocaleString('en-IN') || '0'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.date
                        ? new Date(item.date).toLocaleString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })
                        : '-'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {typeof item.vender_id === 'object'
                        ? item.vender_id.vendor || '-'
                        : item.vender_id || '-'}
                    </span>
                  </div>

                  {item.type === 'stone' && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Stone: {item.stoneType || '-'}
                      </span>
                    </div>
                  )}

                  {item.type === 'block' && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Block: {item.BlockType}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white text-sm text-left">
              <tr>
                <th className="px-4 py-3">S.No.</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Munim / Vendor Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Total Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 dark:text-white divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              {[...filteredStones, ...blocks]
                .sort((a, b) => {
                  const dateA = a.date || new Date().toISOString()
                  const dateB = b.date || new Date().toISOString()
                  return new Date(dateB).getTime() - new Date(dateA).getTime()
                })
                .map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3">
                      {item.date
                        ? new Date(item.date).toLocaleString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {item.type === 'stone' ? item.munim : item.munim || '-'}
                       &nbsp; / &nbsp;
                      {typeof item.vender_id === 'object'
                        ? item.vender_id.vendor || ''
                        : item.vender_id || ''}
                    </td>
                    <td className="px-4 py-3">
                      {item.type === 'stone' ? item.stoneType : item.BlockType}
                      {item.type === 'block' ? item.BlockType : item.stoneType}
                    </td>
                    <td className="px-4 py-3">
                      ₹
                      {item.type === 'stone'
                        ? item.total_amount?.toLocaleString('en-IN') || ''
                        : item.total_amount?.toLocaleString('en-IN') || ''}
                         {item.type === 'block'
                        ? item.total_cost?.toLocaleString('en-IN') || ''
                        : item.total_cost?.toLocaleString('en-IN') || ''}
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
