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
    <div className="space-y-6">
      {/* Basic Block Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Basic Block Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Mine
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={block.mines || ''}
              onChange={(e) => onChange('mines', e.target.value)}
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
        </div>
      </div>

      {/* Block Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Block Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Total Quantity
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={block.total_quantity}
              onChange={(e) => onChange('total_quantity', Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Issued Quantity
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={block.issued_quantity}
              onChange={(e) => onChange('issued_quantity', Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Left Quantity
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={block.total_quantity - block.issued_quantity}
              readOnly
              disabled
            />
          </div>
        </div>
      </div>

      {/* Transport Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Transport Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Vehicle Number
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={block.vehicle_number}
              onChange={(e) => onChange('vehicle_number', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Vehicle Cost
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={block.vehicle_cost}
              onChange={(e) => onChange('vehicle_cost', Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Labour Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={block.labour_name}
              onChange={(e) => onChange('labour_name', e.target.value)}
              required
              />
          </div>
        </div>
      </div>
    </div>
  )
}