// ❌ NO "use client" here
import { getTodiData, getGalaData, getVendors } from './lib/getVendorAccounts'
import ClientAccountPage from './ClientAccountPage' // the interactive component
import type { PageProps } from '@/types/next-page'

export default async function Page({ searchParams }: PageProps) {
  const vendorId = searchParams.get('vendor') || null

  // ✅ Server-side fetching (safe to use fs, nodemailer, etc.)
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
