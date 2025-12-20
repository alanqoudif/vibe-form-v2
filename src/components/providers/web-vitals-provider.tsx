'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/app/web-vitals';

export function WebVitalsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run on client side after hydration
    if (typeof window !== 'undefined') {
      reportWebVitals();
    }
  }, []);

  return <>{children}</>;
}

