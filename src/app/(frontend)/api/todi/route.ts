// app/api/todi/route.ts

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const vendorId = req.nextUrl.searchParams.get('vendor')

  const todiQuery: any = { limit: 100 }
  if (vendorId) {
    todiQuery.where = { vender_id: { equals: vendorId } }
  }

  const [todis, vendors] = await Promise.all([
    payload.find({ collection: 'Todi', ...todiQuery }),
    payload.find({ collection: 'vendor' }),
  ])

  return Response.json({
    todis: todis.docs,
    vendors: vendors.docs,
  })
}
