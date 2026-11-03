import { isPushAccepted } from "./notification-status.js";

export async function sendPushToUsers({ userIds, headings, contents, url }) {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;
  if (!appId || !apiKey) return { sent: false, count: 0, error: "OneSignal belum dikonfigurasi." };
  const ids = [...new Set(userIds || [])].filter(Boolean);
  if (!ids.length) return { sent: false, count: 0, error: "Tidak ada akun mahasiswa yang memenuhi syarat." };
  const messages = [];
  const errors = [];
  const describeError = (value) => Array.isArray(value)
    ? value.map((item) => typeof item === "string" ? item : JSON.stringify(item)).join(", ")
    : typeof value === "string" ? value : value ? JSON.stringify(value) : "Tidak ada langganan push aktif untuk penerima ini.";
  for (let offset = 0; offset < ids.length; offset += 20000) {
    try {
      const response = await fetch("https://api.onesignal.com/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Key ${apiKey}` },
        body: JSON.stringify({
          app_id: appId,
          include_aliases: { external_id: ids.slice(offset, offset + 20000) },
          target_channel: "push",
          headings,
          contents,
          url,
          chrome_web_icon: `${new URL(url).origin}/favicon.png`,
        }),
      });
      const data = await response.json();
      if (isPushAccepted(response, data) && data.recipients !== 0) messages.push({ id: data.id, recipients: data.recipients ?? null });
      else errors.push(describeError(data.errors || (response.ok ? null : `OneSignal HTTP ${response.status}`)));
    } catch {
      errors.push("OneSignal tidak dapat dihubungi.");
    }
  }
  return { sent: messages.length > 0, count: messages.length, recipients: messages.reduce((total, item) => total + (item.recipients || 0), 0), ids: messages.map((item) => item.id), error: errors.length ? errors.join("; ") : null };
}
