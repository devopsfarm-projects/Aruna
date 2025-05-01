// app/layout.tsx
import React from 'react'
import './globals.css'
import Navbar from './navbar/page'
import NavbarTop from './navbar/navbartop'

export const metadata = {
  description: '',
  title: 'ARUNA',
}


export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100 flex">
         <NavbarTop />
         <Navbar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
