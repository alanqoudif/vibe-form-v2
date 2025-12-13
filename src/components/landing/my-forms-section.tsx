"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  BarChart3, 
  Edit3, 
  Clock, 
  Users,
  Plus,
  Sparkles 
} from 'lucide-react';
import type { Form } from '@/types/database';

interface MyFormsSectionProps {
  forms: (Form & { response_count?: number })[];
  isLoading?: boolean;
}

export function MyFormsSection({ forms, isLoading }: MyFormsSectionProps) {
  const t = useTranslations('myForms');

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
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-6 h-6" />
              {t('title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
        </div>
      </section>
    );
  }

  if (forms.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted border border-border flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">{t('empty')}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t('emptyDescription')}</p>
            <Button 
              variant="outline" 
              className="border-border text-foreground hover:bg-muted"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('title')}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {t('title')}
          </h2>
          <Link href="/forms">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              View All
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form, index) => (
            <Card 
              key={form.id} 
              className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-lg group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {form.title}
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`shrink-0 text-xs ${getStatusColor(form.status)}`}
                  >
                    {t(form.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-3">
                {form.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {form.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{form.response_count || 0} {t('responses')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(form.created_at)}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-3 border-t border-border gap-2">
                <Link href={`/forms/${form.id}/analytics`} className="flex-1">
                  <Button 
                    variant="ghost" 
                    className="w-full text-muted-foreground hover:text-foreground hover:bg-muted"
                    size="sm"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {t('viewAnalytics')}
                  </Button>
                </Link>
                <Link href={`/forms/${form.id}/builder`} className="flex-1">
                  <Button 
                    variant="ghost" 
                    className="w-full text-muted-foreground hover:text-foreground hover:bg-muted"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {t('editForm')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


