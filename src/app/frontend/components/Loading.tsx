"use client"

import React from 'react'

interface LoadingProps {
  fullScreen?: boolean
}

export default function Loading({ fullScreen = true }: LoadingProps) {
  return (
    <div className={`fixed inset-0 flex items-center justify-center ${fullScreen ? 'z-50' : ''}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <div className="ml-4 text-gray-600 dark:text-gray-300">Loading...</div>
    </div>
  )
}
