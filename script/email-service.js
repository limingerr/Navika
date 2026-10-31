/**
 * Modul Layanan Email Notifikasi NAVIKA
 * Mendukung pengiriman melalui Nodemailer (Gmail SMTP) dan Resend REST API sebagai fallback.
 */

import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
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

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const apiKey = process.env.RESEND_API_KEY;

  // ------------------------------------------------------------
  // 1. Pengiriman Utama: Nodemailer via Gmail SMTP
  // ------------------------------------------------------------
  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const fromAddress = `"NAVIKA Peluang Mahasiswa" <${emailUser}>`;

      // Jika penerima tunggal
      if (validRecipients.length === 1) {
        const info = await transporter.sendMail({
          from: fromAddress,
          to: validRecipients[0],
          subject,
          html,
        });

        return {
          success: true,
          id: info.messageId,
          recipients: validRecipients,
          totalSent: 1,
          provider: "nodemailer",
        };
      }

      // Jika banyak penerima, kirim menggunakan BCC agar privasi email terjaga
      const info = await transporter.sendMail({
        from: fromAddress,
        to: emailUser,
        bcc: validRecipients,
        subject,
        html,
      });

      return {
        success: true,
        id: info.messageId,
        recipients: validRecipients,
        totalSent: validRecipients.length,
        provider: "nodemailer_bcc",
      };
    } catch (err) {
      console.warn("Gagal mengirim via Nodemailer Gmail:", err.message);
      if (!apiKey) {
        return { success: false, error: `Nodemailer error: ${err.message}` };
      }
    }
  }

  // ------------------------------------------------------------
  // 2. Fallback: Resend REST API
  // ------------------------------------------------------------
  if (apiKey) {
    const from = process.env.RESEND_FROM_EMAIL || "NAVIKA <onboarding@resend.dev>";

    // Skenario 2a: Penerima tunggal
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
          provider: "resend",
        };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Skenario 2b: Banyak penerima (Batch)
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

    if (totalSent === 0 && errors.length > 0) {
      const fallbackEmail = process.env.NOTIFICATION_EMAIL_TO;
      if (fallbackEmail && typeof fallbackEmail === "string" && fallbackEmail.includes("@")) {
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
              provider: "resend_fallback",
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
      provider: "resend_batch",
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  return {
    success: false,
    error: "Konfigurasi pengirim email (EMAIL_USER / EMAIL_PASS atau RESEND_API_KEY belum disetel) di environment variables.",
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
            <td style="background:#0067A6;padding:28px 32px;text-align:left;">
              <span style="font-size:22px;font-weight:800;letter-spacing:0.5px;color:#ffffff;">NAVIKA</span>
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

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${oppUrl}" target="_blank" style="display:inline-block;background:#0067A6;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
                      Lihat Syarat & Cara Mendaftar &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;font-size:12px;color:#94a3b8;line-height:1.5;">
              <p style="margin:0 0 4px 0;">Email ini dikirim otomatis oleh sistem notifikasi NAVIKA.</p>
              <p style="margin:0;">Kamu menerima pesan ini karena berlangganan pembaruan peluang di <a href="${baseSite}" style="color:#0067A6;text-decoration:none;">NAVIKA</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Template Email Notifikasi Peluang Baru
 */
export async function sendNewOpportunityEmail({ to, opportunity, siteUrl }) {
  const baseSite = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://navika-pi.vercel.app";
  const oppUrl = `${baseSite}/peluang/${opportunity.id || opportunity.slug}`;
  const subject = `📢 [NAVIKA] Info ${opportunity.category || "Peluang"} Baru: ${opportunity.title}`;

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
            <td style="background:#0067A6;padding:28px 32px;text-align:left;">
              <span style="font-size:22px;font-weight:800;letter-spacing:0.5px;color:#ffffff;">NAVIKA</span>
              <p style="margin:4px 0 0 0;font-size:13px;color:#dbeafe;">Peluang Mahasiswa: Beasiswa, Magang & Bootcamp</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <span style="display:inline-block;background:#dcfce7;color:#166534;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;margin-bottom:16px;">
                ✨ Info Baru Dibuka
              </span>
              <h1 style="font-size:22px;line-height:1.3;margin:0 0 12px 0;color:#0f172a;">
                ${opportunity.category || "Peluang"} Baru Telah Terbit!
              </h1>
              <p style="font-size:15px;line-height:1.6;color:#475569;margin:0 0 20px 0;">
                Kabar baik! Ada peluang terbaru yang baru saja dibuka dan relevan untuk mahasiswa. Segera cek informasi lengkap dan kriterianya sebelum kuota terpenuhi.
              </p>

              <!-- Card Program -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <span style="display:inline-block;background:#dbeafe;color:#1e40af;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;margin-bottom:8px;">
                      ${opportunity.category || "Peluang"} &bull; ${opportunity.field || "Semua Bidang"}
                    </span>
                    <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 6px 0;">
                      ${opportunity.title}
                    </h2>
                    <p style="font-size:14px;color:#64748b;margin:0 0 8px 0;">
                      Penyelenggara: <strong>${opportunity.organization || "Mitra NAVIKA"}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${oppUrl}" target="_blank" style="display:inline-block;background:#0067A6;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
                      Cek Info & Syarat di NAVIKA &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;font-size:12px;color:#94a3b8;line-height:1.5;">
              <p style="margin:0 0 4px 0;">Email ini dikirim otomatis oleh sistem notifikasi NAVIKA.</p>
              <p style="margin:0;">Kamu menerima pesan ini karena berlangganan pembaruan peluang di <a href="${baseSite}" style="color:#0067A6;text-decoration:none;">NAVIKA</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({ to, subject, html });
}
