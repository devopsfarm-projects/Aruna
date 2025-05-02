'use client'
import Link from 'next/link'
import React, { useState } from 'react'

export default function transactions({ transactionsItems }: { transactionsItems: any[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    account: '',
    type: '', 
    amount: '', 
    mode: '', 
    description: '', 
    txn_date: '', 
    document: '', 
    entered_by: '', 
  })

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this transactions?')
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('transactions deleted successfully!')
      } else {
        console.error('Failed to delete transactions')
      }
    } catch (error) {
      console.error('Error deleting transactions:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <h1 className="text-3xl font-semibold text-center mb-6">transactions Directory</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <button className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-200 transition">
          Show Entries
        </button>
        <button className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-200 transition">
          Search
        </button>
        <Link href="/transactions/addtransactions">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Add New transactions
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">S.No.</th>
              <th className="p-3 text-left">Account</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Mode</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Entered By</th>
              <th className="p-3">Edit</th>
              <th className="p-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {transactionsItems.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3">{item.account?.name || item.account || '-'}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">{item.amount}</td>
                <td className="p-3">{item.mode}</td>
                <td className="p-3">{new Date(item.txn_date).toLocaleDateString()}</td>
                <td className="p-3">{item.entered_by?.email || item.entered_by || '-'}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setFormData(item)
                      setEditId(item.id)
                      setShowForm(true)
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
