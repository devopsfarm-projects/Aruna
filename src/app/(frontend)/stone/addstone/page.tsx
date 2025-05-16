'use client'

import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'

// Response types
interface ApiResponse<T> {
  docs: T[]
  // Add other pagination fields if your API returns them
  // total?: number
  // limit?: number
  // offset?: number
  // etc.
}

type Measure = {
  qty: number
  l: number
  b: number
  h: number
  rate: number
  labour?: string
  hydra?: string
}

type Stone = {
  vender_id: string
  stoneType: string
  date: string
  mines: string
  addmeasures: Measure[]
  total_quantity: number
  issued_quantity: number
  left_quantity: number
  final_total: number
  partyRemainingPayment: number
  partyAdvancePayment: number
  transportType: string
  createdBy: string
}

interface Phone {
  number: string
  type?: string
}

interface Mines {
  name: ReactNode
  id: number
  Mines_name: string
  address: string
  phone: Phone[]
  mail_id: string
  createdAt: string
  updatedAt: string
}

interface Vendor {
  name: ReactNode
  id: number
  vendor: string
  vendor_no: string
  address: string
  mail_id: string
  Company_no: string
  Mines_name: Mines
  phone: Phone[]
  createdAt: string
  updatedAt: string
}

interface StoneResponse {
  id: number
  vender_id: number
  stoneType: string
  date: string
  mines: Mines
  addmeasures: any[]
  final_total: number
  issued_quantity: number | null
  left_quantity: number | null
  partyAdvancePayment: number | null
  partyRemainingPayment: number
  total_quantity: number | null
  transportType: string | null
  createdAt: string
  updatedAt: string
  createdBy: string | null
}

interface ApiResponse<T> {
  docs: T[]
  // Add other pagination fields if your API returns them
  // total?: number
  // limit?: number
  // offset?: number
}

