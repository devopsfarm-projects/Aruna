// app/api/vendor/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  const data = await req.json()

  const payload = await getPayload({ config })

  try {
    const vendor = await payload.create({
      collection: 'vendor', // your Payload collection name
      data: {
        vendor: data.vendor,
        vendor_no: data.vendor_no,
        address: data.address,
      },
    })

    return NextResponse.json(vendor, { status: 201 })
  } catch (err) {
    console.error('Error creating vendor:', err)
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 })
  }
}
