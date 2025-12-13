"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { useFormStore } from '@/lib/stores/form-store';
import { QuestionList } from '@/components/forms/question-list';
import { QuestionEditor } from '@/components/forms/question-editor';
import { FormPreview } from '@/components/forms/form-preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Send, 
  Loader2,
  Palette,
  LayoutGrid,
  Monitor,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import Image from 'next/image';
import type { Form, FormQuestion, Json } from '@/types/database';
import { ThemePicker } from '@/components/forms/theme-picker';
import { FormTheme, DEFAULT_THEME } from '@/types/form-theme';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('builder');
  const router = useRouter();
  const supabase = createClient();
  
  const { 
    form, 
    questions, 
    isDirty,
    setForm, 
    setQuestions, 
    updateForm,
    setDirty,
    reset 
  } = useFormStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [theme, setTheme] = useState<FormTheme>(DEFAULT_THEME);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showSaved, setShowSaved] = useState(false);

  // Fetch form and questions
  useEffect(() => {
    const fetchForm = async () => {
      setIsLoading(true);
      
      // Fetch form
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

      if (formError || !formData) {
        toast.error(t('formNotFound') || 'Form not found');
        router.push('/forms');
        return;
      }

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('form_questions')
        .select('*')
        .eq('form_id', id)
        .order('order_index', { ascending: true });

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
      }

      setForm(formData as Form);
      setQuestions((questionsData || []) as FormQuestion[]);
      
      // Load theme from form settings
      if (formData.settings && typeof formData.settings === 'object') {
        const settings = formData.settings as { theme?: FormTheme };
        if (settings.theme) {
          setTheme(settings.theme);
        }
      }
      
      setIsLoading(false);
    };

    fetchForm();

    return () => {
      reset();
    };
  }, [id, supabase, router, setForm, setQuestions, reset, t]);

  // Save form
  const handleSave = async () => {
    if (!form) return;
    
    setIsSaving(true);

    try {
      // Update form with theme in settings
      const currentSettings = (form.settings && typeof form.settings === 'object') 
        ? form.settings as Record<string, unknown>
        : {};
      
      const { error: formError } = await supabase
        .from('forms')
        .update({
          title: form.title,
          description: form.description,
          category: form.category,
          settings: { ...currentSettings, theme } as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (formError) throw formError;

      // Delete existing questions and insert new ones
      await supabase.from('form_questions').delete().eq('form_id', id);
      
      if (questions.length > 0) {
        const questionsToInsert = questions.map((q, index) => ({
          form_id: id,
          order_index: index,
          type: q.type,
          title: q.title,
          description: q.description,
          required: q.required,
          options: q.options,
          logic: q.logic,
        }));

        const { error: questionsError } = await supabase
          .from('form_questions')
          .insert(questionsToInsert);

        if (questionsError) throw questionsError;
      }

      setDirty(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
      toast.success(t('changesSaved') || 'Changes saved!');
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error(t('saveError') || 'Failed to save form');
    } finally {
      setIsSaving(false);
    }
  };

  // Publish form
  const handlePublish = async () => {
    if (!form) return;
    
    // Validate
    if (!form.title?.trim()) {
      toast.error(t('addTitle') || 'Please add a title to your form');
      return;
    }
    
    if (questions.length === 0) {
      toast.error(t('addQuestion') || 'Please add at least one question');
      return;
    }

    setIsPublishing(true);

    try {
      // Save first if dirty
      if (isDirty) {
        await handleSave();
      }

      // Update status to published
      const { error } = await supabase
        .from('forms')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      updateForm({ status: 'published' });
      toast.success(t('publishSuccess') || 'Form published successfully!');
      router.push(`/forms/${id}/analytics`);
    } catch (error) {
      console.error('Error publishing form:', error);
      toast.error(t('publishError') || 'Failed to publish form');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/f/${id}`;
    navigator.clipboard.writeText(url);
    toast.success(t('linkCopied') || 'Link copied!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-48 h-6" />
          <div className="flex-1" />
          <Skeleton className="w-24 h-9" />
          <Skeleton className="w-24 h-9" />
        </header>
        <div className="flex h-[calc(100vh-3.5rem)]">
          <div className="w-80 border-r border-border p-4 space-y-4 bg-card">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <div className="flex-1 p-4">
            <Skeleton className="h-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header - Simplified */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-card/50 backdrop-blur-xl shrink-0 sticky top-0 z-20">
          {/* Back Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/forms">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{t('backToForms') || 'Back to forms'}</p>
            </TooltipContent>
          </Tooltip>

          <div className="h-8 w-px bg-border" />

          {/* Logo and Title */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              <Image
                src="/fonts/vibe form logo.png"
                alt="Vibe Form Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <Input
              value={form?.title || ''}
              onChange={(e) => updateForm({ title: e.target.value })}
              placeholder={t('untitledForm') || 'Untitled Form'}
              className="bg-transparent border-none shadow-none text-foreground font-medium placeholder:text-muted-foreground focus-visible:ring-0 max-w-md"
            />
            {form?.status === 'published' && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                {t('published')}
              </span>
            )}
          </div>

          {/* Actions - Grouped */}
          <div className="flex items-center gap-2">
            {/* Theme Button */}
            <Sheet open={showThemePicker} onOpenChange={setShowThemePicker}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Palette className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{t('customizeTheme')}</p>
                </TooltipContent>
              </Tooltip>
              <SheetContent className="w-[400px] sm:w-[540px] bg-card border-border">
                <SheetHeader>
                  <SheetTitle className="text-foreground flex items-center gap-2 font-display">
                    <Palette className="w-5 h-5" />
                    {t('customizeTheme')}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ThemePicker 
                    theme={theme} 
                    onChange={(newTheme) => {
                      setTheme(newTheme);
                      setDirty(true);
                    }} 
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Preview Toggle */}
            <div className="flex items-center rounded-lg border border-border bg-muted p-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('edit')}
                    className={cn(
                      "h-7 px-3 rounded-md",
                      activeTab === 'edit' ? "bg-background shadow-sm" : "hover:bg-transparent"
                    )}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{t('edit') || 'Edit'}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('preview')}
                    className={cn(
                      "h-7 px-3 rounded-md",
                      activeTab === 'preview' ? "bg-background shadow-sm" : "hover:bg-transparent"
                    )}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{t('preview')}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            {/* Save Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSave}
                  disabled={isSaving || !isDirty}
                  className="h-9 w-9"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : showSaved ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{showSaved ? (t('saved') || 'Saved') : (t('save') || 'Save')}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Publish Button */}
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              size="sm"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground gap-2"
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{t('publish')}</span>
            </Button>

            {/* More Options for published forms */}
            {form?.status === 'published' && (
              <>
                <div className="h-8 w-px bg-border hidden sm:block" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleCopyLink} className="h-9 w-9">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{t('copyLink') || 'Copy link'}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={`/f/${id}`} target="_blank">
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{t('openForm') || 'Open form'}</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'edit' ? (
            <>
              {/* Question List Sidebar */}
              <aside className="w-80 border-r border-border flex-shrink-0 overflow-hidden bg-card/30">
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" />
                      {t('questions') || 'Questions'}
                      <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {questions.length}
                      </span>
                    </h2>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <QuestionList />
                  </div>
                </div>
              </aside>

              {/* Question Editor */}
              <main className="flex-1 overflow-hidden bg-muted/30">
                <QuestionEditor />
              </main>

              {/* Mini Preview */}
              <aside className="w-[420px] border-l border-border flex-shrink-0 overflow-hidden hidden xl:flex flex-col bg-card/30">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {t('livePreview') || 'Live Preview'}
                  </h2>
                  <div className="flex items-center rounded-md border border-border p-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      className={cn(
                        "h-6 w-6 p-0",
                        previewMode === 'desktop' ? "bg-muted" : ""
                      )}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      className={cn(
                        "h-6 w-6 p-0",
                        previewMode === 'mobile' ? "bg-muted" : ""
                      )}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className={cn(
                    "mx-auto transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-border",
                    previewMode === 'mobile' ? "w-[320px]" : "w-full"
                  )}>
                    <FormPreview theme={theme} />
                  </div>
                </div>
              </aside>
            </>
          ) : (
            <main className="flex-1 overflow-auto bg-muted/30 p-6">
              <div className="max-w-4xl mx-auto">
                {/* Preview Controls */}
                <div className="mb-6 flex items-center justify-center gap-2">
                  <div className="flex items-center rounded-lg border border-border bg-card p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      className={cn(
                        "h-8 px-4 rounded-md gap-2",
                        previewMode === 'desktop' ? "bg-muted" : ""
                      )}
                    >
                      <Monitor className="w-4 h-4" />
                      {t('desktop') || 'Desktop'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      className={cn(
                        "h-8 px-4 rounded-md gap-2",
                        previewMode === 'mobile' ? "bg-muted" : ""
                      )}
                    >
                      <Smartphone className="w-4 h-4" />
                      {t('mobile') || 'Mobile'}
                    </Button>
                  </div>
                </div>

                {/* Full Preview */}
                <div className={cn(
                  "mx-auto transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-border",
                  previewMode === 'mobile' ? "max-w-[375px]" : "max-w-2xl"
                )}>
                  <FormPreview theme={theme} fullscreen />
                </div>
              </div>
            </main>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
