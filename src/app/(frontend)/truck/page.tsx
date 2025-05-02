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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{editId ? 'Edit Truck' : 'Add New Truck'}</h1>

      <form onSubmit={handleSubmit} className="grid gap-4 bg-gray-100 p-6 rounded-lg shadow-md">
        <input
          type="text"
          name="driver_name"
          placeholder="Driver Name"
          value={form.driver_name}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Driver Mobile No."
          value={form.phone}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="truck_no"
          placeholder="Truck No"
          value={form.truck_no}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="truck_cost"
          placeholder="Truck Cost"
          value={form.truck_cost}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {editId ? 'Update Truck' : 'Add Truck'}
        </button>
      </form>

      <h2 className="text-xl font-bold mt-8 mb-4">Truck List</h2>
      <div className="grid gap-4">
        {trucks.map((truck) => (
          <div key={truck.id} className="p-4 bg-white shadow-md rounded-xl">
            <p><strong>Driver Name:</strong> {truck.driver_name}</p>
            <p><strong>Phone:</strong> {truck.phone}</p>
            <p><strong>Truck No:</strong> {truck.truck_no}</p>
            <p><strong>Truck Cost:</strong> {truck.truck_cost}</p>
            <div className="mt-2 flex gap-4">
              <button
                onClick={() => handleEdit(truck)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(truck.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
