import React from 'react'
import './globals.css'
import Navbar from './navbar/page'

export const metadata = {
  description: '',
  title: 'ARUNA',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-white dark:bg-gray-900 dark:text-white">
        <div className="min-h-screen flex">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
