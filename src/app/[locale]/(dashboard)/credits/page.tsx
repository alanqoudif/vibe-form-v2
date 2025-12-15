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
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Skeleton className="h-48 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header & Balance */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10">
                <Wallet className="w-6 h-6 text-primary" />
              </div>

              <div className="space-y-2">
                <h1 className="text-5xl font-bold tracking-tight">
                  {availableCredits.toLocaleString()}
                </h1>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">
                  {t('creditsLabel') || 'Available Credits'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <Link href="/feed">
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('earn') || 'Earn Credits'}
                  </Button>
                </Link>
                <Link href="/forms">
                  <Button variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {t('boost') || 'Boost Form'}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('recentActivity') || 'Recent Activity'}</h2>
            <Badge variant="outline">
              {t('last30Days') || 'Last 30 Days'}
            </Badge>
          </div>

          {ledger.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground mb-4">{t('noTransactions') || 'No transactions yet.'}</p>
                <Link href="/feed">
                  <Button variant="outline">
                    {t('startEarning') || 'Start earning now'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {ledger.map((entry) => (
                <Card key={entry.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          entry.amount > 0 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        )}>
                          {entry.amount > 0 ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {getReasonLabel(entry.reason)}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDate(entry.created_at)}</span>
                            {entry.form_title && (
                              <>
                                <span className="text-border">•</span>
                                <span className="truncate max-w-[200px]">{entry.form_title}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={cn(
                        "text-lg font-semibold tabular-nums",
                        entry.amount > 0 
                          ? "text-emerald-600 dark:text-emerald-400" 
                          : "text-foreground"
                      )}>
                        {entry.amount > 0 ? '+' : ''}{entry.amount}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
