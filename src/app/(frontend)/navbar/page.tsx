// app/navbar/page.jsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Navbar from './navbar'

const Nav = async ({ user }: { user: any }) => {
  const payload = await getPayload({ config })

  const collectionNames = Object.keys(payload.collections || {})

  return <Navbar collections={collectionNames} user={user} />
}

export default Nav
