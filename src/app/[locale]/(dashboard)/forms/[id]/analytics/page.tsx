"use client";

import { useEffect, useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  ArrowLeft, 
  Eye, 
  Play, 
  Send, 
  Clock, 
  TrendingUp,
  Zap,
  Download,
  Share2,
  Edit3,
  ExternalLink,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Lightbulb,
  Quote,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import type { Form, FormQuestion, Response, Json } from '@/types/database';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'];

interface Analytics {
  views: number;
  starts: number;
  submits: number;
  completionRate: number;
  avgDuration: number;
}

interface AIInsights {
  summary: string;
  themes: Array<{ title: string; description: string; percentage: number }>;
  sentiment: { positive: number; neutral: number; negative: number; overview: string };
  keyQuotes: string[];
  recommendations: string[];
  outliers?: string;
}

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('dashboard');
  const supabase = createClient();
  
  const [form, setForm] = useState<Form | null>(null);
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [cachedInsights, setCachedInsights] = useState<{ insights: AIInsights; generatedAt: string; responseCount: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch form
      const { data: formData } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

      if (!formData) {
        toast.error('Form not found');
        return;
      }

      setForm(formData);

      // Check for cached insights
      if (formData.analytics_snapshot && typeof formData.analytics_snapshot === 'object') {
        const snapshot = formData.analytics_snapshot as { insights?: AIInsights; generatedAt?: string; responseCount?: number };
        if (snapshot.insights) {
          setCachedInsights({
            insights: snapshot.insights,
            generatedAt: snapshot.generatedAt || '',
            responseCount: snapshot.responseCount || 0,
          });
          setInsights(snapshot.insights);
        }
      }

      // Fetch questions
      const { data: questionsData } = await supabase
        .from('form_questions')
        .select('*')
        .eq('form_id', id)
        .order('order_index');

      setQuestions(questionsData || []);

      // Fetch responses with answers
      const { data: responsesData } = await supabase
        .from('responses')
        .select('*, response_answers(*)')
        .eq('form_id', id)
        .order('created_at', { ascending: false });

      setResponses(responsesData || []);

      // Fetch analytics from events
      const { data: events } = await supabase
        .from('form_events')
        .select('event_type')
        .eq('form_id', id);

      const eventCounts = {
        view: 0,
        start: 0,
        submit: 0,
      };

      events?.forEach(e => {
        if (e.event_type in eventCounts) {
          eventCounts[e.event_type as keyof typeof eventCounts]++;
        }
      });

      // Calculate avg duration
      const completedResponses = responsesData?.filter(r => r.submitted_at && r.duration_sec) || [];
      const avgDuration = completedResponses.length > 0
        ? completedResponses.reduce((sum, r) => sum + (r.duration_sec || 0), 0) / completedResponses.length
        : 0;

      setAnalytics({
        views: eventCounts.view,
        starts: eventCounts.start,
        submits: eventCounts.submit,
        completionRate: eventCounts.start > 0 ? (eventCounts.submit / eventCounts.start) * 100 : 0,
        avgDuration: Math.round(avgDuration),
      });

      setIsLoading(false);
    };

    fetchData();
  }, [id, supabase]);

  const generateInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate insights');
      }

      setInsights(data.insights);
      setCachedInsights({
        insights: data.insights,
        generatedAt: data.generatedAt,
        responseCount: data.responseCount,
      });
      toast.success('AI insights generated!');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate insights');
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/f/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  const handleExportCSV = () => {
    if (responses.length === 0) {
      toast.error('No responses to export');
      return;
    }

    const headers = ['Submitted At', 'Duration (s)', ...questions.map(q => q.title)];
    const rows = responses.map(r => {
      const answers = (r as Response & { response_answers: { question_id: string; answer: unknown }[] }).response_answers || [];
      return [
        r.submitted_at || 'Not submitted',
        r.duration_sec || '',
        ...questions.map(q => {
          const answer = answers.find(a => a.question_id === q.id);
          return answer ? JSON.stringify(answer.answer) : '';
        })
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form?.title || 'responses'}.csv`;
    a.click();
    toast.success('CSV exported!');
  };

  const getQuestionStats = (question: FormQuestion) => {
    const answers = responses
      .flatMap(r => (r as Response & { response_answers: { question_id: string; answer: unknown }[] }).response_answers || [])
      .filter(a => a.question_id === question.id)
      .map(a => a.answer);

    if (['mcq', 'checkbox', 'dropdown'].includes(question.type)) {
      const counts: Record<string, number> = {};
      answers.forEach(answer => {
        const values = Array.isArray(answer) ? answer : [answer];
        values.forEach(v => {
          const key = String(v);
          counts[key] = (counts[key] || 0) + 1;
        });
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (['likert', 'rating'].includes(question.type)) {
      const counts: Record<number, number> = {};
      answers.forEach(answer => {
        const num = Number(answer);
        if (!isNaN(num)) {
          counts[num] = (counts[num] || 0) + 1;
        }
      });
      return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => Number(a.name) - Number(b.name));
    }

    return [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/forms">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{form?.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={form?.status === 'published' 
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30'
                    }
                  >
                    {form?.status}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    {responses.length} responses
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Link href={`/forms/${id}/builder`}>
                <Button variant="outline">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <a href={`/f/${id}`} target="_blank">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Form
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('views')}</p>
                  <p className="text-3xl font-bold text-foreground">{analytics?.views || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('starts')}</p>
                  <p className="text-3xl font-bold text-foreground">{analytics?.starts || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Play className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('submits')}</p>
                  <p className="text-3xl font-bold text-foreground">{analytics?.submits || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Send className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('completionRate')}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {(analytics?.completionRate || 0).toFixed(0)}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="responses">{t('responses')}</TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('insights')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {questions.map((question, index) => {
              const stats = getQuestionStats(question);
              if (stats.length === 0) return null;

              const isBar = ['likert', 'rating'].includes(question.type);

              return (
                <Card key={question.id} className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">
                      Q{index + 1}: {question.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground capitalize">
                      {question.type.replace('_', ' ')} • {stats.reduce((sum, s) => sum + s.value, 0)} responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        {isBar ? (
                          <BarChart data={stats}>
                            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground" />
                            <YAxis stroke="currentColor" className="text-muted-foreground" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        ) : (
                          <PieChart>
                            <Pie
                              data={stats}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, percent }) => 
                                `${name} (${(percent * 100).toFixed(0)}%)`
                              }
                            >
                              {stats.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {responses.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">{t('noResponses')}</p>
                  <p className="text-muted-foreground/70 text-sm mt-1">{t('shareForm')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="responses">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">{t('responses')}</CardTitle>
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  {t('exportCsv')}
                </Button>
              </CardHeader>
              <CardContent>
                {responses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">{t('noResponses')}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">#</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Submitted</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Duration</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Quality</th>
                        </tr>
                      </thead>
                      <tbody>
                        {responses.map((response, index) => (
                          <tr key={response.id} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4 text-foreground">{index + 1}</td>
                            <td className="py-3 px-4 text-foreground">
                              {response.submitted_at 
                                ? new Date(response.submitted_at).toLocaleString()
                                : 'Not submitted'}
                            </td>
                            <td className="py-3 px-4 text-foreground">
                              {response.duration_sec 
                                ? `${Math.floor(response.duration_sec / 60)}m ${response.duration_sec % 60}s`
                                : '-'}
                            </td>
                            <td className="py-3 px-4">
                              <Badge 
                                variant="outline"
                                className={
                                  (response.quality_score || 0) >= 0.7
                                    ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30'
                                    : (response.quality_score || 0) >= 0.3
                                    ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30'
                                    : 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
                                }
                              >
                                {((response.quality_score || 0) * 100).toFixed(0)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            {responses.length < 3 ? (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium">Need at least 3 responses for AI insights</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Current: {responses.length} responses
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Generate Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      AI Insights
                    </h3>
                    {cachedInsights && (
                      <p className="text-muted-foreground text-sm">
                        Generated {new Date(cachedInsights.generatedAt).toLocaleString()} • {cachedInsights.responseCount} responses analyzed
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={generateInsights} 
                    disabled={isLoadingInsights}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    {isLoadingInsights ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {insights ? 'Regenerate' : 'Generate'} Insights
                      </>
                    )}
                  </Button>
                </div>

                {insights ? (
                  <>
                    {/* Summary */}
                    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                      <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-purple-500" />
                          Executive Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground leading-relaxed">{insights.summary}</p>
                      </CardContent>
                    </Card>

                    {/* Sentiment Analysis */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-foreground">Sentiment Analysis</CardTitle>
                        <CardDescription>{insights.sentiment.overview}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4">
                          <div className="flex-1 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <ThumbsUp className="w-5 h-5 text-green-500" />
                              <span className="text-sm text-muted-foreground">Positive</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {insights.sentiment.positive}%
                            </p>
                          </div>
                          <div className="flex-1 p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Minus className="w-5 h-5 text-gray-500" />
                              <span className="text-sm text-muted-foreground">Neutral</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                              {insights.sentiment.neutral}%
                            </p>
                          </div>
                          <div className="flex-1 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <ThumbsDown className="w-5 h-5 text-red-500" />
                              <span className="text-sm text-muted-foreground">Negative</span>
                            </div>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                              {insights.sentiment.negative}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Themes */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-500" />
                          Key Themes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {insights.themes.map((theme, i) => (
                            <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-foreground">{theme.title}</h4>
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
                                  {theme.percentage}%
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-sm">{theme.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-500" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {insights.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm font-medium flex items-center justify-center">
                                {i + 1}
                              </span>
                              <span className="text-foreground">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Key Quotes */}
                    {insights.keyQuotes && insights.keyQuotes.length > 0 && (
                      <Card className="bg-card border-border">
                        <CardHeader>
                          <CardTitle className="text-foreground flex items-center gap-2">
                            <Quote className="w-5 h-5 text-pink-500" />
                            Notable Quotes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {insights.keyQuotes.map((quote, i) => (
                              <blockquote key={i} className="border-l-4 border-pink-500/50 pl-4 py-2 italic text-muted-foreground">
                                "{quote}"
                              </blockquote>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Outliers */}
                    {insights.outliers && (
                      <Card className="bg-card border-border">
                        <CardHeader>
                          <CardTitle className="text-foreground flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            Notable Observations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{insights.outliers}</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card className="bg-card border-border">
                    <CardContent className="py-12 text-center">
                      <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                      <p className="text-foreground font-medium mb-2">Ready to analyze your responses</p>
                      <p className="text-muted-foreground text-sm mb-6">
                        Click the button above to generate AI-powered insights from your {responses.length} responses
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
