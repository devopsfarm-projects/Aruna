'use client'
import { useEffect, useState, useCallback } from 'react'
import payload from './lib/payload'
import Link from 'next/link'
import type { Block } from '../../../payload-types'

export default function BlockList() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  type BlockResponse = {
    docs: Block[]
    totalDocs: number
    limit: number
    totalPages: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }

  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await payload.get<BlockResponse>('/Block')
      setBlocks(res.data.docs)
    } catch (err) {
      setError('Failed to fetch blocks')
      console.error('Error fetching blocks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBlocks()
  }, [fetchBlocks])

  const deleteBlock = async (id: string | number) => {
    if (id === null || id === undefined) return
    await payload.delete(`/Block/${id}`)
    setBlocks((prev: Block[]) => prev.filter((b) => b.id?.toString() !== id.toString()))
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          <span className="text-indigo-600 dark:text-indigo-400">Block</span> Records
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => {
                setError(null)
                setLoading(true)
                fetchBlocks()
              }}
              className="mt-2 text-red-500 hover:text-red-400 dark:text-red-400 dark:hover:text-red-300"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <Link href="/block/addblock" className="bg-indigo-600 w-40 mb-4 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 flex items-center gap-2">
              <span className="font-medium">Add Block</span>
            </Link>

            <div className="space-y-6">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/20">
                          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {block.BlockType.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                            {block.BlockType}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">Quantity: {block.qty}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {block.id && (
                        <>
                          <Link
                            href={`/block/editblock/${block.id}`}
                            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
                          >
                            <span className="font-medium">Edit</span>
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={async () => {
                              if (!block.id) return
                              if (window.confirm('Are you sure you want to delete this block?')) {
                                try {
                                  setLoading(true)
                                  await deleteBlock(block.id)
                                } catch (err) {
                                  setError('Failed to delete block')
                                  console.error('Error deleting block:', err)
                                } finally {
                                  setLoading(false)
                                }
                              }
                            }}
                            className="bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
                          >
                            <span className="font-medium">Delete</span>
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
