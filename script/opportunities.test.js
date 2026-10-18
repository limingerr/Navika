import assert from "node:assert/strict";
import test from "node:test";
import { demoDeadline, demoReminders, filterCalendarOpportunities, hasCategory, opportunities } from "./opportunities.js";
import { normalizeGpa } from "./profile.js";
import { resolveTheme } from "./i18n.js";

test("katalog demo punya ID unik dan tautan sumber HTTP(S)", () => {
  assert.equal(opportunities.length, 46);
  assert.equal(new Set(opportunities.map((item) => item.id)).size, opportunities.length);
  assert.ok(opportunities.every((item) => /^https?:\/\//.test(item.sourceUrl)));
  assert.ok(opportunities.every((item) => item.requirements.length === item.requirementsEn.length));
});

test("tanggal demo dipakai konsisten relatif terhadap hari lokal", () => {
  const base = new Date(2026, 9, 17, 23, 30);
  assert.deepEqual(demoDeadline(3, base), new Date(2026, 9, 20));
});

test("IPK menerima koma atau titik dan menolak nilai di luar batas", () => {
  assert.equal(normalizeGpa("3,86"), "3.86");
  assert.equal(normalizeGpa("4.00"), "4.00");
  assert.equal(normalizeGpa("4.01"), null);
  assert.equal(normalizeGpa("3.999"), null);
});

test("kategori ganda, rekomendasi, dan pengingat mengikuti katalog", () => {
  const saved = ["vinix7", "djarum"];
  assert.equal(filterCalendarOpportunities("Semua", saved).length, opportunities.length);
  assert.equal(filterCalendarOpportunities("Rekomendasi", saved).length, opportunities.filter((item) => item.recommended).length);
  assert.deepEqual(filterCalendarOpportunities("Bootcamp", saved).filter((item) => ["dts", "ppm-training"].includes(item.id)).map((item) => item.id), ["dts", "ppm-training"]);
  assert.deepEqual(filterCalendarOpportunities("Beasiswa", saved).filter((item) => ["dts", "ppm-training"].includes(item.id)).map((item) => item.id), ["dts", "ppm-training"]);
  assert.ok(hasCategory(opportunities.find((item) => item.id === "dts"), "Bootcamp"));
  assert.deepEqual(filterCalendarOpportunities("Disimpan", saved).map((item) => item.id), ["djarum", "vinix7"]);
  assert.deepEqual(demoReminders(saved).map((item) => item.id), ["vinix7"]);
});

test("tema sistem mengikuti perangkat dan pilihan manual mengabaikannya", () => {
  assert.equal(resolveTheme("system", true), "dark");
  assert.equal(resolveTheme("system", false), "light");
  assert.equal(resolveTheme("light", true), "light");
});
