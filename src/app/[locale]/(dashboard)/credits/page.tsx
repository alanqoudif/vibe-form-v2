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
  Gift, 
  ArrowUp, 
  ArrowDown, 
  Rocket,
  Trophy,
  FileText,
  Clock
} from 'lucide-react';
import type { CreditsLedger } from '@/types/database';

interface LedgerEntry extends CreditsLedger {
  form_title?: string;
}

export default function CreditsPage() {
  const t = useTranslations('credits');
  const { user } = useAuth();
  const supabase = createClient();

  const { data: ledger = [], isLoading } = useQuery({
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
    enabled: !!user,
    staleTime: 30 * 1000,
  });

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-border mb-8">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">{t('balance')}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="w-8 h-8 text-yellow-500" />
                <span className="text-5xl font-display font-bold text-foreground">
                  {user?.credits_balance || 0}
                </span>
              </div>
              <div className="flex justify-center gap-8 text-sm">
                <div className="flex items-center gap-2 text-green-500 dark:text-green-400">
                  <ArrowUp className="w-4 h-4" />
                  <span>{totalEarned} {t('earned') || 'earned'}</span>
                </div>
                <div className="flex items-center gap-2 text-destructive">
                  <ArrowDown className="w-4 h-4" />
                  <span>{totalSpent} {t('spent') || 'spent'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-500 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-lg">{t('earn')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('earnDescription')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/feed">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  {t('startEarning') || 'Start Earning'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-lg">{t('boostForm')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('boostDescription')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/forms">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  {t('boostAForm') || 'Boost a Form'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground font-display">{t('history')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : ledger.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t('noTransactions') || 'No transactions yet'}</p>
                <p className="text-sm mt-1">{t('startEarningHint') || 'Start earning by completing surveys!'}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {ledger.map(entry => (
                  <div 
                    key={entry.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        entry.amount > 0 
                          ? 'bg-green-500/10' 
                          : 'bg-destructive/10'
                      }`}>
                        {entry.amount > 0 
                          ? <ArrowUp className="w-5 h-5 text-green-500 dark:text-green-400" />
                          : <ArrowDown className="w-5 h-5 text-destructive" />
                        }
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
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
