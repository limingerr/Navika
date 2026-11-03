"use client";

import Link from "next/link";

export function InAppToast({ notification, onDismiss }) {
  if (!notification) return null;
  return <aside className="in-app-toast" role="status" aria-live="polite">
    <strong>{notification.title}</strong>
    <p>{notification.body}</p>
    <div><Link href={notification.href} onClick={onDismiss}>Lihat peluang</Link>
      <button type="button" onClick={onDismiss} aria-label="Tutup notifikasi">Tutup</button></div>
  </aside>;
}
