import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAboutContent, upsertAboutContent } from '@/services/about'
import type { AboutContent } from '@/types/database'

const DEFAULT_ABOUT: AboutContent = {
  id: '',
  section_title: '关于星耀演出服',
  subtitle_en: 'About Us',
  description: [
    '星耀演出服创立于2008年，是一家专注于演出服装定制的品牌工坊。我们秉承"为舞台而生"的理念，将传统手工技艺与舞台艺术需求完美融合。',
    '从面料甄选到版型设计，从试穿调整到最终交付，每一个环节都由资深裁缝师亲自把控。我们与国内外顶级面料商建立了长期合作关系，确保每一套演出服都拥有最上乘的材质基础。',
    '无论是舞蹈演出、合唱表演，还是话剧舞台与民族风展示，星耀都以极致的工艺标准，为演出者打造闪耀舞台的专属服饰。',
  ],
  image_url: '/images/about-atelier.png',
  stats: [
    { icon: 'Clock', value: 16, suffix: '+', label: '年舞台服饰经验' },
    { icon: 'Users', value: 8000, suffix: '+', label: '演出团体合作' },
    { icon: 'Scissors', value: 50, suffix: '+', label: '资深裁缝师' },
    { icon: 'Award', value: 98, suffix: '%', label: '客户满意度' },
  ],
  is_active: true,
  updated_at: '',
}

export function useAbout() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['about'],
    queryFn: fetchAboutContent,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
  return { about: data || DEFAULT_ABOUT, isLoading: isLoading && !error, error }
}

export function useAboutMutations() {
  const queryClient = useQueryClient()
  const upsert = useMutation({
    mutationFn: (item: Partial<AboutContent> & { id?: string }) => upsertAboutContent(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] })
    },
  })
  return { upsertAbout: upsert.mutateAsync }
}
