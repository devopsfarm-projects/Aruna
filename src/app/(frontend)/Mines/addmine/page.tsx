"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'  // ✅ Import useRouter

const AddMineForm = () => {
  const router = useRouter()  // ✅ Initialize router

  const [formData, setFormData] = useState({
    Mines_name: '',
    address: '',
    GST: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/mines', {
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
    <form onSubmit={handleSubmit} className="space-y-4 mt-20 max-w-lg text-black mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold">Add Mine Data</h2>

      <input
        name="Mines_name"
        placeholder="Mine Name"
        value={formData.Mines_name}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />

      <textarea
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="GST"
        placeholder="GST"
        value={formData.GST}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <div>
        <label className="block font-medium">Phone Numbers</label>
        {formData.phone.map((phone, index) => (
          <input
            key={index}
            name="number"
            placeholder="Phone Number"
            value={phone.number}
            onChange={(e) => handleChange(e, index)}
            className="w-full border p-2 rounded mb-2"
          />
        ))}
        <button type="button" onClick={addPhoneField} className="text-blue-500">+ Add Phone</button>
      </div>

      <input
        type="email"
        name="mail_id"
        placeholder="Email"
        value={formData.mail_id}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  )
}

export default AddMineForm


// //mine/page.tsx

// "use client"
// import React, { useState } from 'react'

// const AddMineForm = () => {
//   const [formData, setFormData] = useState({
//     Mines_name: '',
//     address: '',
//     GST: '',
//     phone: [{ number: '' }],
//     mail_id: ''
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
//     const { name, value } = e.target

//     if (name === 'number' && index !== undefined) {
//       const updatedPhones = [...formData.phone]
//       updatedPhones[index].number = value
//       setFormData({ ...formData, phone: updatedPhones })
//     } else {
//       setFormData({ ...formData, [name]: value })
//     }
//   }

//   const addPhoneField = () => {
//     setFormData(prev => ({ ...prev, phone: [...prev.phone, { number: '' }] }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       const response = await fetch('/api/mines', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           // Add Authorization header if needed
//         },
//         body: JSON.stringify(formData)
//       })

//       const result = await response.json()
//       if (response.ok) {
//         alert('Mine data added successfully!')
//         // Clear form
//         setFormData({
//           Mines_name: '',
//           address: '',
//           GST: '',
//           phone: [{ number: '' }],
//           mail_id: ''
//         })
//       } else {
//         console.error('Error:', result)
//         alert('Failed to add mine data.')
//       }
//     } catch (err) {
//       console.error(err)
//       alert('Something went wrong.')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 mt-20 max-w-lg text-black mx-auto p-4 border rounded shadow">
//       <h2 className="text-xl font-bold">Add Mine Data</h2>

//       <input
//         name="Mines_name"
//         placeholder="Mine Name"
//         value={formData.Mines_name}
//         onChange={handleChange}
//         required
//         className="w-full border p-2 rounded"
//       />

//       <textarea
//         name="address"
//         placeholder="Address"
//         value={formData.address}
//         onChange={handleChange}
//         className="w-full border p-2 rounded"
//       />

//       <input
//         name="GST"
//         placeholder="GST"
//         value={formData.GST}
//         onChange={handleChange}
//         className="w-full border p-2 rounded"
//       />

//       <div>
//         <label className="block font-medium">Phone Numbers</label>
//         {formData.phone.map((phone, index) => (
//           <input
//             key={index}
//             name="number"
//             placeholder="Phone Number"
//             value={phone.number}
//             onChange={(e) => handleChange(e, index)}
//             className="w-full border p-2 rounded mb-2"
//           />
//         ))}
//         <button type="button" onClick={addPhoneField} className="text-blue-500">+ Add Phone</button>
//       </div>

//       <input
//         type="email"
//         name="mail_id"
//         placeholder="Email"
//         value={formData.mail_id}
//         onChange={handleChange}
//         className="w-full border p-2 rounded"
//       />

//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//         Submit
//       </button>
//     </form>
//   )
// }

// export default AddMineForm



