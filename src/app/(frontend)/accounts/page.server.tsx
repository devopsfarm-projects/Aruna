import { fetchBlocks, fetchStones } from './lib/fetchData'
import type { Block, Stone } from '../../../payload-types'

export default async function AccountsPage() {
  const [stones, blocks] = await Promise.all([
    fetchStones(),
    fetchBlocks()
  ])

  return <StoneList initialStones={stones} initialBlocks={blocks} />
}
