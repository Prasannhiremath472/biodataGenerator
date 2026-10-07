import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import { Template, TemplateCategory } from '@/types/template';

export function useTemplates(categorySlug?: string) {
  return useQuery({
    queryKey: ['templates', categorySlug ?? 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: Template[] }>('/templates', {
        params: categorySlug ? { category: categorySlug } : undefined,
      });
      return data.data;
    },
  });
}

export function useTemplateCategories() {
  return useQuery({
    queryKey: ['template-categories'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: TemplateCategory[] }>('/templates/categories');
      return data.data;
    },
  });
}
