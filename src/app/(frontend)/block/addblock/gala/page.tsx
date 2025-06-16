'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Vendor, Block, Measure } from '../types'
import axios from 'axios'

export default function AddBlockPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [newBlock, setNewBlock] = useState<Block>({
    BlockType: '',
    vender_id: '',
    labour_name: '',
    block: [
      {
        blockcost: 1,
        addmeasures: [
          {
            l: 1,
            b: 1,
            h: 1,
            rate: 1,
            black_area: 1,
            black_cost: 1,
          },
        ],
      },
    ],
    qty: 1,
    vehicle_number: '',
    hydra_cost: 1,
    truck_cost: 1,
    total_cost: 1,
    total_area: 1,
    total_todi_cost: 1,
    todirate: 1, 
    total_quantity: 1,
    issued_quantity: 1,
    left_quantity: 1,
    final_total: 1,
    partyRemainingPayment: 1,
    partyAdvancePayment: 1,
    transportType: 'Hydra',
    createdBy: '',
    block_id: '',
    front_l: 1,
    g_hydra_cost: '',
    g_truck_cost: '',
    todi_cost: undefined,
    l: 1,
    b: 1,
    h: 1,
    estimateCost: 1,
    depreciation: () => undefined,
    finalCost: 1,
    Todi_cost: '',
    estimate_cost: 1,
    final_cost: 1,
    total_block_area: null,
    total_block_cost: null,
    remaining_amount: null,
    total_todi_area: 1,
    front_b: 1,
    front_h: 1,
    back_l: 1,
    back_b: 1,
    back_h: 1,
    transport_cost: 1,
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [showTodi, setshowTodi] = useState(false);

  const calculateTotalCost = (block: Block) => {
    if (block.total_todi_cost && block.total_area && block.todirate) {
      return (block.total_todi_cost * block.total_area) 
    }
    return 0
  }

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
        updatedBlock.total_area = (frontVolume + backVolume) / 144

        // Calculate total_todi_cost if todirate is available
        if (updatedBlock.todirate) {
          updatedBlock.total_todi_cost =
            (updatedBlock.total_area * Number(updatedBlock.todirate)) 
        }
      }

      // Calculate total_todi_cost if todirate changes
      if (field === 'todirate' && updatedBlock.total_area) {
        updatedBlock.total_todi_cost = updatedBlock.total_area * Number(updatedBlock.todirate)
      }

      // Always recalculate total_cost whenever any relevant field changes
      updatedBlock.total_cost = calculateTotalCost(updatedBlock)

      return updatedBlock
    })
  }

  type MeasureField = keyof Measure & string;

  const handleAddMeasure = (blockIndex: number) => {
    setNewBlock(prev => {
      const updatedBlock = {
        ...prev,
        block: prev.block?.map((b, i) => 
          i === blockIndex ? {
            ...b,
            addmeasures: [...(b.addmeasures || []), {
              l: 0,
              b: 0,
              h: 0,
              rate: 0,
              black_area: 0,
              black_cost: 0
            }]
          } : b
        ) || []
      };
      return updatedBlock;
    });
  };

  const handleMeasureChange = (blockIndex: number, measureIndex: number, field: MeasureField, value: string) => {
    setNewBlock((prev) => {
      const updatedBlock = { ...prev };
      const updatedMeasures = [...updatedBlock.block[blockIndex].addmeasures];
      const updatedMeasure = { ...updatedMeasures[measureIndex] };

      // Type-safe field assignment
      if (field in updatedMeasure) {
        // Safely update the measure field with the text value
        const numValue = Number(value);
        if (field === 'l' || field === 'b' || field === 'h' || field === 'rate' || field === 'black_area' || field === 'black_cost') {
          updatedMeasure[field] = numValue;
        }
      }
      updatedMeasures[measureIndex] = updatedMeasure;
      updatedBlock.block[blockIndex].addmeasures = updatedMeasures;

      // Calculate black_area for all measures
      updatedMeasures.forEach((measure) => {
        measure.black_area = (measure.l * measure.b * measure.h) / 144;
        // Calculate black_cost if todirate is available
        if (updatedBlock.todirate) {
          measure.black_cost = measure.black_area * Number(updatedBlock.todirate);
        }
      });

      return updatedBlock;
    });
  };

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
          blockcost: 1,
          addmeasures: [
            {
              l: 1,
              b: 1,
              h: 1,
              rate: 1,
              black_area: 1,
              black_cost: 1,
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
        setShowSuccessModal(true)
        
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
      <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 pb-20 sm:px-6 lg:px-12">
         {/* Success Modal */}
         {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-4 z-50 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Success
              </h2>
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/block')
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <svg className="w-12 h-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
              Gala added successfully!
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/block')
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
        <div className="pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <header className="px-6 py-6 sm:px-8 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                Add New Gala
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-prose">
                Enter Gala details and measurements
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
                        Gala Type
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
                        <option value="White">White</option>
                        <option value="Brown">Brown</option>
                     
                      </select>
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


</div>








                    <div>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-6  gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                         L (लम्बाई) - Length
                      </label>
                      <input
                        type="text"
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
                        type="text"
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
                        Back B (चौड़ाई) - Breadth
                      </label>
                      <input
                        type="text"
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
                        Total (चौड़ाई) - Breadth
                      </label>
                      <div
                        
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                       
                     
                      >
                        ( F + B)/2
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                         H (ऊंचाई) - Height
                      </label>
                      <input
                        type="text"
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
                       Gala Cost    
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {newBlock.total_area || 0}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Hydra Cost
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {newBlock.total_todi_cost || 0}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Truck Cost
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {newBlock.truck_cost || 0}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Total Area
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {newBlock.total_area || 0}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                       Total Gala Cost ( H + T )
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {newBlock.total_todi_cost || 0}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Estimate Cost
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {newBlock.total_cost || 0}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Depreciation %
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {newBlock.total_cost || 0}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Final Cost
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {newBlock.total_cost || 0}
                      </div>
                    </div>
               
               
               
               
               
               
                  </div>


<section className="px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Group Details
                </h2>
                <button type="button" onClick={() => setshowTodi(!showTodi)} className="bg-blue-500 mx-2 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                  Add Group (array)
                </button>

         

   {/* Block Details Section */}
   <section className="px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="space-y-6 grid grid-cols-1 md:grid-cols-3 gap-20">
                          <div>
                            <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>Date</label>
                          <input type="date" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={newBlock.date} onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Hydra Cost</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={newBlock.date} onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Truck Cost</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={newBlock.date} onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })} />
                          </div>
                          
                  </div>


                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Block Details
                </h2>
              

              <div className="space-y-6">
                    {newBlock.block?.map((block, blockIndex) => (
                      <div key={blockIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Block {blockIndex + 1}
                          </h3>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          <div className="mt-8">
                            <div className="flex justify-between items-center mb-6">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                <span className="text-indigo-600 dark:text-indigo-400">Measurements</span>
                              </h2>
                              <button
                                type="button"
                                onClick={() => handleAddMeasure(blockIndex)}
                                className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                              >
                                <span className="font-medium">Add Measurement</span>
                              </button>
                            </div>

                            {block.addmeasures?.map((measure, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                              >
                              
                                <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    L
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={measure.l}
                                    onChange={(e) => handleMeasureChange(blockIndex, index, 'l', e.target.value)}
                                    min="1"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    B
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={measure.b}
                                    onChange={(e) => handleMeasureChange(blockIndex, index, 'b', e.target.value)}
                                    min="1"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    H
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={measure.h}
                                    onChange={(e) => handleMeasureChange(blockIndex, index, 'h', e.target.value)}
                                    min="1"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Block Area
                                  </label>
                                  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                                    {(measure.l * measure.b * measure.h)/144 || 0}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                  Block Cost 
                                  </label>
                                  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                                    {(measure.black_area ?? 0) * (newBlock.todirate ?? 0)}
                                  </div>
                                </div>
                                <div className="flex items-end justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      removeMeasure(blockIndex, index)
                                    }}
                                    className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
                                    disabled={block.addmeasures.length === 1}
                                  >
                                    <span className="font-medium">Remove</span>
                                  </button>
                                </div>
                             
              
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className='flex items-end justify-end grid grid-cols-3 gap-4'>
                        <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                   Total Block Area
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                   
                                    min="1"
                                    required
                                  />
                                </div>  
                                <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                   Total Block Cost
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  
                                    min="1"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                  Remaining Amount
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  
                                    
                                    min="1"
                                    required
                                  />
                                </div>
                                </div>
                        <div className="flex mt-2 items-end justify-end">
                          <button
                            type="button"
                            onClick={() => removeBlock(blockIndex)}
                            className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
                            disabled={!block.addmeasures?.length}
                          >
                            Remove block
                          </button>
                        </div>
                      </div>
                    ))}

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
              </section>
              </section>

               </div>
               
                </div>
              </section>

           

              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center sm:text-left">
                  <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-3 py-1 rounded-full inline-block">
                    Summary
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Gala Cost', value: newBlock.todirate || 0 },
                    { label: 'Gala Area', value: newBlock.hydra_cost || 0 },
                    { label: 'Total Block Area', value: newBlock.truck_cost || 0 },
                    {
                      label: 'Total Block Cost',
                      value: newBlock.total_area || 0,
                    },
                    {
                      label: 'Remaining Amount',
                      value: newBlock.total_todi_cost || 0
                    },

                    
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        {item.label}
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
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
