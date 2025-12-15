import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { getPrimaryKeyword, getKeywordsForPage } from '@/lib/seo/keywords';
import { ProductSchema } from '@/components/seo/structured-data';
import { BreadcrumbSchema } from '@/components/seo/structured-data';
import { routing } from '@/i18n/routing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Sparkles, Users, BarChart3, Shield, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibeform.pro';

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

  const primaryKeyword = getPrimaryKeyword('features', locale as 'en' | 'ar');
  const path = locale === routing.defaultLocale ? '/features' : `/${locale}/features`;

  return generateSEOMetadata({
    title: primaryKeyword,
    description: locale === 'ar'
      ? 'اكتشف ميزات Vibeform Pro المتقدمة: صانع نماذج بالذكاء الاصطناعي، مجتمع مجيبين، تحليلات ذكية، وأكثر. بديل Google Forms مع ميزات احترافية.'
      : 'Discover Vibeform Pro advanced features: AI-powered form builder, respondent community, smart analytics, and more. Google Forms alternative with professional features.',
    locale: locale as 'en' | 'ar',
    path,
    type: 'website',
  });
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('features');
  const isValidLocale = routing.locales.includes(locale as 'en' | 'ar');

  if (!isValidLocale) {
    return null;
  }

  const path = locale === routing.defaultLocale ? '/features' : `/${locale}/features`;
  const url = `${siteUrl}${path}`;

  const features = [
    {
      icon: Sparkles,
      title: locale === 'ar' ? 'إنشاء بالذكاء الاصطناعي' : 'AI-Powered Creation',
      description: locale === 'ar'
        ? 'أنشئ نماذج احترافية في ثوانٍ ببساطة وصف ما تريده. الذكاء الاصطناعي يحول وصفك إلى استبيان كامل.'
        : 'Create professional forms in seconds by simply describing what you need. AI transforms your description into a complete survey.',
    },
    {
      icon: Users,
      title: locale === 'ar' ? 'مجتمع المجيبين' : 'Respondent Community',
      description: locale === 'ar'
        ? 'احصل على ردود عالية الجودة من مجتمعنا النشط من المجيبين. اربح نقاط من خلال الإجابة على الاستبيانات.'
        : 'Get quality responses from our active community of respondents. Earn credits by answering surveys.',
    },
    {
      icon: BarChart3,
      title: locale === 'ar' ? 'تحليلات ذكية' : 'Smart Analytics',
      description: locale === 'ar'
        ? 'احصل على رؤى قوية من ردودك مع تحليلات مدعومة بالذكاء الاصطناعي. تلخيص تلقائي، تحليل المشاعر، وتوصيات.'
        : 'Get powerful insights from your responses with AI-powered analytics. Automatic summarization, sentiment analysis, and recommendations.',
    },
    {
      icon: Shield,
      title: locale === 'ar' ? 'أمان وخصوصية' : 'Security & Privacy',
      description: locale === 'ar'
        ? 'بياناتك آمنة معنا. تشفير كامل، خصوصية محمية، وامتثال كامل لمعايير حماية البيانات.'
        : 'Your data is safe with us. Full encryption, protected privacy, and full compliance with data protection standards.',
    },
    {
      icon: Zap,
      title: locale === 'ar' ? 'سريع وسهل' : 'Fast & Easy',
      description: locale === 'ar'
        ? 'واجهة بسيطة وسريعة. أنشئ ونشر استبيانك في دقائق بدون تعقيد.'
        : 'Simple and fast interface. Create and publish your survey in minutes without complexity.',
    },
    {
      icon: Globe,
      title: locale === 'ar' ? 'متعدد اللغات' : 'Multilingual',
      description: locale === 'ar'
        ? 'دعم كامل للعربية والإنجليزية مع واجهة RTL. أنشئ استبيانات بلغات متعددة.'
        : 'Full support for Arabic and English with RTL interface. Create surveys in multiple languages.',
    },
  ];

  const breadcrumbItems = [
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: siteUrl },
    { name: locale === 'ar' ? 'الميزات' : 'Features', url },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Product Schema */}
      <ProductSchema
        name={locale === 'ar' ? 'Vibeform Pro - منصة الاستبيانات الاحترافية' : 'Vibeform Pro - Professional Survey Platform'}
        description={locale === 'ar'
          ? 'منصة متقدمة لإنشاء الاستبيانات والنماذج بالذكاء الاصطناعي'
          : 'Advanced platform for creating surveys and forms with AI'}
        offers={{
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        }}
        aggregateRating={{
          ratingValue: '4.8',
          reviewCount: '100',
        }}
        locale={locale as 'en' | 'ar'}
      />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === 'ar' ? 'ميزات Vibeform Pro' : 'Vibeform Pro Features'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {locale === 'ar'
              ? 'منصة استبيانات احترافية مع ميزات متقدمة تجعلك تتفوق على Google Forms'
              : 'Professional survey platform with advanced features that make you stand out from Google Forms'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparison Section */}
        <div className="bg-muted/50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {locale === 'ar' ? 'لماذا Vibeform Pro أفضل من Google Forms؟' : 'Why Vibeform Pro is Better than Google Forms?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">
                {locale === 'ar' ? '✅ Vibeform Pro' : '✅ Vibeform Pro'}
              </h3>
              <ul className="space-y-2">
                {[
                  locale === 'ar' ? 'إنشاء بالذكاء الاصطناعي' : 'AI-powered creation',
                  locale === 'ar' ? 'مجتمع مجيبين نشط' : 'Active respondent community',
                  locale === 'ar' ? 'تحليلات ذكية' : 'Smart analytics',
                  locale === 'ar' ? 'دعم عربي كامل' : 'Full Arabic support',
                  locale === 'ar' ? 'نظام نقاط وترويج' : 'Credits and promotion system',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">
                {locale === 'ar' ? '❌ Google Forms' : '❌ Google Forms'}
              </h3>
              <ul className="space-y-2">
                {[
                  locale === 'ar' ? 'إنشاء يدوي فقط' : 'Manual creation only',
                  locale === 'ar' ? 'لا يوجد مجتمع مجيبين' : 'No respondent community',
                  locale === 'ar' ? 'تحليلات أساسية فقط' : 'Basic analytics only',
                  locale === 'ar' ? 'دعم عربي محدود' : 'Limited Arabic support',
                  locale === 'ar' ? 'لا يوجد نظام ترويج' : 'No promotion system',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {locale === 'ar' ? 'جاهز للبدء؟' : 'Ready to Get Started?'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {locale === 'ar'
              ? 'ابدأ مجاناً وأنشئ استبيانك الأول في دقائق'
              : 'Start free and create your first survey in minutes'}
          </p>
          <Link
            href={locale === 'ar' ? '/ar' : '/'}
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {locale === 'ar' ? 'ابدأ الآن مجاناً' : 'Start Free Now'}
          </Link>
        </div>
      </div>
    </div>
  );
}
