import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const authorized = await isAuthorizedAdmin(request);
  if (!authorized) {
    return NextResponse.json(
      { authorized: false, error: "Akses tidak diizinkan." },
      { status: 401 }
    );
  }

  let email = "admin@navika.id";
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        email = data.user.email;
      }
    }
  } catch {}

  return NextResponse.json({
    authorized: true,
    role: "pengelola",
    email,
  });
}
