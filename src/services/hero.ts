import { supabase } from '@/lib/supabase'
import type { HeroContent } from '@/types/database'

export async function fetchHeroContent() {
  const { data, error } = await supabase
    .from('hero_content')
    .select('*')
    .eq('is_active', true)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data as HeroContent | null
}

export async function upsertHeroContent(item: Partial<HeroContent> & { id?: string }) {
  const { data, error } = await supabase
    .from('hero_content')
    .upsert(item)
    .select()
    .single()
  if (error) throw error
  return data as HeroContent
}
