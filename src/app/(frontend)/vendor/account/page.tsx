import { getTodiData, getGalaData, getVendors } from './lib/getVendorAccounts'
import ClientAccountPage from './ClientAccountPage'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const vendorParam = resolvedSearchParams['vendor']
  const vendorId = Array.isArray(vendorParam) ? vendorParam[0] : vendorParam || null

  const [todis, galas, vendors] = await Promise.all([
    getTodiData(vendorId),
    getGalaData(vendorId),
    getVendors(),
  ])

  return (
    <ClientAccountPage
      initialTodis={todis}
      initialGalas={galas}
      initialVendors={vendors}
      initialVendorId={vendorId}
    />
  )
}
