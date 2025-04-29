// app/dashboard/page.jsx (if you're using Next.js 13+ app directory)

"use client";
import axios from 'axios';
import { useState, useEffect, SetStateAction } from "react";
import { GiGoldMine,GiStonePile  } from "react-icons/gi";
import { MdOutlineSupervisorAccount,MdAccountBalance  } from "react-icons/md";
import { RiAccountCircle2Fill } from "react-icons/ri";
export default function DashboardPage() {
  const cards = [
    {
      title: "Mine",
      color: "bg-yellow-400",
      icon: <GiGoldMine size={24} />,
    },
    {
      title: "Vendor",
      color: "bg-rose-400",
      icon: <MdOutlineSupervisorAccount  size={24} />,
    },
    {
      title: "Stone & Black Category",
      color: "bg-lime-500",
      icon: <GiStonePile size={24} />,
    },
    {
      title: "Account Statement",
      color: "bg-gray-400",
      icon: <MdAccountBalance   size={24} />,
    },
  ];


  const [userData, setUserData] = useState(null);

  // Fetch user data using the JWT token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/api/users/login', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response: { data: SetStateAction<null>; }) => {
          setUserData(response.data);
        })
        .catch((error: any) => {
          console.error('Error fetching user data:', error);
        });
    } else {
      window.location.href = '/login'; // Redirect to login if no token is found
    }
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md hidden md:block">
        <div className="flex items-center gap-2 mb-6">
          <img src="/image.png" alt="Logo" className="h-10" />
          <span className="text-xl font-bold">ARUNA</span>
        </div>
        <div className="text-pink-500 font-bold mb-4">Logged in as Mukesh</div>
        <nav className="flex flex-col gap-4 text-gray-600">
          {/* <a href="#" className="text-pink-400 font-semibold">Dashboard</a> */}
          <a href="#">User</a>
          <a href="#">Accounts</a>
          <a href="#">Sites</a>
          <a href="#">Parties</a>
          <a href="#">Reminders</a>
          <a href="#">Reports</a>
          <a href="#">Transactions</a>
          <a href="#">Media</a>
          <a href="#">Product</a>
          <a href="#">Labour</a>
          <a href="#">Mines</a>
          <a href="#">Trucks</a>
          <a href="#" className="text-red-500">Logout</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-gray-600 font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Dashboard</span>
            <RiAccountCircle2Fill
              className="w-10 h-10 rounded-full text-black object-cover"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1  lg:grid-cols-1 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-6  rounded-2xl shadow-md text-white ${card.color}`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white text-black rounded-full p-3">
                  {card.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{card.title}</h2>
                  <p className="text-2xl mt-1 font-bold">+</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
