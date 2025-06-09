'use client'
import { useEffect, useState, useCallback } from 'react'
import payload from './lib/payload'
import Link from 'next/link'
import type { Block } from '../../../payload-types'

export default function BlockList() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([])
  const [searchVendor, setSearchVendor] = useState('')
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
      
     
      return vendorMatch 
    })
    setFilteredBlocks(filtered)
  }, [blocks, searchVendor])

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

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-24 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          <span className="text-indigo-600 dark:text-indigo-400">Block</span> Inventory
        </h1>
    
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
 
   
      </div>

      {/* Cards for mobile, table for larger screens */}
      <div className="space-y-4 sm:hidden">
        {filteredBlocks.map((block) => (
          <div key={block.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {typeof block.vender_id === 'object' ? block.vender_id?.vendor || '-' : '-'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {typeof block.vender_id === 'object' ? block.vender_id?.vendor_no && `#${block.vender_id.vendor_no}` : '-'}
                  </span>
                </div>
                <span className="px-2 py-1 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                  {block.BlockType}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBlocks.has(block.id.toString())}
                  onChange={() => handleSelectBlock(block.id.toString())}
                  className="rounded cursor-pointer h-4 w-4"
                />
                <button 
                  onClick={() => deleteBlock(block.id)} 
                  className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Date: {block.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm">Total Qty: {block.total_quantity || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Issued Qty: {block.issued_quantity || '-'}</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Link 
                href={`/block/edit?id=${block.id}`} 
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800"
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
             {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 z-50">
        <div className="flex flex-col items-end space-y-2">
          {selectedBlocks.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all flex items-center justify-center shadow-md"
              title={`Delete ${selectedBlocks.size} selected items`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <Link href="/block/addblock">
            <button className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center">
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
