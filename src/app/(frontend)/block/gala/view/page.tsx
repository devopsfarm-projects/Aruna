'use client'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BlockType } from './type'
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { GroupBlock } from './GroupBlock'

// Assuming Summary component exists, though it's not used in the provided code.
// import Summary from '../../components/Summary'

export default function EditBlock() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [block, setBlock] = useState<BlockType | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchBlock = async () => {
      if (!id) return
      try {
        const res = await axios.get(`/api/gala/${id}`)
        setBlock(res.data as BlockType)
      } catch (error) {
        console.error('Failed to fetch block', error)
      }
    }
    fetchBlock()
  }, [id])

  const handleDownloadPDF = async () => {
    if (!formRef.current || !block) return

    try {
      const pdf = new jsPDF.jsPDF('p', 'mm', 'a4')
      const pageWidth = 210

      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.top = '-9999px'
      tempContainer.style.left = '-9999px'
      tempContainer.style.width = '1200px'
      document.body.appendChild(tempContainer)

      const summaryClone = formRef.current
        .querySelector('.pdf-summary')
        ?.cloneNode(true) as HTMLElement
      if (!summaryClone) return

      tempContainer.innerHTML = ''
      tempContainer.appendChild(summaryClone)

      const elements = tempContainer.querySelectorAll('*') as NodeListOf<HTMLElement>
      elements.forEach((el) => {
        el.style.color = 'black'
        el.style.backgroundColor = 'white'
        el.style.fontFamily = 'Arial, sans-serif'
      })

      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      })

      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * pageWidth) / canvas.width

      const pageHeight = 297 // A4 height in mm
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      document.body.removeChild(tempContainer)

      const currentDate = new Date()
        .toLocaleDateString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\//g, '-')
      const filename = `Gala-${block.BlockType || 'Report'}-${currentDate}.pdf`
      pdf.save(filename)
    } catch (err) {
      console.error('Error generating PDF', err)
    }
  }

  if (!block) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto bg-white py-2 px-4 text-black overflow-auto">
      <div
        className="scale-container"
        style={{
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '1200px',
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Block PDF</h1>
          <Link href="/block/todi(raskat)" className="text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>

        <div ref={formRef}>
          {/* PAGE 1: Summary + Groups */}
          <div
            className="pdf-page bg-white p-6 mb-6 border border-gray-200 pdf-summary"
            style={{ width: '1200px' }}
          >
            {/* Summary Metrics */}
            <div className="mb-8 p-4 border border-gray-200 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Summary Metrics</h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Total Block Area */}
                <div className="border p-3 rounded">
                  <p className="text-sm text-gray-500">Total Delivered Block Area (m³)</p>
                  <p className="text-xl font-bold">{Number(block.total_block_area || 0).toFixed(2)}</p>
                </div>

                {/* Total Block Cost */}
                <div className="border p-3 rounded">
                  <p className="text-sm text-gray-500">Total Delivered Block Cost (₹)</p>
                  <p className="text-xl font-bold">
                    ₹
                    {Number(block.total_block_cost || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                {/* Final Cost */}
                <div className="border p-3 rounded">
                  <p className="text-sm text-gray-500">Final Cost (₹)</p>
                  <p className="text-xl font-bold">
                    ₹
                    {Number(block.final_cost || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <section className="grid grid-cols-6 gap-4 mb-6">
              <Info label="Block Type" value={block.BlockType} />
              <Info
                label="Vendor"
                value={
                  typeof block.vender_id === 'object' ? block.vender_id.vendor : block.vender_id
                }
              />
              <Info label="Munim" value={block.munim} />
              <Info label="Date" value={new Date(block.date).toLocaleDateString()} />
              <Info label="Hydra Cost" value={block.hydra_cost} />
              <Info label="Truck Cost" value={block.truck_cost} />
              <Info label="Length (m)" value={block.l} />
              <Info label="Breadth (m)" value={block.total_b} />
              <Info label="Height (m)" value={block.h} />
              <Info label="Total Groups" value={block.group.length} />
              <Info
                label="Total Measures"
                value={block.group.reduce(
                  (total, group) =>
                    total + group.block.reduce((bT, b) => bT + b.addmeasures.length, 0),
                  0,
                )}
              />
              <Info
                label="Total Blocks"
                value={block.group.reduce((total, group) => total + group.block.length, 0)}
              />
              <Info
                label="Total Todi Cost (₹)"
                value={Number(block.total_gala_cost).toLocaleString('en-IN')}
              />
              <Info
                label="Total Todi Area (m³)"
                value={Number(block.total_gala_area).toLocaleString('en-IN')}
              />
              <Info
                label="Estimate Cost (₹)"
                value={Number(block.estimate_cost).toLocaleString('en-IN')}
              />
              <Info label="Depreciation" value={block.depreciation} />
              <Info
                label="Final Cost (₹)"
                value={Number(block.final_cost).toLocaleString('en-IN')}
              />
            </section>

            {/* Render all groups */}
            {block.group.map((group, index) => (
              <GroupBlock group={group} groupIndex={index} key={index} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleDownloadPDF}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs font-medium pb-3 text-gray-500 mb-1">{label}</p>
      <div className="text-xs pb-3 font-normal text-gray-900 border px-3 py-1 bg-white rounded">
        {value || '-'}
      </div>
    </div>
  )
}

// Note: This function is defined but not used in the component. It can be safely removed
// if it's not intended for future use.
function renderGroupHTML(group: BlockType['group'][number], index: number): string {
  const groupDate = new Date(group.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return `
    <div style="padding: 24px; border: 1px solid #ccc; background-color: white; font-family: sans-serif; font-size: 12px;">
      <h2 style="font-weight: bold; margin-bottom: 8px;">Group ${index + 1}</h2>
      <div style="display: flex; gap: 16px; margin-bottom: 12px;">
        <div><strong>Hydra Cost:</strong> ${group.g_hydra_cost}</div>
        <div><strong>Truck Cost:</strong> ${group.g_truck_cost}</div>
        <div><strong>Date:</strong> ${groupDate}</div>
      </div>
      ${group.block
        .map((blockItem, bIndex) => {
          return `
          <div style="margin-bottom: 12px; border: 1px solid #eee; padding: 8px;">
            <h3>Block ${bIndex + 1}</h3>
            ${blockItem.addmeasures
              .map(
                (m, mIndex) => `
                <div style="margin-top: 4px;">
                  <strong>Measurement ${mIndex + 1}:</strong>
                  L: ${m.l}, B: ${m.b}, H: ${m.h},
                  Area: ${m.block_area}, Cost: ${m.block_cost}
                </div>
              `,
              )
              .join('')}
          </div>
        `
        })
        .join('')}
    </div>
  `
}