"use client";

import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/auth-store';

export function useAuth() {
  const { user, isLoading, setUser, setLoading, clearAuth } = useAuthStore();
  const supabase = createClient();

  const refreshAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
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
  }, [supabase, setUser, setLoading]);

  useEffect(() => {
    // Initial auth check
    refreshAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setUser, clearAuth, refreshAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refreshAuth,
  };
}



