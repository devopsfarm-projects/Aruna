"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GiGoldMine } from 'react-icons/gi'


interface Mine {
  id: string
  Mines_name: string
  address: string
  phone: Array<{ number: string }>
  mail_id: string
}

const EditMineForm = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [formData, setFormData] = useState<Mine>({
    id: '',
    Mines_name: '',
    address: '',
    phone: [{ number: '' }],
    mail_id: ''
  })

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const response = await fetch(`/api/Mines/${params.id}`)
        const data = await response.json()
        setFormData(data)
      } catch (error) {
        console.error('Error fetching mine:', error)
      }
    }
    fetchMine()
  }, [params.id])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/Mines/${params['mine.id']}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      if (response.ok) {
        alert('Mine data updated successfully!')
        router.push('/Mines')
      } else {
        console.error('Error:', result)
        alert('Failed to update mine data.')
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
            Edit Mine
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
            {formData.phone.map((phone, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="tel"
                  name="number"
                  value={phone.number}
                  onChange={(e) => handleChange(e, index)}
                  className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedPhones = formData.phone.filter((_, i) => i !== index)
                      setFormData({ ...formData, phone: updatedPhones })
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPhoneField}
              className="text-primary-500 hover:text-primary-600 mt-2"
            >
              Add another phone number
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="mail_id"
              value={formData.mail_id}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/Mines')}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white rounded-lg hover:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMineForm
