import { supabase } from '@/lib/supabase'
import type { FooterContent } from '@/types/database'

export async function fetchFooterContent() {
  const { data, error } = await supabase
    .from('footer_content')
    .select('*')
    .eq('is_active', true)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data as FooterContent | null
}

export async function upsertFooterContent(item: Partial<FooterContent> & { id?: string }) {
  const { data, error } = await supabase
    .from('footer_content')
    .upsert(item)
    .select()
    .single()
  if (error) throw error
  return data as FooterContent
}
