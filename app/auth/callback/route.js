import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const code = new URL(request.url).searchParams.get("code");
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

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
