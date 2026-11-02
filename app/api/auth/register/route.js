import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/script/email-service";
import { isAllowedRegistrationEmail } from "@/script/account-state";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, password } = body;

    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanName) {
      return NextResponse.json(
        { success: false, error: "Nama lengkap wajib diisi." },
        { status: 400 }
      );
    }

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Alamat email tidak valid." },
        { status: 400 }
      );
    }

    if (!isAllowedRegistrationEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Pendaftaran hanya mendukung email @gmail.com atau email kampus (.ac.id)." },
        { status: 400 }
      );
    }

    if (!cleanPass || cleanPass.length < 8) {
      return NextResponse.json(
        { success: false, error: "Kata sandi minimal harus 8 karakter." },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      // Fallback untuk mode development tanpa koneksi Supabase
      return NextResponse.json({
        success: true,
        user: {
          id: "student-mock-" + Date.now(),
          email: cleanEmail,
          user_metadata: { name: cleanName },
        },
      });
    }

    // 1. Daftarkan user ke Supabase Auth dengan auto-confirm (bebas rate-limit SMTP bawaan)
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: cleanEmail,
      password: cleanPass,
      email_confirm: true,
      user_metadata: {
        name: cleanName,
        full_name: cleanName,
      },
    });

    if (authError) {
      const msg = authError.message?.toLowerCase() || "";
      if (msg.includes("already registered") || authError.status === 422) {
        return NextResponse.json(
          {
            success: false,
            error: "Email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk ke akun Anda.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: authError.message || "Gagal mendaftarkan akun." },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 2. Inisialisasi baris di tabel profiles
    await admin.from("profiles").upsert(
      {
        user_id: userId,
        name: cleanName,
        university: "",
        major: "",
        semester: 1,
        gpa: null,
        interests: [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    // 3. Pastikan peran adalah mahasiswa di user_roles
    await admin.from("user_roles").upsert(
      {
        user_id: userId,
        role: "mahasiswa",
        created_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    // 4. Kirim Email Selamat Datang Resmi via Resend / Gmail SMTP (Solusi C)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://navika-pi.vercel.app";
    const welcomeHtml = `
      <div style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0067A6; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">NAVIKA</h1>
          <p style="color: #64748b; margin: 4px 0 0; font-size: 14px;">Platform Navigasi Peluang Mahasiswa</p>
        </div>

        <div style="background: linear-gradient(135deg, #02a9df, #00669c); padding: 24px; border-radius: 12px; color: #ffffff; margin-bottom: 24px;">
          <h2 style="margin: 0 0 8px; font-size: 20px;">Selamat Datang, ${cleanName}! 🎓</h2>
          <p style="margin: 0; font-size: 14px; opacity: 0.95; line-height: 1.5;">
            Akun mahasiswa Anda telah resmi aktif dan terverifikasi di NAVIKA. Sekarang Anda dapat menemukan beasiswa, program magang, dan bootcamp yang paling sesuai dengan minat serta jurusan Anda.
          </p>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 16px; color: #1e293b; margin-bottom: 12px;">Fitur yang Siap Anda Gunakan:</h3>
          <ul style="color: #475569; font-size: 14px; line-height: 1.7; padding-left: 20px; margin: 0;">
            <li><strong>Katalog 46+ Peluang Resmi:</strong> Beasiswa, Magang BUMN/Swasta, dan Pelatihan Teknologi.</li>
            <li><strong>Notifikasi & Pengingat Deadline:</strong> Pantau batas pendaftaran agar tidak tertinggal.</li>
            <li><strong>Rekomendasi Cerdas:</strong> Kurasi otomatis berdasarkan program studi dan IPK Anda.</li>
            <li><strong>Bookmark & Tracker:</strong> Simpan peluang favorit dan pantau tahapan seleksinya.</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
          <a href="${siteUrl}/masuk" style="background-color: #0067A6; color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 14px; display: inline-block;">
            Mulai Eksplorasi Peluang &rarr;
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0; line-height: 1.5;">
          Email ini dikirimkan secara otomatis sebagai konfirmasi pendaftaran akun Anda di NAVIKA.<br/>
          &copy; ${new Date().getFullYear()} NAVIKA. Hak Cipta Dilindungi.
        </p>
      </div>
    `;

    sendEmail({
      to: cleanEmail,
      subject: `Selamat Datang di NAVIKA, ${cleanName}! 🎓`,
      html: welcomeHtml,
    }).catch((emailErr) => {
      console.warn("Pemberitahuan email sambutan gagal dikirim:", emailErr?.message || emailErr);
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        name: cleanName,
      },
    });
  } catch (err) {
    console.error("Kesalahan pada POST /api/auth/register:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan saat memproses pendaftaran." },
      { status: 500 }
    );
  }
}
