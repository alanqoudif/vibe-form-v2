'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

const bootstrapAuth = (() => {
  let initialized = false;
  let supabaseClient: ReturnType<typeof createClient> | null = null;

  return () => {
    if (initialized || typeof window === 'undefined') return;
    initialized = true;

    if (!supabaseClient) {
      supabaseClient = createClient();
    }

    const supabase = supabaseClient;
    const refreshSession = async () => {
      // #region agent log
      const authStartTime = Date.now();
      console.log('[DEBUG-A] Auth bootstrap started', { timestamp: authStartTime });
      // #endregion
      const { setUser, setLoading, user: cachedUser } = useAuthStore.getState();
      
      // #region agent log
      console.log('[DEBUG-A] Cached user from localStorage:', { hasCachedUser: !!cachedUser, cachedUserId: cachedUser?.id });
      // #endregion
      
      // If we have a cached user, don't show loading - use optimistic approach
      if (!cachedUser) {
        setLoading(true);
      } else {
        // #region agent log
        console.log('[DEBUG-A] Using cached user, skipping loading state');
        // #endregion
        setLoading(false);
      }
      
      try {
        // #region agent log
        const getSessionStart = Date.now();
        // #endregion
        const {
          data: { session },
        } = await supabase.auth.getSession();
        // #region agent log
        console.log('[DEBUG-A] getSession completed', { durationMs: Date.now() - getSessionStart, hasSession: !!session });
        // #endregion

        if (session?.user) {
          // #region agent log
          const profileStart = Date.now();
          // #endregion
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          // #region agent log
          console.log('[DEBUG-A] Profile fetch completed', { durationMs: Date.now() - profileStart, hasProfile: !!profile, error: error?.message });
          // #endregion

          if (profile && !error) {
            setUser(profile);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth refresh error:', error);
        setUser(null);
      }
      // #region agent log
      console.log('[DEBUG-A] Auth bootstrap completed', { totalDurationMs: Date.now() - authStartTime });
      // #endregion
    };

    refreshSession();

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
})();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      clearAuth: () => set({ user: null, isLoading: false }),
    }),
    {
      name: 'vibe-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

if (typeof window !== 'undefined') {
  bootstrapAuth();
}



