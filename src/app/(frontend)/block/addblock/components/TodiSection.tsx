import React from 'react'
import { Measure, Block } from '../types'

interface TodiSectionProps {
  todis: Block['todi']
  onRemove: (index: number) => void
  onMeasureChange: (
    todiIndex: number,
    measureIndex: number,
    field: keyof Measure | 'add',
    value: string | number,
  ) => void
  onMeasureRemove: (todiIndex: number, measureIndex: number) => void
  onCostChange: (todiIndex: number, value: string | number) => void
  onAddNewTodi: () => void
}

export default function TodiSection({
  todis,
  onRemove,
  onMeasureChange,
  onMeasureRemove,
  onCostChange,
  onAddNewTodi,
}: TodiSectionProps) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6">
      {todis.map((todi, todiIndex) => (
        <div
          key={todiIndex}
          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md"
        >
          {/* Header: Todi Title + Cost */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Todi {todiIndex + 1}
            </h3>

            <div className="w-full sm:w-48">
              <label
                htmlFor={`todicost-${todiIndex}`}
                className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
              >
                Todi Cost
              </label>
              <input
                id={`todicost-${todiIndex}`}
                type="number"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={todi.todicost}
                onChange={(e) => onCostChange(todiIndex, e.target.value)}
                min={0}
                required
              />
            </div>
          </div>

          {/* Measurements Section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-5 shadow-inner">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                <span className="text-indigo-600 dark:text-indigo-400">
                  Measurements
                </span>
              </h4>
              <button
                type="button"
                onClick={() => onMeasureChange(todiIndex, 0, 'add', 0)}
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
              >
                Add Measurement
              </button>
            </div>

            <div className="space-y-4">
              {todi.addmeasures?.map((measure, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg items-end"
                >
                  {/* L Input */}
                  <div>
                    <label
                      htmlFor={`l-${todiIndex}-${index}`}
                      className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                      L
                    </label>
                    <input
                      id={`l-${todiIndex}-${index}`}
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={measure.l}
                      onChange={(e) =>
                        onMeasureChange(todiIndex, index, 'l', e.target.value)
                      }
                      min={0}
                      required
                    />
                  </div>

                  {/* B Input */}
                  <div>
                    <label
                      htmlFor={`b-${todiIndex}-${index}`}
                      className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                      B
                    </label>
                    <input
                      id={`b-${todiIndex}-${index}`}
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={measure.b}
                      onChange={(e) =>
                        onMeasureChange(todiIndex, index, 'b', e.target.value)
                      }
                      min={0}
                      required
                    />
                  </div>

                  {/* H Input */}
                  <div>
                    <label
                      htmlFor={`h-${todiIndex}-${index}`}
                      className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                      H
                    </label>
                    <input
                      id={`h-${todiIndex}-${index}`}
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={measure.h}
                      onChange={(e) =>
                        onMeasureChange(todiIndex, index, 'h', e.target.value)
                      }
                      min={0}
                      required
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onMeasureRemove(todiIndex, index)}
                      disabled={todis[todiIndex].addmeasures.length === 1}
                      className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
                        todis[todiIndex].addmeasures.length === 1
                          ? 'bg-red-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remove Todi Button */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => onRemove(todiIndex)}
              disabled={todis.length === 1}
              className={`px-5 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
                todis.length === 1
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
              }`}
            >
              Remove Todi
            </button>
          </div>
        </div>
      ))}

      {/* Add New Todi Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onAddNewTodi}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
        >
          Add New Todi
        </button>
      </div>
    </div>
  )
}
