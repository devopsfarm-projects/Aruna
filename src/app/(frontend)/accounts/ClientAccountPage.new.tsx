'use client'

import { useState } from 'react'
import { TableSection } from './TableSection'
import StoneTable from './StoneTable'

type AccountType = 'todi' | 'gala' | 'stone' | 'todirat'

export default function ClientAccountPage({
  todis,
  galas,
  stones,
  todiris,
}: {
  todis: any[]
  galas: any[]
  stones: any[]
  todiris: any[]
}) {
  const [select, setSelect] = useState<AccountType>('todi')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter function for vendor and munim
  const filterData = (data: any[]) => {
    if (!searchTerm) return data
    
    const term = searchTerm.toLowerCase()
    return data.filter(item => {
      const vendorName = typeof item.vender_id === 'object' ? item.vender_id?.vendor?.toLowerCase() || '' : ''
      const munimName = item.munim?.toLowerCase() || ''
      return vendorName.includes(term) || munimName.includes(term)
    })
  }

  // Apply filter to the selected data type
  const getFilteredData = () => {
    const data = select === 'todi' ? todis : 
                 select === 'gala' ? galas :
                 select === 'stone' ? stones : todiris
    return filterData(data)
  }

  const accountTabs = [
    { value: 'todi', label: 'Todi' },
    { value: 'gala', label: 'Gala' },
    { value: 'stone', label: 'Stone' },
    { value: 'todirat', label: 'Todi Raskat' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Management</h1>
          <p className="text-gray-600 dark:text-gray-300">View and manage all your accounts in one place</p>
        </div>

        {/* Search and Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by vendor or munim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Account Type Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8 overflow-x-auto pb-1 scrollbar-hide">
                {accountTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setSelect(tab.value as AccountType)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      select === tab.value
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-500'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {select === 'todi' && <TableSection data={getFilteredData()} type="Todi" />}
          {select === 'gala' && <TableSection data={getFilteredData()} type="Gala" />}
          {select === 'stone' && <StoneTable stones={getFilteredData()} />}
          {select === 'todirat' && <TableSection data={getFilteredData()} type="TodiRaskat" />}
          
          {getFilteredData().length === 0 && (
            <div className="p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No accounts found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search or filter to find what you\'re looking for.' : 'There are currently no accounts available.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
