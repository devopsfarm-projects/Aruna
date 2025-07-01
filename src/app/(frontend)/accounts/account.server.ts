// src/app/(frontend)/accounts/account.server.ts
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getData() {
  const payload = await getPayload({ config })

  try {
    const [todiData, galaData, stoneData, todirisData] = await Promise.all([
      payload.find({ collection: 'Todi', limit: 100, depth: 1 }),
      payload.find({ collection: 'Gala', limit: 100, depth: 1 }),
      payload.find({ collection: 'stone', limit: 100, depth: 1 }),
      payload.find({ collection: 'TodiRaskat', limit: 100, depth: 1 }),
    ])

    return {
      todis: todiData.docs,
      galas: galaData.docs,
      stones: stoneData.docs,
      todiris: todirisData.docs,
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      todis: [],
      galas: [],
      stones: [],
      todiris: [],
    }
  }
}
