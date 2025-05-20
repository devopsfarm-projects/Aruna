import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { Users } from '../../../../../collections/Users'
import { Block } from '../../../../../collections/Block'
import { Vendor } from '../../../../../collections/Vendor'
import { Mines } from '../../../../../collections/Mines'

const payloadConfig = buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  collections: [Users, Block, Vendor, Mines],
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Initialize Payload CMS
    const payload = await payloadConfig
    
    // Get the ID from params
    const id = params.id
    
    // Get the block
    const response = await payload.api.find({
      collection: 'Block',
      where: {
        id: {
          equals: id,
        },
      },
      depth: 1,
    })
    
    return new Response(JSON.stringify(response))
  } catch (error) {
    console.error('Error fetching block:', error)
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      })
    }
    return new Response(JSON.stringify({ error: 'Failed to fetch block' }), {
      status: 500,
    })
  }
}
