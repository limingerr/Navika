/**
 * NAVIKA - Otentikasi dan Validasi Hak Akses Pengelola (Admin)
 * Autentikasi kata sandi diverifikasi langsung oleh database Supabase Auth.
 */

export const SECRET_ADMIN_TOKEN = "NAV-ADM-9921-Z4";

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
  return clean === "nav-adm-9921-z4" || clean === "admin@navika.id";
}
