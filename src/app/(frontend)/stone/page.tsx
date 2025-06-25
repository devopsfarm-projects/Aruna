// app/stone/page.tsx (or any server-side entry point)
import { getStones } from './lib/getStones'
import StoneList from './stonelist'

export default async function Page() {
  const stones = await getStones()

  return <StoneList initialStones={stones} />
}
