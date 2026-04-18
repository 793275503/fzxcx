import { supabase } from '@/lib/supabase'
import type { NavLink } from '@/types/database'

export async function fetchNavLinks() {
  const { data, error } = await supabase
    .from('nav_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  if (error) throw error
  return data as NavLink[]
}

export async function fetchNavLinksAdmin() {
  const { data, error } = await supabase
    .from('nav_links')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data as NavLink[]
}

export async function upsertNavLink(item: Partial<NavLink> & { label: string; href: string }) {
  const { data, error } = await supabase
    .from('nav_links')
    .upsert(item)
    .select()
    .single()
  if (error) throw error
  return data as NavLink
}

export async function deleteNavLink(id: string) {
  const { error } = await supabase.from('nav_links').delete().eq('id', id)
  if (error) throw error
}
