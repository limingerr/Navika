import { DetailScreen } from "@/src/components/opportunity-screens-v2";
import "../../../style/app-peluang-detail.css";
import "../../../style/app-opportunity-card.css";
export default async function Page({ params }) {
    const { id } = await params;
    return <div className="page-peluang-detail"><DetailScreen id={id}/></div>;
}
