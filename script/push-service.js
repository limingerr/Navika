import { isPushAccepted } from "./notification-status.js";

export async function sendPushToUsers({ userIds, headings, contents, url }) {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;
  if (!appId || !apiKey) return { sent: false, count: 0, error: "OneSignal belum dikonfigurasi." };
  const ids = [...new Set(userIds)].filter(Boolean);
  if (!ids.length) return { sent: false, count: 0, error: "Tidak ada penerima Web Push." };
  let count = 0;
  let recipients = 0;
  const errors = [];
  for (let start = 0; start < ids.length; start += 20000) {
    try {
      const response = await fetch("https://api.onesignal.com/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Key ${apiKey}` },
        body: JSON.stringify({ app_id: appId, include_aliases: { external_id: ids.slice(start, start + 20000) }, target_channel: "push", headings, contents, url, chrome_web_icon: `${new URL(url).origin}/favicon.png` }),
      });
      const data = await response.json();
      if (isPushAccepted(response, data) && data.recipients !== 0) {
        count++;
        recipients += data.recipients || 0;
      } else errors.push(Array.isArray(data.errors) ? data.errors.join(", ") : data.errors || `OneSignal HTTP ${response.status}`);
    } catch (error) {
      errors.push(error.message);
    }
  }
  return { sent: count > 0, count, recipients, error: errors.join("; ") || null };
}
