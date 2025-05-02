'use client'

import React, { useEffect, useState } from 'react'

interface Mine {
  id: string
  Mines_name: string
}

export default function VendorForm() {
  const [mines, setMines] = useState<Mine[]>([])
  const [formData, setFormData] = useState({
    Mines_name: '',
    address: '',
    vendor: '',
    vendor_no: '',
    Company_no: '',
    mail_id: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch Mines for dropdown
  useEffect(() => {
    const fetchMines = async () => {
      const res = await fetch('/api/mines')
      const data = await res.json()
      setMines(data?.docs || [])
    }

    fetchMines()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Submission failed')
      }

      setSuccess('Vendor created successfully!')
      setFormData({
        Mines_name: '',
        address: '',
        vendor: '',
        vendor_no: '',
        Company_no: '',
        mail_id: ''
      })
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 text-black p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Vendor</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Mines Name</label>
          <select
            name="Mines_name"
            value={formData.Mines_name}
            onChange={handleChange}
            // required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Mine</option>
            {mines.map((mine) => (
              <option key={mine.id} value={mine.id}>
                {mine.Mines_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Vendor Name</label>
          <input
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

   

        <div>
          <label className="block font-medium">Vendor Mobile No.</label>
          <input
            name="vendor_no"
            value={formData.vendor_no}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Company Mobile No.</label>
          <input
            name="Company_no"
            value={formData.Company_no}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Mail ID</label>
          <input
            type="email"
            name="mail_id"
            value={formData.mail_id}
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



