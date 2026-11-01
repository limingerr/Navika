import test from "node:test";
import assert from "node:assert/strict";
import { resolveAccount } from "./account-state.js";

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
