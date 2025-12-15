import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { getPrimaryKeyword } from '@/lib/seo/keywords';
import { BreadcrumbSchema } from '@/components/seo/structured-data';
import { routing } from '@/i18n/routing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X, Check } from 'lucide-react';
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

  const primaryKeyword = getPrimaryKeyword('comparison', locale as 'en' | 'ar');
  const path = locale === routing.defaultLocale ? '/vs-google-forms' : `/${locale}/vs-google-forms`;

  return generateSEOMetadata({
    title: primaryKeyword,
    description: locale === 'ar'
      ? 'مقارنة شاملة بين Vibeform Pro و Google Forms. اكتشف لماذا Vibeform Pro هو البديل الأفضل: ذكاء اصطناعي، مجتمع مجيبين، تحليلات ذكية، ودعم عربي كامل.'
      : 'Comprehensive comparison between Vibeform Pro and Google Forms. Discover why Vibeform Pro is the better alternative: AI, respondent community, smart analytics, and full Arabic support.',
    locale: locale as 'en' | 'ar',
    path,
    type: 'website',
  });
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('comparison');
  const isValidLocale = routing.locales.includes(locale as 'en' | 'ar');

  if (!isValidLocale) {
    return null;
  }

  const path = locale === routing.defaultLocale ? '/vs-google-forms' : `/${locale}/vs-google-forms`;
  const url = `${siteUrl}${path}`;

  const comparisonFeatures = [
    {
      feature: locale === 'ar' ? 'إنشاء بالذكاء الاصطناعي' : 'AI-Powered Creation',
      vibeform: true,
      googleForms: false,
      description: locale === 'ar'
        ? 'أنشئ استبيانات كاملة ببساطة وصف ما تريده'
        : 'Create complete surveys by simply describing what you want',
    },
    {
      feature: locale === 'ar' ? 'مجتمع المجيبين' : 'Respondent Community',
      vibeform: true,
      googleForms: false,
      description: locale === 'ar'
        ? 'احصل على ردود من مجتمعنا النشط من المجيبين'
        : 'Get responses from our active community of respondents',
    },
    {
      feature: locale === 'ar' ? 'تحليلات ذكية' : 'Smart Analytics',
      vibeform: true,
      googleForms: false,
      description: locale === 'ar'
        ? 'تحليلات مدعومة بالذكاء الاصطناعي مع تلخيص تلقائي'
        : 'AI-powered analytics with automatic summarization',
    },
    {
      feature: locale === 'ar' ? 'دعم عربي كامل' : 'Full Arabic Support',
      vibeform: true,
      googleForms: false,
      description: locale === 'ar'
        ? 'واجهة RTL كاملة ودعم عربي متقدم'
        : 'Full RTL interface and advanced Arabic support',
    },
    {
      feature: locale === 'ar' ? 'نظام النقاط والترويج' : 'Credits & Promotion System',
      vibeform: true,
      googleForms: false,
      description: locale === 'ar'
        ? 'اكسب نقاط من الإجابة وروّج استبياناتك'
        : 'Earn credits from answering and promote your surveys',
    },
    {
      feature: locale === 'ar' ? 'أنواع الأسئلة المتقدمة' : 'Advanced Question Types',
      vibeform: true,
      googleForms: true,
      description: locale === 'ar'
        ? 'دعم أنواع أسئلة متعددة ومتقدمة'
        : 'Support for multiple and advanced question types',
    },
    {
      feature: locale === 'ar' ? 'تصدير البيانات' : 'Data Export',
      vibeform: true,
      googleForms: true,
      description: locale === 'ar'
        ? 'تصدير النتائج بصيغ مختلفة'
        : 'Export results in different formats',
    },
    {
      feature: locale === 'ar' ? 'مجاني للاستخدام' : 'Free to Use',
      vibeform: true,
      googleForms: true,
      description: locale === 'ar'
        ? 'خطة مجانية متاحة للجميع'
        : 'Free plan available for everyone',
    },
    {
      feature: locale === 'ar' ? 'سهولة الاستخدام' : 'Ease of Use',
      vibeform: true,
      googleForms: true,
      description: locale === 'ar'
        ? 'واجهة بسيطة وسهلة الاستخدام'
        : 'Simple and easy-to-use interface',
    },
    {
      feature: locale === 'ar' ? 'التكامل مع أدوات أخرى' : 'Integration with Other Tools',
      vibeform: false,
      googleForms: true,
      description: locale === 'ar'
        ? 'تكامل مع Google Workspace وأدوات أخرى'
        : 'Integration with Google Workspace and other tools',
    },
  ];

  const breadcrumbItems = [
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: siteUrl },
    { name: locale === 'ar' ? 'المقارنة' : 'Comparison', url },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === 'ar' ? 'Vibeform Pro vs Google Forms' : 'Vibeform Pro vs Google Forms'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {locale === 'ar'
              ? 'مقارنة شاملة بين Vibeform Pro و Google Forms. اكتشف البديل الأفضل لاحتياجاتك.'
              : 'Comprehensive comparison between Vibeform Pro and Google Forms. Discover the better alternative for your needs.'}
          </p>
        </div>

        {/* Comparison Table */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {locale === 'ar' ? 'مقارنة الميزات' : 'Feature Comparison'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">
                      {locale === 'ar' ? 'الميزة' : 'Feature'}
                    </th>
                    <th className="text-center p-4 font-semibold">Vibeform Pro</th>
                    <th className="text-center p-4 font-semibold">Google Forms</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">{item.feature}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </div>
                      </td>
                      <td className="text-center p-4">
                        {item.vibeform ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-6 w-6 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-4">
                        {item.googleForms ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-6 w-6 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Comparison Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Vibeform Pro Advantages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Check className="h-6 w-6 text-green-500" />
                {locale === 'ar' ? 'مميزات Vibeform Pro' : 'Vibeform Pro Advantages'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  locale === 'ar'
                    ? 'إنشاء بالذكاء الاصطناعي يوفر الوقت والجهد'
                    : 'AI-powered creation saves time and effort',
                  locale === 'ar'
                    ? 'مجتمع مجيبين نشط يساعدك في الحصول على ردود'
                    : 'Active respondent community helps you get responses',
                  locale === 'ar'
                    ? 'تحليلات ذكية مع تلخيص تلقائي وتحليل المشاعر'
                    : 'Smart analytics with automatic summarization and sentiment analysis',
                  locale === 'ar'
                    ? 'دعم عربي كامل مع واجهة RTL'
                    : 'Full Arabic support with RTL interface',
                  locale === 'ar'
                    ? 'نظام نقاط وترويج لزيادة التفاعل'
                    : 'Credits and promotion system to increase engagement',
                ].map((advantage, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Google Forms Advantages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Check className="h-6 w-6 text-blue-500" />
                {locale === 'ar' ? 'مميزات Google Forms' : 'Google Forms Advantages'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  locale === 'ar'
                    ? 'تكامل قوي مع Google Workspace'
                    : 'Strong integration with Google Workspace',
                  locale === 'ar'
                    ? 'معروف على نطاق واسع وسهل الوصول'
                    : 'Widely known and easily accessible',
                  locale === 'ar'
                    ? 'مجاني تماماً بدون قيود'
                    : 'Completely free without restrictions',
                  locale === 'ar'
                    ? 'تخزين غير محدود في Google Drive'
                    : 'Unlimited storage in Google Drive',
                  locale === 'ar'
                    ? 'دعم متعدد اللغات (محدود للعربية)'
                    : 'Multilingual support (limited for Arabic)',
                ].map((advantage, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Verdict Section */}
        <Card className="bg-primary/10 border-primary mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {locale === 'ar' ? 'الخلاصة' : 'The Verdict'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-lg">
                {locale === 'ar'
                  ? 'إذا كنت تبحث عن منصة استبيانات حديثة مع ذكاء اصطناعي، مجتمع مجيبين، وتحليلات ذكية، فإن Vibeform Pro هو الخيار الأفضل لك.'
                  : 'If you\'re looking for a modern survey platform with AI, respondent community, and smart analytics, then Vibeform Pro is the better choice for you.'}
              </p>
              <p className="text-muted-foreground">
                {locale === 'ar'
                  ? 'Google Forms مناسب للاستخدامات البسيطة والتكامل مع Google Workspace، بينما Vibeform Pro يوفر ميزات متقدمة للمحترفين والشركات.'
                  : 'Google Forms is suitable for simple uses and integration with Google Workspace, while Vibeform Pro offers advanced features for professionals and businesses.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {locale === 'ar' ? 'جاهز للتجربة؟' : 'Ready to Try?'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {locale === 'ar'
              ? 'ابدأ مجاناً واكتشف الفرق بنفسك'
              : 'Start free and discover the difference yourself'}
          </p>
          <Button asChild size="lg">
            <Link href={locale === 'ar' ? '/ar' : '/'}>
              {locale === 'ar' ? 'ابدأ مجاناً الآن' : 'Start Free Now'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
