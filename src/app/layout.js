'use client';

import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import Loading from '@/components/Loading';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Ensure the page is visible when loaded
  useEffect(() => {
    document.body.style.visibility = 'visible';
  }, [pathname]);

  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preload the Mosaic animation for better performance */}
        <link 
          rel="preload" 
          href="/_next/static/chunks/react-loading-indicators.js" 
          as="script"
        />
      </head>
      <body className="min-h-full bg-white dark:bg-black">
        <Suspense fallback={null}>
          <Loading />
          <div className="min-h-screen">
            {children}
          </div>
        </Suspense>
        
        <style jsx global>{`
          html {
            height: 100%;
          }
          
          body {
            min-height: 100%;
            margin: 0;
            padding: 0;
          }
          
          /* Ensure the loading indicator is always on top */
          [data-loading-indicator] {
            z-index: 9999 !important;
          }
        `}</style>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Add ready class when the page is fully loaded
              document.addEventListener('DOMContentLoaded', () => {
                document.body.classList.add('ready');
              });
              
              if (document.readyState === 'complete') {
                document.body.classList.add('ready');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
