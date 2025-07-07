'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ActionHeader, CheckBox, DeleteButton, EditButton, FloatButton } from '../components/Button'

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [stoneToDelete, setStoneToDelete] = useState<string | null>(null)

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
    const newSet = selectAll ? new Set<string>() : new Set<string>(stones.map(s => s.id.toString()))
    setSelected(newSet)
    setSelectAll(!selectAll)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/stone/${id}`, { method: 'DELETE' })
    setStones(prev => prev.filter(s => s.id.toString() !== id))
    setSelected(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
    setStoneToDelete(null)
    setDeleteModalOpen(false)
  }

  const handleBulkDelete = async () => {
    if (selected.size && confirm(`Delete ${selected.size} selected stones?`)) {
      await Promise.all([...selected].map(id => fetch(`/api/stone/${id}`, { method: 'DELETE' })))
      setStones(prev => prev.filter(s => !selected.has(s.id.toString())))
      setSelected(new Set())
      setSelectAll(false)
    }
  }

  const openDeleteModal = (id: string) => {
    setStoneToDelete(id)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setStoneToDelete(null)
  }


  

  return (
    <div className=" pt-4 px-4 md:px-8 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-indigo-600">Stone Inventory</h1>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && stoneToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Confirm Deletion</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this stone?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(stoneToDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto bg-white dark:bg-black shadow">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
            <thead className="bg-white dark:bg-black border-b dark:border-gray-600 text-white">
              <tr>
                {/* <th className="p-3 text-left">
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th> */}
                <th className="p-3 text-left">Stone</th>
                <th className="p-3 text-left">Munim</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Rate</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Hydra</th>
                <th className="p-3 text-left">Amount</th>
                <ActionHeader />
              </tr>
            </thead>
            <tbody>
              {stones.map(stone => (
                <tr key={stone.id} className="border-b dark:border-gray-600">
                  {/* <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(stone.id.toString())}
                      onChange={() => handleSelect(stone.id.toString())}
                    />
                  </td> */}
                  <td className="p-3">{stone.stoneType}</td>
                  <td className="p-3">{stone.munim}</td>
                  <td className="p-3">{stone.date ? new Date(stone.date).toLocaleDateString() : '-'}</td>
                  <td className="p-3">{stone.rate?.toLocaleString('en-IN') || '0'}</td>
                  <td className="p-3">{stone.total_quantity ?? '-'}</td>
                  <td className="p-3">{stone.hydra_cost ?? '-'}</td>
                  <td className="p-3">₹{stone.total_amount?.toLocaleString('en-IN') || '0'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                     <EditButton href={`/stone/edit?id=${stone.id}`} />
                     <DeleteButton onClick={() => handleDelete(stone.id.toString())} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {stones.map(stone => (
            <div key={stone.id} className="bg-white dark:bg-gray-800 shadow-lg hover:scale-[1.02] transform transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">{stone.stoneType}</h2>
                  {/* <input
                    type="checkbox"
                    checked={selected.has(stone.id.toString())}
                    onChange={() => handleSelect(stone.id.toString())}
                    className="w-5 h-5"
                  /> */}


                  <CheckBox checked={selected.has(stone.id.toString())} handleSelect={() => handleSelect(stone.id.toString())} />
                </div>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Munim:</span><span>{stone.munim || '-'}</span></div>
                <div className="flex justify-between"><span>Date:</span><span>{stone.date ? new Date(stone.date).toLocaleDateString() : '-'}</span></div>
                <div className="flex justify-between"><span>Rate:</span><span>₹{stone.rate?.toLocaleString('en-IN') ?? '0'}</span></div>
                <div className="flex justify-between"><span>Qty:</span><span>{stone.total_quantity ?? '-'}</span></div>
                <div className="flex justify-between"><span>Hydra:</span><span>{stone.hydra_cost ?? '-'}</span></div>
                <div className="flex justify-between"><span>Amount:</span><span>₹{stone.total_amount?.toLocaleString('en-IN') || '0'}</span></div>
              </div>
              <div className="p-4 border-t border-gray-300 flex justify-end gap-4">
                <EditButton href={`/stone/edit?id=${stone.id}`} />
                <DeleteButton onClick={() => openDeleteModal(stone.id.toString())} />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Buttons */}
        <FloatButton selected={selected} handleBulkDelete={handleBulkDelete} link="/stone/addstone" title={`Delete ${selected.size} selected items`} />
      </div>
    </div>
  )
}
