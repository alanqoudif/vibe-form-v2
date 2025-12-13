"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePublicForms } from '@/lib/hooks/use-forms';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/ui/mini-navbar';
import {
  Zap,
  Clock,
  Gift,
  Target,
  TrendingUp,
  Sparkles,
  Search,
  ArrowRight
} from 'lucide-react';
import type { Form } from '@/types/database';
import { Input } from '@/components/ui/input';

interface FeedForm extends Form {
  response_count: number;
  owner_name?: string;
  reward?: number;
}

export default function FeedPage() {
  const t = useTranslations('feed');
  // Marketplace should include your own public forms too (so you can verify they are listed).
  const { data: forms = [], isLoading: isFormsLoading } = usePublicForms();
  const [activeTab, setActiveTab] = useState('needs');
  const [searchQuery, setSearchQuery] = useState('');

  const isLoading = isFormsLoading;

  const getEstimatedTime = (seed: string) => {
    // Deterministic estimate (eslint/react-hooks purity rule forbids Math.random() in render)
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) | 0;
    }
    return 2 + (Math.abs(hash) % 5); // 2..6 minutes
  };

  const filterForms = (tab: string): FeedForm[] => {
    let feedForms = forms as FeedForm[];

    // Apply search filter
    if (searchQuery) {
      feedForms = feedForms.filter(f =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (tab) {
      case 'needs':
        // Show forms that need responses (have target_responses and haven't reached it yet)
        // Also show forms without target_responses but with low response count
        return feedForms.filter(f => {
          if (f.target_responses) {
            return f.response_count < f.target_responses;
          }
          // Show forms without target_responses that have less than 10 responses
          return f.response_count < 10;
        });
      case 'trending':
        return [...feedForms].sort((a, b) => b.response_count - a.response_count);
      case 'new':
        return [...feedForms].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'foryou':
        // Would use matching algorithm here
        return feedForms;
      default:
        return feedForms;
    }
  };

  const filteredForms = filterForms(activeTab);

  return (
    <div className="min-h-screen bg-background/50">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background" />

      {/* Navbar */}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-2 animate-bounce-slow">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold vibe-gradient-text tracking-tight">
            {t('earnTitle') || 'Answer & Earn'}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('earnDescription') || 'Complete surveys to earn credits. Use credits to boost your own forms and reach more people.'}
          </p>

          <div className="max-w-md mx-auto relative mt-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder') || "Search for interesting surveys..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-background/80 backdrop-blur-sm border-border/50 shadow-sm focus:shadow-md transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-muted/50 p-1 rounded-xl w-full sm:w-auto h-auto grid grid-cols-2 sm:flex overflow-x-auto gap-2">
            <TabsTrigger value="needs" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-2.5 px-4">
              <Target className="w-4 h-4 mr-2" />
              {t('needsResponses')}
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-2.5 px-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              {t('trending')}
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-2.5 px-4">
              <Sparkles className="w-4 h-4 mr-2" />
              {t('new')}
            </TabsTrigger>
            <TabsTrigger value="foryou" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-2.5 px-4">
              <Zap className="w-4 h-4 mr-2" />
              {t('forYou')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="glass border-border/50">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredForms.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border/50">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  {t('noForms') || 'No forms available'}
                </h3>
                <p className="text-muted-foreground">
                  {t('checkLater') || 'Check back later for new surveys'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredForms.map((form, index) => (
                  <Card
                    key={form.id}
                    className="glass border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group animate-fade-in flex flex-col h-full"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader className="pb-3 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-foreground text-lg font-display line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                          {form.title}
                        </CardTitle>
                        {form.reward && form.reward > 0 && (
                          <div className="shrink-0 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-1 border border-green-500/20">
                            <Gift className="w-3 h-3" />
                            +{form.reward}
                          </div>
                        )}
                      </div>
                      {form.owner_name && (
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {form.owner_name.charAt(0).toUpperCase()}
                          </div>
                          <span>{t('by') || 'by'} {form.owner_name}</span>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="pb-3 flex-1">
                      {form.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
                          {form.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-auto">
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t('estimatedTime', { minutes: getEstimatedTime(form.id) })}</span>
                        </div>
                        {form.category && (
                          <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md uppercase tracking-wider">
                            <span>{form.category}</span>
                          </div>
                        )}
                      </div>

                      {form.target_responses && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{t('responses')}</span>
                            <span className="font-medium text-foreground">{form.response_count}/{form.target_responses}</span>
                          </div>
                          <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${Math.min(100, (form.response_count / form.target_responses) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-3 border-t border-border/50 p-4 bg-muted/20">
                      <Link href={`/f/${form.id}`} className="w-full">
                        <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all">
                          {t('answerAndEarn') || 'Answer & Earn'}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
