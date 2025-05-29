import { useState } from 'react'
import { Stone, Block } from '../../../payload-types'

interface StoneListProps {
  initialStones: Stone[]
  initialBlocks: Block[]
}

export default function StoneList({ initialStones, initialBlocks }: StoneListProps) {
  const [stones, ] = useState(initialStones)
  const [blocks, ] = useState(initialBlocks)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stones Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Stones</h2>
          <div className="space-y-4">
            {stones.map((stone) => (
              <div key={stone.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{stone.stoneType}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {stone.total_quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    View
                  </button>
                  <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blocks Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blocks</h2>
          <div className="space-y-4">
            {blocks.map((block) => (
              <div key={block.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{block.BlockType}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {block.total_quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    View
                  </button>
                  <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
