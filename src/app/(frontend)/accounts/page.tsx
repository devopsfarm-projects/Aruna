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



export default function StoneList() {
  const [stones, setStones] = useState<Stone[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [searchVendor, setSearchVendor] = useState('')
  const [searchMine, setSearchMine] = useState('')
  const [filteredStones, setFilteredStones] = useState<Stone[]>([])

  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await payload.get<{ docs: Block[] }>('/Block')
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
    } catch (err) {
      console.error('Error fetching data:', err)
    }
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
                placeholder="Vendor or Company No."
                className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mine
              </label>
              <input
                type="text"
                value={searchMine}
                onChange={(e) => setSearchMine(e.target.value)}
                placeholder="Mine name"
                className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center md:text-right">
            <span className="text-indigo-600 dark:text-indigo-400">Accounts</span> Statement
          </h1>
        </div>

        <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white text-sm text-left">
              <tr>
                <th className="px-4 py-3">S.No.</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Mine Name</th>
                <th className="px-4 py-3">Vendor Name</th>
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
                      {item.date ? new Date(item.date).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) : '-'}
                    </td>
                    <td className="px-4 py-3">{typeof item.mines === 'object' && item.mines ? item.mines.Mines_name || '-' : '-'}</td>
                    <td className="px-4 py-3">{typeof item.vender_id === 'object' ? item.vender_id.vendor || '-' : item.vender_id || '-'}</td>
                    <td className="px-4 py-3">
                      {item.type === 'stone' ? `Stone: ${item.stoneType || '-'}` : `Block: ${item.BlockType}`}
                    </td>
                    <td className="px-4 py-3">
                      ₹
                      {item.type === 'stone'
                        ? item.final_total?.toLocaleString('en-IN') || '0'
                        : item.total_amount?.toLocaleString('en-IN') || '0'}
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
