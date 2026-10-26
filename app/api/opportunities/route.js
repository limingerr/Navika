import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request) {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Supabase Admin belum terkonfigurasi." },
        { status: 500 }
      );
    }

    const opp = await request.json().catch(() => ({}));
    const {
      title,
      organization,
      category,
      field,
      sourceUrl,
      demoDays,
      status,
      recommended,
      summary,
      summaryEn,
      requirements,
      requirementsEn,
      benefits,
      benefitsEn,
      targetMajors,
    } = opp;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Judul peluang wajib disertakan." },
        { status: 400 }
      );
    }

    // 1. Temukan atau buat kategori
    const catName = category || "Beasiswa";
    let categoryId = null;

    const { data: existingCat } = await admin
      .from("categories")
      .select("id")
      .ilike("name", catName)
      .maybeSingle();

    if (existingCat?.id) {
      categoryId = existingCat.id;
    } else {
      const { data: newCat } = await admin
        .from("categories")
        .insert({ name: catName })
        .select("id")
        .maybeSingle();
      categoryId = newCat?.id;
    }

    if (!categoryId) {
      const { data: fallbackCat } = await admin
        .from("categories")
        .select("id")
        .limit(1)
        .maybeSingle();
      categoryId = fallbackCat?.id;
    }

    const slug = opp.id || opp.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const pubStatus =
      status === "Draft" || status === "draf"
        ? "draf"
        : status === "Diarsipkan" || status === "diarsipkan"
        ? "diarsipkan"
        : status === "Ditutup" || status === "ditutup"
        ? "ditutup"
        : "terbit";

    // 2. Simpan atau perbarui peluang
    const { data: savedOpp, error: oppError } = await admin
      .from("opportunities")
      .upsert(
        {
          slug,
          title: title.trim(),
          organization: (organization || "Mitra NAVIKA").trim(),
          primary_category_id: categoryId,
          field: field || "Umum",
          source_url: sourceUrl || "https://navika.id",
          summary: summary || "",
          summary_en: summaryEn || summary || "",
          requirements: Array.isArray(requirements) ? requirements : [],
          requirements_en: Array.isArray(requirementsEn) ? requirementsEn : [],
          benefits: Array.isArray(benefits) ? benefits : [],
          benefits_en: Array.isArray(benefitsEn) ? benefitsEn : [],
          publication_status: pubStatus,
          recommended: Boolean(recommended),
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )
      .select("id, slug, title")
      .single();

    if (oppError || !savedOpp) {
      return NextResponse.json(
        { error: oppError?.message || "Gagal menyimpan peluang." },
        { status: 500 }
      );
    }

    // 3. Simpan deadline
    const days = Number(demoDays) || 10;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const localDateStr = targetDate.toISOString().split("T")[0];

    await admin.from("deadlines").upsert(
      {
        opportunity_id: savedOpp.id,
        local_date: localDateStr,
        precision: "tanggal",
      },
      { onConflict: "opportunity_id" }
    );

    // 4. Simpan aturan kelayakan
    await admin.from("eligibility_rules").upsert(
      {
        opportunity_id: savedOpp.id,
        allowed_majors: targetMajors || ["Semua Jurusan"],
        other_requirements: summary || "",
      },
      { onConflict: "opportunity_id" }
    );

    return NextResponse.json({
      success: true,
      message: `Peluang "${title}" berhasil disimpan di database.`,
      opportunity: savedOpp,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Supabase Admin belum terkonfigurasi." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idOrSlug = searchParams.get("id");

    if (!idOrSlug) {
      return NextResponse.json({ error: "ID peluang diperlukan." }, { status: 400 });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const query = admin
      .from("opportunities")
      .update({ publication_status: "diarsipkan", updated_at: new Date().toISOString() });

    if (isUuid) {
      query.eq("id", idOrSlug);
    } else {
      query.eq("slug", idOrSlug);
    }

    const { error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Peluang ${idOrSlug} berhasil diarsipkan.`,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
