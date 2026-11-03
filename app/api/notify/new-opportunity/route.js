import { NextResponse } from "next/server";
import { sendNewOpportunityEmail } from "@/script/email-service";
import { getNotificationRecipients, getPushUserIds } from "@/lib/supabase/admin";
import { isAuthorizedAdmin } from "@/lib/supabase/require-admin";
import { sendPushToUsers } from "@/script/push-service";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function broadcastNewOpportunity({ title, organization, category, field, slug, id }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://navika-pi.vercel.app";
  const opportunitySlug = slug || id || "";
  const opportunityPath = opportunitySlug ? `/peluang/${encodeURIComponent(opportunitySlug)}` : "/peluang";
  const categoryName = category || "Peluang";
  const orgName = organization || "Mitra NAVIKA";

  let pushResult;
  try {
    const userIds = await getPushUserIds();
    pushResult = await sendPushToUsers({
      userIds,
      headings: {
          id: `📢 Info Terbaru: ${title.trim()}`,
          en: `📢 New Opportunity: ${title.trim()}`,
      },
      contents: {
          id: `Telah dibuka ${categoryName} dari ${orgName}. Cek info lengkap dan persyaratannya sekarang di Navika!`,
          en: `New ${categoryName} from ${orgName} is now open. Check eligibility and requirements on Navika!`,
      },
      url: `${siteUrl}${opportunityPath}`,
    });
  } catch (error) {
    pushResult = { sent: false, count: 0, error: error.message };
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
    push: { ...pushResult, id: pushResult.ids?.[0] || null },
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
