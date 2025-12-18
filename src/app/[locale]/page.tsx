"use client";

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { MyFormsSection } from '@/components/landing/my-forms-section';
import { useAuth } from '@/lib/hooks/use-auth';
import { useForms } from '@/lib/hooks/use-forms';
import { toast } from 'sonner';

// Lazy load HeroWave to reduce initial JavaScript bundle size
// Three.js and GSAP will only load when this component is rendered
const HeroWave = dynamic(
  () => import('@/components/ui/ai-input-hero').then((mod) => ({ default: mod.HeroWave })),
  {
    ssr: false, // Three.js only works in browser
    loading: () => (
      <section className="min-h-screen bg-[#0c0c14] dark:bg-[#0c0c14] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight">
            {typeof window !== 'undefined' ? 'Loading...' : ''}
          </h1>
        </div>
      </section>
    ),
  }
);

export default function HomePage() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const router = useRouter();
  const { user, isHydrated } = useAuth();
  const [isGenerating] = useState(false);

  // Use React Query for fetching forms - much better caching and state management
  const { data: forms = [], isLoading: isLoadingForms } = useForms(6);

  const handlePromptSubmit = useCallback(async (prompt: string) => {
    // Check if user is logged in
    if (!user) {
      // Redirect to login with the prompt stored
      sessionStorage.setItem('pendingPrompt', prompt);
      router.push('/login?redirect=/');
      toast.info(t('loginToCreate') || 'Please log in to create a form');
      return;
    }

    // Redirect to the AI builder animation page
    router.push(`/building?prompt=${encodeURIComponent(prompt)}`);
  }, [user, router, t]);

  // Handle pending prompt after login
  useEffect(() => {
    // Only check if user is hydrated and exists
    if (!isHydrated || !user) return;

    const checkPendingPrompt = () => {
      const pendingPrompt = sessionStorage.getItem('pendingPrompt');
      if (pendingPrompt) {
        sessionStorage.removeItem('pendingPrompt');
        // Auto-trigger form generation with the pending prompt
        handlePromptSubmit(pendingPrompt);
      }
    };

    // Small delay to ensure auth state is fully settled
    const timer = setTimeout(checkPendingPrompt, 300);
    return () => clearTimeout(timer);
  }, [user, isHydrated, handlePromptSubmit]);

  const suggestions = [
    t('suggestions.fitness'),
    t('suggestions.recipe'),
    t('suggestions.landing'),
    t('suggestions.travel'),
    t('suggestions.blog'),
    t('suggestions.support'),
    t('suggestions.finance'),
  ];

  // Show content progressively - don't block everything
  // Hero section always shows immediately
  // Forms section shows when hydrated and user exists
  // Features section shows when hydrated and no user
  const showUserForms = isHydrated && !!user;
  const showFeatures = isHydrated && !user;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - Always show immediately, no blocking */}
      <HeroWave
        title={t('title')}
        subtitle={t('subtitle')}
        placeholder={t('placeholder')}
        buttonText={t('generate')}
        onPromptSubmit={handlePromptSubmit}
        isLoading={isGenerating}
        suggestions={suggestions}
      />

      {/* My Forms Section - Show progressively when user is authenticated */}
      {showUserForms && (
        <MyFormsSection
          forms={forms}
          isLoading={isLoadingForms}
        />
      )}

      {/* SEO-optimized content section - Always visible for SEO */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-muted/20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            {locale === 'ar' 
              ? 'صانع نماذج احترافي | Vibeform Pro - استبيانات مجانية'
              : 'Professional Form Builder | Vibeform Pro - Free Surveys'}
          </h1>
          <p className="text-lg text-muted-foreground mb-6 text-center">
            {locale === 'ar'
              ? 'أنشئ نماذج واستبيانات احترافية بالذكاء الاصطناعي في ثوانٍ. بديل Google Forms مع ميزات متقدمة، مجتمع مجيبين، وتحليلات ذكية. ابدأ مجاناً الآن!'
              : 'Create professional forms and surveys with AI in seconds. Google Forms alternative with advanced features, respondent community, and smart analytics. Start free now!'}
          </p>
          
          {/* SEO Content - Rich keywords and internal links */}
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p>
              {locale === 'ar' ? (
                <>
                  <strong className="text-foreground">Vibeform Pro</strong> هو أفضل{' '}
                  <strong className="text-foreground">بديل Google Forms</strong> مع{' '}
                  <strong className="text-foreground">صانع نماذج</strong> مدعوم بالذكاء الاصطناعي.{' '}
                  أنشئ <strong className="text-foreground">استبيانات احترافية</strong> في دقائق مع{' '}
                  <strong className="text-foreground">منصة استبيانات</strong> متقدمة توفر{' '}
                  <strong className="text-foreground">أداة جمع البيانات</strong> الاحترافية.
                </>
              ) : (
                <>
                  <strong className="text-foreground">Vibeform Pro</strong> is the best{' '}
                  <strong className="text-foreground">Google Forms alternative</strong> with an{' '}
                  <strong className="text-foreground">AI-powered form builder</strong>. Create{' '}
                  <strong className="text-foreground">professional surveys</strong> in minutes with an{' '}
                  <strong className="text-foreground">advanced survey platform</strong> that provides{' '}
                  <strong className="text-foreground">professional data collection tools</strong>.
                </>
              )}
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <a 
                href={locale === 'ar' ? '/ar/features' : '/features'}
                className="text-primary hover:underline"
              >
                {locale === 'ar' ? 'الميزات' : 'Features'}
              </a>
              <a 
                href={locale === 'ar' ? '/ar/pricing' : '/pricing'}
                className="text-primary hover:underline"
              >
                {locale === 'ar' ? 'الأسعار' : 'Pricing'}
              </a>
              <a 
                href={locale === 'ar' ? '/ar/vs-google-forms' : '/vs-google-forms'}
                className="text-primary hover:underline"
              >
                {locale === 'ar' ? 'مقارنة مع Google Forms' : 'vs Google Forms'}
              </a>
              <a 
                href={locale === 'ar' ? '/ar/blog' : '/blog'}
                className="text-primary hover:underline"
              >
                {locale === 'ar' ? 'المدونة' : 'Blog'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section for non-logged in users - Show when hydrated and no user */}
      {showFeatures && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-semibold text-foreground mb-4">
                {t('whyVibeForm') || 'Why Vibe Form?'}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('whyVibeFormDescription') || 'Create professional surveys in seconds, get quality responses from our community, and gain AI-powered insights.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon="✨"
                title={t('featureAI') || 'AI-Powered Creation'}
                description={t('featureAIDescription') || 'Describe your form in plain language and watch AI transform it into a professional survey.'}
              />
              <FeatureCard
                icon="🎯"
                title={t('featureResponses') || 'Quality Responses'}
                description={t('featureResponsesDescription') || 'Access our community of respondents and earn credits by completing surveys.'}
              />
              <FeatureCard
                icon="📊"
                title={t('featureAnalytics') || 'Smart Analytics'}
                description={t('featureAnalyticsDescription') || 'Get AI-powered insights from your responses with themes, sentiment, and recommendations.'}
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <article className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg">
      <div className="text-4xl mb-4" role="img" aria-label={title}>{icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </article>
  );
}
