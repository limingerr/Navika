"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp, useTr } from "@/script/app-provider";
import { categoryLabel, demoDeadline, formatDate, isOpportunityRecommended } from "@/script/opportunities";
export function Icon({ name, size = 24, alt = "" }) {
    if (name === "search.svg")
        return <ActionIcon name="search" size={size}/>;
    if (name === "settings.jpg")
        return <ActionIcon name="sliders" size={size}/>;
    if (name === "kalender.jpg")
        return <ActionIcon name="calendar" size={size}/>;
    return <img src={`/asset/${name}`} width={size} height={size} alt={alt}/>;
}
export function ActionIcon({ name, size = 26 }) {
    const paths = {
        search: <><circle cx="11" cy="11" r="7"/><path d="m16.2 16.2 5 5"/></>,
        sliders: <><path d="M3 7h10m4 0h4M3 17h4m4 0h10"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></>,
        calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/></>,
        settings: <><path d="M10 2h4l.7 2.3 1.8.8 2.1-1.1 2.8 2.8-1.1 2.1.8 1.8 2.3.7v4l-2.3.7-.8 1.8 1.1 2.1-2.8 2.8-2.1-1.1-1.8.8L14 24h-4l-.7-2.3-1.8-.8-2.1 1.1-2.8-2.8 1.1-2.1-.8-1.8L.6 14v-4l2.3-.7.8-1.8-1.1-2.1 2.8-2.8 2.1 1.1 1.8-.8L10 2Z" transform="translate(1 -1) scale(.92)"/><circle cx="12" cy="12" r="3"/></>,
    };
    return <svg className="action-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
export function Brand() {
    const tr = useTr();
    return <Link className="brand" href="/" aria-label={tr("NAVIKA, halaman awal", "NAVIKA, home page")}><img src="/asset/Logo%20Navika.png" alt=""/><strong>NAVIKA</strong></Link>;
}
export function DemoNote() {
    return null;
}
export function MainNav() {
    const pathname = usePathname();
    const tr = useTr();
    const items = [
        {
            href: "/dashboard",
            label: tr("Home", "Home"),
            icon: "home",
            svg: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
            ),
        },
        {
            href: "/tersimpan",
            label: tr("Tersimpan", "Saved"),
            icon: "bookmark",
            svg: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                </svg>
            ),
        },
        {
            href: "/profil",
            label: tr("Profil", "Profile"),
            icon: "profile",
            svg: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            ),
        },
    ];
    return <nav className="main-nav" aria-label={tr("Navigasi utama", "Main navigation")}>{items.map((item) => {
            const active = pathname === item.href || (item.href === "/dashboard" && (pathname.startsWith("/peluang") || pathname === "/kalender")) || (item.href === "/profil" && (pathname.startsWith("/profil/") || pathname.startsWith("/pengaturan")));
            return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={active ? "active" : ""}><span className={`nav-icon nav-icon-${item.icon}`} aria-hidden="true">{item.svg}</span><span>{item.label}</span></Link>;
        })}</nav>;
}
export function AppShell({ children, className = "" }) {
    return <div className={`app-shell ${className}`}><div className="app-content">{children}</div><MainNav /></div>;
}
export function OpportunityCard({ opportunity, displayCategory }) {
    const { profile, saved, toggleSaved, locale } = useApp();
    const tr = useTr();
    const isSaved = saved.includes(opportunity.id);
    const isRecommended = isOpportunityRecommended(opportunity, profile?.major);
    const catName = displayCategory ?? opportunity.category;
    const catClass = catName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const isUrgent = opportunity.demoDays <= 3;
    return <article className="kartu-peluang opportunity-card">
    <div className="meta-atas card-badges">{isRecommended && <span className="badge badge-rekomendasi badge-blue"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5c.6 4.7 4.8 8.9 9.5 9.5-4.7.6-8.9 4.8-9.5 9.5-.6-4.7-4.8-8.9-9.5-9.5 4.7-.6 8.9-4.8 9.5-9.5Z"/></svg> {tr("REKOMENDASI", "FEATURED")}</span>}<span className={`badge kat-${catClass} badge-${catClass}`}>{categoryLabel(catName, locale)}</span><span className={`badge badge-tenggat badge-time ${isUrgent ? "mendesak badge-time-urgent" : ""}`}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v4.5l3 2"/></svg> {opportunity.demoDays} {tr("Hari", "Days")}</span></div>
    <h3 className="judul-peluang">{opportunity.title}</h3><p className="organisasi card-org"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3"/></svg> {opportunity.organization}</p>
    <div className="aksi-kartu card-actions"><button type="button" className={`simpan heart-button ${isSaved ? "tersimpan saved" : ""}`} onClick={() => toggleSaved(opportunity.id)} aria-label={`${isSaved ? tr("Hapus dari", "Remove from") : tr("Simpan ke", "Save to")} ${tr("Tersimpan", "Saved")}: ${opportunity.title}`} aria-pressed={isSaved}><svg width="26" height="26" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20.3C10 18.6 3.5 13.9 3.5 9.2a4.7 4.7 0 0 1 8.5-2.9 4.7 4.7 0 0 1 8.5 2.9c0 4.7-6.5 9.4-8.5 11.1Z"/></svg></button><Link className="tombol-detail detail-pill" href={`/peluang/${opportunity.id}`}>{tr("Cek detail", "View details")} <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor"/><path d="m8 5.8 4.2 4.2L8 14.2" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link></div>
  </article>;
}
export function OpportunityList({ items, displayCategory }) {
    return <div className="opportunity-grid">{items.map((item) => <OpportunityCard key={item.id} opportunity={item} displayCategory={displayCategory}/>)}</div>;
}
export function DeadlineLabel({ opportunity }) {
    const { locale } = useApp();
    const tr = useTr();
    return <><strong>{tr("Batas pendaftaran:", "Application deadline:")}</strong> {formatDate(demoDeadline(opportunity.demoDays), locale)}</>;
}
