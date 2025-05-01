// app/api/vendor/route.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'


export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'vendor',
  })

  return Response.json(data)
}


export const POST = async (req: Request) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const body = await req.json()

  try {
    const vendor = await payload.create({
      collection: 'vendor',
      data: body,
    })

    return Response.json(vendor)
  } catch (error) {
    console.error('Error creating vendor:', error)
    return new Response(JSON.stringify({ error: 'Failed to create vendor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
