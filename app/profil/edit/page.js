import { Suspense } from "react";
import { EditProfileScreen } from "@/src/components/profile-screens";
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
