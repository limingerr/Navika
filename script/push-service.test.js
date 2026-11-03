import test from "node:test";
import assert from "node:assert/strict";
import { sendPushToUsers } from "./push-service.js";

test("push memakai ID akun mahasiswa dan kanal push", async () => {
  const originalApp = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const originalKey = process.env.ONESIGNAL_REST_API_KEY;
  const originalFetch = globalThis.fetch;
  process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID = "test-app";
  process.env.ONESIGNAL_REST_API_KEY = "test-key";
  let payload;
  globalThis.fetch = async (_url, options) => {
    payload = JSON.parse(options.body);
    return { ok: true, json: async () => ({ id: "pesan-1", recipients: 1 }) };
  };
  try {
    const result = await sendPushToUsers({ userIds: ["student-1", "student-1"], headings: { id: "Judul" }, contents: { id: "Isi" }, url: "https://navika-pi.vercel.app" });
    assert.deepEqual(payload.include_aliases.external_id, ["student-1"]);
    assert.equal(payload.target_channel, "push");
    assert.equal(payload.chrome_web_icon, "https://navika-pi.vercel.app/favicon.png");
    assert.equal(result.recipients, 1);
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ id: "pesan-kosong", recipients: 0, errors: ["All included players are not subscribed"] }) });
    const empty = await sendPushToUsers({ userIds: ["student-1"], headings: { id: "Judul" }, contents: { id: "Isi" }, url: "https://navika-pi.vercel.app" });
    assert.equal(empty.sent, false);
    assert.match(empty.error, /not subscribed/);
  } finally {
    if (originalApp === undefined) delete process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    else process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID = originalApp;
    if (originalKey === undefined) delete process.env.ONESIGNAL_REST_API_KEY;
    else process.env.ONESIGNAL_REST_API_KEY = originalKey;
    globalThis.fetch = originalFetch;
  }
});
