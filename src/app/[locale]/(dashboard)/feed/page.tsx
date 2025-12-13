"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
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
} from 'lucide-react';
import type { Form } from '@/types/database';

interface FeedForm extends Form {
  response_count: number;
  owner_name?: string;
  reward?: number;
}

export default function FeedPage() {
  const t = useTranslations('feed');
  const { user, isHydrated } = useAuth();
  // Only pass user id after hydration to exclude their forms
  const { data: forms = [], isLoading: isFormsLoading } = usePublicForms(isHydrated ? user?.id : undefined);
  const [activeTab, setActiveTab] = useState('needs');
  
  // Wait for hydration before showing content
  const isLoading = !isHydrated || isFormsLoading;

  const getEstimatedTime = () => {
    // Rough estimate: 1-2 minutes per question
    return Math.max(2, Math.floor(Math.random() * 5) + 2);
  };

  const filterForms = (tab: string): FeedForm[] => {
    const feedForms = forms as FeedForm[];
    switch (tab) {
      case 'needs':
        return feedForms.filter(f => f.target_responses && f.response_count < f.target_responses);
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
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            {t('earnTitle') || 'Answer & Earn'} 💰
          </h1>
          <p className="text-muted-foreground">
            {t('earnDescription') || 'Complete surveys to earn credits. Use credits to boost your own forms.'}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted w-full justify-start overflow-x-auto">
            <TabsTrigger value="needs" className="data-[state=active]:bg-background">
              <Target className="w-4 h-4 mr-2" />
              {t('needsResponses')}
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-background">
              <TrendingUp className="w-4 h-4 mr-2" />
              {t('trending')}
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-background">
              <Sparkles className="w-4 h-4 mr-2" />
              {t('new')}
            </TabsTrigger>
            <TabsTrigger value="foryou" className="data-[state=active]:bg-background">
              <Zap className="w-4 h-4 mr-2" />
              {t('forYou')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="bg-card border-border">
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
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted border border-border flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
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
                    className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-lg group animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-foreground text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {form.title}
                        </CardTitle>
                      </div>
                      {form.owner_name && (
                        <p className="text-muted-foreground text-sm">{t('by') || 'by'} {form.owner_name}</p>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pb-3">
                      {form.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {form.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-green-500 dark:text-green-400">
                          <Gift className="w-4 h-4" />
                          <span className="font-medium">{t('reward', { amount: form.reward ?? 0 })}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{t('estimatedTime', { minutes: getEstimatedTime() })}</span>
                        </div>
                      </div>

                      {form.target_responses && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{t('answersNeeded', { count: form.target_responses - form.response_count })}</span>
                            <span>{form.response_count}/{form.target_responses}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                              style={{ width: `${(form.response_count / form.target_responses) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="pt-3 border-t border-border">
                      <Link href={`/f/${form.id}`} className="w-full">
                        <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-primary-foreground">
                          {t('answerAndEarn') || 'Answer & Earn'}
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
