import test from "node:test";
import assert from "node:assert/strict";
import { adminEmailForIdentifier } from "./admin-identity.js";

test("kode admin dipetakan ke email akun Supabase", () => {
  assert.equal(adminEmailForIdentifier(" nav-sec-9842-x7 "), "navika01112026@gmail.com");
});

test("pengenal lain tidak dapat memakai jalur kode admin", () => {
  assert.equal(adminEmailForIdentifier("mahasiswa@example.com"), null);
});
