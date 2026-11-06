import test from "node:test";
import assert from "node:assert/strict";
import { resolveAccount, isAllowedRegistrationEmail } from "../src/lib/account-state.js";

test("sesi mahasiswa mengganti profil admin yang tersimpan", () => {
  const account = resolveAccount({ id: "student-1", email: "siswa@example.com", user_metadata: { name: "Siswa" } }, "mahasiswa", null);
  assert.equal(account.isAdmin, false);
  assert.equal(account.profile.name, "Siswa");
  assert.equal(account.profile.email, "siswa@example.com");
});

test("hanya peran pengelola yang menjadi admin", () => {
  assert.equal(resolveAccount({ id: "admin-1", email: "a@example.com" }, "pengelola", null).isAdmin, true);
  assert.equal(resolveAccount({ id: "student-1", email: "admin@example.com" }, null, null).isAdmin, false);
});

test("isAllowedRegistrationEmail hanya mengizinkan @gmail.com dan .ac.id", () => {
  assert.equal(isAllowedRegistrationEmail("mahasiswa@gmail.com"), true);
  assert.equal(isAllowedRegistrationEmail("MAHASISWA@GMAIL.COM"), true);
  assert.equal(isAllowedRegistrationEmail("mhs+test@gmail.com"), true);
  assert.equal(isAllowedRegistrationEmail("mhs@ui.ac.id"), true);
  assert.equal(isAllowedRegistrationEmail("student@itb.ac.id"), true);
  assert.equal(isAllowedRegistrationEmail("user@student.ugm.ac.id"), true);

  // Menolak temporary email & domain publik lainnya
  assert.equal(isAllowedRegistrationEmail("user@tempmail.com"), false);
  assert.equal(isAllowedRegistrationEmail("user@10minutemail.com"), false);
  assert.equal(isAllowedRegistrationEmail("user@yahoo.com"), false);
  assert.equal(isAllowedRegistrationEmail("user@fakegmail.com"), false);
  assert.equal(isAllowedRegistrationEmail("user@fake-ac.id"), false);
  assert.equal(isAllowedRegistrationEmail(""), false);
  assert.equal(isAllowedRegistrationEmail(null), false);
});
