import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/src/lib/supabase/admin";
import { isAuthorizedAdmin } from "@/src/lib/supabase/require-admin";

const PROTECTED_ADMIN_EMAILS = [
  "admin@navika.id",
  "limingerr681@gmail.com",
  "navika01112026@gmail.com",
];

export async function GET(request) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      // Demo fallback jika Supabase belum terkonfigurasi
      return NextResponse.json({
        success: true,
        users: [
          {
            id: "usr-demo-1",
            name: "Fajar Pratama",
            email: "fajar.pratama@univ.ac.id",
            university: "Universitas Indonesia",
            major: "Teknik Informatika",
            semester: 5,
            gpa: "3.85",
            role: "mahasiswa",
            interests: ["Beasiswa", "Magang", "Bootcamp"],
            saved_count: 3,
            saved_opportunities: [
              {
                opportunity_id: "demo-opp-1",
                title: "Djarum Beasiswa Plus 2026",
                category: "Beasiswa",
                provider: "Djarum Foundation",
                deadline: "2026-11-20",
                application_status: "sedang_disiapkan",
                saved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                status_updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                opportunity_id: "demo-opp-2",
                title: "Vinix7 Frontend Web Developer Intern",
                category: "Magang",
                provider: "Vinix7",
                deadline: "2026-11-15",
                application_status: "sudah_mendaftar",
                saved_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                status_updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                opportunity_id: "demo-opp-3",
                title: "Hacktiv8 Fullstack JavaScript Bootcamp",
                category: "Bootcamp",
                provider: "Hacktiv8",
                deadline: "2026-11-25",
                application_status: "tertarik",
                saved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status_updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              },
            ],
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            last_sign_in_at: new Date().toISOString(),
          },
          {
            id: "usr-demo-2",
            name: "Ayip Batagor",
            email: "ayip.batagor@itb.ac.id",
            university: "Institut Teknologi Bandung",
            major: "Sistem Informasi",
            semester: 3,
            gpa: "3.72",
            role: "mahasiswa",
            interests: ["Bootcamp", "Beasiswa"],
            saved_count: 2,
            saved_opportunities: [
              {
                opportunity_id: "demo-opp-4",
                title: "Bangkit Academy 2026 - Cloud Computing",
                category: "Bootcamp",
                provider: "Google & GoTo",
                deadline: "2026-11-30",
                application_status: "diterima",
                saved_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                status_updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                opportunity_id: "demo-opp-5",
                title: "Beasiswa Bank Indonesia",
                category: "Beasiswa",
                provider: "Bank Indonesia",
                deadline: "2026-12-05",
                application_status: "tertarik",
                saved_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                status_updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              },
            ],
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            last_sign_in_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "usr-demo-3",
            name: "Siti Rahmawati",
            email: "siti.rahma@ugm.ac.id",
            university: "Universitas Gadjah Mada",
            major: "Manajemen Bisnis",
            semester: 6,
            gpa: "3.90",
            role: "mahasiswa",
            interests: ["Beasiswa", "Seminar / Webinar"],
            saved_count: 1,
            saved_opportunities: [
              {
                opportunity_id: "demo-opp-6",
                title: "Pertamina Sobat Bumi 2026",
                category: "Beasiswa",
                provider: "Pertamina Foundation",
                deadline: "2026-11-18",
                application_status: "sudah_mendaftar",
                saved_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                status_updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              },
            ],
            created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            last_sign_in_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "usr-demo-admin",
            name: "Pengelola Navika",
            email: "admin@navika.id",
            university: "Pusat Pengelola Navika",
            major: "Pengelola Konten & Katalog",
            semester: 8,
            gpa: "4.00",
            role: "pengelola",
            interests: [],
            saved_count: 0,
            saved_opportunities: [],
            created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            last_sign_in_at: new Date().toISOString(),
          },
        ],
      });
    }

    // 1. Ambil seluruh data pengguna dari Supabase Auth
    const { data: authData, error: authError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // 2. Ambil data profiles, user_roles, saved_opportunities, dan opportunities
    const [{ data: profiles }, { data: roles }, { data: savedOpps }, { data: allOpps }] =
      await Promise.all([
        admin.from("profiles").select("*"),
        admin.from("user_roles").select("*"),
        admin
          .from("saved_opportunities")
          .select("user_id, opportunity_id, application_status, saved_at, status_updated_at"),
        admin
          .from("opportunities")
          .select("id, title, category, provider, deadline, application_url, publication_status"),
      ]);

    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
    const roleMap = new Map((roles || []).map((r) => [r.user_id, r.role]));
    const oppMap = new Map((allOpps || []).map((o) => [o.id, o]));

    // Kelompokkan saved_opportunities per user_id
    const userSavedMap = new Map();
    for (const item of savedOpps || []) {
      if (!userSavedMap.has(item.user_id)) {
        userSavedMap.set(item.user_id, []);
      }
      const opp = oppMap.get(item.opportunity_id);
      userSavedMap.get(item.user_id).push({
        opportunity_id: item.opportunity_id,
        title: opp?.title || `Peluang #${item.opportunity_id}`,
        category: opp?.category || "Lainnya",
        provider: opp?.provider || "-",
        deadline: opp?.deadline || "-",
        application_url: opp?.application_url || null,
        application_status: item.application_status || "tertarik",
        saved_at: item.saved_at,
        status_updated_at: item.status_updated_at,
      });
    }

    const users = (authData?.users || []).map((u) => {
      const prof = profileMap.get(u.id);
      const isConfiguredAdminEmail = PROTECTED_ADMIN_EMAILS.includes(u.email?.toLowerCase());
      const role =
        roleMap.get(u.id) ||
        (isConfiguredAdminEmail || u.email?.includes("admin@") ? "pengelola" : "mahasiswa");
      const saved = userSavedMap.get(u.id) || [];

      return {
        id: u.id,
        name:
          prof?.name ||
          u.user_metadata?.full_name ||
          u.user_metadata?.name ||
          u.email?.split("@")[0] ||
          "Mahasiswa",
        email: u.email,
        university: prof?.university || "Belum diisi",
        major: prof?.major || "Belum diisi",
        semester: prof?.semester || null,
        gpa: prof?.gpa ? Number(prof.gpa).toFixed(2) : "-",
        role,
        interests: prof?.interests || [],
        saved_count: saved.length,
        saved_opportunities: saved,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
      };
    });

    return NextResponse.json({ success: true, users });
  } catch (err) {
    console.error("Kesalahan pada GET /api/admin/users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const admin = getSupabaseAdmin();
    const body = await request.json().catch(() => ({}));
    const { userId, role, name, university, major, semester, gpa } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID wajib disertakan." }, { status: 400 });
    }

    // Periksa apakah target pengguna adalah akun pengelola utama yang dilindungi
    if (admin) {
      const { data: targetUser } = await admin.auth.admin.getUserById(userId);
      const targetEmail = targetUser?.user?.email?.toLowerCase();
      if (targetEmail && PROTECTED_ADMIN_EMAILS.includes(targetEmail) && role === "mahasiswa") {
        return NextResponse.json(
          { error: "Akun pengelola utama dilindungi dan tidak dapat diturunkan perannya." },
          { status: 403 }
        );
      }
    }

    if (!admin) {
      return NextResponse.json({
        success: true,
        message: "Perubahan pengguna berhasil disimpan (mode demo/lokal).",
      });
    }

    // 1. Update Peran (Role) jika ada
    if (role && ["mahasiswa", "pengelola"].includes(role)) {
      await admin.from("user_roles").upsert(
        { user_id: userId, role, created_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    }

    // 2. Update Data Profil Mahasiswa jika ada
    const profileUpdates = {};
    if (name !== undefined) profileUpdates.name = name;
    if (university !== undefined) profileUpdates.university = university;
    if (major !== undefined) profileUpdates.major = major;
    if (semester !== undefined) profileUpdates.semester = Number(semester) || null;
    if (gpa !== undefined) profileUpdates.gpa = gpa ? Number(gpa) : null;
    profileUpdates.updated_at = new Date().toISOString();

    if (Object.keys(profileUpdates).length > 1) {
      await admin.from("profiles").upsert(
        { user_id: userId, ...profileUpdates },
        { onConflict: "user_id" }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data pengguna berhasil diperbarui.",
    });
  } catch (err) {
    console.error("Kesalahan pada PATCH /api/admin/users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const admin = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "ID pengguna wajib disertakan." }, { status: 400 });
    }

    if (admin) {
      const { data: targetUser } = await admin.auth.admin.getUserById(userId);
      const targetEmail = targetUser?.user?.email?.toLowerCase();
      if (targetEmail && PROTECTED_ADMIN_EMAILS.includes(targetEmail)) {
        return NextResponse.json(
          { error: "Akun pengelola utama dilindungi dan tidak dapat dihapus." },
          { status: 403 }
        );
      }

      // Hapus dari auth.users (cascade akan membersihkan profiles & roles)
      const { error: delError } = await admin.auth.admin.deleteUser(userId);
      if (delError) {
        return NextResponse.json({ error: delError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil dihapus permanen.",
    });
  } catch (err) {
    console.error("Kesalahan pada DELETE /api/admin/users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
