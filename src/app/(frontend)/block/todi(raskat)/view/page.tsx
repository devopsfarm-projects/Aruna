'use client'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BlockType } from './type'
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { GroupBlock } from './GroupBlock'

export default function EditBlock() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [block, setBlock] = useState<BlockType | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const pdfLib = jsPDF.jsPDF
  const html2canvasLib = html2canvas

  useEffect(() => {
    const fetchBlock = async () => {
      if (!id) return
      try {
        const res = await axios.get(`/api/todiraskat/${id}`)
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
      const marginTop = 20
  
      pdf.setFontSize(24)
      pdf.text('Todi Raskat Block Report', pageWidth / 2, marginTop + 10, { align: 'center' })
      pdf.setFontSize(12)
      pdf.text(`Block Type: ${block.BlockType || 'N/A'}`, pageWidth / 2, marginTop + 20, { align: 'center' })
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, marginTop + 30, { align: 'center' })
  
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.top = '-9999px'
      tempContainer.style.left = '-9999px'
      tempContainer.style.width = '1200px'
      document.body.appendChild(tempContainer)
  
      // Render summary + group 1
      const summaryClone = formRef.current.querySelector('.pdf-summary')?.cloneNode(true) as HTMLElement
      if (summaryClone) {
        tempContainer.innerHTML = ''
        tempContainer.appendChild(summaryClone)
  
        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
        })
        const imgData = canvas.toDataURL('image/jpeg', 1.0)
        const imgHeight = (canvas.height * pageWidth) / canvas.width
        pdf.addImage(imgData, 'JPEG', 0, 40, pageWidth, imgHeight)
        pdf.text(`Page 1 of ${block.group.length}`, 10, 290)
      }
  
      // Render remaining groups (2nd onward)
      for (let i = 1; i < block.group.length; i++) {
        const container = document.createElement('div')
        container.style.width = '1200px'
        container.className = 'pdf-group'
  
        const groupElement = document.createElement('div')
        groupElement.innerHTML = renderGroupHTML(block.group[i], i) // <-- render raw HTML
        container.appendChild(groupElement)
        tempContainer.innerHTML = ''
        tempContainer.appendChild(container)
  
        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
        })
  
        const imgData = canvas.toDataURL('image/jpeg', 1.0)
        const imgHeight = (canvas.height * pageWidth) / canvas.width
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, 20, pageWidth, imgHeight)
        pdf.text(`Page ${i + 1} of ${block.group.length}`, 10, 290)
      }
  
      document.body.removeChild(tempContainer)
  
      const filename = `TodiRaskat-${block.BlockType}-${new Date().toISOString().split('T')[0]}.pdf`
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
          width: '1200px'
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Block PDF</h1>
          <Link href="/block/todi(raskat)" className="text-blue-600 hover:underline">← Back</Link>
        </div>

        <div ref={formRef}>
  {/* PAGE 1: Summary + Group 1 */}
  <div className="pdf-page bg-white p-6 mb-6 border border-gray-200" style={{ width: '1200px', height: '1600px' }}>
    <section className="grid grid-cols-6 gap-4 mb-6">
      <Info label="Block Type" value={block.BlockType} />
      <Info label="Vendor" value={typeof block.vender_id === 'object' ? block.vender_id.vendor : block.vender_id} />
      <Info label="Munim" value={block.munim} />
      <Info label="Date" value={new Date(block.date).toLocaleDateString()} />
      <Info label="Hydra Cost" value={block.hydra_cost} />
      <Info label="Truck Cost" value={block.truck_cost} />
      <Info label="Length (m)" value={block.l} />
      <Info label="Breadth (m)" value={block.b} />
      <Info label="Height (m)" value={block.h} />
      <Info label="Total Groups" value={block.group.length} />
      <Info label="Total Measures" value={block.group.reduce((total, group) => total + group.block.reduce((bT, b) => bT + b.addmeasures.length, 0), 0)} />
      <Info label="Total Blocks" value={block.group.reduce((total, group) => total + group.block.length, 0)} />
      <Info label="Total Todi Cost (₹)" value={Number(block.total_todi_cost).toLocaleString('en-IN')} />
      <Info label="Total Todi Area (m³)" value={Number(block.total_todi_area).toLocaleString('en-IN')} />
      <Info label="Estimate Cost (₹)" value={Number(block.estimate_cost).toLocaleString('en-IN')} />
      <Info label="Depreciation" value={block.depreciation} />
      <Info label="Final Cost (₹)" value={Number(block.final_cost).toLocaleString('en-IN')} />
    </section>

    {/* Group 1 inside page 1 */}
    <GroupBlock group={block.group[0]} groupIndex={0}  />
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


function renderGroupHTML(group: BlockType['group'][number], index: number): string {
  return `
    <div style="padding: 24px; border: 1px solid #ccc; background-color: white; font-family: sans-serif; font-size: 12px;">
      <h2 style="font-weight: bold; margin-bottom: 8px;">Group ${index + 1}</h2>
      <div style="display: flex; gap: 16px; margin-bottom: 12px;">
        <div><strong>Hydra Cost:</strong> ${group.g_hydra_cost}</div>
        <div><strong>Truck Cost:</strong> ${group.g_truck_cost}</div>
        <div><strong>Date:</strong> ${new Date(group.date).toLocaleDateString()}</div>
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
              `
              )
              .join('')}
          </div>
        `
        })
        .join('')}
    </div>
  `
}
