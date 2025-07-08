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

  return (
    <div className="md:max-w-7xl md:mx-auto px-2 sm:px-4 lg:px-8 py-6 space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full space-y-4">
         
          <label htmlFor="account-select" className="text-xl font-bold whitespace-nowrap">
            Select Accounts
          </label>
        </div>
        <div className="relative">
            <input
              type="text"
              placeholder="Search ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        <div className="flex-none">
          <select
            id="account-select"
            value={select}
            onChange={(e) => setSelect(e.target.value as AccountType)}
            className="p-2 border dark:border-gray-600 dark:bg-black dark:text-white border-gray-300 "
          >
            <option value="todi">Todi List</option>
            <option value="gala">Gala List</option>
            <option value="stone">Stone List</option>
            <option value="todirat">Todi Raskat List</option>
          </select>
        </div>
      </div>


      {select === 'todi' && <TableSection data={getFilteredData()} type="Todi" />}
      {select === 'gala' && <TableSection data={getFilteredData()} type="Gala" />}
      {select === 'stone' && <StoneTable stones={getFilteredData()} />}
      {select === 'todirat' && <TableSection data={getFilteredData()} type="TodiRaskat" />}
    </div>
  )
}
