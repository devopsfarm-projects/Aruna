'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Vendor, Gala } from '@/payload-types'

interface Props {
  initialGalas: Gala[]
  initialVendors: Vendor[]
  initialVendorId: string | null
}

export default function GalaAccountCard({ initialGalas, initialVendors, initialVendorId }: Props) {
  const [galas, setGalas] = useState(initialGalas)
  const [vendors, setVendors] = useState(initialVendors)
  const [selectedVendor, setSelectedVendor] = useState(initialVendorId)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleVendorChange = async (vendorId: string | null) => {
    setSelectedVendor(vendorId)
    setIsLoading(true)
    setError(null)

    try {
      // Filter galas based on vendor
      const filteredGalas = initialGalas.filter(gala => {
        if (!vendorId) return true;
        if (!gala.vender_id) return false;
        return typeof gala.vender_id === 'object' 
          ? String(gala.vender_id.id) === vendorId
          : String(gala.vender_id) === vendorId;
      });
      setGalas(filteredGalas)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setGalas([])
    } finally {
      setIsLoading(false)
    }
    router.push(`/vendor/account?vendor=${vendorId || ''}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Gala List</h1>
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

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

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
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center px-4 py-4 text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : galas?.length > 0 ? (
              galas.map((gala) => (
                <tr key={gala.id} className="border-t dark:border-gray-700">
                  <td className="px-4 py-2">
                    {typeof gala.vender_id === 'object' && gala.vender_id?.vendor
                      ? gala.vender_id.vendor
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-2">₹{gala.estimate_cost?.toLocaleString('en-IN') || '0'}</td>
                  <td className="px-4 py-2">₹{gala.final_cost?.toLocaleString('en-IN') || '0'}</td>
                  {/* <td className="px-4 py-2">₹{gala.group?.[0]?.remaining_amount?.toLocaleString('en-IN') || '0'}</td> */}
                  <td className="px-4 py-2">
                    <Link href={`/vendor/account/gala/view?id=${gala.id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline" >  View  </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center px-4 py-4 text-gray-500 dark:text-gray-400">
                  No Gala records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
