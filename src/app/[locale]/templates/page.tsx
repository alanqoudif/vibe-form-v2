import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { getPrimaryKeyword } from '@/lib/seo/keywords';
import { BreadcrumbSchema } from '@/components/seo/structured-data';
import { routing } from '@/i18n/routing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { FileText, Users, TrendingUp, ClipboardList, Heart, Briefcase, GraduationCap } from 'lucide-react';

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

  const primaryKeyword = getPrimaryKeyword('templates', locale as 'en' | 'ar');
  const path = locale === routing.defaultLocale ? '/templates' : `/${locale}/templates`;

  return generateSEOMetadata({
    title: primaryKeyword,
    description: locale === 'ar'
      ? 'استكشف مكتبة قوالب الاستبيانات الجاهزة: استبيانات تسويقية، استطلاعات رضا العملاء، نماذج تسجيل، وأكثر. ابدأ بسرعة مع قوالب احترافية.'
      : 'Explore our library of ready-made survey templates: marketing surveys, customer satisfaction polls, registration forms, and more. Start quickly with professional templates.',
    locale: locale as 'en' | 'ar',
    path,
    type: 'website',
  });
}

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('templates');
  const isValidLocale = routing.locales.includes(locale as 'en' | 'ar');

  if (!isValidLocale) {
    return null;
  }

  const path = locale === routing.defaultLocale ? '/templates' : `/${locale}/templates`;
  const url = `${siteUrl}${path}`;

  const templateCategories = [
    {
      icon: TrendingUp,
      name: locale === 'ar' ? 'تسويق' : 'Marketing',
      description: locale === 'ar'
        ? 'استبيانات تسويقية وأبحاث السوق'
        : 'Marketing surveys and market research',
      templates: [
        {
          title: locale === 'ar' ? 'استبيان رضا العملاء' : 'Customer Satisfaction Survey',
          description: locale === 'ar'
            ? 'قياس رضا العملاء وتجربتهم'
            : 'Measure customer satisfaction and experience',
          questions: 10,
        },
        {
          title: locale === 'ar' ? 'استطلاع رأي المنتج' : 'Product Feedback Survey',
          description: locale === 'ar'
            ? 'جمع آراء المستخدمين حول المنتج'
            : 'Gather user opinions about the product',
          questions: 8,
        },
        {
          title: locale === 'ar' ? 'استبيان العلامة التجارية' : 'Brand Awareness Survey',
          description: locale === 'ar'
            ? 'قياس وعي المستهلكين بالعلامة التجارية'
            : 'Measure consumer brand awareness',
          questions: 12,
        },
      ],
    },
    {
      icon: Users,
      name: locale === 'ar' ? 'موارد بشرية' : 'Human Resources',
      description: locale === 'ar'
        ? 'استبيانات الموظفين والتوظيف'
        : 'Employee surveys and recruitment',
      templates: [
        {
          title: locale === 'ar' ? 'استبيان رضا الموظفين' : 'Employee Satisfaction Survey',
          description: locale === 'ar'
            ? 'قياس رضا الموظفين عن بيئة العمل'
            : 'Measure employee satisfaction with work environment',
          questions: 15,
        },
        {
          title: locale === 'ar' ? 'نموذج طلب توظيف' : 'Job Application Form',
          description: locale === 'ar'
            ? 'جمع معلومات المرشحين للوظائف'
            : 'Collect information from job candidates',
          questions: 20,
        },
        {
          title: locale === 'ar' ? 'استبيان تقييم الأداء' : 'Performance Review Survey',
          description: locale === 'ar'
            ? 'تقييم أداء الموظفين'
            : 'Evaluate employee performance',
          questions: 12,
        },
      ],
    },
    {
      icon: GraduationCap,
      name: locale === 'ar' ? 'تعليم' : 'Education',
      description: locale === 'ar'
        ? 'استبيانات تعليمية وبحثية'
        : 'Educational and research surveys',
      templates: [
        {
          title: locale === 'ar' ? 'استبيان تقييم الدورة' : 'Course Evaluation Survey',
          description: locale === 'ar'
            ? 'تقييم جودة الدورة التدريبية'
            : 'Evaluate course quality',
          questions: 10,
        },
        {
          title: locale === 'ar' ? 'استبيان بحثي أكاديمي' : 'Academic Research Survey',
          description: locale === 'ar'
            ? 'استبيان للبحوث الأكاديمية'
            : 'Survey for academic research',
          questions: 25,
        },
        {
          title: locale === 'ar' ? 'نموذج تسجيل ورشة عمل' : 'Workshop Registration Form',
          description: locale === 'ar'
            ? 'تسجيل المشاركين في ورش العمل'
            : 'Register participants for workshops',
          questions: 8,
        },
      ],
    },
    {
      icon: Heart,
      name: locale === 'ar' ? 'صحة' : 'Health',
      description: locale === 'ar'
        ? 'استبيانات صحية وطبية'
        : 'Health and medical surveys',
      templates: [
        {
          title: locale === 'ar' ? 'استبيان صحة المريض' : 'Patient Health Survey',
          description: locale === 'ar'
            ? 'تقييم صحة المرضى'
            : 'Assess patient health',
          questions: 15,
        },
        {
          title: locale === 'ar' ? 'استبيان رضا المرضى' : 'Patient Satisfaction Survey',
          description: locale === 'ar'
            ? 'قياس رضا المرضى عن الخدمة'
            : 'Measure patient satisfaction with service',
          questions: 12,
        },
      ],
    },
    {
      icon: Briefcase,
      name: locale === 'ar' ? 'أعمال' : 'Business',
      description: locale === 'ar'
        ? 'استبيانات الأعمال والاستشارات'
        : 'Business and consulting surveys',
      templates: [
        {
          title: locale === 'ar' ? 'استبيان استشارة الأعمال' : 'Business Consultation Survey',
          description: locale === 'ar'
            ? 'جمع معلومات عن احتياجات العمل'
            : 'Gather information about business needs',
          questions: 10,
        },
        {
          title: locale === 'ar' ? 'استبيان شريك محتمل' : 'Potential Partner Survey',
          description: locale === 'ar'
            ? 'تقييم شركاء محتملين'
            : 'Evaluate potential partners',
          questions: 8,
        },
      ],
    },
    {
      icon: ClipboardList,
      name: locale === 'ar' ? 'أحداث' : 'Events',
      description: locale === 'ar'
        ? 'نماذج التسجيل والتقييم للأحداث'
        : 'Registration and evaluation forms for events',
      templates: [
        {
          title: locale === 'ar' ? 'نموذج تسجيل حدث' : 'Event Registration Form',
          description: locale === 'ar'
            ? 'تسجيل المشاركين في الأحداث'
            : 'Register participants for events',
          questions: 6,
        },
        {
          title: locale === 'ar' ? 'استبيان تقييم حدث' : 'Event Evaluation Survey',
          description: locale === 'ar'
            ? 'تقييم نجاح الحدث'
            : 'Evaluate event success',
          questions: 10,
        },
      ],
    },
  ];

  const breadcrumbItems = [
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: siteUrl },
    { name: locale === 'ar' ? 'القوالب' : 'Templates', url },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === 'ar' ? 'قوالب الاستبيانات الجاهزة' : 'Ready-Made Survey Templates'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {locale === 'ar'
              ? 'ابدأ بسرعة مع قوالب احترافية جاهزة للاستخدام. اختر من مجموعة واسعة من القوالب المصممة خصيصاً لاحتياجاتك.'
              : 'Start quickly with professional ready-to-use templates. Choose from a wide range of templates designed specifically for your needs.'}
          </p>
        </div>

        {/* Template Categories */}
        <div className="space-y-16">
          {templateCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold">{category.name}</h2>
                </div>
                <p className="text-muted-foreground mb-6">{category.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.templates.map((template, templateIndex) => (
                    <Card key={templateIndex} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <Badge variant="secondary">
                            {template.questions} {locale === 'ar' ? 'سؤال' : 'questions'}
                          </Badge>
                        </div>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild variant="outline" className="w-full">
                          <Link href={locale === 'ar' ? '/ar' : '/'}>
                            {locale === 'ar' ? 'استخدم هذا القالب' : 'Use This Template'}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">
                {locale === 'ar' ? 'لا تجد القالب المناسب؟' : "Can't find the right template?"}
              </CardTitle>
              <CardDescription>
                {locale === 'ar'
                  ? 'أنشئ استبيانك المخصص باستخدام الذكاء الاصطناعي'
                  : 'Create your custom survey using AI'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg">
                <Link href={locale === 'ar' ? '/ar' : '/'}>
                  {locale === 'ar' ? 'أنشئ استبيان مخصص' : 'Create Custom Survey'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
