import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { routing } from '@/i18n/routing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibeform.pro';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  
  // Static pages with SEO optimization
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${siteUrl}`,
          ar: `${siteUrl}/ar`,
        },
      },
    },
    {
      url: `${siteUrl}/feed`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/feed`,
          ar: `${siteUrl}/ar/feed`,
        },
      },
    },
    // Features page
    {
      url: `${siteUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/features`,
          ar: `${siteUrl}/ar/features`,
        },
      },
    },
    // Pricing page
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/pricing`,
          ar: `${siteUrl}/ar/pricing`,
        },
      },
    },
    // FAQ page
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/faq`,
          ar: `${siteUrl}/ar/faq`,
        },
      },
    },
    // Templates page
    {
      url: `${siteUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/templates`,
          ar: `${siteUrl}/ar/templates`,
        },
      },
    },
    // Comparison page
    {
      url: `${siteUrl}/vs-google-forms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/vs-google-forms`,
          ar: `${siteUrl}/ar/vs-google-forms`,
        },
      },
    },
    // Blog page
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/blog`,
          ar: `${siteUrl}/ar/blog`,
        },
      },
    },
  ];

  // Fetch published forms
  let formPages: MetadataRoute.Sitemap = [];
  
  try {
    const { data: forms, error } = await supabase
      .from('forms')
      .select('id, updated_at, published_at, primary_language')
      .eq('status', 'published')
      .eq('visibility', 'public')
      .order('published_at', { ascending: false })
      .limit(1000); // Limit to prevent too large sitemap

    if (!error && forms) {
      formPages = forms.map((form) => {
        const lastModified = form.updated_at 
          ? new Date(form.updated_at)
          : form.published_at
          ? new Date(form.published_at)
          : new Date();

        const baseUrl = `${siteUrl}/f/${form.id}`;
        const locale = form.primary_language || 'en';
        
        return {
          url: locale === 'ar' ? `${siteUrl}/ar/f/${form.id}` : baseUrl,
          lastModified,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
          alternates: {
            languages: {
              en: baseUrl,
              ar: `${siteUrl}/ar/f/${form.id}`,
            },
          },
        };
      });
    }
  } catch (error) {
    console.error('Error fetching forms for sitemap:', error);
  }

  return [...staticPages, ...formPages];
}

