import { supabase } from '@/lib/supabase'
import type { AboutContent } from '@/types/database'

export async function fetchAboutContent() {
  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .eq('is_active', true)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data as AboutContent | null
}

export async function upsertAboutContent(item: Partial<AboutContent> & { id?: string }) {
  const { data, error } = await supabase
    .from('about_content')
    .upsert(item)
    .select()
    .single()
  if (error) throw error
  return data as AboutContent
}
