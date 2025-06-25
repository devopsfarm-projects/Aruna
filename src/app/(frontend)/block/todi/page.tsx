import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

async function getData() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'Todi', limit: 100 })
  return docs
}

export default async function Page() {
  const todis = await getData()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Todi List</h1>

      <div className="overflow-x-auto bg-white dark:bg-gray-800  shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Dimensions</th>
              <th className="p-3 text-left">Area</th>
              <th className="p-3 text-left">Total Cost</th>
              <th className="p-3 text-left">Final Cost</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:bg-black">
            {todis.map((todi: any) => (
              <tr key={todi.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
                <td className="p-3">{todi.id}</td>
                <td className="p-3">{todi.BlockType}</td>
                <td className="p-3">{todi.date ? new Date(todi.date).toLocaleDateString() : '-'}</td>
                <td className="p-3">{typeof todi.vender_id === 'object' ? todi.vender_id?.vendor : '-'}</td>
                <td className="p-3">{todi.l} x {todi.b} x {todi.h}</td>
                <td className="p-3">{todi.total_todi_area}</td>
                <td className="p-3">₹{todi.total_todi_cost}</td>
                <td className="p-3">₹{todi.final_cost}</td>
                <td className="p-3">
                  <Link href={`/block/todi/edit?id=${todi.id}`} className="text-blue-600 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Button (FAB) */}
      <div className="fixed bottom-20 right-4 z-50">
        <Link href="/block/todi/add">
          <button className="bg-indigo-600 text-white p-3 rounded-full shadow hover:bg-indigo-700">
            +
          </button>
        </Link>
      </div>
    </div>
  )
}
