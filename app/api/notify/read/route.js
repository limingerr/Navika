import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getSupabaseAdmin } from "@/src/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: null };
  if (!data?.user) return NextResponse.json({ error: "Sesi mahasiswa diperlukan." }, { status: 401 });
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Database tidak tersedia." }, { status: 503 });
  const { error } = await admin.from("in_app_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", data.user.id).is("read_at", null);
  if (error) return NextResponse.json({ error: "Notifikasi gagal ditandai sebagai dibaca." }, { status: 500 });
  return NextResponse.json({ success: true });
}
