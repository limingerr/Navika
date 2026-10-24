"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, useTr } from "@/script/app-provider";
import { DemoNote, Icon } from "@/script/ui";
import { demoDeadline, demoReminders, formatDate } from "@/script/opportunities";
function SettingsLayout({ title, subtitle, children, back = "/pengaturan" }) {
    const tr = useTr();
    return <main className="settings-page"><div className="settings-inner"><Link className="settings-back" href={back}><span aria-hidden="true">←</span>{tr("Kembali", "Back")}</Link><header className="settings-heading"><h1>{title}</h1><p>{subtitle}</p></header>{children}</div></main>;
}
function SettingsRow({ href, icon, title, detail, danger = false }) {
    return <Link href={href} className={`settings-row ${danger ? "danger" : ""}`}><span className="settings-icon"><Icon name={icon}/></span><span className="settings-row-copy"><strong>{title}</strong>{detail && <small>{detail}</small>}</span><span className="settings-chevron" aria-hidden="true">›</span></Link>;
}
export function SettingsScreen() {
    const router = useRouter();
    const { profile, locale, theme, clearDemo } = useApp();
    const tr = useTr();
    const displayName = profile.name === "Pengguna Demo" || !profile.name ? tr("Mahasiswa", "Student") : profile.name;
    const initials = (profile.name || "M").split(" ").filter(Boolean).slice(0, 3).map((word) => word[0].toUpperCase()).join("");
    const handleLogout = () => {
        if (!window.confirm(tr("Apakah Anda yakin ingin keluar dari akun?", "Are you sure you want to sign out?")))
            return;
        clearDemo();
        router.push("/");
    };
    return <SettingsLayout title={tr("Pengaturan", "Settings")} subtitle={tr("Kelola akun dan preferensimu.", "Manage your profile and preferences.")} back="/profil">
        <DemoNote />
        <div className="settings-user">
            <div className="settings-avatar">{initials}</div>
            <div>
                <strong>{displayName}</strong>
                <span>{tr("Akun Mahasiswa Aktif", "Active Student Account")}</span>
            </div>
        </div>
        <div className="settings-list">
            <SettingsRow href="/profil/edit" icon="editprofile.svg" title={tr("Edit Profil", "Edit Profile")} detail={tr("Lengkapi data akademikmu", "Complete your academic profile")} />
            <SettingsRow href="/pengaturan/notifikasi" icon="notif-profile.svg" title={tr("Notifikasi", "Notifications")} detail={tr("Pengingat deadline di aplikasi", "In-app deadline reminders")} />
            <SettingsRow href="/pengaturan/privasi" icon="privasikeamanan-profile.svg" title={tr("Privasi & Keamanan", "Privacy & Security")} detail={tr("Kelola data akun dan preferensi", "Manage data and preferences")} />
            <SettingsRow href="/pengaturan/bahasa" icon="bahasa-profile.svg" title={tr("Bahasa", "Language")} detail={locale === "id" ? "Indonesia" : "English"} />
            <SettingsRow href="/pengaturan/tema" icon="tema-profile.svg" title={tr("Tema", "Theme")} detail={{ light: tr("Terang", "Light"), dark: tr("Gelap", "Dark"), system: tr("Ikut Sistem", "Follow System") }[theme]} />
            <SettingsRow href="/pengaturan/bantuan" icon="bantuandukungan-profile.svg" title={tr("Bantuan & Dukungan", "Help & Support")} detail={tr("Pertanyaan umum dan panduan", "Frequently asked questions")} />
            <SettingsRow href="/pengaturan/tentang" icon="tentangaplikasi-profile.svg" title={tr("Tentang Aplikasi", "About the App")} detail={tr("Informasi NAVIKA", "About NAVIKA")} />
            <SettingsRow href="/admin" icon="setting-gerigi.svg" title={tr("Panel Admin", "Admin Panel")} detail={tr("Kelola katalog peluang & pemeliharaan data", "Manage opportunity catalog & data")} />
            <button type="button" className="settings-row danger" onClick={handleLogout}>
                <span className="settings-icon"><Icon name="keluar-profile.svg" /></span>
                <span className="settings-row-copy">
                    <strong>{tr("Keluar", "Sign Out")}</strong>
                    <small>{tr("Keluar dari sesi akun saat ini", "Sign out of current session")}</small>
                </span>
                <span className="settings-chevron" aria-hidden="true">›</span>
            </button>
        </div>
        <p className="settings-footer">NAVIKA · {tr("Dibuat untuk mahasiswa Indonesia", "Made for students in Indonesia")}</p>
    </SettingsLayout>;
}
function ThemeScreen() {
    const { theme, setTheme } = useApp();
    const tr = useTr();
    const options = [
        { value: "light", title: tr("Terang", "Light"), detail: tr("Selalu gunakan tema terang", "Always use the light theme"), icon: "terang-tema.svg" },
        { value: "dark", title: tr("Gelap", "Dark"), detail: tr("Selalu gunakan tema gelap", "Always use the dark theme"), icon: "gelap-tema.svg" },
        { value: "system", title: tr("Ikut Sistem", "Follow System"), detail: tr("Ikuti pengaturan perangkat", "Follow your device setting"), icon: "ikutsistem-tema.svg" },
    ];
    return <SettingsLayout title={tr("Tampilan", "Appearance")} subtitle={tr("Pilih mode warna aplikasi", "Choose the app color mode")}>
    <h2 className="settings-section-label">{tr("MODE WARNA", "COLOR MODE")}</h2>
    <div className="settings-list">{options.map((option) => <label className="settings-row settings-choice" key={option.value}><span className="settings-icon"><Icon name={option.icon} size={42}/></span><span className="settings-row-copy"><strong>{option.title}</strong><small>{option.detail}</small></span><input type="radio" name="theme" value={option.value} checked={theme === option.value} onChange={() => setTheme(option.value)}/></label>)}</div>
    <h2 className="settings-section-label"><span className="preview-label-dark">{tr("PRATINJAU MODE GELAP", "DARK MODE PREVIEW")}</span><span className="preview-label-light">{tr("PRATINJAU MODE TERANG", "LIGHT MODE PREVIEW")}</span></h2>
    <div className="theme-preview">
      <div className="card-badges"><span className="badge badge-blue">✧ {tr("REKOMENDASI", "FEATURED")}</span><span className="badge badge-beasiswa">{tr("Beasiswa", "Scholarship")}</span><span className="badge badge-time badge-time-urgent">◷ 2 {tr("Hari", "Days")}</span></div>
      <h3>Beasiswa KIP Kuliah</h3>
      <p className="card-org"><Icon name="enterprise.svg" size={20}/> Kemendikbudristek RI</p>
      <div className="card-actions"><span className="preview-heart" aria-hidden="true">♡</span><span className="detail-pill">{tr("Cek detail", "View details")} <span aria-hidden="true">➜</span></span></div>
    </div>
    <p className="settings-hint">{tr("Pilihan tema berlaku di seluruh halaman dan tersimpan di browser.", "Your theme applies throughout the app and is saved in this browser.")}</p>
  </SettingsLayout>;
}
function NotificationsScreen() {
    const { deadlineAlerts, setDeadlineAlerts, saved, locale } = useApp();
    const tr = useTr();
    const reminders = demoReminders(saved);
    return <SettingsLayout title={tr("Notifikasi", "Notifications")} subtitle={tr("Atur pengingat peluang di aplikasi.", "Manage in-app opportunity reminders.")}><DemoNote /><div className="settings-list"><label className="settings-row settings-choice"><span className="settings-icon"><Icon name="notif-profile.svg"/></span><span className="settings-row-copy"><strong>{tr("Deadline Terdekat", "Upcoming Deadlines")}</strong><small>{tr("Tampilkan pengingat mulai H-3", "Show reminders from three days before the deadline")}</small></span><input type="checkbox" role="switch" checked={deadlineAlerts} onChange={(event) => setDeadlineAlerts(event.target.checked)}/></label></div><h2 className="settings-section-label">{tr("PENGINGAT SAAT INI", "CURRENT REMINDERS")}</h2>{deadlineAlerts && reminders.length ? <ul className="reminder-list">{reminders.map((item) => <li key={item.id}><Link href={`/peluang/${item.id}`}>{item.title}</Link><span>{formatDate(demoDeadline(item.demoDays), locale)}</span></li>)}</ul> : <p className="settings-empty">{tr("Tidak ada pengingat aktif saat ini.", "There are no active reminders right now.")}</p>}<p className="settings-hint">{tr("Pengingat hanya tampil di aplikasi. NAVIKA belum mengirim email atau push.", "Reminders appear only in the app. NAVIKA does not send email or push notifications yet.")}</p></SettingsLayout>;
}
function PrivacyScreen() {
    const { profile, saved, locale, theme, deadlineAlerts, clearDemo } = useApp();
    const tr = useTr();
    const [message, setMessage] = useState("");
    const download = () => {
        const content = JSON.stringify({ profile, saved, preferences: { locale, theme, deadlineAlerts } }, null, 2);
        const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "navika-user-data.json";
        anchor.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    const remove = () => {
        if (!window.confirm(tr("Hapus seluruh data akun lokal? Tindakan ini akan mereset data Anda.", "Delete all local account data? This will reset your data.")))
            return;
        clearDemo();
        setMessage(tr("Data akun berhasil dibersihkan.", "Account data has been reset."));
    };
    return <SettingsLayout title={tr("Privasi & Keamanan", "Privacy & Security")} subtitle={tr("Kendalikan data dan preferensi akun Anda.", "Manage your account data and preferences.")}><div className="privacy-info"><h2>{tr("Data yang disimpan", "Stored data")}</h2><p>{tr("NAVIKA menyimpan profil akademik, bookmark peluang, serta preferensi tema, bahasa, dan pengingat untuk kenyamanan Anda.", "NAVIKA stores your academic profile, bookmarks, and preferences for your convenience.")}</p><p>{tr("Data pribadi Anda terlindungi dan tidak dialihkan ke pihak ketiga tanpa persetujuan.", "Your personal data is protected and never shared with third parties without consent.")}</p></div><div className="privacy-actions"><button type="button" className="secondary-button" onClick={download}>{tr("Ekspor data JSON", "Export JSON data")}</button><button type="button" className="danger-button" onClick={remove}>{tr("Reset data akun", "Reset account data")}</button></div>{message && <p role="status" className="settings-hint">{message}</p>}</SettingsLayout>;
}
function LanguageScreen() {
    const { locale, setLocale } = useApp();
    const tr = useTr();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return <SettingsLayout title={tr("Bahasa", "Language")} subtitle={tr("Pilih bahasa tampilan aplikasi.", "Choose the app display language.")}><h2 className="settings-section-label">{tr("BAHASA APLIKASI", "APP LANGUAGE")}</h2><div className="settings-list"><label className="settings-row settings-choice"><span className="settings-icon"><Icon name="bahasa-profile.svg"/></span><span className="settings-row-copy"><strong>Bahasa Indonesia</strong><small>{tr("Utama", "Indonesian")}</small></span><input type="radio" name="locale" checked={locale === "id"} onChange={() => setLocale("id")}/></label><label className="settings-row settings-choice"><span className="settings-icon"><Icon name="bahasa-profile.svg"/></span><span className="settings-row-copy"><strong>English</strong><small>{tr("Inggris", "English")}</small></span><input type="radio" name="locale" checked={locale === "en"} onChange={() => setLocale("en")}/></label></div><h2 className="settings-section-label">{tr("FORMAT & WILAYAH", "FORMAT & REGION")}</h2><div className="settings-list"><div className="settings-row"><span className="settings-icon">▦</span><span className="settings-row-copy"><strong>{tr("Format Tanggal", "Date Format")}</strong><small>{formatDate(new Date(2026, 9, 17), locale)}</small></span></div><div className="settings-row"><span className="settings-icon">◷</span><span className="settings-row-copy"><strong>{tr("Zona Waktu Perangkat", "Device Time Zone")}</strong><small>{timeZone}</small></span></div><div className="settings-row"><span className="settings-icon">#</span><span className="settings-row-copy"><strong>{tr("Format Angka", "Number Format")}</strong><small>{new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", { minimumFractionDigits: 2 }).format(1000)}</small></span></div></div><p className="settings-hint">{tr("Perubahan bahasa langsung berlaku di seluruh aplikasi.", "Language changes apply throughout the app immediately.")}</p></SettingsLayout>;
}
const faqs = [
    { q: "Bagaimana cara menyimpan peluang?", a: "Tekan ikon hati pada kartu atau tombol Simpan pada detail. Peluang akan muncul di halaman Tersimpan.", qEn: "How do I save an opportunity?", aEn: "Use the heart icon on a card or Save button on the detail page. It will appear under Saved." },
    { q: "Bagaimana cara memantau deadline?", a: "Buka menu Kalender untuk melihat agenda batas pendaftaran dan tahapan seleksi berdasarkan tanggal.", qEn: "How do I track deadlines?", aEn: "Open Calendar to view application deadlines and stages by date." },
    { q: "Apakah NAVIKA mengirim lamaran?", a: "Tidak. Pendaftaran dilakukan langsung pada situs resmi penyelenggara. NAVIKA membantu menyimpan dan memantau program yang kamu minati.", qEn: "Does NAVIKA submit applications?", aEn: "No. Apply directly on the provider's official site. NAVIKA helps you track and organize your opportunities." },
    { q: "Bagaimana rekomendasi peluang ditentukan?", a: "Rekomendasi disesuaikan secara otomatis berdasarkan kecocokan jurusan dan semester di profil akademikmu.", qEn: "How are recommendations determined?", aEn: "Recommendations are automatically matched with your major and academic profile." },
];
function HelpScreen() {
    const { locale } = useApp();
    const tr = useTr();
    const [query, setQuery] = useState("");
    const matches = faqs.filter((item) => `${locale === "en" ? item.qEn : item.q} ${locale === "en" ? item.aEn : item.a}`.toLowerCase().includes(query.toLowerCase()));
    return <SettingsLayout title={tr("Bantuan & Dukungan", "Help & Support")} subtitle={tr("Temukan jawaban seputar penggunaan NAVIKA.", "Find answers about using NAVIKA.")}><label className="help-search"><span className="sr-only">{tr("Cari bantuan", "Search help")}</span><Icon name="search.svg"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr("Cari bantuan...", "Search help...")}/></label><h2 className="settings-section-label">{tr("PERTANYAAN POPULER", "FREQUENT QUESTIONS")}</h2><div className="faq-list">{matches.length ? matches.map((item) => <details key={item.q}><summary>{locale === "en" ? item.qEn : item.q}</summary><p>{locale === "en" ? item.aEn : item.a}</p></details>) : <p className="settings-empty">{tr("Jawaban tidak ditemukan. Coba kata kunci lain.", "No answer found. Try another search term.")}</p>}</div></SettingsLayout>;
}
function AboutScreen() {
    const tr = useTr();
    return <SettingsLayout title={tr("Tentang Aplikasi", "About the App")} subtitle={tr("Informasi tentang platform NAVIKA.", "Information about NAVIKA platform.")}><div className="about-brand"><img src="/asset/Logo%20Navika.png" alt=""/><h2>NAVIKA</h2><p>{tr("Versi 1.0.0", "Version 1.0.0")}</p></div><div className="privacy-info"><h2>{tr("Tujuan", "Purpose")}</h2><p>{tr("NAVIKA membantu mahasiswa Indonesia menjelajahi beasiswa, magang, dan bootcamp, menyimpan pilihan, serta memantau tenggat pendaftaran secara terpusat.", "NAVIKA helps Indonesian students explore scholarships, internships, and bootcamps, save opportunities, and track deadlines in one place.")}</p><h2>{tr("Teknologi", "Technology")}</h2><p>Next.js 16 · React 19 · Plain CSS</p><p>{tr("Platform ini dibangun dengan standar aksesibilitas tinggi dan arsitektur web modern yang responsif di seluruh perangkat.", "Built with high accessibility standards and modern responsive web architecture.")}</p></div><p className="settings-footer">NAVIKA · {tr("Dibuat untuk mahasiswa Indonesia", "Made for students in Indonesia")}</p></SettingsLayout>;
}
export function SettingsSectionScreen({ section }) {
    switch (section) {
        case "tema": return <ThemeScreen />;
        case "notifikasi": return <NotificationsScreen />;
        case "privasi": return <PrivacyScreen />;
        case "bahasa": return <LanguageScreen />;
        case "bantuan": return <HelpScreen />;
        case "tentang": return <AboutScreen />;
    }
}
