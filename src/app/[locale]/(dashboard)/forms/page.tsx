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
  List
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Navbar } from '@/components/ui/mini-navbar';
import { cn } from '@/lib/utils';

export default function FormsPage() {
  const t = useTranslations('myForms');
  const { user, isLoading: isAuthLoading, isHydrated } = useAuth();
  const { data: forms = [], isLoading: isFormsLoading } = useForms();
  const deleteFormMutation = useDeleteForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Wait for hydration before showing content
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

  // Calculate stats
  const totalResponses = forms.reduce((sum, f) => sum + (f.response_count || 0), 0);
  const publishedForms = forms.filter(f => f.status === 'published').length;

  return (
    <div className="min-h-screen bg-background/50">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="py-8 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <h1 className="text-4xl font-display font-bold vibe-gradient-text tracking-tight">
                {t('title') || 'Dashboard'}
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg">
                {t('manageDescription') || 'Create, manage, and analyze your forms with the power of AI.'}
              </p>
            </div>

            <Link href="/">
              <Button className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 text-white font-medium">
                <Plus className="w-5 h-5 mr-2" />
                {t('createNew') || 'Create New Form'}
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <Card className="glass border-border/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('totalForms') || 'Total Forms'}</p>
                    <p className="text-3xl font-bold font-display">{forms.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('totalResponses') || 'Total Responses'}</p>
                    <p className="text-3xl font-bold font-display">{totalResponses}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('published') || 'Published'}</p>
                    <p className="text-3xl font-bold font-display">{publishedForms}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('searchForms') || 'Search forms...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-card/50 border-border/50 focus:bg-card transition-all rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg border border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-8 px-2 rounded-md transition-all",
                  viewMode === 'grid' ? "bg-background shadow-sm" : "hover:bg-background/50"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-8 px-2 rounded-md transition-all",
                  viewMode === 'list' ? "bg-background shadow-sm" : "hover:bg-background/50"
                )}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Forms Grid/List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="glass border-border/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-primary/5 flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
                {searchQuery ? (t('noFormsFound') || 'No forms found') : (t('empty') || 'Start your journey')}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
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
            </div>
          ) : (
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredForms.map((form, index) => (
                <Card
                  key={form.id}
                  className={cn(
                    "glass border-border/50 group animate-fade-in overflow-hidden",
                    "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300",
                    viewMode === 'list' && "flex flex-row items-center p-2"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn("flex-1", viewMode === 'list' && "p-4")}>
                    <CardHeader className={cn("pb-3", viewMode === 'list' && "p-0 mb-2")}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/forms/${form.id}/builder`}>
                            <CardTitle className="text-foreground text-lg font-display line-clamp-1 hover:text-primary transition-colors cursor-pointer">
                              {form.title}
                            </CardTitle>
                          </Link>
                        </div>
                        {viewMode === 'grid' && (
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge
                              variant="outline"
                              className={`rounded-lg px-2 py-0.5 text-xs font-medium border ${getStatusColor(form.status)}`}
                            >
                              {t(form.status)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-popover/95 backdrop-blur-lg border-border/50 shadow-xl rounded-xl">
                                <DropdownMenuItem onClick={() => handleCopyLink(form.id)} className="cursor-pointer">
                                  <Copy className="w-4 h-4 mr-2" />
                                  {t('copyLink') || 'Copy Link'}
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                  <a href={`/f/${form.id}`} target="_blank">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    {t('openForm') || 'Open Form'}
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(form.id)}
                                  className="text-destructive focus:text-destructive cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {t('delete') || 'Delete'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className={cn("pb-3", viewMode === 'list' && "p-0")}>
                      {form.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {form.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                          <Users className="w-3.5 h-3.5" />
                          <span>{form.response_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(form.created_at)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {viewMode === 'grid' ? (
                    <CardFooter className="pt-3 border-t border-border/50 gap-2 bg-muted/30">
                      <Link href={`/forms/${form.id}/analytics`} className="flex-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-center hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm transition-all"
                          size="sm"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          {t('analytics') || 'Analytics'}
                        </Button>
                      </Link>
                      <Link href={`/forms/${form.id}/builder`} className="flex-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-center hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm transition-all"
                          size="sm"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          {t('edit') || 'Edit'}
                        </Button>
                      </Link>
                    </CardFooter>
                  ) : (
                    <div className="flex items-center gap-2 px-4 border-l border-border/50">
                      <Link href={`/forms/${form.id}/analytics`}>
                        <Button variant="ghost" size="icon">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/forms/${form.id}/builder`}>
                        <Button variant="ghost" size="icon">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-popover/95 backdrop-blur-lg border-border/50 shadow-xl rounded-xl">
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
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
