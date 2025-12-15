import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { getPrimaryKeyword } from '@/lib/seo/keywords';
import { BreadcrumbSchema } from '@/components/seo/structured-data';
import { routing } from '@/i18n/routing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibeform.pro';

// Mock blog posts - In production, this would come from a CMS or database
const blogPosts = [
  {
    slug: 'how-to-create-professional-survey',
    title: {
      ar: 'كيفية إنشاء استبيان احترافي في 5 خطوات سهلة',
      en: 'How to Create a Professional Survey in 5 Easy Steps',
    },
    description: {
      ar: 'دليل شامل خطوة بخطوة لإنشاء استبيانات احترافية تحصل على نتائج عالية الجودة.',
      en: 'A comprehensive step-by-step guide to creating professional surveys that get high-quality results.',
    },
    category: {
      ar: 'تعليمي',
      en: 'Educational',
    },
    date: '2025-01-15',
    readTime: {
      ar: '5 دقائق',
      en: '5 min read',
    },
    image: '/blog/survey-guide.jpg',
  },
  {
    slug: 'vibeform-vs-google-forms-comparison',
    title: {
      ar: 'Vibeform Pro vs Google Forms: المقارنة الشاملة 2025',
      en: 'Vibeform Pro vs Google Forms: Complete Comparison 2025',
    },
    description: {
      ar: 'مقارنة تفصيلية بين Vibeform Pro و Google Forms. اكتشف أيهما أفضل لاحتياجاتك.',
      en: 'Detailed comparison between Vibeform Pro and Google Forms. Discover which is better for your needs.',
    },
    category: {
      ar: 'مقارنة',
      en: 'Comparison',
    },
    date: '2025-01-10',
    readTime: {
      ar: '8 دقائق',
      en: '8 min read',
    },
    image: '/blog/comparison.jpg',
  },
  {
    slug: 'best-practices-survey-design',
    title: {
      ar: 'أفضل 10 ممارسات لتصميم الاستبيانات',
      en: 'Top 10 Best Practices for Survey Design',
    },
    description: {
      ar: 'تعلم أفضل الممارسات لتصميم استبيانات فعالة تحصل على معدل استجابة عالي.',
      en: 'Learn best practices for designing effective surveys that get high response rates.',
    },
    category: {
      ar: 'تعليمي',
      en: 'Educational',
    },
    date: '2025-01-05',
    readTime: {
      ar: '6 دقائق',
      en: '6 min read',
    },
    image: '/blog/design-practices.jpg',
  },
];

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

  const primaryKeyword = getPrimaryKeyword('blog', locale as 'en' | 'ar');
  const path = locale === routing.defaultLocale ? '/blog' : `/${locale}/blog`;

  return generateSEOMetadata({
    title: primaryKeyword,
    description: locale === 'ar'
      ? 'مقالات شاملة عن الاستبيانات، النماذج، وأفضل الممارسات. تعلم كيفية إنشاء استبيانات احترافية والحصول على نتائج أفضل.'
      : 'Comprehensive articles about surveys, forms, and best practices. Learn how to create professional surveys and get better results.',
    locale: locale as 'en' | 'ar',
    path,
    type: 'website',
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('blog');
  const isValidLocale = routing.locales.includes(locale as 'en' | 'ar');

  if (!isValidLocale) {
    return null;
  }

  const path = locale === routing.defaultLocale ? '/blog' : `/${locale}/blog`;
  const url = `${siteUrl}${path}`;

  const breadcrumbItems = [
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: siteUrl },
    { name: locale === 'ar' ? 'المدونة' : 'Blog', url },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === 'ar' ? 'المدونة' : 'Blog'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {locale === 'ar'
              ? 'مقالات شاملة عن الاستبيانات، النماذج، وأفضل الممارسات'
              : 'Comprehensive articles about surveys, forms, and best practices'}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="hover:shadow-lg transition-shadow flex flex-col">
              <div className="aspect-video bg-muted rounded-t-lg mb-4" />
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category[locale as 'en' | 'ar']}</Badge>
                </div>
                <CardTitle className="text-xl mb-2">
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title[locale as 'en' | 'ar']}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.description[locale as 'en' | 'ar']}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime[locale as 'en' | 'ar']}</span>
                  </div>
                </div>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  {locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            {locale === 'ar' ? 'التصنيفات' : 'Categories'}
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { ar: 'تعليمي', en: 'Educational' },
              { ar: 'مقارنة', en: 'Comparison' },
              { ar: 'أفضل الممارسات', en: 'Best Practices' },
              { ar: 'نصائح', en: 'Tips' },
              { ar: 'أخبار', en: 'News' },
            ].map((category, index) => (
              <Badge key={index} variant="outline" className="text-base px-4 py-2">
                {category[locale as 'en' | 'ar']}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

