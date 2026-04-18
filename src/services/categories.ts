import { supabase } from '@/lib/supabase'
import type { Category, CategoryInput } from '@/types/database'

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  if (error) throw error
  return data as Category[]
}

export async function fetchCategoriesAdmin() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data as Category[]
}

export async function upsertCategory(item: CategoryInput) {
  const { data, error } = await supabase
    .from('categories')
    .upsert(item)
    .select()
    .single()
  if (error) throw error
  return data as Category
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
