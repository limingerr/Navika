import assert from "node:assert/strict";
import test from "node:test";
import { isProtectedPage, safeRedirectPath } from "./protected-routes.js";

test("halaman pribadi memerlukan sesi, katalog tetap publik", () => {
  for (const path of ["/pengaturan", "/pengaturan/notifikasi", "/profil", "/profil/edit", "/tersimpan", "/dashboard", "/kalender"])
    assert.equal(isProtectedPage(path), true, path);
  for (const path of ["/", "/masuk", "/daftar", "/peluang", "/peluang/contoh", "/pengaturan-lain"])
    assert.equal(isProtectedPage(path), false, path);
});

test("tujuan setelah login hanya halaman pribadi di situs ini", () => {
  assert.equal(safeRedirectPath("/pengaturan/notifikasi?tab=email"), "/pengaturan/notifikasi?tab=email");
  for (const path of ["https://example.com", "//example.com", "/\\example.com", "/masuk", "javascript:alert(1)"])
    assert.equal(safeRedirectPath(path), null, path);
});
