import Script from 'next/script';

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  locale?: 'en' | 'ar';
}

export function OrganizationSchema({
  name = 'Vibe Form',
  url = 'https://vibeform.pro',
  logo = 'https://vibeform.pro/fonts/vibe form logo.png',
  description,
  locale = 'en',
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
    },
    description: description || (locale === 'ar'
      ? 'منصة لإنشاء النماذج والاستبيانات بالذكاء الاصطناعي'
      : 'AI-powered platform for creating forms and surveys'),
    sameAs: [
      // Add social media links when available
    ],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebSiteSchemaProps {
  url?: string;
  name?: string;
  description?: string;
  locale?: 'en' | 'ar';
}

export function WebSiteSchema({
  url = 'https://vibeform.pro',
  name = 'Vibe Form',
  description,
  locale = 'en',
}: WebSiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description: description || (locale === 'ar'
      ? 'أنشئ نماذج واستبيانات احترافية بالذكاء الاصطناعي'
      : 'Create professional forms and surveys with AI'),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface SoftwareApplicationSchemaProps {
  name?: string;
  url?: string;
  description?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  locale?: 'en' | 'ar';
}

export function SoftwareApplicationSchema({
  name = 'Vibe Form',
  url = 'https://vibeform.pro',
  description,
  applicationCategory = 'WebApplication',
  operatingSystem = 'Web',
  locale = 'en',
}: SoftwareApplicationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    url,
    description: description || (locale === 'ar'
      ? 'تطبيق ويب لإنشاء النماذج والاستبيانات بالذكاء الاصطناعي'
      : 'Web application for creating forms and surveys with AI'),
    applicationCategory,
    operatingSystem,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
    },
  };

  return (
    <Script
      id="software-application-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FormSchemaProps {
  name: string;
  description?: string;
  url: string;
  author?: string;
  datePublished?: string;
  locale?: 'en' | 'ar';
}

export function FormSchema({
  name,
  description,
  url,
  author,
  datePublished,
  locale = 'en',
}: FormSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    ...(author && {
      author: {
        '@type': 'Person',
        name: author,
      },
    }),
    ...(datePublished && {
      datePublished,
    }),
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
  };

  return (
    <Script
      id="form-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQPage Schema
interface FAQPageSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  locale?: 'en' | 'ar';
}

export function FAQPageSchema({ faqs, locale = 'en' }: FAQPageSchemaProps) {
  const schema = {
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

  return (
    <Script
      id="faq-page-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// HowTo Schema
interface HowToSchemaProps {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
  totalTime?: string;
  locale?: 'en' | 'ar';
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  locale = 'en',
}: HowToSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: step.image,
      }),
    })),
    ...(totalTime && {
      totalTime: totalTime,
    }),
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
  };

  return (
    <Script
      id="howto-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article Schema
interface ArticleSchemaProps {
  headline: string;
  description?: string;
  image?: string;
  author?: {
    name: string;
    url?: string;
  };
  datePublished?: string;
  dateModified?: string;
  publisher?: {
    name: string;
    logo?: string;
  };
  locale?: 'en' | 'ar';
}

export function ArticleSchema({
  headline,
  description,
  image,
  author,
  datePublished,
  dateModified,
  publisher,
  locale = 'en',
}: ArticleSchemaProps) {
  const schema = {
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
    ...(publisher && {
      publisher: {
        '@type': 'Organization',
        name: publisher.name,
        ...(publisher.logo && {
          logo: {
            '@type': 'ImageObject',
            url: publisher.logo,
          },
        }),
      },
    }),
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Product Schema
interface ProductSchemaProps {
  name: string;
  description?: string;
  image?: string;
  brand?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
  };
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
  };
  locale?: 'en' | 'ar';
}

export function ProductSchema({
  name,
  description,
  image,
  brand,
  offers,
  aggregateRating,
  locale = 'en',
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description && { description }),
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
      },
    }),
    ...(brand && {
      brand: {
        '@type': 'Brand',
        name: brand,
      },
    }),
    ...(offers && {
      offers: {
        '@type': 'Offer',
        ...(offers.price && { price: offers.price }),
        ...(offers.priceCurrency && { priceCurrency: offers.priceCurrency }),
        ...(offers.availability && { availability: offers.availability }),
        ...(offers.url && { url: offers.url }),
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

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// LocalBusiness Schema
interface LocalBusinessSchemaProps {
  name: string;
  description?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude: string;
    longitude: string;
  };
  telephone?: string;
  url?: string;
  openingHours?: string[];
  priceRange?: string;
  image?: string;
  locale?: 'en' | 'ar';
}

export function LocalBusinessSchema({
  name,
  description,
  address,
  geo,
  telephone,
  url,
  openingHours,
  priceRange,
  image,
  locale = 'en',
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    ...(description && { description }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...(address.streetAddress && { streetAddress: address.streetAddress }),
        ...(address.addressLocality && { addressLocality: address.addressLocality }),
        ...(address.addressRegion && { addressRegion: address.addressRegion }),
        ...(address.postalCode && { postalCode: address.postalCode }),
        ...(address.addressCountry && { addressCountry: address.addressCountry }),
      },
    }),
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    ...(telephone && { telephone }),
    ...(url && { url }),
    ...(openingHours && { openingHoursSpecification: openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours,
    })) }),
    ...(priceRange && { priceRange }),
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
      },
    }),
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Review/Rating Schema
interface ReviewSchemaProps {
  itemReviewed: {
    name: string;
    type?: string;
  };
  reviewRating: {
    ratingValue: string;
    bestRating?: string;
    worstRating?: string;
  };
  author?: {
    name: string;
    type?: string;
  };
  reviewBody?: string;
  datePublished?: string;
  locale?: 'en' | 'ar';
}

export function ReviewSchema({
  itemReviewed,
  reviewRating,
  author,
  reviewBody,
  datePublished,
  locale = 'en',
}: ReviewSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': itemReviewed.type || 'Product',
      name: itemReviewed.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: reviewRating.ratingValue,
      ...(reviewRating.bestRating && { bestRating: reviewRating.bestRating }),
      ...(reviewRating.worstRating && { worstRating: reviewRating.worstRating }),
    },
    ...(author && {
      author: {
        '@type': author.type || 'Person',
        name: author.name,
      },
    }),
    ...(reviewBody && { reviewBody }),
    ...(datePublished && { datePublished }),
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
  };

  return (
    <Script
      id="review-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

