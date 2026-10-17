import { DetailScreen } from "@/components/opportunity-screens-v2";
import { opportunities } from "@/lib/opportunities";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!opportunities.some((item) => item.id === id)) notFound();
  return <DetailScreen id={id} />;
}
