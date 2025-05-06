'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { RiAccountCircle2Fill } from 'react-icons/ri'

export default function Navbar({ collections }: { collections: string[] }) {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = () => {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (err) {
        console.error('Failed to parse user data from localStorage', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/api/logout'
  }

  if (loading || !user) return null

  return (
    <>
        <div
        className="fusion-layout-column fusion_builder_column fusion-builder-column-8 fusion_builder_column_1_1 1_1 fusion-flex-column"
        style={
          {
            '--awb-z-index': '9999999999',
            '--awb-bg-size': 'cover',
            '--awb-width-large': '100%',
            '--awb-margin-top-large': '0px',
            '--awb-spacing-right-large': '0',
            '--awb-margin-bottom-large': '-40px',
            '--awb-spacing-left-large': '0',
            '--awb-width-medium': '100%',
            '--awb-order-medium': '0',
            '--awb-spacing-right-medium': '0',
            '--awb-spacing-left-medium': '0',
            '--awb-width-small': '100%',
            '--awb-order-small': '0',
            '--awb-spacing-right-small': '0',
            '--awb-spacing-left-small': '0',
          } as React.CSSProperties
        }
      >
        <div className="fusion-column-wrapper fusion-column-has-shadow fusion-flex-justify-content-flex-start fusion-content-layout-column">
          <div
            className="fusion-section-separator section-separator paper fusion-section-separator-1"
            style={{
              ['--awb-spacer-height' as any]: '20px',
              ['--awb-divider-height' as any]: '20px',
              ['--awb-spacer-padding-top' as any]: 'inherit',
              ['--awb-bg-size' as any]: '100% 20px',
              ['--awb-bg-size-medium' as any]: '100% 100%',
              ['--awb-bg-size-small' as any]: '100% 100%',
            }}
          >
            <div className="fusion-section-separator-svg fusion-section-separator-fullwidth">
              <div
                className="fusion-paper-candy-sep fusion-section-separator-svg-bg"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='100%' viewBox='0 0 1667 102' preserveAspectRatio='none' fill='rgba(66,73,79,1)'><path d='M0 102V18L14 23H34L43 28H70L83 23L88 18L110 23L165 38C169.13 36.9132 174.712 35.4721 180.5 34.0232C184.719 32.9671 190.047 35.9301 194 35C201.258 33.2924 206.255 28 208 28C209.361 28 213.031 30.7641 215.5 29.5C216.777 28.8461 216.634 24.4684 218 23.652C221.756 21.407 227.081 29.2742 229.5 27.5L240.5 20.625H249.5L256 17.4737L267 14L278 25L280.5 31.652L287 29.5L291.5 35.5L298 38L304 35.5L314 38L325 37L329.5 38H336L348 35.5L354 28H365L370.5 20.5L382.5 20.875L389.5 17L402 20.875L409.5 17L424.5 18.5L435.5 17L451 18.5L463 17L471.5 23L478.5 20.875L487 24.5L498.5 25.5L505 28H510C510.958 29.5968 510.605 33.4726 512.5 35.5C514.561 37.7047 518.916 38 521 38H530L585 28L616 17L632 10L651.5 13.5L668.5 21.7L676.5 18.1L686 23.5L694.5 21.7L705.5 27.5L717 26.2L727 30.6786H733.5L744 37.5L754 38L786 28H814L868 17L887 19.1111L898 23L910 21.6667L917 24L927 22.3333L933 24L943.5 20.1957L956.5 21L964 17.5217L968 17L980 10H1005L1015 17H1052L1110 10L1132 0L1141 1.8L1156.5 8L1165.5 6.7L1180.5 11.625H1188.75L1195.5 14.6944H1201.5L1209.5 18L1221 19.3889L1235 27L1268 38L1311 28L1316 23L1338 17L1354 28L1364 38L1392 28.6667L1404.5 30L1409 23H1419.5L1427 17L1437 20L1445 28.6667L1456 23L1470.5 28.6667L1497.5 17L1505 10L1514 13L1522 10L1530.5 12L1536 5L1543.5 8.05L1553 5.40854L1563 10L1567 0L1584 8.05L1594 6.55L1604.5 2L1614.5 4.75L1631 11.5L1647.5 8.05L1667 18V102H0Z' fill='var(--awb-color6)'/></svg>")`,
                  transform: 'rotateX(180deg)',
                }}
              ></div>
            </div>
            <div className="fusion-section-separator-spacer fusion-section-separator-fullwidth">
              <div className="fusion-section-separator-spacer-height"></div>
            </div>
          </div>
        </div>
      </div>
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50 shadow">
        <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-gray-800 hover:text-black"
          >
            <img
              src="/image.png"
              alt="The Jodhpur Mine Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-2xl font-semibold tracking-wide text-green-600">
              The Jodhpur Mine
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user?.email && <span className="text-sm text-gray-700 font-medium">{user.email}</span>}
            <RiAccountCircle2Fill className="text-gray-600 w-8 h-8" title="User Account" />
          </div>
        </nav>
      </header>

      <div className="flex pt-[72px]">
        <aside className="w-64 bg-white p-6 shadow-md hidden md:flex flex-col min-h-screen">
          <div className="flex items-center gap-2 mb-8">
            <img src="/image.png" alt="The Jodhpur Mine Logo" className="h-10 w-auto" />
          </div>

          <div className="mb-6 text-sm text-gray-600">
            Logged in as{' '}
            <span className="font-semibold text-pink-500">
              {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'User'}
            </span>
          </div>

          <nav className="flex flex-col gap-3 text-gray-700 font-medium">
            <Link href="/dashboard">
              <span className="hover:text-blue-600 transition-colors cursor-pointer">
                Dashboard
              </span>
            </Link>

            {collections.slice(0, 10).map((col) => (
              <Link key={col} href={`/${col}`}>
                <span className="capitalize hover:text-blue-600 transition-colors cursor-pointer">
                  {col}
                </span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="mt-6 text-left text-red-500 hover:text-red-600 font-semibold"
            >
              Logout
            </button>
          </nav>
        </aside>
      </div>
  
    </>
  )
}
