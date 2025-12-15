/**
 * Schema Helpers for SEO
 * Utility functions for generating structured data
 */

import { keywordMap } from './keywords';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibeform.pro';

/**
 * Generate FAQPage schema data
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
  locale: 'en' | 'ar' = 'en'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
  };
}

/**
 * Generate HowTo schema data
 */
export function generateHowToSchema(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>,
  totalTime?: string,
  locale: 'en' | 'ar' = 'en'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
    ...(totalTime && { totalTime }),
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
  };
}

/**
 * Generate Product schema data
 */
export function generateProductSchema(
  name: string,
  description: string,
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  },
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
  },
  locale: 'en' | 'ar' = 'en'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: 'Vibeform Pro',
    },
    ...(offers && {
      offers: {
        '@type': 'Offer',
        price: offers.price || '0',
        priceCurrency: offers.priceCurrency || 'USD',
        availability: offers.availability || 'https://schema.org/InStock',
        url: siteUrl,
      },
    }),
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
      },
    }),
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
  };
}

/**
 * Generate Breadcrumb schema data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Article schema data
 */
export function generateArticleSchema(
  headline: string,
  description?: string,
  image?: string,
  author?: { name: string; url?: string },
  datePublished?: string,
  dateModified?: string,
  locale: 'en' | 'ar' = 'en'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(description && { description }),
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
      },
    }),
    ...(author && {
      author: {
        '@type': 'Person',
        name: author.name,
        ...(author.url && { url: author.url }),
      },
    }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    publisher: {
      '@type': 'Organization',
      name: 'Vibeform Pro',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/fonts/vibe form logo.png`,
      },
    },
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
  };
}

