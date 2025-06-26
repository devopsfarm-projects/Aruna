// ❌ NO "use client" here
import { getTodiData, getGalaData, getVendors } from './lib/getVendorAccounts'
import ClientAccountPage from './ClientAccountPage' // the interactive component

export default async function Page({ searchParams }: { searchParams: { vendor?: string } }) {
  const vendorId = searchParams.vendor || null

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
