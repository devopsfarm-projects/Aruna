import React from 'react'
import { Block } from '../types'

interface SummaryProps {
  block: Block
}

export default function Summary({ block }: SummaryProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        <span className="text-indigo-600 dark:text-indigo-400">Summary</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Quantity
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {block.total_quantity.toFixed(2)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Issued Quantity
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {block.issued_quantity.toFixed(2)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Left Quantity
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {block.left_quantity.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}
