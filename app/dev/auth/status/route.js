import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return Response.json({ authenticated: false, error: "Konfigurasi Supabase belum tersedia." }, { status: 503 });
  }

  const { data, error } = await supabase.auth.getUser();
  return Response.json(
    { authenticated: !error && Boolean(data.user) },
    { headers: { "Cache-Control": "no-store" } }
  );
}
