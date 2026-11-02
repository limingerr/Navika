import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Sesi pengelola berhasil diakhiri.",
  });

  // Hapus cookie sesi admin
  response.cookies.set("navika_admin_session", "", {
    path: "/",
    maxAge: 0,
  });

  try {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch {}

  return response;
}
