import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchFooterContent, upsertFooterContent } from '@/services/footer'
import type { FooterContent } from '@/types/database'

const DEFAULT_FOOTER: FooterContent = {
  id: '',
  copyright_text: `© 2008-${new Date().getFullYear()} 星耀演出服 版权所有`,
  icp_number: '',
  wechat_name: '星耀演出服',
  wechat_qr_url: '',
  wechat_description: '获取最新演出服饰定制资讯与优惠活动',
  is_active: true,
  updated_at: '',
}

export function useFooter() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['footer'],
    queryFn: fetchFooterContent,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
  return { footer: data || DEFAULT_FOOTER, isLoading: isLoading && !error, error }
}

export function useFooterMutations() {
  const queryClient = useQueryClient()
  const upsert = useMutation({
    mutationFn: (item: Partial<FooterContent> & { id?: string }) => upsertFooterContent(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer'] })
    },
  })
  return { upsertFooter: upsert.mutateAsync }
}
