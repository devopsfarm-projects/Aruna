'use client'
import Link from 'next/link'
import React, { useState } from 'react'

interface Transaction {
  id: string;
  account: {
    name?: string;
    id?: string;
  } | string;
  type: string;
  amount: string;
  mode: string;
  description: string;
  txn_date: string;
  document: string;
  entered_by: {
    email?: string;
    id?: string;
  } | string;
  name?: string;
}

export default function Transactions({ transactionsItems }: { transactionsItems: Transaction[] }) {
  const [, setShowForm] = useState(false)
  const [, setEditId] = useState<string | null>(null)

  const [, setFormData] = useState<Transaction>({
    id: '',
    account: '',
    type: '', 
    amount: '', 
    mode: '',
    description: '',
    txn_date: '',
    document: '',
    entered_by: ''
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl pt-28 mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="text-indigo-600 dark:text-indigo-400">Transactions</span> Directory
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <span className="text-sm">Show Entries</span>
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <span className="text-sm">Search</span>
            </button>
          </div>
          <Link href="/transactions/addtransactions">
            <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
              <span className="text-sm font-medium">Add New Transaction</span>
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="p-4 text-center">S.No.</th>
                <th className="p-4">Account</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Mode</th>
                <th className="p-4">Date</th>
                <th className="p-4">Entered By</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactionsItems.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4 text-center">{index + 1}</td>
                  <td className="p-4">
                    <span className="font-medium">{typeof item.account === 'object' ? item.account?.name || '-' : item.account || '-'}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'debit'
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                          : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">
                      {item.amount?.toLocaleString() ?? '0'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.mode === 'cash'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                          : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                      }`}
                    >
                      {item.mode}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{new Date(item.txn_date).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{typeof item.entered_by === 'object' ? item.entered_by?.email || '-' : item.entered_by || '-'}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setFormData(item)
                          setEditId(item.id)
                          setShowForm(true)
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                      >
                        <span className="text-sm">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                      >
                        <span className="text-sm">Delete</span>
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
