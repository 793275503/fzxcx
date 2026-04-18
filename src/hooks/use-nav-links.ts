import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchNavLinks, upsertNavLink, deleteNavLink } from '@/services/nav-links'
import type { NavLink } from '@/types/database'

export function useNavLinks() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['nav-links'],
    queryFn: fetchNavLinks,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
  return { navLinks: data || [], isLoading: isLoading && !error, error }
}

export function useNavLinksAdmin() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['nav-links-admin'],
    queryFn: fetchNavLinks,
  })
  return { navLinks: data || [], isLoading, error }
}

export function useNavLinkMutations() {
  const queryClient = useQueryClient()
  const upsert = useMutation({
    mutationFn: upsertNavLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nav-links'] })
      queryClient.invalidateQueries({ queryKey: ['nav-links-admin'] })
    },
  })
  const remove = useMutation({
    mutationFn: deleteNavLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nav-links'] })
      queryClient.invalidateQueries({ queryKey: ['nav-links-admin'] })
    },
  })
  return { upsertNavLink: upsert.mutateAsync, deleteNavLink: remove.mutateAsync }
}

export type { NavLink }
