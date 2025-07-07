'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RouterEvents() {
  const pathname = usePathname();

  useEffect(() => {
    // This component is now just a placeholder for future route events
    // The Loading component handles the loading state based on pathname changes
  }, [pathname]);

  return null;
}
