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
  const { user } = useAuthStore();
  const supabase = createClient();

  return useQuery({
    queryKey: limit ? formKeys.recent(user?.id || '', limit) : formKeys.list(user?.id || ''),
    queryFn: async (): Promise<FormListItem[]> => {
      if (!user) return [];

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
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
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
    staleTime: 60 * 1000, // 1 minute - prevent refetching
    gcTime: 10 * 60 * 1000, // 10 minutes cache
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
        reward: 10 + Math.floor(Math.random() * 20), // Simulated reward
        responses: undefined,
        profiles: undefined,
      }));
    },
    staleTime: 60 * 1000, // 1 minute
  });
}





