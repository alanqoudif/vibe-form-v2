import { z } from 'zod';

/**
 * API request validation schemas
 */

export const generateFormSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters')
    .max(1000, 'Prompt must be less than 1000 characters'),
});

export const insightsSchema = z.object({
  formId: z.string().uuid('Invalid form ID format'),
});

export const formIdSchema = z.object({
  id: z.string().uuid('Invalid form ID format'),
});

export const slugSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

