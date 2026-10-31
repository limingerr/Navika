import { NextResponse } from "next/server";
import { scrapeIndbeasiswa, saveScrapedToSupabase } from "@/script/scrapers/indbeasiswa";
import { broadcastNewOpportunity } from "@/app/api/notify/new-opportunity/route";

export async function POST(request) {
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

    // 3. Otomatis siarkan notifikasi pop-up & email untuk peluang terbaru yang masuk
    let broadcastResult = null;
    if (scrapedItems.length > 0) {
      try {
        const topItem = scrapedItems[0];
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
      message: `Berhasil menarik ${scrapedItems.length} beasiswa terbaru dari Indbeasiswa.com dan menyiarkan notifikasi.`,
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
