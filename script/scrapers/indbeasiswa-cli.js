/**
 * CLI Runner untuk Scraper Beasiswa Indbeasiswa.com
 * Jalankan dengan: node script/scrapers/indbeasiswa-cli.js
 */

import { scrapeIndbeasiswa } from "./indbeasiswa.js";

async function main() {
  console.log("====================================================");
  console.log("NAVIKA - Menjalankan Scraper Beasiswa (Indbeasiswa)");
  console.log("====================================================");

  try {
    const items = await scrapeIndbeasiswa({ limit: 5 });
    console.log(`\nBerhasil menarik ${items.length} beasiswa terbaru:\n`);

    items.forEach((item, idx) => {
      console.log(`${idx + 1}. [${item.category}] ${item.title}`);
      console.log(`   Penyelenggara : ${item.organization}`);
      console.log(`   Sisa Hari     : ${item.demoDays} hari (Batas Waktu)`);
      console.log(`   Sumber        : ${item.sourceUrl}`);
      console.log("----------------------------------------------------");
    });

    console.log("\nProses selesai dengan sukses.");
  } catch (err) {
    console.error("Gagal menjalankan scraper:", err.message);
    process.exit(1);
  }
}

main();
