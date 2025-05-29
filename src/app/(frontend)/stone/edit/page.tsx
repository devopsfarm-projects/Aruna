'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
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

type Stone = {
  id: number | string
  vender_id: {
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
  labour_name?: string
  stoneType: string
  date: string
  mines: {
    id: number
    Mines_name: string
    address: string
    phone: { number: string }[]
    mail_id: string
  }
  vehicle_number?: string
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
  vehicle_cost?: number
}

export default function EditStone() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stone, setStone] = useState<Stone | null>(null)
  const [loading, setLoading] = useState(true)
  const id = searchParams.get('id')

  useEffect(() => {
    const fetchStone = async () => {
      if (!id) return

      try {
        const res = await axios.get<Stone>(`/api/stone/${id}`)
        setStone(res.data)
      } catch (error) {
        console.error('Error fetching stone:', error)
        alert('Error loading stone data')
      } finally {
        setLoading(false)
      }
    }

    fetchStone()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stone || !id) return

    try {
      await axios.patch(`/api/stone/${id}`, stone)
      alert('Stone updated successfully')
      router.push('/stone')
    } catch (error) {
      console.error('Error updating stone:', error)
      alert('Error updating stone')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!stone) {
    return <div className="flex justify-center items-center min-h-screen">Stone not found</div>
  }


  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Stone</h1>
          <Link href="/stone" className="text-gray-600 hover:text-gray-800">
            ← Back to Stone List
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vendor Name
              </label>
              <input
                type="text"
                value={stone.vender_id.vendor}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        vender_id: {
                          ...prev.vender_id,
                          vendor: e.target.value,
                        },
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vendor Number
              </label>
              <input
                type="text"
                value={stone.vender_id.vendor_no}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        vender_id: {
                          ...prev.vender_id,
                          vendor_no: e.target.value,
                        },
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Company Number
              </label>
              <input
                type="text"
                value={stone.vender_id.Company_no}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        vender_id: {
                          ...prev.vender_id,
                          Company_no: e.target.value,
                        },
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Mine Name
              </label>
              <input
                type="text"
                value={stone.mines.Mines_name}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        mines: {
                          ...prev.mines,
                          Mines_name: e.target.value,
                        },
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Stone Type
              </label>
              <input
                type="text"
                value={stone.stoneType}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        stoneType: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={stone.date}
                onChange={(e) =>
                  setStone(
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
                Total Quantity
              </label>
              <input
                type="number"
                value={stone.total_quantity ?? ''}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        total_quantity: parseInt(e.target.value),
                      },
                  )
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
                value={stone.issued_quantity ?? ''}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        issued_quantity: parseInt(e.target.value),
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Left Quantity
              </label>
              <input
                type="number"
                value={stone.left_quantity ?? ''}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        left_quantity: parseInt(e.target.value),
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Transport Type
              </label>
              <input
                type="text"
                value={stone.transportType ?? ''}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        transportType: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vehicle Number
              </label>
              <input
                type="text"
                value={stone.vehicle_number || ''}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        vehicle_number: e.target.value,
                      },
                  )
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
                value={stone.vehicle_cost}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        vehicle_cost: parseInt(e.target.value),
                      },
                  )
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
                value={stone.labour_name}
                onChange={(e) =>
                  setStone(
                    (prev) =>
                      prev && {
                        ...prev,
                        labour_name: e.target.value,
                      },
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Measurements</h2>
            <div className="space-y-4">
              {stone.addmeasures.map((measure, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Length
                    </label>
                    <input
                      type="number"
                      value={measure.l}
                      onChange={(e) =>
                        setStone(
                          (prev) =>
                            prev && {
                              ...prev,
                              addmeasures: prev.addmeasures.map((m, i) =>
                                i === index ? { ...m, l: parseInt(e.target.value) } : m,
                              ),
                            },
                        )
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
                        setStone(
                          (prev) =>
                            prev && {
                              ...prev,
                              addmeasures: prev.addmeasures.map((m, i) =>
                                i === index ? { ...m, b: parseInt(e.target.value) } : m,
                              ),
                            },
                        )
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
                        setStone(
                          (prev) =>
                            prev && {
                              ...prev,
                              addmeasures: prev.addmeasures.map((m, i) =>
                                i === index ? { ...m, h: parseInt(e.target.value) } : m,
                              ),
                            },
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
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
