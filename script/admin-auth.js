/**
 * NAVIKA - Otentikasi dan Validasi Hak Akses Pengelola (Admin)
 * File ini dipisahkan untuk mencegah circular dependency antara app-provider dan supabase-service.
 */

export const SECRET_ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "NAV-SEC-9842-X7";

export const adminProfile = {
  name: "Pengelola Navika",
  email: "admin@navika.id",
  university: "Pusat Pengelola Navika",
  major: "Pengelola Konten & Katalog",
  semester: "Admin",
  gpa: "4.00",
  interest: "Katalog Peluang & Pemeliharaan",
  role: "admin",
};

/**
 * Memeriksa apakah identifier cocok dengan format atau nilai admin token/ID
 */
export function isAdminIdentifier(identifier) {
  if (!identifier) return false;
  const clean = identifier.trim().toLowerCase();
  const envToken = (process.env.NEXT_PUBLIC_ADMIN_TOKEN || SECRET_ADMIN_TOKEN || "NAV-SEC-9842-X7").trim().toLowerCase();
  return clean === envToken || clean === "nav-sec-9842-x7" || clean === "admin@navika.id" || clean === "adm-navika";
}

/**
 * Memvalidasi token unik atau kredensial default admin pengelola
 */
export function verifyAdminCredentials(identifier, password) {
  if (!identifier || !password) return false;
  const cleanId = identifier.trim().toLowerCase();
  const envToken = (process.env.NEXT_PUBLIC_ADMIN_TOKEN || SECRET_ADMIN_TOKEN || "NAV-SEC-9842-X7").trim().toLowerCase();
  const envPass = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "NavikaAdmin2026!").trim();
  const cleanPass = password.trim();

  // 1. Verifikasi kredensial token unik
  if ((cleanId === envToken || cleanId === "nav-sec-9842-x7") && (cleanPass === envPass || cleanPass === "NavikaAdmin2026!")) {
    return true;
  }
  // 2. Verifikasi email/ID pengelola standar
  if ((cleanId === "admin@navika.id" || cleanId === "adm-navika") && (cleanPass === "admin123" || cleanPass === envPass || cleanPass === "NavikaAdmin2026!")) {
    return true;
  }
  return false;
}
