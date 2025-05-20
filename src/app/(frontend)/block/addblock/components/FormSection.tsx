import React from 'react'
import { Block, Vendor, Mines } from '../types'

interface FormSectionProps {
  block: Block
  vendors: Vendor[]
  mines: Mines[]
  onChange: (field: keyof Block, value: string | number) => void
}

export default function FormSection({ block, vendors, mines, onChange }: FormSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Block Type */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Block Type
        </label>
        <select
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={block.BlockType}
          onChange={(e) => onChange('BlockType', e.target.value)}
          required
        >
          <option value="">Select Type</option>
          <option value="Brown">Brown</option>
          <option value="White">White</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          type="date"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={block.date}
          onChange={(e) => onChange('date', e.target.value)}
          required
        />
      </div>

      {/* Vendor */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Vendor
        </label>
        <select
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={block.vender_id}
          onChange={(e) => onChange('vender_id', Number(e.target.value))}
          required
        >
          <option value="">Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.vendor} - {vendor.Company_no}
            </option>
          ))}
        </select>
      </div>

      {/* Mine */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Mine
        </label>
        <select
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={block.mines}
          onChange={(e) => onChange('mines', Number(e.target.value))}
          required
        >
          <option value="">Select Mine</option>
          {mines.map((mine) => (
            <option key={mine.id} value={mine.id}>
              {mine.Mines_name}
            </option>
          ))}
        </select>
      </div>

      {/* Transport Type */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Transport Type
        </label>
        <select
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={block.transportType}
          onChange={(e) => onChange('transportType', e.target.value)}
          required
        >
          <option value="Hydra">Hydra</option>
          <option value="Truck">Truck</option>
        </select>
      </div>

      {/* Party Advance Payment */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Advance Payment
        </label>
        <input
          type="number"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={block.partyAdvancePayment}
          onChange={(e) => onChange('partyAdvancePayment', Number(e.target.value))}
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Quantity
        </label>
        <input
          type="number"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={block.qty}
          onChange={(e) => onChange('qty', Number(e.target.value))}
          required
        />
      </div>
    </div>
  )
}
