import React from 'react'
import { Block, Vendor } from '../types'

interface FormSectionProps {
  block: Block
  vendors: Vendor[]
  onChange: (field: keyof Block, value: string | number) => void
}

export default function FormSection({ block, vendors, onChange }: FormSectionProps) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Basic Block Information */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Basic Block Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="blockType" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Block Type
            </label>
            <select
              id="blockType"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
            <label htmlFor="date" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              id="date"
              type="date"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={block.date}
              onChange={(e) => onChange('date', e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="vendor" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Vendor
            </label>
            <select
              id="vendor"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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

        </div>
      </section>

      {/* Block Details */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Block Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label htmlFor="totalQuantity" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Total Quantity
            </label>
            <input
              id="totalQuantity"
              type="number"
              min={0}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={block.total_quantity}
              onChange={(e) => onChange('total_quantity', Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label htmlFor="issuedQuantity" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Issued Quantity
            </label>
            <input
              id="issuedQuantity"
              type="number"
              min={0}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={block.issued_quantity}
              onChange={(e) => onChange('issued_quantity', Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label htmlFor="leftQuantity" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Left Quantity
            </label>
            <input
              id="leftQuantity"
              type="number"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
              value={block.total_quantity - block.issued_quantity}
              readOnly
              disabled
            />
          </div>
        </div>
      </section>

      {/* Transport Details */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Transport Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="transportType" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Transport Type
            </label>
            <select
              id="transportType"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={block.transportType}
              onChange={(e) => onChange('transportType', e.target.value)}
              required
            >
              <option value="Hydra">Hydra</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          <div>
            <label htmlFor="vehicleNumber" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Vehicle Number
            </label>
            <input
              id="vehicleNumber"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={block.vehicle_number}
              onChange={(e) => onChange('vehicle_number', e.target.value)}
              required
            />
          </div>

 

          <div>
            <label htmlFor="labourName" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Labour Name
            </label>
            <input
              id="labourName"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={block.labour_name}
              onChange={(e) => onChange('labour_name', e.target.value)}
              required
            />
          </div>
        </div>
      </section>
    </div>
  )
}
