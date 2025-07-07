'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Vendor, Gala } from '@/payload-types'
import { format, parse } from 'date-fns'

interface Props {
  initialGalas: Gala[]
  initialVendors: Vendor[]
  initialVendorId: string | null
}

export default function GalaAccountCard({ initialGalas, initialVendors, initialVendorId }: Props) {
  const [galas, setGalas] = useState(initialGalas)
  const [vendors, setVendors] = useState(initialVendors)
  const [selectedVendor, setSelectedVendor] = useState(initialVendorId)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
const searchParams = useSearchParams()

useEffect(() => {
  const vendorId = searchParams.get('vendor') ?? ''
  setSelectedVendor(vendorId)

  setIsLoading(true)
  setError(null)

  try {
    const filtered = vendorId
      ? initialGalas.filter((gala) => {
          const id = typeof gala.vender_id === 'object' ? gala.vender_id?.id : gala.vender_id
          return String(id) === vendorId
        })
      : initialGalas

    setGalas(filtered)
  } catch (err) {
    setError('Error filtering Galas')
    setGalas([])
  } finally {
    setIsLoading(false)
  }
}, [searchParams, initialGalas])

const handleVendorChange = (vendorId: string) => {
  router.push(`/vendor/account?vendor=${vendorId}`)
}

const handleDateChange = () => {
  setIsLoading(true)
  setError(null)

  try {
    // First filter by vendor if selected
    let filtered = selectedVendor
      ? initialGalas.filter((gala) => {
          const id = typeof gala.vender_id === 'object' ? gala.vender_id?.id : gala.vender_id
          return String(id) === selectedVendor
        })
      : initialGalas

    // Then filter by date range if dates are selected
    if (startDate || endDate) {
      filtered = filtered.filter((gala) => {
        if (!gala.date) return false
        const galaDate = new Date(gala.date)
        const start = startDate ? startDate : new Date(0)
        const end = endDate ? endDate : new Date()
        return galaDate >= start && galaDate <= end
      })
    }

    setGalas(filtered)
  } catch (err) {
    setError('Error filtering Galas')
    setGalas([])
  } finally {
    setIsLoading(false)
  }
}




  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Gala List</h1>
        <div className="flex gap-4">
        <select
          value={selectedVendor || ''}
          onChange={(e) => handleVendorChange(e.target.value)}
          className="px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Vendors</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.vendor}
            </option>
          ))}
        </select>
        <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="date"
                  value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? parse(e.target.value, 'yyyy-MM-dd', new Date()) : null
                    
                    // Reset end date if start date is after end date
                    if (date && endDate && date > endDate) {
                      setEndDate(null)
                    }
                    
                    setStartDate(date)
                    handleDateChange()
                  }}
                  className="px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-auto"
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="date"
                  value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? parse(e.target.value, 'yyyy-MM-dd', new Date()) : null
                    
                    // Reset start date if end date is before start date
                    if (date && startDate && date < startDate) {
                      setStartDate(null)
                    }
                    
                    setEndDate(date)
                    handleDateChange()
                  }}
                  className="px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </div>
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
                  <td className="px-4 py-2">₹{gala.partyRemainingPayment?.toLocaleString('en-IN') || '0'}</td>
                  <td className="px-4 py-2">
                    <Link href={`/vendor/account/gala/edit?id=${gala.id}`} className="text-indigo-600 pr-2 dark:text-indigo-400 hover:underline" >  Edit  </Link>
                    <Link href={`/vendor/account/gala/view?id=${gala.id}`} className="text-indigo-600 pl-2 dark:text-indigo-400 hover:underline" >  View  </Link>
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
