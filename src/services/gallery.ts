import { supabase } from '@/lib/supabase'
import type { GalleryItem, GalleryItemInput } from '@/types/database'

export async function fetchGalleryItems() {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*, categories(*)')
    .eq('is_active', true)
    .order('sort_order')
  if (error) throw error
  return data as GalleryItem[]
}

export async function fetchGalleryItemsAdmin() {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*, categories(*)')
    .order('sort_order')
  if (error) throw error
  return data as GalleryItem[]
}

export async function fetchGalleryItem(id: string) {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*, categories(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as GalleryItem
}

export async function upsertGalleryItem(item: GalleryItemInput) {
  const { data, error } = await supabase
    .from('gallery_items')
    .upsert(item)
    .select()
    .single()
  if (error) throw error
  return data as GalleryItem
}

export async function deleteGalleryItem(id: string) {
  const { error } = await supabase.from('gallery_items').delete().eq('id', id)
  if (error) throw error
}

export async function toggleGalleryItem(id: string, isActive: boolean) {
  const { data, error } = await supabase
    .from('gallery_items')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as GalleryItem
}
