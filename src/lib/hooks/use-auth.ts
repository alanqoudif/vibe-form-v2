"use client";

import { useAuthStore } from '@/lib/stores/auth-store';

export function useAuth() {
  const { user, isLoading, isHydrated } = useAuthStore();

  return {
    user,
    isLoading,
    isHydrated,
    isAuthenticated: !!user,
  };
}

