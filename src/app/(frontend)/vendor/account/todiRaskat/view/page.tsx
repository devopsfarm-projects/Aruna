'use client'

import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { ApiResponse, BlockType, Vendor } from '../types'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useRouter, useSearchParams } from 'next/navigation'
import { Message } from '@/app/(frontend)/components/Message';

// Type for error response
interface ErrorResponse {
  errors?: Array<{ message: string }>
  message?: string
}

// Type guard function to check if an object is an ErrorResponse
function isErrorResponse(obj: unknown): obj is ErrorResponse {
  return typeof obj === 'object' && obj !== null &&
    ('errors' in obj || 'message' in obj)
}

export default function EditBlock() {
  const formRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentBlock, setCurrentBlock] = useState<BlockType | null>(null)
  const [newBlock, setNewBlock] = useState<BlockType | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [errorMessage, setErrorMessage] = useState('')
const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [receivedAmounts, setReceivedAmounts] = useState<Array<{
    id: string
    amount: number
    date: string
    description: string
  }>>([])
  const [deliveredBlock, setDeliveredBlock] = useState<Array<{
    id: string;
    delivered_block_area: number
    delivered_block_cost: number
    date: string
    description: string
  }>>([])
  const [vendors, setVendors] = useState<Vendor[]>([])

  // Helper function to format cost values with commas
  const formatCost = (cost: string | number | null) => {
    if (!cost) return ''
    return Number(cost).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Update currentBlock when newBlock changes
  useEffect(() => {
    if (newBlock) {
      setCurrentBlock(newBlock)
      setReceivedAmounts(newBlock.received_amount || [])
      setDeliveredBlock(newBlock.delivered_block?.map(item => ({
        ...item,
        id: Date.now().toString() // Generate a unique ID
      })) || [])
    }
  }, [newBlock])






  const id1 = Number(searchParams.get('id'));

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id1) return

      try {
        const blockRes = await axios.get<BlockType>(`/api/TodiRaskat/${id1}`)
        const blockData = blockRes.data
        const vendorsRes = await axios.get<ApiResponse<Vendor>>('/api/vendor')
        const vendorsData = vendorsRes.data.docs
        
        if (!blockData.addmeasures) {
          blockData.addmeasures = []
        }

        setCurrentBlock(blockData)
        setNewBlock(blockData)
        setVendors(vendorsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
        setLoadingData(false)
      }
    }

    fetchAllData()
  }, [id1])

  const calculateRemainingPayment = () => {
    const totalReceived = receivedAmounts.reduce((sum, amt) => sum + amt.amount, 0)
    const remaining = Number(newBlock?.final_cost || 0) - totalReceived
    return remaining.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const handleDownloadPDF = async () => {
    if (!formRef.current) return

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      })

      // Create canvas and convert to image
      const canvas = await html2canvas(formRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        onclone: (doc) => {
          // Remove any elements that shouldn't be in the PDF
          const summaryElement = doc.querySelector('.pdf-summary');
          if (summaryElement) {
            (summaryElement as HTMLElement).style.display = 'block';
          }
          
          // Apply styles to ensure black text and white background
          doc.querySelectorAll('*').forEach((element) => {
            const htmlElement = element as HTMLElement;
            htmlElement.style.color = 'black'
            htmlElement.style.backgroundColor = 'white'
            htmlElement.style.fontFamily = 'Arial, sans-serif'
          })
        }
      })

      const imgData = canvas.toDataURL('image/png', 1.0)
      
      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      // Calculate image dimensions to fit within PDF
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = imgWidth / imgHeight
      
      let width = pdfWidth
      let height = pdfWidth / ratio
      
      if (height > pdfHeight) {
        height = pdfHeight
        width = pdfHeight * ratio
      }

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, width, height)
      
      // Add page if content is too tall
      if (height > pdfHeight) {
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, 0, width, height - pdfHeight)
      }

      // Generate filename
      const filename = `TodiRaskat-${newBlock?.BlockType || 'Report'}-${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}.pdf`
      pdf.save(filename)
    } catch (err) {
      console.error('PDF generation error:', err)
      setErrorMessage('Failed to generate PDF. Please try again.')
      setShowErrorMessage(true)
    }
  }
  
  if (showErrorMessage) {
    return (
      <Message 
      setShowMessage={setShowErrorMessage} 
      path={'/users'} 
      type='error' 
      message={errorMessage}
    />
    )
  }

  if (showSuccessMessage) {
    return (
      <Message 
        setShowMessage={setShowSuccessMessage} 
        path={'/users'} 
        type='success' 
        message='User has been updated successfully.'
      />
    )
  }
  

   if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin  rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Preview Section */}
      <div className="bg-black rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Todi Raskat Block Report</h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
          Vendor: {typeof newBlock?.vender_id === 'object' ? (newBlock?.vender_id as Vendor)?.vendor : newBlock?.vender_id || 'N/A'}
          </p>
          <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Delivered Blocks</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-3 border-b">Area</th>
                    <th className="p-3 border-b">Cost</th>
                    <th className="p-3 border-b">Date</th>
                    <th className="p-3 border-b">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveredBlock.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3">{item.delivered_block_area}</td>
                      <td className="p-3">{formatCost(item.delivered_block_cost)}</td>
                      <td className="p-3">{new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                      <td className="p-3">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Received Amounts</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-3 border-b">Amount</th>
                    <th className="p-3 border-b">Date</th>
                    <th className="p-3 border-b">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {receivedAmounts.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3">{formatCost(item.amount)}</td>
                      <td className="p-3">{new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                      <td className="p-3">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Total Received: ₹{formatCost(receivedAmounts.reduce((sum, a) => sum + a.amount, 0))}</p>
                <p className="text-gray-600">Remaining Payment: ₹{calculateRemainingPayment()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden PDF Content */}
      <div className="pdf-summary hidden" ref={formRef} style={{
        width: '100%',
        maxWidth: '210mm',
        padding: '20px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '210mm',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>Todi Raskat Block Report</h2>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '20px',
            fontSize: '16px'
          }}>
            <div>
              <p style={{ marginBottom: '8px' }}>Vendor: {typeof newBlock?.vender_id === 'object' ? (newBlock?.vender_id as Vendor)?.vendor : newBlock?.vender_id || 'N/A'}</p>
              <p style={{ marginBottom: '8px' }}>Date: {new Date().toLocaleDateString()}</p>
              {newBlock?.BlockType && (
                <p style={{ marginBottom: '8px' }}>Block Type: {newBlock.BlockType}</p>
              )}
            </div>
            {newBlock?.final_cost && (
              <div>
                <p style={{ marginBottom: '8px' }}>Final Cost: ₹{formatCost(newBlock.final_cost)}</p>
              </div>
            )}
          </div>

          <h3 style={{ 
            marginBottom: '15px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>Delivered Blocks</h3>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '25px'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold'
              }}>
                <th style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  textAlign: 'left',
                  fontSize: '14px'
                }}>Area</th>
                <th style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  textAlign: 'left',
                  fontSize: '14px'
                }}>Cost</th>
                <th style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  textAlign: 'left',
                  fontSize: '14px'
                }}>Date</th>
                <th style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  textAlign: 'left',
                  fontSize: '14px'
                }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {deliveredBlock.map((item, idx) => (
                <tr key={idx} style={{
                  borderBottom: '1px solid #ddd'
                }}>
                  <td style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}>{item.delivered_block_area}</td>
                  <td style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}>{formatCost(item.delivered_block_cost)}</td>
                  <td style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}>{item.date}</td>
                  <td style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ 
            marginBottom: '15px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>Received Amounts</h3>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '25px'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold'
              }}>
                <th style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  textAlign: 'left',
                  fontSize: '14px'
                }}>Amount</th>
                <th style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  textAlign: 'left',
                  fontSize: '14px'
                }}>Date</th>
                <th style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  textAlign: 'left',
                  fontSize: '14px'
                }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {receivedAmounts.map((item, idx) => (
                <tr key={idx} style={{
                  borderBottom: '1px solid #ddd'
                }}>
                  <td style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}>{formatCost(item.amount)}</td>
                  <td style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}>{item.date}</td>
                  <td style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            fontSize: '16px'
          }}>
            <div>
              <p style={{ marginBottom: '8px' }}>Total Received: ₹{formatCost(receivedAmounts.reduce((sum, a) => sum + a.amount, 0))}</p>
              <p style={{ marginBottom: '8px' }}>Remaining Payment: ₹{calculateRemainingPayment()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




