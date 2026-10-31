import { NextResponse } from "next/server";
import { scrapeIndbeasiswa, saveScrapedToSupabase } from "@/script/scrapers/indbeasiswa";

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

    return NextResponse.json({
      success: true,
      message: `Berhasil menarik ${scrapedItems.length} beasiswa terbaru dari Indbeasiswa.com.`,
      scrapedCount: scrapedItems.length,
      dbResult,
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
