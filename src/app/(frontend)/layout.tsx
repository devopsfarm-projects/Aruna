import React from 'react'
import './globals.css'
import Navbar from './navbar/page'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Login from './login/page'
export const metadata = {
  description: '',
  title: 'ARUNA',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  return (
    <html lang="en" className="dark">
      <body className="bg-white dark:bg-black">
          {user && <Navbar />}
          {!user && <Login />}
          {user && <main className="flex-1">{children}</main>}
      </body>
    </html>
  )
}