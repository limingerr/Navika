import { Suspense } from "react";
import { EditProfileScreen } from "@/script/profile-screens";
import "../../../style/app-profil-edit.css";
export default function Page() {
    return (
        <div className="page-profil-edit">
            <Suspense fallback={null}>
                <EditProfileScreen />
            </Suspense>
        </div>
    );
}
