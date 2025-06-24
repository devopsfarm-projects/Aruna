// app/(frontend)/vendor/account/page.tsx

import { getPayload } from 'payload'
import config from '@payload-config'
import { Todi, Vendor } from '@/payload-types'
import TodiList from './components/VendorAccountCard'
import { useSearchParams } from 'next/navigation'

async function getData(vendorId: string | null = null): Promise<Todi[]> {
  const payload = await getPayload({ config })
  const query: any = { limit: 100 }

  if (vendorId) {
    query.where = { vender_id: { equals: vendorId } }
  }

  const { docs } = await payload.find({ collection: 'Todi', ...query }) as { docs: Todi[] }
  
  // Transform the docs to match the Todi interface
  return docs.map(doc => ({
    ...doc,
    BlockType: doc.BlockType || 'Brown',
    l: doc.l || 0,
    b: doc.b || 0,
    h: doc.h || 0,
    blockType: doc.BlockType || 'Brown',
    vendorId: typeof doc.vender_id === 'object' ? doc.vender_id?.id || 0 : doc.vender_id || 0,
    blockCost: doc.todi_cost || 0,
    totalTodiArea: doc.total_todi_area || 0,
    totalTodiCost: doc.total_todi_cost || 0,
    hydraCost: doc.hydra_cost || 0,
    groupCost: doc.group?.[0]?.total_block_cost || 0,
    partyRemainingPayment: doc.partyRemainingPayment || 0,
    totalBlockArea: doc.group?.[0]?.total_block_area || 0,
    totalBlockCost: doc.group?.[0]?.total_block_cost || 0,
    remainingAmount: doc.group?.[0]?.remaining_amount || 0,
    frontLength: doc.group?.[0]?.block?.[0]?.addmeasures?.[0]?.l || 0,
    frontBreadth: doc.group?.[0]?.block?.[0]?.addmeasures?.[0]?.b || 0,
    frontHeight: doc.group?.[0]?.block?.[0]?.addmeasures?.[0]?.h || 0,
    backLength: doc.group?.[0]?.block?.[0]?.addmeasures?.[1]?.l || 0,
    backBreadth: doc.group?.[0]?.block?.[0]?.addmeasures?.[1]?.b || 0,
    backHeight: doc.group?.[0]?.block?.[0]?.addmeasures?.[1]?.h || 0,
    totalQuantity: doc.group?.[0]?.block?.[0]?.addmeasures?.length || 0,
    issuedQuantity: doc.group?.[0]?.block?.[0]?.addmeasures?.filter(measure => measure.block_cost)?.length || 0,
    leftQuantity: (doc.group?.[0]?.block?.[0]?.addmeasures?.length || 0) - (doc.group?.[0]?.block?.[0]?.addmeasures?.filter(measure => measure.block_cost)?.length || 0),
    transportCost: doc.truck_cost || 0,
    depreciation: doc.depreciation || 0,
  })) as Todi[]
}

async function getVendors(): Promise<Vendor[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'vendor' })
  return docs
}

export default async function Page({ searchParams }: { searchParams: Promise<{ vendor?: string }> }) {
  const searchParamsResolved = await searchParams
  const vendorId = searchParamsResolved.vendor || null
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
