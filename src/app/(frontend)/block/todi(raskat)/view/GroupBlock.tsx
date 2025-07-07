import { BlockType } from "./type"

export function GroupBlock({
    group,
    groupIndex,
  }: {
    group: BlockType['group'][number]
    groupIndex: number
  }) {
    return (
      <section className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">Group {groupIndex + 1}</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Info label="Hydra Cost" value={group.g_hydra_cost} />
          <Info label="Truck Cost" value={group.g_truck_cost} />
          <Info label="Date" value={new Date(group.date).toLocaleDateString()} />
        </div>
  
        <div className="grid gap-4">
          {group.block.map((blockItem, blockIndex) => (
            <div key={blockIndex} className="border rounded p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Block {blockIndex + 1}</h3>
              </div>
  
              {blockItem.addmeasures?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Measurements</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border px-2 py-2 text-left">Measurement</th>
                          <th className="border px-2 py-2 text-left">L</th>
                          <th className="border px-2 py-2 text-left">B</th>
                          <th className="border px-2 py-2 text-left">H</th>
                          <th className="border px-2 py-2 text-left">Block Area</th>
                          <th className="border px-2 py-2 text-left">Block Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blockItem.addmeasures.map((measure, measureIndex) => (
                          <tr key={measureIndex} className="border-b">
                            <td className="border px-2 py-2 text-xs">
                              {measureIndex + 1}
                            </td>
                            <td className="border px-2 py-2 text-xs">
                              {measure.l}
                            </td>
                            <td className="border px-2 py-2 text-xs">
                              {measure.b}
                            </td>
                            <td className="border px-2 py-2 text-xs">
                              {measure.h}
                            </td>
                            <td className="border px-2 py-2 text-xs">
                              {measure.block_area}
                            </td>
                            <td className="border px-2 py-2 text-xs">
                              {measure.block_cost}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }
  


  function Info({ label, value }: { label: string; value: any }) {
    return (
      <div>
        <p className="text-xs font-medium pb-3 text-gray-500 mb-1">{label}</p>
        <div className="text-xs pb-3 font-normal text-gray-900 border px-2 py-1 bg-white rounded">
          {value || '-'}
        </div>
      </div>
    )
  }
  


