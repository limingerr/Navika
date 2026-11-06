"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/src/components/app-provider";
import { opportunities as staticOpportunities } from "@/src/data/opportunities";

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
