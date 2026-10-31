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
    if (ready && !isAdminLoggedIn && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [ready, isAdminLoggedIn, pathname, router]);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
    { href: "/admin/peluang", label: "Katalog Peluang", icon: "catalog", exact: false },
    { href: "/admin/peluang/tambah", label: "Tambah Peluang", icon: "plus", exact: true },
    { href: "/admin/arsip", label: "Arsip Peluang", icon: "archive", exact: true },
    { href: "/admin/mahasiswa", label: "Kelola Mahasiswa", icon: "users", exact: true },
    { href: "/dashboard", label: "Kembali ke Web Mahasiswa", icon: "globe", exact: true },
  ];

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
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
    return [{ label: "Admin", active: true }];
  };

  if (pathname === "/admin/login") {
    return <div className="admin-shell">{children}</div>;
  }

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

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
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
            slug: "djarum",
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Siaran notifikasi info baru terkirim! (Pop-up Push & Email terkirim)`);
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
          showToast(`Pengingat deadline H-2 berhasil disiarkan! (${data.totalPushSent || 0} Push terkirim, ${data.totalEmailSent || 0} Email terkirim)`);
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
        showToast(`Berhasil menarik ${data.scrapedCount} beasiswa terbaru! Memperbarui tampilan...`);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
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
   Admin Login Screen (Harmonized with /masuk)
   ============================================================ */
export function AdminLogin() {
  const router = useRouter();
  const { loginAdmin } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Silakan masukkan email/token dan kata sandi pengelola.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await loginAdmin(email, password);
      if (res && res.success) {
        router.push("/admin");
      } else {
        setError(res?.error || "Kredensial atau token pengelola tidak valid.");
      }
    } catch {
      setError("Terjadi kendala autentikasi. Silakan periksa kredensial Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-wrapper">
      <header className="admin-auth-header">
        <Link className="brand" href="/" aria-label="NAVIKA, beranda mahasiswa">
          <img src="/asset/Logo%20Navika.png" alt="" />
          <strong>NAVIKA</strong>
        </Link>
        <span className="admin-badge-role">Panel Admin</span>
      </header>

      <div className="admin-auth-layout">
        <div className="admin-auth-intro-col">
          <div className="admin-auth-hero">
            <img
              src="/asset/asset-ilustrasi-masuk.png"
              alt="Ilustrasi pengelola katalog peluang"
            />
          </div>
          <div className="admin-auth-intro">
            <h1>Portal Masuk Pengelola Konten</h1>
            <p>
              Masuk untuk memelihara katalog beasiswa, magang, dan bootcamp mahasiswa Indonesia.
            </p>
            <div className="admin-auth-note">
              Hak Akses: Pengelola Data & Tim Katalog
            </div>
          </div>
        </div>

        <div className="admin-auth-form-card">
          <h2 className="admin-auth-form-title">Masuk ke Akun Admin</h2>
          <p className="admin-auth-form-desc">
            Gunakan email dan kata sandi pengelola terdaftar.
          </p>

          <form className="admin-auth-form" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="admin-email">Email atau Token Pengelola</label>
              <input
                id="admin-email"
                type="text"
                className="admin-input admin-input-lg"
                placeholder="admin@navika.id atau Token Unik"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                autoComplete="username"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="admin-pass">Kata Sandi</label>
              <input
                id="admin-pass"
                type="password"
                className="admin-input admin-input-lg"
                placeholder="Kata sandi admin"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoComplete="current-password"
                required
              />
              <p className="form-hint">Kredensial pengelola: ID ADM-NAVIKA atau admin@navika.id / sandi admin123</p>
            </div>

            {error && (
              <div className="admin-form-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="admin-btn admin-btn-auth-primary" disabled={loading}>
              {loading ? "Memverifikasi..." : "Masuk ke Dashboard Admin →"}
            </button>

            <div className="admin-auth-links">
              <p>
                Bukan pengelola?{" "}
                <Link href="/masuk">Masuk sebagai Mahasiswa</Link>
              </p>
              <p>
                <Link href="/dashboard" className="back-link">
                  &larr; Kembali ke Beranda Utama
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
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
  const [roleFilter, setRoleFilter] = useState("Semua");
  const [toastMsg, setToastMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "pengelola" ? "mahasiswa" : "pengelola";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Peran pengguna berhasil diubah menjadi "${newRole}".`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        showToast(data.error || "Gagal mengubah peran.");
      }
    } catch {
      showToast("Terjadi kesalahan saat memperbarui peran.");
    }
  };

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
      } else {
        showToast(data.error || "Gagal menghapus pengguna.");
      }
    } catch {
      showToast("Terjadi kesalahan saat menghapus pengguna.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const text = `${u.name} ${u.email} ${u.university} ${u.major}`.toLowerCase();
      const matchQuery = text.includes(query.trim().toLowerCase());
      const matchRole = roleFilter === "Semua" || u.role === roleFilter;
      return matchQuery && matchRole;
    });
  }, [users, query, roleFilter]);

  const studentCount = users.filter((u) => u.role === "mahasiswa").length;
  const adminCount = users.filter((u) => u.role === "pengelola").length;
  const validGpas = users.map((u) => parseFloat(u.gpa)).filter((g) => !isNaN(g) && g > 0);
  const avgGpa = validGpas.length
    ? (validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2)
    : "3.82";

  return (
    <div>
      {toastMsg && <div className="admin-toast success">{toastMsg}</div>}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kelola Pengguna Mahasiswa</h1>
          <p className="admin-page-subtitle">
            Daftar akun mahasiswa terdaftar, data universitas, program studi, IPK, dan kontrol hak akses peran.
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
            <span className="admin-stat-label">Total Mahasiswa</span>
            <span className="admin-stat-icon"><AdminIcon name="users" /></span>
          </div>
          <div className="admin-stat-number">{studentCount}</div>
          <div className="admin-stat-desc">Akun mahasiswa aktif</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Akun Pengelola / Admin</span>
            <span className="admin-stat-icon" style={{ background: "rgba(0, 103, 166, 0.12)", color: "var(--biru-aksi)" }}>
              <AdminIcon name="dashboard" />
            </span>
          </div>
          <div className="admin-stat-number">{adminCount}</div>
          <div className="admin-stat-desc">Hak akses panel admin</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Rata-rata IPK</span>
            <span className="admin-stat-icon" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
              <AdminIcon name="check" />
            </span>
          </div>
          <div className="admin-stat-number">{avgGpa}</div>
          <div className="admin-stat-desc">Dari seluruh profil mahasiswa</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-table-filters">
            <input
              type="text"
              className="admin-search-input"
              placeholder="Cari nama, email, kampus, atau jurusan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="admin-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter peran"
            >
              <option value="Semua">Semua Peran</option>
              <option value="mahasiswa">Mahasiswa</option>
              <option value="pengelola">Pengelola / Admin</option>
            </select>
          </div>
          <span style={{ fontSize: "13px", color: "var(--teks-sekunder)" }}>
            Menampilkan <strong>{filteredUsers.length}</strong> dari {users.length} pengguna
          </span>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama & Email Mahasiswa</th>
                <th>Universitas & Program Studi</th>
                <th>Semester & IPK</th>
                <th>Hak Akses (Role)</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--teks-redup)" }}>
                    Sedang memuat data pengguna mahasiswa dari Supabase...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isPengelola = u.role === "pengelola";
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="admin-table-title">{u.name}</div>
                        <div className="admin-table-org">
                          {u.email}
                        </div>
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
                          className={`admin-badge ${isPengelola ? "admin-badge-blue" : "admin-badge-default"}`}
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          title="Klik untuk mengubah role pengguna ini"
                          style={{ cursor: "pointer", border: "1px solid rgba(0,0,0,0.1)" }}
                        >
                          {isPengelola ? "🛡️ Pengelola" : "🎓 Mahasiswa"}
                        </button>
                      </td>
                      <td>
                        <div className="admin-table-actions">
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
                    Tidak ada data pengguna mahasiswa yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Akun */}
      {deleteTarget && (
        <div className="admin-modal-backdrop">
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
