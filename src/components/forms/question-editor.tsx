"use client";

import { useMemo, useCallback, memo } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useSelectedQuestion, useFormActions } from '@/lib/stores/form-store';
import { questionTypeConfig, type QuestionType } from './question-types';
import type { FormQuestion, Json } from '@/types/database';

interface QuestionOptions {
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  choices?: string[];
  minSelect?: number;
  maxSelect?: number;
  scale?: 5 | 7;
  labels?: { low: string; high: string };
  maxStars?: 5 | 10;
}

function QuestionEditorComponent() {
  const t = useTranslations('builder');
  const selectedQuestion = useSelectedQuestion();
  const { updateQuestion, removeQuestion } = useFormActions();
  
  if (!selectedQuestion) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>{t('selectQuestion') || 'Select a question to edit'}</p>
      </div>
    );
  }

  const options = useMemo(
    () => (selectedQuestion.options || {}) as QuestionOptions,
    [selectedQuestion.options]
  );

  const handleUpdate = useCallback((updates: Partial<FormQuestion>) => {
    updateQuestion(selectedQuestion.id, updates);
  }, [selectedQuestion.id, updateQuestion]);

  const handleOptionsUpdate = useCallback((optionUpdates: Partial<QuestionOptions>) => {
    handleUpdate({
      options: { ...options, ...optionUpdates } as Json,
    });
  }, [options, handleUpdate]);

  const handleChoiceChange = useCallback((index: number, value: string) => {
    const newChoices = [...(options.choices || [])];
    newChoices[index] = value;
    handleOptionsUpdate({ choices: newChoices });
  }, [options.choices, handleOptionsUpdate]);

  const addChoice = useCallback(() => {
    const newChoices = [...(options.choices || []), `Option ${(options.choices?.length || 0) + 1}`];
    handleOptionsUpdate({ choices: newChoices });
  }, [options.choices, handleOptionsUpdate]);

  const removeChoice = useCallback((index: number) => {
    const newChoices = (options.choices || []).filter((_, i) => i !== index);
    handleOptionsUpdate({ choices: newChoices });
  }, [options.choices, handleOptionsUpdate]);

  const needsChoices = useMemo(
    () => ['mcq', 'checkbox', 'dropdown'].includes(selectedQuestion.type),
    [selectedQuestion.type]
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto h-full">
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg text-foreground">{t('questionSettings') || 'Question Settings'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {/* Question Type */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t('questionType') || 'Question Type'}</Label>
            <Select
              value={selectedQuestion.type}
              onValueChange={(value) => handleUpdate({ type: value })}
            >
              <SelectTrigger className="bg-muted border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {Object.entries(questionTypeConfig).map(([key, config]) => (
                  <SelectItem 
                    key={key} 
                    value={key}
                    className="text-foreground hover:bg-accent"
                  >
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-border" />

          {/* Question Title */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base text-muted-foreground">{t('question') || 'Question'}</Label>
            <Textarea
              value={selectedQuestion.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              placeholder={t('enterQuestion') || 'Enter your question...'}
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground resize-none min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
              rows={3}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base text-muted-foreground">{t('description')} ({t('optional') || 'Optional'})</Label>
            <Input
              value={selectedQuestion.description || ''}
              onChange={(e) => handleUpdate({ description: e.target.value || null })}
              placeholder={t('addHelperText') || 'Add helper text...'}
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-11 sm:h-10 text-sm sm:text-base"
            />
          </div>

          {/* Required Toggle */}
          <div className="flex items-center justify-between min-h-[44px]">
            <Label className="text-sm sm:text-base text-muted-foreground">{t('required')}</Label>
            <Switch
              checked={selectedQuestion.required || false}
              onCheckedChange={(checked) => handleUpdate({ required: checked })}
              className="touch-manipulation"
            />
          </div>
        </CardContent>
      </Card>

      {/* Options for choice-based questions */}
      {needsChoices && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg text-foreground">{t('options')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(options.choices || []).map((choice, index) => (
              <div key={index} className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-move shrink-0 touch-none" />
                <Input
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                  placeholder={`${t('option') || 'Option'} ${index + 1}`}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground flex-1 h-11 sm:h-10 text-sm sm:text-base"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeChoice(index)}
                  className="text-muted-foreground hover:text-destructive min-h-[44px] min-w-[44px] touch-manipulation shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addChoice}
              className="w-full bg-muted border-border text-muted-foreground hover:bg-accent hover:text-foreground min-h-[44px] touch-manipulation"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('addOption')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Likert Scale Options */}
      {selectedQuestion.type === 'likert' && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg text-foreground">{t('scaleSettings') || 'Scale Settings'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base text-muted-foreground">{t('scale') || 'Scale'}</Label>
              <Select
                value={String(options.scale || 5)}
                onValueChange={(value) => handleOptionsUpdate({ scale: Number(value) as 5 | 7 })}
              >
                <SelectTrigger className="bg-muted border-border text-foreground h-11 sm:h-10 text-sm sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="5" className="text-foreground min-h-[44px]">1-5</SelectItem>
                  <SelectItem value="7" className="text-foreground min-h-[44px]">1-7</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base text-muted-foreground">{t('lowLabel') || 'Low Label'}</Label>
                <Input
                  value={options.labels?.low || ''}
                  onChange={(e) => handleOptionsUpdate({ 
                    labels: { ...options.labels, low: e.target.value, high: options.labels?.high || '' }
                  })}
                  placeholder={t('stronglyDisagree') || 'Strongly Disagree'}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-11 sm:h-10 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base text-muted-foreground">{t('highLabel') || 'High Label'}</Label>
                <Input
                  value={options.labels?.high || ''}
                  onChange={(e) => handleOptionsUpdate({ 
                    labels: { ...options.labels, high: e.target.value, low: options.labels?.low || '' }
                  })}
                  placeholder={t('stronglyAgree') || 'Strongly Agree'}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-11 sm:h-10 text-sm sm:text-base"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rating Options */}
      {selectedQuestion.type === 'rating' && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg text-foreground">{t('ratingSettings') || 'Rating Settings'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base text-muted-foreground">{t('maxStars') || 'Max Stars'}</Label>
              <Select
                value={String(options.maxStars || 5)}
                onValueChange={(value) => handleOptionsUpdate({ maxStars: Number(value) as 5 | 10 })}
              >
                <SelectTrigger className="bg-muted border-border text-foreground h-11 sm:h-10 text-sm sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="5" className="text-foreground min-h-[44px]">5 {t('stars') || 'Stars'}</SelectItem>
                  <SelectItem value="10" className="text-foreground min-h-[44px]">10 {t('stars') || 'Stars'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Question */}
      <Button
        variant="destructive"
        onClick={() => removeQuestion(selectedQuestion.id)}
        className="w-full min-h-[44px] touch-manipulation"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {t('deleteQuestion') || 'Delete Question'}
      </Button>
    </div>
  );
}

export const QuestionEditor = memo(QuestionEditorComponent);
