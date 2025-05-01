// app/api/mines/route.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'


export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'Mines',
  })

  return Response.json(data)
}


export const POST = async (req: Request) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const body = await req.json()

  try {
    const createdMine = await payload.create({
      collection: 'Mines',
      data: body,
    })

    return Response.json(createdMine)
  } catch (error) {
    console.error('Error creating mine:', error)
    return new Response(JSON.stringify({ error: 'Failed to create mine' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
