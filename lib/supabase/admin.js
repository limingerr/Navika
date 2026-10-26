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

/**
 * Helper untuk menentukan target penerima email notifikasi:
 * 1. Jika ada opportunityId, cari user yang menyimpan/bookmark peluang tersebut.
 * 2. Jika tidak ada bookmark atau opportunityId null, ambil semua user terdaftar di Supabase.
 * 3. Jika Supabase belum dikonfigurasi atau tidak ada user, gunakan fallback NOTIFICATION_EMAIL_TO.
 */
export async function getNotificationRecipients({ opportunityId = null } = {}) {
  // 1. Coba cari user yang mem-bookmark peluang
  if (opportunityId) {
    const bookmarkedEmails = await getUserEmailsForOpportunity(opportunityId);
    if (bookmarkedEmails.length > 0) {
      return {
        emails: bookmarkedEmails,
        source: "saved_opportunities",
        count: bookmarkedEmails.length,
      };
    }
  }

  // 2. Jika tidak ada bookmark spesifik, ambil seluruh user terdaftar
  const allUsers = await getAllUserEmails();
  if (allUsers.length > 0) {
    return {
      emails: allUsers,
      source: "all_registered_users",
      count: allUsers.length,
    };
  }

  // 3. Fallback ke email lingkungan (development/demo atau cadangan darurat)
  const fallback = process.env.NOTIFICATION_EMAIL_TO;
  if (fallback && typeof fallback === "string" && fallback.includes("@")) {
    return {
      emails: [fallback.trim().toLowerCase()],
      source: "fallback_env",
      count: 1,
    };
  }

  return {
    emails: [],
    source: "none",
    count: 0,
  };
}
