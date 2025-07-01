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

  return (
    <div className="md:max-w-7xl md:mx-auto px-2 sm:px-4 lg:px-8 py-6 space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
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
            className="p-2 border dark:border-gray-600 dark:bg-black dark:text-white border-gray-300 "
          >
            <option value="todi">Todi List</option>
            <option value="gala">Gala List</option>
            <option value="stone">Stone List</option>
            <option value="todirat">Todi Raskat List</option>
          </select>
        </div>
      </div>


      {select === 'todi' && <TableSection data={todis} type="Todi" />}
      {select === 'gala' && <TableSection data={galas} type="Gala" />}
      {select === 'stone' && <StoneTable stones={stones} />}
      {select === 'todirat' && <TableSection data={todiris} type="TodiRaskat" />}
    </div>
  )
}
