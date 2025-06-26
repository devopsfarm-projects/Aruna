'use client'

import { useState } from 'react'
import TableSection from './TableSection'
import StoneTable from './StoneTable'
type AccountType = 'todi' | 'gala' | 'stone'

export default function ClientAccountPage({
  todis,
  galas,
  stones,
}: {
  todis: any[]
  galas: any[]
  stones: any[]
}) {
  const [select, setSelect] = useState<AccountType>('todi')

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 space-y-12">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <label htmlFor="account-select" className="text-xl font-bold whitespace-nowrap">
            Select Accounts
          </label>
        </div>
        <div className="flex-none">
          <select
            id="account-select"
            value={select}
            onChange={(e) => setSelect(e.target.value as AccountType)}
            className="w-64 p-2 border dark:border-gray-600 dark:bg-black dark:text-white border-gray-300 rounded"
          >
            <option value="todi">Todi List</option>
            <option value="gala">Gala List</option>
            <option value="stone">Stone List</option>
          </select>
        </div>
      </div>


      {select === 'todi' && <TableSection title="Todi List" data={todis} type="Todi" />}
      {select === 'gala' && <TableSection title="Gala List" data={galas} type="Gala" />}
      {select === 'stone' && <StoneTable stones={stones} />}
    </div>
  )
}
