'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { RiAccountCircle2Fill, RiSunLine, RiMoonLine } from 'react-icons/ri'
import Image from 'next/image'
export default function Navbar({ collections }: { collections: string[] }) {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

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

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 fixed top-0 left-0 w-full z-50 shadow">
        <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-black"
          >
            <Image
              src="/image.png"
              alt="The Jodhpur Mine Logo"
              width={205}
              height={205}
              className="h-8 w-auto object-contain"
            />
            <span className="text-xl font-semibold tracking-wide text-green-600 dark:text-green-400">
              The Jodhpur Mine
            </span>
          </Link>

          <ul className="flex gap-4">
            <Link href="/dashboard">
              <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                <span className="text-sm">Dashboard</span>
              </li>
            </Link>
            <Link href="/stone">
              <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                <span className="text-sm">Stone</span>
              </li>
            </Link>
            <Link href="/block">
              <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                <span className="text-sm">Block</span>
              </li>
            </Link>
            <Link href="/truck">
              <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                <span className="text-sm">Truck</span>
              </li>
            </Link>
            <Link href="/labour">
              <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                <span className="text-sm">Labour</span>
              </li>
            </Link>
            <Link href="/vendor">
              <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                <span className="text-sm">Vendor</span>
              </li>
            </Link>
            <Link href="/transactions">
              <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                <span className="text-sm">Transactions</span>
              </li>
            </Link>
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              <span className="sr-only">Toggle Dark Mode</span>
              {isDarkMode ? (
                <RiSunLine className="w-5 h-5 text-yellow-400" />
              ) : (
                <RiMoonLine className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <div className="relative group">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <RiAccountCircle2Fill
                  className="w-6 h-6 text-gray-600 dark:text-gray-300"
                  title="User Account"
                />
                <span className="sr-only">Toggle User Menu</span>
                
                <svg
                  className={`w-4 h-4 transform transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border dark:border-gray-700">
                  <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <RiAccountCircle2Fill className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{user?.email || 'User'}</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/users"
                        className="block px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Edit User / All Users</span>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors rounded-md"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
