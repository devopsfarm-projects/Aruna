"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const AddVendorForm = () => {
  const router = useRouter()

  const [minesList, setMinesList] = useState([])
  const [formData, setFormData] = useState({
    Mines_name: "",
    address: "",
    vendor: "",
    GST: "",
    vendor_no: "",
    Company_no: "",
    mail_id: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Fetch available mines for dropdown
  useEffect(() => {
    const fetchMines = async () => {
      try {
        const res = await fetch("/api/mines") 
        const data = await res.json()
        setMinesList(data?.docs || [])
      } catch (error) {
        console.error("Failed to fetch mines", error)
      }
    }

    fetchMines()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await res.json()
      if (res.ok) {
        alert("Vendor added successfully!")
        router.push("/Vendor")
      } else {
        alert("Error: " + result.error)
        console.error(result)
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-md rounded space-y-4 text-black"
    >
      <h2 className="text-2xl font-semibold mb-4">Add Vendor</h2>

      <div>
        <label className="block font-medium mb-1">Mines Name</label>
        <select
          name="Mines_name"
          value={formData.Mines_name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">-- Select Mine --</option>
          {minesList.map((mine: any) => (
            <option key={mine.id} value={mine.id}>
              {mine.name || mine.title || mine.id}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
          className="w-full border p-2 rounded"
        />
      </div>

      <input
        name="vendor"
        placeholder="Vendor Name"
        value={formData.vendor}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="GST"
        placeholder="GST No."
        value={formData.GST}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="vendor_no"
        placeholder="Vendor Mobile No."
        value={formData.vendor_no}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="Company_no"
        placeholder="Company Mobile No."
        value={formData.Company_no}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="email"
        name="mail_id"
        placeholder="Email"
        value={formData.mail_id}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  )
}

export default AddVendorForm
