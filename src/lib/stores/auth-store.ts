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
let authStateChangeListener: ReturnType<typeof createClient>['auth']['onAuthStateChange'] | null = null;
let supabaseClient: ReturnType<typeof createClient> | null = null;

const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
};

// Bootstrap auth - validates session and syncs with Supabase
// Simplified and optimized for faster hydration
let useAuthStoreRef: typeof useAuthStore | null = null;

const bootstrapAuth = async () => {
  if (bootstrapInitialized || typeof window === 'undefined' || !useAuthStoreRef) return;
  bootstrapInitialized = true;

  const supabase = getSupabaseClient();
  const { setUser, setLoading, setInitializing } = useAuthStoreRef.getState();

  setInitializing(true);

  try {
    // Get current session from Supabase (validates against server)
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      setUser(null);
      setLoading(false);
      setInitializing(false);
      return;
    }

    if (session?.user) {
      // Fetch fresh profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile && !profileError) {
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

  // Set up auth state change listener only once
  if (!authStateChangeListener) {
    authStateChangeListener = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!useAuthStoreRef) return;
      const { setUser, clearAuth } = useAuthStoreRef.getState();

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
        // Only refresh profile on token refresh if needed (optional optimization)
        // For now, we skip to avoid unnecessary requests
      }
    });
  }
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
          
          // Mark as hydrated immediately to allow UI to render
          // This happens synchronously after localStorage rehydration
          if (typeof window !== 'undefined' && useAuthStoreRef) {
            useAuthStoreRef.getState().setHydrated(true);
            
            // Start bootstrap immediately but don't block
            // Use microtask to ensure it runs after current execution
            Promise.resolve().then(() => {
              bootstrapAuth();
            });
          }
        };
      },
    }
  )
);

// Set reference for bootstrapAuth to use
useAuthStoreRef = useAuthStore;

// For SSR safety - ensure store is initialized on client
if (typeof window !== 'undefined') {
  // Subscribe to store to trigger hydration
  useAuthStore.persist.rehydrate();
}




