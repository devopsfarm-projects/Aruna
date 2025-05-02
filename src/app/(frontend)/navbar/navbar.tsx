'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RiAccountCircle2Fill } from 'react-icons/ri';

export default function Navbar({ collections }: { collections: string[] }) {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Failed to parse user data from localStorage', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/api/logout';
  };

  if (loading || !user) return null;

  return (
    <>
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50 shadow">
        <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 text-gray-800 hover:text-black">
            <img src="/image.png" alt="The Jodhpur Mine Logo" className="h-10 w-auto object-contain" />
            <span className="text-2xl font-semibold tracking-wide text-green-600">
              The Jodhpur Mine
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="text-sm text-gray-700 font-medium">{user.email}</span>
            )}
            <RiAccountCircle2Fill className="text-gray-600 w-8 h-8" title="User Account" />
          </div>
        </nav>
      </header>

      <div className="flex pt-[72px]">
        <aside className="w-64 bg-white p-6 shadow-md hidden md:flex flex-col min-h-screen">
          <div className="flex items-center gap-2 mb-8">
            <img src="/image.png" alt="The Jodhpur Mine Logo" className="h-10 w-auto" />
          </div>

          <div className="mb-6 text-sm text-gray-600">
            Logged in as{' '}
            <span className="font-semibold text-pink-500">
              {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'User'}
            </span>
          </div>

          <nav className="flex flex-col gap-3 text-gray-700 font-medium">
            <Link href="/dashboard">
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Dashboard</span>
            </Link>

            {collections.slice(0, 10).map((col) => (
              <Link key={col} href={`/${col}`}>
                <span className="capitalize hover:text-blue-600 transition-colors cursor-pointer">
                  {col}
                </span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="mt-6 text-left text-red-500 hover:text-red-600 font-semibold"
            >
              Logout
            </button>
          </nav>
        </aside>
      </div>
    </>
  );
}