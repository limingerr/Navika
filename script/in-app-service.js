import { getSupabaseAdmin } from "../lib/supabase/admin.js";

async function readIds(admin, table, column, value) {
  const ids = new Set();
  for (let start = 0; ; start += 1000) {
    let query = admin.from(table).select("user_id");
    if (column) query = query.eq(column, value);
    const { data, error } = await query.range(start, start + 999);
    if (error) throw error;
    for (const row of data || []) ids.add(row.user_id);
    if ((data || []).length < 1000) return ids;
  }
}

export async function getStudentIds(admin = getSupabaseAdmin()) {
  if (!admin) throw new Error("Database notifikasi belum dikonfigurasi.");
  const [profiles, admins] = await Promise.all([
    readIds(admin, "profiles"),
    readIds(admin, "user_roles", "role", "pengelola"),
  ]);
  return [...profiles].filter((id) => !admins.has(id));
}

export async function getDeadlineRecipientIds(opportunityId, admin = getSupabaseAdmin()) {
  if (!admin) throw new Error("Database notifikasi belum dikonfigurasi.");
  const [students, bookmarked] = await Promise.all([
    getStudentIds(admin),
    readIds(admin, "saved_opportunities", "opportunity_id", opportunityId),
  ]);
  const enabled = await readIds(admin, "profiles", "deadline_alerts", true);
  const studentSet = new Set(students);
  return [...bookmarked].filter((id) => studentSet.has(id) && enabled.has(id));
}

export async function getBookmarkedStudentIds(opportunityId, admin = getSupabaseAdmin()) {
  if (!admin) throw new Error("Database notifikasi belum dikonfigurasi.");
  const [students, bookmarked] = await Promise.all([
    getStudentIds(admin),
    readIds(admin, "saved_opportunities", "opportunity_id", opportunityId),
  ]);
  const studentSet = new Set(students);
  return [...bookmarked].filter((id) => studentSet.has(id));
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
