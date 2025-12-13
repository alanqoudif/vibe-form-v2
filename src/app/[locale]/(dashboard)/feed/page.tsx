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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
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

interface FeedForm extends Form {
  response_count: number;
  owner_name?: string;
  reward?: number;
}

export default function FeedPage() {
  const t = useTranslations('feed');
  const { data: forms = [], isLoading: isFormsLoading } = usePublicForms();
  const [activeTab, setActiveTab] = useState('needs');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getEstimatedTime = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) | 0;
    }
    return 2 + (Math.abs(hash) % 5);
  };

  const filterForms = (tab: string): FeedForm[] => {
    let feedForms = forms as FeedForm[];

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
        return feedForms; // Placeholder for personalization algorithm
      default:
        return feedForms;
    }
  };

  const filteredForms = filterForms(activeTab);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background/50 selection:bg-primary/20">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Helper Header Section */}
        <div className="relative mb-12 py-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 mb-4 border border-primary/10 shadow-lg shadow-primary/5"
          >
            <Gift className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold vibe-gradient-text tracking-tight"
          >
            {t('earnTitle') || 'Explore & Earn'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {t('earnDescription') || 'Complete surveys to earn huge rewards. Use your credits to boost your own reach.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto relative mt-8 group"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={t('searchPlaceholder') || "Search for interesting surveys..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-2xl bg-background/80 backdrop-blur-xl border-border/50 shadow-sm focus:shadow-xl focus:border-primary/50 text-lg transition-all"
            />
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-muted/30 p-1.5 rounded-2xl border border-border/50 backdrop-blur-md">
              <TabsTrigger value="needs" className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <Target className="w-4 h-4 mr-2" />
                {t('needsResponses')}
              </TabsTrigger>
              <TabsTrigger value="trending" className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('trending')}
              </TabsTrigger>
              <TabsTrigger value="new" className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <Sparkles className="w-4 h-4 mr-2" />
                {t('new')}
              </TabsTrigger>
              <TabsTrigger value="foryou" className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <Zap className="w-4 h-4 mr-2" />
                {t('forYou')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            {isFormsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="glass border-border/50 h-64">
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-2/3" /></CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredForms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border/50 backdrop-blur-sm"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-primary/5 flex items-center justify-center animate-pulse-glow">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
                  {t('noForms') || 'No surveys found'}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {t('checkLater') || 'Try adjusting your filters or check back later.'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredForms.map((form) => (
                    <motion.div key={form.id} variants={item} layout>
                      <Card
                        className="glass h-full border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 group relative overflow-hidden flex flex-col"
                        onMouseEnter={() => setHoveredCard(form.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <CardHeader className="pb-3 relative z-10">
                          <div className="flex items-start justify-between gap-3">
                            <CardTitle className="text-foreground text-xl font-display line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                              {form.title}
                            </CardTitle>
                            {form.reward && form.reward > 0 && (
                              <Badge variant="secondary" className="shrink-0 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 px-2.5 py-1">
                                <Gift className="w-3 h-3 mr-1.5" />
                                +{form.reward}
                              </Badge>
                            )}
                          </div>

                          {form.owner_name && (
                            <div className="flex items-center gap-2 text-muted-foreground text-xs mt-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                {form.owner_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium">{t('by') || 'by'} {form.owner_name}</span>
                            </div>
                          )}
                        </CardHeader>

                        <CardContent className="pb-4 flex-1 relative z-10">
                          {form.description && (
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-5 leading-relaxed">
                              {form.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground mt-auto">
                            <div className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1.5 rounded-lg border border-border/50">
                              <Clock className="w-3.5 h-3.5 text-primary/70" />
                              <span>{t('estimatedTime', { minutes: getEstimatedTime(form.id) })}</span>
                            </div>
                            {form.category && (
                              <div className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1.5 rounded-lg border border-border/50 uppercase tracking-wider text-[10px]">
                                <Filter className="w-3 h-3 text-purple-500/70" />
                                <span>{form.category}</span>
                              </div>
                            )}
                          </div>

                          {form.target_responses && (
                            <div className="mt-5 space-y-2">
                              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                <span>{t('responses')}</span>
                                <span className="text-foreground">{form.response_count} <span className="text-muted-foreground">/ {form.target_responses}</span></span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
                                  style={{ width: `${Math.min(100, (form.response_count / form.target_responses) * 100)}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>

                        <CardFooter className="pt-0 p-4 bg-muted/30 border-t border-border/50 relative z-10">
                          <Link href={`/f/${form.id}`} className="w-full">
                            <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:brightness-110 text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all">
                              {t('answerAndEarn') || 'Answer & Earn'}
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
