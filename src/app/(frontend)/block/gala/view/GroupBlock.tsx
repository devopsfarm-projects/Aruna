import React from "react";
import { BlockType } from "./type"

export function GroupBlock({
    group,
    groupIndex,
  }: {
    group: BlockType['group'][number]
    groupIndex: number
  }) {
    return (
    <div className="mb-6 pt-4 border-t border-gray-200">
      <h2 className="text-base font-medium mb-4">Group {groupIndex + 1}</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Info label="Hydra Cost" value={group.g_hydra_cost} />
        <Info label="Truck Cost" value={group.g_truck_cost} />
        <Info label="Date" value={new Date(group.date).toLocaleDateString()} />
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="border p-3 text-left font-medium">Block</th>
              <th className="border p-3 text-left font-medium">Measurement</th>
              <th className="border p-3 text-left font-medium">L</th>
              <th className="border p-3 text-left font-medium">B</th>
              <th className="border p-3 text-left font-medium">H</th>
              <th className="border p-3 text-left font-medium">Block Area</th>
              <th className="border p-3 text-left font-medium">Block Cost</th>
            </tr>
          </thead>
          <tbody>
            {group.block.map((blockItem, blockIndex) => (
              <React.Fragment key={blockIndex}>
                <tr className={`border-b border-gray-200 ${blockIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="border p-3 font-medium text-sm" rowSpan={blockItem.addmeasures.length + 1}>
                    Block {blockIndex + 1}
                  </td>
                  <td className="border p-3 text-sm">
                    {blockItem.addmeasures[0] ? '1' : '-'}
                  </td>
                  <td className="border p-3 text-sm">
                    {blockItem.addmeasures[0]?.l || '-'}
                  </td>
                  <td className="border p-3 text-sm">
                    {blockItem.addmeasures[0]?.b || '-'}
                  </td>
                  <td className="border p-3 text-sm">
                    {blockItem.addmeasures[0]?.h || '-'}
                  </td>
                  <td className="border p-3 text-sm">
                    {blockItem.addmeasures[0]?.block_area || '-'}
                  </td>
                  <td className="border p-3 text-sm">
                    {blockItem.addmeasures[0]?.block_cost || '-'}
                  </td>
                </tr>
                {blockItem.addmeasures.slice(1).map((measure, measureIndex) => (
                  <tr key={measureIndex} className={`border-b border-gray-200 ${blockIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="border p-3 text-sm">Measure {measureIndex + 2}</td>
                    <td className="border p-3 text-sm">{measure.l}</td>
                    <td className="border p-3 text-sm">{measure.b}</td>
                    <td className="border p-3 text-sm">{measure.h}</td>
                    <td className="border p-3 text-sm">{measure.block_area}</td>
                    <td className="border p-3 text-sm">{measure.block_cost}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
  }

  function Info({ label, value }: { label: string; value: any }) {
    return (
      <div className="mb-4 w-full">
        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
        <div className="text-xs text-gray-900 p-2 bg-white rounded border border-gray-200">
          {value || '-'}
        </div>
      </div>
    )
  }
  


