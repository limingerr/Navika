import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { safeRedirectPath } from "@/src/lib/protected-routes";

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const code = params.get("code");
  const redirectPath = safeRedirectPath(request.cookies.get("navika_auth_redirect")?.value);
  if (!code) {
    return NextResponse.redirect(new URL("/masuk?oauth=failed", request.url));
  }

  const supabase = await createClient();
  if (!supabase) {
    return new Response("Konfigurasi Supabase belum tersedia.", { status: 503 });
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data?.user) {
    return NextResponse.redirect(new URL("/masuk?oauth=failed", request.url));
  }

  const metadataName = data.user.user_metadata?.full_name || data.user.user_metadata?.name;
  const name = typeof metadataName === "string" && metadataName.trim()
    ? metadataName.trim()
    : data.user.email?.split("@")[0] || "Mahasiswa";
  const { error: profileError } = await supabase.from("profiles").upsert({
    user_id: data.user.id,
    name,
    university: "",
    major: "",
    semester: 1,
    gpa: null,
    interests: [],
  }, { onConflict: "user_id", ignoreDuplicates: true });

  if (profileError) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/masuk?oauth=failed", request.url));
  }

  const response = NextResponse.redirect(new URL(redirectPath || "/dashboard", request.url));
  response.cookies.set("navika_auth_redirect", "", { path: "/auth", maxAge: 0 });
  return response;
}
