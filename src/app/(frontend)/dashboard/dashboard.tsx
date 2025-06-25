'use client'
import Link from 'next/link'
import { GiStonePile, GiStoneWall } from 'react-icons/gi'
import { MdOutlineSupervisorAccount, MdAccountBalance, MdConstruction } from 'react-icons/md'
import { FaChartLine, FaUsers, FaMoneyBillWave, FaCube } from 'react-icons/fa'

interface CardProps {
  title: string
  color: string
  icon: React.ReactNode
  link: string
  description?: string
  stats: string
  count?: number
}

export default function DashboardPage() {
  const cards: CardProps[] = [
    {
      title: 'Vendor Management',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
      icon: <MdOutlineSupervisorAccount size={32} className="text-white" />,
      link: '/vendor',
      description: 'Manage your vendor relationships',
      stats: 'Active Vendors',
      count: 12
    },
    {
      title: 'Accounting',
      color: 'bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900',
      icon: <MdAccountBalance size={32} className="text-white" />,
      link: '/accounts',
      description: 'View and manage account statements',
      stats: 'Today',
      count: 1
    },
    {
      title: 'Stone Inventory',
      color: 'bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
      icon: <GiStonePile size={32} className="text-white" />,
      link: '/stone',
      description: 'Manage stone categories and inventory',
      stats: 'Available Stones',
      count: 250
    },
    {
      title: 'Block Management',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700',
      icon: <GiStoneWall size={32} className="text-white" />,
      link: '/block',
      description: 'Manage block categories and inventory',
      stats: 'Total Blocks',
      count: 150
    }
  ]

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-black py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 -2xl p-8 shadow-xl">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Mining Management Dashboard
              </h1>
              <p className="text-xl text-white/90">
                Streamline your mining operations with our comprehensive management system
              </p>
              <div className="mt-6 flex gap-4">
                <Link
                  href="/vendor/addvendor"
                  className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-medium -lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Add New Vendor
                </Link>
                <Link
                  href="/block"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white font-medium -lg hover:bg-white/20 transition-all duration-300"
                >
                  Add New Block
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <Link key={index} href={card.link} className="group">
              <div
                className={`flex flex-col justify-between h-full -2xl p-6 transition-all duration-300 ${card.color} text-white hover:shadow-xl hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 -xl bg-white/20 group-hover:bg-white/30">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">{card.title}</h3>
                    <p className="text-sm text-white/80">{card.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{card.count}</span>
                    <span className="text-sm text-white/90">{card.stats}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-sm font-medium group-hover:underline">View Details →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
