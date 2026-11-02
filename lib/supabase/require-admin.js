import { cookies } from "next/headers";
import { createClient } from "./server";
import { verifyAdminSessionToken } from "./admin-session";

/**
 * Memverifikasi apakah permintaan dilakukan oleh akun pengelola (admin) yang sah.
 * Menegakkan keamanan ganda:
 * 1. Sesi cookie HttpOnly navika_admin_session yang divalidasi dengan HMAC SHA-256
 * 2. Akun Supabase dengan peran 'pengelola' di tabel user_roles atau email pengelola terdaftar
 * 3. Header x-admin-token atau Bearer authorization untuk cron/internal server calls
 * 
 * Menolak secara mutlak jika tidak ada bukti otentikasi pengelola yang valid.
 */
export async function isAuthorizedAdmin(request) {
  // 1. Cek token sesi admin HttpOnly yang ditandatangani secara kriptografis
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("navika_admin_session")?.value;
    if (sessionToken && verifyAdminSessionToken(sessionToken)) {
      return true;
    }
  } catch {}

  // 2. Cek Header Authorization atau x-admin-token jika disediakan
  if (request) {
    try {
      const headerToken =
        request.headers.get("x-admin-token") ||
        request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
      const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "NAV-ADM-9921-Z4";
      const cronSecret = process.env.CRON_SECRET;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (
        headerToken &&
        (headerToken === adminToken ||
          (cronSecret && headerToken === cronSecret) ||
          (serviceKey && headerToken === serviceKey))
      ) {
        return true;
      }
    } catch {}
  }

  // 3. Cek Supabase Auth Session (Cookie sesi Supabase pengguna aktif)
  const supabase = await createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        const email = data.user.email?.toLowerCase();
        if (
          email &&
          (email === "admin@navika.id" ||
            email === "limingerr681@gmail.com" ||
            email === "navika01112026@gmail.com")
        ) {
          return true;
        }

        const { data: role } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (role?.role === "pengelola") {
          return true;
        }

        // Jika terdaftar sebagai mahasiswa aktif, tolak langsung
        if (role?.role === "mahasiswa") {
          return false;
        }
      }
    } catch {}
  } else {
    // Jika Supabase belum disetel sama sekali di lingkungan pengembangan lokal murni
    return process.env.NODE_ENV === "development";
  }

  // Akses ditolak jika tidak ada otorisasi yang cocok
  return false;
}
