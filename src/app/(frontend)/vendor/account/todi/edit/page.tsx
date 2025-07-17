'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ApiResponse,BlockType,Vendor } from '../types'
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
  const [vendors, setVendors] = useState<Vendor[]>([])
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
    <div className="max-w-7xl mx-auto bg-gray-50 dark:bg-black min-h-screen">
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">View Todi</h1>
        <Link href="/vendor/account" className="text-gray-600 hover:text-gray-800 text-sm sm:text-base">
          ← Back to Blocks
        </Link>
      </div>
  
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  
          {/* Block Info */}
          {[
            { label: 'Vendor Name', value: typeof newBlock?.vender_id === 'object' && (newBlock?.vender_id as Vendor)?.vendor ? (newBlock?.vender_id as Vendor).vendor : 'N/A' },
            { label: 'Total Todi Area (m³)', value: newBlock?.total_todi_area || '' },
            { label: 'Total Todi Cost', value: formatCost(newBlock?.total_todi_cost ?? '') },
            { label: 'Final Cost ₹', value: formatCost(newBlock?.final_cost ?? '') }
          ].map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{field.label}</label>
              <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {field.value}
              </div>
            </div>
          ))}
  
          {/* Delivered Blocks */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <h2 className="text-xl font-semibold mb-4">Delivered Blocks</h2>
            <div className="space-y-4">
              {deliveredBlock.map((block, index) => (
                <div key={block.id} className="bg-white dark:bg-gray-700 p-4  shadow">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { label: 'Area', name: 'delivered_block_area', type: 'number', value: block.delivered_block_area === 0 ? '' : block.delivered_block_area },
                      { label: 'Cost', name: 'delivered_block_cost', type: 'number', value: block.delivered_block_cost === 0 ? '' : block.delivered_block_cost },
                      { label: 'Date', name: 'date', type: 'date', value: new Date(block.date).toISOString().split('T')[0] },
                      { label: 'Description', name: 'description', type: 'text', value: block.description }
                    ].map((input, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{input.label}</label>
                        <input
                          type={input.type}
                          value={input.value}
                          onChange={(e) => handleDeliveredBlockChange(index, input.name as 'date' | 'delivered_block_area' | 'delivered_block_cost' | 'description', input.type === 'number' ? Number(e.target.value) : e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
            <h2 className="text-xl font-semibold mb-4">Received Amounts</h2>
            <div className="space-y-4">
              {receivedAmounts.map((amount, index) => (
                <div key={amount.id} className="bg-white dark:bg-gray-700 p-4  shadow">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Amount', name: 'amount', type: 'number', value: amount.amount === 0 ? '' : amount.amount },
                      { label: 'Date', name: 'date', type: 'date', value: new Date(amount.date).toISOString().split('T')[0] },
                      { label: 'Description', name: 'description', type: 'text', value: amount.description }
                    ].map((input, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{input.label}</label>
                        <input
                          type={input.type}
                          value={input.value}
                          onChange={(e) => handleReceivedAmountChange(index, input.name as 'date' | 'description' | 'amount', input.type === 'number' ? Number(e.target.value) : e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
  
          {/* Payment Summary */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Total Received ₹', value: formatCost(receivedAmounts.reduce((sum, amt) => sum + amt.amount, 0)) },
                { label: 'Remaining Payment ₹', value: calculateRemainingPayment() }
              ].map((summary, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{summary.label}</label>
                  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                    {summary.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3  hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
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




