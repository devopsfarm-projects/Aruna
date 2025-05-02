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
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50 shadow-sm">
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <a href="/dashboard" className="flex items-center gap-3 text-gray-800 hover:text-black transition-colors">
          <img
            src="/image.png"
            alt="The Jodhpur Mine Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="text-2xl font-semibold tracking-wide text-green-600">
            The Jodhpur Mine
          </span>
        </a>

        {/* User Info */}
        <div className="flex items-center gap-3">
          {user?.email && (
            <span className="text-gray-700 text-sm md:text-base font-medium">
              {user.email}
            </span>
          )}
          <RiAccountCircle2Fill className="text-gray-600 w-8 h-8" title="User Account" />
        </div>
      </nav>
    </header>
  );
}
