"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { Form } from '@/types/database';

export type FormWithCount = Form & { response_count?: number };

export type FormListItem = Pick<
  Form,
  'id' | 'title' | 'description' | 'status' | 'visibility' | 'created_at'
> & { response_count: number };

export const formKeys = {
  all: ['forms'] as const,
  lists: () => [...formKeys.all, 'list'] as const,
  list: (userId: string) => [...formKeys.lists(), userId] as const,
  details: () => [...formKeys.all, 'detail'] as const,
  detail: (id: string) => [...formKeys.details(), id] as const,
  recent: (userId: string, limit: number) => [...formKeys.list(userId), 'recent', limit] as const,
};

export function useForms(limit?: number) {
  // Always call hooks in the same order - never conditionally
  const { user, isHydrated } = useAuthStore();
  
  // Create supabase client outside of useQuery to ensure it's stable
  // Note: createClient() returns a singleton, so this is safe
  const supabase = createClient();

  // Use a stable userId to avoid queryKey changes that could cause hook order issues
  const userId = user?.id || '';

  // Always call useQuery - never conditionally
  return useQuery({
    queryKey: limit ? formKeys.recent(userId, limit) : formKeys.list(userId),
    queryFn: async (): Promise<FormListItem[]> => {
      if (!user || !userId) return [];

      let query = supabase
        .from('forms')
        .select(`
          id,
          title,
          description,
          status,
          visibility,
          created_at,
          responses(count)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching forms:', error);
        throw error;
      }

      return (data || []).map(form => ({
        ...form,
        response_count: (form.responses as { count: number }[])?.[0]?.count || 0,
        responses: undefined,
      })) as FormListItem[];
    },
    // Only enable when user exists AND store is hydrated to avoid unnecessary calls
    enabled: !!user && !!userId && isHydrated,
    staleTime: 2 * 60 * 1000, // 2 minutes - increased for better caching
    gcTime: 10 * 60 * 1000, // 10 minutes cache (increased from 5)
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Only refetch on reconnect
  });
}

export function useForm(formId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: formKeys.detail(formId),
    queryFn: async (): Promise<Form | null> => {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', formId)
        .single();

      if (error) {
        console.error('Error fetching form:', error);
        throw error;
      }

      return data as Form;
    },
    enabled: !!formId,
    staleTime: 2 * 60 * 1000, // 2 minutes - prevent refetching
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useDeleteForm() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (formId: string) => {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId);

      if (error) throw error;
      return formId;
    },
    onSuccess: () => {
      // Invalidate all form queries for this user
      if (user) {
        queryClient.invalidateQueries({ queryKey: formKeys.list(user.id) });
      }
    },
  });
}

export function usePublicForms(excludeUserId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['public-forms', excludeUserId],
    queryFn: async () => {
      let query = supabase
        .from('forms')
        .select(`
          *,
          responses(count),
          profiles!forms_owner_id_fkey(full_name)
        `)
        .eq('status', 'published')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      if (excludeUserId) {
        query = query.neq('owner_id', excludeUserId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching public forms:', error);
        throw error;
      }

      return (data || []).map(form => ({
        ...form,
        response_count: (form.responses as { count: number }[])?.[0]?.count || 0,
        owner_name: (form.profiles as { full_name?: string })?.full_name,
        reward: (form.settings as { reward?: number })?.reward || 10, // Default to 10 if not set
        responses: undefined,
        profiles: undefined,
      }));
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}






