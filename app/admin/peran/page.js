import { AdminRoleManagement } from "@/script/admin-screens";

export const metadata = {
  title: "Kelola Peran & Akses — Panel Admin NAVIKA",
  description: "Manajemen dan kontrol hak akses akun pengelola dan mahasiswa terdaftar di NAVIKA.",
};

export default function Page() {
  return <AdminRoleManagement />;
}
