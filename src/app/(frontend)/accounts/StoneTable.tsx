// src/app/(frontend)/accounts/StoneTable.tsx
import React from 'react'

export default function StoneTable({ stones }: { stones: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Stone List</h2>
      <div className=" md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
