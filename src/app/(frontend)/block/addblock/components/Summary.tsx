import React from 'react'
import { Block } from '../types'

interface SummaryProps {
  block: Block
}

export default function Summary({ block }: SummaryProps) {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto sm:max-w-xl md:max-w-3xl">
      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 text-center sm:text-left">
        <span className="text-indigo-600 dark:text-indigo-400">Summary</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Quantity Card */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md flex flex-col items-center sm:items-start">
          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Total Quantity
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {block.total_quantity.toFixed(2)}
          </div>
        </div>

        {/* Issued Quantity Card */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md flex flex-col items-center sm:items-start">
          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Issued Quantity
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {block.issued_quantity.toFixed(2)}
          </div>
        </div>

        {/* Remaining Quantity Card */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md flex flex-col items-center sm:items-start">
          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Remaining Quantity
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {(block.total_quantity - block.issued_quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </section>
  )
}
