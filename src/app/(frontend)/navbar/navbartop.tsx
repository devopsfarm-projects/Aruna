'use client';
import { useState, useEffect } from 'react';
import { RiAccountCircle2Fill } from 'react-icons/ri';

export default function Navbar() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
      } catch (err) {
        console.error('Failed to parse user data from localStorage', err);
      }
    }
  }, []);

  return (
    <nav className="bg-white border-b  border-gray-200 fixed top-0 left-0 w-full z-50 shadow-sm">
      <div className="max-w-screen-xl  flex items-center justify-between px-4 py-3 md:py-4">
       
        <a href="/dashboard" className="flex items-center gap-3">
          <img src="/image.png" alt="Logo" className="h-9 w-auto" />

        </a>

     
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm md:text-base font-medium">
            {user?.email || 'user@email.com'}
          </span>
          <RiAccountCircle2Fill className="text-gray-700 w-8 h-8" />
        </div>
      </div>
    </nav>
  );
}
