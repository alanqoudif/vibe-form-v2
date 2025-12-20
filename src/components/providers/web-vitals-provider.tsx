'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/app/web-vitals';

export function WebVitalsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return <>{children}</>;
}

