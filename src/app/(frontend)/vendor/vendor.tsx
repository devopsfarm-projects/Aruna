'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import type { Vendor as PayloadVendor } from "../../../payload-types";

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
        (typeof vendor.Mines_name === 'object' && vendor.Mines_name !== null && 
         vendor.Mines_name.Mines_name?.toLowerCase().includes(searchMine.toLowerCase()))

      return matchesVendor && matchesMine
    })
    setFilteredVendor(filtered)
  }, [VendorItems, searchVendor, searchMine])

  


  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this Vendor?')
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/vendor/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Vendor deleted successfully!')
        // Refresh the vendor list after successful deletion
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 pt-28 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          <span className="text-indigo-600 dark:text-indigo-400">Vendor</span> Directory
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Search Vendor
                </label>
                <input
                  type="text"
                  value={searchVendor}
                  onChange={(e) => setSearchVendor(e.target.value)}
                  placeholder="Search by vendor name or company number..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Search Mine
                </label>
                <input
                  type="text"
                  value={searchMine}
                  onChange={(e) => setSearchMine(e.target.value)}
                  placeholder="Search by mine name..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
     
          <Link href="/vendor/addvendor">
            <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
              <span className="text-sm font-medium">Add New Vendor</span>
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="p-4 text-center">S.No.</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Mine Name</th>
                <th className="p-4">Address</th>
                <th className="p-4">Vendor Mobile No.</th>
                <th className="p-4">Company Mobile No.</th>
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
                

                  <td className="p-4 text-center">{index + 1}</td>
                  <td className="p-4">
                    <span className="font-medium">{item.vendor}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{typeof item.Mines_name === 'object' && item.Mines_name ? item.Mines_name.Mines_name : '-'}</span>
                  </td>
                  <td className="p-4">{item.address}</td>
                  <td className="p-4">
                    <a
                      href={`tel:${item.vendor_no}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-center"
                    >
                      {item.vendor_no ?? '-'}
                    </a>
                  </td>
                  <td className="p-4">
                    <a
                      href={`tel:${item.Company_no}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-center"
                    >
                      {item.Company_no ?? '-'}
                    </a>
                  </td>
                  <td className="p-4">
                    <a
                      href={`mailto:${item.mail_id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {item.mail_id}
                    </a>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                    <Link href={`/vendor/edit?id=${item.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition">
                          Edit
                        </Link>
                      <button
                        onClick={() => handleDelete(String(item.id))}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                      >
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
