import assert from "node:assert/strict";
import test from "node:test";
import { getDeadlineRecipientIds, storeNotifications } from "./in-app-service.js";

test("pengingat web hanya untuk mahasiswa dengan bookmark dan pengingat aktif", async () => {
  const rows = {
    user_roles: ["mahasiswa-1", "mahasiswa-2", "mahasiswa-3"],
    saved_opportunities: ["mahasiswa-1", "mahasiswa-2"],
    profiles: ["mahasiswa-1", "mahasiswa-3"],
  };
  const admin = { from(table) { return { select() { return { eq() { return { range() {
    return Promise.resolve({ data: rows[table].map((user_id) => ({ user_id })), error: null });
  } }; } }; } }; } };
  assert.deepEqual(await getDeadlineRecipientIds("peluang-1", admin), ["mahasiswa-1"]);
});

test("penyimpanan notifikasi membuat satu baris per mahasiswa", async () => {
  let rows;
  const admin = { from() { return { insert(value) { rows = value; return Promise.resolve({ error: null }); } }; } };
  const count = await storeNotifications({ userIds: ["mahasiswa-1", "mahasiswa-1", "mahasiswa-2"], kind: "deadline", title: "Deadline H-1", body: "Besok ditutup", href: "/peluang/satu", admin });
  assert.equal(count, 2);
  assert.deepEqual(rows.map((row) => row.user_id), ["mahasiswa-1", "mahasiswa-2"]);
});
