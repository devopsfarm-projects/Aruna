import React from 'react';
import './globals.css';
import Navbar from './navbar/page';
import { headers } from 'next/headers';

export const metadata = {
  description: '',
  title: 'ARUNA',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get('next-url') || ''; 
  const shouldShowNavbar = !['/', '/login'].includes(pathname); 

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100 flex">
          {shouldShowNavbar && <Navbar />}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}