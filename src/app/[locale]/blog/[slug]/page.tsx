import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/structured-data';
import { routing } from '@/i18n/routing';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibeform.pro';

// Mock blog post data - In production, this would come from a CMS or database
const blogPosts: Record<string, {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  content: { ar: string; en: string };
  category: { ar: string; en: string };
  date: string;
  readTime: { ar: string; en: string };
  author: { name: string; url?: string };
  image?: string;
}> = {
  'how-to-create-professional-survey': {
    title: {
      ar: 'كيفية إنشاء استبيان احترافي في 5 خطوات سهلة',
      en: 'How to Create a Professional Survey in 5 Easy Steps',
    },
    description: {
      ar: 'دليل شامل خطوة بخطوة لإنشاء استبيانات احترافية تحصل على نتائج عالية الجودة.',
      en: 'A comprehensive step-by-step guide to creating professional surveys that get high-quality results.',
    },
    content: {
      ar: `
# كيفية إنشاء استبيان احترافي في 5 خطوات سهلة

إنشاء استبيان احترافي ليس صعباً كما يبدو. مع الأدوات الصحيحة والنهج المناسب، يمكنك إنشاء استبيانات فعالة تحصل على نتائج قيمة.

## الخطوة 1: حدد أهدافك

قبل أن تبدأ في إنشاء الاستبيان، من المهم أن تحدد بوضوح ما تريد تحقيقه. ما هي المعلومات التي تحتاجها؟ ما هي القرارات التي ستتخذها بناءً على النتائج؟

## الخطوة 2: صمم أسئلتك بعناية

الأسئلة الجيدة هي أساس الاستبيان الناجح. تأكد من أن أسئلتك:
- واضحة ومباشرة
- ذات صلة بأهدافك
- سهلة الفهم
- غير متحيزة

## الخطوة 3: اختر أنواع الأسئلة المناسبة

استخدم أنواع أسئلة متنوعة لجعل الاستبيان أكثر إثارة للاهتمام:
- أسئلة الاختيار من متعدد للخيارات المحددة
- أسئلة النص المفتوح للآراء التفصيلية
- مقاييس التقييم للقياسات الكمية

## الخطوة 4: اختبر استبيانك

قبل نشر الاستبيان، اختبره مع مجموعة صغيرة من الأشخاص. هذا سيساعدك في اكتشاف أي مشاكل أو أسئلة مربكة.

## الخطوة 5: انشر واجمع النتائج

بعد التأكد من أن كل شيء جاهز، انشر استبيانك وابدأ في جمع النتائج. استخدم أدوات التحليل لفهم البيانات بشكل أفضل.
      `,
      en: `
# How to Create a Professional Survey in 5 Easy Steps

Creating a professional survey isn't as difficult as it seems. With the right tools and approach, you can create effective surveys that get valuable results.

## Step 1: Define Your Goals

Before you start creating the survey, it's important to clearly define what you want to achieve. What information do you need? What decisions will you make based on the results?

## Step 2: Design Your Questions Carefully

Good questions are the foundation of a successful survey. Make sure your questions are:
- Clear and direct
- Relevant to your goals
- Easy to understand
- Unbiased

## Step 3: Choose the Right Question Types

Use a variety of question types to make the survey more interesting:
- Multiple choice questions for specific options
- Open text questions for detailed opinions
- Rating scales for quantitative measurements

## Step 4: Test Your Survey

Before publishing the survey, test it with a small group of people. This will help you discover any problems or confusing questions.

## Step 5: Publish and Collect Results

After making sure everything is ready, publish your survey and start collecting results. Use analytics tools to better understand the data.
      `,
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
    author: {
      name: 'Vibeform Team',
    },
  },
  'vibeform-vs-google-forms-comparison': {
    title: {
      ar: 'Vibeform Pro vs Google Forms: المقارنة الشاملة 2025',
      en: 'Vibeform Pro vs Google Forms: Complete Comparison 2025',
    },
    description: {
      ar: 'مقارنة تفصيلية بين Vibeform Pro و Google Forms. اكتشف أيهما أفضل لاحتياجاتك.',
      en: 'Detailed comparison between Vibeform Pro and Google Forms. Discover which is better for your needs.',
    },
    content: {
      ar: `
# Vibeform Pro vs Google Forms: المقارنة الشاملة 2025

في هذا المقال، سنقارن بين Vibeform Pro و Google Forms لنرى أيهما أفضل لاحتياجاتك.

## الميزات الرئيسية

### Vibeform Pro
- إنشاء بالذكاء الاصطناعي
- مجتمع مجيبين نشط
- تحليلات ذكية
- دعم عربي كامل

### Google Forms
- تكامل مع Google Workspace
- مجاني تماماً
- معروف على نطاق واسع
- تخزين غير محدود

## الخلاصة

إذا كنت تبحث عن منصة حديثة مع ميزات متقدمة، فإن Vibeform Pro هو الخيار الأفضل.
      `,
      en: `
# Vibeform Pro vs Google Forms: Complete Comparison 2025

In this article, we'll compare Vibeform Pro and Google Forms to see which is better for your needs.

## Key Features

### Vibeform Pro
- AI-powered creation
- Active respondent community
- Smart analytics
- Full Arabic support

### Google Forms
- Google Workspace integration
- Completely free
- Widely known
- Unlimited storage

## Conclusion

If you're looking for a modern platform with advanced features, Vibeform Pro is the better choice.
      `,
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
    author: {
      name: 'Vibeform Team',
    },
  },
  'best-practices-survey-design': {
    title: {
      ar: 'أفضل 10 ممارسات لتصميم الاستبيانات',
      en: 'Top 10 Best Practices for Survey Design',
    },
    description: {
      ar: 'تعلم أفضل الممارسات لتصميم استبيانات فعالة تحصل على معدل استجابة عالي.',
      en: 'Learn best practices for designing effective surveys that get high response rates.',
    },
    content: {
      ar: `
# أفضل 10 ممارسات لتصميم الاستبيانات

تصميم استبيان فعال يتطلب اتباع أفضل الممارسات. إليك أهم 10 نصائح:

1. **اجعل الاستبيان قصيراً**: كلما كان أقصر، زادت احتمالية إكماله
2. **استخدم لغة بسيطة**: تجنب المصطلحات المعقدة
3. **ابدأ بأسئلة سهلة**: هذا يشجع المستجيبين على الاستمرار
4. **استخدم أنواع أسئلة متنوعة**: اجعل الاستبيان أكثر إثارة للاهتمام
5. **تجنب الأسئلة المتحيزة**: تأكد من أن أسئلتك محايدة
6. **اختبر قبل النشر**: تأكد من أن كل شيء يعمل بشكل صحيح
7. **قدم حوافز**: شجع المشاركة بمكافآت صغيرة
8. **استخدم تصميم جذاب**: المظهر مهم أيضاً
9. **اجعل الاستبيان متاحاً على الهاتف**: معظم الناس يستخدمون هواتفهم
10. **تابع النتائج**: استخدم التحليلات لتحسين استبياناتك المستقبلية
      `,
      en: `
# Top 10 Best Practices for Survey Design

Designing an effective survey requires following best practices. Here are the top 10 tips:

1. **Keep it short**: The shorter, the more likely it is to be completed
2. **Use simple language**: Avoid complex terminology
3. **Start with easy questions**: This encourages respondents to continue
4. **Use varied question types**: Make the survey more interesting
5. **Avoid biased questions**: Make sure your questions are neutral
6. **Test before publishing**: Make sure everything works correctly
7. **Offer incentives**: Encourage participation with small rewards
8. **Use attractive design**: Appearance matters too
9. **Make it mobile-friendly**: Most people use their phones
10. **Track results**: Use analytics to improve your future surveys
      `,
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
    author: {
      name: 'Vibeform Team',
    },
  },
};

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

  const post = blogPosts[slug];
  if (!post) {
    return {};
  }

  const path = locale === routing.defaultLocale ? `/blog/${slug}` : `/${locale}/blog/${slug}`;

  return generateSEOMetadata({
    title: post.title[locale as 'en' | 'ar'],
    description: post.description[locale as 'en' | 'ar'],
    locale: locale as 'en' | 'ar',
    path,
    type: 'article',
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isValidLocale = routing.locales.includes(locale as 'en' | 'ar');

  if (!isValidLocale) {
    notFound();
  }

  const post = blogPosts[slug];
  if (!post) {
    notFound();
  }

  const path = locale === routing.defaultLocale ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
  const url = `${siteUrl}${path}`;

  const breadcrumbItems = [
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: siteUrl },
    { name: locale === 'ar' ? 'المدونة' : 'Blog', url: `${siteUrl}/${locale === 'ar' ? 'ar' : ''}/blog` },
    { name: post.title[locale as 'en' | 'ar'], url },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Article Schema */}
      <ArticleSchema
        headline={post.title[locale as 'en' | 'ar']}
        description={post.description[locale as 'en' | 'ar']}
        author={post.author}
        datePublished={post.date}
        publisher={{
          name: 'Vibeform Pro',
          logo: `${siteUrl}/fonts/vibe form logo.png`,
        }}
        locale={locale as 'en' | 'ar'}
      />

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      <article className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back Button */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {locale === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}
        </Link>

        {/* Header */}
        <header className="mb-8">
          <Badge variant="secondary" className="mb-4">
            {post.category[locale as 'en' | 'ar']}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {post.title[locale as 'en' | 'ar']}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {post.description[locale as 'en' | 'ar']}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime[locale as 'en' | 'ar']}</span>
            </div>
            <span>بواسطة {post.author.name}</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">
            {post.content[locale as 'en' | 'ar']}
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">
            {locale === 'ar' ? 'مقالات ذات صلة' : 'Related Articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(blogPosts)
              .filter(([key]) => key !== slug)
              .slice(0, 2)
              .map(([key, relatedPost]) => (
                <Card key={key} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardDescription className="text-xs mb-2">
                      {relatedPost.category[locale as 'en' | 'ar']}
                    </CardDescription>
                    <Link
                      href={`/${locale}/blog/${key}`}
                      className="text-lg font-semibold hover:text-primary transition-colors"
                    >
                      {relatedPost.title[locale as 'en' | 'ar']}
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">
                      {relatedPost.description[locale as 'en' | 'ar']}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
}

