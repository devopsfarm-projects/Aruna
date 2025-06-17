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

  const handleInput = (e: any) => {
    const { name, value } = e.target
    setTodi(prev => ({ ...prev, [name]: value }))
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
      {['munim', 'BlockType', 'date', 'l', 'b', 'h', 'total_todi_area', 'todi_cost', 'hydra_cost', 'truck_cost', 'total_todi_cost', 'estimate_cost', 'depreciation', 'final_cost'].map(field => (
        <div key={field}>
          <label className="block font-medium capitalize">{field.replace(/_/g, ' ')}:</label>
          <input
            type={field === 'date' ? 'date' : 'text'}
            name={field}
            value={(todi as any)[field]}
            onChange={handleInput}
            className="w-full border p-2 rounded"
          />
        </div>
      ))}

      {/* Groups */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Groups</h2>
        {todi.group.map((group, gIdx) => (
          <div key={gIdx} className="border p-4 rounded space-y-2">
            {['g_hydra_cost', 'g_truck_cost', 'total_block_area', 'total_block_cost', 'remaining_amount'].map(name => (
              <div key={name}>
                <label className="block">{name}:</label>
                <input
                  type="text"
                  name={name}
                  value={(group as any)[name]}
                  onChange={(e) => handleNestedChange(e, gIdx)}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}

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
                    {[ 'l', 'b', 'h', 'block_area', 'block_cost'].map(name => (
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
                    ))}
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
