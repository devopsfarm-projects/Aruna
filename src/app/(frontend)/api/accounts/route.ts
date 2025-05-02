// app/api/accounts/route.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'


export const GET = async () => {
  const payload = await getPayload({   config: configPromise,  });

  const data = await payload.find({    collection: 'accounts'  })

  return Response.json(data)
}


export const POST = async (req: Request) => {
  const payload = await getPayload({    config: configPromise  })

  const body = await req.json()

  try {
    const createdAccounts = await payload.create({
      collection: 'accounts',
      data: body,
    })

    return Response.json(createdAccounts)
  } catch (error) {
    console.error('Error creating accounts:', error)
    return new Response(JSON.stringify({ error: 'Failed to create accounts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
