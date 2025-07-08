import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { EditButtonForBlock, DeleteButtonForBlock } from '../../components/ButtonForBlock'

async function getData(page = 1) {
  const payload = await getPayload({ config })
  const { docs, totalDocs, totalPages, page: currentPage } = await payload.find({
    collection: 'Todi',
    limit: 10,
    page,
    sort: '-createdAt', // Sort by newest first
  })
  return { docs, totalDocs, totalPages, currentPage }
}

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = Number(params.page || 1)
  const { docs: todies, totalPages, currentPage } = await getData(page)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Todi List</h1>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Dimensions</th>
              <th className="p-3 text-left">Area (m³)</th>
              <th className="p-3 text-left">Block Cost (₹)</th>
              <th className="p-3 text-left">Final Cost (₹)</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:bg-black">
            {todies.map((todi: any) => (
              <tr key={todi.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
                <td className="p-3">{todi.id}</td>
                <td className="p-3">{todi.BlockType}</td>
                <td className="p-3">{todi.date ? new Date(todi.date).toLocaleDateString() : '-'}</td>
                <td className="p-3">{typeof todi.vender_id === 'object' ? todi.vender_id?.vendor : '-'}</td>
                <td className="p-3">{todi.l} x {todi.b} x {todi.h}</td>
                <td className="p-3">{todi.total_block_area || '0.00'}</td>
                <td className="p-3">₹{(parseFloat(todi.total_block_cost) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-3">₹{(parseFloat(todi.final_cost) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <EditButtonForBlock href={`/block/todi/edit?id=${todi.id}`} />
                    <Link href={`/block/todi/view?id=${todi.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                    <DeleteButtonForBlock id={todi.id} name="todi" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

{/* Pagination controls */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i + 1}
            href={`?page=${i + 1}`}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {i + 1}
          </Link>
        ))}
      </div>

      {/* Add Button */}
      <div className="fixed bottom-20 right-4 z-50">
        <Link href="/block/todi/add">
          <button className="bg-indigo-600 text-white px-4 p-3  shadow hover:bg-indigo-700">
            +
          </button>
        </Link>
      </div>
    </div>
  )
}
