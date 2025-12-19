"use client";

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import type { FormQuestion, Json } from '@/types/database';
import { FormTheme, DEFAULT_THEME } from '@/types/form-theme';

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

interface QuestionRendererProps {
  question: FormQuestion;
  value: Json;
  onChange: (value: Json) => void;
  disabled?: boolean;
  theme?: FormTheme;
}

export function QuestionRenderer({ question, value, onChange, disabled, theme = DEFAULT_THEME }: QuestionRendererProps) {
  const options = (question.options || {}) as QuestionOptions;

  const inputStyle = {
    backgroundColor: theme.primaryColor + '10',
    borderColor: theme.primaryColor + '40',
    color: theme.questionTextColor,
  };

  const labelStyle = {
    color: theme.answerTextColor,
  };

  switch (question.type) {
    case 'short_text':
      return (
        <input
          type="text"
          placeholder={options.placeholder || 'Your answer...'}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          maxLength={options.maxLength}
          disabled={disabled}
          className="w-full px-4 py-3.5 sm:py-3 rounded-lg border outline-none focus:ring-2 transition-all text-base sm:text-sm min-h-[48px] touch-manipulation"
          style={{
            ...inputStyle,
            '--tw-ring-color': theme.primaryColor,
          } as React.CSSProperties}
        />
      );

    case 'long_text':
      return (
        <textarea
          placeholder={options.placeholder || 'Your answer...'}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          maxLength={options.maxLength}
          rows={options.rows || 4}
          disabled={disabled}
          className="w-full px-4 py-3.5 sm:py-3 rounded-lg border outline-none focus:ring-2 transition-all resize-none text-base sm:text-sm touch-manipulation"
          style={{
            ...inputStyle,
            '--tw-ring-color': theme.primaryColor,
          } as React.CSSProperties}
        />
      );

    case 'mcq':
      return (
        <div className="space-y-3">
          {(options.choices || []).map((choice, idx) => (
            <label 
              key={idx} 
              className="flex items-center gap-3 p-4 sm:p-3 rounded-lg border cursor-pointer transition-all hover:opacity-80 active:opacity-70 min-h-[56px] sm:min-h-[48px] touch-manipulation"
              style={{
                borderColor: (value as string) === choice ? theme.primaryColor : theme.primaryColor + '30',
                backgroundColor: (value as string) === choice ? theme.primaryColor + '15' : 'transparent',
              }}
            >
              <div 
                className="w-6 h-6 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
                style={{ 
                  borderColor: (value as string) === choice ? theme.primaryColor : theme.answerTextColor + '60',
                }}
              >
                {(value as string) === choice && (
                  <div 
                    className="w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                )}
              </div>
              <span className="text-base sm:text-sm" style={labelStyle}>{choice}</span>
              <input 
                type="radio" 
                name={question.id} 
                value={choice}
                checked={(value as string) === choice}
                onChange={() => onChange(choice)}
                disabled={disabled}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      const selectedValues = (value as string[]) || [];
      return (
        <div className="space-y-3">
          {(options.choices || []).map((choice, idx) => (
            <label 
              key={idx} 
              className="flex items-center gap-3 p-4 sm:p-3 rounded-lg border cursor-pointer transition-all hover:opacity-80 active:opacity-70 min-h-[56px] sm:min-h-[48px] touch-manipulation"
              style={{
                borderColor: selectedValues.includes(choice) ? theme.primaryColor : theme.primaryColor + '30',
                backgroundColor: selectedValues.includes(choice) ? theme.primaryColor + '15' : 'transparent',
              }}
            >
              <div 
                className="w-6 h-6 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all shrink-0"
                style={{ 
                  borderColor: selectedValues.includes(choice) ? theme.primaryColor : theme.answerTextColor + '60',
                  backgroundColor: selectedValues.includes(choice) ? theme.primaryColor : 'transparent',
                }}
              >
                {selectedValues.includes(choice) && (
                  <svg className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-base sm:text-sm" style={labelStyle}>{choice}</span>
              <input 
                type="checkbox"
                checked={selectedValues.includes(choice)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedValues, choice]);
                  } else {
                    onChange(selectedValues.filter((v) => v !== choice));
                  }
                }}
                disabled={disabled}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      );

    case 'likert':
      const scale = options.scale || 5;
      const labels = options.labels || { low: 'Strongly Disagree', high: 'Strongly Agree' };
      const currentValue = (value as number) || 0;
      
      return (
        <div className="space-y-4">
          <div className="flex justify-between text-xs sm:text-sm" style={{ color: theme.answerTextColor }}>
            <span className="text-left">{labels.low}</span>
            <span className="text-right">{labels.high}</span>
          </div>
          <div className="flex justify-between gap-2">
            {Array.from({ length: scale }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(i + 1)}
                disabled={disabled}
                className="flex-1 py-3.5 sm:py-3 rounded-lg font-medium transition-all hover:opacity-80 active:opacity-70 min-h-[48px] touch-manipulation text-base sm:text-sm"
                style={{
                  backgroundColor: currentValue === i + 1 ? theme.primaryColor : theme.primaryColor + '20',
                  color: currentValue === i + 1 ? '#fff' : theme.answerTextColor,
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      );

    case 'rating':
      const maxStars = options.maxStars || 5;
      const rating = (value as number) || 0;
      
      return (
        <div className="flex gap-3 sm:gap-2">
          {Array.from({ length: maxStars }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i + 1)}
              disabled={disabled}
              className="transition-transform hover:scale-110 active:scale-95 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center"
            >
              <Star
                className="w-10 h-10 sm:w-8 sm:h-8"
                style={{
                  fill: i < rating ? theme.accentColor : 'transparent',
                  color: i < rating ? theme.accentColor : theme.answerTextColor + '40',
                }}
              />
            </button>
          ))}
        </div>
      );

    case 'dropdown':
      return (
        <select
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3.5 sm:py-3 rounded-lg border outline-none focus:ring-2 transition-all appearance-none cursor-pointer text-base sm:text-sm min-h-[48px] touch-manipulation"
          style={{
            ...inputStyle,
            '--tw-ring-color': theme.primaryColor,
          } as React.CSSProperties}
        >
          <option value="" disabled>Select an option...</option>
          {(options.choices || []).map((choice, idx) => (
            <option key={idx} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      );

    default:
      return (
        <input
          type="text"
          placeholder="Your answer..."
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 transition-all"
          style={{
            ...inputStyle,
            '--tw-ring-color': theme.primaryColor,
          } as React.CSSProperties}
        />
      );
  }
}

// Question type icons and labels
export const questionTypeConfig = {
  short_text: {
    icon: 'Type',
    label: 'Short Text',
    description: 'Single line text input',
  },
  long_text: {
    icon: 'AlignLeft',
    label: 'Long Text',
    description: 'Multi-line text area',
  },
  mcq: {
    icon: 'CircleDot',
    label: 'Multiple Choice',
    description: 'Single selection from options',
  },
  checkbox: {
    icon: 'CheckSquare',
    label: 'Checkbox',
    description: 'Multiple selections allowed',
  },
  likert: {
    icon: 'Sliders',
    label: 'Likert Scale',
    description: 'Agreement scale (1-5 or 1-7)',
  },
  rating: {
    icon: 'Star',
    label: 'Rating',
    description: 'Star rating input',
  },
  dropdown: {
    icon: 'ChevronDown',
    label: 'Dropdown',
    description: 'Select from dropdown menu',
  },
};

export type QuestionType = keyof typeof questionTypeConfig;

