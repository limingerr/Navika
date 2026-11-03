import { NextResponse } from "next/server";
import { sendDeadlineReminderEmail } from "@/script/email-service";
import { getNotificationRecipients, getPushUserIds, getSupabaseAdmin } from "@/lib/supabase/admin";
import { isAuthorizedAdmin } from "@/lib/supabase/require-admin";
import { deadlineTarget, jakartaDateAfterDays } from "@/script/notification-targets";
import { sendPushToUsers } from "@/script/push-service";

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

    // 2. Hitung target tanggal H-2, H-1, dan hari H.
    const targetDays = [2, 1, 0];
    const targetDates = new Map(targetDays.map((days) => [jakartaDateAfterDays(new Date(), days), days]));

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
          .in("local_date", [...targetDates.keys()]);
    if (error || !Array.isArray(deadlines)) throw error || new Error("Deadline tidak dapat dibaca dari database.");
    for (const item of deadlines) {
      const opp = item.opportunity;
      if (opp?.publication_status === "terbit") opportunitiesToNotify.push({ ...deadlineTarget(opp), daysBefore: targetDates.get(item.local_date), targetDate: item.local_date });
    }

    if (opportunitiesToNotify.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Tidak ada peluang dengan deadline H-2, H-1, atau hari H saat ini.",
        dates: [...targetDates.keys()],
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

    // 5. Kirim push dan email untuk tiap peluang yang mendekati deadline.
    let sentCount = 0;
    let emailSentCount = 0;
    const results = [];

    for (const opp of opportunitiesToNotify) {
      const stage = opp.daysBefore === 0 ? "hari H" : `H-${opp.daysBefore}`;
      const result = { id: opp.id, title: opp.title, stage };
      try {
        const userIds = await getPushUserIds({ opportunityId: opp.databaseId });
        const push = await sendPushToUsers({
          userIds,
          headings: { id: `⏳ Deadline ${stage}: ${opp.title}`, en: `⏳ Deadline ${stage}: ${opp.title}` },
          contents: { id: `Pendaftaran ${opp.title} (${opp.organization}) ditutup ${opp.daysBefore === 0 ? "hari ini" : `dalam ${opp.daysBefore} hari`}.`, en: `Registration for ${opp.title} closes ${opp.daysBefore === 0 ? "today" : `in ${opp.daysBefore} day(s)`}.` },
          url: `${siteUrl}/peluang/${encodeURIComponent(opp.id)}`,
        });
        sentCount += push.count;
        Object.assign(result, { pushMessageIds: push.ids || [], pushRecipients: push.recipients || 0, pushError: push.error });
      } catch (error) {
        result.pushError = error.message;
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
              targetDate: opp.targetDate,
              daysBefore: opp.daysBefore,
              siteUrl,
            });
            if (emailRes.success) {
              emailSentCount += emailRes.totalSent || 0;
            }
            Object.assign(result, {
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
          else Object.assign(result, {
            optedInCount: recipientInfo.optedInCount,
            bookmarkCount: recipientInfo.bookmarkCount,
            eligibleCount: recipientInfo.eligibleCount,
            emailNotice: recipientInfo.bookmarkCount === 0
              ? `Belum ada mahasiswa yang menyimpan peluang ${stage} ini.`
              : recipientInfo.optedInCount === 0
                ? "Belum ada mahasiswa yang mengaktifkan email di database."
                : recipientInfo.eligibleCount === 0
                  ? `Pemegang bookmark peluang ${stage} ini belum mengaktifkan email.`
                  : "Akun yang memenuhi syarat tidak memiliki alamat email autentikasi.",
          });
        } catch (e) {
          console.warn("Gagal mengirim email pengingat:", e.message);
          result.emailError = e.message;
        }
      } else result.emailNotice = "Layanan email belum dikonfigurasi.";

      results.push(result);

      // Berikan jeda 1 detik sebelum memproses program berikutnya agar koneksi SMTP tetap stabil
      await new Promise((r) => setTimeout(r, 1000));
    }

    return NextResponse.json({
      success: true,
      message: "Pengingat H-2, H-1, dan hari H selesai diproses.",
      dates: [...targetDates.keys()],
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
