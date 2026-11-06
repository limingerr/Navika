import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getSupabaseAdmin } from "@/src/lib/supabase/admin";
import { generateAdminSessionToken } from "@/src/lib/supabase/admin-session";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Token/email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanId = identifier.trim().toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-");
    const email = cleanId === "nav-adm-9921-z4" ? "admin@navika.id" : cleanId;

    // 1. Coba login melalui Server Supabase Client (agar session cookies otomatis terset)
    let user = null;
    const serverSupabase = await createServerClient();
    if (serverSupabase) {
      const { data, error } = await serverSupabase.auth.signInWithPassword({
        email,
        password: password.trim(),
      });
      if (!error && data?.user) {
        user = data.user;
      }
    }

    // 2. Fallback melalui Admin Service Role Client jika server client belum mengembalikan user
    if (!user) {
      const adminSupabase = getSupabaseAdmin();
      if (adminSupabase) {
        const { data, error } = await adminSupabase.auth.signInWithPassword({
          email,
          password: password.trim(),
        });
        if (error) {
          return NextResponse.json(
            { success: false, error: "Email/token atau kata sandi pengelola tidak valid." },
            { status: 401 }
          );
        }
        user = data.user;
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email/token atau kata sandi pengelola tidak valid." },
        { status: 401 }
      );
    }

    // 3. Verifikasi peran pengelola di tabel user_roles
    const adminClient = getSupabaseAdmin();
    let isPengelola = false;
    if (adminClient) {
      const { data: roleData } = await adminClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      if (roleData?.role === "pengelola") {
        isPengelola = true;
      }
    }

    if (!isPengelola && user.email !== "admin@navika.id") {
      return NextResponse.json(
        { success: false, error: "Akun ini tidak memiliki hak akses pengelola." },
        { status: 403 }
      );
    }

    // 4. Generate token sesi admin terenkripsi HMAC SHA-256
    const sessionToken = generateAdminSessionToken(user.id, user.email);

    const response = NextResponse.json({
      success: true,
      role: "admin",
      user: {
        id: user.id,
        email: user.email,
      },
    });

    // 5. Simpan ke HttpOnly secure cookie
    response.cookies.set("navika_admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 jam
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan saat memproses login." },
      { status: 500 }
    );
  }
}
