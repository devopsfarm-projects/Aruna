'use client'

import { ReactNode, useEffect, useState } from 'react'
import type { GroupField, Vendor } from '../../types'
import axios from 'axios'
import { FormInput, FormSelect, FormDisplay, SummaryCard } from '../../components/FormSection'

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
  total_block_cost: ReactNode;
  total_block_area: ReactNode;
  total_gala_cost: ReactNode;
  total_gala_area: ReactNode;
  vender_id: string | number | readonly string[] | undefined;
  munim: string;
  GalaType: string;
  date: Date | string;
  l: string;
  front_b: string;
  back_b: string;
  total_b: string;
  h: string;
  gala_cost: string;
  hydra_cost: string;
  truck_cost: string;

  estimate_cost: string;
  depreciation: string;
  final_cost: string;
  group: Group[];
}

export default function AddTodiPage() {
  const [, setIsLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [todi, setTodi] = useState<TodiState>({
    total_block_cost: '',
    total_block_area: '',
    total_gala_cost: '',
    total_gala_area: '',
    vender_id: '',
    munim: '',
    GalaType: '',
    date: new Date().toISOString(),
    l: '',
    front_b: '',
    back_b: '',
    total_b: '',
    h: '',
    gala_cost: '',
    hydra_cost: '',
    truck_cost: '',
    estimate_cost: '',
    depreciation: '',
    final_cost: '',
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
  }, 0).toFixed(2)



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
    return (parseFloat(totalArea) * parseFloat(totalCost)).toFixed(2);
  };

  const calculateFinalCost = (estimate: string, depreciation: string): string => {
    return ((parseFloat(estimate) - ((parseFloat(depreciation)/100)*parseFloat(estimate)))).toFixed(2);
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
      
      // If any dimension changes, recalculate total_gala_area
      if (name === 'l' || name === 'total_b' || name === 'h') {
        updatedTodi.total_gala_area = calculateTotalTodiArea(
          updatedTodi.l || '0',
          updatedTodi.total_b || '0',
          updatedTodi.h || '0'
        );
      }

      // If any cost field changes, recalculate total_gala_cost
      if (name === 'gala_cost' || name === 'hydra_cost' || name === 'truck_cost') {
        updatedTodi.total_gala_cost = calculateTotalTodiCost(
          updatedTodi.gala_cost || '0',
          updatedTodi.hydra_cost || '0',
          updatedTodi.truck_cost || '0'
        );
      }

      // Always recalculate estimate_cost if total_gala_area or total_gala_cost is available
      if (updatedTodi.total_gala_area && typeof updatedTodi.total_gala_area === 'string' &&
          updatedTodi.total_gala_cost && typeof updatedTodi.total_gala_cost === 'string') {
        const area = parseFloat(updatedTodi.total_gala_area);
        const cost = parseFloat(updatedTodi.total_gala_cost);
        if (area > 0 && cost > 0) {
          updatedTodi.estimate_cost = calculateEstimateCost(
            updatedTodi.total_gala_area,
            updatedTodi.total_gala_cost
          );
        }
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
          const todiCost = parseFloat(todi.gala_cost) || 0;
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
        const todiCost = parseFloat(todi.gala_cost) || 0;
        const blockCost = (truckCost + hydraCost + todiCost) * blockArea;
        measure.block_cost = blockCost.toFixed(2);
      }
    }

    setTodi(prev => ({ ...prev, group: updated }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate GalaType
    const validGalaTypes = ['Brown', 'White'];
    if (!validGalaTypes.includes(todi.GalaType)) {
      alert('Invalid Gala Type. Please select either "Brown" or "White"');
      return;
    }

    // Create a copy of the form data to modify dates
    const formData = { ...todi };
    
    // Convert total_block_area and total_block_cost to numbers before sending
    formData.total_block_area = parseFloat(todi.total_block_area as string);
    formData.total_block_cost = parseFloat(todi.total_block_cost as string);
    
    formData.vender_id = Number(todi.vender_id);
    // Format the main date field
    formData.date = formData.date || new Date().toISOString();
    
    try {
      const res = await fetch('/api/Gala', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create Gala');
      }

      alert('Gala created successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred while creating Gala');
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
    <form onSubmit={handleSubmit} className=" max-w-7xl mx-auto p-6 py-4 space-y-6">
      <h1 className="text-xl font-bold">Add Gala</h1>

      <div className="px-4 py-6 bg-gray-50 dark:bg-black rounded-lg shadow-md max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Gala Type */}
  <FormSelect label="Gala Type:" id="GalaType" name="GalaType" value={todi.GalaType} onChange={handleInput}>
    <option value="">Select Type</option>
    <option value="White">White</option>
    <option value="Brown">Brown</option>
  </FormSelect>

  {/* Vendor */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vendor</label>
    <select
      value={todi.vender_id}
      onChange={(e) => {
        const value = Number(e.target.value);
        handleInput({ ...e, target: { ...e.target, name: 'vender_id', value } });
      }}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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

  {/* Munim */}
  <FormInput label="Munim:" id="munim" name="munim" value={todi.munim} onChange={handleInput} />

  {/* Length */}
  <FormInput label="L (लम्बाई) - Length (m):" id="l" name="l" value={todi.l} onChange={handleInput} />

  {/* Front B */}
  <FormInput
    label="Front B (चौड़ाई) - Breadth (m):"
    id="front_b"
    name="front_b"
    value={todi.front_b}
    onChange={(e: { target: { value: any } }) => {
      const { value } = e.target;
      handleInput(e);
      const frontB = parseFloat(value || '0');
      const backB = parseFloat(todi.back_b || '0');
      const totalB = (frontB + backB) / 2;
      handleInput({ target: { name: 'total_b', value: totalB.toFixed(2) } });
    }}
  />

  {/* Back B */}
  <FormInput
    label="Back B (चौड़ाई) - Breadth (m):"
    id="back_b"
    name="back_b"
    value={todi.back_b}
    onChange={(e: { target: { value: any } }) => {
      const { value } = e.target;
      handleInput(e);
      const frontB = parseFloat(todi.front_b || '0');
      const backB = parseFloat(value || '0');
      const totalB = (frontB + backB) / 2;
      handleInput({ target: { name: 'total_b', value: totalB.toFixed(2) } });
    }}
  />

  {/* Total B (Disabled) */}
  <FormInput label="Total B (चौड़ाई) - Breadth (m):" id="total_b" name="total_b" value={todi.total_b} onChange={handleInput} disabled />

  {/* Height */}
  <FormInput label="H (ऊंचाई) - Height (m):" id="h" name="h" value={todi.h} onChange={handleInput} />

  {/* Gala Cost */}
  <FormInput
    label="Gala Cost (₹):"
    id="gala_cost"
    name="gala_cost"
    value={todi.gala_cost ? Number(todi.gala_cost).toLocaleString('en-IN') : ''}
    onChange={handleInput}
  />

  {/* Hydra Cost */}
  <FormInput label="Hydra Cost (₹):" id="hydra_cost" name="hydra_cost" value={todi.hydra_cost} onChange={handleInput} />

  {/* Truck Cost */}
  <FormInput label="Truck Cost (₹):" id="truck_cost" name="truck_cost" value={todi.truck_cost} onChange={handleInput} />

  {/* Total Gala Area (readonly) */}
  <FormDisplay label="Total Gala Area (m³):" value={todi.total_gala_area} />

  {/* Total Gala Cost */}
  <FormDisplay label="Total Gala Cost (₹):" value={todi.total_gala_cost} />

  {/* Estimate Cost */}
  <FormDisplay label="Estimate Cost (₹):" value={todi.estimate_cost} />

  {/* Depreciation */}
  <FormInput label="Depreciation (%):" id="depreciation" name="depreciation" value={todi.depreciation} onChange={handleInput} />

  {/* Final Cost */}
  <FormDisplay label="Final Cost (₹):" value={todi.final_cost} />
</div>


      {/* Groups */}
      <div className="space-y-6">
  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Groups</h2>

  {todi.group.map((group, gIdx) => (
    <div key={gIdx} className="border rounded-lg p-4 bg-white dark:bg-gray-800 space-y-4 shadow-sm">

      {/* Group-level Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Hydra Cost (₹)"
          id={`g_hydra_cost-${gIdx}`}
          name="g_hydra_cost"
          value={group.g_hydra_cost}
          onChange={(e: { target: { value: string } }) => {
            handleNestedChange(e, gIdx);
            const blockArea = parseFloat(group.block[0]?.addmeasures[0]?.block_area) || 0;
            const truckCost = parseFloat(group.g_truck_cost) || 0;
            const hydraCost = parseFloat(e.target.value) || 0;
            const todiCost = parseFloat(todi.gala_cost) || 0;
            const blockCost = (truckCost + hydraCost + todiCost) * blockArea;
            handleNestedChange({ target: { name: 'block_cost', value: blockCost.toFixed(2) } }, gIdx, 0, 0);
          }}
        />

        <FormInput
          label="Truck Cost (₹)"
          id={`g_truck_cost-${gIdx}`}
          name="g_truck_cost"
          value={group.g_truck_cost}
          onChange={(e: { target: { value: string } }) => {
            handleNestedChange(e, gIdx);
            const blockArea = parseFloat(group.block[0]?.addmeasures[0]?.block_area) || 0;
            const truckCost = parseFloat(e.target.value) || 0;
            const hydraCost = parseFloat(group.g_hydra_cost) || 0;
            const todiCost = parseFloat(todi.gala_cost) || 0;
            const blockCost = (truckCost + hydraCost + todiCost) * blockArea;
            handleNestedChange({ target: { name: 'block_cost', value: blockCost.toFixed(2) } }, gIdx, 0, 0);
          }}
        />

        <FormInput
          label="Date"
          id={`date-${gIdx}`}
          name="date"
          type="date"
          value={group.date}
          onChange={(e: any) => handleNestedChange(e, gIdx)}
        />
      </div>

      {/* Add Block Button */}
      <button
        type="button"
        onClick={() => addBlock(gIdx)}
        className="text-sm text-blue-600 font-medium hover:underline"
      >
        + Add Block
      </button>

      {/* Blocks */}
      {group.block.map((block, bIdx) => (
        <div key={bIdx} className="ml-2 border-l-4 border-indigo-500 pl-4 mt-4 space-y-4">

          {/* Add Measure Button */}
          <button
            type="button"
            onClick={() => addMeasure(gIdx, bIdx)}
            className="text-sm text-green-600 font-medium hover:underline"
          >
            + Add Measure
          </button>

          {/* Measures */}
          {block.addmeasures.map((m, mIdx) => (
            <div key={mIdx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">

              <FormInput
                label="Length (L - लम्बाई) [m]"
                name="l"
                value={m.l}
                onChange={(e: { target: { value: string } }) => {
                  handleNestedChange(e, gIdx, bIdx, mIdx);
                  const l = parseFloat(e.target.value) || 0;
                  const b = parseFloat(m.b) || 0;
                  const h = parseFloat(m.h) || 0;
                  const blockArea = (l * b * h) / 144;
                  handleNestedChange({ target: { name: 'block_area', value: blockArea.toFixed(2) } }, gIdx, bIdx, mIdx);
                }}
              />

              <FormInput
                label="Breadth (B - चौड़ाई) [m]"
                name="b"
                value={m.b}
                onChange={(e: { target: { value: string } }) => {
                  handleNestedChange(e, gIdx, bIdx, mIdx);
                  const l = parseFloat(m.l) || 0;
                  const b = parseFloat(e.target.value) || 0;
                  const h = parseFloat(m.h) || 0;
                  const blockArea = (l * b * h) / 144;
                  handleNestedChange({ target: { name: 'block_area', value: blockArea.toFixed(2) } }, gIdx, bIdx, mIdx);
                }}
              />

              <FormInput
                label="Height (H - ऊंचाई) [m]"
                name="h"
                value={m.h}
                onChange={(e: { target: { value: string } }) => {
                  handleNestedChange(e, gIdx, bIdx, mIdx);
                  const l = parseFloat(m.l) || 0;
                  const b = parseFloat(m.b) || 0;
                  const h = parseFloat(e.target.value) || 0;
                  const blockArea = (l * b * h) / 144;
                  handleNestedChange({ target: { name: 'block_area', value: blockArea.toFixed(2) } }, gIdx, bIdx, mIdx);
                }}
              />

              <FormDisplay label="Block Area (m³)" value={m.block_area} />

              <FormDisplay
                label="Block Cost (₹)"
                value={Number(m.block_cost)?.toLocaleString('en-IN') || '0'}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  ))}

  {/* Add Group Button */}
  <button
    type="button"
    onClick={addGroup}
    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
  >
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

                        <SummaryCard
                        title="Total Block Area (m³)"
                        value={todi.group.reduce((total, group) => {
                          return total + group.block.reduce((groupTotal, block) => {
                            return groupTotal + block.addmeasures.reduce((measureTotal, measure) => {
                              return measureTotal + parseFloat(measure.block_area || '0');
                            }, 0);
                          }, 0);
                        }, 0).toFixed(2)}
                        />
                  
          
                        <SummaryCard
                        title="Total Block Cost (₹)"
                        value={todi.group.reduce((total, group) => {
                          return total + group.block.reduce((groupTotal, block) => {
                            return groupTotal + block.addmeasures.reduce((measureTotal, measure) => {
                              return measureTotal + parseFloat(measure.block_cost || '0');
                            }, 0);
                          }, 0);
                        }, 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        />
             
                    <SummaryCard
                    title="Remaining Amount (₹)"
                    value={(parseFloat(todi.final_cost || '0') - 
                     todi.group.reduce((total: number, group) => {
                       return total + group.block.reduce((groupTotal: number, block) => {
                         return groupTotal + block.addmeasures.reduce((measureTotal: number, measure) => {
                           return measureTotal + parseFloat(measure.block_cost || '0');
                         }, 0);
                       }, 0);
                     }, 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   />
              
              </div>
              </section>

      <button type="submit" className="bg-green-600 text-white px-4 py-2  mt-6">Submit</button>
    </form>
  )
}


