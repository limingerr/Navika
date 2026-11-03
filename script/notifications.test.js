import assert from "node:assert/strict";
import test from "node:test";
import { sendEmail } from "./email-service.js";
import { getNotificationRecipients } from "../lib/supabase/admin.js";
import { isPushAccepted } from "./notification-status.js";
import { deadlineTarget, jakartaDateAfterDays } from "./notification-targets.js";

test("target H-2 memisahkan UUID bookmark dan slug tautan", () => {
  const target = deadlineTarget({ id: "123e4567-e89b-12d3-a456-426614174000", slug: "djarum", title: "Djarum", organization: "Mitra", primary_category: { name: "Beasiswa" } });
  assert.equal(target.databaseId, "123e4567-e89b-12d3-a456-426614174000");
  assert.equal(target.id, "djarum");
});

test("tanggal H-2 mengikuti hari di Jakarta", () => {
  assert.equal(jakartaDateAfterDays(new Date("2026-11-02T17:30:00Z"), 2), "2026-11-05");
});

test("sendEmail menolak penerima kosong secara aman", async () => {
  const result = await sendEmail({
    to: [],
    subject: "Uji Coba",
    html: "<p>Halo</p>",
  });

  assert.equal(result.success, false);
  assert.ok(result.error.includes("tidak valid") || result.error.includes("RESEND_API_KEY"));
});

test("sendEmail menangani penerima string tunggal atau array", async () => {
  // Tanpa RESEND_API_KEY saat pengujian terisolasi
  const prevKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;

  const resultSingle = await sendEmail({
    to: "mahasiswa@example.com",
    subject: "Uji Coba",
    html: "<p>Halo</p>",
  });
  assert.equal(resultSingle.success, false);
  assert.ok(resultSingle.error.includes("RESEND_API_KEY belum disetel"));

  // Pulihkan key
  if (prevKey) {
    process.env.RESEND_API_KEY = prevKey;
  }
});

test("getNotificationRecipients tidak memakai alamat fallback saat Supabase tidak tersedia", async () => {
  process.env.NOTIFICATION_EMAIL_TO = "test-mahasiswa@example.com";
  const recipients = await getNotificationRecipients();

  assert.equal(recipients.source, "none");
  assert.equal(recipients.count, 0);
  assert.deepEqual(recipients.emails, []);
  delete process.env.NOTIFICATION_EMAIL_TO;
});

test("penerima email hanya akun opt-in dan bookmark peluang", async () => {
  const client = {
    from(table) {
      return { select() { return { eq() {
        return Promise.resolve({ data: table === "profiles"
          ? [{ user_id: "aktif" }, { user_id: "lain" }]
          : [{ user_id: "aktif" }], error: null });
      } }; } };
    },
    auth: { admin: { async listUsers() { return { data: { users: [
      { id: "aktif", email: "Aktif@example.com" },
      { id: "lain", email: "lain@example.com" },
      { id: "mati", email: "mati@example.com" },
    ] }, error: null }; } } },
  };
  assert.deepEqual((await getNotificationRecipients({ client })).emails,
    ["aktif@example.com", "lain@example.com"]);
  const selected = await getNotificationRecipients({ client, opportunityId: "peluang-1" });
  assert.deepEqual(selected.emails, ["aktif@example.com"]);
  assert.equal(selected.optedInCount, 2);
  assert.equal(selected.bookmarkCount, 1);
  assert.equal(selected.eligibleCount, 1);
});

test("kesalahan membaca preferensi menghentikan pemilihan penerima", async () => {
  const client = { from() { return { select() { return { eq() {
    return Promise.resolve({ data: null, error: new Error("database gagal") });
  } }; } }; } };
  await assert.rejects(getNotificationRecipients({ client }), /database gagal/);
});

test("push hanya dihitung ketika OneSignal membuat pesan", () => {
  assert.equal(isPushAccepted({ ok: true }, { id: "pesan-1" }), true);
  assert.equal(isPushAccepted({ ok: true }, { errors: ["no subscribers"] }), false);
  assert.equal(isPushAccepted({ ok: false }, { id: "pesan-1" }), false);
});
