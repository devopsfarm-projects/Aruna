'use client'

import { useState } from 'react'

interface Block {
  id: string;
  addmeasures: any[]; 
}

interface Group {
  g_hydra_cost: string;
  g_truck_cost: string;
  total_block_area: string;
  total_block_cost: string;
  remaining_amount: string;
  g_date: string;
  block: Block[];
}

interface TodiState {
  munim: string;
  BlockType: string;
  date: string;
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
  group: Group[];
}

export default function AddTodiPage() {
  const [todi, setTodi] = useState<TodiState>({
    munim: '',
    BlockType: '',
    date: '',
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
    group: []
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
      updated[groupIdx][name] = value
    } else if (measureIdx === undefined) {
      updated[groupIdx].block[blockIdx][name] = value
    } else {
      updated[groupIdx].block[blockIdx].addmeasures[measureIdx][name] = value
    }

    setTodi(prev => ({ ...prev, group: updated }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/Todi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todi),
    })

    if (res.ok) {
      alert('Todi created!')
    } else {
      const err = await res.json()
      alert('Error: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 py-28 space-y-6">
      <h1 className="text-xl font-bold">Add Todi</h1>

      {/* Basic Fields */}
      {/* Block Type Select */}
      <div className="space-y-2">
        <label htmlFor="BlockType" className="block font-medium capitalize">Block Type:</label>
        <select
          id="BlockType"
          name="BlockType"
          value={todi.BlockType}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Type</option>
          <option value="White">White</option>
          <option value="Brown">Brown</option>
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
        <label htmlFor="b" className="block font-medium capitalize">B (चौड़ाई) - Breadth:</label>
        <input
          type="text"
          id="b"
          name="b"
          value={todi.b}
          onChange={handleInput}
          className="w-full border p-2 rounded"
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
              <label htmlFor="g_date" className="block font-medium capitalize">date</label>
              <input
                type="date"
                id="g_date"
                name="g_date"
                value={group.g_date}
                onChange={(e) => handleNestedChange(e, gIdx)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="g_hydra_cost" className="block font-medium capitalize">Hydra Cost:</label>
              <input
                type="text"
                id="g_hydra_cost"
                name="g_hydra_cost"
                value={group.g_hydra_cost}
                onChange={(e) => handleNestedChange(e, gIdx)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="g_truck_cost" className="block font-medium capitalize">Truck Cost:</label>
              <input
                type="text"
                id="g_truck_cost"
                name="g_truck_cost"
                value={group.g_truck_cost}
                onChange={(e) => handleNestedChange(e, gIdx)}
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
                        name="length"
                        value={m.length}
                        onChange={(e) => {
                          handleNestedChange(e, gIdx, bIdx, mIdx);
                          // Calculate block area when length changes
                          const length = parseFloat(e.target.value) || 0;
                          const breadth = parseFloat(m.breadth) || 0;
                          const height = parseFloat(m.height) || 0;
                          const blockArea = length * breadth * height;
                          handleNestedChange({ target: { name: 'blockArea', value: blockArea } }, gIdx, bIdx, mIdx);
                        }}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="b" className="block font-medium capitalize">B (चौड़ाई) - Breadth:</label>
                      <input
                        type="text"
                        id="breadth"
                        name="breadth"
                        value={m.breadth}
                        onChange={(e) => {
                          handleNestedChange(e, gIdx, bIdx, mIdx);
                          // Calculate block area when breadth changes
                          const length = parseFloat(m.length) || 0;
                          const breadth = parseFloat(e.target.value) || 0;
                          const height = parseFloat(m.height) || 0;
                          const blockArea = length * breadth * height;
                          handleNestedChange({ target: { name: 'blockArea', value: blockArea } }, gIdx, bIdx, mIdx);
                        }}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="h" className="block font-medium capitalize">H (ऊंचाई) - Height:</label>
                      <input
                        type="text"
                        id="height"
                        name="height"
                        value={m.height}
                        onChange={(e) => {
                          handleNestedChange(e, gIdx, bIdx, mIdx);
                          // Calculate block area when height changes
                          const length = parseFloat(m.length) || 0;
                          const breadth = parseFloat(m.breadth) || 0;
                          const height = parseFloat(e.target.value) || 0;
                          const blockArea = length * breadth * height;
                          handleNestedChange({ target: { name: 'blockArea', value: blockArea } }, gIdx, bIdx, mIdx);
                        }}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="block_area" className="block font-medium capitalize">Block Area:</label>
                      <input
                        type="text"
                        id="blockArea"
                        name="blockArea"
                        value={m.blockArea}
                        onChange={(e) => handleNestedChange(e, gIdx, bIdx, mIdx)}
                        className="w-full border p-2 rounded"
                        disabled // Block area is calculated automatically
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="block_cost" className="block font-medium capitalize">Block Cost:</label>
                      <input
                        type="text"
                        id="blockCost"
                        name="blockCost"
                        value={m.blockCost}
                        onChange={(e) => handleNestedChange(e, gIdx, bIdx, mIdx)}
                        className="w-full border p-2 rounded"
                      />
                    </div>


                    {/* {[ 'l', 'b', 'h', 'block_area', 'block_cost'].map(name => (
                      <div key={name}>
                        <label>{name}:</label>
                        <input
                          type="text"
                          name={name}
                          value={(m as any)[name]}
                          onChange={(e) => handleNestedChange(e, gIdx, bIdx, mIdx)}
                          className="w-full border p-1 rounded"
                        />
                      </div>
                    ))} */}
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

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mt-6">Submit</button>
    </form>
  )
}
