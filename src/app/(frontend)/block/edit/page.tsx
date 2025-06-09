'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { ApiResponse } from './types'
import { useRouter, useSearchParams } from 'next/navigation'

type Measure = {
  qty: number
  l: number
  b: number
  h: number
  rate: number
  labour?: string
  hydra?: string
  id?: string | number
}

type block = {
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
  const [block, setblock] = useState<block | null>(null)
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const id = searchParams.get('id')
  const [error, setError] = useState<string | null>(null);
  const [, setSuccess] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  

 

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;

      try {
        // Fetch block data
        const blockRes = await axios.get<block>(`/api/Block/${id}`);
        const blockData = blockRes.data;
        
        // Fetch vendors
        const vendorsRes = await axios.get<ApiResponse<Vendor>>('/api/vendor');
        const vendorsData = vendorsRes.data.docs;

        // Ensure measurements array exists
        if (!blockData.addmeasures) {
          blockData.addmeasures = [];
        }

        // Set block data and vendor selection
        setblock(blockData);
        setVendors(vendorsData);
        if (blockData.vender_id) {
          setSelectedVendor(blockData.vender_id.toString());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch block data');
      } finally {
        setLoading(false);
        setLoadingData(false);
      }
    };

    fetchAllData();
  }, [id]);

  const handleMeasureChange = (index: number, field: keyof Measure, value: number) => {
    setblock(prev => {
      if (!prev) return null;
      const updatedMeasures = [...(prev.addmeasures || [])];
      updatedMeasures[index] = {
        ...updatedMeasures[index],
        [field]: value
      };
      return {
        ...prev,
        addmeasures: updatedMeasures
      };
    });
  };

  const handleAddMeasure = () => {
    setblock(prev => {
      if (!prev) return null;
      const newMeasure: Measure = {
        qty: 0,
        l: 0,
        b: 0,
        h: 0,
        rate: 0,
        labour: '',
        hydra: '',
        id: Date.now()
      };
      return {
        ...prev,
        addmeasures: [...(prev.addmeasures || []), newMeasure]
      };
    });
  };


  const removeMeasure = (index: number) => {
    setblock(prev => {
      if (!prev || prev.addmeasures.length <= 1) return prev
      const updatedMeasures = [...prev.addmeasures]
      updatedMeasures.splice(index, 1)
      return {
        ...prev,
        addmeasures: updatedMeasures
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!block) return

    try {
      const updatedBlock = {
        ...block,
        vender_id: parseInt(selectedVendor),
        blockType: block.blockType,
        date: block.date,
        mines: block.mines,
        labour_name: block.labour_name,
        transportType: block.transportType,
        vehicle_cost: block.vehicle_cost,
        vehicle_number: block.vehicle_number,
        addmeasures: block.addmeasures
      }

      await axios.put(`/api/Block/${block.id}`, updatedBlock)
      setSuccess('Block updated successfully')
      setTimeout(() => {
        setSuccess(null)
        router.push('/block')
      }, 3000)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to update block')
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            Loading...
          </p>
        </div>
      </div>
    );
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
    );
  }

  if (!block) {
    return <div className="flex justify-center items-center min-h-screen">Block not found</div>;
  }



  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit block
          </h1>
          <Link href="/block" className="text-gray-600 hover:text-gray-800">
            ← Back to block List
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vendor Name
              </label>
              <select
                value={block?.vender_id || ''}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  const selectedVendor = vendors.find(v => v.id === selectedId);
                  if (selectedVendor) {
                    setblock(prev => prev && {
                      ...prev,
                      vender_id: selectedId,
                      vendor_no: selectedVendor.vendor_no,
                      Company_no: selectedVendor.Company_no
                    });
                  } else {
                    setblock(prev => prev && {
                      ...prev,
                      vender_id: selectedId
                    });
                  }
                }}
                disabled={loadingData}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Vendor</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.vendor}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Block Type
              </label>
              <select
                value={block.blockType}
                onChange={(e) => 
                  setblock(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      blockType: e.target.value
                    };
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
                value={block.date}
                onChange={(e) => 
                  setblock(prev => prev && {
                    ...prev,
                    date: e.target.value
                  })
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
                value={block.total_quantity || ''}
                onChange={(e) => 
                  setblock(prev => prev && {
                    ...prev,
                    total_quantity: e.target.value ? parseInt(e.target.value) : null
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Issued Quantity
              </label>
              <input
                type="number"
                value={block.issued_quantity ?? ''}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  setblock(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      issued_quantity: value ? parseInt(value) : null
                    };
                  })
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Transport Type
              </label>
              <select
                value={block.transportType || ''}
                onChange={(e) => 
                  setblock(prev => prev && {
                    ...prev,
                    transportType: e.target.value || null
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select transport type</option>
                <option value="Hydra">Hydra</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vehicle Number
              </label>
              <input
                type="text"
                value={block.vehicle_number ?? ''}
                onChange={(e) => 
                  setblock(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      vehicle_number: e.target.value || null
                    };
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vehicle Cost
              </label>
              <input
                type="number"
                value={block.vehicle_cost ?? ''}
                onChange={(e) => 
                  setblock(prev => {
                    const newCost = parseInt(e.target.value);
                    if (!prev) return null;  // Return null instead of incomplete object
                    return {
                      ...prev,
                      vehicle_cost: newCost
                    };
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Labour Name
              </label>
              <input
                type="text"
                value={block.labour_name}
                onChange={(e) => 
                  setblock(prev => prev && {
                    ...prev,
                    labour_name: e.target.value
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Measurements</h2>
            <div className="space-y-4">
              {block.addmeasures && block.addmeasures.length > 0 ? (
                block.addmeasures.map((measure, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Length
                      </label>
                      <input
                        type="number"
                        value={measure.l}
                        onChange={(e) => 
                          setblock(prev => prev && {
                            ...prev,
                            addmeasures: prev.addmeasures.map((m, i) => 
                              i === index ? { ...m, l: parseInt(e.target.value) } : m
                            )
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Breadth
                      </label>
                      <input
                        type="number"
                        value={measure.b}
                        onChange={(e) => 
                          setblock(prev => prev && {
                            ...prev,
                            addmeasures: prev.addmeasures.map((m, i) => 
                              i === index ? { ...m, b: parseInt(e.target.value) } : m
                            )
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Height
                      </label>
                      <input
                        type="number"
                        value={measure.h}
                        onChange={(e) => 
                          setblock(prev => prev && {
                            ...prev,
                            addmeasures: prev.addmeasures.map((m, i) => 
                              i === index ? { ...m, h: parseInt(e.target.value) } : m
                            )
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No measurements available</div>
              )}
            </div>
          </div>

                          {/* Measurements */}
                          <div className="mt-8 col-span-2">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Measurements
                    </h2>

                    {block.addmeasures?.map((measure, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Measurement {index + 1}
                          </h3>
                          {block.addmeasures.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMeasure(index)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Length (L)
                            </label>
                            <input
                              type="number"
                              value={measure.l}
                              onChange={(e) => handleMeasureChange(index, 'l', parseFloat(e.target.value))}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Breadth (B)
                            </label>
                            <input
                              type="number"
                              value={measure.b}
                              onChange={(e) => handleMeasureChange(index, 'b', parseFloat(e.target.value))}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Height (H)
                            </label>
                            <input
                              type="number"
                              value={measure.h}
                              onChange={(e) => handleMeasureChange(index, 'h', parseFloat(e.target.value))}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddMeasure}
                      className="mt-4 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                    >
                      Add Measurement
                    </button>
                  </div>
                </div>

          <div className="mt-8">
            <button
              type="submit"
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}




// 'use client'

// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import Link from 'next/link'
// import { ApiResponse } from './types'
// import { useRouter, useSearchParams } from 'next/navigation'

// interface Measure {
//   l: number
//   b: number
//   h: number
//   rate: number
//   black_area: number
//   black_cost: number
// }

// interface Block {
//   id: number | string;
//   vender_id: number;
//   blockType: string;
//   date: string;
//   mines: number;
//   labour_name: string;
//   addmeasures: Measure[];
//   total_quantity: number | null;
//   issued_quantity: number | null;
//   left_quantity: number | null;
//   final_total: number;
//   partyRemainingPayment: number;
//   partyAdvancePayment: number | null;
//   transportType: string | null;
//   createdBy: { name: string } | null;
//   createdAt: string;
//   total_area: number;
//   total_todi_cost: number;
//   truck_cost: string;
//   hydra_cost: string;
//   front_h: string;
//   back_h: string;
//   todirate?: number;
// }

// interface Vendor {
//   id: number;
//   vendor: string;
//   vendor_no: string;
//   address: string;
//   mail_id: string;
//   Company_no: string;
//   Mines_name: {
//     id: number;
//     Mines_name: string;
//     address: string;
//     phone: { number: string }[];
//     mail_id: string;
//   }
// }

// interface ApiResponse {
//   data: any;
// }

// export default function EditBlock() {
  // const [block, setBlock] = useState<Block | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);
  // const [vendors, setVendors] = useState<Vendor[]>([]);
  // const [selectedVendor, setSelectedVendor] = useState<string>('');
  // const [selectedVendorName, setSelectedVendorName] = useState<string>('');
  // const [selectedVendorContact, setSelectedVendorContact] = useState<string>('');
  // const [selectedVendorAddress, setSelectedVendorAddress] = useState<string>('');
  // const router = useRouter();
  // const { id } = router.query;

  // useEffect(() => {
  //   if (id) {
  //     fetchBlock(id as string);
  //   }
  // }, [id]);

  // useEffect(() => {
  //   fetchVendors();
  // }, []);

  // const fetchBlock = async (id: string) => {
  //   try {
  //     const response = await axios.get(`/api/Block/${id}`);
  //     setBlock(response.data);
  //     setLoading(false);
  //     if (response.data.vender_id) {
  //       setSelectedVendor(response.data.vender_id.toString());
  //     }
  //   } catch (error) {
  //     setError('Failed to fetch block data');
  //     setLoading(false);
  //   }
  // };

  // const fetchVendors = async () => {
  //   try {
  //     const response = await axios.get('/api/vendor');
  //     setVendors(response.data);
  //   } catch (error) {
  //     setError('Failed to fetch vendors');
  //   }
  // };

  // const handleMeasureChange = (index: number, field: keyof Measure, value: number) => {
  //   setBlock(prev => {
  //     if (!prev) return null;
  //     const updatedMeasures = [...(prev.addmeasures || [])];
  //     updatedMeasures[index] = {
  //       ...updatedMeasures[index],
  //       [field]: value
  //     };
  //     return {
  //       ...prev,
  //       addmeasures: updatedMeasures
  //     };
  //   });
  // };

  // const handleAddMeasure = () => {
  //   setBlock(prev => {
  //     if (!prev) return null;
  //     const newMeasure: Measure = {
  //       l: 0,
  //       b: 0,
  //       h: 0,
  //       rate: 0,
  //       black_area: 0,
  //       black_cost: 0
  //     };
  //     return {
  //       ...prev,
  //       addmeasures: [...(prev.addmeasures || []), newMeasure]
  //     };
  //   });
  // };

  // const removeMeasure = (index: number) => {
  //   setBlock(prev => {
  //     if (!prev || prev.addmeasures.length <= 1) return prev;
  //     const updatedMeasures = [...prev.addmeasures];
  //     updatedMeasures.splice(index, 1);
  //     return {
  //       ...prev,
  //       addmeasures: updatedMeasures
  //     };
  //   });
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!block) return;

  //   try {
  //     await axios.put(`/api/Block/${block.id}`, {
  //       ...block,
  //       addmeasures: block.addmeasures,
  //       blockType: block.blockType,
  //       vender_id: parseInt(selectedVendor)
  //     });
  //     setSuccess('Block updated successfully');
  //     setTimeout(() => setSuccess(null), 3000);
  //   } catch (err) {
  //     setError('Failed to update block');
  //   }
  // };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
  //         <p className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
  //           Loading...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
  //       <div className="text-center">
  //         <div className="text-red-500 text-xl mb-2">Error: {error}</div>
  //         <button
  //           onClick={() => setError(null)}
  //           className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
  //         >
  //           Try Again
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!block) {
  //   return null;
  // }

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
//           <div className="px-4 sm:px-6 lg:px-8 py-6">
//             <div className="flex justify-between items-center mb-8">
//               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                 Edit Block
//               </h1>
//               <Link
//                 href="/block"
//                 className="bg-gray-600 dark:bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
//               >
//                 Back to Blocks
//               </Link>
//             </div>

//             {success && (
//               <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg mb-6">
//                 <p className="text-green-700 dark:text-green-300">{success}</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="mt-8">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Vendor Details */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Vendor Name
//                   </label>
//                   <select
//                     value={selectedVendor || ''}
//                     onChange={(e) => {
//                       const vendorId = parseInt(e.target.value);
//                       const vendor = vendors.find(v => v.id === vendorId);
//                       setSelectedVendor(vendorId.toString());
//                       setSelectedVendorName(vendor?.vendor || '');
//                       setSelectedVendorContact(vendor?.vendor_no || '');
//                       setSelectedVendorAddress(vendor?.address || '');
//                     }}
//                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     required
//                   >
//                     <option value="">Select Vendor</option>
//                     {vendors?.map((vendor) => (
//                       <option key={vendor.id} value={vendor.id}>
//                         {vendor.vendor}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Block Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Block Type
//                   </label>
//                   <select
//                     value={block.blockType || ''}
//                     onChange={(e) => {
//                       const newType = e.target.value;
//                       setBlock(prev => prev ? { ...prev, blockType: newType } : null);
//                     }}
//                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     required
//                   >
//                     <option value="">Select Block Type</option>
//                     <option value="BLOCK">BLOCK</option>
//                     <option value="BLACK">BLACK</option>
//                   </select>
//                 </div>

                // {/* Measurements */}
                // <div className="mt-8 col-span-2">
                //   <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                //     <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                //       Measurements
                //     </h2>

                //     {block.addmeasures?.map((measure, index) => (
                //       <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                //         <div className="flex justify-between items-center mb-4">
                //           <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                //             Measurement {index + 1}
                //           </h3>
                //           {block.addmeasures.length > 1 && (
                //             <button
                //               type="button"
                //               onClick={() => removeMeasure(index)}
                //               className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500"
                //             >
                //               Remove
                //             </button>
                //           )}
                //         </div>

                //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                //           <div>
                //             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                //               Length (L)
                //             </label>
                //             <input
                //               type="number"
                //               value={measure.l}
                //               onChange={(e) => handleMeasureChange(index, 'l', parseFloat(e.target.value))}
                //               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                //               required
                //             />
                //           </div>

                //           <div>
                //             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                //               Breadth (B)
                //             </label>
                //             <input
                //               type="number"
                //               value={measure.b}
                //               onChange={(e) => handleMeasureChange(index, 'b', parseFloat(e.target.value))}
                //               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                //               required
                //             />
                //           </div>

                //           <div>
                //             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                //               Height (H)
                //             </label>
                //             <input
                //               type="number"
                //               value={measure.h}
                //               onChange={(e) => handleMeasureChange(index, 'h', parseFloat(e.target.value))}
                //               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                //               required
                //             />
                //           </div>
                //         </div>
                //       </div>
                //     ))}

                //     <button
                //       type="button"
                //       onClick={handleAddMeasure}
                //       className="mt-4 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                //     >
                //       Add Measurement
                //     </button>
                //   </div>
                // </div>

//                 {/* Submit Button */}
//                 <div className="col-span-2 mt-8">
//                   <button
//                     type="submit"
//                     className="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </form>

//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                   Total Todi Cost = (Total Area * Todi Rate)
//                 </label>
//                 <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
//                   {block?.total_todi_cost || 0}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                   Mines
//                 </label>
//                 <input
//                   type="text"
//                   value={block?.mines || ''}
//                   onChange={(e) => 
//                     setBlock(prev => prev ? {
//                       ...prev,
//                       mines: e.target.value ? parseInt(e.target.value) : 0
//                     } : null)
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                   Todi Rate
//                 </label>
//                 <input
//                   type="number"
//                   value={block?.todirate || ''}
//                   onChange={(e) => 
//                     setBlock(prev => prev ? {
//                       ...prev,
//                       todirate: e.target.value ? parseInt(e.target.value) : null
//                     } : null)
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                   Hydra Cost
//                 </label>
//                 <input
//                   type="number"
//                   value={block?.hydra_cost || ''}
//                   onChange={(e) => 
//                     setBlock(prev => prev ? {
//                       ...prev,
//                       hydra_cost: e.target.value || ''
//                     } : null)
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                   Truck Cost
//                 </label>
//                 <input
//                   type="number"
//                   value={block?.truck_cost || ''}
//                   onChange={(e) => 
//                     setBlock(prev => prev ? {
//                       ...prev,
//                       truck_cost: e.target.value || ''
//                     } : null)
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                   Total Quantity
//                 </label>
//                 <input
//                   type="number"
//                   value={block?.total_quantity || ''}
//                   onChange={(e) => 
//                     setBlock(prev => prev ? {
//                       ...prev,
//                       total_quantity: e.target.value ? parseInt(e.target.value) : null
//                     } : null)
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>

//             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
//               <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
//                 {block?.total_area || 0}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
//             <div>
//               <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//               Hydra Cost
//                 </label>
//               <input
//                 type="number"
//                 value={block?.hydra_cost || ''}
//                 onChange={(e) => 
//                   setBlock(prev => prev ? {
//                     ...prev,
//                     hydra_cost: e.target.value || ''
//                   } : null)
//                 }
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//               Truck Cost
//                 </label>
//               <input
//                 type="number"
//                 value={block?.truck_cost || ''}
//                 onChange={(e) => 
//                   setBlock(prev => prev ? {
//                     ...prev,
//                     truck_cost: e.target.value || ''
//                   } : null)
//                 }
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                 Total Quantity
//               </label>
//               <input
//                 type="number"
//                 value={block?.total_quantity || ''}
//                 onChange={(e) => 
//                   setBlock(prev => prev ? {
//                     ...prev,
//                     total_quantity: e.target.value ? parseInt(e.target.value) : null
//                   } : null)
//                 }
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>

        
//           </div>

//           <div className="mt-8 grid grid-cols-1 md:grid-cols-3  gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                       <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
//                         {block?.total_area || 0}
//                       </div>
//                     </div>

//                     <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                         Total Todi Cost = (Total Area * Todi Rate)
//                       </label>
//                       <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
//                         {block?.total_todi_cost || 0}
//                       </div>
//                     </div>
//                   </div>


             
//               <div className="mt-8">
//                 <div className="px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
//                   <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
//                     Block Details
//                   </h2>

//                   <div className="space-y-6">
//                     {block?.addmeasures?.map((measure, measureIndex) => (
//                       <div key={measureIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
//                         <div className="flex justify-between items-center mb-4">
//                           <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                             Measurement {measureIndex + 1}
//                           </h3>
//                         </div>

//                         <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
//                           <div className="mt-8">
//                             <div className="flex justify-between items-center mb-6">
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-8">
//                     <button
//                       type="submit"
//                       className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
//                     >
//                       Save Changes
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
           
         
//   )
// }