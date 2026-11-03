import { NextResponse } from "next/server";
import { sendNewOpportunityEmail } from "@/script/email-service";
import { getNotificationRecipients } from "@/lib/supabase/admin";
import { isAuthorizedAdmin } from "@/lib/supabase/require-admin";
import { getStudentIds, storeNotifications } from "@/script/in-app-service";
import { sendPushToUsers } from "@/script/push-service";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function broadcastNewOpportunity({ title, organization, category, field, slug, id }) {
  const onesignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const onesignalRestKey = process.env.ONESIGNAL_REST_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://navika-pi.vercel.app";
  const opportunitySlug = slug || id || "";
  const opportunityPath = opportunitySlug ? `/peluang/${encodeURIComponent(opportunitySlug)}` : "/peluang";
  const categoryName = category || "Peluang";
  const orgName = organization || "Mitra NAVIKA";
  const studentIds = await getStudentIds();
  if (!studentIds.length) console.warn("Siaran peluang baru: tidak ada profil mahasiswa penerima notifikasi web.");
  let webCount = 0;
  let webError = null;
  try {
    webCount = await storeNotifications({
      userIds: studentIds, kind: "new_opportunity", title: `Peluang baru: ${title.trim()}`,
      body: `${categoryName} dari ${orgName} sudah dibuka.`, href: opportunityPath,
    });
  } catch (error) {
    webError = `Notifikasi web gagal disimpan: ${error.message}`;
    console.warn(webError);
  }

  let pushSuccess = false;
  let pushData = null;
  let pushError = null;

  // 1. Kirim Web Push Notification via OneSignal
  if (onesignalAppId && onesignalRestKey) {
    try {
      pushData = await sendPushToUsers({ userIds: studentIds,
        headings: { id: `Info Terbaru: ${title.trim()}`, en: `New Opportunity: ${title.trim()}` },
        contents: { id: `Telah dibuka ${categoryName} dari ${orgName}.`, en: `New ${categoryName} from ${orgName} is open.` },
        url: `${siteUrl}${opportunityPath}` });
      pushSuccess = pushData.sent;
    } catch (err) {
      console.warn("Gagal mengirim OneSignal push:", err.message);
      pushError = "Gagal menghubungi OneSignal.";
    }
  }

  // 2. Kirim Email Notifikasi ke seluruh pengguna mahasiswa terdaftar di Supabase
  let emailResult = null;
  let recipientInfo = { emails: [], source: "none", count: 0 };

  const isEmailConfigured =
    Boolean(process.env.RESEND_API_KEY) ||
    Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

  if (isEmailConfigured) {
    try {
      recipientInfo = await getNotificationRecipients();
      if (recipientInfo.emails.length > 0) {
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
      }
    } catch (err) {
      console.warn("Gagal memilih penerima atau mengirim email notifikasi:", err.message);
      emailResult = { success: false, error: "Gagal membaca penerima atau mengirim email." };
    }
  }

  return {
    web: { stored: webCount, error: webError },
    push: {
      sent: pushSuccess,
      count: pushData?.count || 0,
      recipients: pushData?.recipients || 0,
      error: pushData?.error || pushError || (pushSuccess ? null : "OneSignal belum dikonfigurasi."),
    },
    email: {
      sent: Boolean(emailResult?.success),
      recipientsSource: recipientInfo.source,
      totalRecipients: recipientInfo.count,
      totalSent: emailResult?.totalSent || 0,
      failedCount: emailResult?.failedRecipients?.length || 0,
      provider: emailResult?.provider,
      error:
        emailResult?.error ||
        (!isEmailConfigured
          ? "EMAIL_USER & EMAIL_PASS belum disetel"
          : recipientInfo.count === 0
          ? recipientInfo.source === "none" ? "Database penerima email belum dikonfigurasi." : "Tidak ada mahasiswa yang mengaktifkan pemberitahuan email."
          : undefined),
      ids: emailResult?.ids || (emailResult?.id ? [emailResult.id] : []),
    },
  };
}

export async function POST(request) {
  if (!await isAuthorizedAdmin(request)) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  try {
    const body = await request.json().catch(() => ({}));
    const { title, organization, category, field, slug, id } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Judul peluang wajib disertakan." },
        { status: 400 }
      );
    }

    const result = await broadcastNewOpportunity({ title, organization, category, field, slug, id });

    return NextResponse.json({
      success: true,
      message: `Pemberitahuan peluang baru "${title}" berhasil diproses.`,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
