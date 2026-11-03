import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/script/protected-routes";

export async function GET(request) {
  const redirectPath = safeRedirectPath(new URL(request.url).searchParams.get("redirect"));
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

  const response = NextResponse.redirect(data.url);
  if (redirectPath) response.cookies.set("navika_auth_redirect", redirectPath, {
    httpOnly: true, sameSite: "lax", secure: new URL(request.url).protocol === "https:",
    path: "/auth", maxAge: 300,
  });
  return response;
}
