"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/src/components/app-provider";
import { AdminIcon } from "./admin-icon";

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
