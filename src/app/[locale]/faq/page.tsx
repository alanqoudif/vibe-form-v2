import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { getPrimaryKeyword } from '@/lib/seo/keywords';
import { FAQPageSchema } from '@/components/seo/structured-data';
import { BreadcrumbSchema } from '@/components/seo/structured-data';
import { routing } from '@/i18n/routing';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

  const primaryKeyword = getPrimaryKeyword('faq', locale as 'en' | 'ar');
  const path = locale === routing.defaultLocale ? '/faq' : `/${locale}/faq`;

  return generateSEOMetadata({
    title: primaryKeyword,
    description: locale === 'ar'
      ? 'إجابات على الأسئلة الشائعة حول Vibeform Pro: كيفية الاستخدام، الأسعار، الميزات، والدعم. كل ما تحتاج معرفته عن منصة الاستبيانات.'
      : 'Answers to frequently asked questions about Vibeform Pro: how to use, pricing, features, and support. Everything you need to know about the survey platform.',
    locale: locale as 'en' | 'ar',
    path,
    type: 'website',
  });
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('faq');
  const isValidLocale = routing.locales.includes(locale as 'en' | 'ar');

  if (!isValidLocale) {
    return null;
  }

  const path = locale === routing.defaultLocale ? '/faq' : `/${locale}/faq`;
  const url = `${siteUrl}${path}`;

  const faqCategories = [
    {
      category: locale === 'ar' ? 'عام' : 'General',
      questions: [
        {
          question: locale === 'ar' ? 'ما هو Vibeform Pro؟' : 'What is Vibeform Pro?',
          answer: locale === 'ar'
            ? 'Vibeform Pro هو منصة متقدمة لإنشاء الاستبيانات والنماذج بالذكاء الاصطناعي. يمكنك إنشاء استبيانات احترافية في ثوانٍ والحصول على ردود عالية الجودة من مجتمعنا النشط.'
            : 'Vibeform Pro is an advanced platform for creating surveys and forms with AI. You can create professional surveys in seconds and get quality responses from our active community.',
        },
        {
          question: locale === 'ar' ? 'كيف يختلف Vibeform Pro عن Google Forms؟' : 'How is Vibeform Pro different from Google Forms?',
          answer: locale === 'ar'
            ? 'Vibeform Pro يوفر إنشاء بالذكاء الاصطناعي، مجتمع مجيبين نشط، تحليلات ذكية، ودعم عربي كامل. بينما Google Forms يتطلب إنشاء يدوي ولا يوفر مجتمع مجيبين.'
            : 'Vibeform Pro offers AI-powered creation, active respondent community, smart analytics, and full Arabic support. While Google Forms requires manual creation and doesn\'t provide a respondent community.',
        },
        {
          question: locale === 'ar' ? 'هل Vibeform Pro مجاني؟' : 'Is Vibeform Pro free?',
          answer: locale === 'ar'
            ? 'نعم، يمكنك البدء مجاناً وإنشاء استبيانات غير محدودة. الخطة المجانية تتضمن 100 رد شهرياً. لدينا أيضاً خطط احترافية بأسعار تنافسية.'
            : 'Yes, you can start for free and create unlimited surveys. The free plan includes 100 responses per month. We also have professional plans at competitive prices.',
        },
      ],
    },
    {
      category: locale === 'ar' ? 'الاستخدام' : 'Usage',
      questions: [
        {
          question: locale === 'ar' ? 'كيف أنشئ استبيان؟' : 'How do I create a survey?',
          answer: locale === 'ar'
            ? 'ببساطة اكتب وصفاً لما تريده في صندوق النص الرئيسي، وسيقوم الذكاء الاصطناعي بإنشاء استبيان كامل لك. يمكنك بعد ذلك تعديل الأسئلة والإعدادات حسب احتياجاتك.'
            : 'Simply type a description of what you want in the main text box, and AI will create a complete survey for you. You can then edit questions and settings according to your needs.',
        },
        {
          question: locale === 'ar' ? 'كم عدد الأسئلة التي يمكنني إضافتها؟' : 'How many questions can I add?',
          answer: locale === 'ar'
            ? 'لا يوجد حد لعدد الأسئلة. يمكنك إضافة عدد غير محدود من الأسئلة في استبيانك.'
            : 'There is no limit to the number of questions. You can add unlimited questions to your survey.',
        },
        {
          question: locale === 'ar' ? 'ما هي أنواع الأسئلة المتاحة؟' : 'What question types are available?',
          answer: locale === 'ar'
            ? 'نوفر 7 أنواع أسئلة: نص قصير، نص طويل، اختيار من متعدد، مربعات اختيار، مقياس ليكرت، تقييم بالنجوم، وقائمة منسدلة.'
            : 'We offer 7 question types: short text, long text, multiple choice, checkboxes, Likert scale, star rating, and dropdown.',
        },
        {
          question: locale === 'ar' ? 'كيف أشارك استبياني؟' : 'How do I share my survey?',
          answer: locale === 'ar'
            ? 'بعد نشر استبيانك، ستحصل على رابط فريد يمكنك مشاركته. يمكنك أيضاً نشره في مجتمع Vibeform Pro للحصول على ردود من مجتمعنا.'
            : 'After publishing your survey, you\'ll get a unique link that you can share. You can also publish it in the Vibeform Pro community to get responses from our community.',
        },
      ],
    },
    {
      category: locale === 'ar' ? 'التحليلات والنتائج' : 'Analytics & Results',
      questions: [
        {
          question: locale === 'ar' ? 'كيف أرى نتائج استبياني؟' : 'How do I see my survey results?',
          answer: locale === 'ar'
            ? 'يمكنك عرض نتائجك في لوحة التحليلات. نوفر إحصائيات مفصلة، رسوم بيانية، وتحليلات مدعومة بالذكاء الاصطناعي لردودك.'
            : 'You can view your results in the analytics dashboard. We provide detailed statistics, charts, and AI-powered analytics for your responses.',
        },
        {
          question: locale === 'ar' ? 'هل يمكنني تصدير النتائج؟' : 'Can I export the results?',
          answer: locale === 'ar'
            ? 'نعم، يمكنك تصدير نتائجك بصيغة CSV في الخطط الاحترافية.'
            : 'Yes, you can export your results in CSV format in professional plans.',
        },
        {
          question: locale === 'ar' ? 'ما هي التحليلات الذكية؟' : 'What are smart analytics?',
          answer: locale === 'ar'
            ? 'التحليلات الذكية تستخدم الذكاء الاصطناعي لتلخيص ردودك، تحليل المشاعر، واستخراج الأنماط والرؤى المهمة تلقائياً.'
            : 'Smart analytics use AI to summarize your responses, analyze sentiment, and automatically extract important patterns and insights.',
        },
      ],
    },
    {
      category: locale === 'ar' ? 'النقاط والترويج' : 'Credits & Promotion',
      questions: [
        {
          question: locale === 'ar' ? 'كيف أكسب نقاط؟' : 'How do I earn credits?',
          answer: locale === 'ar'
            ? 'يمكنك كسب نقاط من خلال الإجابة على الاستبيانات في مجتمعنا. كل استبيان تكملة يعطيك نقاطاً بناءً على الجودة والوقت المستغرق.'
            : 'You can earn credits by answering surveys in our community. Each survey you complete gives you credits based on quality and time spent.',
        },
        {
          question: locale === 'ar' ? 'كيف أروّج استبياني؟' : 'How do I promote my survey?',
          answer: locale === 'ar'
            ? 'يمكنك استخدام النقاط التي كسبتها لترويج استبيانك في مجتمعنا. الترويج يزيد من ظهور استبيانك ويساعدك في الحصول على ردود أكثر.'
            : 'You can use the credits you\'ve earned to promote your survey in our community. Promotion increases your survey\'s visibility and helps you get more responses.',
        },
        {
          question: locale === 'ar' ? 'كم تكلفة الترويج؟' : 'How much does promotion cost?',
          answer: locale === 'ar'
            ? 'تكلفة الترويج تعتمد على المدة والموقع. يمكنك اختيار من خطط ترويج مختلفة تناسب احتياجاتك.'
            : 'Promotion cost depends on duration and placement. You can choose from different promotion plans that suit your needs.',
        },
      ],
    },
    {
      category: locale === 'ar' ? 'الأمان والخصوصية' : 'Security & Privacy',
      questions: [
        {
          question: locale === 'ar' ? 'هل بياناتي آمنة؟' : 'Is my data secure?',
          answer: locale === 'ar'
            ? 'نعم، نأخذ أمان البيانات على محمل الجد. جميع البيانات مشفرة ونتبع أفضل ممارسات الأمان. يمكنك أيضاً جعل استبياناتك خاصة.'
            : 'Yes, we take data security seriously. All data is encrypted and we follow security best practices. You can also make your surveys private.',
        },
        {
          question: locale === 'ar' ? 'هل يمكنني جعل استبياني خاصاً؟' : 'Can I make my survey private?',
          answer: locale === 'ar'
            ? 'نعم، يمكنك اختيار رؤية استبيانك: عام (يظهر في المجتمع)، غير مدرج (فقط بالرابط)، أو خاص (فقط للمدعوين).'
            : 'Yes, you can choose your survey\'s visibility: public (appears in community), unlisted (link only), or private (invited only).',
        },
        {
          question: locale === 'ar' ? 'ما هي سياسة الخصوصية؟' : 'What is the privacy policy?',
          answer: locale === 'ar'
            ? 'نحترم خصوصية المستخدمين. يمكن للمجيبين الإجابة بشكل مجهول، ولا نشارك بياناتك مع أطراف ثالثة. يمكنك قراءة سياسة الخصوصية الكاملة على موقعنا.'
            : 'We respect user privacy. Respondents can answer anonymously, and we don\'t share your data with third parties. You can read the full privacy policy on our website.',
        },
      ],
    },
  ];

  // Flatten all FAQs for schema
  const allFAQs = faqCategories.flatMap((cat) =>
    cat.questions.map((q) => ({
      question: q.question,
      answer: q.answer,
    }))
  );

  const breadcrumbItems = [
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: siteUrl },
    { name: locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', url },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* FAQ Schema */}
      <FAQPageSchema faqs={allFAQs} locale={locale as 'en' | 'ar'} />

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {locale === 'ar'
              ? 'إجابات على الأسئلة الأكثر شيوعاً حول Vibeform Pro'
              : 'Answers to the most common questions about Vibeform Pro'}
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-2xl">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription className="text-base leading-relaxed">
                          {faq.answer}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">
                {locale === 'ar' ? 'لا تجد إجابة؟' : "Can't find an answer?"}
              </CardTitle>
              <CardDescription>
                {locale === 'ar'
                  ? 'تواصل معنا وسنكون سعداء بمساعدتك'
                  : 'Contact us and we\'ll be happy to help you'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {locale === 'ar'
                  ? 'راسلنا على: support@vibeform.pro'
                  : 'Email us at: support@vibeform.pro'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
