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

  const path = locale === routing.defaultLocale ? '/feed' : `/${locale}/feed`;
  
  return generateSEOMetadata({
    title: locale === 'ar' ? 'اكتشف الاستبيانات' : 'Discover Surveys',
    description: locale === 'ar'
      ? 'اكتشف واستكشف الاستبيانات المثيرة. أجب واكسب رصيد'
      : 'Discover and explore exciting surveys. Answer and earn credits',
    locale: locale as 'en' | 'ar',
    path,
    type: 'website',
  });
}

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

