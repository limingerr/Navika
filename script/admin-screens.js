"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp, useTr } from "@/script/app-provider";
import { categories, categoryLabel, demoDeadline, formatDate, isOpportunityVisibleForStudent, isOpportunityInGracePeriod, isOpportunityExpiredOverWeek, opportunities as staticOpportunities } from "@/script/opportunities";

/* ============================================================
   Icons for Admin Shell
   ============================================================ */
function AdminIcon({ name, size = 18 }) {
  const icons = {
    dashboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
    catalog: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    globe: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    edit: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    trash: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    archive: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    menu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    bell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    eye: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    close: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  };
  return icons[name] || null;
}

/* ============================================================
   Admin Layout Component
   ============================================================ */
export function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, isAdminLoggedIn, logoutAdmin, ready } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (ready && !isAdminLoggedIn) {
      router.replace("/masuk");
      return;
    }

    // Verifikasi keamanan ganda ke backend server
    if (ready && isAdminLoggedIn) {
      let active = true;
      fetch("/api/admin/auth/check")
        .then((r) => r.json())
        .then((data) => {
          if (active && (!data || !data.authorized)) {
            logoutAdmin();
            router.replace("/masuk?error=unauthorized");
          }
        })
        .catch(() => {
          // Tangani kemungkinan offline / dev fallback
        });
      return () => {
        active = false;
      };
    }
  }, [ready, isAdminLoggedIn, router, logoutAdmin]);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
    { href: "/admin/peluang", label: "Katalog Peluang", icon: "catalog", exact: false },
    { href: "/admin/peluang/tambah", label: "Tambah Peluang", icon: "plus", exact: true },
    { href: "/admin/arsip", label: "Arsip Peluang", icon: "archive", exact: true },
    { href: "/admin/mahasiswa", label: "Kelola Mahasiswa", icon: "users", exact: true },
    { href: "/admin/peran", label: "Kelola Peran & Akses", icon: "shield", exact: true },
    { href: "/dashboard", label: "Kembali ke Web Mahasiswa", icon: "globe", exact: true },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    logoutAdmin();
    router.push("/");
  };

  const getBreadcrumbs = () => {
    if (pathname === "/admin") return [{ label: "Overview", active: true }];
    if (pathname === "/admin/peluang") return [{ label: "Katalog Peluang", active: true }];
    if (pathname === "/admin/peluang/tambah") {
      return [
        { label: "Katalog Peluang", href: "/admin/peluang" },
        { label: "Tambah Peluang Baru", active: true },
      ];
    }
    if (pathname.includes("/admin/peluang/") && pathname.endsWith("/edit")) {
      return [
        { label: "Katalog Peluang", href: "/admin/peluang" },
        { label: "Edit Peluang", active: true },
      ];
    }
    if (pathname === "/admin/arsip") return [{ label: "Arsip Peluang", active: true }];
    if (pathname === "/admin/mahasiswa") return [{ label: "Kelola Mahasiswa", active: true }];
    if (pathname === "/admin/peran") return [{ label: "Kelola Peran & Akses", active: true }];
    return [{ label: "Admin", active: true }];
  };

  if (ready && !isAdminLoggedIn) {
    return null;
  }

  return (
    <div className="admin-shell">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="admin-sidebar-backdrop" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <img src="/asset/Logo%20Navika.png" alt="Logo NAVIKA" />
          <div className="admin-brand-info">
            <h1>NAVIKA</h1>
            <span className="admin-badge-role">Panel Admin</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Menu Admin">
          {navItems.map((item) => {
            let isActive = false;
            if (item.href === "/admin/peluang") {
              isActive = pathname === "/admin/peluang" || (pathname.startsWith("/admin/peluang/") && pathname !== "/admin/peluang/tambah");
            } else if (item.exact) {
              isActive = pathname === item.href;
            } else {
              isActive = pathname.startsWith(item.href) && item.href !== "/admin";
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="admin-nav-icon"><AdminIcon name={item.icon} /></span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">A</div>
            <div className="admin-user-details">
              <span className="admin-user-name">Admin Konten</span>
              <span className="admin-user-role">Pengelola Katalog</span>
            </div>
          </div>
          <button type="button" className="admin-btn-logout" onClick={handleLogout} title="Keluar dari Admin">
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu navigasi"
            >
              <AdminIcon name="menu" size={20} />
            </button>
            <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/admin">Admin</Link>
              {getBreadcrumbs().map((b, idx) => (
                <span key={idx}>
                  / {b.href ? <Link href={b.href}>{b.label}</Link> : <span className="active">{b.label}</span>}
                </span>
              ))}
            </nav>
          </div>

          <div className="admin-topbar-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={`Mode aktif: ${theme === "dark" ? "Gelap" : "Terang"}. Klik untuk beralih.`}
              aria-label={`Ubah ke mode ${theme === "dark" ? "terang" : "gelap"}`}
            >
              <span>{theme === "dark" ? "🌙" : "☀️"}</span>
              <span>{theme === "dark" ? "Mode Gelap" : "Mode Terang"}</span>
            </button>
            <Link href="/admin/peluang/tambah" className="admin-btn admin-btn-primary admin-btn-sm">
              <AdminIcon name="plus" size={14} />
              <span>Tambah Peluang</span>
            </Link>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

/* ============================================================
   Overview Screen
   ============================================================ */
export function AdminOverview() {
  const { opportunities = staticOpportunities, saved = [] } = useApp();

  const stats = useMemo(() => {
    const total = opportunities.length;
    const active = opportunities.filter((o) => isOpportunityVisibleForStudent(o)).length;
    const gracePeriod = opportunities.filter((o) => isOpportunityInGracePeriod(o)).length;
    const urgent = opportunities.filter((o) => o.demoDays <= 7 && o.demoDays > 0 && o.status !== "Ditutup").length;
    const beasiswa = opportunities.filter((o) => o.category === "Beasiswa").length;
    const magang = opportunities.filter((o) => o.category === "Magang").length;
    const bootcamp = opportunities.filter((o) => o.category === "Bootcamp").length;

    return { total, active, gracePeriod, urgent, beasiswa, magang, bootcamp };
  }, [opportunities]);

  const recentItems = opportunities.slice(0, 6);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Pengelola Konten</h1>
          <p className="admin-page-subtitle">
            Ringkasan status katalog peluang, masa pendaftaran, dan pemeliharaan data.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/admin/peluang/tambah" className="admin-btn admin-btn-primary">
            <AdminIcon name="plus" size={16} />
            <span>Tambah Program Baru</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Peluang</span>
            <span className="admin-stat-icon"><AdminIcon name="catalog" /></span>
          </div>
          <div className="admin-stat-number">{stats.total}</div>
          <div className="admin-stat-desc">{stats.active} aktif &bull; {stats.gracePeriod} masa tenggang</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Masa Tenggang (2-7 Hari)</span>
            <span className="admin-stat-icon" style={{ background: "rgba(234, 88, 12, 0.12)", color: "#ea580c" }}>
              <AdminIcon name="clock" />
            </span>
          </div>
          <div className="admin-stat-number">{stats.gracePeriod}</div>
          <div className="admin-stat-desc">Lewat deadline &bull; Tersimpan 1 minggu di admin</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Distribusi Kategori</span>
            <span className="admin-stat-icon"><AdminIcon name="dashboard" /></span>
          </div>
          <div className="admin-category-pills">
            <span className="admin-cat-pill beasiswa">{stats.beasiswa} Beasiswa</span>
            <span className="admin-cat-pill magang">{stats.magang} Magang</span>
            <span className="admin-cat-pill bootcamp">{stats.bootcamp} Bootcamp</span>
          </div>
          <div className="admin-stat-desc" style={{ marginTop: "8px" }}>3 kategori utama mahasiswa</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Bookmark Mahasiswa</span>
            <span className="admin-stat-icon"><AdminIcon name="check" /></span>
          </div>
          <div className="admin-stat-number">{saved.length}</div>
          <div className="admin-stat-desc">Peluang disimpan mahasiswa aktif</div>
        </div>
      </div>

      {/* Recent Opportunities */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Peluang Terkini dalam Katalog</h2>
          <Link href="/admin/peluang" className="admin-btn admin-btn-secondary admin-btn-sm">
            Lihat Seluruh Katalog &rarr;
          </Link>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Peluang</th>
                <th>Kategori</th>
                <th>Batas Waktu</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map((item) => {
                const catClass = item.category.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
                const isUrgent = item.demoDays <= 3;
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-table-title">{item.title}</div>
                      <div className="admin-table-org">{item.organization}</div>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge-${catClass}`}>{item.category}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${isUrgent ? "admin-badge-urgent" : "admin-badge-default"}`}>
                        {item.demoDays} Hari lagi
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge admin-status-${(item.status || "Terbit").toLowerCase()}`}>
                        {item.status || "Terbit"}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/peluang/${item.id}/edit`} className="admin-btn admin-btn-secondary admin-btn-sm">
                        <AdminIcon name="edit" size={13} />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Katalog Peluang Table Screen (CRUD List)
   ============================================================ */
export function AdminPeluangTable() {
  const { opportunities = staticOpportunities, updateOpportunity, deleteOpportunity, resetOpportunities } = useApp();
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [scraping, setScraping] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastType, setBroadcastType] = useState("new");
  const [customTitle, setCustomTitle] = useState("");
  const [customOrg, setCustomOrg] = useState("");
  const [customCat, setCustomCat] = useState("Beasiswa");
  const [broadcasting, setBroadcasting] = useState(false);

  const showToast = (msg, duration = 4000) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), duration);
  };

  const handleTriggerBroadcast = async (e) => {
    if (e) e.preventDefault();
    setBroadcasting(true);
    showToast("Sedang menyiarkan notifikasi ke mahasiswa...");
    try {
      if (broadcastType === "new") {
        const res = await fetch("/api/notify/new-opportunity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: customTitle || "Beasiswa Baru Resmi Dibuka",
            organization: customOrg || "Mitra NAVIKA",
            category: customCat,
          }),
        });
        const data = await res.json();
        if (data.success) {
          const emailStatus = data.email?.sent ? `${data.email.totalSent} email diterima penyedia${data.email.failedCount ? `, ${data.email.failedCount} gagal` : ""}` : `email: ${data.email?.error || "tidak ada penerima"}`;
          const pushStatus = data.push?.sent ? "push diterima OneSignal" : `push: ${data.push?.error || "tidak ada penerima"}`;
          showToast(`${emailStatus}; ${pushStatus}.`);
          setShowBroadcastModal(false);
        } else {
          showToast(data.error || "Gagal menyiarkan notifikasi.");
        }
      } else {
        // Trigger deadline reminder
        const res = await fetch("/api/cron/send-reminders?manual=true", {
          method: "POST",
        });
        const data = await res.json();
        if (data.success) {
          const failures = (data.results || []).filter((item) => item.pushError || item.emailError).length;
          const emailNote = data.totalEmailSent ? "" : (data.results || []).find((item) => item.emailError || item.emailNotice);
          const pushNote = data.totalPushSent ? "" : (data.results || []).find((item) => item.pushError || item.pushNotice);
          const reason = [emailNote?.emailError || emailNote?.emailNotice, pushNote?.pushError || pushNote?.pushNotice].filter(Boolean).join("; ");
          showToast(data.totalOpportunities === 0
            ? "Pemeriksaan H-2 selesai: tidak ada peluang dengan deadline H-2."
            : `H-2 diproses: ${data.totalEmailSent || 0} email diterima penyedia, ${data.totalPushSent || 0} pesan dibuat di OneSignal${reason ? `; ${reason}` : failures ? `; ${failures} hasil perlu diperiksa` : ""}.`);
          setShowBroadcastModal(false);
        } else {
          showToast(data.error || "Gagal memicu pengingat deadline.");
        }
      }
    } catch {
      showToast("Terjadi kendala saat mengirim notifikasi.");
    } finally {
      setBroadcasting(false);
    }
  };

  const handleScrapeBeasiswa = async () => {
    setScraping(true);
    showToast("Sedang menarik data beasiswa terbaru dari Indbeasiswa.com...");
    try {
      const res = await fetch("/api/scrape/beasiswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 10 }),
      });
      const data = await res.json();
      if (data.success) {
        const emailStatus = data.broadcastResult?.email?.sent
          ? `${data.broadcastResult.email.totalSent} email diterima penyedia${data.broadcastResult.email.failedCount ? `, ${data.broadcastResult.email.failedCount} gagal` : ""}`
          : `email: ${data.broadcastResult?.email?.error || "siaran tidak dijalankan"}`;
        const pushStatus = data.broadcastResult?.push?.sent
          ? "push diterima OneSignal"
          : `push: ${data.broadcastResult?.push?.error || "siaran tidak dijalankan"}`;
        showToast(`${data.dbResult.processed} beasiswa diproses. ${emailStatus}; ${pushStatus}.`, 6000);
        setTimeout(() => {
          window.location.reload();
        }, 6300);
      } else {
        showToast(data.error || "Gagal menarik data beasiswa.");
      }
    } catch {
      showToast("Terjadi kendala saat menghubungi service scraper.");
    } finally {
      setScraping(false);
    }
  };

  const handleExtendDeadline = (id, extraDays = 7) => {
    updateOpportunity(id, { demoDays: extraDays, status: "Terbit" });
    showToast(`Tenggat program berhasil diperpanjang +${extraDays} hari dan kembali tampil bagi mahasiswa.`);
  };

  const filteredItems = useMemo(() => {
    return opportunities.filter((item) => {
      const matchQuery =
        `${item.title} ${item.organization} ${item.id}`.toLowerCase().includes(query.trim().toLowerCase());
      const matchCat = selectedCat === "Semua" || item.category === selectedCat;
      const itemStatus = item.status || "Terbit";

      let matchStatus = true;
      if (selectedStatus === "Semua") {
        matchStatus = true;
      } else if (selectedStatus === "Aktif") {
        matchStatus = isOpportunityVisibleForStudent(item);
      } else if (selectedStatus === "MasaTenggang") {
        matchStatus = isOpportunityInGracePeriod(item);
      } else if (selectedStatus === "Kedaluwarsa") {
        matchStatus = isOpportunityExpiredOverWeek(item);
      } else {
        matchStatus = itemStatus === selectedStatus;
      }

      return matchQuery && matchCat && matchStatus;
    });
  }, [opportunities, query, selectedCat, selectedStatus]);

  const handleQuickStatus = (id, newStatus) => {
    updateOpportunity(id, { status: newStatus });
    showToast(`Status program berhasil diubah ke "${newStatus}".`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteOpportunity(deleteTarget.id);
    setDeleteTarget(null);
    showToast(`Program "${deleteTarget.title}" telah dihapus.`);
  };

  const handleReset = () => {
    if (window.confirm("Apakah kamu yakin ingin mengembalikan seluruh katalog ke 46 data awal bawaan NAVIKA?")) {
      resetOpportunities();
      showToast("Katalog berhasil dikembalikan ke data default bawaan.");
    }
  };

  return (
    <div>
      {toastMsg && <div className="admin-toast success">{toastMsg}</div>}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Katalog Peluang</h1>
          <p className="admin-page-subtitle">
            Kelola, perbarui syarat, tenggat waktu, atau arsipkan peluang mahasiswa.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={handleScrapeBeasiswa}
            disabled={scraping}
            style={{ borderColor: "#10b981", color: "#065f46", background: "rgba(16, 185, 129, 0.08)" }}
            title="Tarik 10 beasiswa terbaru otomatis dari portal Indbeasiswa.com"
          >
            <AdminIcon name="plus" size={16} />
            <span>{scraping ? "Sedang Menarik..." : "Tarik Beasiswa Terbaru (Scrape)"}</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setShowBroadcastModal(true)}
            title="Buka panel siaran pop-up dan email ke seluruh mahasiswa"
          >
            <AdminIcon name="bell" size={16} />
            <span>Siarkan Notifikasi</span>
          </button>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={handleReset}>
            Reset Data Default
          </button>
          <Link href="/admin/peluang/tambah" className="admin-btn admin-btn-primary">
            <AdminIcon name="plus" size={16} />
            <span>Tambah Peluang Baru</span>
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-table-filters">
            <input
              type="text"
              className="admin-search-input"
              placeholder="Cari judul, mitra, atau ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="admin-select"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              aria-label="Filter kategori"
            >
              <option value="Semua">Semua Kategori</option>
              {categories.filter((c) => c !== "Semua").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="admin-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter status"
            >
              <option value="Semua">Semua Status & Tenggat</option>
              <option value="Aktif">Aktif (Tampil Mahasiswa)</option>
              <option value="MasaTenggang">Masa Tenggang (Lewat 2-7 Hari)</option>
              <option value="Kedaluwarsa">Kedaluwarsa (&gt; 1 Minggu)</option>
              <option value="Terbit">Status: Terbit</option>
              <option value="Draft">Status: Draft</option>
              <option value="Ditutup">Status: Ditutup</option>
              <option value="Diarsipkan">Status: Diarsipkan</option>
            </select>
          </div>
          <span style={{ fontSize: "13px", color: "var(--teks-sekunder)" }}>
            Menampilkan <strong>{filteredItems.length}</strong> dari {opportunities.length} entri
          </span>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Program & Penyelenggara</th>
                <th>Kategori</th>
                <th>Batas Pendaftaran</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const catClass = item.category.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
                  const currentStatus = item.status || "Terbit";
                  const isUrgent = item.demoDays <= 3;
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="admin-table-title">
                          {item.title}
                          {item.recommended && (
                            <span style={{ marginLeft: "6px", fontSize: "11px", color: "var(--biru-aksi)", fontWeight: 700 }}>
                              ★ REKOMENDASI
                            </span>
                          )}
                        </div>
                        <div className="admin-table-org">
                          {item.organization} &bull; <small>ID: {item.id}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge admin-badge-${catClass}`}>{item.category}</span>
                      </td>
                      <td>
                        {item.demoDays > 0 ? (
                          <span className={`admin-badge ${isUrgent ? "admin-badge-urgent" : "admin-badge-default"}`}>
                            {item.demoDays} Hari lagi
                          </span>
                        ) : item.demoDays === 0 ? (
                          <span className="admin-badge admin-badge-urgent">
                            Batas Hari Ini
                          </span>
                        ) : isOpportunityInGracePeriod(item) ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            <span className="admin-badge admin-badge-urgent" style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>
                              Tutup {Math.abs(item.demoDays)}h lalu
                            </span>
                            <small style={{ fontSize: "11px", color: "#ea580c", fontWeight: 600 }}>
                              Masa tenggang sisa {7 - Math.abs(item.demoDays)}h
                            </small>
                          </div>
                        ) : (
                          <span className="admin-badge admin-badge-default" style={{ opacity: 0.65 }}>
                            Lewat {Math.abs(item.demoDays)}h lalu
                          </span>
                        )}
                      </td>
                      <td>
                        <select
                          className="admin-select"
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                          value={currentStatus}
                          onChange={(e) => handleQuickStatus(item.id, e.target.value)}
                        >
                          <option value="Terbit">Terbit</option>
                          <option value="Draft">Draft</option>
                          <option value="Ditutup">Ditutup</option>
                          <option value="Diarsipkan">Diarsipkan</option>
                        </select>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          {item.demoDays <= 2 && (
                            <button
                              type="button"
                              className="admin-btn admin-btn-sm"
                              onClick={() => handleExtendDeadline(item.id, 7)}
                              title="Perpanjang deadline +7 hari agar kembali aktif untuk mahasiswa"
                              style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", fontWeight: 700 }}
                            >
                              +7h
                            </button>
                          )}
                          <Link
                            href={`/admin/peluang/${item.id}/edit`}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="Edit peluang"
                          >
                            <AdminIcon name="edit" size={13} />
                            <span>Edit</span>
                          </Link>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => setDeleteTarget(item)}
                            title="Hapus peluang"
                          >
                            <AdminIcon name="trash" size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "36px", color: "var(--teks-sekunder)" }}>
                    Tidak ada data peluang yang sesuai dengan filter atau kata kunci.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Siaran Notifikasi Pop-up & Email */}
      {showBroadcastModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "520px" }}>
            <h2 className="admin-modal-title" style={{ fontSize: "1.25rem", margin: "0 0 8px" }}>
              Pusat Siaran Notifikasi Mahasiswa
            </h2>
            <p className="admin-modal-desc" style={{ marginBottom: "18px" }}>
              Kirimkan notifikasi langsung berupa <strong>Pop-up Web Push</strong> ke HP/browser serta <strong>Email</strong> kepada seluruh mahasiswa terdaftar.
            </p>

            <form onSubmit={handleTriggerBroadcast}>
              <div className="admin-form-group" style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 700, fontSize: "13px" }}>
                  Pilih Jenis Siaran
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setBroadcastType("new")}
                    className={`admin-btn admin-btn-sm ${broadcastType === "new" ? "admin-btn-primary" : "admin-btn-secondary"}`}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    📢 Info Peluang Baru
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastType("deadline")}
                    className={`admin-btn admin-btn-sm ${broadcastType === "deadline" ? "admin-btn-primary" : "admin-btn-secondary"}`}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    ⏰ Pengingat Deadline (H-2)
                  </button>
                </div>
              </div>

              {broadcastType === "new" ? (
                <>
                  <div className="admin-form-group" style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600 }}>
                      Judul Program / Peluang *
                    </label>
                    <input
                      className="admin-input"
                      placeholder="Contoh: Beasiswa Bank Indonesia 2026"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600 }}>
                      Penyelenggara / Mitra *
                    </label>
                    <input
                      className="admin-input"
                      placeholder="Contoh: Bank Indonesia"
                      value={customOrg}
                      onChange={(e) => setCustomOrg(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600 }}>
                      Kategori Peluang
                    </label>
                    <select
                      className="admin-select"
                      style={{ width: "100%" }}
                      value={customCat}
                      onChange={(e) => setCustomCat(e.target.value)}
                    >
                      <option value="Beasiswa">Beasiswa</option>
                      <option value="Magang">Magang</option>
                      <option value="Bootcamp">Bootcamp</option>
                    </select>
                  </div>
                </>
              ) : (
                <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                  <p style={{ margin: "0 0 8px", fontSize: "13px", color: "var(--teks)" }}>
                    Sistem akan memindai seluruh katalog peluang aktif dan mengirimkan notifikasi <strong>Pop-up & Email Pengingat Deadline</strong> kepada mahasiswa untuk program yang batas pendaftarannya ditutup dalam <strong>2 hari ke depan (H-2)</strong>.
                  </p>
                  <small style={{ color: "#ea580c", fontWeight: 600 }}>
                    💡 Notifikasi ini juga berjalan otomatis setiap hari via server cron.
                  </small>
                </div>
              )}

              <div className="admin-modal-actions" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowBroadcastModal(false)}
                  disabled={broadcasting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={broadcasting}
                >
                  {broadcasting ? "Mengirimkan Siaran..." : "Kirimkan Notifikasi Sekarang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Konfirmasi Penghapusan</h3>
            <p>
              Apakah Anda yakin ingin menghapus peluang <strong>"{deleteTarget.title}"</strong> ({deleteTarget.organization})?
              Data yang dihapus tidak dapat dipulihkan kecuali mereset ulang seluruh katalog ke bawaan.
            </p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={confirmDelete}
              >
                Hapus Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Form Screen (Create & Edit Opportunity)
   ============================================================ */
export function AdminPeluangForm({ mode = "create", id = null }) {
  const router = useRouter();
  const { opportunities = staticOpportunities, addOpportunity, updateOpportunity } = useApp();

  const existing = mode === "edit" ? opportunities.find((o) => o.id === id) : null;

  const [title, setTitle] = useState(existing?.title || "");
  const [organization, setOrganization] = useState(existing?.organization || "");
  const [category, setCategory] = useState(existing?.category || "Beasiswa");
  const [field, setField] = useState(existing?.field || "Umum");
  const [sourceUrl, setSourceUrl] = useState(existing?.sourceUrl || "https://");
  const [demoDays, setDemoDays] = useState(existing?.demoDays ?? 10);
  const [status, setStatus] = useState(existing?.status || "Terbit");
  const [recommended, setRecommended] = useState(existing?.recommended ?? false);
  const [summary, setSummary] = useState(existing?.summary || "");

  const [requirements, setRequirements] = useState(
    existing?.requirements?.length ? [...existing.requirements] : [""]
  );
  const [benefits, setBenefits] = useState(
    existing?.benefits?.length ? [...existing.benefits] : [""]
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddReq = () => setRequirements([...requirements, ""]);
  const handleReqChange = (idx, val) => {
    const next = [...requirements];
    next[idx] = val;
    setRequirements(next);
  };
  const handleRemoveReq = (idx) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleAddBen = () => setBenefits([...benefits, ""]);
  const handleBenChange = (idx, val) => {
    const next = [...benefits];
    next[idx] = val;
    setBenefits(next);
  };
  const handleRemoveBen = (idx) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) {
      setErrorMessage("Judul peluang dan nama penyelenggara wajib diisi.");
      return;
    }
    if (!sourceUrl.startsWith("http://") && !sourceUrl.startsWith("https://")) {
      setErrorMessage("URL sumber resmi harus diawali dengan http:// atau https://.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      title: title.trim(),
      organization: organization.trim(),
      category,
      field: field.trim() || "Umum",
      sourceUrl: sourceUrl.trim(),
      demoDays: Number(demoDays) || 5,
      status,
      recommended: Boolean(recommended),
      summary: summary.trim(),
      requirements: requirements.map((r) => r.trim()).filter(Boolean),
      benefits: benefits.map((b) => b.trim()).filter(Boolean),
    };

    try {
      if (mode === "create") {
        const slugId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `opp-${Date.now()}`;
        await addOpportunity({ id: slugId, ...payload });
      } else {
        await updateOpportunity(id, payload);
      }
      router.push("/admin/peluang");
    } catch {
      setIsSubmitting(false);
      setErrorMessage("Gagal menyimpan peluang. Silakan coba kembali.");
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {mode === "create" ? "Tambah Peluang Baru" : `Edit Peluang: ${existing?.title || id}`}
          </h1>
          <p className="admin-page-subtitle">
            {mode === "create"
              ? "Lengkapi informasi program untuk diterbitkan ke katalog mahasiswa."
              : "Perbarui syarat pendaftaran, batas waktu, atau deskripsi program."}
          </p>
        </div>
      </div>

      {errorMessage && (
        <div style={{ background: "var(--merah-bg)", color: "var(--merah)", padding: "12px 18px", borderRadius: "8px", marginBottom: "20px", fontWeight: 600 }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          {/* Main Column */}
          <div>
            <div className="admin-form-section">
              <h2 className="admin-form-section-title">Informasi Dasar Peluang</h2>
              <div className="admin-form-group">
                <label htmlFor="opp-title">Nama / Judul Peluang *</label>
                <input
                  id="opp-title"
                  className="admin-input"
                  placeholder="Contoh: Djarum Beasiswa Plus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="opp-org">Penyelenggara / Mitra Perusahaan *</label>
                <input
                  id="opp-org"
                  className="admin-input"
                  placeholder="Contoh: Djarum Foundation"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="opp-url">Tautan Website Resmi (Sumber Pendaftaran) *</label>
                <input
                  id="opp-url"
                  type="url"
                  className="admin-input"
                  placeholder="https://..."
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  required
                />
                <p className="form-hint">Mahasiswa akan diarahkan ke URL ini saat mengklik "Kunjungi Website Resmi".</p>
              </div>

              <div className="admin-form-group">
                <label htmlFor="opp-summary">Deskripsi Singkat / Ringkasan Program</label>
                <textarea
                  id="opp-summary"
                  className="admin-textarea"
                  placeholder="Tuliskan gambaran umum tentang peluang ini..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
            </div>

            {/* Requirements & Benefits */}
            <div className="admin-form-section">
              <h2 className="admin-form-section-title">Persyaratan Pelamar</h2>
              <div className="admin-dynamic-list">
                {requirements.map((req, idx) => (
                  <div key={idx} className="admin-dynamic-item">
                    <input
                      className="admin-input"
                      placeholder={`Syarat #${idx + 1}`}
                      value={req}
                      onChange={(e) => handleReqChange(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleRemoveReq(idx)}
                      disabled={requirements.length === 1}
                      title="Hapus baris syarat"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{ marginTop: "12px" }}
                onClick={handleAddReq}
              >
                + Tambah Baris Syarat
              </button>
            </div>

            <div className="admin-form-section">
              <h2 className="admin-form-section-title">Manfaat & Fasilitas (Benefits)</h2>
              <div className="admin-dynamic-list">
                {benefits.map((ben, idx) => (
                  <div key={idx} className="admin-dynamic-item">
                    <input
                      className="admin-input"
                      placeholder={`Manfaat #${idx + 1}`}
                      value={ben}
                      onChange={(e) => handleBenChange(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleRemoveBen(idx)}
                      disabled={benefits.length === 1}
                      title="Hapus baris manfaat"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{ marginTop: "12px" }}
                onClick={handleAddBen}
              >
                + Tambah Baris Manfaat
              </button>
            </div>
          </div>

          {/* Side Column (Meta & Publish Settings) */}
          <div>
            <div className="admin-form-section">
              <h2 className="admin-form-section-title">Pengaturan Publikasi</h2>

              <div className="admin-form-group">
                <label htmlFor="opp-category">Kategori Utama</label>
                <select
                  id="opp-category"
                  className="admin-select"
                  style={{ width: "100%" }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Beasiswa">Beasiswa</option>
                  <option value="Magang">Magang</option>
                  <option value="Bootcamp">Bootcamp</option>
                  <option value="Studi Independen">Studi Independen</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar / Webinar">Seminar / Webinar</option>
                  <option value="Kompetisi">Kompetisi</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="opp-field">Bidang Keahlian / Jurusan</label>
                <input
                  id="opp-field"
                  className="admin-input"
                  placeholder="Contoh: Umum, Teknologi Informasi, Desain"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="opp-status">Status Publikasi</label>
                <select
                  id="opp-status"
                  className="admin-select"
                  style={{ width: "100%" }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Terbit">Terbit (Tampil di Mahasiswa)</option>
                  <option value="Draft">Draft (Belum Terbit)</option>
                  <option value="Ditutup">Ditutup (Pendaftaran Tutup)</option>
                  <option value="Diarsipkan">Diarsipkan</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="opp-days">Masa Berlaku Pendaftaran (Hari)</label>
                <input
                  id="opp-days"
                  type="number"
                  min="0"
                  max="90"
                  className="admin-input"
                  value={demoDays}
                  onChange={(e) => setDemoDays(e.target.value)}
                />
                <p className="form-hint">Digunakan untuk urutan batas pendaftaran di dashboard dan kalender.</p>
              </div>

              <div className="admin-form-group" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px" }}>
                <input
                  type="checkbox"
                  id="opp-rec"
                  checked={recommended}
                  onChange={(e) => setRecommended(e.target.checked)}
                  style={{ width: "18px", height: "18px" }}
                />
                <label htmlFor="opp-rec" style={{ margin: 0, cursor: "pointer" }}>
                  Tandai sebagai <strong>REKOMENDASI</strong>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="admin-form-section">
              <button
                type="submit"
                disabled={isSubmitting}
                className="admin-btn admin-btn-primary"
                style={{ width: "100%", justifyContent: "center", marginBottom: "10px", opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting
                  ? "Menyimpan & Menyiarkan Notifikasi..."
                  : mode === "create"
                  ? "Terbitkan Peluang Baru"
                  : "Simpan Perubahan"}
              </button>
              <Link
                href="/admin/peluang"
                className="admin-btn admin-btn-secondary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Batalkan
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
   Admin Arsip Table Screen (/admin/arsip)
   ============================================================ */
export function AdminArsipTable() {
  const { opportunities = staticOpportunities, updateOpportunity, deleteOpportunity } = useApp();
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("Semua");
  const [selectedStage, setSelectedStage] = useState("Semua");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleRestore = (item, days = 7) => {
    updateOpportunity(item.id, { demoDays: days, status: "Terbit" });
    showToast(`Program "${item.title}" berhasil diaktifkan kembali (+${days} hari) dan tampil untuk mahasiswa.`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteOpportunity(deleteTarget.id);
    setDeleteTarget(null);
    showToast(`Program "${deleteTarget.title}" telah dihapus permanen.`);
  };

  const archivedItems = useMemo(() => {
    return opportunities.filter((item) => {
      // Masuk arsip jika: diarsipkan, ditutup, atau lewat deadline lebih dari 2 hari
      const isArchivedStatus = item.status === "Diarsipkan" || item.status === "Ditutup";
      const isPastGrace = typeof item.demoDays === "number" && item.demoDays < -2;
      return isArchivedStatus || isPastGrace;
    });
  }, [opportunities]);

  const filteredItems = useMemo(() => {
    return archivedItems.filter((item) => {
      const matchQuery =
        `${item.title} ${item.organization} ${item.id}`.toLowerCase().includes(query.trim().toLowerCase());
      const matchCat = selectedCat === "Semua" || item.category === selectedCat;

      let matchStage = true;
      if (selectedStage === "MasaTenggang") {
        matchStage = isOpportunityInGracePeriod(item);
      } else if (selectedStage === "Kedaluwarsa") {
        matchStage = isOpportunityExpiredOverWeek(item);
      } else if (selectedStage === "Diarsipkan") {
        matchStage = item.status === "Diarsipkan";
      }

      return matchQuery && matchCat && matchStage;
    });
  }, [archivedItems, query, selectedCat, selectedStage]);

  const graceCount = archivedItems.filter((i) => isOpportunityInGracePeriod(i)).length;
  const expiredCount = archivedItems.filter((i) => isOpportunityExpiredOverWeek(i)).length;

  return (
    <div>
      {toastMsg && <div className="admin-toast success">{toastMsg}</div>}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Arsip & Riwayat Peluang</h1>
          <p className="admin-page-subtitle">
            Peluang yang telah melewati batas deadline pendaftaran (&gt;2 hari), masa tenggang, atau diarsipkan manual.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/admin/peluang" className="admin-btn admin-btn-secondary">
            &larr; Kembali ke Katalog Aktif
          </Link>
        </div>
      </div>

      {/* Mini Stats Arsip */}
      <div className="admin-stats-grid" style={{ marginBottom: "20px" }}>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Dalam Arsip</span>
            <span className="admin-stat-icon"><AdminIcon name="archive" /></span>
          </div>
          <div className="admin-stat-number">{archivedItems.length}</div>
          <div className="admin-stat-desc">Tidak tampil di layar mahasiswa</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Masa Tenggang (2-7 Hari)</span>
            <span className="admin-stat-icon" style={{ background: "rgba(234, 88, 12, 0.12)", color: "#ea580c" }}>
              <AdminIcon name="clock" />
            </span>
          </div>
          <div className="admin-stat-number">{graceCount}</div>
          <div className="admin-stat-desc">Dapat dipulihkan sebelum arsip permanen</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Kedaluwarsa (&gt; 1 Minggu)</span>
            <span className="admin-stat-icon" style={{ background: "#f3f4f6", color: "#6b7280" }}>
              <AdminIcon name="trash" />
            </span>
          </div>
          <div className="admin-stat-number">{expiredCount}</div>
          <div className="admin-stat-desc">Peluang lewat batas toleransi</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-table-filters">
            <input
              type="text"
              className="admin-search-input"
              placeholder="Cari arsip program atau mitra..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="admin-select"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              aria-label="Filter kategori arsip"
            >
              <option value="Semua">Semua Kategori</option>
              {categories.filter((c) => c !== "Semua").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="admin-select"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              aria-label="Filter status arsip"
            >
              <option value="Semua">Semua Status Arsip</option>
              <option value="MasaTenggang">Masa Tenggang (2-7 Hari)</option>
              <option value="Kedaluwarsa">Kedaluwarsa (&gt; 1 Minggu)</option>
              <option value="Diarsipkan">Diarsipkan Manual</option>
            </select>
          </div>
          <span style={{ fontSize: "13px", color: "var(--teks-sekunder)" }}>
            Menampilkan <strong>{filteredItems.length}</strong> dari {archivedItems.length} arsip
          </span>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Program & Penyelenggara</th>
                <th>Kategori</th>
                <th>Status Tenggat Arsip</th>
                <th>Aksi Pemulihan</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const catClass = item.category.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
                  const inGrace = isOpportunityInGracePeriod(item);
                  const expired = isOpportunityExpiredOverWeek(item);
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="admin-table-title">{item.title}</div>
                        <div className="admin-table-org">
                          {item.organization} &bull; <small>ID: {item.id}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge admin-badge-${catClass}`}>{item.category}</span>
                      </td>
                      <td>
                        {inGrace ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            <span className="admin-badge admin-badge-urgent" style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>
                              Tutup {Math.abs(item.demoDays)}h lalu
                            </span>
                            <small style={{ fontSize: "11px", color: "#ea580c", fontWeight: 600 }}>
                              Masa tenggang sisa {7 - Math.abs(item.demoDays)}h
                            </small>
                          </div>
                        ) : expired ? (
                          <span className="admin-badge admin-badge-default" style={{ opacity: 0.7 }}>
                            Kedaluwarsa {Math.abs(item.demoDays)}h lalu
                          </span>
                        ) : (
                          <span className="admin-badge admin-badge-default">
                            {item.status || "Diarsipkan"}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button
                            type="button"
                            className="admin-btn admin-btn-sm"
                            onClick={() => handleRestore(item, 7)}
                            title="Aktifkan kembali peluang ini selama 7 hari agar muncul lagi di web mahasiswa"
                            style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", fontWeight: 700 }}
                          >
                            Pulihkan (+7h)
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => setDeleteTarget(item)}
                            title="Hapus arsip ini secara permanen"
                          >
                            <AdminIcon name="trash" size={13} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "var(--teks-redup)" }}>
                    Tidak ada peluang dalam arsip pada filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h2 className="admin-modal-title">Hapus Arsip Permanen?</h2>
            <p className="admin-modal-desc">
              Peluang <strong>"{deleteTarget.title}"</strong> akan dihapus permanen dari sistem dan database.
            </p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Batalkan
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={confirmDelete}
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Admin Mahasiswa Table Screen (/admin/mahasiswa)
   ============================================================ */
export function AdminMahasiswaTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.warn("Gagal mengambil data user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Akun "${deleteTarget.name}" (${deleteTarget.email}) berhasil dihapus.`);
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        if (selectedStudent?.id === deleteTarget.id) {
          setSelectedStudent(null);
        }
      } else {
        showToast(data.error || "Gagal menghapus pengguna.");
      }
    } catch {
      showToast("Terjadi kesalahan saat menghapus pengguna.");
    } finally {
      setDeleteTarget(null);
    }
  };

  // Khusus akun mahasiswa untuk menu Kelola Mahasiswa
  const students = useMemo(() => {
    return users.filter((u) => u.role === "mahasiswa");
  }, [users]);

  const filteredStudents = useMemo(() => {
    return students.filter((u) => {
      const text = `${u.name} ${u.email} ${u.university} ${u.major}`.toLowerCase();
      return text.includes(query.trim().toLowerCase());
    });
  }, [students, query]);

  const totalSavedCount = students.reduce((acc, curr) => acc + (curr.saved_count || 0), 0);
  const validGpas = students.map((u) => parseFloat(u.gpa)).filter((g) => !isNaN(g) && g > 0);
  const avgGpa = validGpas.length
    ? (validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2)
    : "3.82";

  const getApplicationStatusLabel = (status) => {
    switch (status) {
      case "tertarik":
        return { label: "Tertarik", badgeClass: "status-tertarik" };
      case "sedang_disiapkan":
        return { label: "Sedang Disiapkan", badgeClass: "status-disiapkan" };
      case "sudah_mendaftar":
        return { label: "Sudah Mendaftar", badgeClass: "status-terdaftar" };
      case "diterima":
        return { label: "Diterima 🎉", badgeClass: "status-diterima" };
      case "ditolak":
        return { label: "Ditolak", badgeClass: "status-ditolak" };
      case "tidak_dilanjutkan":
        return { label: "Tidak Dilanjutkan", badgeClass: "status-ditolak" };
      default:
        return { label: status || "Disimpan", badgeClass: "status-tertarik" };
    }
  };

  return (
    <div>
      {toastMsg && <div className="admin-toast success">{toastMsg}</div>}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kelola Mahasiswa</h1>
          <p className="admin-page-subtitle">
            Daftar akun mahasiswa terdaftar, data profil akademik, serta pantauan peluang yang diambil atau disimpan.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchUsers}
            disabled={loading}
          >
            {loading ? "Memuat..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {/* Mini Stats Mahasiswa */}
      <div className="admin-stats-grid" style={{ marginBottom: "20px" }}>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Mahasiswa Terdaftar</span>
            <span className="admin-stat-icon"><AdminIcon name="users" /></span>
          </div>
          <div className="admin-stat-number">{students.length}</div>
          <div className="admin-stat-desc">Akun mahasiswa aktif</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Peluang Diambil / Disimpan</span>
            <span className="admin-stat-icon" style={{ background: "rgba(0, 103, 166, 0.12)", color: "var(--biru-aksi)" }}>
              <AdminIcon name="catalog" />
            </span>
          </div>
          <div className="admin-stat-number">{totalSavedCount}</div>
          <div className="admin-stat-desc">Total pelacakan aktif oleh mahasiswa</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Rata-rata IPK Mahasiswa</span>
            <span className="admin-stat-icon" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
              <AdminIcon name="check" />
            </span>
          </div>
          <div className="admin-stat-number">{avgGpa}</div>
          <div className="admin-stat-desc">Dari seluruh data profil terisi</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-table-filters">
            <input
              type="text"
              className="admin-search-input"
              placeholder="Cari nama mahasiswa, email, kampus, atau jurusan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ minWidth: "320px" }}
            />
          </div>
          <span style={{ fontSize: "13px", color: "var(--teks-sekunder)" }}>
            Menampilkan <strong>{filteredStudents.length}</strong> dari {students.length} mahasiswa
          </span>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama & Email Mahasiswa</th>
                <th>Universitas & Program Studi</th>
                <th>Semester & IPK</th>
                <th>Peluang Diambil</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--teks-redup)" }}>
                    Sedang memuat data akun mahasiswa...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((u) => {
                  const savedCount = u.saved_count || (u.saved_opportunities ? u.saved_opportunities.length : 0);
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="admin-table-title">{u.name}</div>
                        <div className="admin-table-org">{u.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{u.university}</div>
                        <small style={{ color: "var(--teks-sekunder)" }}>{u.major}</small>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {u.semester ? `Semester ${u.semester}` : "-"} &bull; IPK: {u.gpa}
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-badge admin-badge-blue"
                          onClick={() => setSelectedStudent(u)}
                          title="Klik untuk melihat daftar peluang yang diambil mahasiswa ini"
                          style={{ cursor: "pointer", border: "none" }}
                        >
                          {savedCount} Peluang Diambil
                        </button>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={() => setSelectedStudent(u)}
                            title="Lihat data profil dan peluang mahasiswa ini"
                          >
                            <AdminIcon name="eye" size={14} />
                            <span>Detail</span>
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => setDeleteTarget(u)}
                            title="Hapus akun mahasiswa ini"
                          >
                            <AdminIcon name="trash" size={13} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--teks-redup)" }}>
                    Tidak ada data mahasiswa yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Profil & Peluang Mahasiswa */}
      {selectedStudent && (
        <div className="admin-modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div
            className="admin-modal admin-modal-lg"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "780px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>{selectedStudent.name}</h2>
                  <span className="admin-badge admin-badge-default">🎓 Mahasiswa</span>
                </div>
                <div style={{ color: "var(--teks-sekunder)", fontSize: "14px" }}>{selectedStudent.email}</div>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => setSelectedStudent(null)}
                aria-label="Tutup detail mahasiswa"
                style={{ padding: "6px 10px" }}
              >
                <AdminIcon name="close" size={16} />
              </button>
            </div>

            {/* Grid Informasi Profil Mahasiswa */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 12px", color: "var(--teks-utama)" }}>
                Data Profil Akademik
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "12px",
                  background: "var(--admin-bg)",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-halus)",
                }}
              >
                <div>
                  <span style={{ fontSize: "12px", color: "var(--teks-redup)", display: "block" }}>Universitas</span>
                  <strong style={{ fontSize: "14px" }}>{selectedStudent.university}</strong>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "var(--teks-redup)", display: "block" }}>Program Studi / Jurusan</span>
                  <strong style={{ fontSize: "14px" }}>{selectedStudent.major}</strong>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "var(--teks-redup)", display: "block" }}>Semester</span>
                  <strong style={{ fontSize: "14px" }}>{selectedStudent.semester ? `Semester ${selectedStudent.semester}` : "-"}</strong>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "var(--teks-redup)", display: "block" }}>Indeks Prestasi Kumulatif (IPK)</span>
                  <strong style={{ fontSize: "14px", color: "#10b981" }}>{selectedStudent.gpa}</strong>
                </div>
              </div>

              {selectedStudent.interests && selectedStudent.interests.length > 0 && (
                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12px", color: "var(--teks-redup)" }}>Minat Kategori:</span>
                  {selectedStudent.interests.map((int, idx) => (
                    <span key={idx} className="admin-badge admin-badge-default" style={{ fontSize: "12px" }}>
                      {int}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Seksi Peluang yang Diambil */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 600, margin: 0, color: "var(--teks-utama)" }}>
                  Peluang yang Diambil & Dipantau ({selectedStudent.saved_opportunities?.length || 0})
                </h3>
              </div>

              {selectedStudent.saved_opportunities && selectedStudent.saved_opportunities.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {selectedStudent.saved_opportunities.map((opp, idx) => {
                    const statusInfo = getApplicationStatusLabel(opp.application_status);
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "14px 16px",
                          background: "var(--admin-surface)",
                          borderRadius: "10px",
                          border: "1px solid var(--border-halus)",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: "220px" }}>
                          <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--teks-utama)", marginBottom: "3px" }}>
                            {opp.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--teks-sekunder)" }}>
                            Penyelenggara: <strong>{opp.provider}</strong> &bull; Kategori: <strong>{opp.category}</strong>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span className={`admin-app-status-badge ${statusInfo.badgeClass}`}>
                            {statusInfo.label}
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--teks-redup)", whiteSpace: "nowrap" }}>
                            Deadline: {opp.deadline || "-"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    background: "var(--admin-bg)",
                    borderRadius: "10px",
                    color: "var(--teks-redup)",
                    fontSize: "14px",
                  }}
                >
                  Mahasiswa ini belum mengambil atau menyimpan peluang apa pun di NAVIKA.
                </div>
              )}
            </div>

            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedStudent(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Akun */}
      {deleteTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2 className="admin-modal-title">Hapus Akun Pengguna?</h2>
            <p className="admin-modal-desc">
              Akun <strong>"{deleteTarget.name}"</strong> ({deleteTarget.email}) akan dihapus permanen dari sistem autentikasi dan database.
            </p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Batalkan
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={confirmDeleteUser}
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Admin Role Management Screen (/admin/peran)
   ============================================================ */
export function AdminRoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pengelola"); // "pengelola" | "mahasiswa"
  const [query, setQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [roleChangeTarget, setRoleChangeTarget] = useState(null); // { user, newRole }

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.warn("Gagal mengambil data user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmRoleChange = async () => {
    if (!roleChangeTarget) return;
    const { user, newRole } = roleChangeTarget;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Hak akses akun "${user.name}" berhasil diubah menjadi "${newRole}".`);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
      } else {
        showToast(data.error || "Gagal memperbarui peran.");
      }
    } catch {
      showToast("Terjadi kendala saat mengubah hak akses pengguna.");
    } finally {
      setRoleChangeTarget(null);
    }
  };

  const admins = useMemo(() => users.filter((u) => u.role === "pengelola"), [users]);
  const students = useMemo(() => users.filter((u) => u.role === "mahasiswa"), [users]);

  const displayedUsers = useMemo(() => {
    const baseList = activeTab === "pengelola" ? admins : students;
    return baseList.filter((u) => {
      const text = `${u.name} ${u.email} ${u.university || ""} ${u.major || ""}`.toLowerCase();
      return text.includes(query.trim().toLowerCase());
    });
  }, [activeTab, admins, students, query]);

  return (
    <div>
      {toastMsg && <div className="admin-toast success">{toastMsg}</div>}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kelola Peran & Akses</h1>
          <p className="admin-page-subtitle">
            Pantau dan kontrol hak akses akun pengelola (admin) dan mahasiswa secara terpisah, serta ubah perannya bila diperlukan.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchUsers}
            disabled={loading}
          >
            {loading ? "Memuat..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {/* Mini Stats Peran */}
      <div className="admin-stats-grid" style={{ marginBottom: "20px" }}>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Akun Pengelola (Admin)</span>
            <span className="admin-stat-icon" style={{ background: "rgba(0, 103, 166, 0.12)", color: "var(--biru-aksi)" }}>
              <AdminIcon name="shield" />
            </span>
          </div>
          <div className="admin-stat-number">{admins.length}</div>
          <div className="admin-stat-desc">Akses penuh panel admin</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Akun Mahasiswa</span>
            <span className="admin-stat-icon" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
              <AdminIcon name="users" />
            </span>
          </div>
          <div className="admin-stat-number">{students.length}</div>
          <div className="admin-stat-desc">Pengguna reguler portal NAVIKA</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Akun Terdaftar</span>
            <span className="admin-stat-icon"><AdminIcon name="dashboard" /></span>
          </div>
          <div className="admin-stat-number">{users.length}</div>
          <div className="admin-stat-desc">Seluruh identitas di database</div>
        </div>
      </div>

      {/* Tab Switcher: Akun Pengelola vs Akun Mahasiswa */}
      <div className="admin-card">
        <div className="admin-role-tabs">
          <button
            type="button"
            className={`admin-role-tab ${activeTab === "pengelola" ? "active" : ""}`}
            onClick={() => setActiveTab("pengelola")}
          >
            <AdminIcon name="shield" size={16} />
            <span>Akun Pengelola ({admins.length})</span>
          </button>
          <button
            type="button"
            className={`admin-role-tab ${activeTab === "mahasiswa" ? "active" : ""}`}
            onClick={() => setActiveTab("mahasiswa")}
          >
            <AdminIcon name="users" size={16} />
            <span>Akun Mahasiswa ({students.length})</span>
          </button>
        </div>

        <div className="admin-card-header">
          <div className="admin-table-filters">
            <input
              type="text"
              className="admin-search-input"
              placeholder={`Cari nama atau email akun ${activeTab}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ minWidth: "300px" }}
            />
          </div>
          <span style={{ fontSize: "13px", color: "var(--teks-sekunder)" }}>
            Menampilkan <strong>{displayedUsers.length}</strong> akun {activeTab}
          </span>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama & Email</th>
                <th>{activeTab === "pengelola" ? "Instansi / Departemen" : "Universitas & Jurusan"}</th>
                <th>Status Hak Akses</th>
                <th>Terdaftar & Aktivitas</th>
                <th>Tindakan Peran</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--teks-redup)" }}>
                    Sedang memuat data akun {activeTab}...
                  </td>
                </tr>
              ) : displayedUsers.length > 0 ? (
                displayedUsers.map((u) => {
                  const isPrimaryAdmin =
                    u.email === "admin@navika.id" ||
                    u.email === "limingerr681@gmail.com" ||
                    u.email === "navika01112026@gmail.com";

                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="admin-table-title">{u.name}</div>
                        <div className="admin-table-org">{u.email}</div>
                      </td>
                      <td>
                        {activeTab === "pengelola" ? (
                          <div style={{ fontWeight: 600 }}>{u.university || "Pusat Pengelola NAVIKA"}</div>
                        ) : (
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.university}</div>
                            <small style={{ color: "var(--teks-sekunder)" }}>{u.major}</small>
                          </div>
                        )}
                      </td>
                      <td>
                        {u.role === "pengelola" ? (
                          <span className="admin-badge admin-badge-blue">🛡️ Pengelola / Admin</span>
                        ) : (
                          <span className="admin-badge admin-badge-default">🎓 Mahasiswa</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: "13px" }}>
                          Dibuat: {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID") : "-"}
                        </div>
                        <small style={{ color: "var(--teks-redup)" }}>
                          Login: {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("id-ID") : "-"}
                        </small>
                      </td>
                      <td>
                        {activeTab === "pengelola" ? (
                          isPrimaryAdmin ? (
                            <span
                              className="admin-badge"
                              style={{ background: "rgba(0,0,0,0.06)", color: "var(--teks-redup)" }}
                              title="Akun admin utama dilindungi"
                            >
                              🔒 Akun Utama Dilindungi
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              onClick={() => setRoleChangeTarget({ user: u, newRole: "mahasiswa" })}
                              title="Turunkan hak akses akun ini menjadi mahasiswa"
                            >
                              <span>Turunkan ke Mahasiswa</span>
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => setRoleChangeTarget({ user: u, newRole: "pengelola" })}
                            title="Promosikan akun ini menjadi pengelola panel admin"
                          >
                            <AdminIcon name="shield" size={14} />
                            <span>Jadikan Pengelola</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--teks-redup)" }}>
                    Tidak ada akun {activeTab} yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Ubah Peran */}
      {roleChangeTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2 className="admin-modal-title">
              {roleChangeTarget.newRole === "pengelola"
                ? "Promosikan Jadi Pengelola?"
                : "Turunkan Jadi Mahasiswa?"}
            </h2>
            <p className="admin-modal-desc">
              {roleChangeTarget.newRole === "pengelola" ? (
                <>
                  Akun <strong>"{roleChangeTarget.user.name}"</strong> ({roleChangeTarget.user.email}) akan diberikan hak akses penuh ke Panel Admin NAVIKA untuk mengelola katalog peluang, arsip, dan akun pengguna.
                </>
              ) : (
                <>
                  Akun <strong>"{roleChangeTarget.user.name}"</strong> ({roleChangeTarget.user.email}) tidak akan dapat lagi mengakses Panel Admin NAVIKA dan hak aksesnya akan diubah menjadi akun mahasiswa biasa.
                </>
              )}
            </p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setRoleChangeTarget(null)}
              >
                Batalkan
              </button>
              <button
                type="button"
                className={`admin-btn ${roleChangeTarget.newRole === "pengelola" ? "admin-btn-primary" : "admin-btn-danger"}`}
                onClick={confirmRoleChange}
              >
                {roleChangeTarget.newRole === "pengelola" ? "Ya, Jadikan Pengelola" : "Ya, Turunkan Peran"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
