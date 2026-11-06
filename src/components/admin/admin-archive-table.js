"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/src/components/app-provider";
import { categories, isOpportunityInGracePeriod, isOpportunityExpiredOverWeek, opportunities as staticOpportunities } from "@/src/data/opportunities";
import { AdminIcon } from "./admin-icon";

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
