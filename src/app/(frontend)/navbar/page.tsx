'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { RiAccountCircle2Fill } from 'react-icons/ri'
import { FaHome } from 'react-icons/fa'
import Image from 'next/image'
import { GiStoneBlock, GiStonePile } from 'react-icons/gi'
import { MdAccountCircle } from 'react-icons/md'
import { GrUserManager } from 'react-icons/gr'

export default function Navbar() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

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
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          const userData = await response.text()
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
      <nav className="fixed pt-6 top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
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
                
                {/* <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-gold-600">The Jodhpur Mines</span> */}
              </Link>
            </div>
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
            </div>
          </div>
        </div>
      </nav>

 
      

<div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
    <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        <button 
          onClick={() => handleLinkClick('/dashboard')}
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group relative">
          {isLoading && activeLink === '/dashboard' ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          ) : (
            <>
              <FaHome />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Home</span>
            </>
          )}
        </button>
        <button 
          onClick={() => handleLinkClick('/stone')}
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group relative">
          {isLoading && activeLink === '/stone' ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="loading loading-spinner w-5 h-5"></div>
            </div>
          ) : (
            <>
              <GiStonePile />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Stone</span>
            </>
          )}
        </button>
        <button 
          onClick={() => handleLinkClick('/block')}
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group relative">
          {isLoading && activeLink === '/block' ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="loading loading-spinner w-5 h-5"></div>
            </div>
          ) : (
            <>
              <GiStoneBlock />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Block</span>
            </>
          )}
        </button>
        <button 
          onClick={() => handleLinkClick('/vendor')}
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group relative">
          {isLoading && activeLink === '/vendor' ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="loading loading-spinner w-5 h-5"></div>
            </div>
          ) : (
            <>
              <GrUserManager />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Vendor</span>
            </>
          )}
        </button>
        <button 
          onClick={() => handleLinkClick('/accounts')}
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group relative">
          {isLoading && activeLink === '/accounts' ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="loading loading-spinner w-5 h-5"></div>
            </div>
          ) : (
            <>
              <MdAccountCircle />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Accounts</span>
            </>
          )}
        </button>
    </div>
</div>

    </>
  )
}
