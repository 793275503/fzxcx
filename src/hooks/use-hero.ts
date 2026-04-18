import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchHeroContent, upsertHeroContent } from '@/services/hero'
import type { HeroContent } from '@/types/database'

const DEFAULT_HERO: HeroContent = {
  id: '',
  tagline: 'Performance Costume Since 2008',
  headline_zh: '匠心定制\n耀动舞台',
  headline_en: '',
  subheadline: '为舞台而生，为角色而制',
  cta_primary_text: '探索案例',
  cta_primary_href: '#gallery',
  cta_secondary_text: '预约咨询',
  cta_secondary_href: '#contact',
  background_url: '/images/hero-banner.png',
  is_active: true,
  updated_at: '',
}

export function useHero() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['hero'],
    queryFn: fetchHeroContent,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
  return { hero: data || DEFAULT_HERO, isLoading: isLoading && !error, error }
}

export function useHeroMutations() {
  const queryClient = useQueryClient()
  const upsert = useMutation({
    mutationFn: (item: Partial<HeroContent> & { id?: string }) => upsertHeroContent(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] })
    },
  })
  return { upsertHero: upsert.mutateAsync }
}
