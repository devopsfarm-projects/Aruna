'use client'
import Link from 'next/link'
import { GiStonePile, GiStoneWall } from 'react-icons/gi'
import { MdOutlineSupervisorAccount, MdAccountBalance, MdConstruction } from 'react-icons/md'


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
      title: 'Todi Blocks',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
      icon: <MdOutlineSupervisorAccount size={28} className="text-white" />,
      link: '/block/todi',
      description: 'Add new block',
      stats: 'Active Blocks',
      count: 12
    },
    {
      title: 'Gala Blocks',
      color: 'bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900',
      icon: <MdAccountBalance size={28} className="text-white" />,
      link: '/block/gala',
      description: 'Add new block',
      stats: 'Updated Today',
      count: 8
    },
    // {
    //   title: 'Stone Blocks',
    //   color: 'bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900',
    //   icon: <GiStonePile size={28} className="text-white" />,
    //   link: '/block/stone',
    //   description: 'Add new stone block',
    //   stats: 'Available Stones',
    //   count: 24
    // }
  ]

  return (
    <main className="min-h-screen bg-gray-100 py-28 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl p-8 shadow-xl">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Block Management Dashboard
              </h1>
              <p className="text-xl text-white/90">
                Manage your construction blocks with ease
              </p>
              <div className="mt-6 flex gap-4">
                <Link
                  href="/block/todi/add"
                  className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Add New Todi Block
                </Link>
                <Link
                  href="/block/gala/add"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Add New Gala Block
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Link key={index} href={card.link} className="group">
              <div
                className={`flex flex-col justify-between h-full rounded-2xl p-6 transition-all duration-300 ${card.color} text-white hover:shadow-xl hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-white/20 group-hover:bg-white/30">
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
