import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { FormSchema, BreadcrumbSchema } from '@/components/seo/structured-data';
import { Hreflang } from '@/components/seo/hreflang';
import { routing } from '@/i18n/routing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibeform.pro';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const isValidLocale = routing.locales.includes(locale as 'en' | 'ar');

  if (!isValidLocale) {
    return {};
  }

  const supabase = await createClient();
  
  // Fetch form data for metadata
  const { data: form } = await supabase
    .from('forms')
    .select('title, description, primary_language, published_at')
    .eq('id', slug)
    .eq('status', 'published')
    .single();

  if (!form) {
    return generateSEOMetadata({
      locale: locale as 'en' | 'ar',
      path: `/f/${slug}`,
      noIndex: true,
    });
  }

  const formLocale = (form.primary_language || locale) as 'en' | 'ar';
  const path = locale === routing.defaultLocale ? `/f/${slug}` : `/${locale}/f/${slug}`;
  const ogImage = `${siteUrl}/api/og?title=${encodeURIComponent(form.title)}&locale=${formLocale}`;

  // Enhanced description with keywords
  const enhancedDescription = form.description 
    ? `${form.description} ${formLocale === 'ar' ? 'أجب على هذا الاستبيان واحصل على رصيد.' : 'Answer this survey and earn credits.'}`
    : (formLocale === 'ar'
      ? `أجب على استبيان "${form.title}" واحصل على رصيد. استبيان احترافي على Vibeform Pro.`
      : `Answer the survey "${form.title}" and earn credits. Professional survey on Vibeform Pro.`);

  return generateSEOMetadata({
    title: `${form.title} ${formLocale === 'ar' ? '| استبيان Vibeform Pro' : '| Vibeform Pro Survey'}`,
    description: enhancedDescription,
    locale: formLocale,
    path,
    image: ogImage,
    type: 'article',
  });
}

export default async function FormLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createClient();
  
  const { data: form } = await supabase
    .from('forms')
    .select('title, description, primary_language, published_at, owner_id')
    .eq('id', slug)
    .eq('status', 'published')
    .single();

  if (!form) {
    return <>{children}</>;
  }

  const formLocale = (form.primary_language || locale) as 'en' | 'ar';
  const path = locale === routing.defaultLocale ? `/f/${slug}` : `/${locale}/f/${slug}`;
  const url = `${siteUrl}${path}`;

  // Get author name if available
  let authorName: string | undefined;
  if (form.owner_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, username')
      .eq('id', form.owner_id)
      .single();
    
    authorName = profile?.full_name || profile?.username;
  }

  // Breadcrumb items
  const breadcrumbItems = [
    {
      name: formLocale === 'ar' ? 'الرئيسية' : 'Home',
      url: `${siteUrl}${formLocale === 'ar' ? '/ar' : ''}`,
    },
    {
      name: formLocale === 'ar' ? 'الاستبيان' : 'Survey',
      url: url,
    },
  ];

  return (
    <>
      <Hreflang path={path} />
      <FormSchema
        name={form.title}
        description={form.description || undefined}
        url={url}
        author={authorName}
        datePublished={form.published_at || undefined}
        locale={formLocale}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      {children}
    </>
  );
}

