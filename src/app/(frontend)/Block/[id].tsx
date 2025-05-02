import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import payload from './lib/payload'

export default function EditBlock() {
  const router = useRouter()
  const { id } = router.query
  const [block, setBlock] = useState<any>({})

  useEffect(() => {
    if (id) {
      payload.get(`/Block/${id}`).then((res) => setBlock(res.data))
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBlock({ ...block, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await payload.patch(`/Block/${id}`, block)
    router.push('/block')
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">Edit Block</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="BlockType"
          value={block.BlockType || ''}
          onChange={handleChange}
          placeholder="Block Type"
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="qty"
          value={block.qty || ''}
          onChange={handleChange}
          placeholder="Quantity"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  )
}
