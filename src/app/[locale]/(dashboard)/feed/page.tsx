"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePublicForms } from '@/lib/hooks/use-forms';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/ui/mini-navbar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Zap,
  Clock,
  Gift,
  Target,
  TrendingUp,
  Sparkles,
  Search,
  ArrowRight,
  Filter
} from 'lucide-react';
import type { Form } from '@/types/database';
import { Progress } from '@/components/ui/progress';

interface FeedForm {
  id: string;
  title: string;
  description: string | null;
  status: Form['status'];
  visibility: Form['visibility'];
  created_at: string;
  settings: Form['settings'];
  owner_id: string;
  category: string | null;
  target_responses: number | null;
  response_count: number;
  owner_name?: string;
  reward?: number;
}

export default function FeedPage() {
  const t = useTranslations('feed');
  const { data: forms = [], isLoading: isFormsLoading } = usePublicForms();
  const [activeTab, setActiveTab] = useState('needs');
  const [searchQuery, setSearchQuery] = useState('');

  const getEstimatedTime = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) | 0;
    }
    return 2 + (Math.abs(hash) % 5);
  };

  const filterForms = (tab: string): FeedForm[] => {
    let feedForms = forms;

    if (searchQuery) {
      feedForms = feedForms.filter(f =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (tab) {
      case 'needs':
        return feedForms.filter(f => {
          if (f.target_responses) {
            return f.response_count < f.target_responses;
          }
          return f.response_count < 10;
        });
      case 'trending':
        return [...feedForms].sort((a, b) => b.response_count - a.response_count);
      case 'new':
        return [...feedForms].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'foryou':
        return feedForms;
      default:
        return feedForms;
    }
  };

  const filteredForms = filterForms(activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl"
      style={{
        paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
      }}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center p-2.5 sm:p-3 rounded-full bg-primary/10 mb-3 sm:mb-4">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-1.5 sm:mb-2 px-2">
            {t('earnTitle') || 'Explore & Earn'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            {t('earnDescription') || 'Complete surveys to earn huge rewards. Use your credits to boost your own reach.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder') || "Search for interesting surveys..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 sm:h-10 text-sm sm:text-base"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="flex justify-center overflow-x-auto pb-2 -mx-3 sm:mx-0 px-3 sm:px-0">
            <TabsList className="w-full sm:w-auto min-w-full sm:min-w-0">
              <TabsTrigger value="needs" className="flex-1 sm:flex-initial min-h-[44px] touch-manipulation text-xs sm:text-sm">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">{t('needsResponses')}</span>
                <span className="xs:hidden">Needs</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex-1 sm:flex-initial min-h-[44px] touch-manipulation text-xs sm:text-sm">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                {t('trending')}
              </TabsTrigger>
              <TabsTrigger value="new" className="flex-1 sm:flex-initial min-h-[44px] touch-manipulation text-xs sm:text-sm">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                {t('new')}
              </TabsTrigger>
              <TabsTrigger value="foryou" className="flex-1 sm:flex-initial min-h-[44px] touch-manipulation text-xs sm:text-sm">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">{t('forYou')}</span>
                <span className="xs:hidden">You</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            {isFormsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredForms.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 text-center">
                    {t('noForms') || 'No surveys found'}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center">
                    {t('checkLater') || 'Try adjusting your filters or check back later.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredForms.map((form) => (
                  <Card key={form.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2 flex-1">
                          {form.title}
                        </CardTitle>
                        {form.reward && form.reward > 0 && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 shrink-0">
                            <Gift className="w-3 h-3 mr-1" />
                            +{form.reward}
                          </Badge>
                        )}
                      </div>

                      {form.owner_name && (
                        <CardDescription className="mt-2">
                          {t('by') || 'by'} {form.owner_name}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4">
                      {form.description && (
                        <CardDescription className="line-clamp-2">
                          {form.description}
                        </CardDescription>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{t('estimatedTime', { minutes: getEstimatedTime(form.id) })}</span>
                        </div>
                        {form.category && (
                          <Badge variant="outline" className="text-xs">
                            <Filter className="w-3 h-3 mr-1" />
                            {form.category}
                          </Badge>
                        )}
                      </div>

                      {form.target_responses && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{t('responses')}</span>
                            <span className="text-foreground">
                              {form.response_count} / {form.target_responses}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(100, (form.response_count / form.target_responses) * 100)} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-3 sm:pt-4">
                      <Link href={`/f/${form.id}`} className="w-full">
                        <Button className="w-full min-h-[44px] touch-manipulation text-sm sm:text-base">
                          {t('answerAndEarn') || 'Answer & Earn'}
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
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
