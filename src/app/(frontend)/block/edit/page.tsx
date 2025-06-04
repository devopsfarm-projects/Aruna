'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { ApiResponse } from './types'
import { useRouter, useSearchParams } from 'next/navigation'

type Measure = {
  qty: number
  l: number
  b: number
  h: number
  rate: number
  labour?: string
  hydra?: string
}

type block = {
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

        setblock(blockData)
        setVendors(vendorsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('Error loading data')
      } finally {
        setLoading(false)
        setLoadingData(false)
      }
    }

    fetchAllData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!block || !id) return

    try {
      await axios.patch(`/api/Block/${id}`, block)
      alert('block updated successfully')
      router.push('/block')
    } catch (error) {
      console.error('Error updating block:', error)
      alert('Error updating block')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!block) {
    return <div className="flex justify-center items-center min-h-screen">block not found</div>
  }



  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit block
          </h1>
          <Link href="/block" className="text-gray-600 hover:text-gray-800">
            ← Back to block List
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vendor Name
              </label>
              <select
                value={block?.vender_id || ''}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  const selectedVendor = vendors.find(v => v.id === selectedId);
                  if (selectedVendor) {
                    setblock(prev => prev && {
                      ...prev,
                      vender_id: selectedId,
                      vendor_no: selectedVendor.vendor_no,
                      Company_no: selectedVendor.Company_no
                    });
                  } else {
                    setblock(prev => prev && {
                      ...prev,
                      vender_id: selectedId
                    });
                  }
                }}
                disabled={loadingData}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Vendor</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.vendor}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Block Type
              </label>
              <select
                value={block.blockType}
                onChange={(e) => 
                  setblock(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      blockType: e.target.value
                    };
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
                value={block.date}
                onChange={(e) => 
                  setblock(prev => prev && {
                    ...prev,
                    date: e.target.value
                  })
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
                  setblock(prev => prev && {
                    ...prev,
                    total_quantity: e.target.value ? parseInt(e.target.value) : null
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Issued Quantity
              </label>
              <input
                type="number"
                value={block.issued_quantity ?? ''}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  setblock(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      issued_quantity: value ? parseInt(value) : null
                    };
                  })
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Transport Type
              </label>
              <select
                value={block.transportType || ''}
                onChange={(e) => 
                  setblock(prev => prev && {
                    ...prev,
                    transportType: e.target.value || null
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select transport type</option>
                <option value="Hydra">Hydra</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vehicle Number
              </label>
              <input
                type="text"
                value={block.vehicle_number ?? ''}
                onChange={(e) => 
                  setblock(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      vehicle_number: e.target.value || null
                    };
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vehicle Cost
              </label>
              <input
                type="number"
                value={block.vehicle_cost ?? ''}
                onChange={(e) => 
                  setblock(prev => {
                    const newCost = parseInt(e.target.value);
                    if (!prev) return null;  // Return null instead of incomplete object
                    return {
                      ...prev,
                      vehicle_cost: newCost
                    };
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Labour Name
              </label>
              <input
                type="text"
                value={block.labour_name}
                onChange={(e) => 
                  setblock(prev => prev && {
                    ...prev,
                    labour_name: e.target.value
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Measurements</h2>
            <div className="space-y-4">
              {block.addmeasures && block.addmeasures.length > 0 ? (
                block.addmeasures.map((measure, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Length
                      </label>
                      <input
                        type="number"
                        value={measure.l}
                        onChange={(e) => 
                          setblock(prev => prev && {
                            ...prev,
                            addmeasures: prev.addmeasures.map((m, i) => 
                              i === index ? { ...m, l: parseInt(e.target.value) } : m
                            )
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Breadth
                      </label>
                      <input
                        type="number"
                        value={measure.b}
                        onChange={(e) => 
                          setblock(prev => prev && {
                            ...prev,
                            addmeasures: prev.addmeasures.map((m, i) => 
                              i === index ? { ...m, b: parseInt(e.target.value) } : m
                            )
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Height
                      </label>
                      <input
                        type="number"
                        value={measure.h}
                        onChange={(e) => 
                          setblock(prev => prev && {
                            ...prev,
                            addmeasures: prev.addmeasures.map((m, i) => 
                              i === index ? { ...m, h: parseInt(e.target.value) } : m
                            )
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No measurements available</div>
              )}
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
        </form>
      </div>
    </div>
  )
}
