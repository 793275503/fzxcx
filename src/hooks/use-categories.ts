import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCategories, fetchCategoriesAdmin, upsertCategory, deleteCategory } from '@/services/categories'
import type { CategoryInput } from '@/types/database'

export function useCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
  return { categories: data || [], isLoading: isLoading && !error, error }
}

export function useCategoriesAdmin() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories-admin'],
    queryFn: fetchCategoriesAdmin,
  })
  return { categories: data || [], isLoading, error }
}

export function useCategoryMutations() {
  const queryClient = useQueryClient()
  const upsert = useMutation({
    mutationFn: (item: CategoryInput) => upsertCategory(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories-admin'] })
    },
  })
  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories-admin'] })
    },
  })
  return { upsertCategory: upsert.mutateAsync, deleteCategory: remove.mutateAsync }
}
