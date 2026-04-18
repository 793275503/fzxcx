import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchGalleryItems, fetchGalleryItemsAdmin, fetchGalleryItem,
  upsertGalleryItem, deleteGalleryItem, toggleGalleryItem,
} from '@/services/gallery'
import type { GalleryItemInput } from '@/types/database'

export function useGallery() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['gallery'],
    queryFn: fetchGalleryItems,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
  return { items: data || [], isLoading: isLoading && !error, error }
}

export function useGalleryAdmin() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['gallery-admin'],
    queryFn: fetchGalleryItemsAdmin,
  })
  return { items: data || [], isLoading, error }
}

export function useGalleryItem(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['gallery-item', id],
    queryFn: () => fetchGalleryItem(id),
    enabled: !!id,
  })
  return { item: data, isLoading, error }
}

export function useGalleryMutations() {
  const queryClient = useQueryClient()
  const upsert = useMutation({
    mutationFn: (item: GalleryItemInput) => upsertGalleryItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      queryClient.invalidateQueries({ queryKey: ['gallery-admin'] })
    },
  })
  const remove = useMutation({
    mutationFn: deleteGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      queryClient.invalidateQueries({ queryKey: ['gallery-admin'] })
    },
  })
  const toggle = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleGalleryItem(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      queryClient.invalidateQueries({ queryKey: ['gallery-admin'] })
    },
  })
  return {
    upsertGalleryItem: upsert.mutateAsync,
    deleteGalleryItem: remove.mutateAsync,
    toggleGalleryItem: toggle.mutateAsync,
  }
}
