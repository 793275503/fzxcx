import { useQuery } from '@tanstack/react-query'
import { fetchSiteConfig, getSiteConfigValue } from '@/services/site-config'
import type { SiteConfig } from '@/types/database'

export function useSiteConfig() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['site-config'],
    queryFn: fetchSiteConfig,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const configs = data || []
  const getValue = (key: string) => getSiteConfigValue(configs, key)

  return { configs, getValue, isLoading: isLoading && !error, error }
}

export function useSiteConfigValue(key: string) {
  const { getValue, isLoading } = useSiteConfig()
  return { value: getValue(key), isLoading }
}

export type { SiteConfig }
