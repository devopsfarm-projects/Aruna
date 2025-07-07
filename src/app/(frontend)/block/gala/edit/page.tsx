'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ApiResponse } from '../../types'
import Link from 'next/link'



import { useRouter, useSearchParams } from 'next/navigation'
import { BlockType,Vendor} from './type'
import { Message } from '@/app/(frontend)/components/Message';


export default function EditBlock() {
  const searchParams = useSearchParams()
  const [currentBlock, setCurrentBlock] = useState<BlockType | null>(null)
  const [newBlock, setNewBlock] = useState<BlockType | null>(null)

  useEffect(() => {
    if (newBlock) {
      const frontBreadth = parseFloat(newBlock.front_b || '0');
      const backBreadth = parseFloat(newBlock.back_b || '0');
      const totalBreadth = (frontBreadth + backBreadth) / 2;
      if (totalBreadth !== parseFloat(newBlock.total_b || '0')) {
        setNewBlock(prev =>
          prev
            ? {
                ...prev,
                total_b: totalBreadth.toFixed(2),
              }
            : prev,
        );
      }
    }
  }, [newBlock?.front_b, newBlock?.back_b]);


  // Remove group
  const removeGroup = (gIdx: number) => {
    if (!newBlock) return
    const updatedBlock = { ...newBlock }
    updatedBlock.group = updatedBlock.group.filter((_, idx) => idx !== gIdx)
    setNewBlock(updatedBlock)
  }

  // Remove block
  const removeBlock = (gIdx: number, bIdx: number) => {
    if (!newBlock) return
    const updatedBlock = { ...newBlock }
    updatedBlock.group[gIdx].block = updatedBlock.group[gIdx].block.filter((_, idx) => idx !== bIdx)
    setNewBlock(updatedBlock)
  }

  // Remove measure
  const removeMeasure = (gIdx: number, bIdx: number, mIdx: number) => {
    if (!newBlock) return
    const updatedBlock = { ...newBlock }
    updatedBlock.group[gIdx].block[bIdx].addmeasures = updatedBlock.group[gIdx].block[bIdx].addmeasures.filter((_, idx) => idx !== mIdx)
    setNewBlock(updatedBlock)
  }

  

  useEffect(() => {
    if (newBlock) {
      const length = parseFloat(newBlock.l || '0');
      const totalBreadth = parseFloat(newBlock.total_b || '0');
      const height = parseFloat(newBlock.h || '0');
      const area = length * totalBreadth * height;
      if (area !== parseFloat(newBlock.total_gala_area || '0')) {
        setNewBlock(prev =>
          prev
            ? {
                ...prev,
                total_gala_area: area.toFixed(2),
              }
            : prev,
        );
      }
    }
  }, [newBlock?.l, newBlock?.total_b, newBlock?.h]);

  useEffect(() => {
    if (newBlock) {
      const totalGalaCost = parseFloat(newBlock.total_gala_cost || '0');
      const totalGalaArea = parseFloat(newBlock.total_gala_area || '0');
      const estimateCost = totalGalaCost * totalGalaArea;
      if (estimateCost !== parseFloat(newBlock.estimate_cost || '0')) {
        setNewBlock(prev =>
          prev
            ? {
                ...prev,
                estimate_cost: estimateCost.toFixed(2),
              }
            : prev,
        );
      }
    }
  }, [newBlock?.total_gala_cost, newBlock?.total_gala_area]);

  useEffect(() => {
    if (newBlock) {
      const galaCost = parseFloat(newBlock.gala_cost || '0');
      const hydraCost = parseFloat(newBlock.hydra_cost || '0');
      const truckCost = parseFloat(newBlock.truck_cost || '0');
      const totalGalaCost = galaCost + hydraCost + truckCost;
      if (totalGalaCost !== parseFloat(newBlock.total_gala_cost || '0')) {
        setNewBlock(prev =>
          prev
            ? {
                ...prev,
                total_gala_cost: totalGalaCost.toFixed(2),
              }
            : prev,
        );
      }
    }
  }, [newBlock?.gala_cost, newBlock?.hydra_cost, newBlock?.truck_cost]);


  useEffect(() => {
    if (newBlock) {
      const estimateCost = parseFloat(newBlock.estimate_cost || '0');
      const depreciation = parseFloat(newBlock.depreciation || '0');
      const finalCost = estimateCost - ((depreciation / 100) * estimateCost);
      if (finalCost !== parseFloat(newBlock.final_cost || '0')) {
        setNewBlock(prev =>
          prev
            ? {
                ...prev,
                final_cost: finalCost.toFixed(2),
              }
            : prev,
        );
      }
    }
  }, [newBlock?.estimate_cost, newBlock?.depreciation]);





  const [, setMunims] = useState<string[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
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
        const blockRes = await axios.get<BlockType>(`/api/Gala/${id}`)
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
       await axios.patch(`/api/Gala/${id}`, newBlock)
       setShowSuccessMessage(true)
     } catch (error) {
      setShowErrorMessage(true)
     } finally {
       setIsSubmitting(false)
     }
   }


   if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Loading...</p>
        </div>
      </div>
    )
  }


 if (showErrorMessage) {
  return (
    <Message 
    setShowMessage={setShowErrorMessage} 
    path={'/block/gala'} 
    type='error' 
    message='Failed to update block. Please try again.'
  />
  )
}



  if (showSuccessMessage) {
    return (
     <Message 
     setShowMessage={setShowSuccessMessage} 
     path={'/block/gala'} 
     type='success' 
     message='Block has been updated successfully.'
   />
    )
  }


  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit block</h1>
          <Link href="/block/todi(raskat)" className="text-gray-600 hover:text-gray-800">
            ← Back to block List
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 -2xl p-8 shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              GalaType
              </label>
              <select
               value={newBlock?.GalaType || ''}
               onChange={(e) =>
                 setNewBlock((prev: BlockType | null) =>
                   prev
                     ? {
                         ...prev,
                         GalaType: e.target.value,
                       }
                     : prev,
                 )
               }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                value={newBlock?.vender_id?.toString() || ''}
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Length (लम्बाई) (m)
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>



            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Front Breadth (चौड़ाई) (m)
              </label>
              <input
                type="text"
                value={newBlock?.front_b || ''}
                onChange={(e) =>
                  setNewBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          front_b: e.target.value,
                        }
                      : prev,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Back Breadth (चौड़ाई) (m)
              </label>
              <input
                type="text"
                value={newBlock?.back_b || ''}
                onChange={(e) =>
                  setNewBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          back_b: e.target.value,
                        }
                      : prev,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Total Breadth (चौड़ाई) (m)
              </label>
              <input
                type="text"
                value={newBlock?.total_b || ''}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                readOnly
              />
            </div>



            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Height (ऊंचाई) (m)
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Gala Cost (₹)
              </label>
              <input
                type="text"
                value={newBlock?.gala_cost || ''}
                onChange={(e) =>
                  setNewBlock((prev: BlockType | null) =>
                    prev
                      ? {
                          ...prev,
                          gala_cost: e.target.value,
                        }
                      : prev,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Hydra Cost (₹)
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Truck Cost (₹)
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Total Gala Area (m³)
                  </label>
                  <input
                    type="text"
                    value={Number(newBlock?.total_gala_area)?.toLocaleString('en-IN') || ''}
                    onChange={(e) => {
                      const length = parseFloat(newBlock?.l || '0');
                      const totalBreadth = parseFloat(newBlock?.total_b || '0');
                      const height = parseFloat(newBlock?.h || '0');
                      const area = length * totalBreadth * height;
                      setNewBlock((prev: BlockType | null) =>
                        prev
                          ? {
                              ...prev,
                              total_gala_area: area.toFixed(2),
                            }
                          : prev,
                      );
                    }}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    readOnly
                  />
                </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Total Gala Cost (₹)
                      </label>
                      <input
                        type="text"
                        value={Number(newBlock?.total_gala_cost)?.toLocaleString('en-IN') || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Estimate Cost (₹)
                      </label>
                      <input
                        type="text"
                        value={Number(newBlock?.estimate_cost)?.toLocaleString('en-IN') || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Depreciation (%)
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Final Cost (₹)
                      </label>
                      <input
                        type="text"
                        value={Number(newBlock?.final_cost)?.toLocaleString('en-IN') || ''}
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 -lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    </div>

{/* Groups */}
<div className="space-y-4">
  <h2 className="text-lg font-semibold">Groups</h2>

  {currentBlock?.group?.map((group, gIdx) => (
    <div key={gIdx} className="border p-4 space-y-4 bg-gray-50 dark:bg-gray-800 rounded-md relative">
      
      {/* Group Inputs */}
      {[
        { label: 'Hydra Cost', name: 'g_hydra_cost', value: group.g_hydra_cost },
        { label: 'Truck Cost', name: 'g_truck_cost', value: group.g_truck_cost },
      ].map(({ label, name, value }) => (
        <div key={name}>
          <label className="block font-medium">{label}:</label>
          <input
            type="text"
            name={name}
            value={value}
            onChange={(e) => {
              handleNestedChange(e, name, gIdx)
              // Calculate group total area and cost
              const groupTotalArea = group.block?.reduce((sum, block) => {
                return sum + block.addmeasures.reduce((areaSum, measure) => {
                  return areaSum + (parseFloat(measure.block_area) || 0)
                }, 0)
              }, 0) || 0

              const truck = name === 'g_truck_cost' ? parseFloat(e.target.value) : parseFloat(group.g_truck_cost) || 0
              const hydra = name === 'g_hydra_cost' ? parseFloat(e.target.value) : parseFloat(group.g_hydra_cost) || 0
              const todi = parseFloat(newBlock?.todi_cost || '0')
              
              // Update group total cost
              const groupTotalCost = groupTotalArea * (truck + hydra + todi)
              
              // Update block costs in the group
              group.block?.forEach((block, bIdx) => {
                const blockArea = block.addmeasures.reduce((sum, measure) => sum + (parseFloat(measure.block_area) || 0), 0)
                const blockCost = blockArea * (truck + hydra + todi)
                handleNestedChange({ target: { name: 'block_cost', value: blockCost.toFixed(2) } } as any, 'block_cost', gIdx, bIdx, 0)
              })

              // Update total block area and cost
              const totalBlockArea = currentBlock?.group?.reduce((sum, g) => {
                return sum + (g.block?.reduce((areaSum, block) => {
                  return areaSum + block.addmeasures.reduce((measureSum, measure) => 
                    measureSum + (parseFloat(measure.block_area) || 0), 0)
                }, 0) || 0)
              }, 0) || 0

              const totalBlockCost = totalBlockArea * (truck + hydra + todi)
              
              // Update the state
              setNewBlock((prev) => {
                if (!prev) return prev
                return {
                  ...prev,
                  total_block_area: totalBlockArea.toString(),
                  total_block_cost: totalBlockCost.toFixed(2)
                }
              })
            }}
            className="w-full p-2 border dark:bg-gray-700"
          />
        </div>
      ))}

      <div>
        <label className="block font-medium">Date:</label>
        <input
          type="date"
          name="date"
          value={group.date}
          onChange={(e) => handleNestedChange(e, 'date', gIdx)}
          className="w-full p-2 border dark:bg-gray-700"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => addBlock(gIdx)} className="text-sm text-blue-600">+ Add Block</button>
        <button 
          onClick={() => removeGroup(gIdx)} 
          className="text-sm text-red-600 hover:text-red-800"
        >
          × Remove Group
        </button>
      </div>

      {/* Blocks */}
      {group.block.map((block, bIdx) => (
        <div key={bIdx} className="ml-4 mt-2 border p-3 bg-white dark:bg-gray-800 rounded-md relative">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => addMeasure(gIdx, bIdx)} className="text-sm text-green-600">+ Add Measure</button>
            <button 
              onClick={() => removeBlock(gIdx, bIdx)} 
              className="text-sm text-red-600 hover:text-red-800"
            >
              × Remove Block
            </button>
          </div>

          {/* Measures */}

          {/* Measures */}
          {block.addmeasures.map((m, mIdx) => (
            <div key={mIdx} className="mt-4 space-y-2 border p-3 bg-gray-100 dark:bg-gray-700 rounded-md relative">
              {[
                { label: 'L (लम्बाई)', name: 'l', value: m.l },
                { label: 'B (चौड़ाई)', name: 'b', value: m.b },
                { label: 'H (ऊंचाई)', name: 'h', value: m.h },
              ].map(({ label, name, value }) => (
                <div key={name}>
                  <label className="block font-medium">{label}:</label>
                  <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={(e) => {
                      handleNestedChange(e, name, gIdx, bIdx, mIdx)
                      const l = name === 'l' ? parseFloat(e.target.value) : parseFloat(m.l) || 0
                      const b = name === 'b' ? parseFloat(e.target.value) : parseFloat(m.b) || 0
                      const h = name === 'h' ? parseFloat(e.target.value) : parseFloat(m.h) || 0
                      const area = l * b * h
                      handleNestedChange({ target: { name: 'block_area', value: area.toFixed(2) } } as any, 'block_area', gIdx, bIdx, mIdx)
                      
                      // Calculate group total area and cost
                      const groupTotalArea = group.block?.reduce((sum, block) => {
                        return sum + block.addmeasures.reduce((areaSum, measure) => {
                          return areaSum + (parseFloat(measure.block_area) || 0)
                        }, 0)
                      }, 0) || 0

                      const truck = parseFloat(group.g_truck_cost) || 0
                      const hydra = parseFloat(group.g_hydra_cost) || 0
                      const todi = parseFloat(newBlock?.todi_cost || '0')
                      
                      // Update group total cost
                      const groupTotalCost = groupTotalArea * (truck + hydra + todi)
                      
                      // Update block costs in the group
                      group.block?.forEach((block, blockIdx) => {
                        const blockArea = block.addmeasures.reduce((sum, measure) => sum + (parseFloat(measure.block_area) || 0), 0)
                        const blockCost = blockArea * (truck + hydra + todi)
                        handleNestedChange({ target: { name: 'block_cost', value: blockCost.toFixed(2) } } as any, 'block_cost', gIdx, blockIdx, 0)
                      })

                      // Update total block area and cost
                      const totalBlockArea = currentBlock?.group?.reduce((sum, g) => {
                        return sum + (g.block?.reduce((areaSum, block) => {
                          return areaSum + block.addmeasures.reduce((measureSum, measure) => 
                            measureSum + (parseFloat(measure.block_area) || 0), 0)
                        }, 0) || 0)
                      }, 0) || 0

                      const totalBlockCost = totalBlockArea * (truck + hydra + todi)
                      
                      // Update the state
                      setNewBlock((prev) => {
                        if (!prev) return prev
                        return {
                          ...prev,
                          total_block_area: totalBlockArea.toString(),
                          total_block_cost: totalBlockCost.toFixed(2)
                        }
                      })
                    }}
                    className="w-full p-2 border dark:bg-gray-600"
                  />
                </div>
              ))}

              <div className="flex justify-between items-center">
                <div>
                  <label className="block font-medium">Block Area:</label>
                </div>
                <button 
                  onClick={() => removeMeasure(gIdx, bIdx, mIdx)} 
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  × Remove Measure
                </button>
              </div>

              <div>
                <label className="block font-medium">Block Cost:</label>
                <input
                  type="text"
                  name="block_area"
                  value={Number(m.block_area).toLocaleString('en-IN')}
                  disabled
                  className="w-full p-2 border bg-gray-200 dark:bg-gray-600"
                />
              </div>

              <div>
                <label className="block font-medium">Block Cost:</label>
                <input
                  type="text"
                  name="block_cost"
                  value={Number(m.block_cost).toLocaleString('en-IN')}
                  disabled
                  className="w-full p-2 border bg-gray-200 dark:bg-gray-600"
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  ))}

  <button type="button" onClick={addGroup} className="bg-blue-500 text-white px-4 py-2 rounded-md">
    + Add Group
  </button>
</div>



<div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Total Block Area
                      </label>
                      <input
                        type="text"
                        value={newBlock?.total_block_area ? Number(newBlock?.total_block_area).toLocaleString('en-IN') : ''}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Total Block Cost
                      </label>
                      <input
                        type="text"
                        value={newBlock?.total_block_cost ? Number(newBlock?.total_block_cost).toLocaleString('en-IN') : ''}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>


          <div className="mt-8">
        <button
          type="submit"
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 -lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
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