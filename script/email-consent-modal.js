"use client";

import { useState } from "react";
import { useApp, useTr } from "@/script/app-provider";

export function EmailConsentModal() {
  const {
    ready,
    emailConsentDecided,
    setEmailConsentDecided,
    setEmailAlerts,
    profile,
  } = useApp();
  const tr = useTr();
  const [toastMsg, setToastMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Jangan tampilkan jika belum siap atau user sudah pernah menentukan pilihan
  if (!ready || emailConsentDecided) {
    if (toastMsg) {
      return (
        <div
          style={{
            position: "fixed",
            bottom: "84px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(16, 185, 129, 0.95)",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "999px",
            fontSize: "0.85rem",
            fontWeight: 700,
            zIndex: 100,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            textAlign: "center",
            maxWidth: "90%",
            backdropFilter: "blur(6px)",
          }}
          role="status"
          aria-live="polite"
        >
          {toastMsg}
        </div>
      );
    }
    return null;
  }

  const handleConsent = async (granted) => {
    setSaving(true);
    setEmailConsentDecided(true);
    setEmailAlerts(granted);

    if (granted) {
      setToastMsg(
        tr(
          "✓ Notifikasi email berhasil diaktifkan untuk peluang & deadline!",
          "✓ Email notifications successfully activated for opportunities & deadlines!"
        )
      );
      setTimeout(() => setToastMsg(""), 4500);

      // Simpan consent ke backend jika user memiliki email/sesi
      if (profile?.email && profile.email.includes("@")) {
        try {
          await fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: profile.id,
              email: profile.email,
              emailAlerts: true,
            }),
          });
        } catch {}
      }
    } else {
      setToastMsg(
        tr(
          "Pilihan disimpan. Kamu bisa mengaktifkannya kapan saja di menu Pengaturan.",
          "Preference saved. You can turn it on anytime in Settings."
        )
      );
      setTimeout(() => setToastMsg(""), 3500);
    }
    setSaving(false);
  };

  const targetEmail = profile?.email && profile.email.includes("@") ? profile.email : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(9, 14, 20, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 1000,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "430px",
          padding: "26px 22px 22px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.22)",
          textAlign: "center",
          border: "1px solid #e5e7eb",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
            color: "var(--biru-aksi)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 16px",
            fontSize: "1.6rem",
          }}
          aria-hidden="true"
        >
          🔔
        </div>

        <h2
          id="consent-title"
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            margin: "0 0 10px",
            color: "var(--teks)",
            letterSpacing: "-0.2px",
          }}
        >
          {tr("Aktifkan Notifikasi Email?", "Enable Email Notifications?")}
        </h2>

        <p
          style={{
            fontSize: "0.92rem",
            lineHeight: 1.55,
            color: "var(--teks-redup)",
            margin: "0 0 20px",
          }}
        >
          {tr(
            "Dapatkan pemberitahuan otomatis ke emailmu saat ada info beasiswa baru dan pengingat deadline pendaftaran yang akan segera ditutup dalam 2 hari.",
            "Get automatic email updates when new scholarships open and deadline reminders 2 days before applications close."
          )}
          {targetEmail && (
            <span style={{ display: "block", marginTop: "8px", fontWeight: 700, color: "var(--biru-aksi)" }}>
              ({targetEmail})
            </span>
          )}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            type="button"
            onClick={() => handleConsent(true)}
            disabled={saving}
            style={{
              width: "100%",
              minHeight: "48px",
              padding: "12px 20px",
              borderRadius: "14px",
              background: "var(--biru-aksi)",
              color: "#ffffff",
              border: 0,
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(0, 103, 166, 0.28)",
              transition: "transform 0.15s ease",
            }}
          >
            {tr("✓ Ya, Izinkan Notifikasi", "✓ Yes, Allow Notifications")}
          </button>

          <button
            type="button"
            onClick={() => handleConsent(false)}
            disabled={saving}
            style={{
              width: "100%",
              minHeight: "42px",
              padding: "8px 16px",
              borderRadius: "12px",
              background: "transparent",
              color: "var(--teks-redup)",
              border: 0,
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {tr("Nanti Saja", "Not Now")}
          </button>
        </div>
      </div>
    </div>
  );
}
