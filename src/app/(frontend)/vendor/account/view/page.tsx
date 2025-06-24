'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ApiResponse } from './types'
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
  const [munims, setMunims] = useState<string[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [receivedAmounts, setReceivedAmounts] = useState<Array<{
    id: string
    amount: number
    date: string
    description: string
  }>>([])

  // Update currentBlock when newBlock changes
  useEffect(() => {
    if (newBlock) {
      setCurrentBlock(newBlock)
      setReceivedAmounts(newBlock.received_amount || [])
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
  // Update currentBlock when newBlock changes
  useEffect(() => {
    if (newBlock) {
      setCurrentBlock(newBlock)
    }
  }, [newBlock])

  const id = Number(searchParams.get('id'))
  const [, setIsSubmitting] = useState(false)



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


  
  const totalReceived = receivedAmounts.reduce((sum, amt) => sum + amt.amount, 0)
const remainingPayment = Number(newBlock?.estimate_cost || 0) - totalReceived

const updatedBlock = {
  ...newBlock,
  received_amount: receivedAmounts,
  partyRemainingPayment: remainingPayment
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlock || !id) return
  
    try {
      setIsSubmitting(true)
  
      const totalReceived = receivedAmounts.reduce((sum, amt) => sum + amt.amount, 0)
      const remainingPayment = Number(newBlock.estimate_cost || 0) - totalReceived
  
      const updatedBlock = {
        ...newBlock,
        received_amount: receivedAmounts,
        partyRemainingPayment: remainingPayment,
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit block</h1>
          <Link href="/vendor/account" className="text-gray-600 hover:text-gray-800">
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
                Vendor Name
              </label>
             <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
               {typeof newBlock?.vender_id === 'object' && newBlock?.vender_id?.vendor ? newBlock?.vender_id.vendor : 'N/A'}
             </div>
            </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  total_todi_area
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                    {newBlock?.total_todi_area || ''}
                  </div>
                </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      total_todi_cost
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        {newBlock?.total_todi_cost || ''}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      estimate_cost
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        {newBlock?.estimate_cost || ''}
                      </div>
                    </div>

               

                    </div>

          <div className="col-span-4">
            <h2 className="text-xl font-semibold mb-4">Received Amounts</h2>
            <div className="space-y-4">
              {receivedAmounts.map((amount, index) => (
                <div key={amount.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={amount.amount}
                        onChange={(e) => handleReceivedAmountChange(index, 'amount', Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add Received Amount
              </button>
            </div>
          </div>


<div>
  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
    Remaining Amount
  </label>
  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
  {newBlock?.partyRemainingPayment ? (Number(newBlock.estimate_cost) - Number(receivedAmounts.reduce((total, item) => total + item.amount, 0) || 0)).toFixed(2) : '0.00'} 
  </div>
</div>


          <div className="mt-8">
        <button
          type="submit"
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          disabled={!newBlock || receivedAmounts.length === 0}
        >
          Save Changes
        </button>
      </div>
        </form>
     
      </div>
    
    </div>
  )
}