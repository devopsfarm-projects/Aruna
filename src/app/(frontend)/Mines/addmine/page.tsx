"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'  // ✅ Import useRouter
import { GiGoldMine } from 'react-icons/gi'
const AddMineForm = () => {
  const router = useRouter()  // ✅ Initialize router

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      if (response.ok) {
        alert('Mine data added successfully!')
        // Navigate to /mine
        router.push('/Mines')  // ✅ Navigate after success
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
    <div className="space-y-4 mt-20 max-w-lg text-black mx-auto p-4 border rounded shadow">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Mine
          </h1>
          <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full">
            <GiGoldMine className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mine Name
            </label>
            <input
              type="text"
              name="Mines_name"
              value={formData.Mines_name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Numbers
            </label>
            {formData.phone.map((p, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  name="number"
                  value={p.number}
                  onChange={(e) => handleChange(e, i)}
                  className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  placeholder="Phone Number"
                />
                <button
                  type="button"
                  onClick={() => removePhoneField(i)}
                  className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPhoneField}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-2"
            >
              + Add Phone
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email ID
            </label>
            <input
              type="email"
              name="mail_id"
              value={formData.mail_id}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 dark:bg-primary-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          >
            Add Mine
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMineForm;
