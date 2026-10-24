"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp, useTr } from "@/script/app-provider";
import { AppShell, DemoNote, Icon } from "@/script/ui";
import { normalizeGpa } from "@/script/profile";
const academicFields = [
    { key: "university", label: "Universitas", icon: "univ-profile.svg" },
    { key: "major", label: "Jurusan", icon: "jurusan-profile.svg" },
    { key: "semester", label: "Semester", icon: "kalender-profile.svg" },
    { key: "gpa", label: "IPK", icon: "ipk-profile.svg" },
];
export function ProfileScreen() {
    const { profile, locale } = useApp();
    const tr = useTr();
    const displayName = profile.name === "Pengguna Demo" || !profile.name ? tr("Mahasiswa", "Student") : profile.name;
    const initials = (profile.name || "M").split(" ").filter(Boolean).slice(0, 3).map((word) => word[0].toUpperCase()).join("");
    const fieldNames = { name: tr("Nama", "Name"), email: "Email", university: tr("Universitas", "University"), major: tr("Jurusan", "Major"), semester: tr("Semester", "Semester"), gpa: tr("IPK", "GPA") };
    return <AppShell><main className="profile-screen screen-main"><div className="profile-heading"><div><p>{tr("AKUN", "PROFILE")}</p><h1>{tr("Profil", "Profile")}</h1></div><Link className="outline-icon" href="/pengaturan" aria-label={tr("Pengaturan", "Settings")}><Icon name="setting-gerigi.svg" size={40}/></Link></div><DemoNote /><section className="profile-hero"><div className="profile-avatar">{initials}</div><h2>{displayName}</h2><p>{profile.email}</p><span>{tr("Akun Mahasiswa", "Student Account")}</span></section><h2 className="subheading">{tr("Informasi Akademik", "Academic Information")}</h2><div className="academic-list">{academicFields.map((field) => <div className="academic-item" key={field.key}><div className="academic-icon"><Icon name={field.icon}/></div><div><span>{fieldNames[field.key]}</span><strong>{field.key === "gpa" && profile.gpa ? new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(profile.gpa)) : profile[field.key] || tr("Belum diisi", "Not provided")}</strong></div></div>)}</div><Link href="/profil/edit" className="primary-button edit-profile-link">{tr("Edit Profil", "Edit Profile")}</Link></main></AppShell>;
}
function EditProfileForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isFromLogin = searchParams?.get("from") === "login";
    const { profile, updateProfile } = useApp();
    const tr = useTr();
    const [draft, setDraft] = useState(profile);
    const [error, setError] = useState("");
    useEffect(() => setDraft(profile), [profile]);
    const set = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
    const handleSubmit = (event) => {
        event.preventDefault();
        const normalized = normalizeGpa(draft.gpa);
        if (normalized === null) {
            setError(tr("IPK harus antara 0,00 dan 4,00 dengan maksimal dua desimal.", "GPA must be between 0.00 and 4.00 with at most two decimal places."));
            return;
        }
        updateProfile({ ...draft, name: (draft.name || "Mahasiswa").trim(), university: draft.university.trim(), major: draft.major.trim(), gpa: normalized });
        if (isFromLogin) {
            router.push("/dashboard");
        } else {
            router.push("/profil");
        }
    };
    const backHref = isFromLogin ? "/masuk" : "/profil";
    return <AppShell><main className="edit-screen screen-main"><Link href={backHref} className="text-back"><span className="back-icon-box" aria-hidden="true"><svg width="18" height="14" viewBox="0 0 20 15" fill="currentColor" aria-hidden="true"><path d="M7.91901 1.94806C8.02954 1.84507 8.11819 1.72087 8.17968 1.58287C8.24117 1.44487 8.27423 1.2959 8.2769 1.14485C8.27956 0.993792 8.25178 0.843748 8.19519 0.703666C8.13861 0.563583 8.05439 0.436333 7.94757 0.329505C7.84074 0.222676 7.71349 0.13846 7.57341 0.081878C7.43332 0.0252965 7.28328 -0.00249009 7.13223 0.000175084C6.98117 0.00284026 6.8322 0.0359026 6.6942 0.0973905C6.5562 0.158878 6.432 0.247532 6.32901 0.358062L0.32901 6.35806C0.118334 6.569 0 6.85494 0 7.15306C0 7.45119 0.118334 7.73712 0.32901 7.94806L6.32901 13.9481C6.432 14.0586 6.5562 14.1472 6.6942 14.2087C6.8322 14.2702 6.98117 14.3033 7.13223 14.3059C7.28328 14.3086 7.43332 14.2808 7.57341 14.2242C7.71349 14.1677 7.84074 14.0834 7.94757 13.9766C8.05439 13.8698 8.13861 13.7425 8.19519 13.6025C8.25178 13.4624 8.27956 13.3123 8.2769 13.1613C8.27423 13.0102 8.24117 12.8613 8.17968 12.7233C8.11819 12.5853 8.02954 12.4611 7.91901 12.3581L3.83901 8.27806H18.374C18.6724 8.27806 18.9585 8.15954 19.1695 7.94856C19.3805 7.73758 19.499 7.45143 19.499 7.15306C19.499 6.85469 19.3805 6.56855 19.1695 6.35757C18.9585 6.14659 18.6724 6.02806 18.374 6.02806H3.83901L7.91901 1.94806Z"/></svg></span><span>{tr("Kembali", "Back")}</span></Link><h1>{tr("Edit profil", "Edit profile")}</h1><p>{tr("Lengkapi profilmu agar informasi peluang lebih relevan.", "Complete your profile to see more relevant opportunities.")}</p><DemoNote /><form onSubmit={handleSubmit} className="profile-form"><label htmlFor="profile-name">{tr("Nama", "Name")}</label><input id="profile-name" value={draft.name || "Mahasiswa"} onChange={(e) => set("name", e.target.value)} placeholder={tr("Nama lengkap", "Full name")} required/><label htmlFor="profile-university">{tr("Universitas", "University")}</label><input id="profile-university" value={draft.university} onChange={(e) => set("university", e.target.value)} placeholder={tr("Nama universitas", "University name")}/><label htmlFor="profile-major">{tr("Jurusan", "Major")}</label><input id="profile-major" value={draft.major} onChange={(e) => set("major", e.target.value)} placeholder={tr("Pilih atau tulis jurusan", "Choose or type your major")} list="major-options"/><datalist id="major-options"><option value="Informatika"/><option value="Sistem Informasi"/><option value="Desain Komunikasi Visual (DKV)"/><option value="Manajemen"/><option value="Akuntansi"/><option value="Hukum"/><option value="Kedokteran"/><option value="Ilmu Komunikasi"/><option value="Psikologi"/><option value="Teknik Sipil"/><option value="Teknik Elektro"/><option value="Teknik Mesin"/></datalist><label htmlFor="profile-semester">{tr("Semester", "Semester")}</label><select id="profile-semester" value={draft.semester} onChange={(e) => set("semester", e.target.value)}><option value="">{tr("Pilih semester", "Choose a semester")}</option>{Array.from({ length: 8 }, (_, i) => <option key={i + 1} value={String(i + 1)}>{tr("Semester", "Semester")} {i + 1}</option>)}</select><label htmlFor="profile-gpa">{tr("IPK", "GPA")}</label><input id="profile-gpa" inputMode="decimal" value={draft.gpa} onChange={(e) => set("gpa", e.target.value)} placeholder={tr("Contoh: 3,86", "Example: 3.86")} aria-describedby="gpa-hint"/><small id="gpa-hint">{tr("Opsional, 0,00 sampai 4,00.", "Optional, from 0.00 to 4.00.")}</small>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button" type="submit">{isFromLogin ? tr("Simpan & Lanjut ke Dashboard", "Save & Continue to Dashboard") : tr("Simpan Profil", "Save Profile")}</button></form></main></AppShell>;
}
export function EditProfileScreen() {
    return (
        <Suspense fallback={null}>
            <EditProfileForm />
        </Suspense>
    );
}
