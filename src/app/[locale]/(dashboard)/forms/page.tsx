"use client";

import { useState, useEffect } from 'react';
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

export default function FormsPage() {
  const t = useTranslations('myForms');
  const { user, isLoading: isAuthLoading, isHydrated } = useAuth();
  const { data: forms = [], isLoading: isFormsLoading } = useForms();
  const deleteFormMutation = useDeleteForm();
  const [searchQuery, setSearchQuery] = useState('');

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
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
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
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  {t('title')}
                </h1>
                <p className="text-muted-foreground">
                  {t('manageDescription') || 'Manage and analyze all your forms in one place'}
                </p>
              </div>
              
              <Link href="/">
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-lg shadow-primary/25">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('createNew') || 'Create New Form'}
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('totalForms') || 'Total Forms'}</p>
                      <p className="text-2xl font-bold text-foreground">{forms.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('totalResponses') || 'Total Responses'}</p>
                      <p className="text-2xl font-bold text-foreground">{totalResponses}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('published')}</p>
                      <p className="text-2xl font-bold text-foreground">{publishedForms}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('searchForms') || 'Search forms...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Forms Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-card border-border">
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
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? (t('noFormsFound') || 'No forms found') : t('empty')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery ? (t('tryDifferentSearch') || 'Try a different search term') : t('emptyDescription')}
              </p>
              {!searchQuery && (
                <Link href="/">
                  <Button className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('createWithAI') || 'Create with AI'}
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((form, index) => (
                <Card 
                  key={form.id} 
                  className="bg-card border-border hover:shadow-lg hover:border-primary/20 transition-all duration-200 group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Link href={`/forms/${form.id}/builder`}>
                          <CardTitle className="text-foreground text-lg line-clamp-1 hover:text-primary transition-colors cursor-pointer">
                            {form.title}
                          </CardTitle>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(form.status)}`}
                        >
                          {t(form.status)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem 
                              onClick={() => handleCopyLink(form.id)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              {t('copyLink') || 'Copy Link'}
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`/f/${form.id}`} target="_blank">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                {t('openForm') || 'Open Form'}
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(form.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {t('delete') || 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    {form.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {form.description}
                      </p>
                    )}
                    
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
                  
                  <CardFooter className="pt-3 border-t border-border gap-2">
                    <Link href={`/forms/${form.id}/analytics`} className="flex-1">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-center"
                        size="sm"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        {t('analytics') || 'Analytics'}
                      </Button>
                    </Link>
                    <Link href={`/forms/${form.id}/builder`} className="flex-1">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-center"
                        size="sm"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {t('edit') || 'Edit'}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
