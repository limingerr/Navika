/**
 * NAVIKA - Scraper Beasiswa Resmi dari Indbeasiswa.com
 * Mengambil informasi beasiswa terbaru melalui RSS feed dan halaman detail.
 */

import { getSupabaseAdmin } from "../../lib/supabase/admin.js";

function decodeEntities(str) {
  if (!str) return "";
  return str
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, "");
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function parseDateIndo(dateStr) {
  if (!dateStr) return null;
  const clean = dateStr.trim();

  // Format DD/MM/YYYY atau DD-MM-YYYY
  const slashMatch = clean.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/);
  if (slashMatch) {
    const d = parseInt(slashMatch[1], 10);
    const m = parseInt(slashMatch[2], 10) - 1;
    const y = parseInt(slashMatch[3], 10);
    return new Date(y, m, d);
  }

  // Format DD NamaBulan YYYY
  const bulanMap = {
    januari: 0, jan: 0,
    februari: 1, feb: 1,
    maret: 2, mar: 2,
    april: 3, apr: 3,
    mei: 4, may: 4,
    juni: 5, jun: 5,
    juli: 6, jul: 6,
    agustus: 7, agu: 7, ags: 7, aug: 7,
    september: 8, sep: 8, sept: 8,
    oktober: 9, okt: 9, oct: 9,
    november: 10, nov: 10,
    desember: 11, des: 11, dec: 11,
  };
  const textMatch = clean.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
  if (textMatch) {
    const d = parseInt(textMatch[1], 10);
    const bName = textMatch[2].toLowerCase();
    const y = parseInt(textMatch[3], 10);
    if (bulanMap[bName] !== undefined) {
      return new Date(y, bulanMap[bName], d);
    }
  }

  return null;
}

/**
 * Mengambil beasiswa terbaru dari feed Indbeasiswa.com
 * @param {Object} options
 * @param {number} options.limit Jumlah maksimal artikel yang diproses (default 10)
 */
