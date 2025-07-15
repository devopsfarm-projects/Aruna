'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.visibility = 'visible'
  }, [pathname])

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}