'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import Mosaic with no SSR
const Mosaic = dynamic(
  () => import('react-loading-indicators').then((mod) => mod.Mosaic),
  { ssr: false }
);

const LoadingSpinner = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
    <div className="p-6">
      <Mosaic color="#32cd32" size="medium" text="" textColor="" />
    </div>
  </div>
);

export default function Loading() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Show loading when path changes
    setIsLoading(true);
    
    // Hide loading after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;
  
  return <LoadingSpinner />;
}
