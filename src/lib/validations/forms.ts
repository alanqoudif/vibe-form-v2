import { z } from 'zod';

/**
 * Form data validation schemas
 */

export const questionTypeSchema = z.enum([
  'short_text',
  'long_text',
  'mcq',
  'checkbox',
  'likert',
  'rating',
  'dropdown',
]);

export const questionOptionsSchema = z.object({
  // For short_text and long_text
  placeholder: z.string().optional(),
  maxLength: z.number().int().positive().optional(),
  rows: z.number().int().positive().optional(), // For long_text

  // For mcq, checkbox, dropdown
  choices: z.array(z.string().min(1)).optional(),
  minSelect: z.number().int().nonnegative().optional(), // For checkbox
  maxSelect: z.number().int().positive().optional(), // For checkbox

  // For likert
  scale: z.enum(['5', '7']).optional(),
  labels: z.object({
    low: z.string(),
    high: z.string(),
  }).optional(),

  // For rating
  maxStars: z.enum(['5', '10']).optional(),
}).passthrough(); // Allow additional properties

export const questionSchema = z.object({
  type: questionTypeSchema,
  title: z.string().min(1, 'Question title is required').max(500),
  description: z.string().max(1000).optional(),
  required: z.boolean().default(true),
  options: questionOptionsSchema.optional(),
});

export const formSchema = z.object({
  title: z.string().min(1, 'Form title is required').max(200),
  description: z.string().max(1000).optional(),
  category: z.enum(['research', 'feedback', 'registration', 'assessment', 'survey', 'other']).optional(),
  questions: z.array(questionSchema).min(1, 'At least one question is required').max(100),
  estimated_time: z.number().int().positive().max(120).optional(),
  difficulty: z.number().int().min(1).max(10).optional(),
});

