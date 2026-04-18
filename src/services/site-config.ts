import { supabase } from '@/lib/supabase'
import type { SiteConfig } from '@/types/database'

export async function fetchSiteConfig() {
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .order('key')
  if (error) throw error
  return data as SiteConfig[]
}

export async function fetchSiteConfigByGroup(group: string) {
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .eq('config_group', group)
    .order('key')
  if (error) throw error
  return data as SiteConfig[]
}

export async function upsertSiteConfig(item: Partial<SiteConfig> & { key: string }) {
  const { data, error } = await supabase
    .from('site_config')
    .upsert(item, { onConflict: 'key' })
    .select()
    .single()
  if (error) throw error
  return data as SiteConfig
}

export function getSiteConfigValue(configs: SiteConfig[], key: string): string {
  const item = configs.find(c => c.key === key)
  return item ? String(item.value) : ''
}
