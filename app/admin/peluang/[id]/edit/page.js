import { AdminPeluangForm } from "@/script/admin-screens";

export default async function Page({ params }) {
  const { id } = await params;
  return <AdminPeluangForm mode="edit" id={id} />;
}
