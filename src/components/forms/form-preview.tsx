"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { QuestionRenderer } from './question-types';
import { useFormStore } from '@/lib/stores/form-store';
import { FormTheme, DEFAULT_THEME, getThemeCSS } from '@/types/form-theme';
import type { Json } from '@/types/database';
import { cn } from '@/lib/utils';

interface FormPreviewProps {
  theme?: FormTheme;
  fullscreen?: boolean;
}

export function FormPreview({ theme = DEFAULT_THEME, fullscreen = false }: FormPreviewProps) {
  const { form, questions } = useFormStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Json>>({});

  if (!form) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No form to preview</p>
      </div>
    );
  }

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

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Calculate border radius
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

  // Calculate shadow
  const getShadow = () => {
    switch (theme.cardShadow) {
      case 'none': return 'shadow-none';
      case 'sm': return 'shadow-sm';
      case 'md': return 'shadow-md';
      case 'lg': return 'shadow-lg';
      default: return 'shadow-md';
    }
  };

  const cardClasses = cn(
    getBorderRadius(),
    getShadow(),
    'border border-white/10 transition-all duration-300'
  );

  return (
    <div 
      className={cn(
        "flex flex-col h-full p-6 transition-all duration-300",
        fullscreen ? "min-h-screen" : ""
      )}
      style={{ 
        backgroundColor: theme.backgroundColor,
        fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`
      }}
    >
      {/* Header Banner */}
      <div 
        className={cn("h-4 w-full mb-6", fullscreen ? "h-6" : "")}
        style={{ 
          backgroundColor: theme.headerColor,
          borderRadius: theme.cardBorderRadius === 'none' ? '0' : '9999px'
        }}
      />

      <div className={cn("mx-auto w-full", fullscreen ? "max-w-2xl" : "max-w-full")}>
        {/* Form Header */}
        <div 
          className={cn(cardClasses, "mb-6 p-6")}
          style={{ backgroundColor: theme.cardBackground }}
        >
          <h1 
            className={cn("text-2xl font-bold mb-2", fullscreen ? "text-3xl" : "")}
            style={{ color: theme.questionTextColor }}
          >
            {form.title || 'Untitled Form'}
          </h1>
          {form.description && (
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
              <span>Question {currentIndex + 1} of {questions.length}</span>
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
        {currentQuestion ? (
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
                  Required
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
        ) : (
          <div 
            className={cn(cardClasses, "py-12 text-center")}
            style={{ backgroundColor: theme.cardBackground }}
          >
            <p style={{ color: theme.answerTextColor }}>No questions in this form yet</p>
            <p className="text-sm mt-1" style={{ color: theme.answerTextColor + '80' }}>
              Add questions using the sidebar
            </p>
          </div>
        )}

        {/* Navigation */}
        {questions.length > 0 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={cn(
                "px-6 py-2 rounded-lg border transition-all",
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
              )}
              style={{ 
                borderColor: theme.primaryColor + '50',
                color: theme.questionTextColor,
                backgroundColor: 'transparent'
              }}
            >
              Previous
            </button>
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={goNext}
                className="px-6 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Next
              </button>
            ) : (
              <button 
                className="px-6 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: '#22c55e' }}
              >
                Submit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