export async function scrapeIndbeasiswa({ limit = 10 } = {}) {
  const feedUrl = "https://indbeasiswa.com/feed";
  const res = await fetch(feedUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) NAVIKA-Bot/1.0",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
  });

  if (!res.ok) {
    throw new Error(`Gagal mengambil RSS feed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  const results = [];

  const maxItems = Math.min(limit, itemMatches.length);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < maxItems; i++) {
    const rawItem = itemMatches[i][1];
    const rawTitle = (rawItem.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
    const link = (rawItem.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || "";
    const description = (rawItem.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || [])[1] || "";

    const title = decodeEntities(rawTitle.trim());
    if (!title || !link) continue;

    let organization = "Penyelenggara Beasiswa";
    let level = "S1, D3, D4";
    let deadlineDate = null;
    let rawDeadline = null;

    try {
      const artRes = await fetch(link, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) NAVIKA-Bot/1.0",
        },
      });

      if (artRes.ok) {
        const html = await artRes.text();

        // 1. Ekstraksi Deadline
        const dlMatch = html.match(/class=[\"\']indb-deadline-badge[\"\'][\s\S]*?<strong>\s*([\s\S]*?)\s*<\/strong>/i);
        if (dlMatch) {
          rawDeadline = dlMatch[1].trim();
          deadlineDate = parseDateIndo(rawDeadline);
        }

        // 2. Ekstraksi Penyelenggara
        const orgMatch = html.match(/Penyelenggara\s*<\/span>\s*<strong[^>]*>\s*([\s\S]*?)\s*<\/strong>/i);
        if (orgMatch) {
          organization = decodeEntities(orgMatch[1].trim());
        }

        // 3. Ekstraksi Jenjang
        const lvlMatch = html.match(/Jenjang\s*<\/span>\s*<strong[^>]*>\s*([\s\S]*?)\s*<\/strong>/i);
        if (lvlMatch) {
          level = decodeEntities(lvlMatch[1].trim());
        }
      }
    } catch (err) {
      console.warn(`Peringatan saat mengambil artikel ${link}:`, err.message);
    }

    // Hitung sisa hari dari deadline
    let demoDays = 21; // fallback default
    if (deadlineDate instanceof Date && !isNaN(deadlineDate.getTime())) {
      const diffTime = deadlineDate.getTime() - today.getTime();
      demoDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Buat slug unik
    const urlSlug = link.replace(/\/+$/, "").split("/").pop();
    const slug = `indb-${urlSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;

    const cleanDesc = stripHtml(decodeEntities(description));
    const summary = cleanDesc.length > 200 ? `${cleanDesc.slice(0, 200)}...` : cleanDesc;

    results.push({
      id: slug,
      slug,
      title,
      organization,
      category: "Beasiswa",
      field: "Semua Jurusan",
      level,
      sourceUrl: link,
      demoDays,
      status: "Terbit",
      recommended: false,
      summary: summary || `Informasi beasiswa ${title} diselenggarakan oleh ${organization}.`,
      summaryEn: `Scholarship opportunity ${title} organized by ${organization}.`,
      requirements: [
        `Terbuka untuk jenjang: ${level}`,
        "Mengisi formulir pendaftaran melalui tautan resmi",
        "Melengkapi berkas administrasi dan dokumen pendukung",
      ],
      requirementsEn: [
        `Open for education level: ${level}`,
        "Complete online application via official portal",
        "Prepare required administrative documents",
      ],
      benefits: [
        "Bantuan biaya pendidikan / perkuliahan",
        "Sertifikat & pengalaman jaringan beasiswa",
      ],
      benefitsEn: [
        "Educational allowance / tuition assistance",
        "Certificate & scholarship network experience",
      ],
      targetMajors: ["Semua Jurusan"],
    });
  }

  return results;
}

/**
 * Menyimpan hasil scraping langsung ke database Supabase
 */
export async function saveScrapedToSupabase(opportunities) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return {
      success: false,
      error: "Supabase Admin belum terkonfigurasi pada environment.",
    };
  }

  let insertedCount = 0;
  let updatedCount = 0;
  const errors = [];

  // Ambil atau buat kategori "Beasiswa"
  let categoryId = null;
  const { data: cat } = await admin
    .from("categories")
    .select("id")
    .ilike("name", "Beasiswa")
    .maybeSingle();

  if (cat?.id) {
    categoryId = cat.id;
  } else {
    const { data: newCat } = await admin
      .from("categories")
      .insert({ name: "Beasiswa" })
      .select("id")
      .maybeSingle();
    categoryId = newCat?.id;
  }

  for (const opp of opportunities) {
    try {
      const { data: savedOpp, error: oppError } = await admin
        .from("opportunities")
        .upsert(
          {
            slug: opp.slug,
            title: opp.title,
            organization: opp.organization,
            primary_category_id: categoryId,
            field: opp.field,
            source_url: opp.sourceUrl,
            summary: opp.summary,
            summary_en: opp.summaryEn,
            requirements: opp.requirements,
            requirements_en: opp.requirementsEn,
            benefits: opp.benefits,
            benefits_en: opp.benefitsEn,
            publication_status: "terbit",
            recommended: opp.recommended,
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "slug" }
        )
        .select("id, slug")
        .single();

      if (oppError || !savedOpp) {
        errors.push({ slug: opp.slug, error: oppError?.message });
        continue;
      }

      // Simpan deadline
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + opp.demoDays);
      const localDateStr = targetDate.toISOString().split("T")[0];

      await admin.from("deadlines").upsert(
        {
          opportunity_id: savedOpp.id,
          local_date: localDateStr,
          precision: "tanggal",
        },
        { onConflict: "opportunity_id" }
      );

      // Simpan aturan kelayakan
      await admin.from("eligibility_rules").upsert(
        {
          opportunity_id: savedOpp.id,
          allowed_majors: opp.targetMajors,
          other_requirements: opp.summary,
        },
        { onConflict: "opportunity_id" }
      );

      insertedCount++;
    } catch (err) {
      errors.push({ slug: opp.slug, error: err.message });
    }
  }

  return {
    success: true,
    total: opportunities.length,
    processed: insertedCount,
    errors,
  };
}
