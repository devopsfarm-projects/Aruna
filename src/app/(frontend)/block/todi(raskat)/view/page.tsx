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
      const originalStyle = formRef.current.getAttribute('style')
      formRef.current.style.width = '1200px'
      formRef.current.style.maxWidth = 'unset'

      const pages = formRef.current.querySelectorAll('.pdf-page')
      pages.forEach(page => {
        const el = page as HTMLElement
        el.style.width = '1200px'
        el.style.height = '1600px'
        el.style.maxWidth = 'unset'
      })

      const pdf = new jsPDF.jsPDF('p', 'mm', 'a4')
      pdf.setFontSize(24)
      pdf.text('Todi Raskat Block Report', 105, 30, { align: 'center' })
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Block Type: ${block.BlockType || 'N/A'}`, 105, 45, { align: 'center' })
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 55, { align: 'center' })

      for (let i = 0; i < pages.length; i++) {
        const el = pages[i] as HTMLElement
        const canvas = await html2canvas(el, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
          width: 1200,
          height: 1600
        })

        const imgData = canvas.toDataURL('image/jpeg', 1.0)
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        if (i !== 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, 20, imgWidth, imgHeight)
        pdf.text(`Page ${i + 1} of ${pages.length}`, 10, 290)
      }

      const filename = `TodiRaskat-${block.BlockType}-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(filename)

      if (originalStyle) {
        formRef.current.setAttribute('style', originalStyle)
      } else {
        formRef.current.removeAttribute('style')
      }
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

  {/* PAGE 2+ : Remaining groups start from index 1 */}
  {block.group.slice(1).map((group, index) => (
    <div
      key={index + 1}
      className="pdf-page bg-white p-6 mb-6 border border-gray-200"
      style={{ width: '1200px', height: '1600px' }}
    >
      <GroupBlock group={group} groupIndex={index + 1} />
    </div>
  ))}
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
