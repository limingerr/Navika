"use client";
import { useState, useMemo, useEffect } from "react";
import { AdminIcon } from "./admin-icon";

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
