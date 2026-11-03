import { getSupabaseAdmin } from "../lib/supabase/admin.js";

async function readIds(admin, table, column, value) {
  const ids = new Set();
  for (let start = 0; ; start += 1000) {
    const { data, error } = await admin.from(table).select("user_id")
      .eq(column, value).range(start, start + 999);
    if (error) throw error;
    for (const row of data || []) ids.add(row.user_id);
    if ((data || []).length < 1000) return ids;
  }
}

export async function getStudentIds(admin = getSupabaseAdmin()) {
  if (!admin) throw new Error("Database notifikasi belum dikonfigurasi.");
  return [...await readIds(admin, "user_roles", "role", "mahasiswa")];
}

export async function getDeadlineRecipientIds(opportunityId, admin = getSupabaseAdmin()) {
  if (!admin) throw new Error("Database notifikasi belum dikonfigurasi.");
  const [students, bookmarked] = await Promise.all([
    readIds(admin, "user_roles", "role", "mahasiswa"),
    readIds(admin, "saved_opportunities", "opportunity_id", opportunityId),
  ]);
  const enabled = await readIds(admin, "profiles", "deadline_alerts", true);
  return [...bookmarked].filter((id) => students.has(id) && enabled.has(id));
}

export async function getBookmarkedStudentIds(opportunityId, admin = getSupabaseAdmin()) {
  if (!admin) throw new Error("Database notifikasi belum dikonfigurasi.");
  const [students, bookmarked] = await Promise.all([
    readIds(admin, "user_roles", "role", "mahasiswa"),
    readIds(admin, "saved_opportunities", "opportunity_id", opportunityId),
  ]);
  return [...bookmarked].filter((id) => students.has(id));
}

export async function storeNotifications({ userIds, kind, title, body, href, admin = getSupabaseAdmin() }) {
  if (!admin) throw new Error("Database notifikasi belum dikonfigurasi.");
  const recipients = [...new Set(userIds)];
  let stored = 0;
  for (let start = 0; start < recipients.length; start += 500) {
    const rows = recipients.slice(start, start + 500).map((user_id) => ({ user_id, kind, title, body, href }));
    const { error } = await admin.from("in_app_notifications").insert(rows);
    if (error) throw error;
    stored += rows.length;
  }
  return stored;
}
