"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/ui/mini-navbar';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Wallet,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import type { CreditsLedger } from '@/types/database';
import { cn } from '@/lib/utils';

interface LedgerEntry extends CreditsLedger {
  form_title?: string;
}

export default function CreditsPage() {
  const t = useTranslations('credits');
  const { user, isHydrated, isLoading: isAuthLoading } = useAuth();
  const supabase = createClient();

  const { data: ledger = [], isLoading: isLedgerLoading } = useQuery({
    queryKey: ['credits-ledger', user?.id],
    queryFn: async (): Promise<LedgerEntry[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('credits_ledger')
        .select(`
          *,
          forms:related_form_id(title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data || []).map(entry => ({
        ...entry,
        form_title: (entry.forms as { title?: string })?.title,
        forms: undefined,
      })) as LedgerEntry[];
    },
    enabled: !!user && isHydrated,
  });

  const isLoading = !isHydrated || isAuthLoading || isLedgerLoading;
  const availableCredits = user?.credits_balance || 0;

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      'complete_form': t('completedSurvey') || 'Completed Survey',
      'promote_form': t('boostedForm') || 'Boosted Form',
      'request_respondents': t('requestedResponses') || 'Requested Responses',
      'welcome_bonus': t('welcomeBonus') || 'Welcome Bonus',
    };
    return labels[reason] || reason;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        {/* Simplified Header & Balance */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4 ring-1 ring-primary/20 shadow-lg shadow-primary/5"
          >
            <Wallet className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tighter text-foreground">
              {availableCredits.toLocaleString()}
            </h1>
            <p className="text-lg text-muted-foreground font-medium uppercase tracking-widest">
              {t('creditsLabel') || 'Available Credits'}
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <Link href="/feed">
              <Button size="lg" className="rounded-full h-12 px-8 bg-foreground text-background hover:bg-foreground/90 font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                {t('earn') || 'Earn Credits'}
              </Button>
            </Link>
            <Link href="/forms">
              <Button size="lg" variant="outline" className="rounded-full h-12 px-8 bg-background hover:bg-muted font-medium">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('boost') || 'Boost Form'}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Simplified Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold">{t('recentActivity') || 'Recent Activity'}</h2>
            <Badge variant="outline" className="rounded-full px-3 font-normal text-muted-foreground">
              {t('last30Days') || 'Last 30 Days'}
            </Badge>
          </div>

          <div className="space-y-3">
            {ledger.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-3xl bg-muted/20">
                <p className="text-muted-foreground">{t('noTransactions') || 'No transactions yet.'}</p>
                <Link href="/feed" className="text-primary hover:underline mt-2 inline-block text-sm">
                  {t('startEarning') || 'Start earning now'}
                </Link>
              </div>
            ) : (
              ledger.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex items-center justify-between p-4 bg-card hover:bg-muted/50 border border-border/40 hover:border-primary/20 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      entry.amount > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                    )}>
                      {entry.amount > 0 ? (
                        <ArrowDownLeft className="w-6 h-6" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-base text-foreground group-hover:text-primary transition-colors">
                        {getReasonLabel(entry.reason)}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(entry.created_at)}</span>
                        {entry.form_title && (
                          <>
                            <span className="text-border">•</span>
                            <span>{entry.form_title}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "text-lg font-display font-bold tabular-nums",
                    entry.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                  )}>
                    {entry.amount > 0 ? '+' : ''}{entry.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
