"use client";
import { useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/src/components/app-provider";
import { isOpportunityVisibleForStudent, isOpportunityInGracePeriod, opportunities as staticOpportunities } from "@/src/data/opportunities";
import { AdminIcon } from "./admin-icon";

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
