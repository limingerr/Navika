/**
 * Modul Layanan Email Notifikasi NAVIKA via Resend REST API
 */

export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, error: "RESEND_API_KEY belum disetel di environment variables." };
  }

  const from = process.env.RESEND_FROM_EMAIL || "NAVIKA <onboarding@resend.dev>";
  const rawList = Array.isArray(to) ? to : [to];
  const validRecipients = Array.from(
    new Set(
      rawList
        .filter((email) => email && typeof email === "string" && email.includes("@"))
        .map((email) => email.trim().toLowerCase())
    )
  );

  if (validRecipients.length === 0) {
    return { success: false, error: "Alamat email penerima tidak valid atau kosong." };
  }

  // Skenario 1: Penerima tunggal
  if (validRecipients.length === 1) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [validRecipients[0]],
          subject,
          html,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          error: data.message || "Gagal mengirim email.",
          data,
        };
      }

      return {
        success: true,
        id: data.id,
        recipients: validRecipients,
        totalSent: 1,
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Skenario 2: Banyak penerima (Massal / Seluruh Pengguna)
  // Menggunakan Resend Batch API (/emails/batch) dengan maksimal 100 email per panggilan HTTP.
  // Setiap user menerima email secara personal tanpa mengekspos alamat email user lain di header 'To'.
  const chunkSize = 100;
  const chunks = [];
  for (let i = 0; i < validRecipients.length; i += chunkSize) {
    chunks.push(validRecipients.slice(i, i + chunkSize));
  }

  let totalSent = 0;
  const ids = [];
  const errors = [];

  for (const chunk of chunks) {
    const batchPayload = chunk.map((recipient) => ({
      from,
      to: [recipient],
      subject,
      html,
    }));

    try {
      const response = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchPayload),
      });

      const data = await response.json();
      if (!response.ok) {
        errors.push(data.message || `HTTP ${response.status}`);
      } else {
        const sentInChunk = Array.isArray(data?.data) ? data.data.length : chunk.length;
        totalSent += sentInChunk;
        if (Array.isArray(data?.data)) {
          ids.push(...data.data.map((item) => item.id));
        }
      }
    } catch (err) {
      errors.push(err.message);
    }
  }

  // Jika pengiriman batch gagal (misalnya karena akun Resend free-tier hanya mengizinkan email terdaftar),
  // coba kirim ke email fallback jika tersedia agar pengujian pengembang tidak macet.
  if (totalSent === 0 && errors.length > 0) {
    const fallbackEmail = process.env.NOTIFICATION_EMAIL_TO;
    if (fallbackEmail && typeof fallbackEmail === "string" && fallbackEmail.includes("@")) {
      console.warn("Batch Resend gagal, mencoba fallback ke email testing terdaftar:", errors.join("; "));
      try {
        const fallbackRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [fallbackEmail.trim().toLowerCase()],
            subject: `[Fallback Testing] ${subject}`,
            html,
          }),
        });
        const fbData = await fallbackRes.json();
        if (fallbackRes.ok) {
          return {
            success: true,
            id: fbData.id,
            recipients: [fallbackEmail],
            totalSent: 1,
            warning: "Email dikirim ke alamat fallback karena pembatasan tier Resend: " + errors.join("; "),
          };
        }
      } catch {}
    }

    return {
      success: false,
      error: errors.join("; "),
      recipients: validRecipients,
      totalSent: 0,
    };
  }

  return {
    success: totalSent > 0,
    totalSent,
    recipients: validRecipients,
    ids,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Template Email Pengingat Deadline H-2
 */
export async function sendDeadlineReminderEmail({ to, opportunity, targetDate, siteUrl }) {
  const baseSite = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://navika-pi.vercel.app";
  const oppUrl = `${baseSite}/peluang/${opportunity.id || opportunity.slug}`;
  const subject = `⏳ [NAVIKA] Pengingat: Pendaftaran "${opportunity.title}" Ditutup 2 Hari Lagi!`;

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background:#2563eb;padding:28px 32px;text-align:left;">
              <span style="font-size:20px;font-weight:800;letter-spacing:0.5px;color:#ffffff;">NAVIKA</span>
              <p style="margin:4px 0 0 0;font-size:13px;color:#dbeafe;">Peluang Mahasiswa: Beasiswa, Magang & Bootcamp</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <span style="display:inline-block;background:#fef3c7;color:#92400e;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;margin-bottom:16px;">
                ⏳ Batas Waktu H-2
              </span>
              <h1 style="font-size:22px;line-height:1.3;margin:0 0 12px 0;color:#0f172a;">
                Pengingat: Deadline Pendaftaran Segera Ditutup!
              </h1>
              <p style="font-size:15px;line-height:1.6;color:#475569;margin:0 0 20px 0;">
                Halo! Program peluang yang tersimpan di radar belajarmu akan segera menutup pendaftaran dalam <strong>2 hari ke depan</strong> (${targetDate || "segera"}). Pastikan berkas dan persyaratannya sudah siap.
              </p>

              <!-- Card Program -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <span style="display:inline-block;background:#dbeafe;color:#1e40af;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;margin-bottom:8px;">
                      ${opportunity.category || "Peluang"}
                    </span>
                    <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 6px 0;">
                      ${opportunity.title}
                    </h2>
                    <p style="font-size:14px;color:#64748b;margin:0 0 12px 0;">
                      Diselenggarakan oleh: <strong>${opportunity.organization || "Mitra NAVIKA"}</strong>
                    </p>
                    <p style="font-size:13px;color:#334155;margin:0;line-height:1.5;">
                      Batas Akhir: <strong style="color:#dc2626;">2 Hari Lagi</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Button CTA -->
              <div style="text-align:center;margin:28px 0 16px 0;">
                <a href="${oppUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:10px;box-shadow:0 2px 6px rgba(37,99,235,0.3);">
                  Lihat Detail & Persyaratan Lengkap &rarr;
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;font-size:12px;color:#94a3b8;line-height:1.5;">
              <p style="margin:0 0 6px 0;">
                Email ini dikirim otomatis oleh <strong>NAVIKA</strong> karena kamu mengaktifkan pengingat peluang.
              </p>
              <p style="margin:0;">
                Kunjungi <a href="${baseSite}" style="color:#2563eb;text-decoration:none;">Navika Web App</a> untuk mengatur preferensi notifikasi.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, html });
}

