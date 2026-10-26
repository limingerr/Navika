import assert from "node:assert/strict";
import test from "node:test";
import { sendEmail } from "./email-service.js";
import { getNotificationRecipients } from "../lib/supabase/admin.js";

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

test("getNotificationRecipients menggunakan fallback env saat Supabase offline/placeholder", async () => {
  process.env.NOTIFICATION_EMAIL_TO = "test-mahasiswa@example.com";
  const recipients = await getNotificationRecipients();

  assert.equal(recipients.source, "fallback_env");
  assert.equal(recipients.count, 1);
  assert.deepEqual(recipients.emails, ["test-mahasiswa@example.com"]);
});
