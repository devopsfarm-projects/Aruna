'use client'

import React, { useState } from 'react'
import Link from 'next/link'

type Stone = {
  id: number
  stoneType: 'Khanda' | 'Gudiya'
  munim?: string | null
  rate?: number | null
  date?: string | null
  total_quantity?: number | null
  total_amount?: number | null
  hydra_cost?: number | null
}

export default function StoneList({ initialStones }: { initialStones: Stone[] }) {
  const [stones, setStones] = useState<Stone[]>(initialStones)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  const handleSelect = (id: string) => {
    const updated = new Set(selected)
    if (updated.has(id)) {
      updated.delete(id)
    } else {
      updated.add(id)
    }
    setSelected(updated)
    setSelectAll(updated.size === stones.length)
  }

  const handleSelectAll = () => {
    const newSet = selectAll 
      ? new Set<string>() 
      : new Set<string>(stones.map(s => s.id.toString()))
    setSelected(newSet)
    setSelectAll(!selectAll)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this stone?')) {
      await fetch(`/api/stone/${id}`, { method: 'DELETE' })
      setStones(prev => prev.filter(s => s.id.toString() !== id))
    }
  }

  const handleBulkDelete = async () => {
    if (selected.size && confirm(`Delete ${selected.size} selected stones?`)) {
      await Promise.all([...selected].map(id => fetch(`/api/stone/${id}`, { method: 'DELETE' })))
      setStones(prev => prev.filter(s => !selected.has(s.id.toString())))
      setSelected(new Set())
      setSelectAll(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-indigo-600">Stone Inventory</h1>

        {/* Table */}
        <div className="hidden md:block overflow-x-auto bg-white dark:bg-black  shadow">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
            <thead className="bg-white dark:bg-black border-b dark:border-gray-600 text-white">
              <tr>
                <th className="p-3 text-left"><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                <th className="p-3 text-left">Stone</th>
                <th className="p-3 text-left">Munim</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Rate</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Hydra</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stones.map((stone, i) => (
                <tr key={stone.id} className="border-b dark:border-gray-600">
                  <td className="p-3"><input type="checkbox" checked={selected.has(stone.id.toString())} onChange={() => handleSelect(stone.id.toString())} /></td>
                  <td className="p-3">{stone.stoneType}</td>
                  <td className="p-3">{stone.munim}</td>
                  <td className="p-3">{stone.date ? new Date(stone.date).toLocaleDateString() : '-'}</td>
                  <td className="p-3">{stone.rate?.toLocaleString('en-IN') || '0'}</td>
                  <td className="p-3">{stone.total_quantity ?? '-'}</td>
                  <td className="p-3">{stone.hydra_cost ?? '-'}</td>
                  <td className="p-3">₹{stone.total_amount?.toLocaleString('en-IN') || '0'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link href={`/stone/edit?id=${stone.id}`} className="text-blue-500">Edit</Link>
                      <button onClick={() => handleDelete(stone.id.toString())} className="text-red-500">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
<div className="space-y-4 md:hidden">
  {stones.map((stone) => (
    <div
      key={stone.id}
      className="bg-white dark:bg-gray-800  overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 ">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{stone.stoneType}</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selected.has(stone.id.toString())}
              onChange={() => handleSelect(stone.id.toString())}
              className="w-5 h-5 text-blue-500 bg-gray-100 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Munim:</span>
          <span className="font-semibold">{stone.munim || '-'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Date:</span>
          <span className="font-semibold">{stone.date ? new Date(stone.date).toLocaleDateString() : '-'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Rate:</span>
          <span className="font-semibold">₹{stone.rate?.toLocaleString('en-IN') ?? '0'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Qty:</span>
          <span className="font-semibold">{stone.total_quantity ?? '-'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Hydra:</span>
          <span className="font-semibold">{stone.hydra_cost ?? '-'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Amount:</span>
          <span className="font-semibold">₹{stone.total_amount?.toLocaleString('en-IN') || '0'}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 p-4">
        <div className="flex justify-end gap-4">
          <Link 
            href={`/stone/edit?id=${stone.id}`} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit
          </Link>
          <button 
            onClick={() => handleDelete(stone.id.toString())} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


        {/* FABs */}
        <div className="fixed bottom-20 right-4 z-50 space-y-2">
          {selected.size > 0 && (
            <button onClick={handleBulkDelete} className="bg-red-600 p-3 text-white rounded-full shadow">
              🗑️
            </button>
          )}
          <Link href="/stone/addstone">
          <button className="bg-indigo-600 text-white p-3 rounded-full shadow hover:bg-indigo-700">
            +
          </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
