import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { env } from '@/lib/env'

// Singleton instance to prevent memory leaks
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return supabaseClient;
}
















