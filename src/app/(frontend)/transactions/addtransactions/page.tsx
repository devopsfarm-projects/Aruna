//src/app/(frontend)/transactions/addtransactions/page.tsx

'use client'

import React, { useEffect, useState } from 'react'

interface Accounts {
  id: string
  account: string
}

export default function TransactionsForm() {
  const [accounts, setAccounts] = useState<Accounts[]>([])
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

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await fetch('/api/accounts') // Adjust this endpoint
      const data = await res.json()
      setAccounts(data?.docs || [])
    }

    fetchAccounts()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, files } = e.target as any
    if (files) {
      setFormData({ ...formData, [name]: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const payload = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value as any)
    })

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        body: payload,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Submission failed')
      }

      setSuccess('Transaction created successfully!')
      setFormData({
        account: '', // from dropdown
        type: '', // credit or debit
        amount: '', // number input
        mode: '', // cash / upi / bank / cheque
        description: '', // textarea
        txn_date: '', // date input
        document: '', // upload ID or URL (if handling uploads separately)
        entered_by: '', // current logged-in user ID
      })
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-20 text-black p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create Transaction</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Account</label>
          <select
            name="account"
            value={formData.account}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
             <option key={account.id} value={account.id}>
             {account.account}
           </option>
           
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Transaction Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Type</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Amount</label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Mode</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Mode</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Transaction Date</label>
          <input
            name="txn_date"
            type="date"
            value={formData.txn_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Document (Upload)</label>
          <input
            name="document"
            type="text"
            value={formData.document}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Entered By (User ID)</label>
          <input
            name="entered_by"
            value={formData.entered_by}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
