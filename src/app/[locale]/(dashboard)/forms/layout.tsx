import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isValidLocale = routing.locales.includes(locale as 'en' | 'ar');

  if (!isValidLocale) {
    return {};
  }

  const path = locale === routing.defaultLocale ? '/forms' : `/${locale}/forms`;
  
  return generateSEOMetadata({
    title: locale === 'ar' ? 'نماذجي' : 'My Forms',
    description: locale === 'ar'
      ? 'إدارة وتحليل جميع نماذجك في مكان واحد'
      : 'Manage and analyze all your forms in one place',
    locale: locale as 'en' | 'ar',
    path,
    noIndex: true, // Private dashboard page
  });
}

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

