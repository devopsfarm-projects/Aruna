'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

interface Stone {
  id: string | number
  stoneType?: string
  munim?: string
  date?: string
  rate?: number
  total_quantity?: number | string
  hydra_cost?: number | string
  total_amount?: number
}

// Client-side only component to handle role-based actions
const ClientStoneTable = ({ stones }: { stones: Stone[] }) => {
  const [showActions, setShowActions] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // This ensures the component is mounted client-side
    setIsClient(true)

    try {
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (!userStr) {
        console.log('No user data found in localStorage')
        return
      }

      const user = JSON.parse(userStr)
      const hasPermission = user?.role === 'admin' || user?.role === 'manager'
      console.log('StoneTable - User role:', user?.role, 'Show actions:', hasPermission)
      setShowActions(hasPermission)
    } catch (err) {
      console.error('Error checking user role:', err)
      setShowActions(false)
    }
  }, [])

  // Don't render anything on the server
  if (!isClient) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Stone List
        </h2>
        <div className="md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Skeleton loader or loading state */}
          <div className="animate-pulse p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Stone List
      </h2>
      <div className="md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">Stone</th>
              <th className="p-3 text-left">Munim</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Rate</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Hydra</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stones.map((stone) => (
              <tr key={stone.id} className="border-b dark:border-gray-600">
                <td className="p-3">{stone.stoneType}</td>
                <td className="p-3">{stone.munim}</td>
                <td className="p-3">
                  {stone.date ? new Date(stone.date).toLocaleDateString() : '-'}
                </td>
                <td className="p-3">{stone.rate?.toLocaleString('en-IN') || '0'}</td>
                <td className="p-3">{stone.total_quantity ?? '-'}</td>
                <td className="p-3">{stone.hydra_cost ?? '-'}</td>
                <td className="p-3">₹{stone.total_amount?.toLocaleString('en-IN') || '0'}</td>
                <td className="p-3">
                  {showActions ? (
                    <Link
                      href={`/block/stone/edit?id=${stone.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      prefetch={false}
                    >
                      Edit
                    </Link>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-600">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Export with no SSR to prevent hydration issues
export default dynamic(() => Promise.resolve(ClientStoneTable), {
  ssr: false,
})
