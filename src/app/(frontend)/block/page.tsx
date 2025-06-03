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
  const [, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)

  type BlockResponse = {
    docs: Block[]
  }

  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await payload.get<BlockResponse>('/Block')
      setBlocks(res.data.docs)
      setFilteredBlocks(res.data.docs)
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
        (typeof block.vender_id === 'object' && block.vender_id !== null &&
          (block.vender_id.vendor?.toLowerCase().includes(searchVendor.toLowerCase()) ||
            block.vender_id.vendor_no?.toString().toLowerCase().includes(searchVendor.toLowerCase())))
      const mineMatch = !searchMine ||
        (typeof block.mines === 'object' && block.mines !== null &&
          block.mines?.Mines_name?.toLowerCase().includes(searchMine.toLowerCase()))
      return vendorMatch && mineMatch
    })
    setFilteredBlocks(filtered)
  }, [blocks, searchVendor, searchMine])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsSelectAll(checked)
    setSelectedBlocks(
      checked ? new Set(filteredBlocks.map((block) => block.id?.toString())) : new Set()
    )
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

  const deleteBlock = async (id: string | number) => {
    if (id == null) return
    await payload.delete(`/Block/${id}`)
    setBlocks((prev) => prev.filter((b) => b.id?.toString() !== id.toString()))
  }

  const handleBulkDelete = async () => {
    if (selectedBlocks.size === 0) return
    await Promise.all([...selectedBlocks].map(deleteBlock))
    setSelectedBlocks(new Set())
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-24 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          <span className="text-indigo-600 dark:text-indigo-400">Block</span> Inventory
        </h1>
        {selectedBlocks.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
          >
            Delete {selectedBlocks.size} Selected
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Vendor</label>
          <input
            type="text"
            value={searchVendor}
            onChange={(e) => setSearchVendor(e.target.value)}
            placeholder="Vendor or number"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Mine</label>
          <input
            type="text"
            value={searchMine}
            onChange={(e) => setSearchMine(e.target.value)}
            placeholder="Mine name"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-end justify-end">
          <Link href="/block/addblock">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
              Add New Block
            </button>
          </Link>
        </div>
      </div>

      {/* Cards for mobile, table for larger screens */}
      <div className="space-y-4 sm:hidden">
        {filteredBlocks.map((block) => (
          <div key={block.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold text-lg">{typeof block.vender_id === 'object' ? block.vender_id?.vendor || '-' : '-'}</p>
                <p className="text-sm text-gray-500">{typeof block.vender_id === 'object' ? block.vender_id?.vendor_no && `(${block.vender_id.vendor_no})` : '-'}</p>
              </div>
              <input
                type="checkbox"
                checked={selectedBlocks.has(block.id.toString())}
                onChange={() => handleSelectBlock(block.id.toString())}
                className="rounded cursor-pointer"
              />
            </div>
            <p><strong>Mine:</strong> {typeof block.mines === 'object' ? block.mines?.Mines_name || '-' : '-'}</p>
            <p><strong>Type:</strong> {block.BlockType}</p>
            <p><strong>Date:</strong> {block.date}</p>
            <p><strong>Total Qty:</strong> {block.total_quantity || '-'}</p>
            <p><strong>Issued Qty:</strong> {block.issued_quantity || '-'}</p>
            <p><strong>Amount:</strong> {block.total_amount || '-'}</p>
            <div className="flex justify-end gap-4 mt-2">
              <Link href={`/block/edit?id=${block.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                Edit
              </Link>
              <button
                onClick={() => deleteBlock(block.id)}
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table for desktop */}
      <div className="hidden md:block overflow-x-auto rounded-lg">
      <table className="min-w-full bg-white dark:bg-gray-800">
      <thead className="bg-gray-800 text-white dark:bg-gray-700">
            <tr>
              <th className="p-3">
                <input type="checkbox" checked={isSelectAll} onChange={handleSelectAll} />
              </th>
              <th className="p-3">S.No.</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Block Type</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-900 dark:text-white">
            {filteredBlocks.map((block, index) => (
              <tr key={block.id} className="border-b border-gray-200 dark:border-gray-600">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedBlocks.has(block.id.toString())}
                    onChange={() => handleSelectBlock(block.id.toString())}
                  />
                </td>
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3">{typeof block.vender_id === 'object' && block.vender_id?.vendor ? block.vender_id.vendor : '-'}</td>
                <td className="p-3">{block.BlockType}</td>
                <td className="p-3">
                {block.date ? new Date(block.date).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) : '-'}
                </td>
                <td className="p-3">
                  <div className="flex gap-4"> 
                  <Link href={`/block/edit?id=${block.id}`} className="text-blue-500">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="text-red-500"
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
  )
}
