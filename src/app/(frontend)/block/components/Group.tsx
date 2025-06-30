import { Block, GalaState } from './type'
import { calculateTotalBlockArea, calculateTotalBlockCost } from './calculate'
import { Group } from './type'

interface GroupProps {
  todi: GalaState
  setTodi: React.Dispatch<React.SetStateAction<GalaState>>
}

export default function Groupfunction({ todi, setTodi }: GroupProps) {
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
          date: new Date().toISOString().split('T')[0],
          block: []
        }
      ]
    }))
  }

  const removeGroup = (groupIdx: number) => {
    const updatedGroups = [...todi.group]
    updatedGroups.splice(groupIdx, 1)
    setTodi({ ...todi, group: updatedGroups })
  }

  const addBlock = (groupIndex: number) => {
    const updatedGroups = [...todi.group]
    updatedGroups[groupIndex].block.push({
      id: '',
      addmeasures: []
    })
    setTodi({ ...todi, group: updatedGroups })
  }

  const removeBlock = (groupIndex: number, blockIndex: number) => {
    const updatedGroups = [...todi.group]
    updatedGroups[groupIndex].block.splice(blockIndex, 1)
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
    }
    setTodi(updatedTodi)
  }

  const removeMeasure = (groupIdx: number, blockIdx: number, measureIdx: number) => {
    const updatedGroups = [...todi.group]
    updatedGroups[groupIdx].block[blockIdx].addmeasures.splice(measureIdx, 1)
    const updatedTodi = {
      ...todi,
      group: updatedGroups,
      total_block_area: calculateTotalBlockArea(updatedGroups),
      total_block_cost: calculateTotalBlockCost(updatedGroups)
    }
    setTodi(updatedTodi)
  }

  const handleNestedChange = (e: any, groupIdx: number, blockIdx?: number, measureIdx?: number) => {
    const { name, value } = e.target
    const updated = [...todi.group]

    if (blockIdx === undefined) {
      const fieldName = name as keyof Group
      updated[groupIdx][fieldName] = value

      updated[groupIdx].block.forEach(block => {
        block.addmeasures.forEach(measure => {
          const blockArea = parseFloat(measure.block_area) || 0
          const truckCost = parseFloat(updated[groupIdx].g_truck_cost) || 0
          const hydraCost = parseFloat(updated[groupIdx].g_hydra_cost) || 0
          const galaCost = parseFloat(todi.gala_cost) || 0
          const blockCost = (truckCost + hydraCost + galaCost) * blockArea
          measure.block_cost = blockCost.toFixed(2)
        })
      })
    } else if (measureIdx === undefined) {
      const validName = name as keyof Block
      updated[groupIdx].block[blockIdx][validName] = value
    } else {
      const measure = updated[groupIdx].block[blockIdx].addmeasures[measureIdx]
      const validName = name as keyof typeof measure
      measure[validName] = value

      if (name === 'l' || name === 'b' || name === 'h') {
        const l = parseFloat(measure.l) || 0
        const b = parseFloat(measure.b) || 0
        const h = parseFloat(measure.h) || 0
        const blockArea = (l * b * h) / 144
        measure.block_area = blockArea.toFixed(2)

        const truckCost = parseFloat(updated[groupIdx].g_truck_cost) || 0
        const hydraCost = parseFloat(updated[groupIdx].g_hydra_cost) || 0
        const galaCost = parseFloat(todi.gala_cost) || 0
        const blockCost = (truckCost + hydraCost + galaCost) * blockArea
        measure.block_cost = blockCost.toFixed(2)
      }
    }

    setTodi(prev => ({ ...prev, group: updated }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Groups</h2>

      {todi.group.map((group, gIdx) => (
        <div key={gIdx} className="border p-4 space-y-2 relative">
          {/* Remove Group Button */}
          <button
            type="button"
            onClick={() => removeGroup(gIdx)}
            className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-700 rounded-full w-6 h-6 flex items-center justify-center"
            title="Remove Group"
          >
            ×
          </button>

          {/* Group Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Hydra Cost (₹)</label>
              <input
                type="text"
                name="g_hydra_cost"
                value={group.g_hydra_cost}
                onChange={(e) => handleNestedChange(e, gIdx)}
                className="p-2 border dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Truck Cost (₹)</label>
              <input
                type="text"
                name="g_truck_cost"
                value={group.g_truck_cost}
                onChange={(e) => handleNestedChange(e, gIdx)}
                className="p-2 border dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={group.date}
                onChange={(e) => handleNestedChange(e, gIdx)}
                className="p-2 border dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
          </div>

          <button type="button" onClick={() => addBlock(gIdx)} className="text-sm text-blue-600 mt-2">
            + Add Block
          </button>

          {group.block.map((block, bIdx) => (
            <div key={bIdx} className="ml-4 mt-2 border p-3 relative">
              {/* Remove Block Button */}
              <button
                type="button"
                onClick={() => removeBlock(gIdx, bIdx)}
                className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-700 rounded-full w-6 h-6 flex items-center justify-center"
                title="Remove Block"
              >
                ×
              </button>

              <button type="button" onClick={() => addMeasure(gIdx, bIdx)} className="text-sm text-green-600 mt-2">
                + Add Measure
              </button>

              {block.addmeasures.map((m, mIdx) => (
                <div
                  key={mIdx}
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border border-gray-300 rounded-lg p-4 relative"
                >
                  {/* Remove Measure Button */}
                  <button
                    type="button"
                    onClick={() => removeMeasure(gIdx, bIdx, mIdx)}
                    className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-700 rounded-full w-6 h-6 flex items-center justify-center"
                    title="Remove Measure"
                  >
                    ×
                  </button>

                  {/* Length */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Length (L)</label>
                    <input
                      type="text"
                      name="l"
                      value={m.l}
                      onChange={(e) => handleNestedChange(e, gIdx, bIdx, mIdx)}
                      className="p-2 border dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>

                  {/* Breadth */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Breadth (B)</label>
                    <input
                      type="text"
                      name="b"
                      value={m.b}
                      onChange={(e) => handleNestedChange(e, gIdx, bIdx, mIdx)}
                      className="p-2 border dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>

                  {/* Height */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Height (H)</label>
                    <input
                      type="text"
                      name="h"
                      value={m.h}
                      onChange={(e) => handleNestedChange(e, gIdx, bIdx, mIdx)}
                      className="p-2 border dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>

                  {/* Block Area */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Block Area (m³)</label>
                    <input
                      type="text"
                      name="block_area"
                      value={m.block_area}
                      disabled
                      className="p-2 border dark:bg-gray-700 dark:text-white rounded-md bg-gray-100 text-gray-600"
                    />
                  </div>

                  {/* Block Cost */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Block Cost (₹)</label>
                    <input
                      type="text"
                      name="block_cost"
                      value={Number(m.block_cost)?.toLocaleString('en-IN') || '0'}
                      disabled
                      className="p-2 border dark:bg-gray-700 dark:text-white rounded-md bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      <button type="button" onClick={addGroup} className="bg-blue-600 text-white px-4 py-2 rounded-md">
        + Add Group
      </button>
    </div>
  )
}
