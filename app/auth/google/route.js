import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const supabase = await createClient();
  if (!supabase) {
    return new Response("Konfigurasi Supabase belum tersedia.", { status: 503 });
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: new URL("/auth/callback", request.url).toString() },
  });

  if (error || !data?.url) {
    return NextResponse.redirect(new URL("/masuk?oauth=failed", request.url));
  }

  return NextResponse.redirect(data.url);
}
