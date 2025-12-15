'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Profile } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  isHydrated: boolean;
  isInitializing: boolean;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  setInitializing: (isInitializing: boolean) => void;
  clearAuth: () => void;
}

// Track if bootstrap has been called
let bootstrapInitialized = false;
let supabaseClient: ReturnType<typeof createClient> | null = null;

const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isHydrated: false,
      isInitializing: true,
      setUser: (user) => set({ user, isLoading: false, isInitializing: false }),
      setLoading: (isLoading) => set({ isLoading }),
      setHydrated: (isHydrated) => set({ isHydrated }),
      setInitializing: (isInitializing) => set({ isInitializing }),
      clearAuth: () => set({ user: null, isLoading: false, isInitializing: false }),
    }),
    {
      name: 'vibe-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Auth hydration error:', error);
          }
          // After hydration from localStorage, validate with Supabase immediately
          if (typeof window !== 'undefined') {
            // Start bootstrap immediately without setTimeout delay
            bootstrapAuth();
          }
        };
      },
    }
  )
);

// Bootstrap auth - validates session and syncs with Supabase
const bootstrapAuth = async () => {
  if (bootstrapInitialized || typeof window === 'undefined') return;
  bootstrapInitialized = true;

  const supabase = getSupabaseClient();
  const { setUser, setLoading, setHydrated, setInitializing } = useAuthStore.getState();

  // Mark as hydrated immediately to allow UI to render
  setHydrated(true);
  setInitializing(true);

  try {
    // Get current session from Supabase (validates against server)
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      // Fetch fresh profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile && !error) {
        setUser(profile);
      } else {
        // Session exists but profile doesn't - clear auth
        setUser(null);
      }
    } else {
      // No valid session - clear any cached user
      setUser(null);
    }
  } catch (error) {
    console.error('Auth bootstrap error:', error);
    setUser(null);
  } finally {
    setLoading(false);
    setInitializing(false);
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    const { setUser, clearAuth } = useAuthStore.getState();

    if (event === 'SIGNED_IN' && session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUser(profile);
      }
    } else if (event === 'SIGNED_OUT') {
      clearAuth();
    } else if (event === 'TOKEN_REFRESHED' && session?.user) {
      // Optionally refresh profile on token refresh
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUser(profile);
      }
    }
  });
};

// For SSR safety - ensure store is initialized on client
if (typeof window !== 'undefined') {
  // Subscribe to store to trigger hydration
  useAuthStore.persist.rehydrate();
}




