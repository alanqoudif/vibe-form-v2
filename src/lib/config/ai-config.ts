/**
 * AI Model Configuration
 * Centralized configuration for OpenAI model settings
 */

export const AI_MODEL = 'gpt-5-nano-2025-08-07';

export const AI_CONFIG = {
  model: AI_MODEL,
  temperature: 0.7,
  responseFormat: { type: 'json_object' as const },
  maxTokens: 2000,
} as const;

/**
 * Default configuration for form generation
 */
export const FORM_GENERATION_CONFIG = {
  ...AI_CONFIG,
  maxTokens: 2000,
} as const;

/**
 * Default configuration for insights generation
 */
export const INSIGHTS_CONFIG = {
  ...AI_CONFIG,
  temperature: 0.7,
} as const;

