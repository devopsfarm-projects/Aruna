'use client'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BlockType } from './type'
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function EditBlock() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [block, setBlock] = useState<BlockType | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // Initialize PDF libraries directly
  const pdfLib = jsPDF.jsPDF
  const html2canvasLib = html2canvas

  useEffect(() => {
    const fetchBlock = async () => {
      if (!id) return
      try {
        const res = await axios.get(`/api/TodiRaskat/${id}`)
        setBlock(res.data as BlockType)
      } catch (error) {
        console.error('Failed to fetch block', error)
      }
    }
    fetchBlock()
  }, [id])

  const handleDownloadPDF = async () => {
    if (!formRef.current || !block) {
      console.error('Required dependencies not initialized:', {
        formRef: !!formRef.current,
        block: !!block
      })
      return
    }

    try {
      console.log('Creating PDF instance...')
      const pdf = new jsPDF.jsPDF('p', 'mm', 'a4')

      pdf.setFontSize(24)
      pdf.text('Todi Raskat Block Report', 105, 30, { align: 'center' })
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Block Type: ${block.BlockType || 'N/A'}`, 105, 45, { align: 'center' })
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 55, { align: 'center' })

      const elements = Array.from(formRef.current.querySelectorAll('.pdf-page')) as HTMLElement[]

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]
        const canvas = await html2canvasLib(el, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false
        })

        const imgData = canvas.toDataURL('image/jpeg', 1.0)
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        if (i !== 0) pdf.addPage()

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(14)
        pdf.text('Block Details', 10, 15)
        pdf.addImage(imgData, 'JPEG', 0, 20, imgWidth, imgHeight)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        pdf.text(`Page ${i + 1} of ${elements.length}`, 10, 290)
      }

      const filename = `TodiRaskat-${block.BlockType || 'Block'}-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.setProperties({
        title: `Todi Raskat Block Report - ${block.BlockType || 'Block'}`,
        subject: 'Block Details',
        author: 'Aruna Block Management System',
        keywords: 'block, gala, report, pdf',
        creator: 'Aruna Block Management System'
      })

      console.log('Saving PDF with filename:', filename)
      pdf.save(filename)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      throw error // Re-throw the error to make it more visible
    }
  }

  if (!block) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>
  }

  return (
    <div className="mx-auto bg-white py-2 px-4 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Block PDF</h1>
        <Link href="/block/todi" className="text-blue-600 hover:underline">← Back</Link>
      </div>

      <div ref={formRef}>
        <div className="pdf-page bg-white p-6 mb-6 border border-gray-200">
          <section className="grid grid-cols-6 gap-4">
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
        </div>

        {block.group.map((group, groupIndex) => (
          <div key={groupIndex} className="pdf-page bg-white p-6 mb-6 border border-gray-200">
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
                        <div className="grid grid-cols-4 gap-2">
                          {blockItem.addmeasures.map((measure, measureIndex) => (
                            <div key={measureIndex} className="bg-white border rounded p-2">
                              <div className="text-xs font-medium mb-1">Measurement {measureIndex + 1}</div>
                              <Info label="L" value={measure.l} />
                              <Info label="B" value={measure.b} />
                              <Info label="H" value={measure.h} />
                              <Info label="Area" value={measure.block_area} />
                              <Info label="Cost" value={measure.block_cost} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        ))}
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
