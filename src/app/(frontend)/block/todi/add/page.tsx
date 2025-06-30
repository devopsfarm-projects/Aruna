'use client'
import { useState } from 'react'
import { FormInput, FormSelect, FormDisplay } from '../../components/FormSection'
import { TodiState } from '../../components/type'
import { handleInput } from '../../components/calculatetodi'
import FetchVendor from '../../components/FetchVendor'
import Summary from '../../components/Summary'
import Group from '../../components/Grouptodi'
import router from 'next/router'
export default function AddTodiPage() {
  const [todi, setTodi] = useState<TodiState>({
    id: '',
    total_block_cost: '',
    total_block_area: '',
    total_todi_cost: '',
    total_todi_area: '',
    vender_id: '',
    munim: '',
    BlockType: '',
    date: new Date().toISOString(),
    l: '',
    b: '',
    h: '',
    gala_cost: '',
    hydra_cost: '',
    truck_cost: '',
    estimate_cost: '',
    depreciation: '',
    final_cost: '',
    todi_cost: '', 
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const validTodiTypes = ['Brown', 'White'];
    if (!validTodiTypes.includes(todi.BlockType)) {
      alert('Invalid Todi Type. Please select either "Brown" or "White"');
      return;
    }

    const formData = { ...todi };
    
    formData.id = Date.now().toString(); 
    
    formData.group = formData.group.map((group, groupIdx) => {
      return {
        ...group,
        id: `group_${groupIdx}_${Date.now()}`,
        block: group.block.map((block, blockIdx) => ({
          ...block,
          id: `block_${groupIdx}_${blockIdx}_${Date.now()}`,
          addmeasures: block.addmeasures.map((measure, measureIdx) => ({
            ...measure,
            id: `measure_${groupIdx}_${blockIdx}_${measureIdx}_${Date.now()}`
          }))
        }))
      };
    });
    
    formData.total_block_area = todi.total_block_area;
    formData.total_block_cost = todi.total_block_cost;
    
    formData.vender_id = todi.vender_id;
    formData.date = formData.date || new Date().toISOString();
    
    try {
      const res = await fetch('/api/Todi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create Todi');
      }

      setShowSuccessMessage(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred while creating Todi');
    }
  }


    if (showSuccessMessage) {
      return (
        <div className="fixed inset-0 dark:bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-xl font-bold">Success!</h2>
            </div>
            <p className="mb-4">Todi has been updated successfully.</p>
            <button
              onClick={() => {
                setShowSuccessMessage(false);
                router.push('/block/gala');
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )
    }
  


  return (
    <form onSubmit={handleSubmit} className=" max-w-7xl mx-auto p-6 py-4 space-y-6">
      <h1 className="text-xl font-bold">Add Todi</h1>

      <div className="px-4 py-6 bg-gray-50 dark:bg-black rounded-lg shadow-md max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <FormSelect label="Block Type:" id="BlockType" name="BlockType" value={todi.BlockType} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e, setTodi)}>
    <option value="">Select Type</option>
    <option value="White">White</option>
    <option value="Brown">Brown</option>
  </FormSelect>
<FetchVendor todi={todi} handleInput={handleInput} setTodi={setTodi} />
  <FormInput label="Munim:" id="munim" name="munim" value={todi.munim} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e, setTodi)} />
  <FormInput label="L (लम्बाई) - Length (m):" id="l" name="l" value={todi.l} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e, setTodi)} />
  <FormInput label="B (चौड़ाई) - Breadth (m):" id="b" name="b" value={todi.b} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e, setTodi)} />
  <FormInput label="H (ऊंचाई) - Height (m):" id="h" name="h" value={todi.h} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e, setTodi)} />
  <FormInput label="Todi Cost (₹):" id="todi_cost" name="todi_cost" value={todi.todi_cost ? Number(todi.todi_cost).toLocaleString('en-IN') : ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e, setTodi)} />
  <FormInput label="Hydra Cost (₹):" id="hydra_cost" name="hydra_cost" value={todi.hydra_cost} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e, setTodi)} />
  <FormInput label="Truck Cost (₹):" id="truck_cost" name="truck_cost" value={todi.truck_cost} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e, setTodi)} />
  <FormDisplay label="Total Todi Area (m³):" value={todi.total_todi_area} />
  <FormDisplay label="Total Todi Cost (₹):" value={todi.total_todi_cost} />
  <FormDisplay label="Estimate Cost (₹):" value={todi.estimate_cost} />
  <FormInput label="Depreciation (%):" id="depreciation" name="depreciation" value={todi.depreciation} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e, setTodi)} />
  <FormDisplay label="Final Cost (₹):" value={todi.final_cost} />
</div>


<Group todi={todi} setTodi={setTodi} />

<Summary 
  title="Summary"
  totalBlockArea={todi.total_block_area}
  totalBlockCost={todi.total_block_cost}
  remainingAmount={(parseFloat(todi.final_cost || '0') - parseFloat(todi.total_block_cost)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
/>

      <button type="submit" className="bg-green-600 text-white px-4 py-2  mt-6">Submit</button>
    </form>
  )
}


