/**
 * SEO Keywords Mapping
 * Centralized keyword management for SEO optimization
 */

export const keywordMap = {
  ar: {
    primary: [
      'صانع نماذج',
      'منصة استبيانات',
      'بديل Google Forms',
      'أداة إنشاء استبيانات',
      'نموذج استبيان احترافي',
    ],
    secondary: [
      'استبيانات مجانية',
      'صانع نماذج إلكترونية',
      'أداة جمع البيانات',
      'منصة نماذج متقدمة',
      'استبيانات عربية',
      'نموذج جوجل فورم بديل',
      'أداة استبيان احترافية',
    ],
    longTail: [
      'كيفية إنشاء استبيان احترافي',
      'أفضل منصة استبيانات',
      'صانع نماذج مجاني',
      'بديل Google Forms العربي',
      'منصة استبيانات احترافية',
      'أداة جمع البيانات الإلكترونية',
    ],
    geo: [
      'صانع نماذج في مسقط',
      'منصة استبيانات في الخليج',
      'استبيانات احترافية في السعودية',
      'أداة نماذج في الإمارات',
    ],
  },
  en: {
    primary: [
      'form builder',
      'survey platform',
      'Google Forms alternative',
      'online form builder',
      'survey maker',
    ],
    secondary: [
      'questionnaire builder',
      'free form builder',
      'AI form builder',
      'professional surveys',
      'data collection tool',
      'form creator',
      'survey tool',
      'feedback forms',
    ],
    longTail: [
      'how to create professional forms',
      'best survey platform',
      'free form builder online',
      'Google Forms alternative free',
      'professional form builder',
      'online survey platform',
    ],
    geo: [
      'form builder Middle East',
      'survey platform GCC',
      'form builder Arabic',
      'survey tool Arabic',
    ],
  },
};

/**
 * Get keywords for a specific page type
 */
export function getKeywordsForPage(
  pageType: 'home' | 'features' | 'pricing' | 'faq' | 'templates' | 'comparison' | 'blog',
  locale: 'en' | 'ar' = 'en'
): string[] {
  const baseKeywords = [
    ...keywordMap[locale].primary,
    ...keywordMap[locale].secondary,
  ];

  const pageSpecificKeywords: Record<string, string[]> = {
    home: [
      ...baseKeywords,
      ...keywordMap[locale].longTail.slice(0, 3),
    ],
    features: locale === 'ar'
      ? ['ميزات منصة الاستبيانات', 'مميزات صانع النماذج', 'ميزات Vibeform Pro']
      : ['form builder features', 'survey platform features', 'Vibeform Pro features'],
    pricing: locale === 'ar'
      ? ['أسعار منصة الاستبيانات', 'تكلفة صانع النماذج', 'أسعار Vibeform Pro']
      : ['form builder pricing', 'survey platform cost', 'Vibeform Pro pricing'],
    faq: locale === 'ar'
      ? ['أسئلة شائعة عن الاستبيانات', 'كيفية استخدام صانع النماذج', 'FAQ استبيانات']
      : ['form builder FAQ', 'survey platform questions', 'form builder help'],
    templates: locale === 'ar'
      ? ['قوالب استبيانات جاهزة', 'نماذج استبيان جاهزة', 'قوالب نماذج']
      : ['survey templates', 'form templates', 'questionnaire templates'],
    comparison: locale === 'ar'
      ? ['بديل Google Forms', 'مقارنة مع Google Forms', 'Vibeform vs Google Forms']
      : ['Google Forms alternative', 'vs Google Forms', 'Vibeform vs Google Forms'],
    blog: baseKeywords,
  };

  return pageSpecificKeywords[pageType] || baseKeywords;
}

/**
 * Get primary keyword for a page
 */
export function getPrimaryKeyword(
  pageType: 'home' | 'features' | 'pricing' | 'faq' | 'templates' | 'comparison' | 'blog',
  locale: 'en' | 'ar' = 'en'
): string {
  const primaryKeywords: Record<string, Record<string, string>> = {
    home: {
      ar: 'صانع نماذج احترافي',
      en: 'Professional Form Builder',
    },
    features: {
      ar: 'ميزات منصة الاستبيانات',
      en: 'Form Builder Features',
    },
    pricing: {
      ar: 'أسعار منصة الاستبيانات',
      en: 'Form Builder Pricing',
    },
    faq: {
      ar: 'أسئلة شائعة عن الاستبيانات',
      en: 'Form Builder FAQ',
    },
    templates: {
      ar: 'قوالب استبيانات جاهزة',
      en: 'Survey Templates',
    },
    comparison: {
      ar: 'بديل Google Forms',
      en: 'Google Forms Alternative',
    },
    blog: {
      ar: 'مقالات عن الاستبيانات',
      en: 'Survey Articles',
    },
  };

  return primaryKeywords[pageType]?.[locale] || primaryKeywords.home[locale];
}
