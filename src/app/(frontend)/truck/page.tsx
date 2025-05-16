'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function TruckPage() {
  const [trucks, setTrucks] = useState<any[]>([])
  const [form, setForm] = useState({
    driver_name: '',
    phone: '',
    truck_no: '',
    truck_cost: '',
  })
  const [editId, setEditId] = useState<string | null>(null)

  // Fetch truck data
  const fetchTrucks = async () => {
    try {
      const res = await axios.get('/api/truck')
      setTrucks(res.data.docs || [])
    } catch (error) {
      console.error('Error fetching trucks:', error)
    }
  }

  useEffect(() => {
    fetchTrucks()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId) {
        await axios.patch(`/api/truck/${editId}`, form)
      } else {
        await axios.post('/api/truck', form)
      }
      setForm({ driver_name: '', phone: '', truck_no: '', truck_cost: '' })
      setEditId(null)
      fetchTrucks()
    } catch (error) {
      console.error('Submit failed:', error)
    }
  }

  const handleEdit = (truck: any) => {
    setEditId(truck.id)
    setForm({
      driver_name: truck.driver_name || '',
      phone: truck.phone || '',
      truck_no: truck.truck_no || '',
      truck_cost: truck.truck_cost || '',
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this truck?')) {
      try {
        await axios.delete(`/api/truck/${id}`)
        fetchTrucks()
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          <span className="text-indigo-600 dark:text-indigo-400">Truck</span> Management
        </h1>

        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {editId ? 'Edit Truck Details' : 'Add New Truck'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Driver Name
              </label>
              <input
                type="text"
                name="driver_name"
                placeholder="Enter driver's name"
                value={form.driver_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Driver Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">+</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Truck Number
              </label>
              <input
                type="text"
                name="truck_no"
                placeholder="Enter truck number"
                value={form.truck_no}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Truck Cost
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  ₹
                </div>
                <input
                  type="number"
                  name="truck_cost"
                  placeholder="Enter truck cost"
                  value={form.truck_cost}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
              >
                <span className="font-medium">{editId ? 'Update Truck' : 'Add Truck'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Truck List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Truck List
          </h2>
          
          {trucks.map((truck) => (
            <div
              key={truck.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-full w-12 h-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/20">
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {truck.truck_no?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      Truck #{truck.truck_no}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Driver: {truck.driver_name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(truck)}
                    className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="font-medium">Edit</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(truck.id)}
                    className="bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="font-medium">Delete</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                  <a
                    href={`tel:${truck.phone}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {truck.phone}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{truck.truck_cost}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
