"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Extract locale from pathname
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    const locale = routing.locales.includes(firstSegment as 'en' | 'ar') 
      ? firstSegment 
      : routing.defaultLocale;
    
    const isRTL = locale === 'ar';
    
    // Set lang and dir on html element
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [pathname]);

  return <>{children}</>;
}

