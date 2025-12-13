"use client";

import { useAuthStore } from '@/lib/stores/auth-store';

export function useAuth() {
  const { user, isLoading } = useAuthStore();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
