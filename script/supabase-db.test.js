import assert from "node:assert/strict";
import test from "node:test";
import { getSupabaseAdmin } from "../lib/supabase/admin.js";

test("Supabase memiliki tabel categories terisi", async () => {
  const admin = getSupabaseAdmin();
  if (!admin) return;

  const { data, error } = await admin.from("categories").select("id, name");
  assert.equal(error, null);
  assert.ok(data.length >= 7, "Harus ada minimal 7 kategori");
});

test("Supabase memiliki katalog opportunities dan deadlines terisi", async () => {
  const admin = getSupabaseAdmin();
  if (!admin) return;

  const { count: oppCount, error: oppErr } = await admin
    .from("opportunities")
    .select("*", { count: "exact", head: true });
  assert.equal(oppErr, null);
  assert.ok(oppCount >= 46, "Harus ada minimal 46 peluang");

  const { count: dlCount, error: dlErr } = await admin
    .from("deadlines")
    .select("*", { count: "exact", head: true });
  assert.equal(dlErr, null);
  assert.ok(dlCount >= 46, "Harus ada minimal 46 deadline");
});
