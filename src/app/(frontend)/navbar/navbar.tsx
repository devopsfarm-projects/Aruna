'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { RiAccountCircle2Fill, RiSunLine, RiMoonLine } from 'react-icons/ri'
import Image from 'next/image'
import { motion } from 'framer-motion'
export default function Navbar({ collections }: { collections: string[] }) {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    <div className="fixed top-0 left-0 right-0 z-50">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
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

           

              {/* Desktop menu */}
              <motion.ul 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:flex gap-4"
              >
                <motion.li 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                    <span className="text-sm">Dashboard</span>
                  </Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/stone" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                    <span className="text-sm">Stone</span>
                  </Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/block" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                    <span className="text-sm">Block</span>
                  </Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/truck" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                    <span className="text-sm">Truck</span>
                  </Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/labour" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                    <span className="text-sm">Labour</span>
                  </Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/vendor" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                    <span className="text-sm">Vendor</span>
                  </Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/transactions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-md">
                    <span className="text-sm">Transactions</span>
                  </Link>
                </motion.li>
              </motion.ul>
            </div>

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
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-auto"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {/* Mobile menu */}
              {isMobileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden absolute left-0 top-full w-full bg-white dark:bg-gray-800 shadow-lg border-t dark:border-gray-700"
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="p-4"
                  >
                    <motion.ul 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.2 }}
                      className="space-y-2"
                    >
                      <motion.li 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link href="/dashboard" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-2 rounded-md">
                          Dashboard
                        </Link>
                      </motion.li>
                      <motion.li 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link href="/stone" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-2 rounded-md">
                          Stone
                        </Link>
                      </motion.li>
                      <motion.li 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link href="/block" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-2 rounded-md">
                          Block
                        </Link>
                      </motion.li>
                      <motion.li 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link href="/truck" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-2 rounded-md">
                          Truck
                        </Link>
                      </motion.li>
                      <motion.li 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link href="/labour" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-2 rounded-md">
                          Labour
                        </Link>
                      </motion.li>
                      <motion.li 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link href="/vendor" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-2 rounded-md">
                          Vendor
                        </Link>
                      </motion.li>
                      <motion.li 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link href="/transactions" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-2 rounded-md">
                          Transactions
                        </Link>
                      </motion.li>
                    </motion.ul>
                  </motion.div>
                </motion.div>
              )}

              <div className="relative group">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="User Account"
                >
                  <RiAccountCircle2Fill className="w-5 h-5 text-gray-600 dark:text-gray-300" />
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
                      <motion.li 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link
                          href="/users"
                          className="block px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Edit User / All Users</span>
                          </span>
                        </Link>
                      </motion.li>
                      <motion.li 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
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
                      </motion.li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
