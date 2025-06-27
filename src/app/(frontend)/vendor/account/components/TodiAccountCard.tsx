'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Vendor, Todi } from '@/payload-types'

interface Props {
  initialTodis: Todi[]
  initialVendors: Vendor[]
  initialVendorId: string | null
}

export default function TodiList({ initialTodis, initialVendors, initialVendorId }: Props) {
  const [todis, setTodis] = useState(initialTodis)
  const [vendors, setVendors] = useState(initialVendors)
  const [selectedVendor, setSelectedVendor] = useState(initialVendorId)

  const router = useRouter()

  const handleVendorChange = async (vendorId: string | null) => {
    setSelectedVendor(vendorId)

    const res = await fetch(`/api/todi?vendor=${vendorId || ''}`)
    const data = await res.json()

    setTodis(data.todis)
    router.push(`/vendor/account?vendor=${vendorId || ''}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Todi List</h1>
        <select
          value={selectedVendor || ''}
          onChange={(e) => handleVendorChange(e.target.value || null)}
          className="px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Vendors</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.vendor}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-2">Vendor</th>
              <th className="px-4 py-2">Estimate</th>
              <th className="px-4 py-2">Final</th>
              <th className="px-4 py-2">Remaining</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {todis.map((todi) => (
              <tr key={todi.id} className="border-t dark:border-gray-700">
                <td className="px-4 py-2">
                  {typeof todi.vender_id === 'object' && todi.vender_id?.vendor
                    ? todi.vender_id.vendor
                    : 'N/A'}
                </td>
                <td className="px-4 py-2">₹{todi.estimate_cost?.toLocaleString('en-IN') || '0'}</td>
                <td className="px-4 py-2">₹{todi.final_cost?.toLocaleString('en-IN') || '0'}</td>
                <td className="px-4 py-2">{todi.partyRemainingPayment?.toLocaleString('en-IN') || '0'}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/vendor/account/todi/view?id=${todi.id}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {todis.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center px-4 py-4 text-gray-500 dark:text-gray-400">
                  No Todi records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
