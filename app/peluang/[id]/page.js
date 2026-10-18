import { DetailScreen } from "@/script/opportunity-screens-v2";
import { opportunities } from "@/script/opportunities";
import { notFound } from "next/navigation";
import "../../../style/app-peluang-detail.css";
export default async function Page({ params }) {
    const { id } = await params;
    if (!opportunities.some((item) => item.id === id))
        notFound();
    return <div className="page-peluang-detail"><DetailScreen id={id}/></div>;
}
