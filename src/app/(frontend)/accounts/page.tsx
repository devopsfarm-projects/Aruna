'use client'

import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import payload from './lib/payload'
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
  type: 'stone'
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

type Block = {
  type: 'block'
  id: number
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

type StoneOrBlock = Stone | Block

export default function StoneList() {
  const [stones, setStones] = useState<Stone[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
const [searchVendor, setSearchVendor] = useState('')
  const [searchMine, setSearchMine] = useState('')
   const [filteredStones, setFilteredStones] = useState<Stone[]>([])
  type BlockResponse = {
    docs: Block[]
    totalDocs: number
    limit: number
    totalPages: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }
  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await payload.get<BlockResponse>('/Block')

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

  const [, setSelectedStones] = useState<Set<string>>(new Set())
  const [, setIsSelectAll] = useState(false)

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



  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400">Search</span> Vendor
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchVendor}
                      onChange={(e) => setSearchVendor(e.target.value)}
                      placeholder="Enter vendor name or company number"
                      className="w-[200px] px-4 py-3 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400">Search</span> Mine
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchMine}
                      onChange={(e) => setSearchMine(e.target.value)}
                      placeholder="Enter mine name"
                      className="w-[200px] px-4 py-3 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              <span className="text-indigo-600 dark:text-indigo-400">Accounts</span> Statement
            </h1>
          </div>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="p-4 text-center">S.No.</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Mine Name</th>
                <th className="p-4 text-left">Vendor Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Total Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 dark:text-white">
              {/* Combine stones and blocks into a single array with type information */}
              {[
                ...filteredStones,
                ...blocks
              ]
                .sort((a: StoneOrBlock, b: StoneOrBlock) => {
                    const dateA = a.date || new Date().toISOString()
                    const dateB = b.date || new Date().toISOString()
                    return new Date(dateA).getTime() - new Date(dateB).getTime()
                })
                .map((item: StoneOrBlock, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-4 text-center">{index + 1}</td>
                    <td className="p-4">
                      <span>{item.date}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">
                        {typeof item.mines === 'object' && item.mines !== null ? item.mines.Mines_name : '-'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {typeof item.vender_id === 'object' && item.vender_id !== null ? item.vender_id.vendor : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">
                        {item.type === 'stone' ? `Stone: ${item.stoneType || '-'}` : `Block: ${item.BlockType}`}
                      </span>
                    </td>
                    <td className="p-4">
                      ₹
                      {item.type === 'stone' ? 
                        item.final_total?.toLocaleString('en-IN') || '0' :
                        item.total_amount?.toLocaleString('en-IN') || '0'
                      }
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
