import { createClient } from "@/lib/supabase/client";
import { defaultProfile } from "@/script/app-provider";
import { resolveAccount } from "@/script/account-state";

/**
 * Memeriksa apakah konfigurasi Supabase telah disetel di environment variables.
 */
export function isSupabaseConfigured() {
  if (typeof window === "undefined") return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (
    url.includes("proyek-anda") ||
    url.includes("your-project-id") ||
    key.includes("kunci_anda") ||
    key.includes("your-supabase")
  ) {
    return false;
  }
  return true;
}

/**
 * Mendapatkan instance Supabase Client untuk browser.
 */
export function getSupabase() {
  return createClient();
}

export async function fetchCurrentAccount() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) return null;
  const user = authData.user;
  const [{ data: roleData }, { data: profileData }] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
  ]);
  return resolveAccount(user, roleData?.role, profileData);
}

/**
 * Autentikasi Pengguna (Mahasiswa atau Admin via ID/Token)
 */
export async function signInUser(identifier, password) {
  const supabase = getSupabase();
  if (!supabase) {
    // Mode offline / mock
    return {
      success: true,
      role: "mahasiswa",
      user: {
        id: "student-mock-id",
        email: identifier,
      },
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: identifier.trim(),
    password: (password || "").trim(),
  });

  if (error) {
    return { success: false, error: "Email atau kata sandi tidak valid." };
  }

  // Cek peran di tabel user_roles
  let role = "mahasiswa";
  try {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .single();

    if (roleData && roleData.role === "pengelola") {
      role = "admin";
    }
  } catch {}

  return { success: true, role, user: data.user };
}

/**
 * Pendaftaran Akun Mahasiswa Baru (Solusi C: Bebas Rate-Limit + Welcome Email)
 */
export async function signUpUser(name, email, password) {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      return { success: false, error: data.error || "Pendaftaran gagal. Silakan coba lagi." };
    }

    // Login otomatis setelah pendaftaran sukses agar sesi langsung aktif
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
      } catch (loginErr) {
        console.warn("Auto-login notice setelah pendaftaran:", loginErr);
      }
    }

    return { success: true, user: data.user };
  } catch (err) {
    console.warn("Pendaftaran via API gagal, mencoba fallback Supabase SDK:", err);
    const supabase = getSupabase();
    if (!supabase) {
      return {
        success: true,
        user: { id: "student-mock-id", email },
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  }
}

/**
 * Logout Sesi
 */
export async function signOutUser() {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.auth.signOut();
  }
}

/**
 * Mengambil Profil Pengguna Aktif
 */
export async function fetchUserProfile() {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", authData.user.id)
    .single();

  if (error || !data) return null;

  return {
    name: data.name || "",
    email: authData.user.email || "",
    university: data.university || "",
    major: data.major || "",
    semester: data.semester ? String(data.semester) : "",
    gpa: data.gpa ? String(data.gpa) : "",
    interest: Array.isArray(data.interests) ? data.interests.join(", ") : "",
    emailAlerts: data.email_alerts === true,
  };
}

export async function saveEmailAlertPreference(enabled) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) throw new Error("Sesi pengguna tidak tersedia.");
  const { data, error } = await supabase.from("profiles")
    .update({ email_alerts: enabled })
    .eq("user_id", authData.user.id)
    .select("user_id");
  if (error) throw error;
  if (!data?.length) throw new Error("Profil pengguna tidak ditemukan.");
}

/**
 * Menyimpan / Memperbarui Profil Pengguna
 */
export async function saveUserProfile(profileData) {
  const supabase = getSupabase();
  if (!supabase) return;

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return;

  const interestsArray = typeof profileData.interest === "string"
    ? profileData.interest.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  await supabase.from("profiles").upsert({
    user_id: authData.user.id,
    name: profileData.name || "",
    university: profileData.university || "",
    major: profileData.major || "",
    semester: profileData.semester ? parseInt(profileData.semester, 10) : null,
    gpa: profileData.gpa ? parseFloat(profileData.gpa) : null,
    interests: interestsArray,
    updated_at: new Date().toISOString(),
  });
}

/**
 * Mengambil Daftar Peluang dari Supabase
 */
