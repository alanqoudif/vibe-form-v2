"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { QuestionRenderer } from '@/components/forms/question-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Zap, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import type { Form, FormQuestion, Json } from '@/types/database';
import { FormTheme, DEFAULT_THEME } from '@/types/form-theme';
import { cn } from '@/lib/utils';

export default function PublicFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const t = useTranslations('respond');
  const router = useRouter();
  const { user } = useAuthStore();
  const supabase = createClient();
  
  const [form, setForm] = useState<Form | null>(null);
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Json>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [creditsEarned, setCreditsEarned] = useState(0);
  const [responseId, setResponseId] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [theme, setTheme] = useState<FormTheme>(DEFAULT_THEME);

  // Fetch form and questions
  useEffect(() => {
    const fetchForm = async () => {
      // Track view event
      const sessionId = crypto.randomUUID();
      
      // Fetch form
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', slug)
        .eq('status', 'published')
        .single();

      if (formError || !formData) {
        toast.error('Form not found or not published');
        router.push('/');
        return;
      }

      // Fetch questions
      const { data: questionsData } = await supabase
        .from('form_questions')
        .select('*')
        .eq('form_id', slug)
        .order('order_index', { ascending: true });

      setForm(formData);
      setQuestions(questionsData || []);
      
      // Load theme from form settings
      if (formData.settings && typeof formData.settings === 'object') {
        const settings = formData.settings as { theme?: FormTheme };
        if (settings.theme) {
          setTheme(settings.theme);
        }
      }
      
      // Track view event
      await supabase.from('form_events').insert({
        form_id: slug,
        event_type: 'view',
        session_id: sessionId,
        user_id: user?.id || null,
        metadata: { referrer: document.referrer },
      });

      // Create response record
      const { data: responseData } = await supabase
        .from('responses')
        .insert({
          form_id: slug,
          respondent_id: user?.id || null,
          is_anonymous: !user,
        })
        .select()
        .single();

      if (responseData) {
        setResponseId(responseData.id);
        
        // Track start event
        await supabase.from('form_events').insert({
          form_id: slug,
          event_type: 'start',
          session_id: sessionId,
          user_id: user?.id || null,
        });
      }

      setIsLoading(false);
    };

    fetchForm();
  }, [slug, supabase, router, user]);

  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const currentQuestion = questions[currentIndex];

  const handleAnswer = (value: Json) => {
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: value,
      }));
    }
  };

  const canProceed = () => {
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;
    
    const answer = answers[currentQuestion.id];
    if (answer === undefined || answer === null || answer === '') return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    
    return true;
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1 && canProceed()) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed() || !responseId) return;
    
    setIsSubmitting(true);

    try {
      const durationSec = Math.floor((Date.now() - startTime) / 1000);
      
      // Insert answers
      const answersToInsert = Object.entries(answers).map(([questionId, answer]) => ({
        response_id: responseId,
        question_id: questionId,
        answer,
      }));

      await supabase.from('response_answers').insert(answersToInsert);

      // Update response with completion
      const qualityScore = Math.min(1.0, durationSec / (questions.length * 10)); // Basic quality score
      
      await supabase
        .from('responses')
        .update({
          submitted_at: new Date().toISOString(),
          duration_sec: durationSec,
          quality_score: qualityScore,
        })
        .eq('id', responseId);

      // Track submit event
      await supabase.from('form_events').insert({
        form_id: slug,
        event_type: 'submit',
        user_id: user?.id || null,
      });

      // Award credits if user is logged in and quality is good
      if (user && qualityScore >= 0.3) {
        const baseCredits = 10;
        const bonusCredits = Math.floor(qualityScore * 10);
        const totalCredits = baseCredits + bonusCredits;

        await supabase.from('credits_ledger').insert({
          user_id: user.id,
          amount: totalCredits,
          reason: 'complete_form',
          related_form_id: slug,
          related_response_id: responseId,
        });

        // Update user balance directly (simple approach)
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('credits_balance')
          .eq('id', user.id)
          .single();
        
        await supabase
          .from('profiles')
          .update({ 
            credits_balance: (currentProfile?.credits_balance || 0) + totalCredits 
          })
          .eq('id', user.id);

        setCreditsEarned(totalCredits);
      }

      setIsSubmitted(true);
      toast.success('Response submitted!');
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit response');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white/5 border-white/10">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 bg-white/10" />
            <Skeleton className="h-4 w-full bg-white/10 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full bg-white/10" />
            <div className="flex justify-end gap-2">
              <Skeleton className="h-10 w-24 bg-white/10" />
              <Skeleton className="h-10 w-24 bg-white/10" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          backgroundColor: theme.backgroundColor,
          fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`
        }}
      >
        <div 
          className="w-full max-w-md rounded-2xl p-8 text-center border"
          style={{ 
            backgroundColor: theme.cardBackground,
            borderColor: theme.primaryColor + '30'
          }}
        >
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#22c55e20' }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: '#4ade80' }} />
          </div>
          <h2 
            className="text-2xl font-semibold mb-2"
            style={{ color: theme.questionTextColor }}
          >
            {t('thankYou')}
          </h2>
          <p className="mb-6" style={{ color: theme.answerTextColor }}>
            {t('thankYouMessage')}
          </p>
          
          {creditsEarned > 0 && (
            <div 
              className="rounded-xl p-4 mb-6"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.accentColor}20)` 
              }}
            >
              <p style={{ color: theme.primaryColor }} className="font-medium">
                🎉 {t('creditsEarned', { amount: creditsEarned })}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button 
              onClick={() => router.push('/feed')}
              className="w-full py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {t('earnMore')}
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-lg font-medium transition-all border hover:opacity-80"
              style={{ 
                borderColor: theme.primaryColor + '50',
                color: theme.questionTextColor,
                backgroundColor: 'transparent'
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate border radius class
  const getBorderRadius = () => {
    switch (theme.cardBorderRadius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-md';
      case 'md': return 'rounded-lg';
      case 'lg': return 'rounded-xl';
      case 'xl': return 'rounded-2xl';
      default: return 'rounded-xl';
    }
  };

  const cardClasses = cn(
    getBorderRadius(),
    'border border-white/10 transition-all duration-300'
  );

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: theme.backgroundColor,
        fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`
      }}
    >
      {/* Header Banner */}
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: theme.headerColor }}
      />

      {/* Header */}
      <header 
        className="border-b backdrop-blur-xl"
        style={{ 
          borderColor: theme.primaryColor + '20',
          backgroundColor: theme.cardBackground + '80'
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.headerColor }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span style={{ color: theme.questionTextColor }} className="font-medium">Vibe Form</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Form Header */}
        <div 
          className={cn(cardClasses, "mb-6 p-6")}
          style={{ backgroundColor: theme.cardBackground }}
        >
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: theme.questionTextColor }}
          >
            {form?.title}
          </h1>
          {form?.description && (
            <p style={{ color: theme.answerTextColor }}>
              {form.description}
            </p>
          )}
        </div>

        {/* Progress */}
        {questions.length > 0 && (
          <div className="mb-6">
            <div 
              className="flex items-center justify-between text-sm mb-2"
              style={{ color: theme.answerTextColor }}
            >
              <span>{t('progress', { current: currentIndex + 1, total: questions.length })}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: theme.primaryColor + '30' }}
            >
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: theme.primaryColor
                }}
              />
            </div>
          </div>
        )}

        {/* Question */}
        {currentQuestion && (
          <div 
            className={cn(cardClasses, "p-6")}
            style={{ backgroundColor: theme.cardBackground }}
          >
            <div className="flex items-start justify-between gap-2 mb-4">
              <h2 
                className="text-lg font-semibold"
                style={{ color: theme.questionTextColor }}
              >
                {currentQuestion.title}
              </h2>
              {currentQuestion.required && (
                <span 
                  className="px-2 py-1 text-xs rounded-full"
                  style={{ 
                    backgroundColor: '#ef444420',
                    color: '#f87171'
                  }}
                >
                  {t('required')}
                </span>
              )}
            </div>
            {currentQuestion.description && (
              <p 
                className="mb-4 text-sm"
                style={{ color: theme.answerTextColor }}
              >
                {currentQuestion.description}
              </p>
            )}
            <QuestionRenderer
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={handleAnswer}
              theme={theme}
            />
          </div>
        )}

        {/* Navigation */}
        {questions.length > 0 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-lg border transition-all",
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
              )}
              style={{ 
                borderColor: theme.primaryColor + '50',
                color: theme.questionTextColor,
                backgroundColor: 'transparent'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all",
                  !canProceed() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                )}
                style={{ backgroundColor: theme.primaryColor }}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all",
                  (!canProceed() || isSubmitting) ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                )}
                style={{ backgroundColor: '#22c55e' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  t('submit')
                )}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

