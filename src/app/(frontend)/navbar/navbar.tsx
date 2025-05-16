'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { RiAccountCircle2Fill, RiSunLine, RiMoonLine } from 'react-icons/ri'
import Image from 'next/image'
import Cookies from 'js-cookie'

export default function Navbar({ collections }: { collections: string[] }) {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/api/logout'
  }

  // Initialize dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem('theme')
    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(savedMode === 'dark' || (savedMode === null && systemPref))
    document.documentElement.classList.toggle('dark', isDarkMode)

    // Listen for color scheme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches)
        document.documentElement.classList.toggle('dark', e.matches)
      }
    }
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [isDarkMode])

  // Fetch user data
  useEffect(() => {
    const fetchUser = () => {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (err) {
        console.error('Failed to fetch user data', err)
      }
    }

    fetchUser()
  }, [])

  // Toggle dark mode callback
  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newMode)
  }, [isDarkMode])

  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
          setIsDarkMode(e.matches)
          document.documentElement.classList.toggle('dark', e.matches)
        }
      }
      mediaQuery.addEventListener('change', handleChange)

      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    } catch (err) {
      console.error('Failed to set up color scheme listener', err)
    }
  }, [isDarkMode])

  // const token = Cookies.get('payload-token')
  // if (!token) return null

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 fixed top-0 left-0 w-full z-50 shadow">
        <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:text-black"
          >
            <Image
              src="/image.png"
              alt="The Jodhpur Mine Logo"
              width={205}
              height={205}
              className="h-10 w-auto object-contain"
            />
            <span className="text-2xl font-semibold tracking-wide text-green-600 dark:text-green-400">
              The Jodhpur Mine
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user?.email && <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{user.email}</span>}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? (
                <RiSunLine className="w-6 h-6 text-yellow-400" />
              ) : (
                <RiMoonLine className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <RiAccountCircle2Fill className="text-gray-600 dark:text-gray-300 w-8 h-8" title="User Account" />
          </div>
        </nav>
      </header>

      <div className="flex pt-[72px]">
        <aside className="w-64 bg-white dark:bg-gray-800 p-6 shadow-md hidden md:flex flex-col min-h-screen">
          <div className="flex items-center gap-2 mb-8">
            <Image src="/image.png" alt="The Jodhpur Mine Logo" width={205} height={205} className="h-10 w-auto object-contain" />
          </div>

          <div className="mb-6 text-sm text-gray-600 dark:text-gray-300">
            Logged in as{' '}
            <span className="font-semibold text-pink-500 dark:text-pink-400">
              {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'User'}
            </span>
          </div>

          <nav className="flex flex-col gap-3 text-gray-700 dark:text-gray-200 font-medium">
            <Link href="/dashboard">
              <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                Dashboard
              </span>
            </Link>

            {collections.slice(0, 10).map((col) => (
              <Link key={col} href={`/${col}`}>
                <span className="capitalize hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  {col}
                </span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="mt-6 text-left text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-semibold"
            >
              Logout
            </button>
          </nav>
        </aside>
      </div>
    </>
  )
}
