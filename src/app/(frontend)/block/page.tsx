'use client'
import Link from 'next/link'
import { GiStonePile } from 'react-icons/gi'
import { MdOutlineSupervisorAccount, MdAccountBalance } from 'react-icons/md'
import { JSX } from 'react'

interface CardProps {
  title: string
  color: string
  icon: JSX.Element
  link: string
  description?: string
  stats: string
}

export default function DashboardPage() {
  const cards: CardProps[] = [
    {
      title: 'Todi',
      color: 'bg-purple-500 dark:bg-purple-600',
      icon: <MdOutlineSupervisorAccount size={28} className="text-white" />,
      link: '/block/todi',
      description: 'Add new block',
      stats: '12 Active Vendors',
    },
    {
      title: 'Gala',
      color: 'bg-gray-700 dark:bg-gray-800',
      icon: <MdAccountBalance size={28} className="text-white" />,
      link: '/block/gala',
      description: 'Add new block',
      stats: 'Updated Today',
    },
  ]

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl md:pt-10 pt-4 mx-auto flex flex-col gap-8">
        {/* Hero Section */}
        <section className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Add Block
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Add new block
          </p>
        </section>

        {/* Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Link key={index} href={card.link} className="group">
              <div
                className={`flex flex-col justify-between h-full rounded-2xl p-5 transition-transform duration-300 ${card.color} text-white hover:scale-[1.02] shadow-md`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold">{card.title}</h3>
                    <p className="text-sm text-white/80">{card.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/30">
                  <span className="text-sm text-white/90">{card.stats}</span>
                  <span className="text-sm font-medium group-hover:underline">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
