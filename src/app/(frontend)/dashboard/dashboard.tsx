'use client';
import Link from 'next/link';
import { GiGoldMine, GiStonePile } from 'react-icons/gi';
import { MdOutlineSupervisorAccount, MdAccountBalance } from 'react-icons/md';
import Mine from './mine/page'
export default function DashboardPage({ data }:{data:any}) {

  const cards = [
    // {
    //   title: 'Mine',
    //   color: 'bg-yellow-400',
    //   icon: <GiGoldMine size={24} />,
    //   link: '/Mines',
    // },
    {
      title: 'Vendor',
      color: 'bg-rose-400',
      icon: <MdOutlineSupervisorAccount size={24} />,
      link: '/vendor',
    },
    {
      title: 'Account Statement',
      color: 'bg-gray-400',
      icon: <MdAccountBalance size={24} />,
      link: '/transactions',
    },
    {
      title: 'Stone Category',
      color: 'bg-lime-900',
      icon: <GiStonePile size={24} />,
      link: '/stone',
    },
    {
      title: 'Block Category',
      color: 'bg-lime-500',
      icon: <GiStonePile size={24} />,
      link: '/block',
    },
   
   
  ];

  return (
   


      <main className="flex-1 mt-20 p-6">
      <Mine/>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-6 rounded-2xl shadow-md text-white ${card.color}`}
            >
              <Link href= {card.link}>
              <div className="flex items-center gap-4">
                <div className="bg-white text-black rounded-full p-3">
                  {card.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{card.title}</h2>
                  <p className="text-2xl mt-1 font-bold">+</p>
                </div>
              </div>
              </Link>
            </div>
          ))}
        </div>
      </main>

  );
}
