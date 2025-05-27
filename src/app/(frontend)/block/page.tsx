'use client'
import { useEffect, useState, useCallback } from 'react'
import payload from './lib/payload'
import Link from 'next/link'
import type { Block } from '../../../payload-types'

export default function BlockList() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([])
  const [searchVendor, setSearchVendor] = useState('')
  const [searchMine, setSearchMine] = useState('')
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set())
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
      setFilteredBlocks(res.data.docs) // Also set filteredBlocks
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
    const filtered = blocks.filter((block) => {
      const vendorMatch = !searchVendor || 
        (block.vender_id?.vendor?.toLowerCase().includes(searchVendor.toLowerCase()) ||
         block.vender_id?.vendor_no?.toString().includes(searchVendor))
      const mineMatch = !searchMine || 
        block.mines?.Mines_name?.toLowerCase().includes(searchMine.toLowerCase())
      return vendorMatch && mineMatch
    })
    setFilteredBlocks(filtered)
  }, [blocks, searchVendor, searchMine])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsSelectAll(checked)
    if (checked) {
      const allIds = new Set(filteredBlocks.map(block => block.id?.toString()))
      setSelectedBlocks(allIds)
    } else {
      setSelectedBlocks(new Set())
    }
  }

  const deleteBlock = async (id: string | number) => {
    if (id === null || id === undefined) return
    await payload.delete(`/Block/${id}`)
    setBlocks((prev: Block[]) => prev.filter((b) => b.id?.toString() !== id.toString()))
  }

  const handleSelectBlock = (id: string) => {
    setSelectedBlocks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleBulkDelete = async () => {
    if (selectedBlocks.size === 0) return
    
    await Promise.all(
      Array.from(selectedBlocks).map(async (id) => {
        await deleteBlock(id)
      })
    )
    setSelectedBlocks(new Set())
  }


  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <span className="text-indigo-600 dark:text-indigo-400">Block</span> Inventory
          </h1>
          {selectedBlocks.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
            >
              Delete {selectedBlocks.size} Selected
            </button>
          )}
        </div>
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
        <Link
          href="/block/addblock"
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
        >
          <span className="font-medium">Add New Block</span>
        </Link>
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
              <th className="p-4 text-left">Vendor</th>
              <th className="p-4 text-left">Mine</th>
              <th className="p-4 text-left">Block Type</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Total Qty</th>
              <th className="p-4 text-left">Issued Qty</th>
              <th className="p-4 text-left">Total Amount</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-900 dark:text-white">
            {filteredBlocks.map((Block) => (
              <tr
                key={Block.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedBlocks.has(Block.id.toString())}
                    onChange={() => handleSelectBlock(Block.id.toString())}
                    className="rounded cursor-pointer"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{Block.vender_id?.vendor || '-'}</span>
                    {Block.vender_id?.vendor_no && (
                      <span className="text-gray-600 dark:text-gray-400">
                        ({Block.vender_id.vendor_no})
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-medium">{Block.mines?.Mines_name || '-'}</span>
                </td>
                <td className="p-4">
               
                    <span className="font-medium">{Block.BlockType}</span>
                
                </td>

                <td className="p-4">
               
                    <span>{Block.date}</span>
               
                </td>

                <td className="p-4">
      
                    <span>{Block.total_quantity || '-'}</span>
                 
                </td>

                <td className="p-4">{Block.issued_quantity || '-'}</td>
                <td className="p-4">{Block.total_amount || '-'}</td>
               
                <td className="p-4">
                  
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEdit(Block)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(Block.id)}
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
