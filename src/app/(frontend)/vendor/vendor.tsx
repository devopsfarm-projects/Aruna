'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import type { Vendor as PayloadVendor } from "../../../payload-types"

export default function Vendor({ VendorItems }: { VendorItems: PayloadVendor[] }) {
  const [searchVendor, setSearchVendor] = useState('')
  const [searchMine, setSearchMine] = useState('')
  const [filteredVendor, setFilteredVendor] = useState<PayloadVendor[]>([])

  useEffect(() => {
    const filtered = VendorItems.filter((vendor) => {
      const matchesVendor =
        !searchVendor ||
        vendor.vendor?.toLowerCase().includes(searchVendor.toLowerCase()) ||
        vendor.Company_no?.toLowerCase().includes(searchVendor.toLowerCase())

      const matchesMine =
        !searchMine ||
        (typeof vendor.Mines_name === 'object' &&
          vendor.Mines_name?.Mines_name?.toLowerCase().includes(searchMine.toLowerCase()))

      return matchesVendor && matchesMine
    })
    setFilteredVendor(filtered)
  }, [VendorItems, searchVendor, searchMine])

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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Mine
            </label>
            <input
              type="text"
              value={searchMine}
              onChange={(e) => setSearchMine(e.target.value)}
              placeholder="Mine name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <Link href="/vendor/addvendor" className="w-full">
              <button className="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
                Add New Vendor
              </button>
            </Link>
          </div>
        </div>

        {/* Vendor Table - Desktop */}
        <div className="hidden lg:block overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="p-4">S.No</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Mine</th>
                <th className="p-4">Address</th>
                <th className="p-4">Vendor No.</th>
                <th className="p-4">Company No.</th>
                <th className="p-4">Email</th>
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
                  <td className="p-4">{typeof item.Mines_name === 'object' ? item.Mines_name?.Mines_name ?? '-' : item.Mines_name ?? '-'}</td>
                  <td className="p-4">{item.address}</td>
                  <td className="p-4">
                    <a href={`tel:${item.vendor_no}`} className="text-blue-600 dark:text-blue-400">
                      {item.vendor_no ?? '-'}
                    </a>
                  </td>
                  <td className="p-4">
                    <a href={`tel:${item.Company_no}`} className="text-blue-600 dark:text-blue-400">
                      {item.Company_no ?? '-'}
                    </a>
                  </td>
                  <td className="p-4">
                    <a href={`mailto:${item.mail_id}`} className="text-blue-600 dark:text-blue-400">
                      {item.mail_id ?? '-'}
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
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col gap-2"
            >
              <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
                {item.vendor} ({typeof item.Mines_name === 'object' ? item.Mines_name?.Mines_name ?? '-' : item.Mines_name ?? '-'})
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">{item.address}</div>
              <div className="text-sm">
                📞 Vendor: <a href={`tel:${item.vendor_no}`} className="text-blue-600">{item.vendor_no ?? '-'}</a>
              </div>
              <div className="text-sm">
                ☎️ Company: <a href={`tel:${item.Company_no}`} className="text-blue-600">{item.Company_no ?? '-'}</a>
              </div>
              <div className="text-sm">
                📧 Email: <a href={`mailto:${item.mail_id}`} className="text-blue-600">{item.mail_id ?? '-'}</a>
              </div>
              <div className="flex gap-4 mt-2">
                <Link href={`/vendor/edit?id=${item.id}`} className="text-sm text-blue-600">Edit</Link>
                <button
                  onClick={() => handleDelete(String(item.id))}
                  className="text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
