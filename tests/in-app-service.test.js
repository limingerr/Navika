import assert from "node:assert/strict";
import test from "node:test";
import { getDeadlineRecipientIds, getStudentIds, storeNotifications } from "../src/services/in-app-service.js";

test("pengingat web hanya untuk mahasiswa dengan bookmark dan pengingat aktif", async () => {
  const admin = { from(table) { return { select() {
    const range = () => Promise.resolve({ data: (table === "profiles"
      ? ["mahasiswa-1", "mahasiswa-2", "mahasiswa-3", "pengelola-1"]
      : []).map((user_id) => ({ user_id })), error: null });
    return { range, eq(column, value) { return { range() {
      const users = table === "saved_opportunities" ? ["mahasiswa-1", "mahasiswa-2"]
        : table === "profiles" && column === "deadline_alerts" && value === true ? ["mahasiswa-1", "mahasiswa-3"]
          : table === "user_roles" && column === "role" && value === "pengelola" ? ["pengelola-1"]
          : [];
      return Promise.resolve({ data: users.map((user_id) => ({ user_id })), error: null });
    } }; } };
  } }; } };
  assert.deepEqual(await getDeadlineRecipientIds("peluang-1", admin), ["mahasiswa-1"]);
  assert.deepEqual(await getStudentIds(admin), ["mahasiswa-1", "mahasiswa-2", "mahasiswa-3"]);
});

test("penyimpanan notifikasi membuat satu baris per mahasiswa", async () => {
  let rows;
  const admin = { from() { return { insert(value) { rows = value; return Promise.resolve({ error: null }); } }; } };
  const count = await storeNotifications({ userIds: ["mahasiswa-1", "mahasiswa-1", "mahasiswa-2"], kind: "deadline", title: "Deadline H-1", body: "Besok ditutup", href: "/peluang/satu", admin });
  assert.equal(count, 2);
  assert.deepEqual(rows.map((row) => row.user_id), ["mahasiswa-1", "mahasiswa-2"]);
});
