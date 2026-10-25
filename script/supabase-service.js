import { createClient } from "@/lib/supabase/client";
import { defaultProfile, isAdminIdentifier, verifyAdminCredentials } from "@/script/app-provider";

/**
 * Memeriksa apakah konfigurasi Supabase telah disetel di environment variables.
 */
export function isSupabaseConfigured() {
  return Boolean(
    typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

/**
 * Mendapatkan instance Supabase Client untuk browser.
 */
export function getSupabase() {
  return createClient();
}

/**
 * Autentikasi Pengguna (Mahasiswa atau Admin via ID/Token)
 */
export async function signInUser(identifier, password) {
  // Cek token khusus admin (Plan B)
  if (verifyAdminCredentials(identifier, password)) {
    return {
      success: true,
      role: "admin",
      user: {
        id: "admin-token-session",
        email: "admin@navika.internal",
      },
    };
  }

  // Jika memasukkan format token admin tapi password salah, tolak dengan pesan umum
  if (isAdminIdentifier(identifier) && !identifier.includes("@")) {
    return {
      success: false,
      error: "Email atau kata sandi tidak valid.",
    };
  }

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
    password: password,
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
 * Pendaftaran Akun Mahasiswa Baru
 */
export async function signUpUser(name, email, password) {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      success: true,
      user: { id: "student-mock-id", email },
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: password,
    options: {
      data: { name: name.trim() },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Inisialisasi profil mahasiswa di database jika pengguna langsung aktif
  if (data?.user) {
    try {
      await supabase.from("profiles").upsert({
        user_id: data.user.id,
        name: name.trim(),
        university: "",
        major: "",
        semester: 1,
        gpa: null,
        interests: [],
        updated_at: new Date().toISOString(),
      });

      await supabase.from("user_roles").upsert({
        user_id: data.user.id,
        role: "mahasiswa",
      });
    } catch {}
  }

  return { success: true, user: data.user };
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
  };
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
        calculatedDemoDays = diffDays >= 0 ? diffDays : 0;
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

/**
 * Mengambil Daftar Peluang yang Dibookmark Pengguna
 */
export async function fetchSavedOpportunityIds() {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return null;

    const { data, error } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id, opportunity:opportunities(slug, id)")
      .eq("user_id", authData.user.id);

    if (error || !Array.isArray(data)) return null;

    return data.map((item) => item.opportunity?.slug || item.opportunity_id);
  } catch {
    return null;
  }
}

/**
 * Toggle Simpan / Hapus Bookmark
 */
export async function toggleBookmarkInDb(opportunitySlugOrId, isSaved) {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return;

    // Cari UUID dari slug
    const { data: opp } = await supabase
      .from("opportunities")
      .select("id")
      .or(`slug.eq.${opportunitySlugOrId},id.eq.${opportunitySlugOrId}`)
      .single();

    if (!opp) return;

    if (isSaved) {
      // Hapus
      await supabase.rpc("remove_bookmark", {
        p_opportunity_id: opp.id,
        p_confirm: true,
      });
    } else {
      // Simpan
      await supabase.from("saved_opportunities").upsert({
        user_id: authData.user.id,
        opportunity_id: opp.id,
        application_status: "tertarik",
        saved_at: new Date().toISOString(),
        status_updated_at: new Date().toISOString(),
      });
    }
  } catch {}
}

/**
 * Admin: Menyimpan / Memperbarui Peluang ke Supabase
 */
export async function adminSaveOpportunityToDb(opp) {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    // Cari ID kategori utama
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .ilike("name", opp.category || "Beasiswa")
      .single();

    const categoryId = cat?.id;
    if (!categoryId) return;

    const slug = opp.id || opp.slug || `opp-${Date.now()}`;
    const pubStatus = opp.status === "Draft" ? "draf" : opp.status === "Diarsipkan" ? "diarsipkan" : opp.status === "Ditutup" ? "ditutup" : "terbit";

    const { data: savedOpp, error } = await supabase
      .from("opportunities")
      .upsert({
        slug,
        title: opp.title,
        organization: opp.organization,
        primary_category_id: categoryId,
        field: opp.field || "Umum",
        source_url: opp.sourceUrl || "https://navika.id",
        summary: opp.summary || "",
        summary_en: opp.summaryEn || opp.summary || "",
        requirements: opp.requirements || [],
        requirements_en: opp.requirementsEn || [],
        benefits: opp.benefits || [],
        benefits_en: opp.benefitsEn || [],
        publication_status: pubStatus,
        recommended: Boolean(opp.recommended),
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "slug" })
      .select("id")
      .single();

    if (!error && savedOpp?.id) {
      // Simpan deadlines & eligibility rules
      const days = Number(opp.demoDays) || 10;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      const localDateStr = targetDate.toISOString().split("T")[0];

      await supabase.from("deadlines").upsert({
        opportunity_id: savedOpp.id,
        local_date: localDateStr,
        precision: "tanggal",
      });

      await supabase.from("eligibility_rules").upsert({
        opportunity_id: savedOpp.id,
        allowed_majors: opp.targetMajors || ["Semua Jurusan"],
        other_requirements: opp.summary || "",
      });
    }
  } catch (err) {
    // Diamkan agar alur UI tidak macet jika Supabase offline
  }
}

/**
 * Admin: Mengarsipkan Peluang di Supabase (Soft Delete)
 */
export async function adminArchiveOpportunityInDb(slugOrId) {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    const { data: opp } = await supabase
      .from("opportunities")
      .select("id")
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .single();

    if (opp?.id) {
      await supabase.rpc("archive_opportunity", { p_id: opp.id });
    }
  } catch {}
}
