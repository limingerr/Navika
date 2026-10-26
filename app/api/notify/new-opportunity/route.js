import { NextResponse } from "next/server";
import { sendNewOpportunityEmail } from "@/script/email-service";
import { getNotificationRecipients } from "@/lib/supabase/admin";

export async function POST(request) {
  try {
    const onesignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const onesignalRestKey = process.env.ONESIGNAL_REST_API_KEY;

    const body = await request.json().catch(() => ({}));
    const { title, organization, category, field, slug, id } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Judul peluang wajib disertakan." },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://navika-pi.vercel.app";
    const opportunitySlug = slug || id || "";
    const categoryName = category || "Peluang";
    const orgName = organization || "Mitra NAVIKA";

    let pushSuccess = false;
    let pushData = null;

    // 1. Kirim Push Notification via OneSignal jika key tersedia
    if (onesignalAppId && onesignalRestKey) {
      try {
        const payload = {
          app_id: onesignalAppId,
          included_segments: ["Total Subscriptions", "Subscribed Users"],
          headings: {
            id: `📢 Info Terbaru: ${title.trim()}`,
            en: `📢 New Opportunity: ${title.trim()}`,
          },
          contents: {
            id: `Telah dibuka ${categoryName} dari ${orgName}. Cek info lengkap dan persyaratannya sekarang di Navika!`,
            en: `New ${categoryName} from ${orgName} is now open. Check eligibility and requirements on Navika!`,
          },
          url: `${siteUrl}/peluang/${opportunitySlug}`,
        };

        const response = await fetch("https://api.onesignal.com/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Key ${onesignalRestKey}`,
          },
          body: JSON.stringify(payload),
        });

        pushData = await response.json();
        pushSuccess = response.ok;
      } catch (err) {
        console.warn("Gagal mengirim OneSignal push:", err.message);
      }
    }

    // 2. Ambil seluruh email pengguna terdaftar dari Supabase (atau fallback jika belum disetel)
    let emailResult = null;
    let recipientInfo = { emails: [], source: "none", count: 0 };

    if (process.env.RESEND_API_KEY) {
      recipientInfo = await getNotificationRecipients();

      if (recipientInfo.emails.length > 0) {
        try {
          emailResult = await sendNewOpportunityEmail({
            to: recipientInfo.emails,
            opportunity: {
              id: opportunitySlug,
              title: title.trim(),
              organization: orgName,
              category: categoryName,
              field: field || "Semua Jurusan",
            },
            siteUrl,
          });
        } catch (err) {
          console.warn("Gagal mengirim notifikasi email massal:", err.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Pemberitahuan peluang baru "${title}" berhasil diproses.`,
      push: {
        sent: pushSuccess,
        data: pushData,
      },
      email: {
        sent: Boolean(emailResult?.success),
        recipientsSource: recipientInfo.source,
        totalRecipients: recipientInfo.count,
        totalSent: emailResult?.totalSent || (emailResult?.success ? 1 : 0),
        result: emailResult,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
