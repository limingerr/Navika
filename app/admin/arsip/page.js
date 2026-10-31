import { AdminArsipTable } from "@/script/admin-screens";

export const metadata = {
  title: "Arsip Peluang — Panel Admin NAVIKA",
  description: "Manajemen arsip peluang, masa tenggang, dan riwayat beasiswa/magang kedaluwarsa.",
};

export default function Page() {
  return <AdminArsipTable />;
}
