'use client';
import React from 'react';
import { GiGoldMine, GiStonePile } from 'react-icons/gi';
import { MdOutlineSupervisorAccount, MdAccountBalance } from 'react-icons/md';
import { RiAccountCircle2Fill } from 'react-icons/ri';

export default function Navbar({ data }:{data:any}) {
  const userData = data?.[1]; 

  return (
   
      <>
      <aside className="w-64 bg-white p-6 shadow-md hidden md:block">
        <div className="flex items-center gap-2 mb-6">
          <img src="/image.png" alt="Logo" className="h-10" />
          <span className="text-xl font-bold">ARUNA</span>
        </div>
        <div className="text-pink-500 font-bold mb-4">
        Logged in as {userData?.name ? userData.name.charAt(0).toUpperCase() + userData.name.slice(1) : 'User'}
        </div>


        <nav className="flex flex-col gap-4 text-gray-700 font-medium">
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
          <a href="/admin/logout" className="text-red-500 font-semibold">
            Logout
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-gray-800 font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{userData?.email}</span>
            <RiAccountCircle2Fill className="w-10 h-10 text-gray-700" />
          </div>
        </div>
      </main>
      </>

  );
}
