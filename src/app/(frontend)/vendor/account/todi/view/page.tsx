'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ApiResponse } from '../types'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'

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
  vender_id: number | Vendor
  total_area: number
  munim: string
  todirate: string
  total_block_area: string
  final_cost: string
  depreciation: string
  l: string
  b: string
  h: string
  todi_cost: string
  hydra_cost: string
  truck_cost: string
  total_block_cost: string
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
  delivered_block: Array<{
    delivered_block_area: number
    delivered_block_cost: number
    date: string
    description: string
  }>
  received_amount: Array<{
    id: string
    amount: number
    date: string
    description: string
  }>
}


export default function EditBlock() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentBlock, setCurrentBlock] = useState<BlockType | null>(null)
  const [newBlock, setNewBlock] = useState<BlockType | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [receivedAmounts, setReceivedAmounts] = useState<Array<{
    id: string
    amount: number
    date: string
    description: string
  }>>([])
  const [deliveredBlock, setDeliveredBlock] = useState<Array<{
    id: string;
    delivered_block_area: number
    delivered_block_cost: number
    date: string
    description: string
  }>>([])


  // Helper function to format cost values with commas
  const formatCost = (cost: string | number | null) => {
    if (!cost) return ''
    return Number(cost).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Update currentBlock when newBlock changes
  useEffect(() => {
    if (newBlock) {
      setCurrentBlock(newBlock)
      setReceivedAmounts(newBlock.received_amount || [])
      setDeliveredBlock(newBlock.delivered_block?.map(item => ({
        ...item,
        id: Date.now().toString() // Generate a unique ID
      })) || [])
    }
  }, [newBlock])

  const handleAddReceivedAmount = () => {
    const newAmount = {
      id: Date.now().toString(),
      amount: 0,
      date: new Date().toISOString(),
      description: ''
    }
    setReceivedAmounts([...receivedAmounts, newAmount])
  }

  const handleAddDeliveredBlock = () => {
    const newBlock = {
      id: Date.now().toString(),
      delivered_block_area: 0,
      delivered_block_cost: 0,
      date: new Date().toISOString(),
      description: ''
    }
    setDeliveredBlock([...deliveredBlock, newBlock])
  }

  const handleRemoveReceivedAmount = (id: string) => {
    setReceivedAmounts(receivedAmounts.filter(amount => amount.id !== id))
  }

  const handleReceivedAmountChange = (index: number, field: keyof typeof receivedAmounts[0], value: any) => {
    const updatedAmounts = [...receivedAmounts]
    updatedAmounts[index] = {
      ...updatedAmounts[index],
      [field]: value
    }
    setReceivedAmounts(updatedAmounts)
  }

  const handleDeliveredBlockChange = (index: number, field: keyof typeof deliveredBlock[0], value: any) => {
    const updatedBlocks = [...deliveredBlock]
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      [field]: value
    }
    setDeliveredBlock(updatedBlocks)
  }

  const handleRemoveDeliveredBlock = (id: string) => {
    setDeliveredBlock(deliveredBlock.filter(block => block.id !== id))
  }

  const id = Number(searchParams.get('id'))
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return

      try {
        const blockRes = await axios.get<BlockType>(`/api/Todi/${id}`)
        const blockData = blockRes.data
        const vendorsRes = await axios.get<ApiResponse<Vendor>>('/api/vendor')
        const vendorsData = vendorsRes.data.docs
        
        if (!blockData.addmeasures) {
          blockData.addmeasures = []
        }

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

  const calculateRemainingPayment = () => {
    const totalReceived = receivedAmounts.reduce((sum, amt) => sum + amt.amount, 0)
    const remaining = Number(newBlock?.final_cost || 0) - totalReceived
    return remaining.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlock || !id) return

    try {
      setIsSubmitting(true)
      const remainingPayment = calculateRemainingPayment()
      
      const updatedBlock = {
        ...newBlock,
        received_amount: receivedAmounts,
        partyRemainingPayment: remainingPayment,
        delivered_block: deliveredBlock
      }

      await axios.patch(`/api/Todi/${id}`, updatedBlock)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin  rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className=" max-w-7xl mx-auto bg-gray-50 dark:bg-black ">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">View Todi</h1>
          <Link href="/vendor/account" className="text-gray-600 hover:text-gray-800">
            ← Back to Blocks
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 -2xl p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Basic Block Info */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vendor Name
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {typeof newBlock?.vender_id === 'object' && newBlock?.vender_id?.vendor ? newBlock?.vender_id.vendor : 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Total Block Area (m³)
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {newBlock?.total_block_area || ''}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Total Block Cost
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {formatCost(newBlock?.total_block_cost ?? '')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Final Cost ₹
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {formatCost(newBlock?.final_cost ?? '')}
              </div>
            </div>

            {/* Delivered Blocks Section */}
            <div className="col-span-4">
              <h2 className="text-xl font-semibold mb-4">Delivered Blocks</h2>
              <div className="space-y-4">
                {deliveredBlock.map((block, index) => (
                  <div key={block.id} className="bg-white dark:bg-gray-700 p-4 -lg">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Area
                        </label>
                        <input
                          type="number"
                          value={block.delivered_block_area}
                          onChange={(e) => handleDeliveredBlockChange(index, 'delivered_block_area', Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Cost
                        </label>
                        <input
                          type="number"
                          value={block.delivered_block_cost}
                          onChange={(e) => handleDeliveredBlockChange(index, 'delivered_block_cost', Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Date
                        </label>
                        <input
                          type="date"
                          value={new Date(block.date).toISOString().split('T')[0]}
                          onChange={(e) => handleDeliveredBlockChange(index, 'date', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <input
                          type="text"
                          value={block.description}
                          onChange={(e) => handleDeliveredBlockChange(index, 'description', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveDeliveredBlock(block.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddDeliveredBlock}
                  className="bg-green-500 text-white px-2 border-2 border-green-100 py-2 -full hover:bg-green-600 transition flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Received Amounts Section */}
            <div className="col-span-4">
              <h2 className="text-xl font-semibold mb-4">Received Amounts</h2>
              <div className="space-y-4">
                {receivedAmounts.map((amount, index) => (
                  <div key={amount.id} className="bg-white dark:bg-gray-700 p-4 -lg shadow">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Amount
                        </label>
                        <input
                          type="number"
                          value={amount.amount}
                          onChange={(e) => handleReceivedAmountChange(index, 'amount', Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Date
                        </label>
                        <input
                          type="date"
                          value={new Date(amount.date).toISOString().split('T')[0]}
                          onChange={(e) => handleReceivedAmountChange(index, 'date', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <input
                          type="text"
                          value={amount.description}
                          onChange={(e) => handleReceivedAmountChange(index, 'description', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveReceivedAmount(amount.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddReceivedAmount}
                  className="bg-green-500 text-white px-2 border-2 border-green-100 py-2 -full hover:bg-green-600 transition flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Remaining Payment */}
            <div className="col-span-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Total Received ₹
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                    {formatCost(receivedAmounts.reduce((sum, amt) => sum + amt.amount, 0))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Remaining Payment ₹
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                    {calculateRemainingPayment()}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-span-4 mt-8">
              <button
                type="submit"
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 -lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
                disabled={!newBlock || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}



function setVendors(vendorsData: Vendor[]) {
  throw new Error('Function not implemented.');
}
