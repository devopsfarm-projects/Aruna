import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

async function getData() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'Gala', limit: 100 })
  return docs
}

export default async function GalaListPage() {
  const todis = await getData()

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Gala List</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-900 text-white ">
              <th className="p-2">ID</th>
              <th className="p-2">Type</th>
              <th className="p-2">Date</th>
              <th className="p-2">Vendor</th>
              <th className="p-2">Munim</th>
              <th className="p-2">Dimensions</th>
              <th className="p-2">Area</th>
              <th className="p-2">Total Cost</th>
              <th className="p-2">Final Cost</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todis.map((todi: any) => (
              <tr key={todi.id} className="border-t">
                <td className="p-2">{todi.id}</td>
                <td className="p-2">{todi.GalaType}</td>
                <td className="p-2">{todi.date ? new Date(todi.date).toLocaleDateString() : '-'}</td>
                <td className="p-2">{typeof todi.vender_id === 'object' ? todi.vender_id?.id : todi.vender_id}</td>
                <td className="p-2">{todi.munim || '-'}</td>
                <td className="p-2">{todi.l} x {todi.total_b} x {todi.h}</td>
                <td className="p-2">{todi.total_gala_area}</td>
                <td className="p-2">₹{todi.total_gala_cost}</td>
                <td className="p-2">₹{todi.final_cost}</td>
                <td className="p-2">
                  <Link href={`/block/gala/edit?id=${todi.id}`} className="text-blue-600 underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-20 right-4">
        <Link href="/block/gala/add">
          <button className="bg-indigo-600 text-white p-3  shadow-lg">
            +
          </button>
        </Link>
      </div>
    </div>
  )
}
