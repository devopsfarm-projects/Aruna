import { fetchBlocks, fetchStones } from './lib/fetchData'
import StoneList from './StoneList'

export default async function AccountsPage() {
  const [stones, blocks] = await Promise.all([
    fetchStones(),
    fetchBlocks()
  ])

  return <StoneList initialStones={stones} initialBlocks={blocks} />
}
