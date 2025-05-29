'use client'

import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import payload from './lib/payload'
import type { Block } from '../../../payload-types'
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
  const [blocks, setBlocks] = useState<Block[]>([])
  const [, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  console.log(blocks)
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

  const [selectedStones, setSelectedStones] = useState<Set<string>>(new Set())
  const [isSelectAll, setIsSelectAll] = useState(false)

  useEffect(() => {
    fetchAllData()
  }, [])

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

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              <span className="text-indigo-600 dark:text-indigo-400">Accounts</span> Statement
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
                ...stones.map((stone) => ({ ...stone, type: 'stone' })),
                ...blocks.map((block) => ({ ...block, type: 'block' })),
              ]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((item, index) => (
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
                        {item.mines?.Mines_name || '-'}
                        {item.type === 'block' ? ' (Block)' : ''}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.vender_id?.vendor || '-'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">
                        {item.type === 'stone' ? item.stoneType : item.BlockType}
                      </span>
                    </td>
                    <td className="p-4">
                      ₹
                      {(item.type === 'stone'
                        ? item.final_total
                        : item.total_amount
                      )?.toLocaleString('en-IN') || '0'}
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
