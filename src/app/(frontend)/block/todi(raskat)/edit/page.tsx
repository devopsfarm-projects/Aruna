'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';

import Link from 'next/link'

// Type for error response
interface ErrorResponse {
  errors?: Array<{ message: string }>
  message?: string
}

// Type guard function to check if an object is an ErrorResponse
function isErrorResponse(obj: unknown): obj is ErrorResponse {
  return typeof obj === 'object' && obj !== null &&
    ('errors' in obj || 'message' in obj)
}

import { useRouter, useSearchParams } from 'next/navigation'

interface Measure {
  qty: number
  l: number
  b: number
  h: number
  rate: number
  labour?: string
  hydra?: string
  id?: string | number
  black_area?: number
  black_cost?: number
}


type BlockType = {
  total_cost: any
  block: any
  total_area: number
  munim: string
  todirate: string
  front_l: string
  front_b: string
  front_h: string
  back_l: string
  back_b: string
  back_h: string
  todi_cost: string
  hydra_cost: string
  truck_cost: string
  total_todi_cost: string
  id: number | string
  vender_id: number
  BlockType: string
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


export default function EditBlock() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentBlock, setCurrentBlock] = useState<BlockType | null>(null)
  const [newBlock, setNewBlock] = useState<BlockType | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [munims, setMunims] = useState<string[]>([])
  // Update currentBlock when newBlock changes
  useEffect(() => {
    if (newBlock) {
      setCurrentBlock(newBlock)
    }
  }, [newBlock])

  const id = searchParams.get('id') ?? null
  const [, setIsSubmitting] = useState(false)

  // Fetch munims
  useEffect(() => {
    const fetchMunims = async () => {
      try {
        const response = await axios.get<string[]>('/api/munims')
        setMunims(response.data)
      } catch (error) {
        console.error('Error fetching munims:', error)
      }
    }
    fetchMunims()
  }, [])

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return

      try {
        // Fetch block data
        const blockRes = await axios.get<BlockType>(`/api/Todi/${id}`)
        const blockData = blockRes.data
        // Ensure measurements array exists
        if (!blockData.addmeasures) {
          blockData.addmeasures = []
        }

        // Set block data and vendor selection
        setCurrentBlock(blockData)
        setNewBlock(blockData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchAllData()
  }, [id])



   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     if (!newBlock || !id) return
 
 
     try {
       setIsSubmitting(true)
       await axios.patch(`/api/Todi/${id}`, newBlock)
       setShowSuccessModal(true)
      
     } catch (error) {
       console.error('Error updating block:', error)
     } finally {
       setIsSubmitting(false)
     }
   }


  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit block</h1>
          <Link href="/block/todi(raskat)" className="text-gray-600 hover:text-gray-800">
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
               value={newBlock?.BlockType || ''}
               onChange={(e) =>
                 setNewBlock((prev: BlockType | null) =>
                   prev
                     ? {
                         ...prev,
                         BlockType: e.target.value,
                       }
                     : prev,
                 )
               }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Brown">Brown</option>
                <option value="White">White</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Munim
              </label>
              <input
                type="text"
                value={newBlock?.munim || ''}
                onChange={(e) =>
                  setNewBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          munim: e.target.value,
                        }
                      : prev,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Length (लम्बाई)
              </label>
              <input
                type="text"
                value={newBlock?.l || ''}
                onChange={(e) =>
                  setNewBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          l: e.target.value,
                        }
                      : prev,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>



            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Breadth (चौड़ाई)
              </label>
              <input
                type="text"
                value={newBlock?.b || ''}
                onChange={(e) =>
                  setNewBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          b: e.target.value,
                        }
                      : prev,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>



            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Height (ऊंचाई)
              </label>
              <input
                type="text"
                value={newBlock?.h || ''}
                onChange={(e) =>
                  setNewBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          h: e.target.value,
                        }
                      : prev,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              todi_cost
              </label>
              <input
                type="text"
                value={newBlock?.todi_cost || ''}
                onChange={(e) =>
                  setNewBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          todi_cost: e.target.value,
                        }
                      : prev,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              hydra_cost
              </label>
              <input
                type="text"
                value={newBlock?.hydra_cost || ''}
                onChange={(e) =>
                  setNewBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          hydra_cost: e.target.value,
                        }
                      : prev,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  truck_cost
                  </label>
                  <input
                    type="text"
                    value={newBlock?.truck_cost || ''}
                    onChange={(e) =>
                      setNewBlock((prev: BlockType | null) =>
                        prev
                          ? {
                              ...prev,
                              truck_cost: e.target.value,
                            }
                          : prev,
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  total_todi_area
                  </label>
                  <input
                    type="text"
                    value={newBlock?.total_todi_area || ''}
                    onChange={(e) =>
                      setNewBlock((prev: BlockType | null) =>
                        prev
                          ? {
                              ...prev,
                              total_todi_area: e.target.value,
                            }
                          : prev,
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      total_todi_cost
                      </label>
                      <input
                        type="text"
                        value={newBlock?.total_todi_cost || ''}
                        onChange={(e) =>
                          setNewBlock((prev: BlockType | null) =>
                            prev
                              ? {
                                  ...prev,
                                  total_todi_cost: e.target.value,
                                }
                              : prev,
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      estimate_cost
                      </label>
                      <input
                        type="text"
                        value={newBlock?.estimate_cost || ''}
                        onChange={(e) =>
                          setNewBlock((prev: BlockType | null) =>
                            prev
                              ? {
                                  ...prev,
                                  estimate_cost: e.target.value,
                                }
                              : prev,
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      depreciation
                      </label>
                      <input
                        type="text"
                        value={newBlock?.depreciation || ''}
                        onChange={(e) =>
                          setNewBlock((prev: BlockType | null) =>
                            prev
                              ? {
                                  ...prev,
                                  depreciation: e.target.value,
                                }
                              : prev,
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      final_cost
                      </label>
                      <input
                        type="text"
                        value={newBlock?.final_cost || ''}
                        onChange={(e) =>
                          setNewBlock((prev: BlockType | null) =>
                            prev
                              ? {
                                  ...prev,
                                  final_cost: e.target.value,
                                }
                              : prev,
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
          </div>



          <div className="mt-8">
        <button
          type="submit"
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          disabled={!newBlock}
        >
          Save Changes
        </button>
      </div>
        </form>
     
      </div>
    
    </div>
  )
}