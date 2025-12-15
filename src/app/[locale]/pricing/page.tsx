import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { getPrimaryKeyword } from '@/lib/seo/keywords';
import { ProductSchema } from '@/components/seo/structured-data';
import { BreadcrumbSchema } from '@/components/seo/structured-data';
import { FAQPageSchema } from '@/components/seo/structured-data';
import { routing } from '@/i18n/routing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
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

  const primaryKeyword = getPrimaryKeyword('pricing', locale as 'en' | 'ar');
  const path = locale === routing.defaultLocale ? '/pricing' : `/${locale}/pricing`;

  return generateSEOMetadata({
    title: primaryKeyword,
    description: locale === 'ar'
      ? 'خطط تسعير Vibeform Pro المرنة. ابدأ مجاناً وأنشئ استبيانات غير محدودة. خطط احترافية بأسعار تنافسية. بدون بطاقة ائتمان.'
      : 'Vibeform Pro flexible pricing plans. Start free and create unlimited surveys. Professional plans at competitive prices. No credit card required.',
    locale: locale as 'en' | 'ar',
    path,
    type: 'website',
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('pricing');
  const isValidLocale = routing.locales.includes(locale as 'en' | 'ar');

  if (!isValidLocale) {
    return null;
  }

  const path = locale === routing.defaultLocale ? '/pricing' : `/${locale}/pricing`;
  const url = `${siteUrl}${path}`;

  const plans = [
    {
      name: locale === 'ar' ? 'مجاني' : 'Free',
      price: '0',
      period: locale === 'ar' ? 'مدى الحياة' : 'Forever',
      description: locale === 'ar'
        ? 'مثالي للبدء وإنشاء استبيانات بسيطة'
        : 'Perfect for getting started and creating simple surveys',
      features: [
        locale === 'ar' ? 'استبيانات غير محدودة' : 'Unlimited surveys',
        locale === 'ar' ? 'أسئلة غير محدودة' : 'Unlimited questions',
        locale === 'ar' ? '100 رد شهرياً' : '100 responses per month',
        locale === 'ar' ? 'تحليلات أساسية' : 'Basic analytics',
        locale === 'ar' ? 'دعم المجتمع' : 'Community support',
      ],
      cta: locale === 'ar' ? 'ابدأ مجاناً' : 'Start Free',
      popular: false,
    },
    {
      name: locale === 'ar' ? 'احترافي' : 'Professional',
      price: '9',
      period: locale === 'ar' ? 'شهرياً' : 'per month',
      description: locale === 'ar'
        ? 'للمحترفين والشركات الصغيرة'
        : 'For professionals and small businesses',
      features: [
        locale === 'ar' ? 'كل ما في المجاني' : 'Everything in Free',
        locale === 'ar' ? '1000 رد شهرياً' : '1000 responses per month',
        locale === 'ar' ? 'تحليلات متقدمة' : 'Advanced analytics',
        locale === 'ar' ? 'AI Insights' : 'AI Insights',
        locale === 'ar' ? 'دعم أولوية' : 'Priority support',
        locale === 'ar' ? 'تصدير CSV' : 'CSV export',
      ],
      cta: locale === 'ar' ? 'ابدأ الآن' : 'Get Started',
      popular: true,
    },
    {
      name: locale === 'ar' ? 'أعمال' : 'Business',
      price: '29',
      period: locale === 'ar' ? 'شهرياً' : 'per month',
      description: locale === 'ar'
        ? 'للشركات الكبيرة والفرق'
        : 'For large companies and teams',
      features: [
        locale === 'ar' ? 'كل ما في الاحترافي' : 'Everything in Professional',
        locale === 'ar' ? 'ردود غير محدودة' : 'Unlimited responses',
        locale === 'ar' ? 'فريق متعدد المستخدمين' : 'Multi-user team',
        locale === 'ar' ? 'API access' : 'API access',
        locale === 'ar' ? 'دعم مخصص' : 'Custom support',
        locale === 'ar' ? 'SSO' : 'SSO',
      ],
      cta: locale === 'ar' ? 'اتصل بنا' : 'Contact Us',
      popular: false,
    },
  ];

  const faqs = [
    {
      question: locale === 'ar' ? 'هل يمكنني البدء مجاناً؟' : 'Can I start for free?',
      answer: locale === 'ar'
        ? 'نعم! يمكنك البدء مجاناً وإنشاء استبيانات غير محدودة. الخطة المجانية تتضمن 100 رد شهرياً.'
        : 'Yes! You can start for free and create unlimited surveys. The free plan includes 100 responses per month.',
    },
    {
      question: locale === 'ar' ? 'هل أحتاج بطاقة ائتمان للبدء؟' : 'Do I need a credit card to start?',
      answer: locale === 'ar'
        ? 'لا، لا تحتاج بطاقة ائتمان للبدء. يمكنك استخدام الخطة المجانية بدون أي معلومات دفع.'
        : 'No, you don\'t need a credit card to start. You can use the free plan without any payment information.',
    },
    {
      question: locale === 'ar' ? 'هل يمكنني الترقية أو التخفيض في أي وقت؟' : 'Can I upgrade or downgrade anytime?',
      answer: locale === 'ar'
        ? 'نعم، يمكنك تغيير خطتك في أي وقت. الترقية سارية فوراً، والتخفيض ساري في نهاية فترة الفوترة الحالية.'
        : 'Yes, you can change your plan anytime. Upgrades take effect immediately, and downgrades take effect at the end of your current billing period.',
    },
    {
      question: locale === 'ar' ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods are available?',
      answer: locale === 'ar'
        ? 'نقبل جميع بطاقات الائتمان الرئيسية وبطاقات الخصم. يمكنك أيضاً الدفع عبر PayPal.'
        : 'We accept all major credit and debit cards. You can also pay via PayPal.',
    },
  ];

  const breadcrumbItems = [
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: siteUrl },
    { name: locale === 'ar' ? 'الأسعار' : 'Pricing', url },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Product Schema for each plan */}
      {plans.map((plan) => (
        <ProductSchema
          key={plan.name}
          name={`Vibeform Pro ${plan.name}`}
          description={plan.description}
          offers={{
            price: plan.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          }}
          locale={locale as 'en' | 'ar'}
        />
      ))}

      {/* FAQ Schema */}
      <FAQPageSchema faqs={faqs} locale={locale as 'en' | 'ar'} />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === 'ar' ? 'خطط التسعير المرنة' : 'Flexible Pricing Plans'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {locale === 'ar'
              ? 'ابدأ مجاناً وارتقِ حسب احتياجاتك. بدون التزامات طويلة الأمد.'
              : 'Start free and scale as you grow. No long-term commitments.'}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    {locale === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link href={locale === 'ar' ? '/ar' : '/'}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            {locale === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {faq.answer}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
