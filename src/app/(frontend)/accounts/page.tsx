import { getData } from './account.server'
import ClientAccountPage from './ClientAccountPage'

export default async function Page() {
  const { todis, galas, stones, todiris } = await getData()
  return <ClientAccountPage todis={todis} galas={galas} stones={stones} todiris={todiris} />
}
