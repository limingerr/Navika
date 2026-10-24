import { createBrowserClient } from "@supabase/ssr";

/**
 * Membuat Supabase Client untuk Browser (Client Components).
 * Jika environment variables belum disetel, mengembalikan null secara aman.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createBrowserClient(url, key);
}