/**
 * Template Email Info Peluang Baru Diterbitkan
 */
export async function sendNewOpportunityEmail({ to, opportunity, siteUrl }) {
  const baseSite = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://navika-pi.vercel.app";
  const oppUrl = `${baseSite}/peluang/${opportunity.id || opportunity.slug}`;
  const subject = `📢 [NAVIKA] Peluang Baru: ${opportunity.title} (${opportunity.organization})`;

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background:#2563eb;padding:28px 32px;text-align:left;">
              <span style="font-size:20px;font-weight:800;letter-spacing:0.5px;color:#ffffff;">NAVIKA</span>
              <p style="margin:4px 0 0 0;font-size:13px;color:#dbeafe;">Peluang Mahasiswa: Beasiswa, Magang & Bootcamp</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <span style="display:inline-block;background:#dcfce7;color:#166534;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;margin-bottom:16px;">
                📢 Program Baru Dibuka
              </span>
              <h1 style="font-size:22px;line-height:1.3;margin:0 0 12px 0;color:#0f172a;">
                Ada Peluang Baru yang Menarik untuk Kamu!
              </h1>
              <p style="font-size:15px;line-height:1.6;color:#475569;margin:0 0 20px 0;">
                Halo! Kami baru saja menambahkan program <strong>${opportunity.category || "peluang"}</strong> terbaru ke dalam katalog NAVIKA. Simak rincian singkatnya di bawah ini:
              </p>

              <!-- Card Program -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <span style="display:inline-block;background:#dbeafe;color:#1e40af;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;margin-bottom:8px;">
                      ${opportunity.category || "Peluang"}
                    </span>
                    <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 6px 0;">
                      ${opportunity.title}
                    </h2>
                    <p style="font-size:14px;color:#64748b;margin:0 0 12px 0;">
                      Penyelenggara: <strong>${opportunity.organization || "Mitra NAVIKA"}</strong>
                    </p>
                    <p style="font-size:13px;color:#334155;margin:0;line-height:1.5;">
                      Bidang / Jurusan: <strong>${opportunity.field || "Semua Jurusan"}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Button CTA -->
              <div style="text-align:center;margin:28px 0 16px 0;">
                <a href="${oppUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:10px;box-shadow:0 2px 6px rgba(37,99,235,0.3);">
                  Buka & Simpan Peluang Ini &rarr;
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;font-size:12px;color:#94a3b8;line-height:1.5;">
              <p style="margin:0 0 6px 0;">
                Kamu menerima email ini karena terdaftar sebagai penerima notifikasi katalog peluang <strong>NAVIKA</strong>.
              </p>
              <p style="margin:0;">
                Kunjungi <a href="${baseSite}" style="color:#2563eb;text-decoration:none;">Navika Web App</a> untuk melihat semua peluang.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, html });
}
