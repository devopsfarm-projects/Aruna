'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { ApiResponse } from './types'
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

type MeasureField = keyof Measure

type BlockType = {
  block: any
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
  const [currentBlock, setCurrentBlock] = useState<BlockType | null>(null)
  const [newBlock, setNewBlock] = useState<BlockType | null>(null)
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const id = searchParams.get('id')
  const [error, setError] = useState<string | null>(null)

  // Function to remove a block
  const removeBlock = (index: number) => {
    if (!currentBlock) return

    const updatedBlock = { ...currentBlock }
    updatedBlock.addmeasures = updatedBlock.addmeasures?.filter((_, i) => i !== index) || []

    // Update the block state
    setCurrentBlock(updatedBlock)
  }

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return

      try {
        // Fetch block data
        const blockRes = await axios.get<BlockType>(`/api/Block/${id}`)
        const blockData = blockRes.data

        // Fetch vendors
        const vendorsRes = await axios.get<ApiResponse<Vendor>>('/api/vendor')
        const vendorsData = vendorsRes.data.docs

        // Ensure measurements array exists
        if (!blockData.addmeasures) {
          blockData.addmeasures = []
        }

        // Set block data and vendor selection
        setCurrentBlock(blockData)
        setNewBlock(blockData)
        setVendors(vendorsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
        setLoadingData(false)
      }
    }

    fetchAllData()
  }, [id])

  const handleAddMeasure = (blockIndex: number) => {
    setNewBlock((prev) => {
      if (!prev?.block) return prev

      const updatedBlock = {
        ...prev,
        block:
          prev.block.map((b: { addmeasures: any }, i: number) =>
            i === blockIndex
              ? {
                  ...b,
                  addmeasures: [
                    ...(b.addmeasures || []),
                    {
                      l: 0,
                      b: 0,
                      h: 0,
                      rate: 0,
                      black_area: 0,
                      black_cost: 0,
                    },
                  ],
                }
              : b,
          ) || [],
      }
      return updatedBlock
    })
  }

  const handleMeasureChange = (
    blockIndex: number,
    measureIndex: number,
    field: MeasureField,
    value: string,
  ) => {
    setNewBlock((prev) => {
      if (!prev) return null

      const updatedBlock = { ...prev }
      const updatedMeasures = [...updatedBlock.block[blockIndex].addmeasures]
      const updatedMeasure = { ...updatedMeasures[measureIndex] }

      // Type-safe field assignment
      if (field in updatedMeasure) {
        // Safely update the measure field with the number value
        const numValue = Number(value)
        if (field === 'l' || field === 'b' || field === 'h' || field === 'rate') {
          updatedMeasure[field] = numValue
        }
      }
      updatedMeasures[measureIndex] = updatedMeasure
      updatedBlock.block[blockIndex].addmeasures = updatedMeasures

      // Calculate black_area for all measures
      updatedMeasures.forEach((measure) => {
        measure.black_area = (measure.l * measure.b * measure.h) / 144
        // Calculate black_cost if todirate is available
        if (updatedBlock.todirate) {
          measure.black_cost = measure.black_area * Number(updatedBlock.todirate)
        }
      })

      return updatedBlock
    })
  }

  const addBlock = () => {
    setNewBlock((prev) => {
      if (!prev) {
        return {
          block: [
            {
              blockcost: 0,
              addmeasures: [
                {
                  l: 0,
                  b: 0,
                  h: 0,
                  rate: 0,
                  black_area: 0,
                  black_cost: 0,
                },
              ],
              total_area: 0,
              total_todi_cost: 0,
              munim: '',
              todirate: '',
              hydra_cost: '',
              truck_cost: '',
              front_l: '',
              front_b: '',
              front_h: '',
              back_l: '',
              back_b: '',
              back_h: '',
              id: '',
              vender_id: 0,
              blockType: '',
              date: '',
              mines: 0,
              labour_name: '',
              total_quantity: 0,
              issued_quantity: 0,
              left_quantity: 0,
              final_total: 0,
              partyRemainingPayment: 0,
              partyAdvancePayment: 0,
              transportType: '',
              createdBy: { name: '' },
              name: '',
              createdAt: '',
              updatedAt: '',
              vehicle_cost: 0,
              vehicle_number: '',
            },
          ],
          total_area: 0,
          total_todi_cost: 0,
          munim: '',
          todirate: '',
          hydra_cost: '',
          truck_cost: '',
          front_l: '',
          front_b: '',
          front_h: '',
          back_l: '',
          back_b: '',
          back_h: '',
          id: '',
          vender_id: 0,
          blockType: '',
          date: '',
          mines: 0,
          labour_name: '',
          addmeasures: [],
          total_quantity: 0,
          issued_quantity: 0,
          left_quantity: 0,
          final_total: 0,
          partyRemainingPayment: 0,
          partyAdvancePayment: 0,
          transportType: '',
          createdBy: { name: '' },
          name: '',
          createdAt: '',
          updatedAt: '',
          vehicle_cost: 0,
          vehicle_number: '',
        }
      }

      return {
        ...prev,
        block: [
          ...prev.block,
          {
            blockcost: 0,
            addmeasures: [
              {
                l: 0,
                b: 0,
                h: 0,
                rate: 0,
                black_area: 0,
                black_cost: 0,
              },
            ],
            total_area: 0,
            total_todi_cost: 0,
            munim: '',
            todirate: '',
            hydra_cost: '',
            truck_cost: '',
            front_l: '',
            front_b: '',
            front_h: '',
            back_l: '',
            back_b: '',
            back_h: '',
            id: '',
            vender_id: 0,
            blockType: '',
            date: '',
            mines: 0,
            labour_name: '',
            total_quantity: 0,
            issued_quantity: 0,
            left_quantity: 0,
            final_total: 0,
            partyRemainingPayment: 0,
            partyAdvancePayment: 0,
            transportType: '',
            createdBy: { name: '' },
            name: '',
            createdAt: '',
            updatedAt: '',
            vehicle_cost: 0,
            vehicle_number: '',
          },
        ],
      }
    })
  }

  const removeMeasure = (blockIndex: number, measureIndex: number) => {
    setNewBlock((prev) => {
      if (!prev) return null

      const newBlocks = [...prev.block]
      const newMeasures = [...newBlocks[blockIndex].addmeasures]
      newMeasures.splice(measureIndex, 1)
      newBlocks[blockIndex].addmeasures = newMeasures

      return {
        ...prev,
        block: newBlocks,
        total_area: prev.total_area || 0,
        total_todi_cost: prev.total_todi_cost || 0,
        munim: prev.munim || '',
        todirate: prev.todirate || '',
        hydra_cost: prev.hydra_cost || '',
        truck_cost: prev.truck_cost || '',
        front_l: prev.front_l || '',
        front_b: prev.front_b || '',
        front_h: prev.front_h || '',
        back_l: prev.back_l || '',
        back_b: prev.back_b || '',
        back_h: prev.back_h || '',
        id: prev.id,
        vender_id: prev.vender_id,
        blockType: prev.blockType || '',
        date: prev.date || '',
        mines: prev.mines || 0,
        labour_name: prev.labour_name || '',
        addmeasures: newBlocks[blockIndex].addmeasures,
        total_quantity: prev.total_quantity,
        issued_quantity: prev.issued_quantity,
        left_quantity: prev.left_quantity,
        final_total: prev.final_total || 0,
        partyRemainingPayment: prev.partyRemainingPayment || 0,
        partyAdvancePayment: prev.partyAdvancePayment,
        transportType: prev.transportType,
        createdBy: prev.createdBy,
        vehicle_cost: prev.vehicle_cost,
        vehicle_number: prev.vehicle_number,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlock || !id) return

    try {
      await axios.patch(`/api/Block/${id}`, newBlock)
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

  if (!currentBlock) {
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
                value={currentBlock.blockType}
                onChange={(e) =>
                  setCurrentBlock((prev) => {
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
                value={currentBlock.date || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          date: e.target.value,
                        }
                      : prev,
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
                value={currentBlock?.vender_id || ''}
                onChange={(e) => {
                  const selectedId = Number(e.target.value)
                  const selectedVendor = vendors.find((v) => v.id === selectedId)
                  if (selectedVendor) {
                    setCurrentBlock((prev: BlockType | null) =>
                      prev
                        ? {
                            ...prev,
                            vender_id: selectedId,
                            vendor_no: selectedVendor.vendor_no,
                            Company_no: selectedVendor.Company_no,
                          }
                        : prev,
                    )
                  } else {
                    setCurrentBlock((prev: BlockType | null) =>
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
                value={currentBlock.munim || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) =>
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
                Todi Rate
              </label>
              <input
                type="number"
                value={currentBlock.todirate || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          todirate: e.target.value,
                        }
                      : prev,
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
                value={currentBlock.hydra_cost || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) =>
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
                Truck Cost
              </label>
              <input
                type="number"
                value={currentBlock.truck_cost || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) =>
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
                Total Quantity
              </label>
              <input
                type="number"
                value={currentBlock.total_quantity || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          total_quantity: e.target.value ? Number(e.target.value) : null,
                        }
                      : prev,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-8 col-span-2 grid grid-cols-1 md:grid-cols-3  gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Front L (लम्बाई) - Length
              </label>
              <input
                type="number"
                value={currentBlock.front_l || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          front_l: e.target.value,
                        }
                      : prev,
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
                value={currentBlock.front_b || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          front_b: e.target.value,
                        }
                      : prev,
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
                value={currentBlock.front_h || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          front_h: e.target.value,
                        }
                      : prev,
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
                value={currentBlock.back_l || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          back_l: e.target.value,
                        }
                      : prev,
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
                value={currentBlock.back_b || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          back_b: e.target.value,
                        }
                      : prev,
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
                value={currentBlock.back_h || ''}
                onChange={(e) =>
                  setCurrentBlock((prev: BlockType | null) => {
                    if (!prev) return null
                    return {
                      ...prev,
                      back_h: e.target.value,
                    }
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Total Area (Front Volume + Back Volume)/ 144
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                {currentBlock.total_area || 0}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Total Todi Cost = (Total Area * Todi Rate)
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                {currentBlock.total_todi_cost || 0}
              </div>
            </div>
          </div>

          <section className="px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Block Details
            </h2>
            <div className="space-y-6">
              {newBlock?.block?.map(
                (block: { addmeasures: any[] }, blockIndex: React.Key | null | undefined) => {
                  if (blockIndex === null || blockIndex === undefined) return null
                  const index = blockIndex as number
                  return (
                    <div key={blockIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Block {index + 1}
                        </h3>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => removeBlock(index)}
                            className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
                            disabled={!block?.addmeasures?.length}
                          >
                            Remove Block
                          </button>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                        <div className="mt-8">
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                              <span className="text-indigo-600 dark:text-indigo-400">
                                Measurements
                              </span>
                            </h2>
                            <button
                              type="button"
                              onClick={() => handleAddMeasure(index)}
                              className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                            >
                              <span className="font-medium">Add Measurement</span>
                            </button>
                          </div>

                          {block.addmeasures?.map(
                            (measure: Measure, measureIndex: React.Key | null | undefined) => {
                              if (measureIndex === null || measureIndex === undefined) return null
                              const measureIndexNum = measureIndex as number
                              return (
                                <div
                                  key={measureIndex}
                                  className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                >
                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                      L
                                    </label>
                                    <input
                                      type="number"
                                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      value={measure.l || ''}
                                      onChange={(e) =>
                                        handleMeasureChange(
                                          index,
                                          measureIndexNum,
                                          'l',
                                          e.target.value,
                                        )
                                      }
                                      min="1"
                                      required
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                      B
                                    </label>
                                    <input
                                      type="number"
                                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      value={measure.b || ''}
                                      onChange={(e) =>
                                        handleMeasureChange(
                                          index,
                                          measureIndexNum,
                                          'b',
                                          e.target.value,
                                        )
                                      }
                                      min="1"
                                      required
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                      H
                                    </label>
                                    <input
                                      type="number"
                                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      value={measure.h || ''}
                                      onChange={(e) =>
                                        handleMeasureChange(
                                          index,
                                          measureIndexNum,
                                          'h',
                                          e.target.value,
                                        )
                                      }
                                      min="1"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                      Block Area (L*B*H)/144
                                    </label>
                                    <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                                      {(Number(measure.l) * Number(measure.b) * Number(measure.h)) /
                                        144 || 0}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                      Black Cost = Block Area * Todi Rate
                                    </label>
                                    <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                                      {(Number(measure.black_area) ?? 0) *
                                        (Number(newBlock?.todirate) ?? 0)}
                                    </div>
                                  </div>

                                  <div className="flex items-end justify-end">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        removeMeasure(index, measureIndexNum)
                                      }}
                                      className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
                                      disabled={block.addmeasures.length === 1}
                                    >
                                      <span className="font-medium">Remove</span>
                                    </button>
                                  </div>
                                </div>
                              )
                            },
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={addBlock}
                          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                        >
                          Add New Block
                        </button>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </section>
        </form>
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
    </div>
  )
}
