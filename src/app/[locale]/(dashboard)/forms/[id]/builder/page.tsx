"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { useFormStore } from '@/lib/stores/form-store';
import { useQueryClient } from '@tanstack/react-query';
import { QuestionList } from '@/components/forms/question-list';
import { QuestionEditor } from '@/components/forms/question-editor';
import { FormPreview } from '@/components/forms/form-preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Globe,
  Link as LinkIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('builder');
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();

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
  const [showMarketplaceDialog, setShowMarketplaceDialog] = useState(false);
  const [targetResponses, setTargetResponses] = useState<number>(10);
  const [showQuestionListSheet, setShowQuestionListSheet] = useState(false);

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

      // Load target responses if exists
      if (formData.target_responses) {
        setTargetResponses(formData.target_responses);
      }

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
  const handlePublish = async (visibility: 'public' | 'unlisted' = 'public', targetResponses?: number) => {
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
      const updateData: {
        status: 'published';
        visibility: 'public' | 'unlisted';
        published_at: string;
        updated_at: string;
        target_responses?: number | null;
      } = {
        status: 'published',
        visibility: visibility,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add target_responses if publishing to marketplace
      if (visibility === 'public') {
        const validTargetResponses = targetResponses && !isNaN(targetResponses) && targetResponses > 0 
          ? targetResponses 
          : undefined;
        
        if (validTargetResponses) {
          updateData.target_responses = validTargetResponses;
        } else if (form.target_responses) {
          // Keep existing target_responses if not specified
          updateData.target_responses = form.target_responses;
        } else {
          // Set default target_responses if not specified and doesn't exist
          updateData.target_responses = null;
        }
      }

      console.log('Publishing form with data:', { id, updateData, currentForm: form });

      const { error, data } = await supabase
        .from('forms')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error publishing form:', error);
        throw error;
      }

      console.log('Form published successfully:', data);
      
      // Verify the update was successful
      if (data && data.length > 0) {
        const updatedForm = data[0];
        console.log('Updated form details:', {
          id: updatedForm.id,
          status: updatedForm.status,
          visibility: updatedForm.visibility,
          target_responses: updatedForm.target_responses,
        });
        
        // Check if visibility was actually updated
        if (updatedForm.visibility !== visibility) {
          console.error('WARNING: Visibility was not updated correctly!', {
            expected: visibility,
            actual: updatedForm.visibility,
          });
        }
      }

      // Invalidate queries to refresh feed and forms list
      queryClient.invalidateQueries({ queryKey: ['public-forms'] });
      queryClient.invalidateQueries({ queryKey: ['forms'] });

      updateForm({ 
        status: 'published', 
        visibility, 
        target_responses: updateData.target_responses 
      });
      
      if (visibility === 'public') {
        toast.success(t('publishedToMarketplace') || 'Form published to marketplace successfully!');
      } else {
        toast.success(t('publishSuccess') || 'Form published successfully!');
      }
      
      router.push(`/forms/${id}/analytics`);
    } catch (error) {
      console.error('Error publishing form:', error);
      toast.error(t('publishError') || 'Failed to publish form');
    } finally {
      setIsPublishing(false);
      setShowMarketplaceDialog(false);
    }
  };

  const handlePublishToMarketplace = () => {
    setShowMarketplaceDialog(true);
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
      <div className="min-h-screen bg-background flex flex-col w-full max-w-[100vw] overflow-x-hidden">
        {/* Header - Simplified */}
        <header className="border-b border-border bg-card/50 backdrop-blur-xl shrink-0 sticky top-0 z-20"
        style={{
          paddingTop: "env(safe-area-inset-top)",
        }}
        >
          <div className="flex items-center px-2 sm:px-3 md:px-4 gap-2 sm:gap-3 h-12 sm:h-14">
            {/* Back Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/forms">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9 sm:h-10 sm:w-10 touch-manipulation">
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{t('backToForms') || 'Back to forms'}</p>
              </TooltipContent>
            </Tooltip>

            <div className="h-6 sm:h-8 w-px bg-border hidden sm:block" />

            {/* Logo and Title */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                <Image
                  src="/fonts/vibe form logo.png"
                  alt="Vibe Form - Form Builder Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <Input
                value={form?.title || ''}
                onChange={(e) => updateForm({ title: e.target.value })}
                placeholder={t('untitledForm') || 'Untitled Form'}
                className="bg-transparent border-none shadow-none text-foreground font-medium placeholder:text-muted-foreground focus-visible:ring-0 max-w-md text-sm sm:text-base h-8 sm:h-9"
              />
              {form?.status === 'published' && (
                <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 hidden sm:inline-block">
                  {t('published')}
                </span>
              )}
            </div>

          {/* Actions - Grouped */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Button */}
            <Sheet open={showThemePicker} onOpenChange={setShowThemePicker}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 touch-manipulation hidden sm:flex">
                      <Palette className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{t('customizeTheme')}</p>
                </TooltipContent>
              </Tooltip>
              <SheetContent className="w-full sm:w-[400px] md:w-[540px] bg-card border-border"
              style={{
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
              >
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
                      "h-7 sm:h-8 px-2 sm:px-3 rounded-md touch-manipulation",
                      activeTab === 'edit' ? "bg-background shadow-sm" : "hover:bg-transparent"
                    )}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline ml-1.5">{t('edit') || 'Edit'}</span>
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
                      "h-7 sm:h-8 px-2 sm:px-3 rounded-md touch-manipulation",
                      activeTab === 'preview' ? "bg-background shadow-sm" : "hover:bg-transparent"
                    )}
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline ml-1.5">{t('preview')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{t('preview')}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="h-6 sm:h-8 w-px bg-border hidden sm:block" />

            {/* Save Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSave}
                  disabled={isSaving || !isDirty}
                  className="h-9 w-9 touch-manipulation hidden sm:flex"
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

            {/* Publish Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={isPublishing}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground gap-1.5 sm:gap-2 h-9 sm:h-9 px-3 sm:px-4 touch-manipulation"
                >
                  {isPublishing ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                  <span className="text-xs sm:text-sm">{t('publish')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>{t('publishOptions') || 'Publishing Options'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handlePublishToMarketplace} className="cursor-pointer">
                  <Globe className="w-4 h-4 mr-2 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{t('publishToMarketplace') || 'Publish to Marketplace'}</span>
                    <span className="text-xs text-muted-foreground">{t('getResponsesFromInterested') || 'Get responses from interested users'}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePublish('unlisted')} className="cursor-pointer">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <div className="flex flex-col">
                    <span>{t('shareLink') || 'Share via Link'}</span>
                    <span className="text-xs text-muted-foreground">{t('onlyPeopleWithLink') || 'Only people with link'}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Options for published forms */}
            {form?.status === 'published' && (
              <>
                <div className="h-6 sm:h-8 w-px bg-border hidden sm:block" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleCopyLink} className="h-9 w-9 touch-manipulation hidden sm:flex">
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
                      <Button variant="outline" size="icon" className="h-9 w-9 touch-manipulation hidden sm:flex">
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
        </div>

        {/* Description Field */}
        <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 border-t border-border/50 pt-2">
          <Textarea
            value={form?.description || ''}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder={t('formDescriptionPlaceholder') || 'Add a description for your form (optional)...'}
            className="bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus-visible:ring-1 focus-visible:ring-ring/50 min-h-[60px] max-h-[100px] text-xs sm:text-sm"
            rows={2}
          />
        </div>
      </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'edit' ? (
            <>
              {/* Question List Sidebar - Desktop */}
              <aside className="hidden lg:flex w-80 border-e border-border/50 flex-shrink-0 bg-card/30 backdrop-blur-sm flex flex-col">
                <div className="p-4 border-b border-border/50 shrink-0">
                  <h2 className="font-semibold text-foreground flex items-center gap-2 font-display">
                    <LayoutGrid className="w-4 h-4" />
                    {t('questions') || 'Questions'}
                    <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {questions.length}
                    </span>
                  </h2>
                </div>
                <div className="flex-1 min-h-0">
                  <QuestionList />
                </div>
              </aside>

              {/* Question List Sheet - Mobile */}
              <Sheet open={showQuestionListSheet} onOpenChange={setShowQuestionListSheet}>
                <SheetContent side="left" className="w-[320px] sm:w-[400px] bg-card border-border p-0"
                style={{
                  paddingBottom: "env(safe-area-inset-bottom)",
                }}
                >
                  <div className="p-4 border-b border-border/50 shrink-0">
                    <h2 className="font-semibold text-foreground flex items-center gap-2 font-display">
                      <LayoutGrid className="w-4 h-4" />
                      {t('questions') || 'Questions'}
                      <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {questions.length}
                      </span>
                    </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <QuestionList />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Question Editor */}
              <main className="flex-1 overflow-hidden bg-muted/20 relative">
                {/* Mobile: Button to open Question List */}
                <div className="lg:hidden absolute top-4 left-4 z-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuestionListSheet(true)}
                    className="bg-background/90 backdrop-blur-sm border-border shadow-sm touch-manipulation min-h-[44px]"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    {t('questions') || 'Questions'} ({questions.length})
                  </Button>
                </div>
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
                <QuestionEditor />
              </main>

              {/* Mini Preview - Desktop Only */}
              <aside className="w-[420px] border-s border-border/50 flex-shrink-0 overflow-hidden hidden xl:flex flex-col bg-card/30 backdrop-blur-sm">
                <div className="p-4 border-b border-border/50 flex items-center justify-between">
                  <h2 className="font-semibold text-foreground flex items-center gap-2 font-display">
                    <Eye className="w-4 h-4" />
                    {t('livePreview') || 'Live Preview'}
                  </h2>
                  <div className="flex items-center rounded-lg border border-border/50 bg-muted/50 p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      className={cn(
                        "h-6 w-6 p-0 rounded-md transition-all touch-manipulation",
                        previewMode === 'desktop' ? "bg-background shadow-sm" : "hover:bg-background/50"
                      )}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      className={cn(
                        "h-6 w-6 p-0 touch-manipulation",
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
            <main className="flex-1 overflow-auto bg-muted/30 p-3 sm:p-4 md:p-6"
            style={{
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}
            >
              <div className="max-w-4xl mx-auto">
                {/* Preview Controls */}
                <div className="mb-4 sm:mb-6 flex items-center justify-center gap-2">
                  <div className="flex items-center rounded-lg border border-border bg-card p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      className={cn(
                        "h-8 sm:h-9 px-3 sm:px-4 rounded-md gap-1.5 sm:gap-2 touch-manipulation",
                        previewMode === 'desktop' ? "bg-muted" : ""
                      )}
                    >
                      <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{t('desktop') || 'Desktop'}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      className={cn(
                        "h-8 sm:h-9 px-3 sm:px-4 rounded-md gap-1.5 sm:gap-2 touch-manipulation",
                        previewMode === 'mobile' ? "bg-muted" : ""
                      )}
                    >
                      <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{t('mobile') || 'Mobile'}</span>
                    </Button>
                  </div>
                </div>

                {/* Full Preview */}
                <div className={cn(
                  "mx-auto transition-all duration-300 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-border",
                  previewMode === 'mobile' ? "max-w-[375px]" : "max-w-2xl"
                )}>
                  <FormPreview theme={theme} fullscreen />
                </div>
              </div>
            </main>
          )}
        </div>
      </div>

      {/* Marketplace Publish Dialog */}
      <Dialog open={showMarketplaceDialog} onOpenChange={setShowMarketplaceDialog}>
        <DialogContent className="w-[95vw] sm:max-w-md"
        style={{
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
        }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              {t('publishToMarketplace') || 'Publish to Marketplace'}
            </DialogTitle>
            <DialogDescription>
              {t('marketplaceDescription') || 'Your form will be visible to all users in the marketplace. Set how many responses you want to collect.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="target-responses" className="text-sm font-medium">
                {t('targetResponses') || 'Target Responses'}
              </Label>
              <Input
                id="target-responses"
                type="number"
                min="1"
                max="1000"
                value={targetResponses}
                onChange={(e) => setTargetResponses(Math.max(1, parseInt(e.target.value) || 1))}
                placeholder="10"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                {t('targetResponsesHint') || 'How many responses do you want to collect? (optional)'}
              </p>
            </div>

            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-2">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {t('marketplaceBenefits') || 'Marketplace Benefits'}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• {t('visibleToAllUsers') || 'Visible to all interested users'}</li>
                    <li>• {t('getQualityResponses') || 'Get quality responses from engaged users'}</li>
                    <li>• {t('trackProgress') || 'Track your progress towards target responses'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMarketplaceDialog(false)}
              disabled={isPublishing}
            >
              {t('cancel') || 'Cancel'}
            </Button>
            <Button
              onClick={() => handlePublish('public', targetResponses)}
              disabled={isPublishing}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('publishing') || 'Publishing...'}
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  {t('publishToMarketplace') || 'Publish to Marketplace'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
