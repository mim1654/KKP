import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diatur. Cek file .env kamu.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const PHOTOS_BUCKET = 'photos'

// Mengambil nama file storage dari public URL, supaya bisa dipakai
// untuk menghapus file aslinya dari storage saat foto dihapus.
export function extractStorageFileName(publicUrl) {
  const marker = `/${PHOTOS_BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return null
  return publicUrl.slice(idx + marker.length)
}
