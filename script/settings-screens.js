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
    const displayName = profile.name === "Pengguna Demo" ? tr("Pengguna Demo", "Demo User") : profile.name;
    const initials = profile.name.split(" ").filter(Boolean).slice(0, 3).map((word) => word[0].toUpperCase()).join("");
    const handleLogout = () => {
        if (!window.confirm(tr("Keluar akan menghapus seluruh data demo pada browser ini. Lanjutkan?", "Leaving will delete all demo data in this browser. Continue?")))
            return;
        clearDemo();
        router.push("/");
    };
    return <SettingsLayout title={tr("Pengaturan", "Settings")} subtitle={tr("Kelola akun dan preferensimu.", "Manage your profile and preferences.")} back="/profil"><DemoNote /><div className="settings-user"><div className="settings-avatar">{initials}</div><div><strong>{displayName}</strong><span>{tr("Data demo tersimpan di browser ini", "Demo data is stored in this browser")}</span></div></div><div className="settings-list"><SettingsRow href="/profil/edit" icon="editprofile.svg" title={tr("Edit Profil", "Edit Profile")} detail={tr("Lengkapi data akademikmu", "Complete your academic profile")}/><SettingsRow href="/pengaturan/notifikasi" icon="notif-profile.svg" title={tr("Notifikasi", "Notifications")} detail={tr("Pengingat deadline di aplikasi", "In-app deadline reminders")}/><SettingsRow href="/pengaturan/privasi" icon="privasikeamanan-profile.svg" title={tr("Privasi & Data Demo", "Privacy & Demo Data")} detail={tr("Ekspor atau hapus data lokal", "Export or delete local data")}/><SettingsRow href="/pengaturan/bahasa" icon="bahasa-profile.svg" title={tr("Bahasa", "Language")} detail={locale === "id" ? "Indonesia" : "English"}/><SettingsRow href="/pengaturan/tema" icon="tema-profile.svg" title={tr("Tema", "Theme")} detail={{ light: tr("Terang", "Light"), dark: tr("Gelap", "Dark"), system: tr("Ikut Sistem", "Follow System") }[theme]}/><SettingsRow href="/pengaturan/bantuan" icon="bantuandukungan-profile.svg" title={tr("Bantuan & Dukungan", "Help & Support")} detail={tr("Pertanyaan umum tentang demo", "Frequently asked questions")}/><SettingsRow href="/pengaturan/tentang" icon="tentangaplikasi-profile.svg" title={tr("Tentang Aplikasi", "About the App")} detail={tr("Informasi NAVIKA", "About NAVIKA")}/><button type="button" className="settings-row danger" onClick={handleLogout}><span className="settings-icon"><Icon name="keluar-profile.svg"/></span><span className="settings-row-copy"><strong>{tr("Keluar", "Leave Demo")}</strong><small>{tr("Hapus seluruh data demo", "Delete all demo data")}</small></span><span className="settings-chevron" aria-hidden="true">›</span></button></div><p className="settings-footer">NAVIKA · {tr("Dibuat untuk mahasiswa Indonesia", "Made for students in Indonesia")}</p></SettingsLayout>;
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
        anchor.download = "navika-demo-data.json";
        anchor.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    const remove = () => {
        if (!window.confirm(tr("Hapus semua data demo di browser ini? Tindakan ini tidak dapat dibatalkan.", "Delete all demo data in this browser? This cannot be undone.")))
            return;
        clearDemo();
        setMessage(tr("Data demo telah dihapus.", "Demo data has been deleted."));
    };
    return <SettingsLayout title={tr("Privasi & Data Demo", "Privacy & Demo Data")} subtitle={tr("Kendalikan data yang tersimpan di browsermu.", "Manage the data stored in your browser.")}><div className="privacy-info"><h2>{tr("Data yang disimpan", "Stored data")}</h2><p>{tr("NAVIKA menyimpan profil, bookmark, serta preferensi tema, bahasa, dan pengingat pada browser ini. Belum ada akun server atau sinkronisasi perangkat.", "NAVIKA stores your profile, bookmarks, and theme, language, and reminder preferences in this browser. There is no server account or device sync yet.")}</p><p>{tr("Kata sandi dari form demo tidak disimpan. Data tidak dikirim ke penyelenggara peluang.", "Passwords entered in demo forms are not stored. Your data is not sent to opportunity providers.")}</p></div><div className="privacy-actions"><button type="button" className="secondary-button" onClick={download}>{tr("Ekspor data JSON", "Export JSON data")}</button><button type="button" className="danger-button" onClick={remove}>{tr("Hapus data demo", "Delete demo data")}</button></div>{message && <p role="status" className="settings-hint">{message}</p>}</SettingsLayout>;
}
function LanguageScreen() {
    const { locale, setLocale } = useApp();
    const tr = useTr();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return <SettingsLayout title={tr("Bahasa", "Language")} subtitle={tr("Pilih bahasa tampilan aplikasi.", "Choose the app display language.")}><h2 className="settings-section-label">{tr("BAHASA APLIKASI", "APP LANGUAGE")}</h2><div className="settings-list"><label className="settings-row settings-choice"><span className="settings-icon"><Icon name="bahasa-profile.svg"/></span><span className="settings-row-copy"><strong>Bahasa Indonesia</strong><small>{tr("Utama", "Indonesian")}</small></span><input type="radio" name="locale" checked={locale === "id"} onChange={() => setLocale("id")}/></label><label className="settings-row settings-choice"><span className="settings-icon"><Icon name="bahasa-profile.svg"/></span><span className="settings-row-copy"><strong>English</strong><small>{tr("Inggris", "English")}</small></span><input type="radio" name="locale" checked={locale === "en"} onChange={() => setLocale("en")}/></label></div><h2 className="settings-section-label">{tr("FORMAT & WILAYAH", "FORMAT & REGION")}</h2><div className="settings-list"><div className="settings-row"><span className="settings-icon">▦</span><span className="settings-row-copy"><strong>{tr("Format Tanggal", "Date Format")}</strong><small>{formatDate(new Date(2026, 9, 17), locale)}</small></span></div><div className="settings-row"><span className="settings-icon">◷</span><span className="settings-row-copy"><strong>{tr("Zona Waktu Perangkat", "Device Time Zone")}</strong><small>{timeZone}</small></span></div><div className="settings-row"><span className="settings-icon">#</span><span className="settings-row-copy"><strong>{tr("Format Angka", "Number Format")}</strong><small>{new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", { minimumFractionDigits: 2 }).format(1000)}</small></span></div></div><p className="settings-hint">{tr("Perubahan bahasa langsung berlaku di seluruh aplikasi.", "Language changes apply throughout the app immediately.")}</p></SettingsLayout>;
}
const faqs = [
    { q: "Bagaimana cara menyimpan peluang?", a: "Tekan ikon hati pada kartu atau tombol Simpan pada detail. Peluang muncul di Tersimpan pada browser ini.", qEn: "How do I save an opportunity?", aEn: "Use the heart on a card or Save on the detail page. It will appear under Saved in this browser." },
    { q: "Bagaimana cara memantau deadline?", a: "Buka Kalender dan pilih tanggal. Tanggal demo berubah mengikuti hari ini; periksa tanggal resmi pada situs penyelenggara.", qEn: "How do I track deadlines?", aEn: "Open Calendar and select a date. Demo dates move with the current day; check official dates on the provider's site." },
    { q: "Apakah NAVIKA mengirim lamaran?", a: "Tidak. Pendaftaran dilakukan di situs resmi penyelenggara. NAVIKA hanya menyimpan peluang yang kamu tandai.", qEn: "Does NAVIKA submit applications?", aEn: "No. Apply on the provider's official site. NAVIKA only saves opportunities you bookmark." },
    { q: "Apakah data saya tersimpan di akun?", a: "Belum. Data demo tersimpan hanya di browser ini. Kamu dapat mengekspor atau menghapusnya lewat Privasi & Data Demo.", qEn: "Is my data stored in an account?", aEn: "Not yet. Demo data is stored only in this browser. You can export or delete it under Privacy & Demo Data." },
    { q: "Mengapa rekomendasi hanya contoh?", a: "Demo ini belum memiliki aturan Match lengkap atau katalog terverifikasi. Label pilihan tidak menjamin kelayakan.", qEn: "Why are recommendations examples?", aEn: "This demo does not yet have full Match rules or a verified catalog. Featured labels do not guarantee eligibility." },
];
function HelpScreen() {
    const { locale } = useApp();
    const tr = useTr();
    const [query, setQuery] = useState("");
    const matches = faqs.filter((item) => `${locale === "en" ? item.qEn : item.q} ${locale === "en" ? item.aEn : item.a}`.toLowerCase().includes(query.toLowerCase()));
    return <SettingsLayout title={tr("Bantuan & Dukungan", "Help & Support")} subtitle={tr("Temukan jawaban tentang demo NAVIKA.", "Find answers about the NAVIKA demo.")}><label className="help-search"><span className="sr-only">{tr("Cari bantuan", "Search help")}</span><Icon name="search.svg"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr("Cari bantuan...", "Search help...")}/></label><h2 className="settings-section-label">{tr("PERTANYAAN POPULER", "FREQUENT QUESTIONS")}</h2><div className="faq-list">{matches.length ? matches.map((item) => <details key={item.q}><summary>{locale === "en" ? item.qEn : item.q}</summary><p>{locale === "en" ? item.aEn : item.a}</p></details>) : <p className="settings-empty">{tr("Jawaban tidak ditemukan. Coba kata kunci lain.", "No answer found. Try another search term.")}</p>}</div><p className="settings-hint">{tr("Kontak dukungan resmi belum tersedia pada demo ini.", "Official support contact is not available in this demo yet.")}</p></SettingsLayout>;
}
function AboutScreen() {
    const tr = useTr();
    return <SettingsLayout title={tr("Tentang Aplikasi", "About the App")} subtitle={tr("Informasi tentang demo NAVIKA.", "Information about the NAVIKA demo.")}><div className="about-brand"><img src="/asset/Logo%20Navika.png" alt=""/><h2>NAVIKA</h2><p>{tr("Demo versi 0.1.0", "Demo version 0.1.0")}</p></div><div className="privacy-info"><h2>{tr("Tujuan", "Purpose")}</h2><p>{tr("NAVIKA membantu mahasiswa menjelajahi beasiswa, magang, dan bootcamp, menyimpan pilihan, serta melihat tenggat contoh.", "NAVIKA helps students explore scholarships, internships, and bootcamps, save opportunities, and see example deadlines.")}</p><h2>{tr("Teknologi", "Technology")}</h2><p>Next.js · React · JavaScript</p><p>{tr("Kode dan data saat ini adalah prototipe. Tidak ada layanan pendaftaran, autentikasi, atau dukungan resmi.", "The current code and data are a prototype. There is no application submission, authentication, or official support service.")}</p></div><p className="settings-footer">NAVIKA · {tr("Dibuat untuk mahasiswa Indonesia", "Made for students in Indonesia")}</p></SettingsLayout>;
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
