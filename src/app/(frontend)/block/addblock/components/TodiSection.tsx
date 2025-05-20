import React from 'react'
import { Measure, Block } from '../types'

interface TodiSectionProps {
  todi: Block['todi'][0]
  todiIndex: number
  onRemove: () => void
  onMeasureChange: (measureIndex: number, field: keyof Measure, value: string | number) => void
  onCostChange: (value: string | number) => void
}

export default function TodiSection({
  todi,
  todiIndex,
  onRemove,
  onMeasureChange,
  onCostChange,
}: TodiSectionProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Todi {todiIndex + 1}</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Todi Cost
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={todi.todicost}
              onChange={(e) => onCostChange(e.target.value)}
              min="0"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {todi.addmeasures?.map((measure, measureIndex) => (
          <div key={measureIndex} className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Length (L)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={measure.l}
                  onChange={(e) => onMeasureChange(measureIndex, 'l', e.target.value)}
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Breadth (B)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={measure.b}
                  onChange={(e) => onMeasureChange(measureIndex, 'b', e.target.value)}
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Height (H)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={measure.h}
                  onChange={(e) => onMeasureChange(measureIndex, 'h', e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
          disabled={todiIndex === 0}
        >
          Remove Todi
        </button>
      </div>
    </div>
  )
}
