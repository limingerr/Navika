import { NextResponse } from "next/server";
import { sendDeadlineReminderEmail } from "@/script/email-service";
import { getNotificationRecipients, getSupabaseAdmin } from "@/lib/supabase/admin";
import { isAuthorizedAdmin } from "@/lib/supabase/require-admin";
import { isPushAccepted } from "@/script/notification-status";
import { deadlineTarget, jakartaDateAfterDays } from "@/script/notification-targets";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // 1. Verifikasi permintaan manual atau jadwal otomatis
    const { searchParams } = new URL(request.url);
    const isManual = searchParams.get("manual") === "true";
    const authHeader = request.headers.get("authorization");
    if (isManual) {
      if (!await isAuthorizedAdmin(request)) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    } else if (process.env.NODE_ENV !== "development" &&
      (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const onesignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const onesignalRestKey = process.env.ONESIGNAL_REST_API_KEY;
    const isOneSignalConfigured = Boolean(onesignalAppId && onesignalRestKey);

    const isEmailConfigured =
      Boolean(process.env.RESEND_API_KEY) ||
      Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    // 2. Hitung target tanggal H-2 (2 hari dari sekarang)
    const dateStr = jakartaDateAfterDays(new Date(), 2);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://navika-pi.vercel.app";
    const opportunitiesToNotify = [];

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ success: false, error: "Database notifikasi belum dikonfigurasi." }, { status: 503 });

    const { data: deadlines, error } = await supabase
          .from("deadlines")
          .select(`
            local_date,
            opportunity:opportunities (
              id,
              slug,
              title,
              organization,
              publication_status,
              primary_category:categories!primary_category_id (name)
            )
          `)
          .eq("local_date", dateStr);
    if (error || !Array.isArray(deadlines)) throw error || new Error("Deadline tidak dapat dibaca dari database.");
    for (const item of deadlines) {
      const opp = item.opportunity;
      if (opp?.publication_status === "terbit") opportunitiesToNotify.push(deadlineTarget(opp));
    }

    if (opportunitiesToNotify.length === 0) {
      return NextResponse.json({
        success: true,
        message: `Tidak ada peluang dengan deadline H-2 (${dateStr}) saat ini.`,
        date: dateStr,
        totalSent: 0,
        totalOpportunities: 0,
        totalPushSent: 0,
        totalEmailSent: 0,
        results: [],
      });
    }

    if (!isOneSignalConfigured && !isEmailConfigured) {
      return NextResponse.json({ success: false, error: "Layanan email dan OneSignal belum dikonfigurasi." }, { status: 503 });
    }

    // 5. Kirim Push Notification & Email untuk tiap peluang yang deadline-nya H-2
    let sentCount = 0;
    let emailSentCount = 0;
    const results = [];

    for (const opp of opportunitiesToNotify) {
      // 5a. Push Notification OneSignal (jika dikonfigurasi)
      if (isOneSignalConfigured) {
        try {
          const payload = {
            app_id: onesignalAppId,
            included_segments: ["Subscribed Users"],
            headings: {
              id: `⏳ Deadline H-2: ${opp.title}`,
              en: `⏳ Deadline in 2 Days: ${opp.title}`,
            },
            contents: {
              id: `Pendaftaran ${opp.category} "${opp.title}" (${opp.organization}) ditutup dalam 2 hari. Segera lengkapi berkas pendaftaranmu!`,
              en: `Registration for ${opp.category} "${opp.title}" closes in 2 days. Complete your application now!`,
            },
            url: `${siteUrl}/peluang/${opp.id}`,
          };

          const response = await fetch("https://api.onesignal.com/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Key ${onesignalRestKey}`,
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();
          results.push({ id: opp.id, pushStatus: response.status, pushMessageId: data?.id || null, pushError: isPushAccepted(response, data) ? null : String(data?.errors || "").includes("All included players are not subscribed") ? "OneSignal tidak menemukan perangkat berlangganan pada aplikasi pengirim." : data?.errors || (response.ok ? "Tidak ada langganan push yang menerima pesan." : `OneSignal HTTP ${response.status}`) });
          if (isPushAccepted(response, data)) sentCount++;
        } catch (e) {
          results.push({ id: opp.id, pushError: e.message });
        }
      } else {
        results.push({
          id: opp.id,
          pushStatus: "skipped",
          pushNotice: "OneSignal belum dikonfigurasi di environment variables",
        });
      }

      // Email hanya untuk pemegang bookmark yang mengaktifkan pemberitahuan.
      const isEmailConfigured =
        Boolean(process.env.RESEND_API_KEY) ||
        Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

      if (isEmailConfigured) {
        try {
          const recipientInfo = await getNotificationRecipients({ opportunityId: opp.databaseId });
          if (recipientInfo.emails.length > 0) {
            const emailRes = await sendDeadlineReminderEmail({
              to: recipientInfo.emails,
              opportunity: opp,
              targetDate: dateStr,
              siteUrl,
            });
            if (emailRes.success) {
              emailSentCount += emailRes.totalSent || 0;
            }
            results.push({
              id: opp.id,
              emailStatus: emailRes.success ? 200 : 500,
              recipientsCount: recipientInfo.count,
              optedInCount: recipientInfo.optedInCount,
              bookmarkCount: recipientInfo.bookmarkCount,
              eligibleCount: recipientInfo.eligibleCount,
              recipientsSource: recipientInfo.source,
              sentCount: emailRes.totalSent || 0,
              failedCount: emailRes.failedRecipients?.length || 0,
              provider: emailRes.provider,
              emailMessageIds: emailRes.ids || (emailRes.id ? [emailRes.id] : []),
              emailError: emailRes.success ? null : emailRes.error || "Pengiriman email gagal.",
            });
          }
          else results.push({
            id: opp.id,
            optedInCount: recipientInfo.optedInCount,
            bookmarkCount: recipientInfo.bookmarkCount,
            eligibleCount: recipientInfo.eligibleCount,
            emailNotice: recipientInfo.bookmarkCount === 0
              ? "Belum ada mahasiswa yang menyimpan peluang H-2 ini."
              : recipientInfo.optedInCount === 0
                ? "Belum ada mahasiswa yang mengaktifkan email di database."
                : recipientInfo.eligibleCount === 0
                  ? "Pemegang bookmark peluang H-2 ini belum mengaktifkan email."
                  : "Akun yang memenuhi syarat tidak memiliki alamat email autentikasi.",
          });
        } catch (e) {
          console.warn("Gagal mengirim email pengingat:", e.message);
          results.push({ id: opp.id, emailError: e.message });
        }
      } else results.push({ id: opp.id, emailNotice: "Layanan email belum dikonfigurasi." });

      // Berikan jeda 1 detik sebelum memproses program berikutnya agar koneksi SMTP tetap stabil
      await new Promise((r) => setTimeout(r, 1000));
    }

    return NextResponse.json({
      success: true,
      message: `Cron job H-2 berhasil diproses untuk tanggal ${dateStr}.`,
      date: dateStr,
      totalOpportunities: opportunitiesToNotify.length,
      totalPushSent: sentCount,
      totalEmailSent: emailSentCount,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return GET(request);
}
