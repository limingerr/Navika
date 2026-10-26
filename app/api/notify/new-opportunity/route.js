import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const onesignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const onesignalRestKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!onesignalAppId || !onesignalRestKey) {
      return NextResponse.json(
        {
          error: "Konfigurasi OneSignal belum lengkap di server.",
          detail: "Pastikan NEXT_PUBLIC_ONESIGNAL_APP_ID dan ONESIGNAL_REST_API_KEY sudah diset di environment variables.",
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { title, organization, category, slug, id } = body;

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

    const payload = {
      app_id: onesignalAppId,
      included_segments: ["Subscribed Users"],
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

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          status: response.status,
          error: data.errors || "Gagal mengirim notifikasi OneSignal.",
          data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Notifikasi peluang baru "${title}" berhasil dikirim ke seluruh pengguna.`,
      recipientCount: data.recipients || 0,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
