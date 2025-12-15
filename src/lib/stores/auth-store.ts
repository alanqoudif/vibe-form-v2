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

// Bootstrap auth - validates session and syncs with Supabase
// Must be defined after useAuthStore to access it
let useAuthStoreRef: ReturnType<typeof create<AuthState>> | null = null;

const bootstrapAuth = async () => {
  if (bootstrapInitialized || typeof window === 'undefined' || !useAuthStoreRef) return;
  bootstrapInitialized = true;

  const supabase = getSupabaseClient();
  const { setUser, setLoading, setHydrated, setInitializing } = useAuthStoreRef.getState();

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
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.error('Auth hydration error:', error);
          }
          // After hydration from localStorage, defer bootstrap to avoid blocking main thread
          if (typeof window !== 'undefined') {
            // Mark as hydrated immediately to allow UI to render
            // Use setTimeout to ensure useAuthStore is fully initialized
            setTimeout(() => {
              if (useAuthStoreRef) {
                useAuthStoreRef.getState().setHydrated(true);
              }
            }, 0);
            
            // Defer auth bootstrap until after page is interactive
            // Use requestIdleCallback if available, otherwise use setTimeout
            const deferBootstrap = () => {
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                  bootstrapAuth();
                }, { timeout: 2000 }); // Max 2s delay
              } else {
                // Fallback for browsers without requestIdleCallback
                setTimeout(() => {
                  bootstrapAuth();
                }, 100);
              }
            };
            
            // Wait for page to be interactive before starting auth check
            if (document.readyState === 'complete') {
              deferBootstrap();
            } else {
              window.addEventListener('load', deferBootstrap, { once: true });
            }
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




