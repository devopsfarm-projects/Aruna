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
      color: 'bg-rose-500 dark:bg-blue-600',
      icon: <MdOutlineSupervisorAccount size={28} className="text-white dark:text-gray-900" />,
      link: '/Mines',
      description: 'Manage your mines'
    },
    {
      title: 'Vendors',
      color: 'bg-rose-500 dark:bg-rose-600',
      icon: <MdOutlineSupervisorAccount size={28} className="text-white dark:text-gray-900" />,
      link: '/vendor',
      description: 'Manage your vendor relationships'
    },
    {
      title: 'Accounts Statement',
      color: 'bg-gray-700 dark:bg-gray-800',
      icon: <MdAccountBalance size={28} className="text-white dark:text-gray-900" />,
      link: '/accounts',
      description: 'View account statements'
    },
    {
      title: 'Stones',
      color: 'bg-lime-500 dark:bg-lime-600',
      icon: <GiStonePile size={28} className="text-white dark:text-gray-900" />,
      link: '/stone',
      description: 'Manage stone categories'
    },
    {
      title: 'Blocks',
      color: 'bg-cyan-500 dark:bg-cyan-600',
      icon: <GiStonePile size={28} className="text-white dark:text-gray-900" />,
      link: '/block',
      description: 'Manage block categories'
    }
  ];

  return (
    <main className="flex-1 mt-24 max-w-7xl mx-auto p-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome to your dashboard</p>
        </div>
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
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">+</span>
                  <span className="text-sm font-medium text-gray-200 dark:text-gray-500">Explore</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
