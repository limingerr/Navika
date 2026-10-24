import { DetailScreen } from "@/script/opportunity-screens-v2";
import "../../../style/app-peluang-detail.css";
export default async function Page({ params }) {
    const { id } = await params;
    return <div className="page-peluang-detail"><DetailScreen id={id}/></div>;
}
