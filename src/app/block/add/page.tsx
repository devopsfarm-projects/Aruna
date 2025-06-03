import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Block {
  id?: number
  BlockType: string
  date: string
  vender_id?: number
  vender?: {
    name: string
  }
  munim: number
  cost: number
  front_length: number
  back_length: number
  breadth: number
  height: number
  total_area: number
  todicost: number
  block: {
    blockcost: number
    addmeasures: {
      l: number
      b: number
      h: number
      black_area: number
      black_cost: number
    }[]
  }[]
  qty: number
  issued_quantity?: string
  left_quantity?: string
  partyAdvancePayment?: string
  partyRemainingPayment?: number
  transportType?: string
  final_total: number
  total_quantity: number
}

interface Vendor {
  id: number
  name: string
}

export default function AddBlockPage() {
  const [newBlock, setNewBlock] = useState<Block>({
    BlockType: '',
    date: new Date().toISOString().split('T')[0],
    vender_id: null,
    munim: 0,
    cost: 0,
    front_length: 0,
    back_length: 0,
    breadth: 0,
    height: 0,
    total_area: 0,
    todicost: 0,
    block: [],
    qty: 0,
    final_total: 0,
    total_quantity: 0
  })

  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const response = await axios.get('/api/vendor')
      setVendors(response.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const handleChange = (field: keyof Block, value: any) => {
    setNewBlock((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBlockChange = (index: number, field: keyof Block['block'][0], value: any) => {
    setNewBlock((prev) => {
      const newBlocks = [...prev.block]
      newBlocks[index][field] = value
      return { ...prev, block: newBlocks }
    })
  }

  const addBlock = () => {
    setNewBlock((prev) => ({
      ...prev,
      block: [...prev.block, {
        blockcost: 0,
        addmeasures: [{
          l: 0,
          b: 0,
          h: 0,
          black_area: 0,
          black_cost: 0
        }]
      }]
    }))
  }

  const removeBlock = (index: number) => {
    setNewBlock((prev) => {
      const newBlocks = [...prev.block]
      newBlocks.splice(index, 1)
      return { ...prev, block: newBlocks }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const blockToSubmit = {
        ...newBlock,
        total_quantity: newBlock.total_quantity,
        final_total: newBlock.final_total,
        partyRemainingPayment: newBlock.partyRemainingPayment,
        createdBy: (() => {
          const userStr = localStorage.getItem('user')
          if (!userStr) return ''
          try {
            const user = JSON.parse(userStr)
            return typeof user === 'object' && user !== null && 'id' in user ? user.id : ''
          } catch {
            return ''
          }
        })(),
        vender_id: newBlock.vender_id ? Number(newBlock.vender_id) : null,
        block: newBlock.block?.map((b) => ({
          blockcost: Number(b.blockcost),
          addmeasures: b.addmeasures?.map((m) => ({
            l: Number(m.l),
            b: Number(m.b),
            h: Number(m.h),
            black_area: Number(m.black_area),
            black_cost: Number(m.black_cost),
          })) || [],
        })) || [],
        qty: Number(newBlock.qty),
        issued_quantity: newBlock.issued_quantity
          ? Number(newBlock.issued_quantity).toString()
          : '',
        left_quantity: newBlock.left_quantity ? Number(newBlock.left_quantity).toString() : '',
        partyAdvancePayment: newBlock.partyAdvancePayment
          ? Number(newBlock.partyAdvancePayment).toString()
          : '',
        transportType: newBlock.transportType || 'Hydra',
      }

      const response = await axios.post('/api/Block', blockToSubmit, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        alert('Block added successfully!')
        router.push('/block')
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          alert('Validation error: ' + error.response?.data?.message)
        } else {
          alert('Error: ' + error.message)
        }
      } else {
        alert('An unexpected error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Block</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Block Type</label>
            <input
              type="text"
              value={newBlock.BlockType}
              onChange={(e) => handleChange('BlockType', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={newBlock.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor</label>
            <select
              value={newBlock.vender_id || ''}
              onChange={(e) => handleChange('vender_id', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Munim</label>
            <input
              type="number"
              value={newBlock.munim}
              onChange={(e) => handleChange('munim', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Block Details</h2>
          {newBlock.block.map((block, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Block Cost</label>
                  <input
                    type="number"
                    value={block.blockcost}
                    onChange={(e) => handleBlockChange(index, 'blockcost', Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    className="mt-1 text-red-600 hover:text-red-800"
                  >
                    Remove Block
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-4 mb-2">Additional Measures</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Length</label>
                  <input
                    type="number"
                    value={block.addmeasures[0].l}
                    onChange={(e) => handleBlockChange(index, 'addmeasures', [
                      { ...block.addmeasures[0], l: Number(e.target.value) }
                    ])}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Breadth</label>
                  <input
                    type="number"
                    value={block.addmeasures[0].b}
                    onChange={(e) => handleBlockChange(index, 'addmeasures', [
                      { ...block.addmeasures[0], b: Number(e.target.value) }
                    ])}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Height</label>
                  <input
                    type="number"
                    value={block.addmeasures[0].h}
                    onChange={(e) => handleBlockChange(index, 'addmeasures', [
                      { ...block.addmeasures[0], h: Number(e.target.value) }
                    ])}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addBlock}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Block
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={newBlock.qty}
              onChange={(e) => handleChange('qty', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Quantity</label>
            <input
              type="number"
              value={newBlock.total_quantity}
              onChange={(e) => handleChange('total_quantity', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Submitting...' : 'Add Block'}
          </button>
        </div>
      </form>
    </div>
  )
}
