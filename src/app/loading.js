'use client';

import dynamic from 'next/dynamic';

// Dynamically import Mosaic with no SSR
const Mosaic = dynamic(
  () => import('react-loading-indicators').then((mod) => mod.Mosaic),
  { ssr: false }
);

export default function Loading() {
  return (
    <div className="loading-overlay opacity-20 w-full h-full">
      <div className="loading-content">
        <Mosaic 
          color="#32cd32" 
          size="medium" 
          text="Loading..." 
          textColor="#ffffff" 
        />
      </div>
    </div>
  );
}
