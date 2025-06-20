import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import TodiFilter from './components/TodiFilter'

async function getData() {
  const payload = await getPayload({ config })
  const [todisRes, vendorsRes] = await Promise.all([
    payload.find({
      collection: 'Todi',
      limit: 100,
    }),
    payload.find({
      collection: 'vendor',
      limit: 100,
    })
  ])
  return {
    todis: todisRes.docs,
    vendors: vendorsRes.docs
  }
}

export default async function account() {
  const { todis, vendors } = await getData();

  return (
    <div className="max-w-7xl py-24 mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Todi List
      </h1>
      <TodiFilter todis={todis} vendors={vendors} />
    </div>
  )
}
            
      