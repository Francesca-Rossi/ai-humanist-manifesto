import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  const config = useRuntimeConfig()
  return createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL!,
    config.supabaseServiceRoleKey
  )
}