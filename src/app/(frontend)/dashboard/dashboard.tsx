'use client';
import Link from 'next/link';
import { GiStonePile } from 'react-icons/gi';
import { MdOutlineSupervisorAccount, MdAccountBalance } from 'react-icons/md';
import { JSX } from 'react';
interface CardProps {
  title: string;
  color: string;
  icon: JSX.Element;
  link: string;
  description?: string;
}

interface DashboardProps {
  data?: any;
}

export default function DashboardPage({ data }: DashboardProps) {
  const cards: CardProps[] = [
    {
      title: 'Mines',
      color: 'bg-blue-500 dark:bg-blue-600',
      icon: <MdOutlineSupervisorAccount size={28} className="text-white dark:text-gray-900" />,
      link: '/Mines',
      description: 'Manage your mines and mining operations',
      stats: '5 Active Mines'
    },
    {
      title: 'Vendors',
      color: 'bg-purple-500 dark:bg-purple-600',
      icon: <MdOutlineSupervisorAccount size={28} className="text-white dark:text-gray-900" />,
      link: '/vendor',
      description: 'Manage your vendor relationships',
      stats: '12 Active Vendors'
    },
    {
      title: 'Accounts',
      color: 'bg-gray-700 dark:bg-gray-800',
      icon: <MdAccountBalance size={28} className="text-white dark:text-gray-900" />,
      link: '/accounts',
      description: 'View and manage account statements',
      stats: 'Updated Today'
    },
    {
      title: 'Stones',
      color: 'bg-green-500 dark:bg-green-600',
      icon: <GiStonePile size={28} className="text-white dark:text-gray-900" />,
      link: '/stone',
      description: 'Manage stone categories and inventory',
      stats: '250+ Stones'
    },
    {
      title: 'Blocks',
      color: 'bg-orange-500 dark:bg-orange-600',
      icon: <GiStonePile size={28} className="text-white dark:text-gray-900" />,
      link: '/block',
      description: 'Manage block categories and inventory',
      stats: '150+ Blocks'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Hero Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Welcome to your mining management dashboard
              </p>
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <GiStonePile className="text-blue-500 dark:text-blue-400 h-6 w-6" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Stones</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">250+</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                  <MdOutlineSupervisorAccount className="text-green-500 dark:text-green-400 h-6 w-6" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Vendors</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">12</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                  <MdAccountBalance className="text-purple-500 dark:text-purple-400 h-6 w-6" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Mines</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">5</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                  <GiStonePile className="text-orange-500 dark:text-orange-400 h-6 w-6" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Blocks</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">150+</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <Link 
                href={card.link}
                key={index}
                className="group"
              >
                <div className={`
                  flex flex-col items-start p-6 rounded-2xl 
                  transition-all duration-300 
                  ${card.color} 
                  dark:text-white
                  hover:shadow-lg
                  hover:scale-[1.02]
                  border border-transparent
                  group-hover:border-white/20 dark:group-hover:border-gray-200/30
                `}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-white/10 dark:bg-gray-800/50 group-hover:bg-white/20 dark:group-hover:bg-gray-800/70">
                      {card.icon}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold">{card.title}</h3>
                      <p className="text-sm text-gray-100 dark:text-gray-400">{card.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full mt-4">
                    <span className="text-sm font-medium text-gray-200 dark:text-gray-500">{card.stats}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">+</span>
                      <span className="text-sm font-medium text-gray-200 dark:text-gray-500">Explore</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
