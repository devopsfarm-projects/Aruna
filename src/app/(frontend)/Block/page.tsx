"use client"
import { useEffect, useState } from 'react'
import payload from './lib/payload'
import Link from 'next/link'

export default function BlockList() {
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    payload.get('/Block').then((res) => {
      setBlocks(res.data.docs)
    })
  }, [])

  const deleteBlock = async (id: string) => {
    await payload.delete(`/Block/${id}`)
    setBlocks((prev) => prev.filter((b: any) => b.id !== id))
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Block Records</h1>
      <div className="space-y-4">
        {blocks.map((block: any) => (
          <div key={block.id} className="p-4 border rounded-lg shadow flex justify-between items-center">
            <div>
              <p><strong>Block Type:</strong> {block.BlockType}</p>
              <p><strong>Quantity:</strong> {block.qty}</p>
            </div>
            <div className="space-x-2">
              <Link href={`/block/${block.id}`} className="bg-blue-500 text-white px-4 py-1 rounded">Edit</Link>
              <button onClick={() => deleteBlock(block.id)} className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
