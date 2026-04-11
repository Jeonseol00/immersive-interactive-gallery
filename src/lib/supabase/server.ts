import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client with service_role key.
 * ⚠️ NEVER expose this to the browser — bypasses RLS.
 * Use only in API routes and Server Components.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn("[Supabase] Missing credentials — returning null client. Fallback to mock data.");
    return null;
  }

  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
