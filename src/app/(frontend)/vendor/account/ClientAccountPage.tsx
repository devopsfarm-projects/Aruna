'use client'
import { useState } from 'react'
import TodiList from './components/TodiAccountCard'
import GalaAccountCard from './components/GalaAccountCard'
import type { Todi, Gala, Vendor } from '@/payload-types'

export default function ClientAccountPage({
  initialTodis,
  initialGalas,
  initialVendors,
  initialVendorId,
}: {
  initialTodis: Todi[]
  initialGalas: Gala[]
  initialVendors: Vendor[]
  initialVendorId: string | null
}) {
  const [select, setSelect] = useState<'Todi' | 'Gala'>('Todi')

  return (
    <>
       <div className="flex max-w-6xl pt-6 mx-auto px-4 justify-between items-center mb-4">
        <label htmlFor="account-type" className="font-semibold text-lg">
          Select Block Type
        </label>
        <select
          id="account-type"
          className="w-64 p-2 border dark:border-gray-600 dark:bg-black dark:text-white border-gray-300 rounded"
          value={select}
          onChange={(e) => setSelect(e.target.value as 'Todi' | 'Gala')}
        >
          <option value="Todi">Todi</option>
          <option value="Gala">Gala</option>
        </select>
      </div>

      {select === 'Todi' && (
        <TodiList initialTodis={initialTodis} initialVendors={initialVendors} initialVendorId={initialVendorId} />
      )}
      {select === 'Gala' && (
        <GalaAccountCard initialGalas={initialGalas} initialVendors={initialVendors} initialVendorId={initialVendorId} />
      )}
    </>
  )
}
