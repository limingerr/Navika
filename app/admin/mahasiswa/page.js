import { AdminMahasiswaTable } from "@/src/components/admin/admin-student-table";

export const metadata = {
  title: "Kelola Mahasiswa — Panel Admin NAVIKA",
  description: "Manajemen dan kontrol akun pengguna mahasiswa terdaftar di NAVIKA.",
};

export default function Page() {
  return <AdminMahasiswaTable />;
}
