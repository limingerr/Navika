"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Komponen Notifikasi Toast saat bookmark / logo hati diklik.
 * Ditempatkan di top-center layar secara mengambang (floating toast)
 * agar terlihat jelas baik di perangkat mobile maupun desktop,
 * tanpa menutupi navigasi bawah (bottom navigation bar) atau terhalang ibu jari.
 */
export function BookmarkNotification({ notice, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [currentNotice, setCurrentNotice] = useState(null);

  useEffect(() => {
    if (!notice?.message) {
      setVisible(false);
      return;
    }

    setCurrentNotice(notice);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      const dismissTimer = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 250);
      return () => clearTimeout(dismissTimer);
    }, 3200);

    return () => clearTimeout(timer);
  }, [notice, onDismiss]);

  if (!currentNotice && !visible) {
    return null;
  }

  const isSave = currentNotice?.type === "save";

  return (
    <div
      className={`navika-bookmark-toast ${visible ? "toast-enter" : "toast-exit"}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-icon-wrap" aria-hidden="true">
        {isSave ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#e63946"
            stroke="#e63946"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20.3C10 18.6 3.5 13.9 3.5 9.2a4.7 4.7 0 0 1 8.5-2.9 4.7 4.7 0 0 1 8.5 2.9c0 4.7-6.5 9.4-8.5 11.1Z" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20.3C10 18.6 3.5 13.9 3.5 9.2a4.7 4.7 0 0 1 8.5-2.9 4.7 4.7 0 0 1 8.5 2.9c0 4.7-6.5 9.4-8.5 11.1Z" />
          </svg>
        )}
      </div>

      <span className="toast-message">{currentNotice?.message}</span>

      {isSave && (
        <Link
          href="/tersimpan"
          className="toast-action"
          onClick={() => {
            setVisible(false);
            if (onDismiss) onDismiss();
          }}
        >
          Lihat
        </Link>
      )}

      <button
        type="button"
        className="toast-close"
        onClick={() => {
          setVisible(false);
          if (onDismiss) setTimeout(onDismiss, 250);
        }}
        aria-label="Tutup notifikasi"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
