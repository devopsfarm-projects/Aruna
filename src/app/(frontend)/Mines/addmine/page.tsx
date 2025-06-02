"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'  // ✅ Import useRouter
import { GiGoldMine } from 'react-icons/gi'

const AddMineForm = () => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    Mines_name: '',
    address: '',
    phone: [{ number: '' }],
    mail_id: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = e.target

    if (name === 'number' && index !== undefined) {
      const updatedPhones = [...formData.phone]
      updatedPhones[index].number = value
      setFormData({ ...formData, phone: updatedPhones })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const addPhoneField = () => {
    setFormData(prev => ({ ...prev, phone: [...prev.phone, { number: '' }] }))
  }

  const removePhoneField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      phone: prev.phone.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/Mines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      if (response.ok) {
        alert('Mine data added successfully!')
        router.push('/Mines')
      } else {
        console.error('Error:', result)
        alert('Failed to add mine data.')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add New Mine
          </h1>
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <GiGoldMine className="w-7 h-7 text-yellow-500 dark:text-yellow-400" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mine Name */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Mine Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="Mines_name"
              value={formData.Mines_name}
              onChange={handleChange}
              placeholder="Enter mine name"
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 transition"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Enter address"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 transition"
            />
          </div>

          {/* Phone Numbers */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Phone Numbers
            </label>
            {formData.phone.map((p, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <input
                  type="text"
                  name="number"
                  value={p.number}
                  onChange={(e) => handleChange(e, i)}
                  placeholder="Enter phone number"
                  className="flex-grow rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 transition"
                />
                {formData.phone.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhoneField(i)}
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-semibold"
                    aria-label="Remove phone number"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPhoneField}
              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-semibold"
            >
              + Add Phone
            </button>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email ID
            </label>
            <input
              type="email"
              name="mail_id"
              value={formData.mail_id}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-colors"
          >
            Add Mine
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddMineForm
