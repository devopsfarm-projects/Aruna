'use client'

import { useEffect, useState } from 'react'
import type { GroupField } from '../../types'
import axios from 'axios'
import { FormInput, FormSelect, FormDisplay, SummaryCard } from '../../components/FormSection'

interface Vendor {
  id: number
  vendor: string
  vendor_no: string
  address: string
  mail_id: string
  Company_no: string
  phone: Array<{
    number: string
    type?: string
  }>
  createdAt: string
  updatedAt: string
}

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
  g_hydra_cost: string
  g_truck_cost: string
  date: string
  block: Block[]
  total_block_area: string
  total_block_cost: string
  [key: string]: string | Block[]
}

interface TodiState {
  vender_id: string | number | readonly string[] | undefined;
  munim: string;
  BlockType: string;
  date: Date | string;
  l: string;
  b: string;
  h: string;
  total_todi_area: string;
  todi_cost: string;
  hydra_cost: string;
  truck_cost: string;
  total_todi_cost: string;
  estimate_cost: string;
  depreciation: string;
  final_cost: string;
  total_block_area: string;
  total_block_cost: string;
  group: Group[];
  
}

export default function AddTodiPage() {
  const [, setIsLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [todi, setTodi] = useState<TodiState>({
    munim: '',
    BlockType: '',
    date: new Date().toISOString(),
    vender_id: 0,
    l: '',
    b: '',
    h: '',
    total_todi_area: '',
    todi_cost: '',
    hydra_cost: '',
    truck_cost: '',
    total_todi_cost: '',
    estimate_cost: '',
    depreciation: '',
    final_cost: '',
    total_block_area: '',
    total_block_cost: '',
    group: [
      {
        g_hydra_cost: '',
        g_truck_cost: '',
        date: new Date().toISOString(),
        block: [],
        total_block_area: '',
        total_block_cost: ''
      }
    ]
  })

  const calculateTotalTodiArea = (l: string, b: string, h: string): string => {
    const length = parseFloat(l) || 0;
    const breadth = parseFloat(b) || 0;
    const height = parseFloat(h) || 0;
    return (length * breadth * height).toFixed(2);
  };

  todi.total_block_cost = todi.group.reduce((total, group) => {
    return total + group.block.reduce((groupTotal, block) => {
      return groupTotal + block.addmeasures.reduce((measureTotal, measure) => {
        return measureTotal + parseFloat(measure.block_cost || '0');
      }, 0);
    }, 0);
  }, 0).toFixed(2)


  todi.total_block_area = todi.group.reduce((total, group) => {
    return total + group.block.reduce((groupTotal, block) => {
      return groupTotal + block.addmeasures.reduce((measureTotal, measure) => {
        return measureTotal + parseFloat(measure.block_area || '0');
      }, 0);
    }, 0);
  }, 0).toFixed(2);

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

  const calculateTotalBlockArea = (group: Group[]): string => {
    return group.reduce((total, group) => {
      return total + group.block.reduce((groupTotal, block) => {
        return groupTotal + block.addmeasures.reduce((measureTotal, measure) => {
          return measureTotal + parseFloat(measure.block_area || '0');
        }, 0);
      }, 0);
    }, 0).toFixed(2);
  };

  const calculateTotalBlockCost = (group: Group[]): string => {
    return group.reduce((total, group) => {
      return total + group.block.reduce((groupTotal, block) => {
        return groupTotal + block.addmeasures.reduce((measureTotal, measure) => {
          return measureTotal + parseFloat(measure.block_cost || '0');
        }, 0);
      }, 0);
    }, 0).toFixed(2);
  };


  const handleInput = (e: any) => {
    const { name, value } = e.target;
    // Update the state with the new value
    setTodi(prev => {
      const updatedTodi = { ...prev, [name]: value };
      
      // If any dimension changes, recalculate total_todi_area
      if (name === 'l' || name === 'b' || name === 'h') {
        updatedTodi.total_todi_area = calculateTotalTodiArea(
          updatedTodi.l || '0',
          updatedTodi.b || '0',
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

      // Recalculate total block area and cost whenever group data changes
      if (name.startsWith('group.') || name.startsWith('block.') || name.startsWith('addmeasures.')) {
        updatedTodi.total_block_area = calculateTotalBlockArea(updatedTodi.group);
        updatedTodi.total_block_cost = calculateTotalBlockCost(updatedTodi.group);
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
    const updatedTodi = {
      ...todi,
      group: updatedGroups,
      total_block_area: calculateTotalBlockArea(updatedGroups),
      total_block_cost: calculateTotalBlockCost(updatedGroups)
    };
    setTodi(updatedTodi)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Create a copy of the form data to modify dates
    const formData = { ...todi };
    
    formData.vender_id = Number(todi.vender_id);
    // Format the main date field
    formData.date = formData.date || new Date().toISOString();
    

    const res = await fetch('/api/Todi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      alert('Todi Raskat created!')
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
        setError('Failed to load data. Please try again later.')
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [setVendors, setIsLoading, setError])






  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6 py-4 space-y-6">
      <h1 className="text-xl font-bold">Add Todi</h1>

      <div className=" px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 dark:bg-black">
  {/* Block Type */}
  <FormSelect label="Block Type:" id="BlockType" name="BlockType" value={todi.BlockType} onChange={handleInput}>
    <option value="">Select Type</option>
    <option value="White">White</option>
    <option value="Brown">Brown</option>
  </FormSelect>


  {/* Vendor */}
  <div className="flex flex-col gap-2">
    <label className="font-semibold text-gray-800 dark:text-gray-200">Vendor</label>
    <select
      value={todi.vender_id}
      onChange={(e) => {
        const value = Number(e.target.value);
        handleInput({ ...e, target: { ...e.target, name: 'vender_id', value } });
      }}
      className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
    >
      <option value="">Select vendor</option>
      {vendors.map((vendor) => (
        <option key={vendor.id} value={vendor.id}>{vendor.vendor}</option>
      ))}
    </select>
  </div>

  {/* Munim */}
  <FormInput label="Munim:" id="munim" name="munim" value={todi.munim} onChange={handleInput} />


  {/* Length */}
  <FormInput label="Length (L - लंबाई) [m]" id="l" name="l" value={todi.l} onChange={handleInput} />

  {/* Height */}
  <FormInput label="Height (H - ऊंचाई) [m]" id="h" name="h" value={todi.h} onChange={handleInput} />

  {/* Breadth */}
  <FormInput label="Breadth (B - चौड़ाई) [m]" id="b" name="b" value={todi.b} onChange={handleInput} />


<FormInput label="Todi Cost" id="todi_cost" name="todi_cost" value={todi.todi_cost} onChange={handleInput} />
<FormInput label="Hydra Cost" id="hydra_cost" name="hydra_cost" value={todi.hydra_cost} onChange={handleInput} />
<FormInput label="Truck Cost" id="truck_cost" name="truck_cost" value={todi.truck_cost} onChange={handleInput} />
<FormInput label="Depreciation" id="depreciation" name="depreciation" value={todi.depreciation} onChange={handleInput} />

<FormInput label="Total Todi Area" id="total_todi_area" name="total_todi_area" value={Number(todi.total_todi_area)?.toLocaleString('en-IN')} onChange={handleInput} />
<FormInput label="Total Todi Cost" id="total_todi_cost" name="total_todi_cost" value={Number(todi.total_todi_cost)?.toLocaleString('en-IN')} onChange={handleInput} />
<FormInput label="Estimate Cost" id="estimate_cost" name="estimate_cost" value={Number(todi.estimate_cost)?.toLocaleString('en-IN')} onChange={handleInput} />
<FormInput label="Final Cost" id="final_cost" name="final_cost" value={Number(todi.final_cost)?.toLocaleString('en-IN')} onChange={handleInput} />


</div>


      {/* Groups */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Groups</h2>
        {todi.group.map((group, gIdx) => (
          <div key={gIdx} className="border p-4  space-y-2">
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {/* Hydra Cost */}
  <div className="flex flex-col gap-1">
    <label htmlFor="g_hydra_cost" className="text-sm font-medium text-gray-800 dark:text-gray-200">Hydra Cost (₹)</label>
    <input
      type="text"
      id="g_hydra_cost"
      name="g_hydra_cost"
      value={group.g_hydra_cost}
      onChange={(e) => {
        handleNestedChange(e, gIdx);

        const blockArea = parseFloat(group.block[0]?.addmeasures[0]?.block_area) || 0;
        const truckCost = parseFloat(group.g_truck_cost) || 0;
        const hydraCost = parseFloat(e.target.value) || 0;
        const todiCost = parseFloat(todi.todi_cost) || 0;
        const blockCost = (truckCost + hydraCost + todiCost) * blockArea;

        handleNestedChange({ target: { name: 'block_cost', value: blockCost.toFixed(2) } }, gIdx, 0, 0);
      }}
      className="p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>

  {/* Truck Cost */}
  <div className="flex flex-col gap-1">
    <label htmlFor="g_truck_cost" className="text-sm font-medium text-gray-800 dark:text-gray-200">Truck Cost (₹)</label>
    <input
      type="text"
      id="g_truck_cost"
      name="g_truck_cost"
      value={group.g_truck_cost}
      onChange={(e) => {
        handleNestedChange(e, gIdx);

        const blockArea = parseFloat(group.block[0]?.addmeasures[0]?.block_area) || 0;
        const truckCost = parseFloat(e.target.value) || 0;
        const hydraCost = parseFloat(group.g_hydra_cost) || 0;
        const todiCost = parseFloat(todi.todi_cost) || 0;
        const blockCost = (truckCost + hydraCost + todiCost) * blockArea;

        handleNestedChange({ target: { name: 'block_cost', value: blockCost.toFixed(2) } }, gIdx, 0, 0);
      }}
      className="p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>

  {/* Date */}
  <div className="flex flex-col gap-1">
    <label htmlFor="date" className="text-sm font-medium text-gray-800 dark:text-gray-200">Date</label>
    <input
      type="date"
      id="date"
      name="date"
      value={group.date}
      onChange={(e) => handleNestedChange(e, gIdx)}
      className="p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
</div>



            <button type="button" onClick={() => addBlock(gIdx)} className="text-sm text-blue-600">+ Add Block</button>

            {/* Blocks */}
            {group.block.map((block, bIdx) => (
              <div key={bIdx} className="ml-4 mt-2 border p-3 ">
              
             

                <button type="button" onClick={() => addMeasure(gIdx, bIdx)} className="text-sm text-green-600 mt-2">
                  + Add Measure
                </button>

                {/* Add Measures */}
                {block.addmeasures.map((m, mIdx) => (
  <div
    key={mIdx}
    className="ml-4 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900"
  >
    {/* Length */}
    <div className="flex flex-col gap-1">
      <label htmlFor="length" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        L (लम्बाई) - Length (m)
      </label>
      <input
        type="text"
        id="length"
        name="l"
        value={m.l}
        onChange={(e) => {
          handleNestedChange(e, gIdx, bIdx, mIdx);
          const l = parseFloat(e.target.value) || 0;
          const b = parseFloat(m.b) || 0;
          const h = parseFloat(m.h) || 0;
          const blockArea = (l * b * h) / 144;
          handleNestedChange({ target: { name: 'block_area', value: blockArea.toFixed(2) } }, gIdx, bIdx, mIdx);
        }}
        className="p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Breadth */}
    <div className="flex flex-col gap-1">
      <label htmlFor="breadth" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        B (चौड़ाई) - Breadth (m)
      </label>
      <input
        type="text"
        id="breadth"
        name="b"
        value={m.b}
        onChange={(e) => {
          handleNestedChange(e, gIdx, bIdx, mIdx);
          const l = parseFloat(m.l) || 0;
          const b = parseFloat(e.target.value) || 0;
          const h = parseFloat(m.h) || 0;
          const blockArea = (l * b * h) / 144;
          handleNestedChange({ target: { name: 'block_area', value: blockArea.toFixed(2) } }, gIdx, bIdx, mIdx);
        }}
        className="p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Height */}
    <div className="flex flex-col gap-1">
      <label htmlFor="height" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        H (ऊंचाई) - Height (m)
      </label>
      <input
        type="text"
        id="height"
        name="h"
        value={m.h}
        onChange={(e) => {
          handleNestedChange(e, gIdx, bIdx, mIdx);
          const l = parseFloat(m.l) || 0;
          const b = parseFloat(m.b) || 0;
          const h = parseFloat(e.target.value) || 0;
          const blockArea = (l * b * h) / 144;
          handleNestedChange({ target: { name: 'block_area', value: blockArea.toFixed(2) } }, gIdx, bIdx, mIdx);
        }}
        className="p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Block Area (disabled) */}
    <div className="flex flex-col gap-1">
      <label htmlFor="block_area" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        Block Area (m³)
      </label>
      <input
        type="text"
        id="block_area"
        name="block_area"
        value={m.block_area}
        disabled
        onChange={(e) => {
          handleNestedChange(e, gIdx, bIdx, mIdx);
          const blockArea = parseFloat(e.target.value) || 0;
          const truckCost = parseFloat(group.g_truck_cost) || 0;
          const hydraCost = parseFloat(group.g_hydra_cost) || 0;
          const todiCost = parseFloat(todi.todi_cost) || 0;
          const blockCost = (truckCost + hydraCost + todiCost) * blockArea;
          handleNestedChange({ target: { name: 'block_cost', value: blockCost.toFixed(2) } }, gIdx, bIdx, mIdx);
        }}
        className="p-2 border rounded-md bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 cursor-not-allowed"
      />
    </div>

    {/* Block Cost (disabled) */}
    <div className="flex flex-col gap-1">
      <label htmlFor="block_cost" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        Block Cost (₹)
      </label>
      <input
        type="text"
        id="block_cost"
        name="block_cost"
        value={Number(m.block_cost)?.toLocaleString('en-IN') || '0'}
        disabled
        className="p-2 border rounded-md bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 cursor-not-allowed"
      />
    </div>
  </div>
))}

              </div>
            ))}
          </div>
        ))}

        <button type="button" onClick={addGroup} className="bg-blue-500 text-white px-3 py-2 ">
          + Add Group
        </button>
      </div>


      <section className="bg-white dark:bg-black border border-gray-200 dark:border-gray-600 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center sm:text-left">
    <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-4 py-1 rounded-full inline-block">
      Summary
    </span>
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* Summary Card - Total Block Area */}
    <SummaryCard
      title="Total Block Area (m³)"
      value={todi.group
        .reduce((total, group) =>
          total + group.block.reduce((groupTotal, block) =>
            groupTotal + block.addmeasures.reduce((measureTotal, measure) =>
              measureTotal + parseFloat(measure.block_area || '0'), 0
            ), 0
          ), 0
        ).toFixed(2)}
    />

    {/* Summary Card - Total Block Cost */}
    <SummaryCard
      title="Total Block Cost (₹)"
      value={todi.group
        .reduce((total, group) =>
          total + group.block.reduce((groupTotal, block) =>
            groupTotal + block.addmeasures.reduce((measureTotal, measure) =>
              measureTotal + parseFloat(measure.block_cost || '0'), 0
            ), 0
          ), 0
        ).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    />

    {/* Summary Card - Remaining Amount */}
    <SummaryCard
      title="Remaining Amount (₹)"
      value={(() => {
        const finalCost = parseFloat(todi.final_cost || '0');
        const totalBlockCost = todi.group.reduce((total, group) =>
          total + group.block.reduce((groupTotal, block) =>
            groupTotal + block.addmeasures.reduce((measureTotal, measure) =>
              measureTotal + parseFloat(measure.block_cost || '0'), 0
            ), 0
          ), 0
        );
        const remaining = finalCost - totalBlockCost;
        return remaining.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      })()}
    />
  </div>
</section>


      <button type="submit" className="bg-green-600 text-white px-4 py-2  mt-6">Submit</button>
    </form>
  )
}
