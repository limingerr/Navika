import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { opportunities as staticOpportunities } from "@/script/opportunities";
import { sendDeadlineReminderEmail } from "@/script/email-service";
import { getNotificationRecipients } from "@/lib/supabase/admin";

export async function GET(request) {
  try {
    // 1. Verifikasi keamanan CRON_SECRET jika dikonfigurasi di Vercel
    const { searchParams } = new URL(request.url);
    const isManual = searchParams.get("manual") === "true";
    const authHeader = request.headers.get("authorization");
    if (!isManual && process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Izinkan jika dijalankan di development / localhost
      const host = request.headers.get("host") || "";
      if (!host.includes("localhost") && !host.includes("127.0.0.1")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const onesignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const onesignalRestKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!onesignalAppId || !onesignalRestKey) {
      return NextResponse.json(
        {
          error: "Konfigurasi OneSignal belum lengkap.",
          detail: "Pastikan NEXT_PUBLIC_ONESIGNAL_APP_ID dan ONESIGNAL_REST_API_KEY sudah diset di environment variables.",
        },
        { status: 500 }
      );
    }

    // 2. Hitung target tanggal H-2 (2 hari dari sekarang)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const dateStr = targetDate.toISOString().split("T")[0];

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://navika-pi.vercel.app";
    const opportunitiesToNotify = [];

    // 3. Coba cari di Supabase jika sudah dikonfigurasi
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const isSupabaseReady =
      supabaseUrl &&
      supabaseKey &&
      !supabaseUrl.includes("proyek-anda") &&
      !supabaseUrl.includes("your-project-id");

    if (isSupabaseReady) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
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

        if (!error && Array.isArray(deadlines)) {
          for (const item of deadlines) {
            const opp = item.opportunity;
            if (opp && (opp.publication_status === "terbit" || !opp.publication_status)) {
              opportunitiesToNotify.push({
                id: opp.slug || opp.id,
                title: opp.title,
                organization: opp.organization,
                category: opp.primary_category?.name || "Peluang",
              });
            }
          }
        }
      } catch (err) {
        console.warn("Pencarian Supabase gagal, beralih ke katalog:", err);
      }
    }

    // 4. Jika Supabase belum memiliki data atau offline, gunakan data katalog (item dengan demoDays === 2)
    if (opportunitiesToNotify.length === 0 && Array.isArray(staticOpportunities)) {
      const fallbackList = staticOpportunities.filter((item) => Number(item.demoDays) === 2);
      for (const item of fallbackList) {
        opportunitiesToNotify.push({
          id: item.id,
          title: item.title,
          organization: item.organization,
          category: item.category || "Peluang",
        });
      }
    }

    if (opportunitiesToNotify.length === 0) {
      return NextResponse.json({
        success: true,
        message: `Tidak ada peluang dengan deadline H-2 (${dateStr}) saat ini.`,
        date: dateStr,
        totalSent: 0,
      });
    }

    // 5. Kirim Push Notification & Email untuk tiap peluang yang deadline-nya H-2
    let sentCount = 0;
    let emailSentCount = 0;
    const results = [];

    for (const opp of opportunitiesToNotify) {
      // 5a. Push Notification OneSignal
      try {
        const payload = {
          app_id: onesignalAppId,
          included_segments: ["Total Subscriptions", "Subscribed Users"],
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
        results.push({ id: opp.id, pushStatus: response.status, pushData: data });
        if (response.ok) sentCount++;
      } catch (e) {
        results.push({ id: opp.id, pushError: e.message });
      }

      // 5b. Email Notification ke user Supabase (penerima bookmark atau seluruh user terdaftar)
      const isEmailConfigured =
        Boolean(process.env.RESEND_API_KEY) ||
        Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

      if (isEmailConfigured) {
        try {
          const recipientInfo = await getNotificationRecipients({ opportunityId: opp.id });
          if (recipientInfo.emails.length > 0) {
            const emailRes = await sendDeadlineReminderEmail({
              to: recipientInfo.emails,
              opportunity: opp,
              targetDate: dateStr,
              siteUrl,
            });
            if (emailRes.success) {
              emailSentCount += emailRes.totalSent || 1;
            }
            results.push({
              id: opp.id,
              emailStatus: emailRes.success ? 200 : 500,
              recipientsCount: recipientInfo.count,
              recipientsSource: recipientInfo.source,
              emailResult: emailRes,
            });
          }
        } catch (e) {
          console.warn("Gagal mengirim email pengingat:", e.message);
          results.push({ id: opp.id, emailError: e.message });
        }
      }
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
