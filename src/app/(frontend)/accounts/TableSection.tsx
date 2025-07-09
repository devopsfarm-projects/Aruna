// src/app/(frontend)/accounts/TableSection.tsx
"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function TableSection({
  data,
  type,
}: {
  data: Array<{
    id: string | number;
    vender_id?: any; // Consider defining a proper type for vender_id
    munim?: string;
    BlockType?: string;
    date?: string;
    l?: number | string;
    b?: number | string;
    h?: number | string;
    total_todi_area?: number | string;
    total_gala_area?: number | string;
    total_todi_cost?: number | string;
    gala_cost?: number | string;
    total_gala_cost?: number | string;
    estimate_cost?: number | string;
    depreciation?: number | string;
    final_cost?: number | string;
  }>
  type: 'Todi' | 'Gala' | 'Stone' | 'TodiRaskat'
}) {
    const [userRole, setUserRole] = useState<string>('user') // Default to most restrictive

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    console.log('Raw user data from localStorage:', userStr) // Debug log
    try {
      const user = userStr ? JSON.parse(userStr) : {}
      console.log('Parsed user object:', user) // Debug log
      console.log('User role:', user?.role) // Debug log
      setUserRole(user?.role || '')
    } catch (err) {
      console.error('Failed to parse user from localStorage', err)
    }
  }, [])

  const commonHeaders = [
    'ID', 'Type', 'Date', 'Vendor', 'Munim', 'Dimensions',
    'Area', ...(type === 'Todi' ? ['Total Cost'] : type === 'TodiRaskat' ? ['Total Cost'] : ['Todi Cost', 'Total Cost']),
    'Estimate Cost', 'Depreciation', 'Final Cost',
    ...(userRole === 'admin' || userRole === 'manager' ? ['Actions'] : [])
  ]

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = data.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {i}
        </button>
      )
    }

    return (
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              {commonHeaders.map((header) => (
                <th key={header} className="px-4 py-2 whitespace-nowrap text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-white">
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{type === 'Todi' || type === 'TodiRaskat' ? item.BlockType : item.GalaType}</td>
                <td className="px-4 py-2">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td>
                <td className="px-4 py-2">
                  {typeof item.vender_id === 'object' ? item.vender_id?.vendor || 'N/A' : 'N/A'}
                </td>
                <td className="px-4 py-2">{item.munim || 'N/A'}</td>
                <td className="px-4 py-2">
                  {item.l} x {type === 'Gala' ? item.total_b : item.b} x {item.h}
                </td>
                <td className="px-4 py-2">{type === 'Todi' || type === 'TodiRaskat' ? item.total_todi_area : item.total_gala_area}</td>

                {type === 'Todi' || type === 'TodiRaskat' ? (
                  <td className="px-4 py-2">₹{item.total_todi_cost?.toLocaleString('en-IN') || '0'}</td>
                ) : (
                  <>
                    <td className="px-4 py-2">₹{item.gala_cost?.toLocaleString('en-IN') || '0'}</td>
                    <td className="px-4 py-2">₹{item.total_gala_cost?.toLocaleString('en-IN') || '0'}</td>
                  </>
                )}

                <td className="px-4 py-2">₹{item.estimate_cost?.toLocaleString('en-IN') || '0'}</td>
                <td className="px-4 py-2">{item.depreciation}%</td>
                <td className="px-4 py-2">₹{item.final_cost?.toLocaleString('en-IN') || '0'}</td>
                {(() => {
                  console.log('Rendering edit button with userRole:', userRole);
                  return (userRole === 'admin' || userRole === 'manager') && (
                  <td className="px-4 py-2">
                    <Link 
                      href={`/block/${type.toLowerCase()}/edit?id=${item.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </Link>
                  </td>
                );
                })()}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && renderPagination()}
    </div>
  )
}
  