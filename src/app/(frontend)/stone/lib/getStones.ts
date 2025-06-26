// lib/getStones.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { Stone } from '@/payload-types' // Make sure your type path is correct

export async function getStones(): Promise<Stone[]> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'stone',
    limit: 100, // Adjust as needed
    depth: 1
  })

  return result.docs as Stone[]
}
