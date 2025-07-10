// src/app/(frontend)/accounts/TableSection.tsx
"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
// Import the new, safe types you just created
import { TableItem } from '@/types/data';

// The component props are now much cleaner and safer
export function TableSection({ data }: { data: TableItem[] }) {
  const [userRole, setUserRole] = useState<string>('user');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserRole(user?.role || 'user');
    } catch (err) {
      console.error('Failed to parse user from localStorage', err);
    }
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Headers can be simplified as we'll handle columns dynamically
  const headers = [
    'ID', 'Type', 'Date', 'Vendor', 'Munim', 'Dimensions', 'Area', 'Cost/Rate', 'Total Cost',
    'Estimate Cost', 'Depreciation', 'Final Cost',
    ...(userRole === 'admin' || userRole === 'manager' ? ['Actions'] : [])
  ];

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-2 whitespace-nowrap text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-white">
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {/* ID */}
                <td className="px-4 py-2">{item.id}</td>
                
                {/* Type (Using a type guard to be safe) */}
                <td className="px-4 py-2 font-medium">
                  {'BlockType' in item ? item.BlockType : 'GalaType' in item ? item.GalaType : 'stoneType' in item ? item.stoneType : 'N/A'}
                </td>
                
                {/* Date */}
                <td className="px-4 py-2">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td>
                
                {/* Vendor (Using a type guard) */}
                <td className="px-4 py-2">
                  {'vender_id' in item && item.vender_id ? item.vender_id.vendor : 'N/A'}
                </td>
                
                {/* Munim */}
                <td className="px-4 py-2">{item.munim || 'N/A'}</td>

                {/* Dimensions (Using a type guard for 'b' vs 'total_b') */}
                <td className="px-4 py-2">
                  {'l' in item && item.l} x {'b' in item ? item.b : 'total_b' in item ? item.total_b : 'N/A'} x {'h' in item && item.h}
                </td>

                {/* Area (Using a type guard) */}
                <td className="px-4 py-2">
                  {'total_todi_area' in item ? item.total_todi_area : 'total_gala_area' in item ? item.total_gala_area : 'N/A'}
                </td>

                {/* This section now handles the different cost structures safely */}
                {'BlockType' in item ? (
                  // Todi has 1 cost column
                  <>
                    <td className="px-4 py-2">--</td>
                    <td className="px-4 py-2">₹{item.total_todi_cost?.toLocaleString('en-IN') || '0'}</td>
                  </>
                ) : 'GalaType' in item ? (
                  // Gala has 2 cost columns
                  <>
                    <td className="px-4 py-2">₹{item.gala_cost?.toLocaleString('en-IN') || '0'}</td>
                    <td className="px-4 py-2">₹{item.total_gala_cost?.toLocaleString('en-IN') || '0'}</td>
                  </>
                ) : (
                  // Stone or others have empty cost columns
                  <>
                    <td className="px-4 py-2">--</td>
                    <td className="px-4 py-2">--</td>
                  </>
                )}

                {/* Common financial columns */}
                <td className="px-4 py-2">₹{item.estimate_cost?.toLocaleString('en-IN') || '0'}</td>
                <td className="px-4 py-2">{item.depreciation}%</td>
                <td className="px-4 py-2">₹{item.final_cost?.toLocaleString('en-IN') || '0'}</td>

                {/* Actions column based on role */}
                {(userRole === 'admin' || userRole === 'manager') && (
                  <td className="px-4 py-2">
                    <Link 
                      href={`/block/${'BlockType' in item ? 'todi' : 'gala'}/edit?id=${item.id}`} // Example dynamic link
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50">Previous</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{i + 1}</button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  ) 
}