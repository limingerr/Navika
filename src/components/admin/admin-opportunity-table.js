"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/src/components/app-provider";
import { categories, isOpportunityVisibleForStudent, isOpportunityInGracePeriod, isOpportunityExpiredOverWeek, opportunities as staticOpportunities } from "@/src/data/opportunities";
import { AdminIcon } from "./admin-icon";

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
          showToast(data.web?.stored > 0
            ? "Siaran berhasil dikirim ke notifikasi web mahasiswa."
            : "Siaran diproses, tetapi notifikasi web belum terkirim. Periksa konfigurasi penerima dan database.");
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
          showToast(data.totalOpportunities === 0
            ? "Tidak ada peluang dengan deadline H-2, H-1, atau hari H."
            : data.totalWebStored > 0
              ? "Pengingat berhasil dikirim ke notifikasi web mahasiswa yang memenuhi syarat."
              : "Pengingat diproses, tetapi notifikasi web belum terkirim. Periksa bookmark dan pengaturan pengingat mahasiswa.");
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
                    ⏰ Pengingat Deadline (H-2, H-1, Hari H)
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
                    Sistem akan mengirimkan pengingat H-2, H-1, dan hari H kepada mahasiswa yang menyimpan peluang dan mengaktifkan pengingat.
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
