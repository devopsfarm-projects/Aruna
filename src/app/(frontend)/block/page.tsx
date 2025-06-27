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

}

export default function DashboardPage() {
  const cards: CardProps[] = [
    {
      title: 'Todi Blocks',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
      icon: <MdOutlineSupervisorAccount size={28} className="text-white" />,
      link: '/block/todi',
      description: 'Add new block',
     
    },
    {
      title: 'Gala Blocks',
      color: 'bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900',
      icon: <MdAccountBalance size={28} className="text-white" />,
      link: '/block/gala',
      description: 'Add new block',
     
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
    <main className="min-h-screen bg-gray-100 py-4 dark:bg-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative overflow-hidden  shadow-xl bg-black/5 dark:bg-black/10">
            <div className="absolute opacity-40 inset-0 bg-black/30 dark:bg-black/40"></div>
            <div className="absolute opacity-50 inset-0" style={{
              backgroundImage: 'url("https://img2.exportersindia.com/product_images/bc-full/2021/2/8469484/jodhpur-pink-sandstone-blocks-1612949762-5720354.jpeg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <div className="relative max-w-2xl mx-auto p-8">
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