import { AdminPeluangForm } from "@/src/components/admin/admin-opportunity-form";

export default async function Page({ params }) {
  const { id } = await params;
  return <AdminPeluangForm mode="edit" id={id} />;
}
