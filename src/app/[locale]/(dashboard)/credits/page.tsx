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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/ui/mini-navbar';
import {
  Gift,
  ArrowUp,
  ArrowDown,
  Rocket,
  Trophy,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import type { CreditsLedger } from '@/types/database';

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

      if (error) {
        console.error('Error fetching ledger:', error);
        throw error;
      }

      return (data || []).map(entry => ({
        ...entry,
        form_title: (entry.forms as { title?: string })?.title,
        forms: undefined,
      })) as LedgerEntry[];
    },
    enabled: !!user && isHydrated,
    staleTime: 30 * 1000,
  });

  // Wait for hydration before showing content
  const isLoading = !isHydrated || isAuthLoading || isLedgerLoading;

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
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalEarned = ledger.filter(e => e.amount > 0).reduce((sum, e) => sum + e.amount, 0);
  const totalSpent = Math.abs(ledger.filter(e => e.amount < 0).reduce((sum, e) => sum + e.amount, 0));
  const availableCredits = user?.credits_balance || 0;
  const recentEntry = ledger[0];
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const monthlyEarned = ledger
    .filter(e => e.amount > 0 && new Date(e.created_at) >= monthAgo)
    .reduce((sum, e) => sum + e.amount, 0);
  const responsesCompleted = ledger.filter(e => e.reason === 'complete_form').length;
  const formsBoosted = ledger.filter(e => e.reason === 'promote_form').length;
  const earningsOnly = ledger.filter(e => e.amount > 0);
  const spendingOnly = ledger.filter(e => e.amount < 0);

  const renderLedgerEntries = (entries: LedgerEntry[], emptyMessage: string) => {
    if (entries.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{emptyMessage}</p>
          <p className="text-sm mt-1">{t('startEarningHint') || 'Start earning by completing surveys!'}</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {entries.map(entry => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  entry.amount > 0 ? 'bg-green-500/10' : 'bg-destructive/10'
                }`}
              >
                {entry.amount > 0 ? (
                  <ArrowUp className="w-5 h-5 text-green-500 dark:text-green-400" />
                ) : (
                  <ArrowDown className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-foreground font-medium">
                  {getReasonLabel(entry.reason)}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {entry.form_title && (
                    <>
                      <FileText className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{entry.form_title}</span>
                      <span>•</span>
                    </>
                  )}
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(entry.created_at)}</span>
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className={entry.amount > 0
                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 font-semibold'
                : 'bg-destructive/10 text-destructive border-destructive/20 font-semibold'
              }
            >
              {entry.amount > 0 ? '+' : ''}{entry.amount}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-40 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Balance + Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 via-background to-purple-500/10 border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-wider">
                  {t('availableNow') || 'Available now'}
                </Badge>
                <Link href="/feed">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    {t('startEarning') || 'Start Earning'}
                  </Button>
                </Link>
              </div>
              <CardTitle className="text-5xl font-display">
                {availableCredits}
                <span className="text-base font-normal text-muted-foreground ml-2">
                  {t('creditsLabel') || 'credits'}
                </span>
              </CardTitle>
              <CardDescription>
                {t('balanceDescription') || 'Credits ready to spend on boosts or rewards.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-background/70 border border-border/40 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t('lifetimeEarnedLabel') || 'Lifetime earned'}
                  </p>
                  <p className="text-2xl font-semibold text-green-500">+{totalEarned}</p>
                </div>
                <div className="rounded-2xl bg-background/70 border border-border/40 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t('lifetimeSpentLabel') || 'Spent so far'}
                  </p>
                  <p className="text-2xl font-semibold text-destructive">-{totalSpent}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-background/60 border border-border/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {t('monthlyEarnedLabel') || 'Earned this month'}
                    </p>
                    <Badge variant="secondary" className="rounded-full">
                      {t('last30Days') || 'Last 30 days'}
                    </Badge>
                  </div>
                  <p className="text-xl font-semibold mt-2">+{monthlyEarned}</p>
                </div>
                <div className="rounded-2xl bg-background/60 border border-border/30 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t('responsesCompletedLabel') || 'Surveys answered'}
                  </p>
                  <p className="text-xl font-semibold mt-2">{responsesCompleted}</p>
                </div>
                <div className="rounded-2xl bg-background/60 border border-border/30 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t('formsBoostedLabel') || 'Forms boosted'}
                  </p>
                  <p className="text-xl font-semibold mt-2">{formsBoosted}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-background/50 border border-border/40 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t('recentActivity') || 'Latest activity'}
                  </p>
                  {recentEntry ? (
                    <>
                      <p className="text-lg font-semibold text-foreground">
                        {getReasonLabel(recentEntry.reason)}
                      </p>
                      <p className="text-sm text-muted-foreground">{formatDate(recentEntry.created_at)}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t('recentActivityNone') || 'No transactions yet'}
                    </p>
                  )}
                </div>
                {recentEntry && (
                  <Badge
                    variant="outline"
                    className={recentEntry.amount > 0
                      ? 'bg-green-500/10 text-green-600 border-green-500/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                    }
                  >
                    {recentEntry.amount > 0 ? '+' : ''}{recentEntry.amount}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-display">
                {t('quickActionsTitle') || 'Take action'}
              </CardTitle>
              <CardDescription>
                {t('quickActionsDescription') || 'Turn credits into reach or earn more in minutes.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/feed">
                <Button className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <Trophy className="w-4 h-4 mr-2" />
                  {t('startEarning') || 'Start Earning'}
                </Button>
              </Link>
              <Link href="/forms">
                <Button variant="outline" className="w-full rounded-xl">
                  <Rocket className="w-4 h-4 mr-2" />
                  {t('boostAForm') || 'Boost a Form'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* How to earn/spend */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{t('howToEarn') || 'Grow & spend smarter'}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-500" />
                </div>
                <CardTitle>{t('earnCardTitle') || 'Complete surveys'}</CardTitle>
                <CardDescription>
                  {t('earnCardDescription') || 'Pick research that matches your interests and answer honestly.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{t('earnCardBulletOne') || 'Instant credits for every completion'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{t('earnCardBulletTwo') || 'Bonus rewards on targeted surveys'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-purple-500" />
                </div>
                <CardTitle>{t('spendCardTitle') || 'Boost your form'}</CardTitle>
                <CardDescription>
                  {t('spendCardDescription') || 'Highlight your survey in Discover and request faster responses.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <span>{t('spendCardBulletOne') || 'Set a target audience and budget'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <span>{t('spendCardBulletTwo') || 'Unlock insights sooner'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <CardTitle>{t('tipsCardTitle') || 'Pro tips'}</CardTitle>
                <CardDescription>
                  {t('tipsCardDescription') || 'Earn trust with thoughtful answers and reinvest in your top forms.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>{t('tipsCardBulletOne') || 'Keep answers high-quality'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>{t('tipsCardBulletTwo') || 'Reinvest credits for important launches'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Transaction History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground font-display">{t('history')}</CardTitle>
            <CardDescription>
              {t('historyDescription') || 'Track every credit earned or spent'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="bg-muted/40 rounded-full p-1">
                <TabsTrigger value="all" className="rounded-full px-4">
                  {t('historyFilterAll') || 'All'}
                </TabsTrigger>
                <TabsTrigger value="earnings" className="rounded-full px-4">
                  {t('historyFilterEarn') || 'Earnings'}
                </TabsTrigger>
                <TabsTrigger value="spend" className="rounded-full px-4">
                  {t('historyFilterSpend') || 'Spending'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {renderLedgerEntries(ledger, t('noTransactions') || 'No transactions yet')}
              </TabsContent>
              <TabsContent value="earnings">
                {renderLedgerEntries(earningsOnly, t('historyEmptyEarn') || 'No earning activity yet')}
              </TabsContent>
              <TabsContent value="spend">
                {renderLedgerEntries(spendingOnly, t('historyEmptySpend') || 'No spending activity yet')}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
