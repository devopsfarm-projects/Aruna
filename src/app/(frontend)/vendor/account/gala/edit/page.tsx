'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ApiResponse } from '../../types'
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
  total_block_cost: any
  block: any
  vender_id: number | Vendor
  total_block_area: number
  munim: string
  todirate: string
  total_todi_area: string
  final_cost: string
  depreciation: string
  l: string
  b: string
  h: string
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

// Define valid field names for delivered block
export type DeliveredBlockField = 'delivered_block_area' | 'delivered_block_cost' | 'date' | 'description';


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

  const handleDeliveredBlockChange = (index: number, field: DeliveredBlockField, value: any) => {
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
        const blockRes = await axios.get<BlockType>(`/api/Gala/${id}`)
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
    return remaining
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

      await axios.patch(`/api/Gala/${id}`, updatedBlock)
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
          <div className="animate-spin -full rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-black pt-4 px-4 sm:px-6 lg:px-8">
    <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">View Gala</h1>
      <Link href="/vendor/account" className="text-gray-600 hover:text-gray-800 text-sm sm:text-base">
        ← Back to Blocks
      </Link>
    </div>
  
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800  p-6 shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  
        {/* Basic Info */}
        {[
          { label: 'Vendor Name', value: typeof newBlock?.vender_id === 'object' ? newBlock?.vender_id.vendor : 'N/A' },
          { label: 'Total Block Area', value: newBlock?.total_block_area || '' },
          { label: 'Total Block Cost', value: newBlock?.total_block_cost || '' },
          { label: 'Final Cost', value: newBlock?.final_cost || '' }
        ].map((item, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{item.label}</label>
            <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {item.value}
            </div>
          </div>
        ))}
  
        {/* Delivered Blocks */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <h2 className="text-xl font-semibold mb-4">Delivered Blocks</h2>
          <div className="space-y-4">
            {deliveredBlock.map((block, index) => (
              <div key={block.id} className="bg-white dark:bg-gray-700 p-4  shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { name: 'delivered_block_area' as DeliveredBlockField, label: 'Area', type: 'number', value: block.delivered_block_area },
                    { name: 'delivered_block_cost' as DeliveredBlockField, label: 'Cost', type: 'number', value: block.delivered_block_cost },
                    { name: 'date' as DeliveredBlockField, label: 'Date', type: 'date', value: new Date(block.date).toISOString().split('T')[0] },
                    { name: 'description' as DeliveredBlockField, label: 'Description', type: 'text', value: block.description }
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{field.label}</label>
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) =>
                          handleDeliveredBlockChange(index, field.name as DeliveredBlockField, field.type === 'number' ? Number(e.target.value) : e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  ))}
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
              className="bg-green-500 text-white px-4 py-2  hover:bg-green-600 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" /> Add Delivered Block
            </button>
          </div>
        </div>
  
        {/* Received Amounts */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">Received Amounts</h2>
          <div className="space-y-4">
            {receivedAmounts.map((amount, index) => (
              <div key={amount.id} className="bg-white dark:bg-gray-700 p-4  shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'amount' as const, label: 'Amount', type: 'number', value: amount.amount },
                    { name: 'date' as const, label: 'Date', type: 'date', value: new Date(amount.date).toISOString().split('T')[0] },
                    { name: 'description' as const, label: 'Description', type: 'text', value: amount.description }
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{field.label}</label>
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) =>
                          handleReceivedAmountChange(index, field.name as 'amount' | 'date' | 'description', field.type === 'number' ? Number(e.target.value) : e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  ))}
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
              className="bg-green-500 text-white px-4 py-2  hover:bg-green-600 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" /> Add Received Amount
            </button>
          </div>
        </div>
  
        {/* Summary Section */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Total Received', value: receivedAmounts.reduce((sum, amt) => sum + amt.amount, 0).toFixed(2) },
              { label: 'Remaining Payment', value: calculateRemainingPayment().toFixed(2) }
            ].map((item, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{item.label}</label>
                <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 mt-8">
          <button
            type="submit"
            disabled={!newBlock || isSubmitting}
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3  hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
  
      </div>
    </form>
  </div>
  
  )
}

function setVendors(vendorsData: Vendor[]) {
  throw new Error('Function not implemented.');
}
