import { getTodiData, getGalaData, getTodiRaskatData, getVendors } from './lib/getVendorAccounts'
import ClientAccountPage from './ClientAccountPage'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const vendorParam = resolvedSearchParams['vendor']
  const vendorId = Array.isArray(vendorParam) ? vendorParam[0] : vendorParam || null

  const [todis, galas, todiRaskats, vendors] = await Promise.all([
    getTodiData(vendorId),
    getGalaData(vendorId),
    getTodiRaskatData(vendorId),
    getVendors(),
  ])

  return (
    <ClientAccountPage
      initialTodis={todis}
      initialGalas={galas}
      initialTodiRaskats={todiRaskats}
      initialVendors={vendors}
      initialVendorId={vendorId}
    />
  )
}
