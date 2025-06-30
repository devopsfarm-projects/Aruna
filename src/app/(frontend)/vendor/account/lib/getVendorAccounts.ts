// lib/getVendorAccounts.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { Todi, Gala, TodiRaskat, Vendor } from '@/payload-types'

export async function getTodiData(vendorId: string | null = null): Promise<Todi[]> {
  const payload = await getPayload({ config })
  const query: any = { limit: 100 }
  if (vendorId) query.where = { vender_id: { equals: vendorId } }

  const { docs } = await payload.find({ collection: 'Todi', ...query }) as { docs: Todi[] }

  return docs.map(doc => ({
    ...doc,
    BlockType: doc.BlockType || 'Brown',
    l: doc.l || 0,
    b: doc.b || 0,
    h: doc.h || 0,
    // ... (rest of transformation)
  }))
}

export async function getGalaData(vendorId: string | null = null): Promise<Gala[]> {
  const payload = await getPayload({ config })
  const query: any = { limit: 100 }
  if (vendorId) query.where = { vender_id: { equals: vendorId } }

  const { docs } = await payload.find({ collection: 'Gala', ...query }) as { docs: Gala[] }
  return docs
}

export async function getVendors(): Promise<Vendor[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'vendor' })
  return docs
}


export async function getTodiRaskatData(vendorId: string | null = null): Promise<TodiRaskat[]> {
  const payload = await getPayload({ config })
  const query: any = { limit: 100 }
  if (vendorId) query.where = { vender_id: { equals: vendorId } }

  const { docs } = await payload.find({ collection: 'TodiRaskat', ...query }) as { docs: TodiRaskat[] }

  return docs.map(doc => ({
    ...doc,
    BlockType: doc.BlockType || 'Brown',
    l: doc.l || 0,
    b: doc.b || 0,
    h: doc.h || 0,
    // ... (rest of transformation)
  }))
}