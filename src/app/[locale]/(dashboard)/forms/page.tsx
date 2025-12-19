"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useForms, useDeleteForm } from '@/lib/hooks/use-forms';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  TrendingUp,
  LayoutGrid,
  List,
  Sparkles
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
import { BoostDialog } from '@/components/forms/boost-dialog';
import { cn } from '@/lib/utils';

export default function FormsPage() {
  const t = useTranslations('myForms');
  const { user, isLoading: isAuthLoading, isHydrated } = useAuth();
  const { data: forms = [], isLoading: isFormsLoading } = useForms();
  const deleteFormMutation = useDeleteForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [boostDialogOpen, setBoostDialogOpen] = useState(false);
  const [boostFormId, setBoostFormId] = useState<string>('');

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

  const handleBoost = (formId: string) => {
    setBoostFormId(formId);
    setBoostDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl"
      style={{
        paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
      }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-1.5 sm:mb-2">
              {t('title') || 'My Forms'}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('manageDescription') || 'Create, manage, and analyze your smart forms.'}
            </p>
          </div>

          <Link href="/" className="w-full md:w-auto">
            <Button className="w-full md:w-auto min-h-[44px] touch-manipulation">
              <Plus className="w-4 h-4 mr-2" />
              <span className="text-sm sm:text-base">{t('createNew') || 'Create New Form'}</span>
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('totalForms') || 'Total Forms'}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forms.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('totalResponses') || 'Total Responses'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResponses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('published') || 'Published'}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedForms}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchForms') || 'Search forms...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 sm:h-10 text-base sm:text-sm touch-manipulation"
            />
          </div>

          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-full sm:w-auto justify-center sm:justify-start">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex-1 sm:flex-initial min-h-[48px] sm:min-h-[44px] touch-manipulation"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="ml-2 sm:hidden text-xs">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex-1 sm:flex-initial min-h-[48px] sm:min-h-[44px] touch-manipulation"
            >
              <List className="w-4 h-4" />
              <span className="ml-2 sm:hidden text-xs">List</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? (t('noFormsFound') || 'No forms found') : (t('empty') || 'No forms yet')}
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {searchQuery ? (t('tryDifferentSearch') || 'Try a different search term') : (t('emptyDescription') || 'Create your first AI-powered form in seconds.')}
              </p>
              {!searchQuery && (
                <Link href="/">
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('createWithAI') || 'Create with AI'}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredForms.map((form) => (
              <Card key={form.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Link href={`/forms/${form.id}/builder`}>
                        <CardTitle className="line-clamp-1 hover:text-primary transition-colors cursor-pointer">
                          {form.title}
                        </CardTitle>
                      </Link>
                      {form.description && viewMode === 'grid' && (
                        <CardDescription className="line-clamp-2 mt-1">
                          {form.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", getStatusColor(form.status))}
                      >
                        {t(form.status)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('actions') || 'Actions'}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleBoost(form.id)}>
                            <TrendingUp className="w-4 h-4 mr-2" />
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
                          <DropdownMenuItem 
                            onClick={() => handleDelete(form.id)} 
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                {viewMode === 'list' && form.description && (
                  <CardContent>
                    <CardDescription className="line-clamp-1">
                      {form.description}
                    </CardDescription>
                  </CardContent>
                )}

                <CardContent className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{form.response_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(form.created_at)}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 min-h-[48px] sm:min-h-[44px] touch-manipulation text-sm sm:text-xs"
                    onClick={() => handleBoost(form.id)}
                  >
                    <TrendingUp className="w-4 h-4 sm:w-3.5 sm:h-3.5 mr-2 sm:mr-1.5" />
                    <span>{t('boost') || 'Boost'}</span>
                  </Button>
                  <Link href={`/forms/${form.id}/analytics`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full min-h-[48px] sm:min-h-[44px] touch-manipulation text-sm sm:text-xs">
                      <BarChart3 className="w-4 h-4 sm:w-3.5 sm:h-3.5 mr-2 sm:mr-1.5" />
                      <span>{t('analytics') || 'Analytics'}</span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BoostDialog
        formId={boostFormId}
        open={boostDialogOpen}
        onOpenChange={setBoostDialogOpen}
      />
    </div>
  );
}
