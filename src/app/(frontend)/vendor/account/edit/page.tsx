'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ApiResponse } from '@/types'
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
  l: string
  b: string
  h: string
  block_area: string
  block_cost: string
  id?: string | number
}

interface Block {
  addmeasures: Measure[]
  block_cost: string
}

interface Group {
  g_hydra_cost: string;
  g_truck_cost: string;
  date: string;
  block: Block[];
  [key: string]: string | Block[];
}

// Define valid field names for each level
type GroupField = keyof Group

type Vendor = {
  id: number
  vendor: string
  vendor_no: string
  address: string
}

type BlockType = {
  total_cost: any
  block: any
  vender_id: number
  total_area: number
  munim: string
  todirate: string
  total_todi_area: string
  estimate_cost: string
  depreciation: string
  final_cost: string
  l: string
  b: string
  h: string
  todi_cost: string
  hydra_cost: string
  truck_cost: string
  total_todi_cost: string
  id: number | string
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
  group: Group[]
}


export default function EditBlock() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentBlock, setCurrentBlock] = useState<BlockType | null>(null)
  const [newBlock, setNewBlock] = useState<BlockType | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [munims, setMunims] = useState<string[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
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

        // Fetch vendors
        const vendorsRes = await axios.get<ApiResponse<Vendor>>('/api/vendor')
        const vendorsData = vendorsRes.data.docs
        setVendors(vendorsData)
        // Ensure measurements array exists
        if (!blockData.addmeasures) {
          blockData.addmeasures = []
        }

        // Set block data and vendor selection
        setCurrentBlock(blockData)
        setNewBlock(blockData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
        setLoadingData(false)
      }
    }

    fetchAllData()
  }, [id])

  // Handle nested changes in groups, blocks, and measures
  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, gIdx: number, bIdx?: number, mIdx?: number) => {
    if (!newBlock) return

    const updatedBlock = { ...newBlock }
    const fieldName = e.target.name;
    
    // Update group level fields
    if (bIdx === undefined) {
      // Update group level fields
      if (fieldName in updatedBlock.group[gIdx]) {
        updatedBlock.group[gIdx][fieldName] = e.target.value;
      }
    }
    // Update block level fields
    else if (mIdx === undefined) {
      // Get the current block object
      const currentBlock = updatedBlock.group[gIdx].block[bIdx];
      // Update group level fields
      if (fieldName in updatedBlock.group[gIdx]) {
        updatedBlock.group[gIdx] = {
          ...updatedBlock.group[gIdx],
          [fieldName]: e.target.value
        };
      }
    }
    // Update block level fields
    else if (field in updatedBlock.group[gIdx].block[bIdx]) {
      updatedBlock.group[gIdx].block[bIdx] = {
        ...updatedBlock.group[gIdx].block[bIdx],
        [field]: e.target.value
      };
    }
    // Update measure level fields
    else if (bIdx !== undefined && mIdx !== undefined) {
      updatedBlock.group[gIdx].block[bIdx].addmeasures[mIdx] = {
        ...updatedBlock.group[gIdx].block[bIdx].addmeasures[mIdx],
        [field]: e.target.value
      };
    }

    setNewBlock(updatedBlock)
  }

  // Add group
  const addGroup = () => {
    if (!newBlock) return

    const updatedBlock = { ...newBlock }
    updatedBlock.group.push({
      g_hydra_cost: '',
      g_truck_cost: '',
      date: new Date().toISOString().split('T')[0],
      block: []
    })

    setNewBlock(updatedBlock)
  }

  // Add block
  const addBlock = (gIdx: number) => {
    if (!newBlock) return

    const updatedBlock = { ...newBlock }
    updatedBlock.group[gIdx].block.push({
      addmeasures: [],
      block_cost: ''
    })

    setNewBlock(updatedBlock)
  }

  // Add measure
  const addMeasure = (gIdx: number, bIdx: number) => {
    if (!newBlock) return

    const updatedBlock = { ...newBlock }
    updatedBlock.group[gIdx].block[bIdx].addmeasures.push({
      l: '',
      b: '',
      h: '',
      block_area: '',
      block_cost: ''
    })

    setNewBlock(updatedBlock)
  }

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     if (!newBlock || !id) return
 
 
     try {
       setIsSubmitting(true)
       await axios.patch(`/api/Todi/${id}`, newBlock)
       setShowSuccessModal(true)
       router.push('/vendor/account')
     } catch (error) {
       console.error('Error updating block:', error)
     } finally {
       setIsSubmitting(false)
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

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white"> block</h1>
          <Link href="vendor/account" className="text-gray-600 hover:text-gray-800">
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
                Vendor Name
              </label>
              <select
                value={newBlock?.vender_id || ''}
                onChange={(e) => {
                  const selectedId = Number(e.target.value)
                  const selectedVendor = vendors.find((v) => v.id === selectedId)
                  if (selectedVendor) {
                    setNewBlock((prev: BlockType | null) =>
                      prev
                        ? {
                            ...prev,
                            vender_id: selectedId,
                            vendor_no: selectedVendor.vendor_no,
                          }
                        : prev,
                    )
                  } else {
                    setNewBlock((prev: BlockType | null) =>
                      prev
                        ? {
                            ...prev,
                            vender_id: selectedId,
                          }
                        : prev,
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