export async function fetchOpportunitiesFromDb() {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data: opps, error } = await supabase
      .from("opportunities")
      .select(`
        *,
        primary_category:categories!primary_category_id(name),
        additional_categories:opportunity_additional_categories(category:categories(name)),
        eligibility_rule:eligibility_rules(*),
        deadline:deadlines(*)
      `)
      .order("created_at", { ascending: false });

    if (error || !Array.isArray(opps)) {
      return null;
    }

    // Normalisasi struktur data Supabase ke format yang dipahami frontend
    return opps.map((o) => {
      const primaryCat = o.primary_category?.name || "Umum";
      const extraCats = (o.additional_categories || [])
        .map((ac) => ac.category?.name)
        .filter(Boolean);

      let calculatedDemoDays = 10;
      if (o.deadline?.local_date) {
        const deadlineDate = new Date(o.deadline.local_date);
        const today = new Date();
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        calculatedDemoDays = diffDays;
      }

      return {
        id: o.slug || o.id,
        dbId: o.id,
        title: o.title,
        organization: o.organization,
        category: primaryCat,
        alsoCategories: extraCats,
        recommended: Boolean(o.recommended),
        field: o.field || "Umum",
        targetMajors: o.eligibility_rule?.allowed_majors || ["Semua Jurusan"],
        summary: o.summary || "",
        summaryEn: o.summary_en || o.summary || "",
        requirements: o.requirements || [],
        requirementsEn: o.requirements_en || o.requirements || [],
        benefits: o.benefits || [],
        benefitsEn: o.benefits_en || o.benefits || [],
        sourceUrl: o.source_url,
        demoDays: calculatedDemoDays,
        status: o.publication_status === "draf" ? "Draft" : o.publication_status === "diarsipkan" ? "Diarsipkan" : o.publication_status === "ditutup" ? "Ditutup" : "Terbit",
      };
    });
  } catch (err) {
    return null;
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Mengambil Daftar Peluang yang Dibookmark Pengguna dari Supabase
 */
export async function fetchSavedOpportunityIds() {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      // Coba periksa via server API route
      try {
        const res = await fetch("/api/bookmarks");
        const apiData = await res.json();
        if (apiData?.success && Array.isArray(apiData.saved)) {
          return apiData.saved;
        }
      } catch {}
      return null;
    }

    const { data, error } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id, opportunity:opportunities(slug, id)")
      .eq("user_id", authData.user.id);

    if (error || !Array.isArray(data)) return null;

    return data.map((item) => {
      const opp = Array.isArray(item.opportunity) ? item.opportunity[0] : item.opportunity;
      return opp?.slug || item.opportunity_id;
    });
  } catch (err) {
    console.warn("Gagal mengambil data bookmark dari Supabase:", err);
    return null;
  }
}

/**
 * Toggle Simpan / Hapus Bookmark di Database Supabase
 */
export async function toggleBookmarkInDb(opportunitySlugOrId, isSaved) {
  if (!opportunitySlugOrId) return { success: false, error: "ID peluang kosong." };

  const cleanKey = String(opportunitySlugOrId).trim();
  const isUuid = UUID_REGEX.test(cleanKey);

  // 1. Coba simpan/hapus langsung via Supabase client SDK di browser
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        // Cari UUID peluang dari database berdasarkan ID jika UUID, atau slug jika teks
        let query = supabase.from("opportunities").select("id, slug");
        if (isUuid) {
          query = query.eq("id", cleanKey);
        } else {
          query = query.eq("slug", cleanKey);
        }

        const { data: opp, error: oppErr } = await query.maybeSingle();

        if (opp) {
          if (isSaved) {
            // Hapus bookmark
            let deleted = false;
            try {
              const { error: rpcErr } = await supabase.rpc("remove_bookmark", {
                p_opportunity_id: opp.id,
                p_confirm: true,
              });
              if (!rpcErr) deleted = true;
            } catch {}

            if (!deleted) {
              const { error: deleteErr } = await supabase
                .from("saved_opportunities")
                .delete()
                .eq("user_id", authData.user.id)
                .eq("opportunity_id", opp.id);
              if (deleteErr) throw deleteErr;
            }

            return { success: true, savedInDb: false };
          } else {
            // Simpan bookmark ke Supabase
            const { error: saveErr } = await supabase.from("saved_opportunities").upsert(
              {
                user_id: authData.user.id,
                opportunity_id: opp.id,
                application_status: "tertarik",
                saved_at: new Date().toISOString(),
                status_updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id,opportunity_id" }
            );

            if (!saveErr) {
              return { success: true, savedInDb: true };
            }
          }
        }
      }
    } catch (err) {
      console.warn("Client bookmark notice, mencoba jalur API:", err);
    }
  }

  // 2. Jalur Server API Route Fallback (/api/bookmarks)
  try {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunityId: cleanKey,
        isSaved: Boolean(isSaved),
      }),
    });
    return await res.json();
  } catch (apiErr) {
    console.warn("Gagal menyimpan bookmark ke server:", apiErr);
    return { success: false, savedInDb: false };
  }
}

/**
 * Admin: Menyimpan / Memperbarui Peluang ke Supabase melalui Server API Route
 */
export async function adminSaveOpportunityToDb(opp) {
  try {
    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opp),
    });
    return await res.json();
  } catch (err) {
    console.warn("Gagal menyimpan ke Supabase via API:", err);
  }
}

/**
 * Admin: Mengarsipkan Peluang di Supabase (Soft Delete) melalui Server API Route
 */
export async function adminArchiveOpportunityInDb(slugOrId) {
  try {
    const res = await fetch(`/api/opportunities?id=${encodeURIComponent(slugOrId)}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (err) {
    console.warn("Gagal mengarsipkan peluang di Supabase via API:", err);
  }
}
