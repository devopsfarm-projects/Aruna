'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { ApiResponse } from './types'
import { useRouter, useSearchParams } from 'next/navigation'
import { block } from 'sharp'

type Measure = {
  qty: number
  l: number
  b: number
  h: number
  rate: number
  labour?: string
  hydra?: string
  id?: string | number
}

type block = {
  total_area: number
  total_todi_cost: number
  munim: string
  todirate: string
  hydra_cost: string
  truck_cost: string
  front_l: string
  front_b: string
  front_h: string
  back_l: string
  back_b: string
  back_h: string
  id: number | string
  vender_id: number
  blockType: string
  date: string
  mines: number
  labour_name: string
  addmeasures: Measure[]
  total_quantity: number | null
  issued_quantity: number | null
  left_quantity: number | null
  final_total: number
  partyRemainingPayment: number
  partyAdvancePayment: number | null
  transportType: string | null
  createdBy: { name: string } | null
  createdAt: string
  updatedAt: string
  vehicle_cost: number | null
  vehicle_number: string | null
}

type Vendor = {
  id: number
  vendor: string
  vendor_no: string
  address: string
  mail_id: string
  Company_no: string
  Mines_name: {
    id: number
    Mines_name: string
    address: string
    phone: { number: string }[]
    mail_id: string
  }
}

