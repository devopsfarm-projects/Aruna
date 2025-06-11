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
        <Link  href="/" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <FaHome />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Home</span>
        </Link>
        <Link  href="/stone" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <GiStonePile />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Stone</span>
        </Link>
        <Link  href="/block" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <GiStoneBlock />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Block</span>
        </Link>
        <Link  href="/vendor" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <GrUserManager />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Vendor</span>
        </Link>
        <Link  href="/accounts" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <MdAccountCircle />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Accounts</span>
        </Link>
    </div>
</div>

    </>
  )
}
