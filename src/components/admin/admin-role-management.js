"use client";
import { useState, useMemo, useEffect } from "react";
import { AdminIcon } from "./admin-icon";

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
