'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function MinesPage() {
  const [mines, setMines] = useState<any[]>([])
  const [form, setForm] = useState({
    Mines_name: '',
    address: '',
    phone: [{ number: '' }],
    mail_id: '',
  })
  const [editId, setEditId] = useState<string | null>(null)

  // Fetch Mines
  const fetchMines = async () => {
    try {
      const res = await axios.get('/api/Mines')
      setMines(res.data.docs || [])
    } catch (error) {
      console.error('Error fetching mines:', error)
    }
  }

  useEffect(() => {
    fetchMines()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...form.phone]
    newPhones[index].number = value
    setForm({ ...form, phone: newPhones })
  }

  const addPhoneField = () => {
    setForm({ ...form, phone: [...form.phone, { number: '' }] })
  }

  const removePhoneField = (index: number) => {
    const newPhones = [...form.phone]
    newPhones.splice(index, 1)
    setForm({ ...form, phone: newPhones })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId) {
        await axios.patch(`/api/Mines/${editId}`, form)
      } else {
        await axios.post('/api/Mines', form)
      }
      setForm({ Mines_name: '', address: '', phone: [{ number: '' }], mail_id: '' })
      setEditId(null)
      fetchMines()
    } catch (error) {
      console.error('Submit failed:', error)
    }
  }

  const handleEdit = (mine: any) => {
    setEditId(mine.id)
    setForm({
      Mines_name: mine.Mines_name || '',
      address: mine.address || '',
      phone: mine.phone?.length ? mine.phone : [{ number: '' }],
      mail_id: mine.mail_id || '',
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this mine?')) {
      try {
        await axios.delete(`/api/Mines/${id}`)
        fetchMines()
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{editId ? 'Edit Mine' : 'Add New Mine'}</h1>

      <form onSubmit={handleSubmit} className="grid gap-4 bg-gray-100 p-6 rounded-lg shadow-md">
        <input
          type="text"
          name="Mines_name"
          placeholder="Mine Name"
          value={form.Mines_name}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <div>
          <label className="block font-semibold mb-1">Phone Numbers:</label>
          {form.phone.map((p, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={p.number}
                onChange={(e) => handlePhoneChange(i, e.target.value)}
                className="p-2 border rounded flex-1"
                placeholder="Phone Number"
              />
              <button type="button" onClick={() => removePhoneField(i)} className="text-red-500 text-sm">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addPhoneField} className="text-blue-600 text-sm">+ Add Phone</button>
        </div>

        <input
          type="email"
          name="mail_id"
          placeholder="Email ID"
          value={form.mail_id}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {editId ? 'Update Mine' : 'Add Mine'}
        </button>
      </form>

      <h2 className="text-xl font-bold mt-8 mb-4">Mine List</h2>
      <div className="grid gap-4">
        {mines.map((mine) => (
          <div key={mine.id} className="p-4 bg-white shadow-md rounded-xl">
            <p><strong>Name:</strong> {mine.Mines_name}</p>
            <p><strong>Address:</strong> {mine.address}</p>
            <p><strong>Email:</strong> {mine.mail_id}</p>
            <p><strong>Phones:</strong></p>
            <ul className="list-disc list-inside">
              {mine.phone?.map((p: any, i: number) => (
                <li key={i}>{p.number}</li>
              ))}
            </ul>
            <div className="mt-2 flex gap-4">
              <button
                onClick={() => handleEdit(mine)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(mine.id)}
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
