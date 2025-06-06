'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import type { Vendor as PayloadVendor } from "../../../payload-types"

export default function Vendor({ VendorItems }: { VendorItems: PayloadVendor[] }) {
  const [searchVendor, setSearchVendor] = useState('')
  const [filteredVendor, setFilteredVendor] = useState<PayloadVendor[]>([])

  useEffect(() => {
    const filtered = VendorItems.filter((vendor) => {
      const matchesVendor =
        !searchVendor ||
        vendor.vendor?.toLowerCase().includes(searchVendor.toLowerCase())
      return matchesVendor
    })
    setFilteredVendor(filtered)
  }, [VendorItems, searchVendor])

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this Vendor?')
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/vendor/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Vendor deleted successfully!')
        window.location.reload()
      } else {
        const errorData = await res.json()
        console.error('Failed to delete Vendor:', errorData)
        alert('Failed to delete vendor. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting Vendor:', error)
      alert('An error occurred while deleting the vendor. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-24 sm:py-28">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
          <span className="text-indigo-600 dark:text-indigo-400">Vendor</span> Directory
        </h1>

        {/* Search Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Vendor
            </label>
            <input
              type="text"
              value={searchVendor}
              onChange={(e) => setSearchVendor(e.target.value)}
              placeholder="Vendor name or company number"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Vendor Table - Desktop */}
        <div className="hidden lg:block overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="p-4">S.No</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Address</th>
                <th className="p-4">Vendor No.</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendor.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                 
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{item.vendor}</td>
                   <td className="p-4">{item.address}</td>
                  <td className="p-4">
                    <a href={`tel:${item.vendor_no}`} className="text-blue-600 dark:text-blue-400">
                      {item.vendor_no ?? '-'}
                    </a>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Link href={`/vendor/edit?id=${item.id}`} className="text-blue-600">Edit</Link>
                      <button onClick={() => handleDelete(String(item.id))} className="text-red-600">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vendor Cards - Mobile */}
        <div className="lg:hidden space-y-6">
          {filteredVendor.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.vendor}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <input
                    type="checkbox"
                    checked={selectedVendor.has(item.id.toString())}
                    onChange={() => handleSelectVendor(item.id.toString())}
                    className="rounded cursor-pointer h-4 w-4"
                  /> */}
                  <button 
                    onClick={() => handleDelete(String(item.id))} 
                    className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-sm text-gray-700 dark:text-gray-300">{item.address}</div>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${item.vendor_no}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    📞 {item.vendor_no ?? '-'}
                  </a>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link 
                  href={`/vendor/edit?id=${item.id}`} 
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>

                     {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 z-50">
        <div className="flex flex-col items-end space-y-2">
          {/* {selectedVendor.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all flex items-center justify-center shadow-md"
              title={`Delete ${selectedVendor.size} selected items`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )} */}
          <Link href="/vendor/addvendor">
            <button className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
}
