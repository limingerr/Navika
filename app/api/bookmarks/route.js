import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ success: true, saved: [] });
    }

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      return NextResponse.json({ success: true, saved: [] });
    }

    const { data: savedRows, error } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id, opportunity:opportunities(slug, id)")
      .eq("user_id", authData.user.id);

    if (error || !savedRows) {
      return NextResponse.json({ success: true, saved: [] });
    }

    const savedSlugs = savedRows.map(
      (item) =>
        (Array.isArray(item.opportunity) ? item.opportunity[0]?.slug : item.opportunity?.slug) ||
        item.opportunity_id
    );

    return NextResponse.json({ success: true, saved: savedSlugs });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { opportunityId, isSaved } = body;

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: "ID peluang wajib diisi." },
        { status: 400 }
      );
    }

    const cleanKey = String(opportunityId).trim();
    const isUuid = UUID_REGEX.test(cleanKey);

    // Ambil sesi user dari server cookies
    const supabase = await createClient();
    let user = null;
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    }

    if (!user) {
      return NextResponse.json({
        success: true,
        savedInDb: false,
        message: "Pengguna belum login ke akun Supabase. Peluang tersimpan di peramban lokal.",
      });
    }

    // Gunakan admin service role client atau user client untuk mutasi
    const admin = getSupabaseAdmin() || supabase;

    // Cari opportunity di database berdasarkan UUID atau Slug
    let query = admin.from("opportunities").select("id, slug");
    if (isUuid) {
      query = query.eq("id", cleanKey);
    } else {
      query = query.eq("slug", cleanKey);
    }

    const { data: opp, error: oppErr } = await query.maybeSingle();

    if (oppErr || !opp) {
      return NextResponse.json(
        {
          success: false,
          error: `Peluang "${cleanKey}" tidak ditemukan di database.`,
        },
        { status: 404 }
      );
    }

    if (isSaved) {
      // Hapus bookmark
      await admin
        .from("saved_opportunities")
        .delete()
        .eq("user_id", user.id)
        .eq("opportunity_id", opp.id);

      return NextResponse.json({
        success: true,
        savedInDb: false,
        action: "removed",
        opportunityId: cleanKey,
      });
    } else {
      // Simpan bookmark
      await admin.from("saved_opportunities").upsert(
        {
          user_id: user.id,
          opportunity_id: opp.id,
          application_status: "tertarik",
          saved_at: new Date().toISOString(),
          status_updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,opportunity_id" }
      );

      return NextResponse.json({
        success: true,
        savedInDb: true,
        action: "saved",
        opportunityId: cleanKey,
      });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
