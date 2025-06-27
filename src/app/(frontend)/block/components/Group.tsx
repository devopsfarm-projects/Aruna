import { Block, TodiState } from './type'
import { calculateTotalBlockArea, calculateTotalBlockCost } from './calculate'
import { Group } from './type'
import { FormInput, FormDisplay } from './FormSection'

interface GroupProps {
  todi: TodiState
  setTodi: React.Dispatch<React.SetStateAction<TodiState>>
}

export default function Groupfunction({ todi, setTodi }: GroupProps) {

 const addGroup = (setTodi: React.Dispatch<React.SetStateAction<TodiState>>) => {
  return setTodi(prev => ({
    ...prev,
    group: [
      ...prev.group,
      {
        g_hydra_cost: '',
        g_truck_cost: '',
        total_block_area: '0',
        total_block_cost: '0',
        remaining_amount: '0',
        date: new Date().toISOString(),
        block: []
      }
    ]
  }))
}

 const addBlock = (setTodi: React.Dispatch<React.SetStateAction<TodiState>>, groupIndex: number) => {
  return setTodi(prev => {
    const updatedGroups = [...prev.group]
    updatedGroups[groupIndex].block.push({
      id: Date.now().toString(),
      addmeasures: []
    })
    return { ...prev, group: updatedGroups }
  })
}

     const addMeasure = (setTodi: React.Dispatch<React.SetStateAction<TodiState>>, groupIndex: number, blockIndex: number) => {
  return setTodi(prev => {
    const updatedGroups = [...prev.group]
    const newMeasure = {
      id: Date.now().toString(),
      l: '',
      b: '',
      h: '',
      block_area: '0',
      block_cost: '0'
    }
    updatedGroups[groupIndex].block[blockIndex].addmeasures = [...(updatedGroups[groupIndex].block[blockIndex].addmeasures || []), newMeasure]
    return {
      ...prev,
      group: updatedGroups,
      total_block_area: calculateTotalBlockArea(updatedGroups),
      total_block_cost: calculateTotalBlockCost(updatedGroups)
    }
  })
}

 const handleNestedChange = (
  setTodi: React.Dispatch<React.SetStateAction<TodiState>>,
  e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string },
  groupIdx: number,
  blockIdx?: number,
  measureIdx?: number
) => {
  const { name, value } = 'target' in e ? e.target : e
  setTodi(prev => {
    const updated = [...prev.group]

    try {
      if (blockIdx === undefined) {
        // Group level change (hydra cost, truck cost)
        const fieldName = name as keyof Group
        if (fieldName in updated[groupIdx]) {
          updated[groupIdx][fieldName] = value
        }
        
        // Recalculate block cost for all measures in this group
        updated[groupIdx].block.forEach((block: { addmeasures: any[] }, bIdx: any) => {
          block.addmeasures.forEach((measure: { block_area: string; block_cost: string }, mIdx: any) => {
            const blockArea = parseFloat(measure.block_area) || 0
            const truckCost = parseFloat(updated[groupIdx].g_truck_cost) || 0
            const hydraCost = parseFloat(updated[groupIdx].g_hydra_cost) || 0
            const galaCost = parseFloat(prev.gala_cost) || 0
            const blockCost = (truckCost + hydraCost + galaCost) * blockArea
            measure.block_cost = blockCost.toFixed(2)
          })
        })
      } else if (measureIdx === undefined) {
        // Block level change
        const validName = name as keyof Block
        ;(updated[groupIdx].block[blockIdx] as any)[validName] = value
      } else {
        const measure = updated[groupIdx].block[blockIdx].addmeasures[measureIdx]
        const validName = name as keyof typeof measure
        ;(measure as any)[validName] = value

        // Recalculate block area if L, B, or H changed
        if (name === 'l' || name === 'b' || name === 'h') {
          const l = parseFloat(measure.l) || 0
          const b = parseFloat(measure.b) || 0
          const h = parseFloat(measure.h) || 0
          const blockArea = l * b * h
          measure.block_area = blockArea.toFixed(2)

          // Recalculate block cost with new area
          const truckCost = parseFloat(updated[groupIdx].g_truck_cost) || 0
          const hydraCost = parseFloat(updated[groupIdx].g_hydra_cost) || 0
          const galaCost = parseFloat(prev.gala_cost) || 0
          const blockCost = (truckCost + hydraCost + galaCost) * blockArea
          measure.block_cost = blockCost.toFixed(2)
        }
      }

      return { ...prev, group: updated }
    } catch (error) {
      console.error('Error in handleNestedChange:', error)
      return prev
    }
  })
}




    return(
           <div className="space-y-6">
       <h2 className="text-xl font-bold text-gray-800 dark:text-white">Groups</h2>
     
       {todi.group.map((group, gIdx) => (
         <div key={gIdx} className="border rounded-lg p-4 bg-white dark:bg-gray-800 space-y-4 shadow-sm">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <FormInput label="Hydra Cost (₹)"
               id={`g_hydra_cost-${gIdx}`}
               name="g_hydra_cost"
               value={group.g_hydra_cost}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                 handleNestedChange(setTodi, e, gIdx);
                 const blockArea = parseFloat(group.block[0]?.addmeasures[0]?.block_area) || 0;
                 const truckCost = parseFloat(group.g_truck_cost) || 0;
                 const hydraCost = parseFloat(e.target.value) || 0;
                 const todiCost = parseFloat(todi.gala_cost) || 0;
                 const blockCost = (truckCost + hydraCost + todiCost) * blockArea;
                 handleNestedChange(setTodi, { name: 'block_cost', value: blockCost.toFixed(2) }, gIdx, 0, 0);
               }}
             />
             <FormInput label="Truck Cost (₹)"
               id={`g_truck_cost-${gIdx}`}
               name="g_truck_cost"
               value={group.g_truck_cost}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                 handleNestedChange(setTodi, e, gIdx);
                 const blockArea = parseFloat(group.block[0]?.addmeasures[0]?.block_area) || 0;
                 const truckCost = parseFloat(e.target.value) || 0;
                 const hydraCost = parseFloat(group.g_hydra_cost) || 0;
                 const todiCost = parseFloat(todi.gala_cost) || 0;
                 const blockCost = (truckCost + hydraCost + todiCost) * blockArea;
                 handleNestedChange(setTodi, { name: 'block_cost', value: blockCost.toFixed(2) }, gIdx, 0, 0);
               }}
             />
             <FormInput label="Date"
               id={`date-${gIdx}`}
               name="date"
               type="date"
               value={group.date}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNestedChange(setTodi, e, gIdx)}
             />
           </div>
     
           <button
             type="button"
             onClick={() => addBlock(setTodi, gIdx)}
             className="text-sm text-blue-600 font-medium hover:underline"
           >
             + Add Block
           </button>
     
           {group.block.map((block, bIdx) => (
             <div key={bIdx} className="ml-2 border-l-4 border-indigo-500 pl-4 mt-4 space-y-4">
     
               <button
                 type="button"
                 onClick={() => addMeasure(setTodi, gIdx, bIdx)}
                 className="text-sm text-green-600 font-medium hover:underline"
               >
                 + Add Measure
               </button>
     
               {block.addmeasures.map((m, mIdx) => (
                 <div key={mIdx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
     
                   <FormInput label="Length (L - लम्बाई) [m]"
                     name="l"
                     value={m.l}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                       handleNestedChange(setTodi, e, gIdx, bIdx, mIdx);
                       const l = parseFloat(e.target.value) || 0;
                       const b = parseFloat(m.b) || 0;
                       const h = parseFloat(m.h) || 0;
                       const blockArea = (l * b * h) / 144;
                       handleNestedChange(setTodi, { name: 'block_area', value: blockArea.toFixed(2) }, gIdx, bIdx, mIdx);
                     }}
                   />
     
                   <FormInput label="Breadth (B - चौड़ाई) [m]"
                     name="b"
                     value={m.b}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                       handleNestedChange(setTodi, e, gIdx, bIdx, mIdx);
                       const l = parseFloat(m.l) || 0;
                       const b = parseFloat(e.target.value) || 0;
                       const h = parseFloat(m.h) || 0;
                       const blockArea = (l * b * h) / 144;
                       handleNestedChange(setTodi, { name: 'block_area', value: blockArea.toFixed(2) }, gIdx, bIdx, mIdx);
                     }}
                   />
     
                   <FormInput label="Height (H - ऊंचाई) [m]"
                     name="h"
                     value={m.h}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                       handleNestedChange(setTodi, e, gIdx, bIdx, mIdx);
                       const l = parseFloat(m.l) || 0;
                       const b = parseFloat(m.b) || 0;
                       const h = parseFloat(e.target.value) || 0;
                       const blockArea = (l * b * h) / 144;
                       handleNestedChange(setTodi, { name: 'block_area', value: blockArea.toFixed(2) }, gIdx, bIdx, mIdx);
                     }}
                   />
     
                   <FormDisplay label="Block Area (m³)" value={m.block_area} />
                   <FormDisplay label="Block Cost (₹)" value={Number(m.block_cost)?.toLocaleString('en-IN') || '0'} />
                 </div>
               ))}
             </div>
           ))}
         </div>
       ))}
     
       {/* Add Group Button */}
       <button
         type="button"
         onClick={(e) => addGroup(setTodi)}
         className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
       >
         + Add Group
       </button>
     </div>   
    )
}