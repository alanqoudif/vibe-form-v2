"use client";

import { useAuthStore } from '@/lib/stores/auth-store';

export function useAuth() {
  const { user, isLoading, isHydrated, isInitializing } = useAuthStore();

  return {
    user,
    isLoading,
    isHydrated,
    isInitializing,
    isAuthenticated: !!user,
  };
}