export default function AddStonePage() {
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [mines, setMines] = useState<Mines[]>([])
  const [labours, setLabours] = useState<any[]>([])
  const [trucks, setTrucks] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newStone, setNewStone] = useState<Stone>({
    vender_id: '',
    stoneType: '',
    date: new Date().toISOString().split('T')[0],
    mines: '',
    addmeasures: [],
    total_quantity: 0,
    issued_quantity: 0,
    left_quantity: 0,
    final_total: 0,
    partyRemainingPayment: 0,
    partyAdvancePayment: 0,
    transportType: 'Hydra',
    createdBy: '', // This should be set to the current user's ID
  })

  // Fetch related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsRes, minesRes, laboursRes, trucksRes] = await Promise.all([
          axios.get<ApiResponse<Vendor>>('/api/vendor'),
          axios.get<ApiResponse<Mines>>('/api/Mines'),
          axios.get<ApiResponse<any>>('/api/labour'),
          axios.get<ApiResponse<any>>('/api/truck')
        ])
        
        setVendors(vendorsRes.data.docs || [])
        setMines(minesRes.data.docs || [])
        setLabours(laboursRes.data.docs || [])
        setTrucks(trucksRes.data.docs || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const updateMeasure = (index: number, field: keyof Measure, value: string | number) => {
    const newMeasures = [...newStone.addmeasures]
    newMeasures[index] = { ...newMeasures[index], [field]: Number(value) }
    
    // Calculate total quantity
    const totalQty = newMeasures.reduce((sum, m) => sum + (Number(m.qty) || 0), 0)
    
    setNewStone(prev => ({
      ...prev,
      addmeasures: newMeasures,
      total_quantity: totalQty,
      left_quantity: totalQty - (prev.issued_quantity || 0)
    }))
  }

  const addNewMeasure = () => {
    setNewStone(prev => ({
      ...prev,
      addmeasures: [...prev.addmeasures, { qty: 0, l: 0, b: 0, h: 0, rate: 0 }]
    }))
  }

  const removeMeasure = (index: number) => {
    const newMeasures = newStone.addmeasures.filter((_, i) => i !== index)
    const totalQty = newMeasures.reduce((sum, m) => sum + (Number(m.qty) || 0), 0)
    
    setNewStone(prev => ({
      ...prev,
      addmeasures: newMeasures,
      total_quantity: totalQty,
      left_quantity: totalQty - (prev.issued_quantity || 0)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
  
    try {
      // Prepare the data in the format expected by the API
      const payload = {
        ...newStone,
        vender_id: Number(newStone.vender_id), // Convert string to number
        mines: Number(newStone.mines), // Convert string to number
        // Ensure numeric fields are numbers
        total_quantity: Number(newStone.total_quantity),
        issued_quantity: Number(newStone.issued_quantity),
        left_quantity: Number(newStone.left_quantity),
        final_total: Number(newStone.final_total),
        partyRemainingPayment: Number(newStone.partyRemainingPayment),
        partyAdvancePayment: Number(newStone.partyAdvancePayment)
      }

      console.log('Submitting data:', JSON.stringify(payload, null, 2))
      
      const response = await axios.post('/api/stone', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      if (response.status === 201) {
        alert('Stone added successfully!')
        router.push('/stone')
      }
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          headers: error.response?.headers,
          data: error.response?.data,
        },
        request: error.request,
        config: error.config
      })
  
      if (axios.isAxiosError(error)) {
        console.error('Request config:', {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers,
        })
  
        if (error.response?.data?.errors) {
          const errorMessages = error.response.data.errors
            .map((err: { message: string }) => err.message)
            .join('\n')
          alert(`Validation errors:\n${errorMessages}`)
        } else {
          alert(`Error: ${error.response?.data?.message || 'Failed to add stone. Please check the console for details.'}`)
        }
      } else {
        alert('An unknown error occurred. Please check the console for details.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Stone</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Stone Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Stone Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={newStone.stoneType}
              onChange={(e) => setNewStone({...newStone, stoneType: e.target.value})}
              required
            >
              <option value="">Select Type</option>
              <option value="Khanda">Khanda</option>
              <option value="Raskat">Raskat</option>
            </select>
          </div>

          {/* Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={newStone.date}
              onChange={(e) => setNewStone({...newStone, date: e.target.value})}
              required
            />
          </div>

          {/* Vendor */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Vendor</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={newStone.vender_id}
              onChange={(e) => setNewStone({...newStone, vender_id: e.target.value})}
              required
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.vendor} - {vendor.Company_no}
                </option>
              ))}
            </select>
          </div>

          {/* Mines */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Mine</span>
            </label>
            <select
              className="select select-bordered text-black w-full"
              value={newStone.mines}
              onChange={(e) => setNewStone({...newStone, mines: e.target.value})}
              required
            >
              <option value="">Select Mine</option>
              {mines.map((mine) => (
                <option key={mine.id} value={mine.id}>
                  {mine.Mines_name}
                </option>
              ))}
            </select>
          </div>

          {/* Transport Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Transport Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={newStone.transportType}
              onChange={(e) => setNewStone({...newStone, transportType: e.target.value})}
              required
            >
              <option value="Hydra">Hydra</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          {/* Party Advance Payment */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Advance Payment</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={newStone.partyAdvancePayment}
              onChange={(e) => setNewStone({
                ...newStone,
                partyAdvancePayment: Number(e.target.value)
              })}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Measurements */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Measurements</h2>
            <button
              type="button"
              onClick={addNewMeasure}
              className="btn btn-sm btn-primary"
            >
              Add Measurement
            </button>
          </div>

          {newStone.addmeasures.map((measure, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 bg-base-200 rounded-lg">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Qty</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={measure.qty}
                  onChange={(e) => updateMeasure(index, 'qty', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">L</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={measure.l}
                  onChange={(e) => updateMeasure(index, 'l', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">B</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={measure.b}
                  onChange={(e) => updateMeasure(index, 'b', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">H</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={measure.h}
                  onChange={(e) => updateMeasure(index, 'h', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Rate</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={measure.rate}
                  onChange={(e) => updateMeasure(index, 'rate', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {newStone.transportType === 'Hydra' ? (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hydra</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={measure.hydra || ''}
                    onChange={(e) => {
                      const newMeasures = [...newStone.addmeasures]
                      newMeasures[index].hydra = e.target.value
                      setNewStone({...newStone, addmeasures: newMeasures})
                    }}
                  >
                    <option value="">Select Hydra</option>
                    {trucks.map((truck) => (
                      <option key={truck.id} value={truck.id}>
                        {truck.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Labour</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={measure.labour || ''}
                    onChange={(e) => {
                      const newMeasures = [...newStone.addmeasures]
                      newMeasures[index].labour = e.target.value
                      setNewStone({...newStone, addmeasures: newMeasures})
                    }}
                  >
                    <option value="">Select Labour</option>
                    {labours.map((labour) => (
                      <option key={labour.id} value={labour.id}>
                        {labour.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeMeasure(index)}
                  className="btn btn-error btn-sm"
                  disabled={newStone.addmeasures.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-base-200 p-4 rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat">
              <div className="stat-title">Total Quantity</div>
              <div className="stat-value">{newStone.total_quantity.toFixed(2)}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Final Total</div>
              <div className="stat-value">₹{newStone.final_total.toFixed(2)}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Remaining Payment</div>
              <div className="stat-value">₹{newStone.partyRemainingPayment.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Stone'}
          </button>
        </div>
      </form>
    </div>
  )
}