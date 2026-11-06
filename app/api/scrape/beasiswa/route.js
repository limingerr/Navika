import { NextResponse } from "next/server";
import { scrapeIndbeasiswa, saveScrapedToSupabase } from "@/src/services/scrapers/indbeasiswa";
import { broadcastNewOpportunity } from "@/app/api/notify/new-opportunity/route";
import { isAuthorizedAdmin } from "@/src/lib/supabase/require-admin";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!await isAuthorizedAdmin()) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  try {
    const body = await request.json().catch(() => ({}));
    const limit = Number(body.limit) || 10;

    // 1. Eksekusi Scraper
    const scrapedItems = await scrapeIndbeasiswa({ limit });

    if (!Array.isArray(scrapedItems) || scrapedItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada beasiswa yang berhasil ditarik dari feed." },
        { status: 404 }
      );
    }

    // 2. Simpan ke database Supabase
    const dbResult = await saveScrapedToSupabase(scrapedItems);
    if (!dbResult.success || dbResult.processed === 0) {
      return NextResponse.json({ success: false, error: dbResult.error || "Tidak ada beasiswa yang berhasil disimpan.", dbResult }, { status: 500 });
    }

    // 3. Otomatis siarkan notifikasi pop-up & email untuk peluang terbaru yang masuk
    let broadcastResult = null;
    const topItem = scrapedItems.find((item) => !dbResult.errors?.some((failure) => failure.slug === item.slug));
    if (topItem) {
      try {
        broadcastResult = await broadcastNewOpportunity({
          title: topItem.title,
          organization: topItem.organization,
          category: topItem.category,
          field: topItem.field,
          slug: topItem.slug,
        });
      } catch (notifErr) {
        console.warn("Pemberitahuan otomatis dari scraper beasiswa gagal:", notifErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${dbResult.processed} beasiswa diproses; hasil notifikasi tercantum terpisah.`,
      scrapedCount: scrapedItems.length,
      dbResult,
      broadcastResult,
      items: scrapedItems,
    });
  } catch (error) {
    console.error("Kesalahan pada /api/scrape/beasiswa:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menjalankan scraper beasiswa." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST(new Request("http://localhost/api/scrape/beasiswa", { method: "POST" }));
}
