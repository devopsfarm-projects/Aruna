import React from 'react'
import { Measure, Block } from '../types'

interface TodiSectionProps {
  blocks: Block['block']
  onRemove: (index: number) => void
  onMeasureChange: (
    todiIndex: number,
    measureIndex: number,
    field: keyof Measure | 'add',
    value: string | number,
  ) => void
  onMeasureRemove: (todiIndex: number, measureIndex: number) => void
  onAddNewTodi: () => void
}

export default function TodiSection({
  blocks,
  onRemove,
  onMeasureChange,
  onMeasureRemove,
  onAddNewTodi,
}: TodiSectionProps) {
  return (
    <div className="space-y-6">
      {blocks?.map((todi, blockIndex) => (
        <div key={blockIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              block {blockIndex + 1}
            </h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  <span className="text-indigo-600 dark:text-indigo-400">Measurements</span>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    onMeasureChange(blockIndex, 0, 'add', 0)
                  }}
                  className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                >
                  <span className="font-medium">Add Measurement</span>
                </button>
              </div>

              {todi.addmeasures?.map((measure, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      L
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={measure.l}
                      onChange={(e) => onMeasureChange(blockIndex, index, 'l', e.target.value)}
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      B
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={measure.b}
                      onChange={(e) => onMeasureChange(blockIndex, index, 'b', e.target.value)}
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      H
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={measure.h}
                      onChange={(e) => onMeasureChange(blockIndex, index, 'h', e.target.value)}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    black_area
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={measure.black_area}
                      onChange={(e) => onMeasureChange(blockIndex, index, 'black_area', e.target.value)}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    black_cost
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={measure.black_cost}
                      onChange={(e) => onMeasureChange(blockIndex, index, 'black_cost', e.target.value)}
                      min="0"
                      required
                    />
                  </div>
 
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onMeasureRemove(blockIndex, index)
                      }}
                      className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
                      disabled={blocks[blockIndex].addmeasures.length === 1}
                    >
                      <span className="font-medium">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex mt-2 items-end justify-end">
            <button
              type="button"
              onClick={() => onRemove(blockIndex)}
              className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
              disabled={blocks[blockIndex].addmeasures.length === 1}
            >
              Remove block
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onAddNewTodi}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
        >
          Add New Block
        </button>
      </div>
    </div>
  )
}


