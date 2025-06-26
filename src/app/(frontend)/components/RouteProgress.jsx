'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'

export default function RouteProgress() {
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => NProgress.start()
    const handleStop = () => NProgress.done()

    window.addEventListener('beforeunload', handleStart)
    router.events?.on?.('routeChangeStart', handleStart)
    router.events?.on?.('routeChangeComplete', handleStop)
    router.events?.on?.('routeChangeError', handleStop)

    return () => {
      window.removeEventListener('beforeunload', handleStart)
      router.events?.off?.('routeChangeStart', handleStart)
      router.events?.off?.('routeChangeComplete', handleStop)
      router.events?.off?.('routeChangeError', handleStop)
    }
  }, [router])

  return null
}
