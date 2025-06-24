// components/TodiList.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Vendor, Todi } from '@/payload-types'

interface TodiListProps {
  initialTodis: Todi[]
  initialVendors: Vendor[]
  initialVendorId: string | null
}

export default function TodiList({
  initialTodis,
  initialVendors,
  initialVendorId,
}: TodiListProps) {
  const [todis, setTodis] = useState<Todi[]>(initialTodis)
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors)
  const [selectedVendor, setSelectedVendor] = useState<string | null>(initialVendorId)

  const router = useRouter()

  const handleVendorChange = async (vendorId: string | null) => {
    setSelectedVendor(vendorId)

    const res = await fetch(`/api/todi?vendor=${vendorId || ''}`)
    const data = await res.json()
    setTodis(data.todis)
    setVendors(data.vendors)

    router.push(`/vendor/account?vendor=${vendorId || ''}`)
  }

  return (
    <div className="max-w-7xl py-28 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Todi List
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedVendor || ''}
              onChange={(e) => handleVendorChange(e.target.value || null)}
              className="w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Vendors</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.vendor}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estimate Cost
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Final Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Party Remaining Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {todis.map((todi) => (
                  <tr key={todi.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {todi.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {typeof todi.vender_id === 'object' && todi.vender_id?.vendor ? todi.vender_id.vendor : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₹{todi.estimate_cost}
                    </td>
                    
                  
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₹{todi.final_cost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {todi.partyRemainingPayment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <Link
                href={`/vendor/account/view?id=${todi.id}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800"
              >
               
                view
              </Link>
                    </td>
                  </tr>
                ))}
              </tbody> 
            </table>
          </div>
        </div>
      </div>
            <div className="fixed bottom-20 right-4 z-50">
              <div className="flex flex-col items-end space-y-2">
                <Link href="/vendor/account/add">
                  <button className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          
    </div>
  )
}
