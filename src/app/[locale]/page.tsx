"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { HeroWave } from '@/components/ui/ai-input-hero';
import { MyFormsSection } from '@/components/landing/my-forms-section';
import { useAuth } from '@/lib/hooks/use-auth';
import { useForms } from '@/lib/hooks/use-forms';
import { toast } from 'sonner';

export default function HomePage() {
  const t = useTranslations('hero');
  const router = useRouter();
  const { user, isHydrated } = useAuth();
  const [isGenerating] = useState(false);

  // Use React Query for fetching forms - much better caching and state management
  const { data: forms = [], isLoading: isLoadingForms } = useForms(6);

  const handlePromptSubmit = async (prompt: string) => {
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
  };

  // Handle pending prompt after login
  useEffect(() => {
    const checkPendingPrompt = async () => {
      if (!user) return;

      const pendingPrompt = sessionStorage.getItem('pendingPrompt');
      if (pendingPrompt) {
        sessionStorage.removeItem('pendingPrompt');
        // Auto-trigger form generation with the pending prompt
        handlePromptSubmit(pendingPrompt);
      }
    };

    // Small delay to ensure auth state is fully settled
    const timer = setTimeout(checkPendingPrompt, 500);
    return () => clearTimeout(timer);
  }, [user, router]);

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
    <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
