import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibeform.pro';
const siteName = 'Vibe Form';
const defaultDescription = {
  en: 'Create professional forms and surveys with AI in seconds. Get quality responses from our community and gain AI-powered insights.',
  ar: 'أنشئ نماذج واستبيانات احترافية بالذكاء الاصطناعي في ثوانٍ. احصل على ردود عالية الجودة من مجتمعنا واستفد من التحليلات الذكية.',
};

// Enhanced keywords for SEO
const keywords = {
  ar: [
    'صانع نماذج',
    'منصة استبيانات',
    'بديل Google Forms',
    'أداة إنشاء استبيانات',
    'نموذج استبيان احترافي',
    'استبيانات مجانية',
    'صانع نماذج إلكترونية',
    'أداة جمع البيانات',
    'منصة نماذج متقدمة',
    'استبيانات عربية',
    'نموذج جوجل فورم بديل',
    'أداة استبيان احترافية',
    'form builder',
    'survey platform',
    'questionnaire maker',
  ],
  en: [
    'form builder',
    'survey platform',
    'Google Forms alternative',
    'online form builder',
    'survey maker',
    'questionnaire builder',
    'free form builder',
    'AI form builder',
    'professional surveys',
    'data collection tool',
    'form creator',
    'survey tool',
    'feedback forms',
    'research surveys',
    'form builder Arabic',
  ],
};

export interface MetadataOptions {
  title?: string;
  description?: string;
  locale?: 'en' | 'ar';
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article' | 'profile';
}

export function generateMetadata({
  title,
  description,
  locale = 'en',
  path = '',
  image,
  noIndex = false,
  type = 'website',
}: MetadataOptions): Metadata {
  // Optimize title: include primary keyword at the beginning if title is provided
  // Ensure title length is 50-60 characters for optimal SEO
  const baseTitle = title || (locale === 'ar'
    ? 'صانع نماذج احترافي'
    : 'Professional Form Builder');
  
  const fullTitle = title
    ? (locale === 'ar' 
        ? `${baseTitle} | ${siteName} - استبيانات مجانية`
        : `${baseTitle} | ${siteName} - Free Surveys`)
    : (locale === 'ar'
        ? `صانع نماذج احترافي | ${siteName} - استبيانات مجانية`
        : `Professional Form Builder | ${siteName} - Free Surveys`);
  
  // Ensure description is 150-160 characters for optimal SEO
  const metaDescription = description || defaultDescription[locale];
  const optimizedDescription = metaDescription.length > 160 
    ? metaDescription.substring(0, 157) + '...'
    : metaDescription;
  
  const url = `${siteUrl}${path}`;
  const ogImage = image || `${siteUrl}/og-image.png`;

  const metadata: Metadata = {
    title: fullTitle,
    description: optimizedDescription,
    keywords: keywords[locale],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    metadataBase: new URL(siteUrl),
    icons: {
      icon: '/icon.png',
      shortcut: '/icon.png',
      apple: '/icon.png',
    },
    alternates: {
      canonical: url,
      languages: {
        'en': `${siteUrl}${path.replace(/^\/ar/, '/en').replace(/^\/en/, '/en')}`,
        'ar': `${siteUrl}${path.replace(/^\/en/, '/ar').replace(/^\/ar/, '/ar')}`,
        'x-default': `${siteUrl}${path}`,
      },
    },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description: optimizedDescription,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      alternateLocale: locale === 'ar' ? 'en_US' : 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: optimizedDescription,
      images: [ogImage],
      creator: '@vibeform',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };

  return metadata;
}

export function generateHreflangTags(path: string): Array<{ rel: string; hreflang: string; href: string }> {
  const basePath = path.replace(/^\/(en|ar)/, '') || '/';
  const tags = [];

  for (const locale of routing.locales) {
    const localePath = locale === routing.defaultLocale ? basePath : `/${locale}${basePath}`;
    tags.push({
      rel: 'alternate',
      hreflang: locale,
      href: `${siteUrl}${localePath}`,
    });
  }

  // Add x-default
  tags.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${siteUrl}${basePath}`,
  });

  return tags;
}

export function getCanonicalUrl(path: string, locale?: string): string {
  const basePath = path.replace(/^\/(en|ar)/, '') || '/';
  const localePath = locale && locale !== routing.defaultLocale ? `/${locale}${basePath}` : basePath;
  return `${siteUrl}${localePath}`;
}

