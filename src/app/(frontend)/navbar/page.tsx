'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { RiAccountCircle2Fill, RiMenu2Fill, RiCloseFill } from 'react-icons/ri'
import { FaHome } from 'react-icons/fa'
import Image from 'next/image'
import { GiStoneBlock, GiStonePile } from 'react-icons/gi'
import { MdAccountCircle } from 'react-icons/md'
import { GrUserManager } from 'react-icons/gr'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('dropdown-user')
      if (menu && !menu.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

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
  }, [setUser])

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <Link href="/" className="flex ms-2 md:me-24">
                <Image
                  src="/image.png"
                  className="h-12 w-20 me-3"
                  height={205}
                  width={205}
                  alt="The Jodhpur Mines Logo"
                  priority
                />
              </Link>
              
            
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {/* <FaHome className="inline-block mr-1" /> */}
                Home
              </Link>
              <Link
                href="/stone"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {/* <GiStonePile className="inline-block mr-1" /> */}
                Stone
              </Link>
              <Link
                href="/block"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {/* <GiStoneBlock className="inline-block mr-1" /> */}
                Block
              </Link>
              <Link
                href="/vendor"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {/* <GrUserManager className="inline-block mr-1" /> */}
                Vendor
              </Link>
              <Link
                href="/accounts"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {/* <MdAccountCircle className="inline-block mr-1" /> */}
                Accounts
              </Link>
            </div>

            {/* User menu */}
            <div className="flex items-center">
              <div className="flex items-center ms-3 relative">
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  >
                    <span className="sr-only">Open user menu</span>
                    <RiAccountCircle2Fill className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
                <div
                  className={`absolute right-0 top-full mt-2 z-50 ${isUserMenuOpen ? 'block' : 'hidden'} w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600`}
                  id="dropdown-user"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-3" role="none">
                    <p className="text-sm text-gray-900 dark:text-white" role="none">
                      {user?.name || 'User'}
                    </p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  <div className="px-4 py-3">
                    <label className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                      Dark Mode
                      <input
                        type="checkbox"
                        className="ml-2"
                        checked={isDarkMode}
                        onChange={(e) => {
                          setIsDarkMode(e.target.checked)
                          localStorage.setItem('theme', e.target.checked ? 'dark' : 'light')
                          document.documentElement.classList.toggle('dark', e.target.checked)
                        }}
                      />
                    </label>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

                {/* Mobile menu button */}
                <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {isMobileMenuOpen ? <RiCloseFill size={24} /> : <RiMenu2Fill size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700"
          >
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <RiCloseFill size={24} />
          </button>
        </div>

        <nav className="h-full flex flex-col">
          <div className="flex-1 px-4 py-4 space-y-1">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaHome className="w-5 h-5 mr-3" />
              Home
            </Link>
            <Link
              href="/stone"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <GiStonePile className="w-5 h-5 mr-3" />
              Stone
            </Link>
            <Link
              href="/block"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <GiStoneBlock className="w-5 h-5 mr-3" />
              Block
            </Link>
            <Link
              href="/vendor"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <GrUserManager className="w-5 h-5 mr-3" />
              Vendor
            </Link>
            <Link
              href="/accounts"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <MdAccountCircle className="w-5 h-5 mr-3" />
              Accounts
            </Link>
          </div>
        </nav>
      </motion.div>
      )}
      </AnimatePresence>

      {/* Content wrapper */}
      <div className="pt-16 lg:pt-16 pl-0 lg:pl-0 transition-all duration-300 ease-in-out" style={{
        marginRight: isMobileMenuOpen ? '16rem' : '0'
      }}>
        {/* Main content will go here */}
      </div>
    </>
  )
}
