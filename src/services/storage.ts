import { supabase } from '@/lib/supabase'

export async function uploadImage(bucket: string, filePath: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true })
  if (error) throw error
  return data.path
}

export async function deleteImage(bucket: string, filePath: string) {
  const { error } = await supabase.storage.from(bucket).remove([filePath])
  if (error) throw error
}

export function getPublicUrl(bucket: string, filePath: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

export function getTransformedUrl(
  bucket: string,
  filePath: string,
  options: { width?: number; height?: number; quality?: number } = {}
) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath, {
    transform: {
      width: options.width,
      height: options.height,
      quality: options.quality || 80,
    },
  })
  return data.publicUrl
}
