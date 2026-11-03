import { createClient } from "@supabase/supabase-js";

/**
 * Membuat Supabase Admin Client dengan Service Role Key.
 * Client ini memiliki hak akses bypass RLS dan Admin Auth,
 * khusus digunakan pada Server (Route Handlers, Cron Jobs).
 * JANGAN PERNAH mengekspos client atau service_role key ini ke sisi browser / client-side.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  // Cek apakah URL masih bernilai placeholder
  if (
    url.includes("proyek-anda") ||
    url.includes("your-project-id") ||
    serviceRoleKey.includes("kunci_anda") ||
    serviceRoleKey.includes("your-service-role")
  ) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Mengambil seluruh daftar email pengguna terdaftar dari Supabase Auth (auth.users).
 * Mengembalikan array string email unik dan valid.
 */
export async function getAllUserEmails() {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return [];
  }

  try {
    const emails = [];
    let page = 1;
    const perPage = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error || !data?.users) {
        console.warn("Gagal mengambil daftar pengguna dari Supabase auth:", error?.message);
        break;
      }

      for (const user of data.users) {
        if (user.email && typeof user.email === "string" && user.email.includes("@")) {
          emails.push(user.email.trim().toLowerCase());
        }
      }

      if (data.users.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Ambil daftar email unik
    return Array.from(new Set(emails));
  } catch (err) {
    console.warn("Terjadi kesalahan saat memuat email pengguna:", err.message);
    return [];
  }
}

/**
 * Mengambil email pengguna yang mem-bookmark peluang tertentu (dari tabel saved_opportunities).
 */
export async function getUserEmailsForOpportunity(opportunityIdOrSlug) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin || !opportunityIdOrSlug) {
    return [];
  }

  try {
    // 1. Cari UUID peluang jika parameter berupa slug
    let opportunityId = opportunityIdOrSlug;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(opportunityIdOrSlug);

    if (!isUuid) {
      const { data: opp } = await supabaseAdmin
        .from("opportunities")
        .select("id")
        .eq("slug", opportunityIdOrSlug)
        .single();

      if (opp?.id) {
        opportunityId = opp.id;
      } else {
        // Slug tidak ditemukan di database Supabase (misal katalog statis bawaan)
        return [];
      }
    }

    // 2. Ambil user_id yang menyimpan peluang ini di saved_opportunities
    const { data: bookmarks, error: bmError } = await supabaseAdmin
      .from("saved_opportunities")
      .select("user_id")
      .eq("opportunity_id", opportunityId);

    if (bmError || !bookmarks || bookmarks.length === 0) {
      return [];
    }

    const targetUserIds = new Set(bookmarks.map((b) => b.user_id));

    // 3. Cocokkan ID pengguna dengan email di auth.users
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (usersError || !usersData?.users) {
      return [];
    }

    const matchedEmails = usersData.users
      .filter((user) => targetUserIds.has(user.id) && user.email && user.email.includes("@"))
      .map((user) => user.email.trim().toLowerCase());

    return Array.from(new Set(matchedEmails));
  } catch (err) {
    console.warn("Kesalahan saat mencari email pemegang bookmark:", err.message);
    return [];
  }
}

/** Pilih hanya akun yang mengizinkan email; pengingat juga memerlukan bookmark. */
async function readAllUserIds(admin, table, column, value) {
  const ids = [];
  for (let start = 0; ; start += 1000) {
    const { data, error } = await admin.from(table).select("user_id")
      .eq(column, value).range(start, start + 999);
    if (error) throw error;
    ids.push(...(data || []).map((row) => row.user_id));
    if ((data || []).length < 1000) break;
  }
  return new Set(ids);
}

export async function getNotificationRecipients({ opportunityId = null, client } = {}) {
  const admin = client || getSupabaseAdmin();
  if (!admin) return { emails: [], source: "none", count: 0 };
  const studentIds = await readAllUserIds(admin, "user_roles", "role", "mahasiswa");
  const optedInIds = await readAllUserIds(admin, "profiles", "email_alerts", true);
  let userIds = new Set([...optedInIds].filter((id) => studentIds.has(id)));
  const optedInCount = userIds.size;
  let bookmarkCount = null;
  if (opportunityId) {
    const bookmarked = await readAllUserIds(admin, "saved_opportunities", "opportunity_id", opportunityId);
    bookmarkCount = [...bookmarked].filter((id) => studentIds.has(id)).length;
    userIds = new Set([...userIds].filter((id) => bookmarked.has(id)));
  }
  const eligibleCount = userIds.size;
  const emails = [];
  for (let page = 1; userIds.size > 0; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    for (const user of data?.users || []) {
      if (userIds.has(user.id) && user.email) emails.push(user.email.trim().toLowerCase());
    }
    if ((data?.users || []).length < 1000) break;
  }
  const uniqueEmails = [...new Set(emails)];
  return { emails: uniqueEmails, source: opportunityId ? "saved_opted_in" : "opted_in", count: uniqueEmails.length, optedInCount, bookmarkCount, eligibleCount };
}

export async function getPushUserIds({ opportunityId = null, client } = {}) {
  const admin = client || getSupabaseAdmin();
  if (!admin) return [];
  const studentIds = await readAllUserIds(admin, "user_roles", "role", "mahasiswa");
  if (!opportunityId) return [...studentIds];
  const bookmarked = await readAllUserIds(admin, "saved_opportunities", "opportunity_id", opportunityId);
  return [...bookmarked].filter((id) => studentIds.has(id));
}
