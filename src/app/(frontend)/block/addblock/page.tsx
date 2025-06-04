'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Vendor, Block, Measure } from './types'
import BlockSection from './components/Blocksection'
import axios from 'axios'

export default function AddBlockPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [newBlock, setNewBlock] = useState<Block>({
    BlockType: '',
    date: new Date().toISOString().split('T')[0],
    vender_id: '',
    labour_name: '',
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
      },
    ],
    qty: 0,
    vehicle_number: '',
    hydra_cost: 0,
    truck_cost: 0,
    total_cost: 0,
    total_area: 0,
    total_todi_cost: 0,
    todirate: 0, // Added todirate field
    total_quantity: 0,
    issued_quantity: 0,
    left_quantity: 0,
    final_total: 0,
    partyRemainingPayment: 0,
    partyAdvancePayment: 0,
    transportType: 'Hydra',
    createdBy: '',
    block_id: '',
    front_l: 0,
    front_b: 0,
    front_h: 0,
    back_l: 0,
    back_b: 0,
    back_h: 0,
    transport_cost: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  const handleChange = (field: keyof Block, value: unknown) => {
    setNewBlock((prev) => {
      const updatedBlock = {
        ...prev,
        [field]: value,
      } as Block

      // Calculate total_area if any of the dimensions changed
      if (
        field === 'front_l' ||
        field === 'front_b' ||
        field === 'front_h' ||
        field === 'back_l' ||
        field === 'back_b' ||
        field === 'back_h'
      ) {
        const frontVolume =
          Number(updatedBlock.front_l) * Number(updatedBlock.front_b) * Number(updatedBlock.front_h)
        const backVolume =
          Number(updatedBlock.back_l) * Number(updatedBlock.back_b) * Number(updatedBlock.back_h)
        updatedBlock.total_area = frontVolume + backVolume

        // Calculate total_todi_cost if todirate is available
        if (updatedBlock.todirate) {
          updatedBlock.total_todi_cost =
            (updatedBlock.total_area * Number(updatedBlock.todirate)) / 144
        }
      }

      // Calculate total_todi_cost if todirate changes
      if (field === 'todirate' && updatedBlock.total_area) {
        updatedBlock.total_todi_cost =
          (updatedBlock.total_area * Number(updatedBlock.todirate)) / 144
      }

      return updatedBlock
    })
  }

  const handleMeasureChange = (
    blockIndex: number,
    measureIndex: number,
    field: keyof Measure | 'add' | 'remove',
    value: string | number,
  ) => {
    const newBlocks = [...newBlock.block]

    if (field === 'add') {
      newBlocks[blockIndex].addmeasures = [
        ...(newBlocks[blockIndex].addmeasures || []),
        {
          l: 0,
          b: 0,
          h: 0,
          rate: 0,
          black_area: 0,
          black_cost: 0,
        },
      ]
    } else if (field === 'remove') {
      // Remove measure
      newBlocks[blockIndex].addmeasures = newBlocks[blockIndex].addmeasures.filter(
        (_, i) => i !== measureIndex,
      )
    } else {
      // Update existing measure
      const newMeasures = [...newBlocks[blockIndex].addmeasures]
      const currentMeasure = newMeasures[measureIndex]
      const updatedMeasure = { ...currentMeasure, [field]: Number(value) }

      // Calculate black_area if L, B, or H changed
      if (field === 'l' || field === 'b' || field === 'h') {
        updatedMeasure.black_area = updatedMeasure.l * updatedMeasure.b * updatedMeasure.h
      }

      newMeasures[measureIndex] = updatedMeasure
      newBlocks[blockIndex].addmeasures = newMeasures
    }

    // Calculate final total
    const finalTotal = newBlocks.reduce((sum, block) => {
      return (
        sum +
        block.addmeasures.reduce((tSum, m) => {
          const l = m.l || 0
          const b = m.b || 0
          const h = m.h || 0
          const blockcost = block.blockcost || 0
          const qty = newBlock.qty || 0
          return tSum + l * b * h * qty * blockcost
        }, 0)
      )
    }, 0)

    // Calculate remaining payment
    const remainingPayment = finalTotal - (Number(newBlock.partyAdvancePayment) || 0)

    setNewBlock((prev) => ({
      ...prev,
      block: newBlocks,
      final_total: finalTotal,
      partyRemainingPayment: remainingPayment,
    }))
  }

  const removeMeasure = (blockIndex: number, measureIndex: number) => {
    setNewBlock((prev) => {
      const newBlocks = [...prev.block]
      const newMeasures = [...newBlocks[blockIndex].addmeasures]
      newMeasures.splice(measureIndex, 1)
      newBlocks[blockIndex].addmeasures = newMeasures
      return { ...prev, block: newBlocks }
    })
  }

  const addBlock = () => {
    setNewBlock((prev) => ({
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
        },
      ],
    }))
  }

  const removeBlock = (index: number) => {
    setNewBlock((prev) => ({
      ...prev,
      block: prev.block?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const blockToSubmit = {
        ...newBlock,
        vender_id: Number(newBlock.vender_id),
        block:
          newBlock.block?.map((b) => ({
            blockcost: Number(b.blockcost),
            addmeasures:
              b.addmeasures?.map((m) => ({
                l: Number(m.l),
                b: Number(m.b),
                h: Number(m.h),
                rate: Number(m.rate),
                black_area: Number(m.black_area),
                black_cost: Number(m.black_cost),
              })) || [],
          })) || [],
        qty: Number(newBlock.qty),
        total_quantity: newBlock.total_quantity,
        issued_quantity: newBlock.issued_quantity,
        left_quantity: newBlock.left_quantity,
        partyAdvancePayment: newBlock.partyAdvancePayment,
        partyRemainingPayment: newBlock.partyRemainingPayment,
        hydra_cost: newBlock.hydra_cost,
        truck_cost: newBlock.truck_cost,
        total_cost: newBlock.total_cost,
        total_area: newBlock.total_area,
        total_todi_cost: newBlock.total_todi_cost,
        transport_cost: newBlock.transport_cost,
        front_l: newBlock.front_l,
        front_b: newBlock.front_b,
        front_h: newBlock.front_h,
        back_l: newBlock.back_l,
        back_b: newBlock.back_b,
        back_h: newBlock.back_h,
        transportType: newBlock.transportType || 'Hydra',
      }

      const response = await axios.post('/api/Block', blockToSubmit, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        alert('Block added successfully!')
        router.push('/block')
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message)
        setError('Failed to fetch vendors')
      } else {
        console.error('Unknown error:', error)
        setError('Failed to fetch vendors')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [vendorsRes] = await Promise.all([axios.get<{ docs: Vendor[] }>('/api/vendor')])
        setVendors(vendorsRes.data.docs || [])
      } catch (error) {
        setError('Failed to load data. Please try again later.')
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [setVendors, setIsLoading, setError])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-12">
        <div className="pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <header className="px-6 py-6 sm:px-8 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                Add New Block
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-prose">
                Enter block details and measurements
              </p>
            </header>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <section className="px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Basic Information
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <label
                        htmlFor="blockType"
                        className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                      >
                        Block Type
                      </label>
                      <select
                        id="blockType"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        value={newBlock.BlockType}
                        onChange={(e) => setNewBlock({ ...newBlock, BlockType: e.target.value })}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Brown">Brown</option>
                        <option value="White">White</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                      >
                        Date
                      </label>
                      <input
                        id="date"
                        type="date"
                        value={newBlock.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Vendor
                      </label>
                      <select
                        value={newBlock.vender_id}
                        onChange={(e) => handleChange('vender_id', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      >
                        <option value="">Select vendor</option>
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
                        value={newBlock.munim}
                        onChange={(e) => handleChange('munim', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                        placeholder="Enter Munim"
                      />
                    </div>

                    {/* <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Total Cost
                      </label>
                      <input
                        type="number"
                        value={newBlock.total_cost}
                        onChange={(e) => handleChange('total_cost', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                        min="0"
                        placeholder="Enter Total Cost"
                      />
                    </div> */}

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Todi Rate
                      </label>
                      <input
                        type="number"
                        value={newBlock.todirate}
                        onChange={(e) => handleChange('todirate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter Todi Rate"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Hydra Cost
                      </label>
                      <input
                        type="number"
                        value={newBlock.hydra_cost}
                        onChange={(e) => handleChange('hydra_cost', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter hydra cost"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Truck Cost
                      </label>
                      <input
                        type="number"
                        value={newBlock.truck_cost}
                        onChange={(e) => handleChange('truck_cost', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter truck cost"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Total Quantity
                      </label>
                      <input
                        type="number"
                        value={newBlock.total_quantity}
                        onChange={(e) => handleChange('total_quantity', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter total_quantity"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Issued Quantity
                      </label>
                      <input
                        type="number"
                        value={newBlock.issued_quantity}
                        onChange={(e) => handleChange('issued_quantity', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter issued quantity"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Final Total
                      </label>
                      <input
                        type="number"
                        value={newBlock.final_total}
                        onChange={(e) => handleChange('final_total', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter final total"
                      />
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3  gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Front L (लम्बाई) - Length
                      </label>
                      <input
                        type="number"
                        value={newBlock.front_l}
                        onChange={(e) => handleChange('front_l', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter front length"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Front B (चौड़ाई) - Breadth
                      </label>
                      <input
                        type="number"
                        value={newBlock.front_b}
                        onChange={(e) => handleChange('front_b', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter front breadth"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Front H (ऊंचाई) - Height
                      </label>
                      <input
                        type="number"
                        value={newBlock.front_h}
                        onChange={(e) => handleChange('front_h', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter front height"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Back L (लम्बाई) - Length
                      </label>
                      <input
                        type="number"
                        value={newBlock.back_l}
                        onChange={(e) => handleChange('back_l', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter back length"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Back B (चौड़ाई) - Breadth
                      </label>
                      <input
                        type="number"
                        value={newBlock.back_b}
                        onChange={(e) => handleChange('back_b', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter back breadth"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Back H (ऊंचाई) - Height
                      </label>
                      <input
                        type="number"
                        value={newBlock.back_h}
                        onChange={(e) => handleChange('back_h', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        min="0"
                        placeholder="Enter back height"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Total Area (Front Volume + Back Volume)
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {newBlock.total_area || 0}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Total Todi Cost = (Total Area * Todi Rate) / 144
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {newBlock.total_todi_cost || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Block Details Section */}
              <section className="px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Block Details
                </h2>
                <BlockSection
                  blocks={newBlock.block}
                  onRemove={removeBlock}
                  onMeasureChange={handleMeasureChange}
                  onMeasureRemove={removeMeasure}
                  onAddNewBlock={addBlock}
                />
              </section>

              {/* Form Actions */}
              <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
                  <button
                    type="button"
                    onClick={() => router.push('/block')}
                    className="w-full sm:w-auto inline-flex justify-center py-3 px-5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex justify-center py-3 px-5 border border-transparent rounded-md shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Add Block'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
