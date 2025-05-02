// app/dashboard/page.jsx (if you're using Next.js 13+ app directory)
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import HomeClient from './dashboard'
const HomeServer = async () => {
  const payload = await getPayload({ config })

  const collectionNames = Object.keys(payload.collections || {})


  return (
    <>
      <HomeClient data={collectionNames} />
    </>
  )
}

export default HomeServer
