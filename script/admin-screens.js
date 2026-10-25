"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp, useTr } from "@/script/app-provider";
import { categories, categoryLabel, demoDeadline, formatDate, opportunities as staticOpportunities } from "@/script/opportunities";

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
    { href: "/admin", label: "Dashboard Overview", icon: "dashboard", exact: true },
    { href: "/admin/peluang", label: "Katalog Peluang", icon: "catalog", exact: false },
    { href: "/admin/peluang/tambah", label: "Tambah Peluang", icon: "plus", exact: true },
    { href: "/dashboard", label: "Kembali ke Web Mahasiswa", icon: "globe", exact: true },
  ];

  const handleLogout = () => {
    logoutAdmin();
    router.push("/dashboard");
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
    const active = opportunities.filter((o) => o.status !== "Ditutup" && o.status !== "Diarsipkan").length;
    const urgent = opportunities.filter((o) => o.demoDays <= 7 && o.status !== "Ditutup").length;
    const beasiswa = opportunities.filter((o) => o.category === "Beasiswa").length;
    const magang = opportunities.filter((o) => o.category === "Magang").length;
    const bootcamp = opportunities.filter((o) => o.category === "Bootcamp").length;

    return { total, active, urgent, beasiswa, magang, bootcamp };
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
          <div className="admin-stat-desc">{stats.active} sedang berstatus aktif/terbit</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Deadline &le; 7 Hari</span>
            <span className="admin-stat-icon" style={{ background: "var(--merah-bg)", color: "var(--merah)" }}>
              <AdminIcon name="clock" />
            </span>
          </div>
          <div className="admin-stat-number">{stats.urgent}</div>
          <div className="admin-stat-desc">Perlu dipantau jadwal penutupannya</div>
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

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const filteredItems = useMemo(() => {
    return opportunities.filter((item) => {
      const matchQuery =
        `${item.title} ${item.organization} ${item.id}`.toLowerCase().includes(query.trim().toLowerCase());
      const matchCat = selectedCat === "Semua" || item.category === selectedCat;
      const itemStatus = item.status || "Terbit";
      const matchStatus = selectedStatus === "Semua" || itemStatus === selectedStatus;

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
              <option value="Semua">Semua Status</option>
              <option value="Terbit">Terbit</option>
              <option value="Draft">Draft</option>
              <option value="Ditutup">Ditutup</option>
              <option value="Diarsipkan">Diarsipkan</option>
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
                        <span className={`admin-badge ${isUrgent ? "admin-badge-urgent" : "admin-badge-default"}`}>
                          {item.demoDays} Hari lagi
                        </span>
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) {
      setErrorMessage("Judul peluang dan nama penyelenggara wajib diisi.");
      return;
    }
    if (!sourceUrl.startsWith("http://") && !sourceUrl.startsWith("https://")) {
      setErrorMessage("URL sumber resmi harus diawali dengan http:// atau https://.");
      return;
    }

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

    if (mode === "create") {
      const slugId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `opp-${Date.now()}`;
      addOpportunity({ id: slugId, ...payload });
    } else {
      updateOpportunity(id, payload);
    }

    router.push("/admin/peluang");
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
              <button type="submit" className="admin-btn admin-btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: "10px" }}>
                {mode === "create" ? "Terbitkan Peluang Baru" : "Simpan Perubahan"}
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
  const [email, setEmail] = useState("admin@navika.id");
  const [password, setPassword] = useState("admin123");

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAdmin(email, password);
    router.push("/admin");
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
              <label htmlFor="admin-email">Email Admin</label>
              <input
                id="admin-email"
                type="email"
                className="admin-input admin-input-lg"
                placeholder="nama@navika.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <p className="form-hint">Kredensial pengelola: ID ADM-NAVIKA atau admin@navika.id / sandi admin123</p>
            </div>

            <button type="submit" className="admin-btn admin-btn-auth-primary">
              Masuk ke Dashboard Admin &rarr;
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
