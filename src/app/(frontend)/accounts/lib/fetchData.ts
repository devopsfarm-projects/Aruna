import payload from '../lib/payload'
import type { Block, Stone } from '../../../payload-types'

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

export async function fetchBlocks() {
  try {
    const res = await payload.get<BlockResponse>('/Block')
    return res.data.docs
  } catch (err) {
    console.error('Error fetching blocks:', err)
    return []
  }
}

export async function fetchStones() {
  try {
    const res = await fetch('/api/stone')
    const data = await res.json()
    return data.docs || []
  } catch (err) {
    console.error('Error fetching stones:', err)
    return []
  }
}
