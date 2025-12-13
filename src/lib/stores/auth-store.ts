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
      fetch('http://127.0.0.1:7242/ingest/f729f3fd-3ac6-4ec8-b356-dbb76d0e8cdf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-store.ts:30',message:'Auth bootstrap started',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const { setUser, setLoading } = useAuthStore.getState();
      setLoading(true);
      try {
        // #region agent log
        const getSessionStart = Date.now();
        // #endregion
        const {
          data: { session },
        } = await supabase.auth.getSession();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f729f3fd-3ac6-4ec8-b356-dbb76d0e8cdf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-store.ts:40',message:'getSession completed',data:{durationMs:Date.now()-getSessionStart,hasSession:!!session},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
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
          fetch('http://127.0.0.1:7242/ingest/f729f3fd-3ac6-4ec8-b356-dbb76d0e8cdf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-store.ts:52',message:'Profile fetch completed',data:{durationMs:Date.now()-profileStart,hasProfile:!!profile,error:error?.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
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
      fetch('http://127.0.0.1:7242/ingest/f729f3fd-3ac6-4ec8-b356-dbb76d0e8cdf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-store.ts:68',message:'Auth bootstrap completed',data:{totalDurationMs:Date.now()-authStartTime},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
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



