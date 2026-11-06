import { NextResponse } from "next/server";
import { sendDeadlineReminderEmail } from "@/src/services/email-service";
import { getNotificationRecipients, getSupabaseAdmin } from "@/src/lib/supabase/admin";
import { isAuthorizedAdmin } from "@/src/lib/supabase/require-admin";
import { deadlineTarget, jakartaDateAfterDays } from "@/src/lib/notification-targets";
import { getBookmarkedStudentIds, getDeadlineRecipientIds, storeNotifications } from "@/src/services/in-app-service";
import { sendPushToUsers } from "@/src/services/push-service";

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
    const targetDates = new Map([2, 1, 0].map((days) => [jakartaDateAfterDays(new Date(), days), days]));

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
        message: "Tidak ada peluang dengan deadline H-2, H-1, atau hari H.",
        dates: [...targetDates.keys()],
        totalSent: 0,
        totalOpportunities: 0,
        totalPushSent: 0,
        totalWebStored: 0,
        totalEmailSent: 0,
        results: [],
      });
    }

    // 5. Kirim Push Notification & Email untuk tiap peluang yang deadline-nya H-2
    let sentCount = 0;
    let emailSentCount = 0;
    let webStoredCount = 0;
    const results = [];

    for (const opp of opportunitiesToNotify) {
      const stage = opp.daysBefore === 0 ? "hari H" : `H-${opp.daysBefore}`;
      let recipientIds;
      let webStored = 0;
      let webError = null;
      try {
        recipientIds = await getDeadlineRecipientIds(opp.databaseId, supabase);
        webStored = await storeNotifications({
          userIds: recipientIds, kind: "deadline", title: `Deadline ${stage}: ${opp.title}`,
          body: `Pendaftaran ${opp.title} ditutup ${opp.daysBefore === 0 ? "hari ini" : `dalam ${opp.daysBefore} hari`}.`,
          href: `/peluang/${encodeURIComponent(opp.id)}`, admin: supabase,
        });
      } catch (error) {
        webError = `Notifikasi web gagal disimpan: ${error.message}`;
        console.warn(`${opp.id} ${stage}: ${webError}`);
        recipientIds ||= await getBookmarkedStudentIds(opp.databaseId, supabase);
      }
      if (!recipientIds.length) console.warn(`Pengingat ${stage} ${opp.id}: tidak ada pemegang bookmark dengan pengingat aktif.`);
      webStoredCount += webStored;
      results.push({ id: opp.id, stage, webStored, webError });
      // 5a. Push Notification OneSignal (jika dikonfigurasi)
      if (isOneSignalConfigured) {
        try {
          const push = await sendPushToUsers({ userIds: recipientIds,
            headings: { id: `Deadline ${stage}: ${opp.title}`, en: `Deadline ${stage}: ${opp.title}` },
            contents: { id: `Pendaftaran ${opp.title} ditutup ${opp.daysBefore === 0 ? "hari ini" : `dalam ${opp.daysBefore} hari`}.`, en: `Registration for ${opp.title} closes soon.` },
            url: `${siteUrl}/peluang/${encodeURIComponent(opp.id)}` });
          results.push({ id: opp.id, stage, pushRecipients: push.recipients, pushError: push.error });
          sentCount += push.count;
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
              targetDate: opp.targetDate,
              daysBefore: opp.daysBefore,
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
      message: "Pengingat H-2, H-1, dan hari H selesai diproses.",
      dates: [...targetDates.keys()],
      totalOpportunities: opportunitiesToNotify.length,
      totalPushSent: sentCount,
      totalWebStored: webStoredCount,
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
