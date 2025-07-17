'use client'
import { BlockType, Vendor } from '../../block/todi/edit/types'
import { useState } from 'react'
import { useEffect } from 'react'
import EditGroup from './EditGroup';

interface EditGroupProps {
  currentBlock: BlockType | null;
  newBlock: BlockType | null;
  setNewBlock: React.Dispatch<React.SetStateAction<BlockType | null>>;
  handleNestedChange: (e: React.ChangeEvent<HTMLInputElement>, field: string, gIdx: number, bIdx?: number, mIdx?: number) => void;
  addGroup: () => void;
  addBlock: (gIdx: number) => void;
  addMeasure: (gIdx: number, bIdx: number) => void;
  removeGroup: (gIdx: number) => void;
  removeBlock: (gIdx: number, bIdx: number) => void;
  removeMeasure: (gIdx: number, bIdx: number, mIdx: number) => void;
}

export default function EditGroupContainer() {

    const [currentBlock, setCurrentBlock] = useState<BlockType | null>(null)
    const [newBlock, setNewBlock] = useState<BlockType | null>(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [munims, setMunims] = useState<string[]>([])
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingData, setLoadingData] = useState(true)
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    // Update currentBlock when newBlock changes
    useEffect(() => {
      if (newBlock) {
        setCurrentBlock(newBlock)
      }
    }, [newBlock])

    const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, name: string, gIdx: number, bIdx?: number, mIdx?: number) => {
      e.preventDefault();
      const value = e.target.value;
      
      // Update the block state
      setNewBlock((prev) => {
        if (!prev) return prev;
        
        // Create a deep copy of the block to avoid mutating the original state
        const updatedBlock = JSON.parse(JSON.stringify(prev));
        
        // Update the nested property
        if (bIdx !== undefined && mIdx !== undefined) {
          updatedBlock.group[gIdx].block[bIdx].addmeasures[mIdx][name] = value;
        } else if (bIdx !== undefined) {
          updatedBlock.group[gIdx].block[bIdx][name] = value;
        } else {
          updatedBlock.group[gIdx][name] = value;
        }
        
        return updatedBlock;
      });
    };




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
    


    return (
        <div>
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
              e.preventDefault(); // Prevent form submission
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
          value={group.date? new Date(group.date).toISOString().split('T')[0] : ''}
          onChange={(e) => {
            e.preventDefault(); 
            handleNestedChange(e, 'date', gIdx)
          }}
          className="w-full p-2 border dark:bg-gray-700"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <button onClick={(e) => {
          e.preventDefault(); 
          addBlock(gIdx)
        }} className="text-sm text-blue-600">+ Add Block</button>
        <button 
          onClick={(e) => {
            e.preventDefault(); 
            removeGroup(gIdx)
          }} 
          className="text-sm text-red-600 hover:text-red-800"
        >
          × Remove Group
        </button>
      </div>

      {/* Blocks */}
      {group.block.map((block, bIdx) => (
        <div key={bIdx} className="ml-4 mt-2 border p-3 bg-white dark:bg-gray-800 rounded-md relative">
          <div className="flex justify-between items-center mb-4">
            <button onClick={(e) => {
              e.preventDefault(); 
              addMeasure(gIdx, bIdx)
            }} className="text-sm text-green-600">+ Add Measure</button>
            <button 
              onClick={() => removeBlock(gIdx, bIdx)} 
              className="text-sm text-red-600 hover:text-red-800"
            >
              × Remove Block
            </button>
          </div>


          {/* Measures */}
          {block.addmeasures.map((m, mIdx) => (
            <div key={mIdx} className="mt-4 space-y-2 border p-3 bg-gray-100 dark:bg-gray-700 rounded-md relative">
              {[
                { label: 'L (लम्बाई)', name: 'l', value: m.l },
                { label: 'B (चौड़ाई)', name: 'b', value: m.b },
                { label: 'H (ऊंचाई)', name: 'h', value: m.h },
                { label: 'Block Area', name: 'block_area', value: m.block_area },
                { label: 'Block Cost', name: 'block_cost', value: m.block_cost },
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
                      const area = (l * b * h) / 144
                      handleNestedChange({ target: { name: 'block_area', value: area.toFixed(2) } } as any, 'block_area', gIdx, bIdx, mIdx)
                      
                      // Calculate group total area and cost
                      const groupTotalArea = group.block?.reduce((sum, block) => {
                        return sum + block.addmeasures.reduce((areaSum, measure) => {
                          return areaSum + (parseFloat(measure.block_area) || 0)
                        }, 0)
                      }, 0) || 0

                      const truck = parseFloat(group.g_truck_cost || '0') || 0
                      const hydra = parseFloat(group.g_hydra_cost || '0') || 0
                      const todi = parseFloat(newBlock?.todi_cost || '0') || 0
                      
                      // Update group total cost
                      const groupTotalCost = groupTotalArea * (truck + hydra + todi)
                      console.log(groupTotalCost)
                      // Update block costs in the group
                      group.block?.forEach((block, blockIdx) => {
                        // Calculate individual block area
                        const blockArea = block.addmeasures.reduce((sum, measure) => 
                          sum + (parseFloat(measure.block_area) || 0), 0)
                        
                        // Calculate individual block cost
                        const blockCost = blockArea * (truck + hydra + todi)
                        
                        // Update the block cost
                        if (!isNaN(blockCost)) {
                          handleNestedChange({ 
                            target: { 
                              name: 'block_cost', 
                              value: blockCost.toFixed(2)
                            } 
                          } as any, 'block_cost', gIdx, blockIdx, 0)
                        }
                      })

                      // Update total block area and cost
                      const totalBlockArea = currentBlock?.group?.reduce((sum, g) => {
                        return sum + (g.block?.reduce((areaSum, block) => {
                          return areaSum + block.addmeasures.reduce((measureSum, measure) => 
                            measureSum + (parseFloat(measure.block_area) || 0), 0)
                        }, 0) || 0)
                      }, 0) || 0

                      // Calculate total cost using individual block costs
                      const totalBlockCost = group.block?.reduce((sum, block) => {
                        const blockArea = block.addmeasures.reduce((sum, measure) => 
                          sum + (parseFloat(measure.block_area) || 0), 0)
                        return sum + (blockArea * (truck + hydra + todi))
                      }, 0) || 0
                      
                      // Update the state
                      setNewBlock((prev) => {
                        if (!prev) return prev
                        return {
                          ...prev,
                          total_block_area: totalBlockArea.toString(),
                          total_block_cost: totalBlockCost.toString()
                        }
                      })
                    }}
                    className="w-full p-2 border dark:bg-gray-600"
                  />
                </div>
              ))}
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
        </div>
    )
}