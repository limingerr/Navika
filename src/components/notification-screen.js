"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useApp, useTr } from "@/src/components/app-provider";
import { AppShell } from "@/src/components/ui";

export function NotificationScreen() {
  const { notifications, markNotificationsRead } = useApp();
  const tr = useTr();
  useEffect(() => { if (notifications.some((item) => !item.read_at)) markNotificationsRead(); }, [notifications]);
  return <AppShell><main className="notification-page">
    <h1>{tr("Notifikasi", "Notifications")}</h1>
    {notifications.length ? <ul>{notifications.map((item) => <li key={item.id}>
      <Link href={item.href}><strong>{item.title}</strong><span>{item.body}</span>
        <time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</time></Link>
    </li>)}</ul> : <p>{tr("Belum ada notifikasi.", "No notifications yet.")}</p>}
  </main></AppShell>;
}