export default function EditBlock() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [block, setblock] = useState<block | null>(null)
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const id = searchParams.get('id')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return

      try {
        // Fetch block data
        const blockRes = await axios.get<block>(`/api/Block/${id}`)
        const blockData = blockRes.data

        // Fetch vendors
        const vendorsRes = await axios.get<ApiResponse<Vendor>>('/api/vendor')
        const vendorsData = vendorsRes.data.docs

        // Ensure measurements array exists
        if (!blockData.addmeasures) {
          blockData.addmeasures = []
        }

        // Set block data and vendor selection
        setblock(blockData)
        setVendors(vendorsData)
        if (blockData.vender_id) {
          setSelectedVendor(blockData.vender_id.toString())
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
        setLoadingData(false)
      }
    }

    fetchAllData()
  }, [id])

  const handleMeasureChange = (index: number, field: keyof Measure, value: number) => {
    setblock((prev) => {
      if (!prev) return null
      const updatedMeasures = [...(prev.addmeasures || [])]
      updatedMeasures[index] = {
        ...updatedMeasures[index],
        [field]: value,
      }
      return {
        ...prev,
        addmeasures: updatedMeasures,
      }
    })
  }

  const handleAddMeasure = () => {
    setblock((prev) => {
      if (!prev) return null
      const newMeasure: Measure = {
        qty: 0,
        l: 0,
        b: 0,
        h: 0,
        rate: 0,
        labour: '',
        hydra: '',
        id: Date.now(),
      }
      return {
        ...prev,
        addmeasures: [...(prev.addmeasures || []), newMeasure],
      }
    })
  }

  const removeMeasure = (index: number) => {
    setblock((prev) => {
      if (!prev || prev.addmeasures.length <= 1) return prev
      const updatedMeasures = [...prev.addmeasures]
      updatedMeasures.splice(index, 1)
      return {
        ...prev,
        addmeasures: updatedMeasures,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!block || !id) return

    try {
      await axios.patch(`/api/Block/${id}`, block)
      alert('Block updated successfully')
      router.push('/block')
    } catch (error) {
      console.error('Error updating block:', error)
      alert('Error updating block')
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Error: {error}</div>
          <button
            onClick={() => setError(null)}
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!block) {
    return <div className="flex justify-center items-center min-h-screen">Block not found</div>
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit block</h1>
          <Link href="/block" className="text-gray-600 hover:text-gray-800">
            ← Back to block List
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Block Type
              </label>
              <select
                value={block.blockType}
                onChange={(e) =>
                  setblock((prev) => {
                    if (!prev) return null
                    return {
                      ...prev,
                      blockType: e.target.value,
                    }
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Brown">Brown</option>
                <option value="White">White</option>
              </select>
            </div>



            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={block.date || ''}
                onChange={(e) =>
                  setblock(
                    (prev) =>
                      prev && {
                        ...prev,
                        date: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vendor Name
              </label>
              <select
                value={block?.vender_id || ''}
                onChange={(e) => {
                  const selectedId = Number(e.target.value)
                  const selectedVendor = vendors.find((v) => v.id === selectedId)
                  if (selectedVendor) {
                    setblock(
                      (prev) =>
                        prev && {
                          ...prev,
                          vender_id: selectedId,
                          vendor_no: selectedVendor.vendor_no,
                          Company_no: selectedVendor.Company_no,
                        },
                    )
                  } else {
                    setblock(
                      (prev) =>
                        prev && {
                          ...prev,
                          vender_id: selectedId,
                        },
                    )
                  }
                }}
                disabled={loadingData}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.vendor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Munim
              </label>
              <input
                type="text"
                value={block.munim || ''}
                onChange={(e) =>
                  setblock(
                    (prev) =>
                      prev && {
                        ...prev,
                        munim: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Todi Rate
              </label>
              <input
                type="number"
                value={block.todirate || ''}
                onChange={(e) =>
                  setblock(
                    (prev) =>
                      prev && {
                        ...prev,
                        todirate: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

          
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Hydra Cost
              </label>
              <input
                type="number"
                value={block.hydra_cost || ''}
                onChange={(e) =>
                  setblock(
                    (prev) =>
                      prev && {
                        ...prev,
                        hydra_cost: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Truck Cost
              </label>
              <input
                type="number"
                value={block.truck_cost || ''}
                onChange={(e) =>
                  setblock(
                    (prev) =>
                      prev && {
                        ...prev,
                        truck_cost: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Total Quantity
              </label>
              <input
                type="number"
                value={block.total_quantity || ''}
                onChange={(e) =>
                  setblock(
                    (prev) =>
                      prev && {
                        ...prev,
                        truck_cost: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>



            <div className="mt-8 col-span-2 grid grid-cols-1 md:grid-cols-3  gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Front L (लम्बाई) - Length
                </label>
                <input
                  type="number"
                  value={block.front_l || ''}
                  onChange={(e) =>
                    setblock(
                      (prev) =>
                        prev && {
                          ...prev,
                          truck_cost: e.target.value,
                        },
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Front B (चौड़ाई) - Breadth
                </label>
                <input
                  type="number"
                  value={block.front_b || ''}
                  onChange={(e) =>
                    setblock(
                      (prev) =>
                        prev && {
                          ...prev,
                          truck_cost: e.target.value,
                        },
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Front H (ऊंचाई) - Height
                </label>
                <input
                  type="number"
                  value={block.front_h || ''}
                  onChange={(e) =>
                    setblock(
                      (prev) =>
                        prev && {
                          ...prev,
                          truck_cost: e.target.value,
                        },
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Back L (लम्बाई) - Length
                </label>
                <input
                  type="number"
                  value={block.back_l || ''}
                  onChange={(e) =>
                    setblock(
                      (prev) =>
                        prev && {
                          ...prev,
                          truck_cost: e.target.value,
                        },
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Back B (चौड़ाई) - Breadth
                </label>
                <input
                  type="number"
                  value={block.back_b || ''}
                  onChange={(e) =>
                    setblock(
                      (prev) =>
                        prev && {
                          ...prev,
                          truck_cost: e.target.value,
                        },
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Back H (ऊंचाई) - Height
                </label>
                <input
                  type="number"
                  value={block.back_h || ''}
                  onChange={(e) =>
                    setblock(
                      (prev) =>
                        prev && {
                          ...prev,
                          truck_cost: e.target.value,
                        },
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Total Area (Front Volume + Back Volume)/ 144
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                  {block.total_area || 0}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Total Todi Cost = (Total Area * Todi Rate)
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                  {block.total_todi_cost || 0}
                </div>
              </div>


            </div>

            {/* Measurements */}
            <div className="mt-8 col-span-2">

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Measurements
                </h2>

                {block.addmeasures?.map((measure, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Measurement {index + 1}
                      </h3>
                      {block.addmeasures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMeasure(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Length (L)
                        </label>
                        <input
                          type="number"
                          value={measure.l}
                          onChange={(e) =>
                            handleMeasureChange(index, 'l', parseFloat(e.target.value))
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Breadth (B)
                        </label>
                        <input
                          type="number"
                          value={measure.b}
                          onChange={(e) =>
                            handleMeasureChange(index, 'b', parseFloat(e.target.value))
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Height (H)
                        </label>
                        <input
                          type="number"
                          value={measure.h}
                          onChange={(e) =>
                            handleMeasureChange(index, 'h', parseFloat(e.target.value))
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Block Area (L*B*H)/144
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {(measure.l * measure.b * measure.h)/144 || 0}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Black Cost = Block Area * Todi Rate
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {((Number(measure.l) * Number(measure.b) * Number(measure.h))/144 || 0) * Number(block.todirate || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddMeasure}
                  className="mt-4 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                >
                  Add Measurement
                </button>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function setSelectedVendor(_arg0: string) {
  throw new Error('Function not implemented.')
}
