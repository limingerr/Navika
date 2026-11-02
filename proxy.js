import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Next.js 16 Proxy (Konvensi baru menggantikan middleware.js).
 * Memperbarui cookie sesi autentikasi Supabase secara transparan di setiap request,
 * dan menegakkan proteksi keamanan ketat untuk rute /admin/*.
 */
export async function proxy(request) {
  // 1. Proteksi ketat rute /admin/* di level server sebelum merender halaman
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("navika_admin_session")?.value;
    const hasSbCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.value);

    if (!adminSession && !hasSbCookie) {
      const loginUrl = new URL("/masuk", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return response;
  }

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refresh sesi jika sudah mendekati masa kedaluwarsa
    await supabase.auth.getUser();
  } catch (error) {
    // Jika koneksi gagal, jangan blokir request
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua rute kecuali file statis Next.js, gambar, dan aset lokal
     */
    "/((?!_next/static|_next/image|favicon.ico|asset/|dokum/|contoh desain/|export/).*)",
  ],
};
