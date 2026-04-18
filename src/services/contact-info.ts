import { supabase } from '@/lib/supabase'
import type { ContactInfoItem } from '@/types/database'

export async function fetchContactInfo() {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  if (error) throw error
  return data as ContactInfoItem[]
}

export async function fetchContactInfoAdmin() {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data as ContactInfoItem[]
}

export async function upsertContactInfo(item: Partial<ContactInfoItem> & { label: string; value: string }) {
  const { data, error } = await supabase
    .from('contact_info')
    .upsert(item)
    .select()
    .single()
  if (error) throw error
  return data as ContactInfoItem
}

export async function deleteContactInfo(id: string) {
  const { error } = await supabase.from('contact_info').delete().eq('id', id)
  if (error) throw error
}
