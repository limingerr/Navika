import { AdminLayout } from "@/src/components/admin/admin-layout";
import "../../style/app-admin.css";

export const metadata = {
  title: "NAVIKA — Panel Pengelola Konten & Admin",
  description: "Dashboard manajemen katalog peluang dan pemeliharaan data NAVIKA.",
};

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
