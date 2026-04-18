import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchContactInfo, fetchContactInfoAdmin, upsertContactInfo, deleteContactInfo } from '@/services/contact-info'
import type { ContactInfoItem } from '@/types/database'

export function useContactInfo() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contact-info'],
    queryFn: fetchContactInfo,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
  return { contactInfo: data || [], isLoading: isLoading && !error, error }
}

export function useContactInfoAdmin() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contact-info-admin'],
    queryFn: fetchContactInfoAdmin,
  })
  return { contactInfo: data || [], isLoading, error }
}

export function useContactInfoMutations() {
  const queryClient = useQueryClient()
  const upsert = useMutation({
    mutationFn: (item: Partial<ContactInfoItem> & { label: string; value: string }) => upsertContactInfo(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-info'] })
      queryClient.invalidateQueries({ queryKey: ['contact-info-admin'] })
    },
  })
  const remove = useMutation({
    mutationFn: deleteContactInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-info'] })
      queryClient.invalidateQueries({ queryKey: ['contact-info-admin'] })
    },
  })
  return { upsertContactInfo: upsert.mutateAsync, deleteContactInfo: remove.mutateAsync }
}
