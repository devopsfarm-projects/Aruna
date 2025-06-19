'use client'

import { useEffect, useState } from 'react'
import type { GroupField, Vendor } from '../../types'
import axios from 'axios'

interface Block {
  id: string;
  addmeasures: {
    id: string;
    l: string;
    b: string;
    h: string;
    block_area: string;
    block_cost: string;
  }[];
}

interface Group {
  g_hydra_cost: string;
  g_truck_cost: string;
  total_block_area: string;
  total_block_cost: string;
  remaining_amount: string;
  date: string;
  block: Block[];
}

interface TodiState {
  munim: string;
  GalaType: string;
  date: Date | string;
  vender_id: string | number | readonly string[] | undefined;
  l: string;
  front_b: string;
  back_b: string;
  total_b: string;
  h: string;
  total_todi_area: string;
  todi_cost: string;
  hydra_cost: string;
  truck_cost: string;
  total_todi_cost: string;
  estimate_cost: string;
  depreciation: string;
  final_cost: string;
  group: Group[];
}

export default function AddTodiPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [todi, setTodi] = useState<TodiState>({
    munim: '',
    GalaType: '',
    date: new Date().toISOString(),
    vender_id: 0,
    l: '',
    front_b: '',
    back_b: '',
    total_b: '',
    h: '',
    total_todi_area: '',
    todi_cost: '',
    hydra_cost: '',
    truck_cost: '',
    total_todi_cost: '',
    estimate_cost: '',
    depreciation: '',
    final_cost: '',
    group: [
      {
        g_hydra_cost: '',
        g_truck_cost: '',
        total_block_area: '',
        total_block_cost: '',
        remaining_amount: '',
        date: new Date().toISOString(),
        block: []
      }
    ]
  })

  const calculateTotalTodiArea = (l: string, b: string, h: string): string => {
    const length = parseFloat(l) || 0;
    const breadth = parseFloat(b) || 0;
    const height = parseFloat(h) || 0;
    return (length * breadth * height).toFixed(2);
  };

  const calculateTotalTodiCost = (todiCost: string, hydraCost: string, truckCost: string): string => {
    const todi = parseFloat(todiCost) || 0;
    const hydra = parseFloat(hydraCost) || 0;
    const truck = parseFloat(truckCost) || 0;
    return (todi + hydra + truck).toFixed(2);
  };

  const calculateEstimateCost = (totalArea: string, totalCost: string): string => {
    const area = parseFloat(totalArea) || 0;
    const cost = parseFloat(totalCost) || 0;
    return (area * cost).toFixed(2);
  };

  const calculateFinalCost = (estimate: string, depreciation: string): string => {
    const est = parseFloat(estimate) || 0;
    const dep = parseFloat(depreciation) || 0;
    return ((est-((dep/100)*est))).toFixed(2);
  };

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    
    // Update the state with the new value
    setTodi(prev => {
      const updatedTodi = { ...prev, [name]: value };
      
      // If any dimension changes, recalculate total_todi_area
      if (name === 'l' || name === 'total_b' || name === 'h') {
        updatedTodi.total_todi_area = calculateTotalTodiArea(
          updatedTodi.l || '0',
          updatedTodi.total_b || '0',
          updatedTodi.h || '0'
        );
      }

      // If any cost field changes, recalculate total_todi_cost
      if (name === 'todi_cost' || name === 'hydra_cost' || name === 'truck_cost') {
        updatedTodi.total_todi_cost = calculateTotalTodiCost(
          updatedTodi.todi_cost || '0',
          updatedTodi.hydra_cost || '0',
          updatedTodi.truck_cost || '0'
        );
      }

      // Always recalculate estimate_cost if total_todi_area or total_todi_cost is available
      if (updatedTodi.total_todi_area && updatedTodi.total_todi_cost) {
        updatedTodi.estimate_cost = calculateEstimateCost(
          updatedTodi.total_todi_area,
          updatedTodi.total_todi_cost
        );
      }

      // Always recalculate final_cost if estimate_cost is available
      if (updatedTodi.estimate_cost && updatedTodi.depreciation) {
        updatedTodi.final_cost = calculateFinalCost(
          updatedTodi.estimate_cost,
          updatedTodi.depreciation
        );
      }
      
      return updatedTodi;
    });
  }

  const addGroup = () => {
    setTodi(prev => ({
      ...prev,
      group: [
        ...prev.group,
        {
          g_hydra_cost: '',
          g_truck_cost: '',
          total_block_area: '',
          total_block_cost: '',
          remaining_amount: '',
          date: new Date().toISOString(),
          block: []
        }
      ]
    }))
  }

  const addBlock = (groupIndex: number) => {
    const updatedGroups = [...todi.group]
    updatedGroups[groupIndex].block.push({
      id: '',
      addmeasures: []
    })
    setTodi({ ...todi, group: updatedGroups })
  }

  const addMeasure = (groupIndex: number, blockIndex: number) => {
    const updatedGroups = [...todi.group]
    updatedGroups[groupIndex].block[blockIndex].addmeasures.push({
      id: '',
      l: '',
      b: '',
      h: '',
      block_area: '',
      block_cost: ''
    })
    setTodi({ ...todi, group: updatedGroups })
  }

  const handleNestedChange = (e: any, groupIdx: number, blockIdx?: number, measureIdx?: number) => {
    const { name, value } = e.target
    const updated = [...todi.group]

    if (blockIdx === undefined) {
      // Group level change (hydra cost, truck cost)
      const fieldName = name as GroupField
      updated[groupIdx][fieldName] = value
      // Recalculate block cost for all measures in this group
      updated[groupIdx].block.forEach((block, bIdx) => {
        block.addmeasures.forEach((measure, mIdx) => {
          const blockArea = parseFloat(measure.block_area) || 0;
          const truckCost = parseFloat(updated[groupIdx].g_truck_cost) || 0;
          const hydraCost = parseFloat(updated[groupIdx].g_hydra_cost) || 0;
          const todiCost = parseFloat(todi.todi_cost) || 0;
          const blockCost = (truckCost + hydraCost + todiCost) * blockArea;
          measure.block_cost = blockCost.toFixed(2);
        });
      });
    } else if (measureIdx === undefined) {
      // Block level change
      // Type assertion to ensure name is a valid Block property
      const validName = name as keyof Block;
      updated[groupIdx].block[blockIdx][validName] = value
    } else {
      // Measure level change
      const measure = updated[groupIdx].block[blockIdx].addmeasures[measureIdx]
      // Type assertion to ensure name is a valid measure property
      const validName = name as keyof { id: string; l: string; b: string; h: string; block_area: string; block_cost: string };
      measure[validName] = value

      // Recalculate block area if L, B, or H changed
      if (name === 'l' || name === 'b' || name === 'h') {
        const l = parseFloat(measure.l) || 0;
        const b = parseFloat(measure.b) || 0;
        const h = parseFloat(measure.h) || 0;
        const blockArea = l * b * h;
        measure.block_area = blockArea.toFixed(2);

        // Recalculate block cost with new area
        const truckCost = parseFloat(updated[groupIdx].g_truck_cost) || 0;
        const hydraCost = parseFloat(updated[groupIdx].g_hydra_cost) || 0;
        const todiCost = parseFloat(todi.todi_cost) || 0;
        const blockCost = (truckCost + hydraCost + todiCost) * blockArea;
        measure.block_cost = blockCost.toFixed(2);
      }
    }

    setTodi(prev => ({ ...prev, group: updated }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    // Create a copy of the form data to modify dates
    const formData = { ...todi };
    

    formData.vender_id = Number(todi.vender_id);
    // Format the main date field
    formData.date = formData.date || new Date().toISOString();
    

    const res = await fetch('/api/Gala', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      alert('Gala created!')
    } else {
      const err = await res.json()
      alert('Error: ' + err.message)
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
        setError(error instanceof Error ? error.message : 'Failed to load data. Please try again later.')
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [setVendors, setIsLoading, setError])

  return (
    <form onSubmit={handleSubmit} className="p-6 py-28 space-y-6">
      <h1 className="text-xl font-bold">Add Todi</h1>
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="text-gray-600 mb-4">
          Loading vendors...
        </div>
      )}

      {/* Basic Fields */}
      {/* Block Type Select */}
      <div className="space-y-2">
        <label htmlFor="GalaType" className="block font-medium capitalize">Gala Type:</label>
        <select
          id="GalaType"
          name="GalaType"
          value={todi.GalaType}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Type</option>
          <option value="White">White</option>
          <option value="Brown">Brown</option>
        </select>
      </div>

      {/* Vendor Select */}
      <div className="space-y-2">
        <label htmlFor="vender_id" className="block font-medium capitalize">Vendor:</label>
        <select
          id="vender_id"
          name="vender_id"
          value={todi.vender_id}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.vendor}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="munim" className="block font-medium capitalize">Munim:</label>
        <input
          type="text"
          id="munim"
          name="munim"
          value={todi.munim}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        />
      </div> 
      <div className="space-y-2"> 
        <label htmlFor="l" className="block font-medium capitalize">L (लम्बाई) - Length:</label>
        <input
          type="text"
          id="l"
          name="l"
          value={todi.l}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="space-y-2"> 
        <label htmlFor="front_b" className="block font-medium capitalize">Front B (चौड़ाई) - Breadth:</label>
        <input
          type="text"
          id="front_b"
          name="front_b"
          value={todi.front_b}
          onChange={(e) => {
            const { value } = e.target;
            handleInput(e);
            // Calculate total_b when front_b changes
            const frontB = parseFloat(value || '0');
            const backB = parseFloat(todi.back_b || '0');
            const totalB = (frontB + backB)/2;
            handleInput({ target: { name: 'total_b', value: totalB.toFixed(2) } });
          }}
          className="w-full border dark:bg-gray-600 p-2 rounded"
        />
      </div>
      <div className="space-y-2"> 
        <label htmlFor="back_b" className="block font-medium capitalize">Back B (चौड़ाई) - Breadth:</label>
        <input
          type="text"
          id="back_b"
          name="back_b"
          value={todi.back_b}
          onChange={(e) => {
            const { value } = e.target;
            handleInput(e);
            // Calculate total_b when back_b changes
            const frontB = parseFloat(todi.front_b || '0');
            const backB = parseFloat(value || '0');
            const totalB = (frontB + backB)/2;
            handleInput({ target: { name: 'total_b', value: totalB.toFixed(2) } });
          }}
          className="w-full border dark:bg-gray-600 p-2 rounded"
        />
      </div>
      <div className="space-y-2"> 
        <label htmlFor="total_b" className="block font-medium capitalize">Total B (चौड़ाई) - Breadth:</label>
        <input
          type="text"
          id="total_b"
          name="total_b"
          value={todi.total_b}
          onChange={handleInput}
          className="w-full border dark:bg-gray-600 p-2 rounded"
          disabled
        />
      </div>
      <div className="space-y-2"> 
        <label htmlFor="h" className="block font-medium capitalize">H (ऊंचाई) - Height:</label>
        <input
          type="text"
          id="h"
          name="h"
          value={todi.h}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-2"> 
        <label htmlFor="todi_cost" className="block font-medium capitalize">Todi Cost:</label>
        <input
          type="text"
          id="todi_cost"
          name="todi_cost"
          value={todi.todi_cost}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="space-y-2"> 
        <label htmlFor="hydra_cost" className="block font-medium capitalize">Hydra Cost:</label>
        <input
          type="text"
          id="hydra_cost"
          name="hydra_cost"
          value={todi.hydra_cost}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="space-y-2"> 
        <label htmlFor="truck_cost" className="block font-medium capitalize">Truck Cost:</label>
        <input
          type="text"
          id="truck_cost"
          name="truck_cost"
          value={todi.truck_cost}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="space-y-2"> 
        <label htmlFor="total_todi_area" className="block font-medium capitalize">Total Todi Area:</label>
        <div
          className="w-full border p-2 rounded"
        >
          {todi.total_todi_area}
        </div>
      </div>
      <div className="space-y-2"> 
        <label htmlFor="total_todi_cost" className="block font-medium capitalize">Total Todi Cost:</label>
        <div
          className="w-full border p-2 rounded"
        >
          {todi.total_todi_cost}
        </div>
      </div>
      <div className="space-y-2"> 
        <label htmlFor="estimate_cost" className="block font-medium capitalize">Estimate Cost:</label>
        <div
          className="w-full border p-2 rounded"
        >
          {todi.estimate_cost}
        </div>
      </div>
      <div className="space-y-2"> 
        <label htmlFor="depreciation" className="block font-medium capitalize">Depreciation:</label>
        <input
          type="text"
          id="depreciation"
          name="depreciation"
          value={todi.depreciation}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="space-y-2"> 
        <label htmlFor="final_cost" className="block font-medium capitalize">Final Cost:</label>
        <div
          className="w-full border p-2 rounded"
        >
          {todi.final_cost}
        </div>
      </div>


      {/* Groups */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Groups</h2>
        {todi.group.map((group, gIdx) => (
          <div key={gIdx} className="border p-4 rounded space-y-2">

            <div className="space-y-2">
              <label htmlFor="g_hydra_cost" className="block font-medium capitalize">Hydra Cost:</label>
              <input
                type="text"
                id="g_hydra_cost"
                name="g_hydra_cost"
                value={group.g_hydra_cost}
                onChange={(e) => {
                  handleNestedChange(e, gIdx);
                  // Calculate block cost when hydra cost changes
                  const blockArea = parseFloat(group.block[0]?.addmeasures[0]?.block_area) || 0;
                  const truckCost = parseFloat(group.g_truck_cost) || 0;
                  const hydraCost = parseFloat(e.target.value) || 0;
                  const todiCost = parseFloat(todi.todi_cost) || 0;
                  const blockCost = (truckCost + hydraCost + todiCost) * blockArea;
                  handleNestedChange({ target: { name: 'block_cost', value: blockCost.toFixed(2) } }, gIdx, 0, 0);
                }}
                className="w-full border p-2 rounded"
              />

              <div className="space-y-2">
                <label htmlFor="date" className="block font-medium capitalize">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={group.date}
                  onChange={(e) => handleNestedChange(e, gIdx)}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="g_truck_cost" className="block font-medium capitalize">Truck Cost:</label>
              <input
                type="text"
                id="g_truck_cost"
                name="g_truck_cost"
                value={group.g_truck_cost}
                onChange={(e) => {
                  handleNestedChange(e, gIdx);
                  // Calculate block cost when truck cost changes
                  const blockArea = parseFloat(group.block[0]?.addmeasures[0]?.block_area) || 0;
                  const truckCost = parseFloat(e.target.value) || 0;
                  const hydraCost = parseFloat(group.g_hydra_cost) || 0;
                  const todiCost = parseFloat(todi.todi_cost) || 0;
                  const blockCost = (truckCost + hydraCost + todiCost) * blockArea;
                  handleNestedChange({ target: { name: 'block_cost', value: blockCost.toFixed(2) } }, gIdx, 0, 0);
                }}
                className="w-full border p-2 rounded"
              />
            </div>



            <button type="button" onClick={() => addBlock(gIdx)} className="text-sm text-blue-600">+ Add Block</button>

            {/* Blocks */}
            {group.block.map((block, bIdx) => (
              <div key={bIdx} className="ml-4 mt-2 border p-3 rounded">
              
             

                <button type="button" onClick={() => addMeasure(gIdx, bIdx)} className="text-sm text-green-600 mt-2">
                  + Add Measure
                </button>

                {/* Add Measures */}
                {block.addmeasures.map((m, mIdx) => (
                  <div key={mIdx} className="ml-4 mt-2 border p-2 rounded bg-gray-50">
                    <div className="space-y-2">
                      <label htmlFor="l" className="block font-medium capitalize">L (लम्बाई) - Length:</label>
                      <input
                        type="text"
                        id="length"
                        name="l"
                        value={m.l}
                        onChange={(e) => {
                          handleNestedChange(e, gIdx, bIdx, mIdx);
                          // Calculate block area when length changes
                          const l = parseFloat(e.target.value) || 0;
                          const b = parseFloat(m.b) || 0;
                          const h = parseFloat(m.h) || 0;
                          const blockArea = (l * b * h)/144;
                          handleNestedChange({ target: { name: 'block_area', value: blockArea } }, gIdx, bIdx, mIdx);
                        }}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="b" className="block font-medium capitalize">B (चौड़ाई) - Breadth:</label>
                      <input
                        type="text"
                        id="breadth"
                        name="b"
                        value={m.b}
                        onChange={(e) => {
                          handleNestedChange(e, gIdx, bIdx, mIdx);
                          // Calculate block area when breadth changes
                          const l = parseFloat(m.l) || 0;
                          const b = parseFloat(e.target.value) || 0;
                          const h = parseFloat(m.h) || 0;
                          const blockArea = (l * b * h)/144;
                          handleNestedChange({ target: { name: 'block_area', value: blockArea } }, gIdx, bIdx, mIdx);
                        }}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="h" className="block font-medium capitalize">H (ऊंचाई) - Height:</label>
                      <input
                        type="text"
                        id="height"
                        name="h"
                        value={m.h}
                        onChange={(e) => {
                          handleNestedChange(e, gIdx, bIdx, mIdx);
                          // Calculate block area when height changes
                          const l = parseFloat(m.l) || 0;
                          const b = parseFloat(m.b) || 0;
                          const h = parseFloat(e.target.value) || 0;
                          const blockArea = (l * b * h)/144;
                          handleNestedChange({ target: { name: 'block_area', value: blockArea.toFixed(2) } }, gIdx, bIdx, mIdx);
                        }}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="block_area" className="block font-medium capitalize">Block Area:</label>
                      <input
                        type="text"
                        id="blockArea"
                        name="block_area"
                        value={m.block_area}
                        onChange={(e) => {
                          handleNestedChange(e, gIdx, bIdx, mIdx);
                          // Calculate block cost when block area changes
                          const blockArea = parseFloat(e.target.value) || 0;
                          const truckCost = parseFloat(group.g_truck_cost) || 0;
                          const hydraCost = parseFloat(group.g_hydra_cost) || 0;
                          const todiCost = parseFloat(todi.todi_cost) || 0;
                          const blockCost = (truckCost + hydraCost + todiCost) * blockArea;
                          handleNestedChange({ target: { name: 'block_cost', value: blockCost.toFixed(2) } }, gIdx, bIdx, mIdx);
                        }}
                        className="w-full border p-2 rounded"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="block_cost" className="block font-medium capitalize">Block Cost:</label>
                      <input
                        type="text"
                        id="block_cost"
                        name="block_cost"
                        value={m.block_cost}
                        className="w-full border p-2 rounded"
                        disabled
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        <button type="button" onClick={addGroup} className="bg-blue-500 text-white px-3 py-2 rounded">
          + Add Group
        </button>
      </div>


      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center sm:text-left">
                  <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-3 py-1 rounded-full inline-block">
                    Summary
                  </span>
                </h3>
      
                
                {/* Add individual block areas */}
                <div className="mt-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 
                    <div
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Total Block Area
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {todi.group.reduce((total, group) => {
                          return total + group.block.reduce((groupTotal, block) => {
                            return groupTotal + block.addmeasures.reduce((measureTotal, measure) => {
                              return measureTotal + parseFloat(measure.block_area || '0');
                            }, 0);
                          }, 0);
                        }, 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>




                <div className="mt-8">
              
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               
                    <div
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Total Block Cost
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {todi.group.reduce((total, group) => {
                          return total + group.block.reduce((groupTotal, block) => {
                            return groupTotal + block.addmeasures.reduce((measureTotal, measure) => {
                              return measureTotal + parseFloat(measure.block_cost || '0');
                            }, 0);
                          }, 0);
                        }, 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>


                <div className="mt-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
                <div
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Remaining Amount
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(parseFloat(todi.final_cost || '0') - 
                     todi.group.reduce((total: number, group) => {
                       return total + group.block.reduce((groupTotal: number, block) => {
                         return groupTotal + block.addmeasures.reduce((measureTotal: number, measure) => {
                           return measureTotal + parseFloat(measure.block_cost || '0');
                         }, 0);
                       }, 0);
                     }, 0))
                    .toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
              </section>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mt-6">Submit</button>
    </form>
  )
}
