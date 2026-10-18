"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp, useTr } from "@/script/app-provider";
import { AppShell, DeadlineLabel, DemoNote, Icon, OpportunityCard, OpportunityList } from "@/script/ui";
import { calendarFilterLabel, calendarFilters, categories, categoryLabel, demoDeadline, demoReminders, fieldLabel, filterCalendarOpportunities, formatDate, hasCategory, isOpportunityRecommended, opportunities } from "@/script/opportunities";
function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dayDots(date, items) {
    return Array.from(new Set(items.filter((item) => sameDay(demoDeadline(item.demoDays), date)).map((item) => item.category)));
}
function CalendarChips() {
    const { calendarFilter, setCalendarFilter, locale, profile } = useApp();
    const tr = useTr();
    const onWheel = (e) => {
        if (e.deltaY !== 0 && !e.deltaX) {
            e.currentTarget.scrollLeft += e.deltaY;
        }
    };
    return <div className="calendar-chips" role="group" aria-label={tr("Filter agenda", "Agenda filters")} onWheel={onWheel}>
    {calendarFilters.map((filter) => {
        const chipClass = filter.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
        const isSelected = calendarFilter === filter;
        const label = filter === "Rekomendasi" ? `✧ ${calendarFilterLabel(filter, locale)}` : calendarFilterLabel(filter, locale);
        return <button key={filter} type="button" className={`calendar-chip chip-${chipClass}` + (isSelected ? " selected" : "")} aria-pressed={isSelected} onClick={() => setCalendarFilter(filter)}>{label}</button>;
    })}
  </div>;
}
function CategoryTabs({ selected, onSelect }) {
    const { locale } = useApp();
    const tr = useTr();
    return <div className="category-tabs" role="group" aria-label={tr("Kategori peluang", "Opportunity categories")}>{categories.map((item) => <button key={item} type="button" className={selected === item ? "selected" : ""} aria-pressed={selected === item} onClick={() => onSelect(item)}>{categoryLabel(item, locale)}</button>)}</div>;
}
export function DashboardScreen() {
    const { profile, saved, locale, calendarFilter, deadlineAlerts } = useApp();
    const tr = useTr();
    const [weekOffset, setWeekOffset] = useState(0);
    const [selected, setSelected] = useState(new Date());
    const today = new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + weekOffset * 7);
    const days = Array.from({ length: 7 }, (_, i) => new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i));
    const filtered = filterCalendarOpportunities(calendarFilter, saved, today, profile);
    const events = filtered.filter((item) => sameDay(demoDeadline(item.demoDays), selected));
    const reminders = deadlineAlerts ? demoReminders(saved) : [];
    const displayName = profile.name === "Pengguna Demo" ? tr("Pengguna Demo", "Demo User") : profile.name.split(" ")[0];
    const shiftWeek = (amount) => {
        setWeekOffset((current) => current + amount);
        setSelected((current) => new Date(current.getFullYear(), current.getMonth(), current.getDate() + amount * 7));
    };
    const recommendedList = useMemo(() => {
        const matches = opportunities.filter((item) => isOpportunityRecommended(item, profile.major));
        const others = opportunities.filter((item) => !matches.includes(item));
        return [...matches, ...others].slice(0, 6);
    }, [profile.major]);
    return <AppShell>
    <header className="top-header dashboard-header"><div className="greeting"><div className="avatar-small">{displayName.slice(0, 1).toUpperCase()}</div><div><span>{tr("Hai,", "Hi,")}</span><h1>{displayName}</h1></div></div><Link className="icon-link" href="/peluang" aria-label={tr("Cari peluang", "Search opportunities")}><Icon name="search.svg"/></Link><Link className="icon-link" href="/pengaturan" aria-label={tr("Pengaturan", "Settings")}><Icon name="settings.jpg"/></Link></header>
    <main className="screen-main"><DemoNote />{reminders.length > 0 && <Link className="dashboard-reminder" href="/pengaturan/notifikasi">◷ {tr("Ada deadline tersimpan dalam 3 hari", "A saved deadline is within 3 days")} <span aria-hidden="true">›</span></Link>}
      <section className="date-panel" aria-label={tr("Kalender mini", "Mini calendar")}><div className="date-panel-head"><button type="button" onClick={() => shiftWeek(-1)} aria-label={tr("Minggu sebelumnya", "Previous week")}>‹</button><h2>{new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { month: "long", year: "numeric" }).format(weekStart)}</h2><Link href="/kalender" aria-label={tr("Buka kalender", "Open calendar")}><Icon name="kalender.jpg"/></Link><button type="button" onClick={() => shiftWeek(1)} aria-label={tr("Minggu berikutnya", "Next week")}>›</button></div>
        <CalendarChips />
        <div className="date-strip">{days.map((day) => { const dots = dayDots(day, filtered); return <button type="button" key={day.getTime()} onClick={() => setSelected(day)} className={sameDay(day, selected) ? "selected" : ""} aria-pressed={sameDay(day, selected)} aria-label={`${formatDate(day, locale)}: ${dots.length ? dots.map((category) => categoryLabel(category, locale)).join(", ") : tr("tanpa deadline", "no deadlines")}`}><strong>{day.getDate()}</strong><span>{new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { weekday: "short" }).format(day)}</span><small className="date-dots">{dots.map((category) => { const catClass = category.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-"); return <i key={category} className={`dot-${catClass}`} aria-hidden="true"/>; })}</small></button>; })}</div>
        <div className="date-agenda">{events.length ? <><strong>{tr("Agenda", "Agenda")} {formatDate(selected, locale)}</strong><ul>{events.map((item) => <li key={item.id}><Link href={`/peluang/${item.id}`}>{item.title}</Link></li>)}</ul></> : <p>{tr("Belum ada agenda pada", "No agenda on")} {formatDate(selected, locale)}.</p>}</div>
        {calendarFilter === "Rekomendasi" && <p className="calendar-disclaimer">{profile?.major ? `${tr("Menampilkan rekomendasi untuk jurusan", "Showing recommendations for major")} ${profile.major}.` : tr("Pilihan demo, bukan penilaian kelayakan.", "Demo picks, not an eligibility assessment.")}</p>}
      </section>
      <section className="section-space"><div className="section-heading"><h2>{profile.major ? `${tr("Rekomendasi untuk", "Recommended for")} ${profile.major}` : tr("Rekomendasi untuk kamu", "Featured Opportunities")}</h2><Link href="/peluang">{tr("Lihat Semua", "See All")} <span aria-hidden="true">›</span></Link></div><OpportunityList items={recommendedList}/></section>
    </main>
  </AppShell>;
}
export function CatalogScreen() {
    const { locale, profile } = useApp();
    const tr = useTr();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("Semua");
    const [field, setField] = useState("Semua bidang");
    const [showFilters, setShowFilters] = useState(false);
    const fields = ["Semua bidang", ...Array.from(new Set(opportunities.map((item) => item.field)))];
    const filtered = useMemo(() => {
        const list = opportunities.filter((item) => {
            const text = `${item.title} ${item.organization} ${item.summary} ${item.summaryEn}`.toLocaleLowerCase();
            return (category === "Semua" || hasCategory(item, category)) && (field === "Semua bidang" || item.field === field) && text.includes(query.trim().toLocaleLowerCase());
        });
        return list.slice().sort((a, b) => {
            const aRec = isOpportunityRecommended(a, profile?.major) ? 1 : 0;
            const bRec = isOpportunityRecommended(b, profile?.major) ? 1 : 0;
            return bRec - aRec;
        });
    }, [query, category, field, profile?.major]);
    const reset = () => { setQuery(""); setCategory("Semua"); setField("Semua bidang"); };
    return <AppShell><header className="top-header search-header"><Link href="/dashboard" className="back-link" aria-label={tr("Kembali ke dashboard", "Back to dashboard")}>←</Link><label className="search-box"><span className="sr-only">{tr("Cari peluang", "Search opportunities")}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr("Cari beasiswa, magang...", "Search scholarships, internships...")}/><Icon name="search.svg"/></label><button type="button" className="icon-button" aria-label={tr("Tampilkan filter bidang", "Show field filter")} aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}><Icon name="settings.jpg"/></button></header><main className="screen-main"><DemoNote /><div className="filter-row"><CategoryTabs selected={category} onSelect={setCategory}/></div>{showFilters && <div className="filter-panel"><label htmlFor="field-filter">{tr("Bidang", "Field")}</label><select id="field-filter" value={field} onChange={(event) => setField(event.target.value)}>{fields.map((item) => <option key={item} value={item}>{item === "Semua bidang" ? tr("Semua bidang", "All fields") : fieldLabel(item, locale)}</option>)}</select></div>}<p className="result-count">{filtered.length} {tr("peluang ditemukan", "opportunities found")}</p>{filtered.length ? <OpportunityList items={filtered} displayCategory={category === "Semua" ? undefined : category}/> : <div className="empty-state"><span aria-hidden="true">×</span><h1>{tr("Peluang Tidak Ditemukan", "No Opportunities Found")}</h1><p>{tr("Tidak ada peluang yang sesuai dengan kata kunci atau filter yang dipilih.", "No opportunities match your keyword or filters.")}</p><button type="button" className="primary-button" onClick={reset}>{tr("Hapus filter", "Clear Filters")}</button></div>}</main></AppShell>;
}
export function DetailScreen({ id }) {
    const { saved, toggleSaved, locale, profile } = useApp();
    const tr = useTr();
    const item = opportunities.find((opportunity) => opportunity.id === id);
    if (!item)
        return <AppShell><main className="screen-main empty-state"><h1>{tr("Peluang tidak ditemukan", "Opportunity not found")}</h1><Link href="/peluang" className="primary-button">{tr("Kembali ke daftar", "Back to list")}</Link></main></AppShell>;
    const isSaved = saved.includes(id);
    const handleSave = () => toggleSaved(id);
    const isRecommended = isOpportunityRecommended(item, profile?.major);
    const catClass = item.category.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    return <AppShell><main className="detail-screen screen-main"><div className="detail-top"><Link href="/peluang" className="text-back">← <span>{tr("Kembali", "Back")}</span></Link><button type="button" className="save-text" onClick={handleSave} aria-pressed={isSaved}><span aria-hidden="true">{isSaved ? "♥" : "♡"}</span>{isSaved ? tr("Tersimpan", "Saved") : tr("Simpan", "Save")}</button></div><DemoNote /><article><header className="detail-hero"><div className="card-badges">{isRecommended && <span className="badge badge-blue">✧ {tr("REKOMENDASI", "FEATURED")}</span>}<span className="badge badge-blue">{fieldLabel(item.field, locale).toUpperCase()}</span><span className={`badge badge-${catClass}`}>{categoryLabel(item.category, locale)}</span>{item.alsoCategories?.map((extra) => { const extraClass = extra.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-"); return <span key={extra} className={`badge badge-${extraClass}`}>{categoryLabel(extra, locale)}</span>; })}<span className={`badge badge-time ${item.demoDays <= 3 ? "badge-time-urgent" : ""}`}>◷ {item.demoDays} {tr("Hari", "Days")}</span></div><h1>{item.title}</h1><p className="card-org"><Icon name="enterprise.svg" size={22}/> {item.organization}</p><p><DeadlineLabel opportunity={item}/></p></header><section className="detail-body"><h2>{tr("DESKRIPSI", "DESCRIPTION")}</h2><p>{locale === "en" ? item.summaryEn : item.summary}</p>{item.referenceOnly && <p className="form-hint">{tr("Judul ini contoh katalog, bukan pembukaan yang telah terverifikasi. Periksa program dan jadwal terbaru pada situs penyelenggara.", "This title is a catalog example, not a verified opening. Check current programs and schedules on the provider site.")}</p>}{item.requirements.length > 0 && <><h3>{tr("Persyaratan utama", "Main Requirements")}</h3><ul>{(locale === "en" ? item.requirementsEn : item.requirements).map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></>}{item.benefits && <><h3>{tr("Manfaat", "Benefits")}</h3><ul>{(locale === "en" ? item.benefitsEn : item.benefits)?.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></>}<p className="form-hint">{item.requirements.length > 0 ? tr("Syarat dan tanggal ini adalah contoh. Periksa informasi terkini pada situs penyelenggara.", "These requirements and dates are examples. Check current information on the provider's site.") : tr("Tanggal ini hanya contoh. Periksa jadwal terbaru pada situs penyelenggara.", "This date is only an example. Check the latest schedule on the provider's site.")}</p></section><div className="detail-sticky-cta"><a className="primary-button official-link" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{tr("Kunjungi Website Resmi", "Visit Official Website")} ↗</a></div></article></main></AppShell>;
}
export function SavedScreen() {
    const { saved } = useApp();
    const tr = useTr();
    const [category, setCategory] = useState("Semua");
    const [query, setQuery] = useState("");
    const items = opportunities.filter((item) => saved.includes(item.id) && (category === "Semua" || hasCategory(item, category)) && `${item.title} ${item.organization}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    return <AppShell><header className="top-header title-header"><h1>{tr("Tersimpan", "Saved")}</h1><label className="saved-search"><span className="sr-only">{tr("Cari peluang tersimpan", "Search saved opportunities")}</span><Icon name="search.svg"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr("Cari", "Search")}/></label></header><main className="screen-main"><DemoNote /><CategoryTabs selected={category} onSelect={setCategory}/>{items.length ? <div className="saved-grid">{items.map((item) => <OpportunityCard key={item.id} opportunity={item} displayCategory={category === "Semua" ? undefined : category}/>)}</div> : <div className="empty-state"><h2>{tr("Belum ada peluang tersimpan", "No Saved Opportunities")}</h2><p>{tr("Simpan peluang dari daftar untuk melihatnya di sini.", "Save an opportunity from the list to see it here.")}</p><Link className="primary-button" href="/peluang">{tr("Cari peluang", "Find Opportunities")}</Link></div>}</main></AppShell>;
}
export function CalendarScreen() {
    const { saved, locale, calendarFilter, profile } = useApp();
    const tr = useTr();
    const today = new Date();
    const [monthOffset, setMonthOffset] = useState(0);
    const [selected, setSelected] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    const month = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const startWeekday = month.getDay();
    const numberOfDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells = Array.from({ length: Math.ceil((startWeekday + numberOfDays) / 7) * 7 }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i - startWeekday + 1));
    const filtered = filterCalendarOpportunities(calendarFilter, saved, today, profile);
    const events = filtered.filter((item) => sameDay(demoDeadline(item.demoDays), selected));
    const moveMonth = (direction) => { const next = new Date(month.getFullYear(), month.getMonth() + direction, 1); setMonthOffset(monthOffset + direction); setSelected(next); };
    const selectDate = (date) => { setSelected(date); setMonthOffset((date.getFullYear() - today.getFullYear()) * 12 + date.getMonth() - today.getMonth()); };
    const weekdays = locale === "en" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return <AppShell><header className="top-header title-header"><Link href="/dashboard" className="back-link" aria-label={tr("Kembali ke dashboard", "Back to dashboard")}>←</Link><h1>{tr("Kalender", "Calendar")}</h1></header><main className="calendar-screen"><div className="calendar-panel"><div className="calendar-heading"><button type="button" onClick={() => moveMonth(-1)} aria-label={tr("Bulan sebelumnya", "Previous month")}>‹</button><h2>{new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { month: "long", year: "numeric" }).format(month)}</h2><button type="button" onClick={() => moveMonth(1)} aria-label={tr("Bulan berikutnya", "Next month")}>›</button></div><div className="calendar-grid weekday-row">{weekdays.map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{cells.map((date) => { const inMonth = date.getMonth() === month.getMonth(); const dots = dayDots(date, filtered); return <button type="button" key={date.getTime()} onClick={() => selectDate(date)} className={`${inMonth ? "" : "muted"} ${sameDay(date, selected) ? "selected" : ""}`} aria-label={`${formatDate(date, locale)}: ${dots.length ? dots.map((category) => categoryLabel(category, locale)).join(", ") : tr("tanpa deadline", "no deadlines")}`} aria-pressed={sameDay(date, selected)}>{date.getDate()}<span className="calendar-day-dots">{dots.map((category) => { const catClass = category.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-"); return <i key={category} className={`dot-${catClass}`} aria-hidden="true"/>; })}</span></button>; })}</div></div><div className="calendar-agenda screen-main"><DemoNote /><CalendarChips /><h2>{tr("Agenda", "Agenda")} {formatDate(selected, locale)}</h2>{events.length ? <OpportunityList items={events}/> : <p className="no-agenda">{tr("Belum ada tenggat peluang pada tanggal ini.", "No opportunity deadlines on this date.")}</p>}{calendarFilter === "Rekomendasi" && <p className="calendar-disclaimer">{profile?.major ? `${tr("Menampilkan rekomendasi untuk jurusan", "Showing recommendations for major")} ${profile.major}.` : tr("Pilihan demo, bukan penilaian kelayakan.", "Demo picks, not an eligibility assessment.")}</p>}<h3>{tr("Daftar tenggat", "Deadline List")}</h3><ul className="deadline-list">{filtered.map((item) => <li key={item.id}><Link href={`/peluang/${item.id}`}>{item.title}</Link><span>{formatDate(demoDeadline(item.demoDays), locale)}</span></li>)}</ul></div></main></AppShell>;
}
