import { getSupabaseAdmin } from "../lib/supabase/admin.js";
import { categories, opportunities } from "./opportunities.js";

async function seedDatabase() {
  const admin = getSupabaseAdmin();
  if (!admin) {
    console.error("Gagal menginisialisasi Supabase Admin Client. Pastikan .env.local terisi.");
    process.exit(1);
  }

  console.log("=== 1. SEED KATEGORI ===");
  // Filter out "Semua"
  const catNames = categories.filter((c) => c !== "Semua");
  const categoryMap = new Map();

  for (const name of catNames) {
    const { data: existing } = await admin
      .from("categories")
      .select("id, name")
      .ilike("name", name)
      .maybeSingle();

    if (existing) {
      categoryMap.set(name.toLowerCase(), existing.id);
      console.log(`[Kategori Ada] ${name} (${existing.id})`);
    } else {
      const { data: created, error } = await admin
        .from("categories")
        .insert({ name })
        .select("id, name")
        .single();

      if (error) {
        console.error(`Gagal membuat kategori ${name}:`, error.message);
      } else {
        categoryMap.set(name.toLowerCase(), created.id);
        console.log(`[Kategori Baru Dibuat] ${name} (${created.id})`);
      }
    }
  }

  console.log("\n=== 2. SEED 46 PELUANG & DEADLINES ===");
  let oppSuccessCount = 0;
  let deadlineSuccessCount = 0;

  for (const opp of opportunities) {
    const catNameLower = (opp.category || "Beasiswa").toLowerCase();
    let catId = categoryMap.get(catNameLower);

    // Fallback jika tidak cocok persis
    if (!catId) {
      catId = categoryMap.get("beasiswa") || Array.from(categoryMap.values())[0];
    }

    const slug = opp.id;
    const pubStatus = "terbit";

    const { data: savedOpp, error: oppError } = await admin
      .from("opportunities")
      .upsert(
        {
          slug,
          title: opp.title,
          organization: opp.organization,
          primary_category_id: catId,
          field: opp.field || "Umum",
          source_url: opp.sourceUrl || "https://navika.id",
          summary: opp.summary || "",
          summary_en: opp.summaryEn || opp.summary || "",
          requirements: opp.requirements || [],
          requirements_en: opp.requirementsEn || [],
          benefits: opp.benefits || [],
          benefits_en: opp.benefitsEn || [],
          publication_status: pubStatus,
          recommended: Boolean(opp.recommended),
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (oppError) {
      console.error(`Gagal menyimpan peluang ${opp.title}:`, oppError.message);
      continue;
    }

    oppSuccessCount++;

    // Hitung tanggal deadline
    const days = Number(opp.demoDays) || 10;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const localDateStr = targetDate.toISOString().split("T")[0];

    const { error: dlError } = await admin.from("deadlines").upsert(
      {
        opportunity_id: savedOpp.id,
        local_date: localDateStr,
        precision: "tanggal",
      },
      { onConflict: "opportunity_id" }
    );

    if (!dlError) {
      deadlineSuccessCount++;
    }

    // Eligibility rules
    await admin.from("eligibility_rules").upsert(
      {
        opportunity_id: savedOpp.id,
        allowed_majors: opp.targetMajors || ["Semua Jurusan"],
        other_requirements: opp.summary || "",
      },
      { onConflict: "opportunity_id" }
    );
  }

  console.log(`\nSelesai!`);
  console.log(`- Peluang tersimpan: ${oppSuccessCount} / ${opportunities.length}`);
  console.log(`- Deadlines tersimpan: ${deadlineSuccessCount} / ${opportunities.length}`);
}

seedDatabase().catch(console.error);
