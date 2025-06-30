'use client'
import { useState } from 'react'
import TodiList from './components/TodiAccountCard'
import GalaAccountCard from './components/GalaAccountCard'
import TodiRaskatAccountCard from './components/TodiRaskatAccountCard'
import type { Todi, Gala, TodiRaskat, Vendor } from '@/payload-types'

export default function ClientAccountPage({
  initialTodis,
  initialGalas,
  initialTodiRaskats,
  initialVendors,
  initialVendorId,
}: {
  initialTodis: Todi[]
  initialGalas: Gala[]
  initialTodiRaskats: TodiRaskat[]
  initialVendors: Vendor[]
  initialVendorId: string | null
}) {
  const [select, setSelect] = useState<'Todi' | 'Gala' | 'TodiRaskat'>('Todi')

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
          onChange={(e) => setSelect(e.target.value as 'Todi' | 'Gala' | 'TodiRaskat')}
        >
          <option value="Todi">Todi</option>
          <option value="Gala">Gala</option>
          <option value="TodiRaskat">Todi Raskat</option>
        </select>
      </div>

      {select === 'Todi' && (
        <TodiList initialTodis={initialTodis} initialVendors={initialVendors} initialVendorId={initialVendorId} />
      )}
      {select === 'Gala' && (
        <GalaAccountCard initialGalas={initialGalas} initialVendors={initialVendors} initialVendorId={initialVendorId} />
      )}
      {select === 'TodiRaskat' && (
        <TodiRaskatAccountCard 
          initialTodiRaskats={initialTodiRaskats}
          initialVendors={initialVendors} 
          initialVendorId={initialVendorId} 
        />
      )}
    </>
  )
}
