"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp, useTr } from "@/components/app-provider";
import { Category, categoryLabel, demoDeadline, formatDate, Opportunity } from "@/lib/opportunities";

export function Icon({ name, size = 24, alt = "" }: { name: string; size?: number; alt?: string }) {
  if (name === "search.svg") return <ActionIcon name="search" size={size} />;
  if (name === "settings.jpg") return <ActionIcon name="sliders" size={size} />;
  if (name === "kalender.jpg") return <ActionIcon name="calendar" size={size} />;
  if (name === "setting-gerigi.svg") return <ActionIcon name="settings" size={size} />;
  return <img src={`/asset/${name}`} width={size} height={size} alt={alt} />;
}

export function ActionIcon({ name, size = 26 }: { name: "search" | "sliders" | "calendar" | "settings"; size?: number }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m16.2 16.2 5 5" /></>,
    sliders: <><path d="M3 7h10m4 0h4M3 17h4m4 0h10" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18" /></>,
    settings: <><path d="M10 2h4l.7 2.3 1.8.8 2.1-1.1 2.8 2.8-1.1 2.1.8 1.8 2.3.7v4l-2.3.7-.8 1.8 1.1 2.1-2.8 2.8-2.1-1.1-1.8.8L14 24h-4l-.7-2.3-1.8-.8-2.1 1.1-2.8-2.8 1.1-2.1-.8-1.8L.6 14v-4l2.3-.7.8-1.8-1.1-2.1 2.8-2.8 2.1 1.1 1.8-.8L10 2Z" transform="translate(1 -1) scale(.92)" /><circle cx="12" cy="12" r="3" /></>,
  };
  return <svg className="action-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function Brand() {
  const tr = useTr();
  return <Link className="brand" href="/" aria-label={tr("NAVIKA, halaman awal", "NAVIKA, home page")}><img src="/asset/Logo%20Navika.png" alt="" /><strong>NAVIKA</strong></Link>;
}

export function DemoNote() {
  const tr = useTr();
  return <p className="demo-note">{tr("Mode demo · Data dan tanggal peluang hanya contoh", "Demo mode · Opportunity data and dates are examples")}</p>;
}

export function MainNav() {
  const pathname = usePathname();
  const tr = useTr();
  const items = [
    { href: "/dashboard", label: tr("Home", "Home"), icon: "home" },
    { href: "/tersimpan", label: tr("Tersimpan", "Saved"), icon: "bookmark" },
    { href: "/profil", label: tr("Profil", "Profile"), icon: "profile" },
  ];
  return <nav className="main-nav" aria-label={tr("Navigasi utama", "Main navigation")}>{items.map((item) => {
    const active = pathname === item.href || (item.href === "/dashboard" && (pathname.startsWith("/peluang") || pathname === "/kalender")) || (item.href === "/profil" && (pathname.startsWith("/profil/") || pathname.startsWith("/pengaturan")));
    return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={active ? "active" : ""}><span className={`nav-icon nav-icon-${item.icon}`} aria-hidden="true" /><span>{item.label}</span></Link>;
  })}</nav>;
}

export function AppShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`app-shell ${className}`}><div className="app-content">{children}</div><MainNav /></div>;
}

export function OpportunityCard({ opportunity, displayCategory }: { opportunity: Opportunity; displayCategory?: Category }) {
  const { saved, toggleSaved, locale } = useApp();
  const tr = useTr();
  const isSaved = saved.includes(opportunity.id);
  return <article className="opportunity-card">
    <div className="card-badges">{opportunity.recommended && <span className="badge badge-blue">✧ {tr("REKOMENDASI", "FEATURED")}</span>}<span className={`badge badge-${(displayCategory ?? opportunity.category).toLowerCase()}`}>{categoryLabel(displayCategory ?? opportunity.category, locale)}</span><span className={`badge badge-time ${opportunity.demoDays <= 3 ? "badge-time-urgent" : ""}`}>◷ {opportunity.demoDays} {tr("Hari", "Days")}</span></div>
    <h3>{opportunity.title}</h3><p className="card-org"><Icon name="enterprise.svg" size={20} />{opportunity.organization}</p>
    <p className="card-summary">{locale === "en" ? opportunity.summaryEn : opportunity.summary}</p>
    <div className="card-actions"><button type="button" className={`heart-button ${isSaved ? "saved" : ""}`} onClick={() => toggleSaved(opportunity.id)} aria-label={`${isSaved ? tr("Hapus dari", "Remove from") : tr("Simpan ke", "Save to")} ${tr("Tersimpan", "Saved")}: ${opportunity.title}`} aria-pressed={isSaved}>{isSaved ? "♥" : "♡"}</button><Link className="detail-pill" href={`/peluang/${opportunity.id}`}>{tr("Cek detail", "View details")} <span aria-hidden="true">➜</span></Link></div>
  </article>;
}

export function OpportunityList({ items, displayCategory }: { items: Opportunity[]; displayCategory?: Category }) {
  return <div className="opportunity-grid">{items.map((item) => <OpportunityCard key={item.id} opportunity={item} displayCategory={displayCategory} />)}</div>;
}

export function DeadlineLabel({ opportunity }: { opportunity: Opportunity }) {
  const { locale } = useApp();
  const tr = useTr();
  return <><strong>{tr("Deadline demo:", "Demo deadline:")}</strong> {formatDate(demoDeadline(opportunity.demoDays), locale)}</>;
}
