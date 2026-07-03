import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * False until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are provided.
 * The app falls back to the read-only legacy API so browsing keeps working,
 * but sign-in and submissions require Supabase to be configured.
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    )
  }
  if (!client) {
    client = createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // SPA-only app — no OAuth redirects to parse
        detectSessionInUrl: false,
      },
    })
  }
  return client
}
