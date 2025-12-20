import { z } from 'zod';

/**
 * Client-safe environment variables schema
 * This is used in client-side code, so it only validates public variables
 * OPENAI_API_KEY is optional here because it's server-only
 */
const clientEnvSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  
  // OpenAI Configuration (optional for client-side)
  OPENAI_API_KEY: z.string().optional(),
  
  // Optional: Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

/**
 * Server-only environment variables schema
 * This includes OPENAI_API_KEY as required for server-side API routes
 */
const serverEnvSchema = clientEnvSchema.extend({
  // OpenAI Configuration (required on server)
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
});

/**
 * Validated environment variables (client-safe)
 * Throws an error if any required public environment variable is missing
 * This can be safely used in client-side code
 */
export const env = clientEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // Only include OPENAI_API_KEY if it's defined (optional for client-side)
  ...(process.env.OPENAI_API_KEY ? { OPENAI_API_KEY: process.env.OPENAI_API_KEY } : {}),
  NODE_ENV: process.env.NODE_ENV,
});

/**
 * Validates server-only environment variables
 * Use this in API routes and server-side code that requires OPENAI_API_KEY
 * @throws {z.ZodError} If OPENAI_API_KEY is missing or invalid
 */
export function validateServerEnv() {
  return serverEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });
}

/**
 * Type-safe environment variables (client-safe)
 */
export type Env = z.infer<typeof clientEnvSchema>;

/**
 * Type-safe server environment variables
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;

