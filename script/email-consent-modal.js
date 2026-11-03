"use client";

import { useState, useEffect } from "react";
import { useApp, useTr } from "@/script/app-provider";

export function EmailConsentModal() {
  const {
    ready,
    emailConsentDecided,
    setEmailConsentDecided,
    changeEmailAlerts,
    setDeadlineAlerts,
    profile,
  } = useApp();
  const tr = useTr();
  const [toastMsg, setToastMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;

    // Periksa status izin akun mahasiswa saat ini
    const userEmail = profile?.email || "guest";
    const consentStorageKey = `navika_notif_prompt_${userEmail}`;
    const storedStatus = typeof window !== "undefined" ? localStorage.getItem(consentStorageKey) : null;

    // Tampilkan jika belum pernah menjawab atau belum mengaktifkan notifikasi
    if (!storedStatus && !emailConsentDecided && !profile?.emailAlerts) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [ready, profile?.email, emailConsentDecided, profile?.emailAlerts]);

  const handleConsent = async (granted) => {
    setSaving(true);
    const userEmail = profile?.email || "guest";
    const consentStorageKey = `navika_notif_prompt_${userEmail}`;

    try {
      await changeEmailAlerts(granted);
    } catch {
      setToastMsg(tr("Pilihan email gagal disimpan. Coba lagi.", "Could not save email preference. Try again."));
      setTimeout(() => setToastMsg(""), 3500);
      setSaving(false);
      return;
    }
    if (setEmailConsentDecided) setEmailConsentDecided(true);
    if (setDeadlineAlerts) setDeadlineAlerts(granted);

    try {
      localStorage.setItem(consentStorageKey, granted ? "granted" : "dismissed");
    } catch {}

    if (granted) {
      setToastMsg(
        tr(
          "✓ Notifikasi berhasil diaktifkan untuk info peluang & pengingat deadline!",
          "✓ Notifications successfully activated for opportunities & deadline alerts!"
        )
      );
      setTimeout(() => setToastMsg(""), 4500);

      // 1. Minta izin Web Push OneSignal di browser
      if (typeof window !== "undefined" && window.OneSignalDeferred) {
        window.OneSignalDeferred.push(async function (OneSignal) {
          try {
            if (OneSignal.Notifications && OneSignal.Notifications.requestPermission) {
              await OneSignal.Notifications.requestPermission();
            } else if (OneSignal.Slidedown && OneSignal.Slidedown.promptPush) {
              await OneSignal.Slidedown.promptPush();
            }
            if (profile?.id || profile?.email) {
              await OneSignal.login(profile.id || profile.email);
            }
          } catch (pushErr) {
            console.warn("OneSignal permission request notice:", pushErr);
          }
        });
      }

    } else {
      setToastMsg(
        tr(
          "Pilihan disimpan. Anda dapat mengaktifkannya kapan saja di menu Pengaturan.",
          "Preference saved. You can enable it anytime in Settings."
        )
      );
      setTimeout(() => setToastMsg(""), 3500);
    }

    setSaving(false);
    setIsOpen(false);
  };

  const targetEmail = profile?.email && profile.email.includes("@") ? profile.email : null;

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
          padding: "10px 22px",
          borderRadius: "999px",
          fontSize: "0.85rem",
          fontWeight: 700,
          zIndex: 1000,
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

  if (!isOpen) {
    return null;
  }

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
          maxWidth: "440px",
          padding: "26px 22px 22px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.22)",
          textAlign: "center",
          border: "1px solid #e5e7eb",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
            color: "var(--biru-aksi, #0067a6)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 16px",
            fontSize: "1.7rem",
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
            color: "#0f172a",
            letterSpacing: "-0.2px",
          }}
        >
          {tr("Aktifkan Notifikasi & Pengingat?", "Enable Notifications & Alerts?")}
        </h2>

        <p
          style={{
            fontSize: "0.92rem",
            lineHeight: 1.55,
            color: "#475569",
            margin: "0 0 20px",
          }}
        >
          {tr(
            "Dapatkan pengingat batas pendaftaran (H-3) via pop-up web push di perangkat Anda, serta pembaruan beasiswa dan magang baru melalui email resmi NAVIKA.",
            "Get application deadline reminders (within 3 days) via web push on your device, and new scholarship/internship updates through official NAVIKA emails."
          )}
          {targetEmail && (
            <span style={{ display: "block", marginTop: "8px", fontWeight: 700, color: "var(--biru-aksi, #0067a6)" }}>
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
              background: "linear-gradient(105deg, #049ed4, #00659b)",
              color: "#ffffff",
              border: 0,
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(0, 103, 166, 0.28)",
              transition: "transform 0.15s ease",
            }}
          >
            {saving ? tr("Mengaktifkan...", "Enabling...") : tr("✓ Ya, Aktifkan Semua Notifikasi", "✓ Yes, Enable All Notifications")}
          </button>

          <button
            type="button"
            onClick={() => handleConsent(false)}
            disabled={saving}
            style={{
              width: "100%",
              minHeight: "42px",
              padding: "10px 16px",
              borderRadius: "12px",
              background: "transparent",
              color: "#64748b",
              border: 0,
              fontSize: "0.9rem",
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
