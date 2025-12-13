"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useForms, useDeleteForm } from '@/lib/hooks/use-forms';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Plus,
  FileText,
  BarChart3,
  Edit3,
  Clock,
  Users,
  Search,
  MoreVertical,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  TrendingUp,
  LayoutGrid,
  List,
  Rocket
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Navbar } from '@/components/ui/mini-navbar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function FormsPage() {
  const t = useTranslations('myForms');
  const { user, isLoading: isAuthLoading, isHydrated } = useAuth();
  const { data: forms = [], isLoading: isFormsLoading } = useForms();
  const deleteFormMutation = useDeleteForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isLoading = !isHydrated || isAuthLoading || isFormsLoading;

  const handleDelete = async (formId: string) => {
    if (!confirm(t('confirmDelete') || 'Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteFormMutation.mutateAsync(formId);
      toast.success(t('formDeleted') || 'Form deleted');
    } catch {
      toast.error(t('deleteError') || 'Failed to delete form');
    }
  };

  const handleCopyLink = (formId: string) => {
    const url = `${window.location.origin}/f/${formId}`;
    navigator.clipboard.writeText(url);
    toast.success(t('linkCopied') || 'Link copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'draft':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'archived':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalResponses = forms.reduce((sum, f) => sum + (f.response_count || 0), 0);
  const publishedForms = forms.filter(f => f.status === 'published').length;

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

  const handleBoost = (formId: string) => {
    const BOOST_COST = 50;
    const currentBalance = user?.credits_balance || 0;

    if (currentBalance < BOOST_COST) {
      toast.error(t('insufficientCredits') || `Insufficient credits. You need ${BOOST_COST} credits.`);
      return;
    }

    // In a real app, this would open a dialog or call a mutation
    toast.success(t('boostSuccess') || 'Form boosted successfully! (Simulated)');
  };

  return (
    <div className="min-h-screen bg-background/50 selection:bg-primary/20">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <Navbar />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-display font-bold vibe-gradient-text tracking-tight"
              >
                {t('title') || 'Dashboard'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-lg max-w-lg"
              >
                {t('manageDescription') || 'Create, manage, and analyze your smart forms.'}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/">
                <Button className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:brightness-110 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 text-white font-medium text-base group">
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  {t('createNew') || 'Create New Form'}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            {[
              { label: t('totalForms') || 'Total Forms', value: forms.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: t('totalResponses') || 'Total Responses', value: totalResponses, icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
              { label: t('published') || 'Published', value: publishedForms, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' }
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-5 border border-border/50 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-display font-bold text-foreground group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
                </div>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sticky top-20 z-20 backdrop-blur-xl py-2 rounded-xl -mx-2 px-2">
            <div className="relative w-full sm:max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={t('searchForms') || 'Search forms...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all rounded-xl shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-lg border border-border/30 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-9 px-3 rounded-md transition-all",
                  viewMode === 'grid' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-background/50"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-9 px-3 rounded-md transition-all",
                  viewMode === 'list' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-background/50"
                )}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="glass border-border/50 h-[300px]">
                  <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                  <CardContent><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-2/3" /></CardContent>
                </Card>
              ))}
            </div>
          ) : filteredForms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-muted/10 rounded-3xl border border-dashed border-border/50"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-primary/5 flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
                {searchQuery ? (t('noFormsFound') || 'No forms found') : (t('empty') || 'Start your journey')}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg leading-relaxed">
                {searchQuery ? (t('tryDifferentSearch') || 'Try a different search term') : (t('emptyDescription') || 'Create your first AI-powered form in seconds.')}
              </p>
              {!searchQuery && (
                <Link href="/">
                  <Button size="lg" className="rounded-xl px-8 bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t('createWithAI') || 'Create with AI'}
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}
            >
              <AnimatePresence>
                {filteredForms.map((form) => (
                  <motion.div key={form.id} variants={item} layout>
                    <Card
                      className={cn(
                        "glass border-border/50 group overflow-hidden",
                        "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300",
                        viewMode === 'list' ? "flex flex-row items-center p-1" : "flex flex-col h-full"
                      )}
                    >
                      <div className={cn("flex-1", viewMode === 'list' && "p-4 flex items-center justify-between gap-6")}>
                        <div className={cn(viewMode === 'list' ? "flex-1 min-w-0" : "flex flex-col h-full")}>
                          <CardHeader className={cn("pb-2", viewMode === 'list' && "p-0")}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0 space-y-1">
                                <Link href={`/forms/${form.id}/builder`} className="block group/title">
                                  <CardTitle className="text-foreground text-lg font-display line-clamp-1 group-hover/title:text-primary transition-colors cursor-pointer">
                                    {form.title}
                                  </CardTitle>
                                </Link>
                                {viewMode === 'list' && form.description && (
                                  <p className="text-muted-foreground text-sm line-clamp-1">{form.description}</p>
                                )}
                              </div>

                              {viewMode === 'grid' && (
                                <div className="flex items-center gap-2 shrink-0">
                                  <Badge
                                    variant="outline"
                                    className={cn("rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border", getStatusColor(form.status))}
                                  >
                                    {t(form.status)}
                                  </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                      <DropdownMenuLabel>{t('actions') || 'Actions'}</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleBoost(form.id)}>
                                        <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                                        {t('boost') || 'Boost'}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <Link href={`/forms/${form.id}/builder`}>
                                          <Edit3 className="w-4 h-4 mr-2" />
                                          {t('edit') || 'Edit'}
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleCopyLink(form.id)}>
                                        <Copy className="w-4 h-4 mr-2" />
                                        {t('copyLink')}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <a href={`/f/${form.id}`} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="w-4 h-4 mr-2" />
                                          {t('openForm')}
                                        </a>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleDelete(form.id)} className="text-destructive focus:text-destructive">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        {t('delete')}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </div>
                          </CardHeader>

                          {viewMode === 'grid' && (
                            <CardContent className="pb-3 flex-1">
                              {form.description && (
                                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
                                  {form.description}
                                </p>
                              )}
                              {!form.description && <div className="h-14" />}

                              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-auto">
                                <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1.5 rounded-lg border border-border/30">
                                  <Users className="w-3.5 h-3.5" />
                                  <span>{form.response_count || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1.5 rounded-lg border border-border/30">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{formatDate(form.created_at)}</span>
                                </div>
                              </div>
                            </CardContent>
                          )}
                        </div>

                        {viewMode === 'list' && (
                          <div className="flex items-center gap-6 text-sm text-muted-foreground shrink-0">
                            <Badge
                              variant="outline"
                              className={cn("rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border", getStatusColor(form.status))}
                            >
                              {t(form.status)}
                            </Badge>
                            <div className="flex items-center gap-1.5 w-16">
                              <Users className="w-3.5 h-3.5" />
                              <span>{form.response_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5 w-24">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{formatDate(form.created_at)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {viewMode === 'grid' ? (
                        <CardFooter className="pt-0 p-3 bg-muted/20 border-t border-border/50 grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className="w-full text-xs h-9 bg-background/50 border-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all"
                            onClick={() => handleBoost(form.id)}
                          >
                            <TrendingUp className="w-3.5 h-3.5 mr-2" />
                            {t('boost') || 'Boost'}
                          </Button>
                          <Link href={`/forms/${form.id}/analytics`} className="w-full">
                            <Button
                              variant="ghost"
                              className="w-full justify-center hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm transition-all h-9 text-xs"
                            >
                              <BarChart3 className="w-3.5 h-3.5 mr-2" />
                              {t('analytics') || 'Analytics'}
                            </Button>
                          </Link>
                        </CardFooter>
                      ) : (
                        <div className="flex items-center gap-1 pr-4 border-l border-border/50 pl-4 py-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-purple-500 hover:bg-purple-500/10"
                            onClick={() => handleBoost(form.id)}
                            title={t('boost') || 'Boost Form'}
                          >
                            <TrendingUp className="w-4 h-4" />
                          </Button>
                          <Link href={`/forms/${form.id}/analytics`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/forms/${form.id}/builder`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                              <DropdownMenuItem onClick={() => handleCopyLink(form.id)}>
                                <Copy className="w-4 h-4 mr-2" />
                                {t('copyLink')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(form.id)} className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
