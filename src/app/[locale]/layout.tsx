import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { Hreflang } from '@/components/seo/hreflang';
import { OrganizationSchema, WebSiteSchema, LocalBusinessSchema } from '@/components/seo/structured-data';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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

  const path = locale === routing.defaultLocale ? '/' : `/${locale}`;
  
  return generateSEOMetadata({
    title: locale === 'ar'
      ? 'صانع نماذج احترافي | Vibeform Pro - استبيانات مجانية'
      : 'Professional Form Builder | Vibeform Pro - Free Surveys',
    description: locale === 'ar'
      ? 'أنشئ نماذج واستبيانات احترافية بالذكاء الاصطناعي في ثوانٍ. بديل Google Forms مع ميزات متقدمة، مجتمع مجيبين، وتحليلات ذكية. ابدأ مجاناً الآن!'
      : 'Create professional forms and surveys with AI in seconds. Google Forms alternative with advanced features, respondent community, and smart analytics. Start free now!',
    locale: locale as 'en' | 'ar',
    path,
    type: 'website',
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  const isRTL = locale === 'ar';
  const path = locale === routing.defaultLocale ? '/' : `/${locale}`;

  return (
    <>
      <Hreflang path={path} />
      <OrganizationSchema locale={locale as 'en' | 'ar'} />
      <WebSiteSchema locale={locale as 'en' | 'ar'} />
      {/* LocalBusiness Schema - Add if you have physical location */}
      {/* Uncomment and fill in your business details:
      <LocalBusinessSchema
        name="Vibeform Pro"
        description={locale === 'ar' 
          ? 'منصة لإنشاء الاستبيانات والنماذج'
          : 'Platform for creating surveys and forms'}
        url="https://vibeform.pro"
        locale={locale as 'en' | 'ar'}
      />
      */}
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        forcedTheme="dark"
        disableTransitionOnChange={false}
      >
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <div lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col">
              {children}
            </div>
            <Toaster position={isRTL ? 'bottom-left' : 'bottom-right'} />
          </NextIntlClientProvider>
        </QueryProvider>
      </ThemeProvider>
    </>
  );
}
