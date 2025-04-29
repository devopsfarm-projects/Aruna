import React from 'react'
import './globals.css'
import config from '@payload-config'
import { getPayload } from 'payload'

export const metadata = {
  description: '',
  title: 'ARUNA',
}

const payload = await getPayload({ config })



export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
