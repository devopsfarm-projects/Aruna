// app/(frontend)/vendor/account/page.tsx

import { getPayload } from 'payload'
import config from '@payload-config'
import { Todi, Vendor } from '@/payload-types'
import TodiList from './components/VendorAccountCard'

async function getData(vendorId: string | null = null): Promise<Todi[]> {
  const payload = await getPayload({ config })
  const query: any = { limit: 100 }

  if (vendorId) {
    query.where = { vender_id: { equals: vendorId } }
  }

  const { docs } = await payload.find({ collection: 'Todi', ...query })
  return docs
}

async function getVendors(): Promise<Vendor[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'vendor' })
  return docs
}

export default async function Page({ searchParams }: { searchParams: { vendor?: string } }) {
  const vendorId = searchParams.vendor || null
  const [todis, vendors] = await Promise.all([
    getData(vendorId),
    getVendors(),
  ])

  return (
    <TodiList
      initialTodis={todis}
      initialVendors={vendors}
      initialVendorId={vendorId}
    />
  )
}
