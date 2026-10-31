"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useApp, useTr } from "@/script/app-provider";
import { AppShell, DeadlineLabel, DemoNote, Icon, OpportunityCard, OpportunityList } from "@/script/ui";
import { calendarFilterLabel, calendarFilters, categories, categoryLabel, demoDeadline, demoReminders, fieldLabel, filterCalendarOpportunities, formatDate, hasCategory, isOpportunityRecommended, opportunities as staticOpportunities } from "@/script/opportunities";
const AGENDA_DATA = {
    "2026-09-08": [
        { warna: "hijau", judul: "Djarum Beasiswa Plus", jenis: "Buka pendaftaran", id: "djarum", kategori: "Beasiswa" }
    ],
    "2026-09-17": [
        { warna: "merah", judul: "Beasiswa Bank Indonesia", jenis: "Batas pendaftaran", id: "beasiswa-bi", kategori: "Deadline" },
        { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Buka pendaftaran", id: "hacktiv8", kategori: "Bootcamp" }
    ],
    "2026-10-12": [
        { warna: "hijau", judul: "Beasiswa KIP Kuliah", jenis: "Buka pendaftaran", id: "kip-kuliah", kategori: "Beasiswa" }
    ],
    "2026-10-13": [
        { warna: "merah", judul: "Magang Bakti BCA", jenis: "Batas pendaftaran", id: "magang-bakti", kategori: "Deadline" },
        { warna: "hitam", judul: "Djarum Beasiswa Plus", jenis: "Pengumuman", id: "djarum", kategori: "Umum" }
    ],
    "2026-10-14": [
        { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Seleksi berkas", id: "hacktiv8", kategori: "Bootcamp" }
    ],
    "2026-10-15": [
        { warna: "hijau", judul: "Beasiswa Bank Indonesia", jenis: "Seleksi berkas", id: "beasiswa-bi", kategori: "Beasiswa" }
    ],
    "2026-10-16": [
        { warna: "ungu", judul: "Magang Data Analyst", jenis: "Wawancara", id: "magang-telkom", kategori: "Disimpan" }
    ],
    "2026-10-18": [
        { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Buka pendaftaran", id: "hacktiv8", kategori: "Bootcamp" }
    ],
    "2026-10-19": [
        { warna: "ungu", judul: "Magang Generasi Bertalenta", jenis: "Batas unggah berkas", id: "magenta", kategori: "Disimpan" },
        { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Pengumuman", id: "hacktiv8", kategori: "Bootcamp" }
    ],
    "2026-10-20": [
        { warna: "hitam", judul: "Beasiswa KIP Kuliah", jenis: "Pengumuman", id: "kip-kuliah", kategori: "Umum" },
        { warna: "ungu", judul: "Magang Bakti BCA", jenis: "Wawancara", id: "magang-bakti", kategori: "Disimpan" }
    ],
    "2026-10-21": [
        { warna: "oranye", judul: "Magang Data Analyst", jenis: "Batas lamaran", id: "magang-telkom", kategori: "Magang" }
    ],
    "2026-10-23": [
        { warna: "oranye", judul: "Magang Generasi Bertalenta", jenis: "Batas lamaran", id: "magenta", kategori: "Magang" },
        { warna: "merah", judul: "Web Dev & UI/UX", jenis: "Batas pendaftaran", id: "vinix7", kategori: "Deadline" },
        { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Batas pendaftaran", id: "hacktiv8", kategori: "Bootcamp" }
    ],
    "2026-10-25": [
        { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Mulai kegiatan", id: "hacktiv8", kategori: "Bootcamp" }
    ],
    "2026-11-05": [
        { warna: "oranye", judul: "Web Dev & UI/UX", jenis: "Batas lamaran", id: "vinix7", kategori: "Magang" }
    ],
    "2026-11-12": [
        { warna: "hijau", judul: "Beasiswa KIP Kuliah", jenis: "Seleksi berkas", id: "kip-kuliah", kategori: "Beasiswa" },
        { warna: "merah", judul: "Magang Bakti BCA", jenis: "Batas pendaftaran", id: "magang-bakti", kategori: "Deadline" }
    ],
    "2026-11-19": [
        { warna: "ungu", judul: "Magang Data Analyst", jenis: "Wawancara", id: "magang-telkom", kategori: "Disimpan" }
    ],
    "2026-12-02": [
        { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Buka pendaftaran", id: "hacktiv8", kategori: "Bootcamp" }
    ],
    "2026-12-15": [
        { warna: "hijau", judul: "Djarum Beasiswa Plus", jenis: "Pengumuman", id: "djarum", kategori: "Beasiswa" }
    ],
    "2026-12-31": [
        { warna: "hitam", judul: "Beasiswa Bank Indonesia", jenis: "Pengumuman", id: "beasiswa-bi", kategori: "Umum" }
    ]
};

const AGENDA_KATEGORI = {
    hijau: "Beasiswa",
    merah: "Deadline",
    pink: "Bootcamp",
    oranye: "Magang",
    ungu: "Disimpan",
    hitam: "Umum"
};

function formatKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function getDayAgenda(date, filter = "Semua", saved = [], profile = null, oppList = staticOpportunities) {
    const key = formatKey(date);
    const staticItems = AGENDA_DATA[key] || [];

    // Sertakan batas pendaftaran dan milestone dari data peluang aktif
    const oppEvents = [];
    const activeOpps = oppList.filter((item) => item.status !== "Ditutup" && item.status !== "Diarsipkan");

    for (const item of activeOpps) {
        const catClass = item.category.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
        const deadline = demoDeadline(item.demoDays);
        if (sameDay(deadline, date)) {
            oppEvents.push({
                warna: "merah",
                judul: item.title,
                jenis: "Batas pendaftaran",
                id: item.id,
                kategori: "Deadline",
            });
        }
        // Milestone Buka Pendaftaran
        const buka = demoDeadline(item.demoDays - 14);
        if (sameDay(buka, date)) {
            oppEvents.push({
                warna: "hijau",
                judul: item.title,
                jenis: "Buka pendaftaran",
                id: item.id,
                kategori: item.category,
            });
        }
        // Milestone Seleksi Berkas
        const seleksi = demoDeadline(item.demoDays + 4);
        if (sameDay(seleksi, date)) {
            oppEvents.push({
                warna: catClass,
                judul: item.title,
                jenis: "Seleksi berkas",
                id: item.id,
                kategori: item.category,
            });
        }
        // Milestone Pengumuman
        const pengumuman = demoDeadline(item.demoDays + 10);
        if (sameDay(pengumuman, date)) {
            oppEvents.push({
                warna: "hitam",
                judul: item.title,
                jenis: "Pengumuman",
                id: item.id,
                kategori: "Umum",
            });
        }
    }

    // Gabungkan tanpa duplikasi judul
    const allItems = [...staticItems];
    for (const opp of oppEvents) {
        if (!allItems.some(it => it.judul.toLowerCase() === opp.judul.toLowerCase() || (it.id && it.id === opp.id && it.jenis === opp.jenis))) {
            allItems.push(opp);
        }
    }

    if (!filter || filter === "Semua") return allItems;
    if (filter === "Beasiswa") return allItems.filter(it => it.warna === "hijau" || it.warna === "beasiswa" || it.kategori === "Beasiswa");
    if (filter === "Deadline") return allItems.filter(it => it.warna === "merah" || it.warna === "deadline" || it.kategori === "Deadline");
    if (filter === "Bootcamp") return allItems.filter(it => it.warna === "pink" || it.warna === "bootcamp" || it.kategori === "Bootcamp");
    if (filter === "Magang") return allItems.filter(it => it.warna === "oranye" || it.warna === "magang" || it.kategori === "Magang");
    if (filter === "Disimpan") return allItems.filter(it => it.warna === "ungu" || it.warna === "disimpan" || (it.id && saved.includes(it.id)));
    if (filter === "Rekomendasi") {
        return allItems.filter(it => {
            if (!it.id) return false;
            const opp = oppList.find(o => o.id === it.id);
            return opp ? isOpportunityRecommended(opp, profile?.major) : false;
        });
    }
    const normFilter = filter.toLowerCase().replace(/[^a-z0-9]/g, "-");
    return allItems.filter(it => it.kategori === filter || it.warna === normFilter);
}

function getDayDots(date, filter = "Semua", saved = [], profile = null, oppList = staticOpportunities) {
    const items = getDayAgenda(date, filter, saved, profile, oppList);
    const seen = new Set();
    const dots = [];
    for (const it of items) {
        const dotColor = it.warna;
        if (!seen.has(dotColor)) {
            seen.add(dotColor);
            dots.push(it);
        }
    }
    return dots;
}

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
    return <div className="calendar-chips chip-baris" role="group" aria-label={tr("Filter agenda", "Agenda filters")} onWheel={onWheel}>
    {calendarFilters.map((filter) => {
        const chipClass = filter.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
        const isSelected = calendarFilter === filter;
        const label = filter === "Rekomendasi" ? `✧ ${calendarFilterLabel(filter, locale)}` : calendarFilterLabel(filter, locale);
        return <button key={filter} type="button" className={`chip calendar-chip chip-${chipClass}` + (isSelected ? " terpilih selected" : "")} aria-pressed={isSelected} onClick={() => setCalendarFilter(isSelected && filter !== "Semua" ? "Semua" : filter)}><span>{label}</span></button>;
    })}
  </div>;
}
function CategoryTabs({ selected, onSelect }) {
    const { locale } = useApp();
    const tr = useTr();
    return <div className="category-tabs" role="group" aria-label={tr("Kategori peluang", "Opportunity categories")}>{categories.map((item) => <button key={item} type="button" className={selected === item ? "selected" : ""} aria-pressed={selected === item} onClick={() => onSelect(item)}>{categoryLabel(item, locale)}</button>)}</div>;
}
export function DashboardScreen() {
    const { profile, saved, locale, calendarFilter, setCalendarFilter, deadlineAlerts, opportunities = staticOpportunities } = useApp();
    const tr = useTr();
    const today = useMemo(() => new Date(), []);
    const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
    const [selected, setSelected] = useState(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    const selectedDayRef = useRef(null);
    const reminders = deadlineAlerts ? demoReminders(saved) : [];
    const displayName = profile.name === "Pengguna Demo" || profile.name === "Mahasiswa" || !profile.name ? tr("Mahasiswa", "Student") : profile.name.split(" ")[0];

    const currentYear = viewMonth.getFullYear();
    const currentMonth = viewMonth.getMonth();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthDays = Array.from({ length: totalDays }, (_, i) => new Date(currentYear, currentMonth, i + 1));

    const shiftMonth = (delta) => {
        setViewMonth((prev) => {
            const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
            setSelected(new Date(next.getFullYear(), next.getMonth(), 1));
            return next;
        });
    };

    const goToToday = () => {
        const now = new Date();
        setSelected(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
        setViewMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    };

    const monthTitle = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { month: "long", year: "numeric" }).format(viewMonth);
    const dayNames = locale === "en" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    const currentAgenda = getDayAgenda(selected, calendarFilter, saved, profile, opportunities);

    useEffect(() => {
        if (selectedDayRef.current) {
            const timer = setTimeout(() => {
                selectedDayRef.current?.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest"
                });
            }, 60);
            return () => clearTimeout(timer);
        }
    }, [selected, viewMonth]);

    const recommendedList = useMemo(() => {
        const active = opportunities.filter((item) => item.status !== "Ditutup" && item.status !== "Diarsipkan");
        const matches = active.filter((item) => isOpportunityRecommended(item, profile.major));
        const others = active.filter((item) => !matches.includes(item));
        return [...matches, ...others].slice(0, 8);
    }, [opportunities, profile.major]);

    return <AppShell>
    <header className="kepala top-header dashboard-header">
      <span className="avatar avatar-small" aria-hidden="true">{displayName.slice(0, 1).toUpperCase()}</span>
      <div className="identitas greeting">
        <p className="hai"><span>{tr("Hai,", "Hi,")}</span></p>
        <h1 className="nama">{displayName}</h1>
      </div>
      <div className="aksi-kepala">
        <Link className="ikon-tombol icon-link" href="/peluang" aria-label={tr("Cari peluang", "Search opportunities")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" />
          </svg>
        </Link>
        <Link className="ikon-tombol icon-link" href="/pengaturan" aria-label={tr("Filter peluang", "Filter opportunities")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 8h18M3 16h18" />
            <circle cx="15" cy="8" r="2.5" fill="currentColor" />
            <circle cx="9" cy="16" r="2.5" fill="currentColor" />
          </svg>
        </Link>
      </div>
    </header>

    <main className="screen-main">
      <DemoNote />
      {reminders.length > 0 && <Link className="dashboard-reminder" href="/pengaturan/notifikasi">◷ {tr("Ada deadline tersimpan dalam 3 hari", "A saved deadline is within 3 days")} <span aria-hidden="true">›</span></Link>}

      <section className="kartu-kalender date-panel" aria-labelledby="judul-bulan">
        <div className="nav-bulan date-panel-head">
          <button className="ikon-bulan" type="button" onClick={() => shiftMonth(-1)} aria-label={tr("Bulan sebelumnya", "Previous month")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>
          <div className="judul-bulan-wrap">
            <h2 className="judul-bulan" id="judul-bulan" aria-live="polite">{monthTitle}</h2>
            <button type="button" className="tombol-hari-ini" onClick={goToToday} aria-label={tr("Kembali ke hari ini", "Go to today")}>
              {tr("Hari Ini", "Today")}
            </button>
          </div>
          <Link className="ikon-bulan" href="/kalender" aria-label={tr("Buka kalender penuh", "Open full calendar")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="3" />
              <path d="M8 3v4M16 3v4M3 10.5h18" />
            </svg>
          </Link>
          <button className="ikon-bulan" type="button" onClick={() => shiftMonth(1)} aria-label={tr("Bulan berikutnya", "Next month")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <CalendarChips />

        <ol className="strip-hari date-strip" aria-label={tr("Tanggal kalender", "Calendar dates")}>
          {monthDays.map((day) => {
            const isFirst = day.getDate() === 1;
            const isSelected = sameDay(day, selected);
            const isDayToday = sameDay(day, today);
            const dots = getDayDots(day, calendarFilter, saved, profile, opportunities);
            return (
              <li key={day.getTime()} className={isFirst ? "awal-bulan" : ""}>
                <button
                  ref={isSelected ? selectedDayRef : null}
                  type="button"
                  className={`hari ${isSelected ? "terpilih selected" : ""}${isDayToday && !isSelected ? " hari-ini today" : ""}`}
                  onClick={() => setSelected(day)}
                  aria-label={formatDate(day, locale)}
                  aria-current={isSelected ? "date" : undefined}
                >
                  <span className="angka">{day.getDate()}</span>
                  <span className="nama-hari">{dayNames[day.getDay()]}</span>
                  <span className="titik-baris" aria-hidden="true">
                    {dots.map((item, idx) => (
                      <span key={idx} className={`titik titik-${item.warna} dot-${item.warna}`} />
                    ))}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="agenda date-agenda" id="agenda-tanggal" aria-live="polite">
          {currentAgenda.length > 0 ? (
            <ul className="agenda-daftar">
              {currentAgenda.map((item, idx) => (
                <li key={idx} className="agenda-baris">
                  <span className={`titik titik-${item.warna} dot-${item.warna}`} aria-hidden="true" />
                  <div className="agenda-teks">
                    <span className="agenda-judul">
                      {item.id ? <Link href={`/peluang/${item.id}`}>{item.judul}</Link> : item.judul}
                    </span>
                    <span className="agenda-meta">
                      {AGENDA_KATEGORI[item.warna] || item.kategori} · {item.jenis}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="agenda-kosong">{tr("Belum ada agenda pada", "No agenda on")} {formatDate(selected, locale)}.</p>
          )}
        </div>
      </section>

      <section className="rekomendasi section-space" aria-labelledby="judul-rekomendasi">
        <div className="judul-bagian section-heading">
          <h2 id="judul-rekomendasi">
            {profile.major ? `${tr("Rekomendasi untuk", "Recommended for")} ${profile.major}` : tr("Rekomendasi untuk kamu", "Featured Opportunities")}
          </h2>
          <Link className="lihat-semua" href="/peluang">
            {tr("Lihat Semua", "See All")}{" "}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
        <OpportunityList items={recommendedList} />
      </section>
    </main>
  </AppShell>;
}
export function CatalogScreen() {
    const { locale, profile, opportunities = staticOpportunities } = useApp();
    const tr = useTr();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("Semua");
    const [field, setField] = useState("Semua bidang");
    const [showFilters, setShowFilters] = useState(false);
    const fields = ["Semua bidang", ...Array.from(new Set(opportunities.map((item) => item.field)))];
    const filtered = useMemo(() => {
        const list = opportunities
            .filter((item) => item.status !== "Ditutup" && item.status !== "Diarsipkan")
            .filter((item) => {
                const text = `${item.title} ${item.organization} ${item.summary} ${item.summaryEn}`.toLocaleLowerCase();
                return (category === "Semua" || hasCategory(item, category)) && (field === "Semua bidang" || item.field === field) && text.includes(query.trim().toLocaleLowerCase());
            });
        return list.slice().sort((a, b) => {
            const aRec = isOpportunityRecommended(a, profile?.major) ? 1 : 0;
            const bRec = isOpportunityRecommended(b, profile?.major) ? 1 : 0;
            return bRec - aRec;
        });
    }, [opportunities, query, category, field, profile?.major]);
    const reset = () => { setQuery(""); setCategory("Semua"); setField("Semua bidang"); };
    return <AppShell><header className="top-header search-header"><Link href="/dashboard" className="back-link" aria-label={tr("Kembali ke dashboard", "Back to dashboard")}><svg width="18" height="14" viewBox="0 0 20 15" fill="currentColor" aria-hidden="true"><path d="M7.91901 1.94806C8.02954 1.84507 8.11819 1.72087 8.17968 1.58287C8.24117 1.44487 8.27423 1.2959 8.2769 1.14485C8.27956 0.993792 8.25178 0.843748 8.19519 0.703666C8.13861 0.563583 8.05439 0.436333 7.94757 0.329505C7.84074 0.222676 7.71349 0.13846 7.57341 0.081878C7.43332 0.0252965 7.28328 -0.00249009 7.13223 0.000175084C6.98117 0.00284026 6.8322 0.0359026 6.6942 0.0973905C6.5562 0.158878 6.432 0.247532 6.32901 0.358062L0.32901 6.35806C0.118334 6.569 0 6.85494 0 7.15306C0 7.45119 0.118334 7.73712 0.32901 7.94806L6.32901 13.9481C6.432 14.0586 6.5562 14.1472 6.6942 14.2087C6.8322 14.2702 6.98117 14.3033 7.13223 14.3059C7.28328 14.3086 7.43332 14.2808 7.57341 14.2242C7.71349 14.1677 7.84074 14.0834 7.94757 13.9766C8.05439 13.8698 8.13861 13.7425 8.19519 13.6025C8.25178 13.4624 8.27956 13.3123 8.2769 13.1613C8.27423 13.0102 8.24117 12.8613 8.17968 12.7233C8.11819 12.5853 8.02954 12.4611 7.91901 12.3581L3.83901 8.27806H18.374C18.6724 8.27806 18.9585 8.15954 19.1695 7.94856C19.3805 7.73758 19.499 7.45143 19.499 7.15306C19.499 6.85469 19.3805 6.56855 19.1695 6.35757C18.9585 6.14659 18.6724 6.02806 18.374 6.02806H3.83901L7.91901 1.94806Z"/></svg></Link><label className="search-box"><span className="sr-only">{tr("Cari peluang", "Search opportunities")}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr("Cari beasiswa, magang...", "Search scholarships, internships...")}/><Icon name="search.svg"/></label><button type="button" className="icon-button" aria-label={tr("Tampilkan filter bidang", "Show field filter")} aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}><Icon name="settings.jpg"/></button></header><main className="screen-main"><DemoNote /><div className="filter-row"><CategoryTabs selected={category} onSelect={setCategory}/></div>{showFilters && <div className="filter-panel"><label htmlFor="field-filter">{tr("Bidang", "Field")}</label><select id="field-filter" value={field} onChange={(event) => setField(event.target.value)}>{fields.map((item) => <option key={item} value={item}>{item === "Semua bidang" ? tr("Semua bidang", "All fields") : fieldLabel(item, locale)}</option>)}</select></div>}<p className="result-count">{filtered.length} {tr("peluang ditemukan", "opportunities found")}</p>{filtered.length ? <OpportunityList items={filtered} displayCategory={category === "Semua" ? undefined : category}/> : <div className="empty-state"><span aria-hidden="true">×</span><h1>{tr("Peluang Tidak Ditemukan", "No Opportunities Found")}</h1><p>{tr("Tidak ada peluang yang sesuai dengan kata kunci atau filter yang dipilih.", "No opportunities match your keyword or filters.")}</p><button type="button" className="primary-button" onClick={reset}>{tr("Hapus filter", "Clear Filters")}</button></div>}</main></AppShell>;
}
export function DetailScreen({ id }) {
    const { saved, toggleSaved, locale, profile, opportunities = staticOpportunities } = useApp();
    const tr = useTr();
    const item = opportunities.find((opportunity) => opportunity.id === id);
    if (!item)
        return <AppShell><main className="screen-main empty-state"><h1>{tr("Peluang tidak ditemukan", "Opportunity not found")}</h1><Link href="/peluang" className="primary-button">{tr("Kembali ke daftar", "Back to list")}</Link></main></AppShell>;
    const isSaved = saved.includes(id);
    const handleSave = () => toggleSaved(id);
    const isRecommended = isOpportunityRecommended(item, profile?.major);
    const catClass = item.category.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    return <AppShell><main className="detail-screen screen-main"><div className="detail-top"><Link href="/peluang" className="text-back"><span className="back-icon-box" aria-hidden="true"><svg width="18" height="14" viewBox="0 0 20 15" fill="currentColor" aria-hidden="true"><path d="M7.91901 1.94806C8.02954 1.84507 8.11819 1.72087 8.17968 1.58287C8.24117 1.44487 8.27423 1.2959 8.2769 1.14485C8.27956 0.993792 8.25178 0.843748 8.19519 0.703666C8.13861 0.563583 8.05439 0.436333 7.94757 0.329505C7.84074 0.222676 7.71349 0.13846 7.57341 0.081878C7.43332 0.0252965 7.28328 -0.00249009 7.13223 0.000175084C6.98117 0.00284026 6.8322 0.0359026 6.6942 0.0973905C6.5562 0.158878 6.432 0.247532 6.32901 0.358062L0.32901 6.35806C0.118334 6.569 0 6.85494 0 7.15306C0 7.45119 0.118334 7.73712 0.32901 7.94806L6.32901 13.9481C6.432 14.0586 6.5562 14.1472 6.6942 14.2087C6.8322 14.2702 6.98117 14.3033 7.13223 14.3059C7.28328 14.3086 7.43332 14.2808 7.57341 14.2242C7.71349 14.1677 7.84074 14.0834 7.94757 13.9766C8.05439 13.8698 8.13861 13.7425 8.19519 13.6025C8.25178 13.4624 8.27956 13.3123 8.2769 13.1613C8.27423 13.0102 8.24117 12.8613 8.17968 12.7233C8.11819 12.5853 8.02954 12.4611 7.91901 12.3581L3.83901 8.27806H18.374C18.6724 8.27806 18.9585 8.15954 19.1695 7.94856C19.3805 7.73758 19.499 7.45143 19.499 7.15306C19.499 6.85469 19.3805 6.56855 19.1695 6.35757C18.9585 6.14659 18.6724 6.02806 18.374 6.02806H3.83901L7.91901 1.94806Z"/></svg></span><span>{tr("Kembali", "Back")}</span></Link><button type="button" className="save-text" onClick={handleSave} aria-pressed={isSaved}><span aria-hidden="true">{isSaved ? "♥" : "♡"}</span>{isSaved ? tr("Tersimpan", "Saved") : tr("Simpan", "Save")}</button></div><DemoNote /><article><header className="detail-hero"><div className="card-badges">{isRecommended && <span className="badge badge-blue">✧ {tr("REKOMENDASI", "FEATURED")}</span>}<span className="badge badge-blue">{fieldLabel(item.field, locale).toUpperCase()}</span><span className={`badge badge-${catClass}`}>{categoryLabel(item.category, locale)}</span>{item.alsoCategories?.map((extra) => { const extraClass = extra.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-"); return <span key={extra} className={`badge badge-${extraClass}`}>{categoryLabel(extra, locale)}</span>; })}<span className={`badge badge-time ${item.demoDays <= 3 ? "badge-time-urgent" : ""}`}>◷ {item.demoDays} {tr("Hari", "Days")}</span></div><h1>{item.title}</h1><p className="card-org"><Icon name="enterprise.svg" size={22}/> {item.organization}</p><p><DeadlineLabel opportunity={item}/></p></header><section className="detail-body"><h2>{tr("DESKRIPSI", "DESCRIPTION")}</h2><p>{locale === "en" ? item.summaryEn : item.summary}</p>{item.referenceOnly && <p className="form-hint">{tr("Periksa program dan jadwal pendaftaran terbaru pada situs resmi penyelenggara.", "Check current programs and schedules on the official provider site.")}</p>}{item.requirements.length > 0 && <><h3>{tr("Persyaratan utama", "Main Requirements")}</h3><ul>{(locale === "en" ? item.requirementsEn : item.requirements).map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></>}{item.benefits && <><h3>{tr("Manfaat", "Benefits")}</h3><ul>{(locale === "en" ? item.benefitsEn : item.benefits)?.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></>}<p className="form-hint">{item.requirements.length > 0 ? tr("Syarat dan tanggal ini adalah contoh. Periksa informasi terkini pada situs penyelenggara.", "These requirements and dates are examples. Check current information on the provider's site.") : tr("Tanggal ini hanya contoh. Periksa jadwal terbaru pada situs penyelenggara.", "This date is only an example. Check the latest schedule on the provider's site.")}</p></section><div className="detail-sticky-cta"><a className="primary-button official-link" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{tr("Kunjungi Website Resmi", "Visit Official Website")} ↗</a></div></article></main></AppShell>;
}
export function SavedScreen() {
    const { saved, opportunities = staticOpportunities } = useApp();
    const tr = useTr();
    const [category, setCategory] = useState("Semua");
    const [query, setQuery] = useState("");
    const items = opportunities.filter((item) => saved.includes(item.id) && (category === "Semua" || hasCategory(item, category)) && `${item.title} ${item.organization}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    return <AppShell><header className="top-header title-header"><h1>{tr("Tersimpan", "Saved")}</h1><label className="saved-search"><span className="sr-only">{tr("Cari peluang tersimpan", "Search saved opportunities")}</span><Icon name="search.svg"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr("Cari", "Search")}/></label></header><main className="screen-main"><DemoNote /><CategoryTabs selected={category} onSelect={setCategory}/>{items.length ? <div className="saved-grid">{items.map((item) => <OpportunityCard key={item.id} opportunity={item} displayCategory={category === "Semua" ? undefined : category}/>)}</div> : <div className="empty-state"><h2>{tr("Belum ada peluang tersimpan", "No Saved Opportunities")}</h2><p>{tr("Simpan peluang dari daftar untuk melihatnya di sini.", "Save an opportunity from the list to see it here.")}</p><Link className="primary-button" href="/peluang">{tr("Cari peluang", "Find Opportunities")}</Link></div>}</main></AppShell>;
}
export function CalendarScreen() {
    const { saved, toggleSaved, locale, calendarFilter, setCalendarFilter, profile, opportunities = staticOpportunities } = useApp();
    const tr = useTr();
    const today = useMemo(() => new Date(), []);
    const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
    const [selected, setSelected] = useState(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()));

    const currentYear = viewMonth.getFullYear();
    const currentMonth = viewMonth.getMonth();

    const shiftMonth = (delta) => {
        setViewMonth((prev) => {
            const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
            setSelected(new Date(next.getFullYear(), next.getMonth(), 1));
            return next;
        });
    };

    const goToToday = () => {
        const now = new Date();
        setSelected(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
        setViewMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    };

    const selectDate = (date) => {
        setSelected(date);
        if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) {
            setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
        }
    };

    const monthTitle = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { month: "long", year: "numeric" }).format(viewMonth);

    // Hitung grid kalender bulanan 6 baris x 7 kolom sesuai script/kalender.js
    const awal = new Date(currentYear, currentMonth, 1).getDay();
    const total = new Date(currentYear, currentMonth + 1, 0).getDate();

    const rows = [];
    let tgl = 1 - awal;
    for (let baris = 0; baris < 6; baris++) {
        if (tgl > total) break;
        const row = [];
        for (let kol = 0; kol < 7; kol++, tgl++) {
            const cellDate = new Date(currentYear, currentMonth, tgl);
            const inMonth = tgl >= 1 && tgl <= total;
            row.push({
                date: cellDate,
                dayNumber: cellDate.getDate(),
                inMonth
            });
        }
        rows.push(row);
    }

    const currentAgenda = getDayAgenda(selected, calendarFilter, saved, profile, opportunities);
    const isToday = sameDay(selected, today);

    const agendaTitle = isToday
        ? tr("Agenda Hari Ini", "Today's Agenda")
        : `${selected.getDate()} ${new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { month: "long" }).format(selected)} ${selected.getFullYear()}`;

    const weekdays = locale === "en"
        ? [
            { abbr: "Sun", full: "Sunday" },
            { abbr: "Mon", full: "Monday" },
            { abbr: "Tue", full: "Tuesday" },
            { abbr: "Wed", full: "Wednesday" },
            { abbr: "Thu", full: "Thursday" },
            { abbr: "Fri", full: "Friday" },
            { abbr: "Sat", full: "Saturday" }
          ]
        : [
            { abbr: "Min", full: "Minggu" },
            { abbr: "Sen", full: "Senin" },
            { abbr: "Sel", full: "Selasa" },
            { abbr: "Rab", full: "Rabu" },
            { abbr: "Kam", full: "Kamis" },
            { abbr: "Jum", full: "Jumat" },
            { abbr: "Sab", full: "Sabtu" }
          ];

    return (
        <AppShell>
            <header className="kepala top-header">
                <Link href="/dashboard" className="ikon-tombol icon-link back-link" aria-label={tr("Kembali ke dashboard", "Back to dashboard")}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </Link>
                <h1 className="judul-kepala title-header">{tr("Kalender", "Calendar")}</h1>
                <Link href="/peluang" className="ikon-tombol icon-link" aria-label={tr("Cari", "Search")}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.8-3.8" />
                    </svg>
                </Link>
            </header>

            <main className="screen-main">
                <DemoNote />

                {/* Grid kalender bulanan */}
                <section className="kartu-kalender calendar-panel" aria-labelledby="bulan-kalender">
                    <nav className="nav-bulan calendar-heading" aria-label={tr("Navigasi bulan", "Month navigation")}>
                        <button className="ikon-bulan" id="btn-prev" type="button" onClick={() => shiftMonth(-1)} aria-label={tr("Bulan sebelumnya", "Previous month")}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="m15 5-7 7 7 7" />
                            </svg>
                        </button>
                        <div className="judul-bulan-wrap">
                            <h2 className="judul-bulan" id="bulan-kalender" aria-live="polite">{monthTitle}</h2>
                            <button type="button" className="tombol-hari-ini" onClick={goToToday} aria-label={tr("Kembali ke hari ini", "Go to today")}>
                                {tr("Hari Ini", "Today")}
                            </button>
                        </div>
                        <button className="ikon-bulan" id="btn-next" type="button" onClick={() => shiftMonth(1)} aria-label={tr("Bulan berikutnya", "Next month")}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="m9 5 7 7-7 7" />
                            </svg>
                        </button>
                    </nav>

                    <table className="grid-kalender" role="grid" aria-labelledby="bulan-kalender">
                        <thead>
                            <tr>
                                {weekdays.map((w) => (
                                    <th key={w.abbr} scope="col" abbr={w.full}>{w.abbr}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody id="badan-kalender">
                            {rows.map((row, rIdx) => (
                                <tr key={rIdx}>
                                    {row.map((cell) => {
                                        const dots = getDayDots(cell.date, calendarFilter, saved, profile, opportunities);
                                        const isSelected = sameDay(cell.date, selected);
                                        const isCellToday = sameDay(cell.date, today);
                                        return (
                                            <td key={cell.date.getTime()}>
                                                <button
                                                    type="button"
                                                    className={`sel-hari${!cell.inMonth ? " redup muted" : ""}${isSelected ? " terpilih selected" : ""}${isCellToday && !isSelected ? " hari-ini" : ""}`}
                                                    onClick={() => selectDate(cell.date)}
                                                    tabIndex={cell.inMonth ? 0 : -1}
                                                    aria-label={`${formatDate(cell.date, locale)}${dots.length ? `: ${dots.map((d) => AGENDA_KATEGORI[d.warna] || d.kategori || d.warna).join(", ")}` : ""}`}
                                                    aria-pressed={isSelected}
                                                >
                                                    {cell.dayNumber}
                                                    {dots.length > 0 && (
                                                        <span className="titik-baris calendar-day-dots" aria-hidden="true">
                                                            {dots.map((dot, idx) => (
                                                                <span key={idx} className={`titik titik-${dot.warna} dot-${dot.warna}`} />
                                                            ))}
                                                        </span>
                                                    )}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Chip filter kategori (tampilan dipertahankan) */}
                <CalendarChips />

                {/* Agenda tanggal terpilih */}
                <section className="bagian-agenda calendar-agenda" aria-labelledby="judul-agenda">
                    <h2 className="judul-agenda" id="judul-agenda">{agendaTitle}</h2>
                    <div id="isi-agenda" className="agenda-konten" aria-live="polite">
                        {currentAgenda.length > 0 ? (
                            <div className="agenda-daftar-kartu opportunity-grid">
                                {currentAgenda.map((item, idx) => {
                                    const opp = opportunities.find((o) => o.id === item.id) || opportunities.find((o) => o.title.toLowerCase() === item.judul.toLowerCase());
                                    if (opp) {
                                        return <OpportunityCard key={opp.id + "-" + idx} opportunity={opp} displayCategory={item.kategori || AGENDA_KATEGORI[item.warna]} />;
                                    }
                                    const isSaved = item.id && saved.includes(item.id);
                                    return (
                                        <article key={idx} className="kartu-agenda kartu-peluang opportunity-card">
                                            <div className="meta-atas card-badges">
                                                <span className="badge badge-rekomendasi badge-blue">
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                        <path d="M12 2.5c.6 4.7 4.8 8.9 9.5 9.5-4.7.6-8.9 4.8-9.5 9.5-.6-4.7-4.8-8.9-9.5-9.5Z" />
                                                    </svg> {tr("REKOMENDASI", "FEATURED")}
                                                </span>
                                                <span className={`badge kat-${item.warna} badge-${item.warna}`}>{AGENDA_KATEGORI[item.warna] || item.kategori || "Umum"}</span>
                                                <span className="badge badge-tenggat badge-time">
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                                        <circle cx="12" cy="12" r="9" /><path d="M12 7.5v4.5l3 2" />
                                                    </svg> 1 {tr("Hari", "Day")}
                                                </span>
                                            </div>
                                            <h3 className="judul-peluang">{item.judul}</h3>
                                            <p className="organisasi card-org">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18" />
                                                </svg> {item.jenis}
                                            </p>
                                            <div className="aksi-kartu card-actions">
                                                <button
                                                    type="button"
                                                    className={`simpan heart-button ${isSaved ? "tersimpan saved" : ""}`}
                                                    onClick={() => item.id && toggleSaved(item.id)}
                                                    aria-label={`${isSaved ? tr("Hapus dari", "Remove from") : tr("Simpan ke", "Save to")} ${tr("Tersimpan", "Saved")}: ${item.judul}`}
                                                    aria-pressed={isSaved}
                                                >
                                                    <svg width="26" height="26" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                        <path d="M12 20.3C10 18.6 3.5 13.9 3.5 9.2a4.7 4.7 0 0 1 8.5-2.9 4.7 4.7 0 0 1 8.5 2.9c0 4.7-6.5 9.4-8.5 11.1Z" />
                                                    </svg>
                                                </button>
                                                <Link href={item.id ? `/peluang/${item.id}` : "/peluang"} className="tombol-detail detail-pill">
                                                    {tr("Cek detail", "View details")}{" "}
                                                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                                                        <circle cx="10" cy="10" r="10" fill="currentColor" />
                                                        <path d="m8 5.8 4.2 4.2L8 14.2" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="agenda-kosong no-agenda">{tr("Belum ada agenda pada tanggal ini.", "No agenda on this date.")}</p>
                        )}
                    </div>
                </section>
            </main>
        </AppShell>
    );
}
