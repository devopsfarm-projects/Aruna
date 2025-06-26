// src/app/(frontend)/accounts/TableSection.tsx
export default function TableSection({
    title,
    data,
    type,
  }: {
    title: string
    data: any[]
    type: 'Todi' | 'Gala' | 'Stone'
  }) {
    const commonHeaders = [
      'ID', 'Type', 'Date', 'Vendor', 'Munim', 'Dimensions',
      'Area', ...(type === 'Todi' ? ['Total Cost'] : ['Todi Cost', 'Total Cost']),
      'Estimate Cost', 'Depreciation', 'Final Cost',
    ]
  
    return (
      <div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                {commonHeaders.map((header) => (
                  <th key={header} className="px-4 py-2 whitespace-nowrap text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-white">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{type === 'Todi' ? item.BlockType : item.GalaType}</td>
                  <td className="px-4 py-2">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-2">
                    {typeof item.vender_id === 'object' ? item.vender_id?.id || 'N/A' : item.vender_id || 'N/A'}
                  </td>
                  <td className="px-4 py-2">{item.munim || 'N/A'}</td>
                  <td className="px-4 py-2">
                    {item.l} x {type === 'Gala' ? item.total_b : item.b} x {item.h}
                  </td>
                  <td className="px-4 py-2">{type === 'Todi' ? item.total_todi_area : item.total_gala_area}</td>
  
                  {type === 'Todi' ? (
                    <td className="px-4 py-2">₹{item.total_todi_cost}</td>
                  ) : (
                    <>
                      <td className="px-4 py-2">₹{item.gala_cost}</td>
                      <td className="px-4 py-2">₹{item.total_gala_cost}</td>
                    </>
                  )}
  
                  <td className="px-4 py-2">₹{item.estimate_cost}</td>
                  <td className="px-4 py-2">{item.depreciation}%</td>
                  <td className="px-4 py-2">₹{item.final_cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  




  