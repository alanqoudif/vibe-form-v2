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
      const { setUser, setLoading, user: cachedUser } = useAuthStore.getState();
      
      // If we have a cached user, don't show loading - use optimistic approach
      if (!cachedUser) {
        setLoading(true);
      } else {
        setLoading(false);
      }
      
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

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




