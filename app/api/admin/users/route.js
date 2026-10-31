import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
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

    // 2. Ambil data profiles & user_roles
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      admin.from("profiles").select("*"),
      admin.from("user_roles").select("*"),
    ]);

    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
    const roleMap = new Map((roles || []).map((r) => [r.user_id, r.role]));

    const users = (authData?.users || []).map((u) => {
      const prof = profileMap.get(u.id);
      const role = roleMap.get(u.id) || (u.email?.includes("admin@") ? "pengelola" : "mahasiswa");

      return {
        id: u.id,
        name: prof?.name || u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "Mahasiswa",
        email: u.email,
        university: prof?.university || "Belum diisi",
        major: prof?.major || "Belum diisi",
        semester: prof?.semester || null,
        gpa: prof?.gpa ? Number(prof.gpa).toFixed(2) : "-",
        role,
        interests: prof?.interests || [],
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
  try {
    const admin = getSupabaseAdmin();
    const body = await request.json().catch(() => ({}));
    const { userId, role, name, university, major, semester, gpa } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID wajib disertakan." }, { status: 400 });
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
      message: "Data pengguna mahasiswa berhasil diperbarui.",
    });
  } catch (err) {
    console.error("Kesalahan pada PATCH /api/admin/users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "ID pengguna wajib disertakan." }, { status: 400 });
    }

    if (!admin) {
      return NextResponse.json({
        success: true,
        message: "Pengguna berhasil dihapus (mode demo/lokal).",
      });
    }

    // Hapus dari auth.users (cascade akan membersihkan profiles & roles)
    const { error: delError } = await admin.auth.admin.deleteUser(userId);
    if (delError) {
      return NextResponse.json({ error: delError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Pengguna mahasiswa berhasil dihapus permanen.",
    });
  } catch (err) {
    console.error("Kesalahan pada DELETE /api/admin/users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
