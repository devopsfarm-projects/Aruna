'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import type { Vendor as PayloadVendor } from '../../../payload-types'
import { EditButton ,ActionHeader} from '../components/Button'
import { DeleteButton } from '../components/Button'
import axios from 'axios'
import { Message } from '../components/Message'

interface VendorProps {
  VendorItems: PayloadVendor[]
}

export default function Vendor({ VendorItems }: VendorProps) {
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [vendorLoading, setVendorLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Set<string>>(new Set())
  const [isSelectAllVendor, setIsSelectAllVendor] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setIsAdmin(user?.role === 'admin')

    // Fetch vendors
    const fetchVendors = async () => {
      try {
        const res = await axios.get('/api/vendor')
        if (res.status === 200) {
          setVendorLoading(false)
        }
      } catch (err) {
        console.error('Error fetching vendors:', err)
        setVendorLoading(false)
        setErrorMessage('Failed to fetch vendors. Please try again.')
        setShowErrorMessage(true)
      }
    }

    fetchVendors()
  }, [])

  const handleSelectVendor = (id: string) => {
    const newSelection = new Set(selectedVendor)
    if (newSelection.has(id)) newSelection.delete(id)
    else newSelection.add(id)
    setSelectedVendor(newSelection)
    setIsSelectAllVendor(newSelection.size === VendorItems.length)
  }

  const handleBulkDelete = async () => {
    if (selectedVendor.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedVendor.size} vendor(s)?`)) return

    try {
      // Convert string IDs to integers and filter out invalid ones
      const vendorIds = Array.from(selectedVendor)
        .map(id => {
          const parsedId = parseInt(id, 10)
          return !isNaN(parsedId) ? parsedId : null
        })
        .filter((id): id is number => id !== null)

      if (vendorIds.length === 0) {
        setErrorMessage('No valid vendor IDs selected')
        setShowErrorMessage(true)
        return
      }

      const res = await axios.delete(`/api/vendor/bulk`, {
        params: { ids: vendorIds }
      })

      if (res.status === 200) {
        setShowSuccessMessage(true)
        window.location.reload()
      } else {
        console.error('Failed to delete vendors:', res.data)
        setErrorMessage('Failed to delete vendors. Please try again.')
        setShowErrorMessage(true)
      }
    } catch (err) {
      console.error('Error deleting vendors:', err)
      setErrorMessage('An error occurred while deleting the vendors. Please try again.')
      setShowErrorMessage(true)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this Vendor?')
    if (!confirmDelete) return

    try {
      // Convert string ID to integer and validate
      const vendorId = parseInt(id, 10)

      if (isNaN(vendorId)) {
        setErrorMessage('Invalid vendor ID')
        setShowErrorMessage(true)
        return
      }

      const res = await axios.delete(`/api/vendor/${vendorId}`)
      if (res.status === 200) {
        setShowSuccessMessage(true)
        window.location.reload()
      } else {
        console.error('Failed to delete Vendor:', res.data)
        setErrorMessage('Failed to delete vendor. Please try again.')
        setShowErrorMessage(true)
      }
    } catch (err) {
      console.error('Error deleting Vendor:', err)
      setErrorMessage('An error occurred while deleting the vendor. Please try again.')
      setShowErrorMessage(true)
    }
  }

  const filteredVendor = VendorItems.filter(item =>
    (item.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (item.address?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (item.vendor_no?.toString().includes(searchQuery) ?? false)
  )

  if (showErrorMessage) {
    return (
      <Message
        setShowMessage={setShowErrorMessage}
        path={'/vendor'}
        type='error'
        message={errorMessage}
      />
    )
  }

  if (showSuccessMessage) {
    return (
      <Message
        setShowMessage={setShowSuccessMessage}
        path={'/vendor'}
        type='success'
        message='Vendor has been added successfully.'
      />
    )
  }


  



  return (
    <div className=" bg-gray-100 dark:bg-black px-4 py-4 sm:py-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
          <span className="text-indigo-600 dark:text-indigo-400">Vendor</span> Directory
        </h1>

        {/* Search Inputs */}
         <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 -lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by vendor name..."
                  className="w-full px-3 py-2 -md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Vendor Table - Desktop */}
        <div className="hidden lg:block overflow-x-auto bg-white dark:bg-gray-800 -xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="p-4">S.No</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Address</th>
                <th className="p-4">Mobile No.</th>
               <ActionHeader />
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
                      <EditButton href={`/vendor/edit?id=${item.id}`} />
                      <DeleteButton onClick={() => handleDelete(String(item.id))} />
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
              className="bg-white dark:bg-gray-800  overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
             
                
                <div className="p-4">
                  {/* Vendor Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {item.vendor}
                      </h3>
                      <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Vendor #{index + 1}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {/* <input
                        type="checkbox"
                        checked={selectedVendor.has(item.id.toString())}
                        onChange={() => handleSelectVendor(item.id.toString())}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      /> */}
                      <button
                        onClick={() => handleDelete(String(item.id))}
                        className="p-2 rounded-full bg-red-500/10 dark:bg-red-500/20 hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Vendor Details */}
                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900 dark:text-white">Location</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">{item.address}</span>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900 dark:text-white">Contact</span>
                        <a
                          href={`tel:${item.vendor_no}`}
                          className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                           {item.vendor_no ?? '-'}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/vendor/edit?id=${item.id}`}
                      className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit Vendor
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-20 right-4 z-50">
          <div className="flex flex-col items-end space-y-2">
            {selectedVendor.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white p-3 -full hover:bg-red-700 transition-all flex items-center justify-center shadow-md"
                title={`Delete ${selectedVendor.size} selected items`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
        
            {isAdmin && <Link href="/vendor/account" className="bg-blue-600 text-white p-3 -full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </Link>}
       
            <Link href="/vendor/addvendor">
              <button className="bg-indigo-600 text-white p-3 -full shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center">
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
    </div>
  )
}