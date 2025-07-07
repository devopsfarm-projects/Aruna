'use client'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useDarkMode } from './DarkModeProvider'
import { useEffect, useState } from 'react'
import RouteProgress from '../components/RouteProgress.jsx'
import Link from 'next/link'

const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Stone', href: '/stone', current: false },
  { name: 'Block', href: '/block', current: false },
  { name: 'Vendor', href: '/vendor', current: false },
  { name: 'Accounts', href: '/accounts', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isName, setIsName] = useState('')
  const { isDarkMode, toggleDarkMode } = useDarkMode()



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


    useEffect(() => {
      const userStr = localStorage.getItem('user')
      try {
        const user = userStr ? JSON.parse(userStr) : {}
        setIsName(user?.name)
      } catch (err) {
        console.error('Failed to parse user from localStorage', err)
      }
    }, [])
  

  return (
    <>
   
    <Disclosure as="nav" className="bg-white pt-6 sm:pt-0 dark:bg-black border-b dark:border-gray-700 shadow-sm dark:shadow-lg">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center -md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-900 hover:text-white dark:hover:bg-gray-800 dark:hover:text-white focus:ring-2 focus:ring-white dark:focus:ring-gray-400 focus:outline-none focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <Link href="/">
          <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="/png.png"
                className="h-8 w-auto"
              />
            </div></Link>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white dark:bg-gray-800 dark:text-white' : 'text-gray-700 hover:bg-gray-900 hover:text-white dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
                      '-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          

            {/* Profile dropdown */}
            <Menu as="div" className="relative  ml-3">
              <div>
                <MenuButton className="relative flex -full rounded-full bg-gray-900 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-white dark:focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 dark:focus:ring-offset-gray-800 focus:outline-none">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only dark:text-black">Open user menu</span>
                  <img
                    alt=""
                    src="https://png.pngtree.com/png-vector/20231019/ourlarge/pngtree-user-profile-avatar-png-image_10211468.png"
                    className="size-8 -full border-gray-300 rounded-full dark:border-gray-600"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-50 mt-2 w-48 origin-top-right -md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/5 transition focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 data-focus:bg-gray-100 dark:data-focus:bg-gray-700 data-focus:outline-none"
                  >
                    {isName}
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={toggleDarkMode}
                    className="block w-full px-4 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 data-focus:bg-gray-100 dark:data-focus:bg-gray-700 data-focus:outline-none flex items-center justify-between"
                  >
                    Dark Mode
                    {isDarkMode ? (
                      <MoonIcon className="ml-2 h-5 w-5" />
                    ) : (
                      <SunIcon className="ml-2 h-5 w-5" />
                    )}
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                  onClick={handleLogout}

                    className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 data-focus:bg-gray-100 dark:data-focus:bg-gray-700 data-focus:outline-none"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white dark:bg-gray-800 dark:text-white' : 'text-gray-700 hover:bg-gray-900 hover:text-white dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
                'block -md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
    <RouteProgress />
    </>
  )
}
