// app/navbar/page.jsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Navbar from './navbar'

const Nav = async () => {
  const payload = await getPayload({ config })

  const collectionNames = Object.keys(payload.collections || {})

  return <>
  
<Navbar/>


<div className="p-4 sm:ml-64">
 
</div>

  </>
}

export default Nav
